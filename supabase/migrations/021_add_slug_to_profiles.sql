-- ===================================================================
-- 021: プロフィールテーブルにslugカラム追加
-- ユーザーフレンドリーなプロフィールURL用のスラッグを追加
-- ===================================================================

-- 1. slugカラムを追加（既に存在する場合はスキップ）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'slug'
  ) THEN
    ALTER TABLE profiles ADD COLUMN slug VARCHAR(100);
  END IF;
END $$;

-- 2. slugカラムにユニーク制約を追加（既に存在する場合はスキップ）
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_slug_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_slug_unique UNIQUE (slug);
  END IF;
END $$;

-- 3. slugカラムにインデックスを作成（検索パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_profiles_slug ON profiles(slug);

-- 4. カラムにコメントを追加（説明のため）
COMMENT ON COLUMN profiles.slug IS 'ユーザーフレンドリーなプロフィールURL用のスラッグ（例: fumiya-kimiwada）';

-- 注: 既存レコードのslugはNULLとなるため、マイグレーション後に
-- /api/profile/generate-slugs エンドポイントを実行して一括生成する必要があります
