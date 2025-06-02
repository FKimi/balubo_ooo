# データベースマイグレーション管理

## 📁 統一されたSQL管理

nextjs.mdcの原則に従い、**すべてのデータベース関連SQLファイル**を`supabase/migrations/`ディレクトリに統一しました。

## 🗂️ ファイル構成

```
supabase/migrations/
├── 001_create_profiles_table.sql    # プロフィールテーブル + RLS
├── 003_create_inputs_table.sql      # インプットテーブル + RLS  
├── 005_create_works_table.sql       # 作品テーブル + RLS
└── README.md                        # このファイル
```

## 📋 各テーブルの役割

### 001: プロフィールテーブル
- **用途**: ユーザーの基本情報、スキル、キャリア管理
- **主要機能**: 
  - 基本情報（名前、自己紹介、居住地）
  - スキル・専門分野（配列型）
  - キャリア情報（JSONB型）
  - 公開設定（public/connections_only/private）

### 003: インプットテーブル  
- **用途**: ユーザーの読書・視聴履歴管理
- **主要機能**:
  - 多様なメディア対応（本、映画、アニメ、ゲーム等）
  - 消費状況管理（完了、進行中、計画中等）
  - レビュー・評価システム
  - AI分析結果保存

### 005: 作品テーブル
- **用途**: ユーザーのポートフォリオ・作品管理
- **主要機能**:
  - 作品メタデータ（タイトル、説明、URL）
  - カテゴリー・タグ・役割分類
  - プレビューデータ（JSONB型）
  - AI分析結果

## 🔧 今後のマイグレーション追加方法

### 1. ファイル命名規則
```
006_feature_name.sql
007_another_feature.sql
...
```

### 2. ファイル構成テンプレート
```sql
-- ===================================================================
-- 006: 機能名
-- 機能の詳細説明
-- ===================================================================

-- テーブル作成・変更
CREATE TABLE IF NOT EXISTS table_name (...);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column);

-- RLS設定
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
CREATE POLICY "policy_name" ON table_name FOR SELECT USING (...);

-- トリガー設定（必要に応じて）
CREATE TRIGGER trigger_name BEFORE UPDATE ON table_name
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3. 必須事項
- **RLS (Row Level Security)**: 全テーブルで有効化
- **auth.uid()**: ユーザー識別に使用
- **updated_at**: 自動更新トリガー設定
- **インデックス**: パフォーマンス向上のため適切に設定

## 🚀 実行方法

### ローカル開発
```bash
supabase db reset
supabase db push
```

### 本番環境
```bash
supabase db push --linked
```

## ⚠️ 注意事項

1. **マイグレーションファイルは修正禁止** - 新しいファイルを追加してください
2. **番号の欠番は問題ありません** - 連番である必要はありません  
3. **RLS必須** - すべてのテーブルでRow Level Securityを有効化
4. **テスト必須** - 本番適用前に必ずローカルで動作確認 