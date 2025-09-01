-- ===================================================================
-- 005: 作品テーブル作成
-- ユーザーの作品・ポートフォリオ管理
-- ===================================================================

-- 作品テーブルの作成
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  external_url TEXT,
  tags TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  categories TEXT[] DEFAULT '{}',
  production_date DATE,
  banner_image_url TEXT,
  preview_data JSONB,
  ai_analysis_result JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  content_type TEXT DEFAULT 'work',
  article_word_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- 作品の閲覧ポリシー
-- 1. 認証済みユーザーは全ての作品を閲覧可能（自分の作品管理用）
CREATE POLICY "Authenticated users can view all works" ON works
  FOR SELECT USING (auth.role() = 'authenticated');

-- 2. 公開プロフィール用：公開設定された作品のみ閲覧可能（Service Role使用時）
CREATE POLICY "Public can view public works" ON works
  FOR SELECT USING (is_public = true);

-- ユーザーは自分の作品のみ作成・更新・削除可能
CREATE POLICY "Users can insert their own works" ON works
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own works" ON works
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own works" ON works
  FOR DELETE USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS works_user_id_idx ON works(user_id);
CREATE INDEX IF NOT EXISTS works_created_at_idx ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS works_ai_analysis_idx ON works USING GIN(ai_analysis_result);

-- トリガー関数は既に001で作成済みのためスキップ

-- updated_at を自動更新するトリガー
CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 既存データのデフォルト値を設定（マイグレーション時のみ実行）
-- 注意: このクエリは初回マイグレーション時のみ実行してください
-- UPDATE works SET is_public = false WHERE is_public IS NULL; 