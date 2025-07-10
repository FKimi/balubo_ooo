-- ===================================================================
-- 通知機能の修正用SQL
-- Supabaseの管理画面で実行してください
-- ===================================================================

-- 1. RLS（Row Level Security）の有効化
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 2. 既存のポリシーを削除（エラーが出ても無視してください）
DROP POLICY IF EXISTS "ユーザーは自分の通知を閲覧可能" ON public.notifications;
DROP POLICY IF EXISTS "システムは通知を作成可能" ON public.notifications;
DROP POLICY IF EXISTS "ユーザーは自分の通知を更新可能" ON public.notifications;
DROP POLICY IF EXISTS "ユーザーは自分の通知を削除可能" ON public.notifications;

-- 3. 新しいポリシーを作成
CREATE POLICY "ユーザーは自分の通知を閲覧可能" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "システムは通知を作成可能" ON public.notifications
    FOR INSERT WITH CHECK (true);

CREATE POLICY "ユーザーは自分の通知を更新可能" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "ユーザーは自分の通知を削除可能" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- 4. リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 5. 通知作成用の関数を作成
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type TEXT,
    p_message TEXT,
    p_related_entity_id UUID DEFAULT NULL,
    p_related_entity_type TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        message,
        related_entity_id,
        related_entity_type
    ) VALUES (
        p_user_id,
        p_type,
        p_message,
        p_related_entity_id,
        p_related_entity_type
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. トリガーの作成
DROP TRIGGER IF EXISTS trigger_update_notifications_updated_at ON public.notifications;
CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- 8. 必要なインデックスの作成
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- 9. 完了確認用のクエリ
SELECT 
    'Setup completed successfully' as message,
    now() as timestamp;