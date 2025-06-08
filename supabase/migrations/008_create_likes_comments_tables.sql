-- いいねテーブル作成
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- 同じユーザーが同じ作品に複数回いいねできないように
  UNIQUE(user_id, work_id)
);

-- コメントテーブル作成
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  work_id UUID NOT NULL REFERENCES works(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックス追加
CREATE INDEX IF NOT EXISTS idx_likes_work_id ON likes(work_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_work_id ON comments(work_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- RLS (Row Level Security) 有効化
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLSポリシー - いいね
CREATE POLICY "公開されたいいねは誰でも閲覧可能" ON likes FOR SELECT USING (true);
CREATE POLICY "ログインユーザーはいいねを追加可能" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分のいいねを削除可能" ON likes FOR DELETE USING (auth.uid() = user_id);

-- RLSポリシー - コメント
CREATE POLICY "公開されたコメントは誰でも閲覧可能" ON comments FOR SELECT USING (true);
CREATE POLICY "ログインユーザーはコメントを追加可能" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分のコメントを更新可能" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "ユーザーは自分のコメントを削除可能" ON comments FOR DELETE USING (auth.uid() = user_id);

-- すべての外部キー制約はauth.usersテーブルを参照（一貫性のため）
-- likesとcommentsの両方がauth.users(id)を参照するように統一 