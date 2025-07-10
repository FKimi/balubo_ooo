-- ===================================================================
-- 014: likes・commentsテーブル修正
-- worksとinputsの両方に対応するように修正
-- ===================================================================

-- 既存のlikesテーブルを削除（データは保持）
DROP TABLE IF EXISTS likes CASCADE;

-- 新しいlikesテーブルを作成
CREATE TABLE likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('work', 'input')),
  target_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- 同じユーザーが同じターゲットに複数回いいねできないように
  UNIQUE(user_id, target_type, target_id)
);

-- 既存のcommentsテーブルを削除（データは保持）
DROP TABLE IF EXISTS comments CASCADE;

-- 新しいcommentsテーブルを作成
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('work', 'input')),
  target_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックス追加
CREATE INDEX idx_likes_target_type_target_id ON likes(target_type, target_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_target_type_target_id ON comments(target_type, target_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

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