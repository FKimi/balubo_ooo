-- ===================================================================
-- 007: つながり（connections）テーブル作成
-- ユーザー間のフォロー・つながり申請を管理
-- ===================================================================

-- つながりテーブルの作成
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    requestee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'blocked')),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    
    -- 同じユーザー間で重複するつながりを防ぐ制約
    CONSTRAINT connections_unique_pair UNIQUE (requester_id, requestee_id),
    
    -- 自分自身へのつながり申請を防ぐ制約
    CONSTRAINT connections_no_self_connection CHECK (requester_id != requestee_id)
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_connections_requester_id ON public.connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_connections_requestee_id ON public.connections(requestee_id);
CREATE INDEX IF NOT EXISTS idx_connections_status ON public.connections(status);
CREATE INDEX IF NOT EXISTS idx_connections_requested_at ON public.connections(requested_at);

-- 複合インデックス（よく使われる検索パターン用）
CREATE INDEX IF NOT EXISTS idx_connections_requester_status ON public.connections(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_requestee_status ON public.connections(requestee_id, status);

-- Row Level Security (RLS) の有効化
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
-- ユーザーは自分が関与するつながりのみ閲覧可能
CREATE POLICY "Users can view their own connections" ON public.connections
    FOR SELECT USING (
        auth.uid() = requester_id OR auth.uid() = requestee_id
    );

-- ユーザーは自分が申請者となるつながりのみ作成可能
CREATE POLICY "Users can create connection requests" ON public.connections
    FOR INSERT WITH CHECK (
        auth.uid() = requester_id
    );

-- ユーザーは自分が関与するつながりのみ更新可能
CREATE POLICY "Users can update their own connections" ON public.connections
    FOR UPDATE USING (
        auth.uid() = requester_id OR auth.uid() = requestee_id
    );

-- ユーザーは自分が関与するつながりのみ削除可能
CREATE POLICY "Users can delete their own connections" ON public.connections
    FOR DELETE USING (
        auth.uid() = requester_id OR auth.uid() = requestee_id
    );

-- 自動更新トリガーの設定
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_connections_updated_at
    BEFORE UPDATE ON public.connections
    FOR EACH ROW
    EXECUTE FUNCTION update_connections_updated_at();

-- リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.connections; 