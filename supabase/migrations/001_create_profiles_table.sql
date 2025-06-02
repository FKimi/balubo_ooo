-- ===================================================================
-- 001: プロフィールテーブル作成 + RLS設定
-- 基本的なプロフィール情報管理のためのテーブル
-- ===================================================================

-- 1. プロフィールテーブルの作成
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  
  -- 基本情報
  display_name VARCHAR(100),
  bio TEXT,
  location VARCHAR(100),
  website_url VARCHAR(255),
  
  -- スキル・専門分野（配列型で効率的に管理）
  professions TEXT[] DEFAULT '{}',  -- 専門分野
  skills TEXT[] DEFAULT '{}',       -- スキル・ツール
  
  -- キャリア情報（柔軟なJSON型で複雑な構造に対応）
  career JSONB DEFAULT '[]',        -- 職歴・経歴
  
  -- 公開設定
  portfolio_visibility VARCHAR(20) DEFAULT 'public' CHECK (portfolio_visibility IN ('public', 'connections_only', 'private')),
  
  -- 画像
  background_image_url TEXT,
  avatar_image_url TEXT,
  
  -- 仕事関連
  desired_rate VARCHAR(100),
  job_change_intention VARCHAR(50) DEFAULT 'not_considering' CHECK (job_change_intention IN ('actively_looking', 'considering', 'not_considering')),
  side_job_intention VARCHAR(50) DEFAULT 'not_considering' CHECK (side_job_intention IN ('actively_looking', 'considering', 'not_considering')),
  project_recruitment_status VARCHAR(50) DEFAULT 'not_recruiting' CHECK (project_recruitment_status IN ('actively_recruiting', 'conditionally_recruiting', 'not_recruiting')),
  experience_years INTEGER,
  working_hours VARCHAR(100),
  
  -- タイムスタンプ
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. インデックスの作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_portfolio_visibility ON profiles(portfolio_visibility);
CREATE INDEX IF NOT EXISTS idx_profiles_professions ON profiles USING GIN(professions);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON profiles USING GIN(skills);
CREATE INDEX IF NOT EXISTS idx_profiles_career ON profiles USING GIN(career);

-- 3. RLS (Row Level Security) の設定
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. セキュリティポリシーの設定
-- ユーザーは自分のプロフィールのみ閲覧・編集可能
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- 公開プロフィールは全員が閲覧可能
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (portfolio_visibility = 'public');

-- つながりのみ公開は認証済みユーザーが閲覧可能
CREATE POLICY "Connection only profiles are viewable by authenticated users" ON profiles
  FOR SELECT USING (portfolio_visibility = 'connections_only' AND auth.role() = 'authenticated');

-- 5. 自動更新トリガーの設定
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE profiles; 