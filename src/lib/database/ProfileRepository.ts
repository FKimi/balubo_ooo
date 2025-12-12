import { supabase } from "../supabase";
import { generateUserSlug } from "@/utils/slug";
import { logger } from "../logger";

/**
 * プロフィール操作のためのリポジトリクラス
 * キャッシュ、レート制限、タイムアウト機能を含む
 */
export class ProfileRepository {
    // プロフィールキャッシュ（5分間有効）
    private static profileCache = new Map<
        string,
        { data: any; timestamp: number }
    >();
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5分

    // 進行中のリクエストを追跡して重複防止
    private static pendingProfileRequests = new Map<string, Promise<any>>();

    // レート制限用のトラッキング
    private static recentRequests = new Map<string, number[]>();
    private static readonly RATE_LIMIT_WINDOW = 10000; // 10秒
    private static readonly MAX_REQUESTS_PER_WINDOW = 5; // 10秒間に最大5回

    /**
     * プロフィールを取得する
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async getProfile(userId: string, _token?: string) {
        try {
            // 基本的な検証
            if (!userId || typeof userId !== "string") {
                logger.error("ProfileRepository: 無効なuserId", null, { userId });
                return null;
            }

            // キャッシュをチェック
            const cacheKey = `${userId}-${_token ? "auth" : "anon"}`;
            const cached = this.profileCache.get(cacheKey);
            const now = Date.now();

            if (cached && now - cached.timestamp < this.CACHE_DURATION) {
                return cached.data;
            }

            // 進行中のリクエストがある場合は、それを待つ
            const pendingRequest = this.pendingProfileRequests.get(cacheKey);
            if (pendingRequest) {
                return await pendingRequest;
            }

            // レート制限チェック
            const userRequests = this.recentRequests.get(userId) || [];
            const recentRequests = userRequests.filter(
                (time) => now - time < this.RATE_LIMIT_WINDOW,
            );

            if (recentRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
                logger.warn(`ProfileRepository: レート制限に達しました`, { userId });
                // キャッシュがあれば古くても返す
                if (cached) {
                    return cached.data;
                }
                throw new Error("プロフィール取得のレート制限に達しました");
            }

            // リクエスト履歴を更新
            recentRequests.push(now);
            this.recentRequests.set(userId, recentRequests);

            // リクエストを作成してpendingに追加
            const requestPromise = (async () => {
                try {
                    // プロフィール取得にタイムアウトを設定（15秒）
                    const profilePromise = supabase
                        .from("profiles")
                        .select("*")
                        .eq("user_id", userId)
                        .single();

                    const timeoutPromise = new Promise((_, reject) => {
                        setTimeout(
                            () => reject(new Error("プロフィール取得タイムアウト")),
                            15000,
                        );
                    });

                    const { data, error } = (await Promise.race([
                        profilePromise,
                        timeoutPromise,
                    ])) as any;

                    return { data, error };
                } finally {
                    // 完了後に進行中リクエストから削除
                    this.pendingProfileRequests.delete(cacheKey);
                }
            })();

            // 進行中のリクエストとして登録
            this.pendingProfileRequests.set(cacheKey, requestPromise);

            const { data, error } = await requestPromise;

            if (error) {
                if (error.code === "PGRST116") {
                    return null;
                }
                throw error;
            }

            // introductionフィールドをbioにマッピング（フォーム表示用）
            if (data && data.introduction && !data.bio) {
                data.bio = data.introduction;
            }

            // キャッシュに保存
            this.profileCache.set(cacheKey, { data, timestamp: now });

            // キャッシュサイズが大きくなりすぎないよう制限
            if (this.profileCache.size > 50) {
                const oldestKey = Array.from(this.profileCache.keys())[0];
                if (oldestKey) {
                    this.profileCache.delete(oldestKey);
                }
            }

            return data;
        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "プロフィール取得タイムアウト"
            ) {
                logger.error("ProfileRepository: プロフィール取得タイムアウト", null, { userId });
                throw new Error("プロフィールの取得に時間がかかりすぎています");
            }
            logger.error("ProfileRepository: プロフィール取得エラー", error);
            throw error;
        }
    }

    /**
     * プロフィールを保存する（RLS対応強化版）
     * @param userId ユーザーID
     * @param profileData プロフィールデータ
     * @param _token 認証トークン（オプション）
     */
    static async saveProfile(userId: string, profileData: any, _token?: string) {
        try {
            const { createClient } = await import("@supabase/supabase-js");
            const dbClient = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                {
                    global: {
                        headers: _token ? { Authorization: `Bearer ${_token}` } : {},
                    },
                },
            );

            // スラッグの自動生成
            let slug = profileData.slug;
            if (!slug && profileData.displayName) {
                slug = generateUserSlug(profileData.displayName);

                // スラッグの重複チェックと調整
                if (slug) {
                    let finalSlug = slug;
                    let counter = 1;

                    while (true) {
                        const { data: existingProfile } = await dbClient
                            .from("profiles")
                            .select("user_id")
                            .eq("slug", finalSlug)
                            .neq("user_id", userId)
                            .single();

                        if (!existingProfile) {
                            break;
                        }

                        finalSlug = `${slug}-${counter}`;
                        counter++;
                    }

                    slug = finalSlug;
                }
            }

            // フロントエンドのProfileData型をデータベースの形式に変換
            const profileToSave = {
                user_id: userId,
                display_name: profileData.displayName,
                title: profileData.title,
                bio: profileData.bio,
                introduction: profileData.introduction,
                professions: profileData.professions || [],
                skills: profileData.skills || [],
                location: profileData.location,
                website_url: profileData.websiteUrl,
                portfolio_visibility: profileData.portfolioVisibility,
                background_image_url: profileData.backgroundImageUrl,
                avatar_image_url: profileData.avatarImageUrl,
                slug: slug,
                desired_rate: profileData.desiredRate,
                job_change_intention: profileData.jobChangeIntention,
                side_job_intention: profileData.sideJobIntention,
                project_recruitment_status: profileData.projectRecruitmentStatus,
                experience_years: profileData.experienceYears,
                working_hours: profileData.workingHours,
                career: profileData.career || [],
                updated_at: new Date().toISOString(),
            };

            logger.debug("ProfileRepository: 保存用プロフィールデータ", { profileToSave });

            const { data: result, error } = await dbClient
                .from("profiles")
                .upsert(profileToSave, { onConflict: "user_id" })
                .select()
                .single();

            if (error) {
                logger.error("ProfileRepository: Supabaseエラー詳細", null, {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                // RLSエラーの場合は詳細な情報を含めて再スロー
                if ((error as any)?.code === "42501") {
                    const rlsError =
                        new Error(`プロフィール保存でRLSポリシー違反が発生しました。Supabaseダッシュボードで以下を確認してください:
1. profilesテーブルのRLSが有効になっている
2. 認証されたユーザーのINSERT/UPDATEポリシーが設定されている
3. ポリシー条件: auth.uid() = user_id

元のエラー: ${(error as any)?.message || error}`) as any;
                    (rlsError as any).code = (error as any)?.code;
                    (rlsError as any).originalError = error;
                    throw rlsError;
                }
                throw error;
            }

            // キャッシュを更新
            const cacheKey = `${userId}-${_token ? "auth" : "anon"}`;
            this.profileCache.set(cacheKey, { data: result, timestamp: Date.now() });

            return result;
        } catch (error) {
            logger.error("ProfileRepository: プロフィール保存エラー", error);
            throw error;
        }
    }
}
