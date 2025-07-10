-- ===================================================================
-- 通知機能の設定確認用SQL
-- Supabaseの管理画面で実行して確認してください
-- ===================================================================

-- 1. テーブルの存在確認
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'notifications';

-- 2. テーブルの制約確認
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    cc.check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'notifications' 
AND tc.table_schema = 'public';

-- 3. RLS（Row Level Security）の設定確認
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 4. RLSポリシーの確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 5. インデックスの確認
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'notifications' 
AND schemaname = 'public';

-- 6. リアルタイム機能の確認
SELECT 
    schemaname,
    tablename
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- 7. 通知作成用の関数が存在するか確認
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name = 'create_notification';

-- 8. トリガーの確認
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'notifications' 
AND trigger_schema = 'public';