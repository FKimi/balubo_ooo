-- ===================================================================
-- 017: ウェイトリスト登録テーブル作成（本番運用）
-- 目的: 企業/クリエイターのウェイトリスト登録を安全に保存
-- ポリシー: RLS有効。挿入はService Role経由(API)のみを想定
-- ===================================================================

CREATE TABLE IF NOT EXISTS waitlist_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    source TEXT NOT NULL DEFAULT 'enterprise',
    user_agent TEXT,
    referer TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 一意制約（メールアドレスの大小区別なし）
CREATE UNIQUE INDEX IF NOT EXISTS uq_waitlist_email_ci ON waitlist_submissions ((lower(email)));

-- 検索用インデックス
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist_submissions (created_at);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist_submissions (source);

-- RLS有効化
ALTER TABLE waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- 参照は本人概念が無いため原則禁止（ダッシュボード等はService Roleで）
-- 明示的なSELECTポリシーは作成しない（Service RoleはRLSをバイパス）

-- 監査/将来運用に備え、更新は原則不可とする（必要時のみ個別SQL）
-- ただしPostgRESTではUPDATE/DELETEポリシー未作成で拒否となる

-- Realtimeが必要な場合のみ有効化（現時点では不要）
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.waitlist_submissions;


