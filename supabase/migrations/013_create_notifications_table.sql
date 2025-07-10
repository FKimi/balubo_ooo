-- ===================================================================
-- 013: 通知テーブル作成
-- ユーザーへの通知管理
-- ===================================================================

-- 通知テーブルの作成
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'connection_request', 
        'connection_approved', 
        'connection_declined',
        'new_review',
        'new_like',
        'new_comment',
        'work_featured'
    )),
    message TEXT NOT NULL,
    related_entity_id UUID,
    related_entity_type TEXT CHECK (related_entity_type IN ('user', 'work', 'review', 'comment', 'like')),
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- Row Level Security (RLS) の有効化
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
-- ユーザーは自分の通知のみ閲覧可能
CREATE POLICY "ユーザーは自分の通知を閲覧可能" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

-- システムは通知を作成可能（Service Role使用時）
CREATE POLICY "システムは通知を作成可能" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- ユーザーは自分の通知を更新可能（既読マークなど）
CREATE POLICY "ユーザーは自分の通知を更新可能" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- ユーザーは自分の通知を削除可能
CREATE POLICY "ユーザーは自分の通知を削除可能" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- 更新日時を自動更新するトリガー関数
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーの作成
CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- 通知作成用のヘルパー関数
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

-- リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications; 