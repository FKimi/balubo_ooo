-- ===================================================================
-- 通知機能の簡単な確認用SQL
-- ===================================================================

-- 1. notificationsテーブルの存在確認
SELECT 
    'notifications table exists' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'notifications'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status;

-- 2. RLS（Row Level Security）の設定確認
SELECT 
    'RLS enabled' as check_item,
    CASE 
        WHEN rowsecurity = true THEN 'OK'
        ELSE 'MISSING'
    END as status
FROM pg_tables 
WHERE tablename = 'notifications' AND schemaname = 'public';

-- 3. RLSポリシーの確認
SELECT 
    'RLS policies count' as check_item,
    COUNT(*)::text as status
FROM pg_policies 
WHERE tablename = 'notifications' AND schemaname = 'public';

-- 4. リアルタイム機能の確認
SELECT 
    'Realtime enabled' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status;

-- 5. 通知作成用の関数確認
SELECT 
    'create_notification function' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' AND routine_name = 'create_notification'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status;

-- 6. 実際の通知データの確認（あれば）
SELECT 
    'notification count' as check_item,
    COUNT(*)::text as status
FROM public.notifications;