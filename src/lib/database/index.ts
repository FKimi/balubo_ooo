/**
 * データベースリポジトリのエクスポート
 * 
 * 各リポジトリは専用の責務を持ち、保守性を向上させています：
 * - ProfileRepository: プロフィールのCRUD操作（キャッシュ・レート制限機能付き）
 * - WorkRepository: 作品のCRUD操作（いいね・コメント集計機能付き）
 * - InputRepository: インプットのCRUD操作（AI分析機能付き）
 */

export { ProfileRepository } from "./ProfileRepository";
export { WorkRepository } from "./WorkRepository";
export { InputRepository } from "./InputRepository";

// 後方互換性のためのDatabaseClientエクスポート
// 既存のコードが動作し続けるよう、元のメソッドシグネチャを維持
import { ProfileRepository } from "./ProfileRepository";
import { WorkRepository } from "./WorkRepository";
import { InputRepository } from "./InputRepository";
import { supabase } from "../supabase";

/**
 * 後方互換性のためのDatabaseClientクラス
 * 新規コードでは個別のリポジトリを直接使用することを推奨
 * @deprecated 個別のリポジトリ（ProfileRepository, WorkRepository, InputRepository）を使用してください
 */
export class DatabaseClient {
    // プロフィール操作
    static getProfile = ProfileRepository.getProfile.bind(ProfileRepository);
    static saveProfile = ProfileRepository.saveProfile.bind(ProfileRepository);

    // 作品操作
    static getWorks = WorkRepository.getWorks.bind(WorkRepository);
    static getWork = WorkRepository.getWork.bind(WorkRepository);
    static saveWork = WorkRepository.saveWork.bind(WorkRepository);
    static updateWork = WorkRepository.updateWork.bind(WorkRepository);
    static deleteWork = WorkRepository.deleteWork.bind(WorkRepository);

    // インプット操作
    static getInputs = InputRepository.getInputs.bind(InputRepository);
    static getInput = InputRepository.getInput.bind(InputRepository);
    static getInputWithUser = InputRepository.getInputWithUser.bind(InputRepository);
    static saveInput = InputRepository.saveInput.bind(InputRepository);
    static updateInput = InputRepository.updateInput.bind(InputRepository);
    static deleteInput = InputRepository.deleteInput.bind(InputRepository);
    static analyzeInputs = InputRepository.analyzeInputs.bind(InputRepository);

    // ユーティリティ操作
    static async testConnection() {
        try {
            const dbClient = supabase;
            try {
                await dbClient.auth.getSession();
                return true;
            } catch (connectionError) {
                console.error("DatabaseClient: 基本接続エラー:", connectionError);
                return false;
            }
        } catch (error) {
            console.error("DatabaseClient: 接続テストエラー:", error);
            return false;
        }
    }

    static async getCurrentUser() {
        try {
            const {
                data: { user },
                error,
            } = await supabase.auth.getUser();

            if (error) throw error;

            return user;
        } catch (error) {
            console.error("DatabaseClient: ユーザー情報取得エラー:", error);
            return null;
        }
    }
}
