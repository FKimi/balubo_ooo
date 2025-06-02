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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の作品のみアクセス可能
CREATE POLICY "Users can view their own works" ON works
  FOR SELECT USING (auth.uid() = user_id);

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