import { supabase } from "../supabase";
import { processDbArrayResult } from "../api-utils";
import { logger } from "../logger";

/**
 * 作品操作のためのリポジトリクラス
 */
export class WorkRepository {
    /**
     * 作品一覧を取得する（認証対応）
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async getWorks(userId: string, _token?: string) {
        try {
            logger.debug("WorkRepository: 作品一覧取得開始", {
                userId,
                hasToken: !!_token,
            });

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
            if (!supabaseUrl || !serviceKey) {
                throw new Error("Supabaseの環境変数が設定されていません。");
            }

            // 認証されたクライアントを作成
            const { createClient } = await import("@supabase/supabase-js");
            const dbClient = createClient(supabaseUrl, serviceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            });

            if (_token) {
                // 認証トークンがある場合は、セッションを設定
                const {
                    data: { user },
                    error: userError,
                } = await dbClient.auth.getUser(_token);
                if (userError) {
                    logger.error("認証エラー", userError);
                    throw new Error("認証が無効です");
                }
                logger.debug("認証されたユーザー", { userId: user?.id });
            }
            // 1. 作品一覧を取得
            const { data: works, error } = await dbClient
                .from("works")
                .select("*")
                .eq("user_id", userId)
                .order("is_featured", { ascending: false })
                .order("featured_order", { ascending: true })
                .order("created_at", { ascending: false });

            if (error) {
                logger.error("作品取得エラー詳細", error);
            }
            if (!works) return [];

            // 2. 作品IDリストでlikesを集計
            const workIds = works.map((w: any) => w.id);
            const likesCountMap = new Map<string, number>();
            if (workIds.length > 0) {
                const { data: likesRaw, error: likesError } = await dbClient
                    .from("likes")
                    .select("target_id")
                    .eq("target_type", "work")
                    .in("target_id", workIds);
                if (!likesError && likesRaw) {
                    likesRaw.forEach((like: any) => {
                        likesCountMap.set(
                            like.target_id,
                            (likesCountMap.get(like.target_id) || 0) + 1,
                        );
                    });
                }
            }

            // 3. 作品IDリストでコメントを集計
            const commentsCountMap = new Map<string, number>();
            if (workIds.length > 0) {
                const { data: commentsRaw, error: commentsError } = await dbClient
                    .from("comments")
                    .select("target_id")
                    .eq("target_type", "work")
                    .in("target_id", workIds);
                if (!commentsError && commentsRaw) {
                    commentsRaw.forEach((c: any) => {
                        commentsCountMap.set(
                            c.target_id,
                            (commentsCountMap.get(c.target_id) || 0) + 1,
                        );
                    });
                }
            }
            // 4. 作品データにlikes_countとcomments_countを付与
            const worksWithCounts = works.map((w: any) => ({
                ...w,
                likes_count: likesCountMap.get(w.id) || 0,
                comments_count: commentsCountMap.get(w.id) || 0,
            }));
            const result = processDbArrayResult(worksWithCounts, error);
            return result;
        } catch (error) {
            logger.error("WorkRepository: 作品一覧取得エラー", error);
            throw error;
        }
    }

    /**
     * 作品を取得する
     * @param workId 作品ID
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async getWork(workId: string, userId: string, _token?: string) {
        try {
            const dbClient = supabase;
            const { data, error } = await dbClient
                .from("works")
                .select("*")
                .eq("id", workId)
                .eq("user_id", userId)
                .single();

            if (error) {
                if (error.code === "PGRST116") {
                    return null;
                }
                throw error;
            }

            return data;
        } catch (error) {
            logger.error("WorkRepository: 作品取得エラー", error);
            throw error;
        }
    }

    /**
     * 作品を保存する
     * @param userId ユーザーID
     * @param workData 作品データ
     * @param _token 認証トークン（オプション）
     */
    static async saveWork(userId: string, workData: any, _token?: string) {
        try {
            const dbClient = supabase;
            const workToSave = {
                user_id: userId,
                title: workData.title || "",
                description: workData.description || "",
                external_url: workData.externalUrl || "",
                tags: workData.tags || [],
                roles: workData.roles || [],
                categories: workData.categories || [],
                production_date: workData.productionDate || null,
                banner_image_url: workData.bannerImageUrl || "",
                preview_data: workData.previewData || null,
                ai_analysis_result: workData.aiAnalysisResult || workData.ai_analysis_result || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            logger.debug("WorkRepository: 保存用データ", { workToSave });

            const { data, error } = await dbClient
                .from("works")
                .insert(workToSave)
                .select()
                .single();

            if (error) {
                logger.error("WorkRepository: Supabaseエラー詳細", null, {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }

            return data;
        } catch (error) {
            logger.error("WorkRepository: 作品保存エラー", error);
            throw error;
        }
    }

    /**
     * 作品を更新する
     * @param workId 作品ID
     * @param userId ユーザーID
     * @param workData 作品データ
     * @param _token 認証トークン（オプション）
     */
    static async updateWork(
        workId: string,
        userId: string,
        workData: any,
        _token?: string,
    ) {
        try {
            const dbClient = supabase;
            const workToUpdate = {
                title: workData.title || "",
                description: workData.description || "",
                external_url: workData.externalUrl || "",
                tags: workData.tags || [],
                roles: workData.roles || [],
                categories: workData.categories || [],
                production_date: workData.productionDate || null,
                banner_image_url: workData.bannerImageUrl || "",
                preview_data: workData.previewData || null,
                ai_analysis_result: workData.aiAnalysisResult || workData.ai_analysis_result || null,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await dbClient
                .from("works")
                .update(workToUpdate)
                .eq("id", workId)
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            logger.error("WorkRepository: 作品更新エラー", error);
            throw error;
        }
    }

    /**
     * 作品を削除する
     * @param workId 作品ID
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async deleteWork(workId: string, userId: string, _token?: string) {
        try {
            const dbClient = supabase;
            const { error } = await dbClient
                .from("works")
                .delete()
                .eq("id", workId)
                .eq("user_id", userId);

            if (error) throw error;

            return true;
        } catch (error) {
            logger.error("WorkRepository: 作品削除エラー", error);
            throw error;
        }
    }
}
