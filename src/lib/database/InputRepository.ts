import { supabase } from "../supabase";
import { processDbArrayResult } from "../api-utils";
import { logger } from "../logger";

/**
 * インプット操作のためのリポジトリクラス
 */
export class InputRepository {
    /**
     * インプット一覧を取得する（認証対応）
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async getInputs(userId: string, _token?: string) {
        try {
            logger.debug("InputRepository: インプット一覧取得開始", {
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

            const { data, error } = await dbClient
                .from("inputs")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            logger.debug("インプット取得結果", {
                count: data?.length || 0,
                hasError: !!error,
            });
            if (error) {
                logger.error("インプット取得エラー詳細", error);
            }

            const result = processDbArrayResult(data, error);
            return result;
        } catch (error) {
            logger.error("InputRepository: インプット一覧取得エラー", error);
            throw error;
        }
    }

    /**
     * インプットを取得する
     * @param inputId インプットID
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async getInput(inputId: string, userId: string, _token?: string) {
        try {
            const dbClient = supabase;
            const { data, error } = await dbClient
                .from("inputs")
                .select("*")
                .eq("id", inputId)
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
            logger.error("InputRepository: インプット取得エラー", error);
            throw error;
        }
    }

    /**
     * ユーザー情報付きのインプットを取得する
     * @param inputId インプットID
     * @param _currentUserId 現在のユーザーID（オプション）
     * @param _token 認証トークン（オプション）
     */
    static async getInputWithUser(
        inputId: string,
        _currentUserId?: string | null,
        _token?: string | null,
    ) {
        try {
            const { createClient } = await import("@supabase/supabase-js");

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            if (!supabaseUrl || !supabaseServiceKey) {
                throw new Error(
                    "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are not set.",
                );
            }

            const dbClient = createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false,
                },
            });

            // まずインプットを取得
            const { data: inputData, error: inputError } = await dbClient
                .from("inputs")
                .select("*")
                .eq("id", inputId)
                .single();

            if (inputError) {
                if (inputError.code === "PGRST116") {
                    return null;
                }
                logger.error("InputRepository: インプット取得エラー", inputError);
                throw inputError;
            }

            // ユーザー情報を取得
            let userData = null;
            if (inputData.user_id) {
                try {
                    const { data: profileData, error: profileError } = await dbClient
                        .from("profiles")
                        .select("user_id, display_name, avatar_image_url")
                        .eq("user_id", inputData.user_id)
                        .single();

                    if (!profileError && profileData) {
                        userData = {
                            id: profileData.user_id,
                            display_name: profileData.display_name,
                            avatar_image_url: profileData.avatar_image_url,
                        };
                    }
                } catch (profileError) {
                    logger.warn(
                        "InputRepository: ユーザー情報取得エラー（続行）",
                        { error: profileError },
                    );
                }
            }

            // 結果を整形
            const result = {
                ...inputData,
                user: userData,
            };

            logger.debug("InputRepository: ユーザー情報付きインプット取得成功");
            return result;
        } catch (error) {
            logger.error(
                "InputRepository: ユーザー情報付きインプット取得エラー",
                error,
            );
            throw error;
        }
    }

    /**
     * インプットを保存する
     * @param userId ユーザーID
     * @param inputData インプットデータ
     * @param _token 認証トークン（オプション）
     */
    static async saveInput(userId: string, inputData: any, _token?: string) {
        try {
            logger.debug("InputRepository: インプット保存中...", { userId });
            logger.debug("InputRepository: 受信したinputData", { inputData });

            const dbClient = supabase;
            const inputToSave = {
                user_id: userId,
                title: inputData.title || "",
                type: inputData.type || "book",
                category: "",
                author_creator: "",
                release_date: inputData.releaseDate || null,
                consumption_date: inputData.consumptionDate || null,
                status: inputData.status || "completed",
                rating: null,
                review: inputData.review || "",
                tags: inputData.tags || [],
                genres: inputData.genres || [],
                external_url: inputData.externalUrl || "",
                cover_image_url: inputData.coverImageUrl || "",
                notes: inputData.notes || "",
                favorite: inputData.favorite || false,
                ai_analysis_result: inputData.aiAnalysisResult || inputData.ai_analysis_result || null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await dbClient
                .from("inputs")
                .insert(inputToSave)
                .select()
                .single();

            if (error) {
                logger.error("InputRepository: Supabaseエラー詳細", null, {
                    code: error.code,
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                });
                throw error;
            }

            return data;
        } catch (error) {
            logger.error("InputRepository: インプット保存エラー", error);
            throw error;
        }
    }

    /**
     * インプットを更新する
     * @param inputId インプットID
     * @param userId ユーザーID
     * @param inputData インプットデータ
     * @param _token 認証トークン（オプション）
     */
    static async updateInput(
        inputId: string,
        userId: string,
        inputData: any,
        _token?: string,
    ) {
        try {
            const dbClient = supabase;
            const inputToUpdate = {
                title: inputData.title || "",
                type: inputData.type || "book",
                category: inputData.category || "",
                author_creator: inputData.authorCreator || "",
                release_date: inputData.releaseDate || null,
                consumption_date: inputData.consumptionDate || null,
                status: inputData.status || "completed",
                rating: inputData.rating || null,
                review: inputData.review || "",
                tags: inputData.tags || [],
                genres: inputData.genres || [],
                external_url: inputData.externalUrl || "",
                cover_image_url: inputData.coverImageUrl || "",
                notes: inputData.notes || "",
                favorite: inputData.favorite || false,
                ai_analysis_result: inputData.aiAnalysisResult || inputData.ai_analysis_result || null,
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await dbClient
                .from("inputs")
                .update(inputToUpdate)
                .eq("id", inputId)
                .eq("user_id", userId)
                .select()
                .single();

            if (error) throw error;

            return data;
        } catch (error) {
            logger.error("InputRepository: インプット更新エラー", error);
            throw error;
        }
    }

    /**
     * インプットを削除する
     * @param inputId インプットID
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async deleteInput(inputId: string, userId: string, _token?: string) {
        try {
            const dbClient = supabase;
            const { error } = await dbClient
                .from("inputs")
                .delete()
                .eq("id", inputId)
                .eq("user_id", userId);

            if (error) throw error;

            return true;
        } catch (error) {
            logger.error("InputRepository: インプット削除エラー", error);
            throw error;
        }
    }

    /**
     * インプットを分析する（AI機能強化版）
     * @param userId ユーザーID
     * @param _token 認証トークン（オプション）
     */
    static async analyzeInputs(userId: string, _token?: string) {
        try {
            const inputs = await InputRepository.getInputs(userId, _token);

            // 基本統計
            const tagFrequency: Record<string, number> = {};
            const genreFrequency: Record<string, number> = {};
            const typeDistribution: Record<string, number> = {};
            const monthlyActivity: Record<string, number> = {};

            // AI分析統合用の新しい統計
            const aiInsights = {
                creativeDirections: new Map<string, number>(),
                inspirationSources: new Map<string, number>(),
                skillsDevelopment: new Map<string, number>(),
                personalityTraits: new Map<string, number>(),
                creativeStyles: new Map<string, number>(),
                preferredMediums: new Map<string, number>(),
                themes: new Map<string, number>(),
                moods: new Map<string, number>(),
                collaborationOpportunities: new Map<string, number>(),
            };

            inputs.forEach((input) => {
                // 従来の統計処理
                if (input.tags && Array.isArray(input.tags)) {
                    input.tags.forEach((tag: string) => {
                        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
                    });
                }

                if (input.genres && Array.isArray(input.genres)) {
                    input.genres.forEach((genre: string) => {
                        genreFrequency[genre] = (genreFrequency[genre] || 0) + 1;
                    });
                }

                typeDistribution[input.type] = (typeDistribution[input.type] || 0) + 1;

                if (input.consumption_date) {
                    const month = new Date(input.consumption_date)
                        .toISOString()
                        .substring(0, 7);
                    monthlyActivity[month] = (monthlyActivity[month] || 0) + 1;
                }

                // AI分析結果の統合処理
                if (input.ai_analysis_result) {
                    const aiData =
                        typeof input.ai_analysis_result === "string"
                            ? JSON.parse(input.ai_analysis_result)
                            : input.ai_analysis_result;

                    try {
                        // クリエイティブな方向性
                        if (aiData.creativeInsights?.creativeDirection) {
                            aiData.creativeInsights.creativeDirection.forEach(
                                (direction: string) => {
                                    const count =
                                        aiInsights.creativeDirections.get(direction) || 0;
                                    aiInsights.creativeDirections.set(direction, count + 1);
                                },
                            );
                        }

                        // インスピレーション源
                        if (aiData.creativeInsights?.inspirationSources) {
                            aiData.creativeInsights.inspirationSources.forEach(
                                (source: string) => {
                                    const count = aiInsights.inspirationSources.get(source) || 0;
                                    aiInsights.inspirationSources.set(source, count + 1);
                                },
                            );
                        }

                        // スキル開発
                        if (aiData.creativeInsights?.skillDevelopment) {
                            aiData.creativeInsights.skillDevelopment.forEach(
                                (skill: string) => {
                                    const count = aiInsights.skillsDevelopment.get(skill) || 0;
                                    aiInsights.skillsDevelopment.set(skill, count + 1);
                                },
                            );
                        }

                        // パーソナリティ特性
                        if (aiData.personalityTraits) {
                            aiData.personalityTraits.forEach((trait: string) => {
                                const count = aiInsights.personalityTraits.get(trait) || 0;
                                aiInsights.personalityTraits.set(trait, count + 1);
                            });
                        }

                        // 創作スタイル
                        if (aiData.interestProfile?.creativeStyle) {
                            const style = aiData.interestProfile.creativeStyle;
                            const count = aiInsights.creativeStyles.get(style) || 0;
                            aiInsights.creativeStyles.set(style, count + 1);
                        }

                        // 好みの媒体
                        if (aiData.interestProfile?.preferredMediums) {
                            aiData.interestProfile.preferredMediums.forEach(
                                (medium: string) => {
                                    const count = aiInsights.preferredMediums.get(medium) || 0;
                                    aiInsights.preferredMediums.set(medium, count + 1);
                                },
                            );
                        }

                        // テーマ
                        if (aiData.themes) {
                            aiData.themes.forEach((theme: string) => {
                                const count = aiInsights.themes.get(theme) || 0;
                                aiInsights.themes.set(theme, count + 1);
                            });
                        }

                        // 雰囲気
                        if (aiData.mood) {
                            const count = aiInsights.moods.get(aiData.mood) || 0;
                            aiInsights.moods.set(aiData.mood, count + 1);
                        }

                        // コラボレーション機会
                        if (aiData.creativeInsights?.collaborationOpportunities) {
                            aiData.creativeInsights.collaborationOpportunities.forEach(
                                (opportunity: string) => {
                                    const count =
                                        aiInsights.collaborationOpportunities.get(opportunity) || 0;
                                    aiInsights.collaborationOpportunities.set(
                                        opportunity,
                                        count + 1,
                                    );
                                },
                            );
                        }
                    } catch (aiParseError) {
                        logger.warn("AI分析結果の解析エラー", { error: aiParseError });
                    }
                }
            });

            // 統計結果をランキング形式に変換
            const topTags = Object.entries(tagFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 15)
                .map(([tag, count]) => ({ tag, count }));

            const topGenres = Object.entries(genreFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([genre, count]) => ({ genre, count }));

            // AI洞察をランキングに変換
            const mapToRanking = (map: Map<string, number>, limit: number = 10) =>
                Array.from(map.entries())
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, limit)
                    .map(([item, count]) => ({ item, count }));

            // 総合的な興味・関心プロファイル
            const interestProfile = {
                dominantTypes: Object.entries(typeDistribution)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([type, count]) => ({
                        type,
                        count,
                        percentage: ((count / inputs.length) * 100).toFixed(1),
                    })),

                topCreativeDirections: mapToRanking(aiInsights.creativeDirections, 5),
                topInspirationSources: mapToRanking(aiInsights.inspirationSources, 8),
                recommendedSkills: mapToRanking(aiInsights.skillsDevelopment, 6),
                personalityProfile: mapToRanking(aiInsights.personalityTraits, 8),
                creativeStyleTrends: mapToRanking(aiInsights.creativeStyles, 5),
                preferredMediums: mapToRanking(aiInsights.preferredMediums, 6),
                dominantThemes: mapToRanking(aiInsights.themes, 10),
                moodDistribution: mapToRanking(aiInsights.moods, 8),
                collaborationOpportunities: mapToRanking(
                    aiInsights.collaborationOpportunities,
                    8,
                ),
            };

            // クリエイター向けインサイト
            const creativeInsights = {
                overallCreativeDirection:
                    interestProfile.topCreativeDirections[0]?.item || "多様性重視",
                primaryInspiration:
                    interestProfile.topInspirationSources[0]?.item || "様々な分野",
                suggestedFocusAreas: interestProfile.recommendedSkills
                    .slice(0, 3)
                    .map((s) => s.item),
                personalityHighlights: interestProfile.personalityProfile
                    .slice(0, 3)
                    .map((p) => p.item),
                nextSteps: this.generateCreativeNextSteps(interestProfile),
                strengthsAnalysis: this.analyzeCreativeStrengths(
                    interestProfile,
                    inputs.length,
                ),
            };

            const analysis = {
                // 基本統計
                totalInputs: inputs.length,
                tagFrequency,
                genreFrequency,
                typeDistribution,
                monthlyActivity,
                topTags,
                topGenres,
                favoriteCount: inputs.filter((input) => input.favorite).length,
                averageRating:
                    inputs
                        .filter((input) => input.rating)
                        .reduce((sum, input) => sum + input.rating, 0) /
                    inputs.filter((input) => input.rating).length || 0,

                // 強化された分析
                interestProfile,
                creativeInsights,

                // メタ情報
                aiAnalysisCount: inputs.filter((input) => input.ai_analysis_result)
                    .length,
                analysisCompleteness: (
                    (inputs.filter((input) => input.ai_analysis_result).length /
                        inputs.length) *
                    100
                ).toFixed(1),
                lastUpdated: new Date().toISOString(),
            };

            return analysis;
        } catch (error) {
            logger.error("InputRepository: インプット分析エラー", error);
            throw error;
        }
    }

    // クリエイターの次のステップを生成
    private static generateCreativeNextSteps(profile: any): string[] {
        const steps = [];

        if (profile.topCreativeDirections.length > 0) {
            steps.push(
                `${profile.topCreativeDirections[0].item}の分野での作品制作を検討`,
            );
        }

        if (profile.recommendedSkills.length > 0) {
            steps.push(`${profile.recommendedSkills[0].item}のスキル向上に集中`);
        }

        if (profile.collaborationOpportunities.length > 0) {
            steps.push(`${profile.collaborationOpportunities[0].item}との連携を模索`);
        }

        if (profile.preferredMediums.length > 1) {
            steps.push(
                `${profile.preferredMediums[0].item}と${profile.preferredMediums[1].item}を組み合わせた新しい表現を試す`,
            );
        }

        steps.push("より多様なジャンルにチャレンジして視野を広げる");

        return steps.slice(0, 4);
    }

    // クリエイターの強みを分析
    private static analyzeCreativeStrengths(
        profile: any,
        totalInputs: number,
    ): any {
        return {
            diversityScore: Math.min(
                100,
                profile.dominantTypes.length * 25 + profile.dominantThemes.length * 10,
            ),
            consistencyIndicator:
                profile.personalityProfile.length > 0
                    ? (profile.personalityProfile[0].count / totalInputs) * 100
                    : 0,
            explorationTendency:
                profile.topInspirationSources.length > 5
                    ? "high"
                    : profile.topInspirationSources.length > 2
                        ? "medium"
                        : "focused",
            collaborativePotential:
                profile.collaborationOpportunities.length > 3 ? "high" : "developing",
            creativeMaturity:
                totalInputs > 20
                    ? "experienced"
                    : totalInputs > 10
                        ? "developing"
                        : "emerging",
        };
    }
}
