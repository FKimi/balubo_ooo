-- メッセージ編集・削除機能のためのデータベースマイグレーション
-- Supabaseダッシュボードの SQL Editor で実行してください

-- 1. messagesテーブルに編集・削除関連のカラムを追加
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS original_content TEXT;

-- 2. メッセージ編集履歴テーブルを作成
CREATE TABLE IF NOT EXISTS message_edit_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  previous_content TEXT NOT NULL,
  edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLSポリシーを設定
ALTER TABLE message_edit_history ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のメッセージの編集履歴のみ閲覧可能
CREATE POLICY "Users can view edit history of their messages" ON message_edit_history
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM messages 
    WHERE messages.id = message_edit_history.message_id 
    AND messages.sender_id = auth.uid()
  )
);

-- ユーザーは自分のメッセージの編集履歴のみ作成可能
CREATE POLICY "Users can create edit history for their messages" ON message_edit_history
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM messages 
    WHERE messages.id = message_edit_history.message_id 
    AND messages.sender_id = auth.uid()
  )
);

-- 4. メッセージ更新のRLSポリシーを確認（既存のポリシーを更新）
-- 既存のポリシーがある場合は削除して再作成
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

CREATE POLICY "Users can update their own messages" ON messages
FOR UPDATE USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- 5. インデックスを追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_messages_is_deleted ON messages(is_deleted);
CREATE INDEX IF NOT EXISTS idx_messages_is_edited ON messages(is_edited);
CREATE INDEX IF NOT EXISTS idx_message_edit_history_message_id ON message_edit_history(message_id); 