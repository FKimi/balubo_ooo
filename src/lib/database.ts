/**
 * データベース操作モジュール
 * 
 * このファイルは後方互換性のために維持されています。
 * 新しいコードでは個別のリポジトリを直接インポートすることを推奨します：
 * 
 * @example
 * // 推奨:
 * import { ProfileRepository, WorkRepository, InputRepository } from "@/lib/database";
 * 
 * // または個別にインポート:
 * import { ProfileRepository } from "@/lib/database/ProfileRepository";
 * 
 * // 後方互換（非推奨）:
 * import { DatabaseClient } from "@/lib/database";
 */

// 新しいリポジトリモジュールからすべてエクスポート
export {
  ProfileRepository,
  WorkRepository,
  InputRepository,
  DatabaseClient,
} from "./database/index";
