-- ===================================================================
-- 通知機能の最終テスト用SQL
-- fix_notifications_setup.sql実行後にこちらを実行してください
-- ===================================================================

-- 1. 設定状況の最終確認
SELECT 
    'notifications table exists' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = 'notifications'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status
UNION ALL
SELECT 
    'RLS enabled' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = 'notifications' AND schemaname = 'public' AND rowsecurity = true
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status
UNION ALL
SELECT 
    'RLS policies count' as check_item,
    COALESCE((
        SELECT COUNT(*)::text
        FROM pg_policies 
        WHERE tablename = 'notifications' AND schemaname = 'public'
    ), '0') as status
UNION ALL
SELECT 
    'Realtime enabled' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_publication_tables 
            WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status
UNION ALL
SELECT 
    'create_notification function' as check_item,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' AND routine_name = 'create_notification'
        ) THEN 'OK'
        ELSE 'MISSING'
    END as status;

-- 2. 既存の通知データの確認
SELECT 
    id,
    user_id,
    type,
    message,
    is_read,
    created_at
FROM public.notifications
ORDER BY created_at DESC
LIMIT 5;

-- 3. 通知作成関数のテスト（実際のユーザーIDに置き換えてください）
-- 以下のコメントを外して、実際のユーザーIDを入力してテストしてください
/*
SELECT create_notification(
    'YOUR_USER_ID_HERE'::UUID,
    'work_featured',
    'テスト通知: 設定が正常に完了しました！',
    NULL,
    NULL
) as test_notification_id;
*/

-- 4. 通知タイプの制約確認
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%notifications%type%';

-- 5. インデックスの確認
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'notifications' 
AND schemaname = 'public'
ORDER BY indexname;