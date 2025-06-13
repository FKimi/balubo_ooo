-- ===================================================================
-- 009: works テーブルに content_type と記事統計フィールドを追加
-- 記事コンテンツタイプ対応と執筆量の可視化機能
-- ===================================================================

-- 1. content_type フィールドを追加
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'content_type') THEN
        ALTER TABLE works ADD COLUMN content_type TEXT DEFAULT 'article';
    END IF;
END $$;

-- 2. 記事統計フィールドを追加
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'article_word_count') THEN
        ALTER TABLE works ADD COLUMN article_word_count INTEGER DEFAULT 0;
    END IF;
END $$;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'article_has_content') THEN
        ALTER TABLE works ADD COLUMN article_has_content BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 3. インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_works_content_type ON works(content_type);
CREATE INDEX IF NOT EXISTS idx_works_article_stats ON works(user_id, content_type, article_word_count) WHERE content_type = 'article';

-- 4. 統計取得用のビューを作成（プロフィール表示で使用）
CREATE OR REPLACE VIEW user_article_stats AS
SELECT 
    user_id,
    COUNT(*) as total_articles,
    SUM(article_word_count) as total_word_count,
    COUNT(*) FILTER (WHERE article_has_content = true) as articles_with_content,
    AVG(article_word_count) FILTER (WHERE article_word_count > 0) as avg_word_count,
    MAX(article_word_count) as max_word_count,
    MIN(created_at) as first_article_date,
    MAX(created_at) as latest_article_date
FROM works 
WHERE content_type = 'article'
GROUP BY user_id;

-- 5. ビューへのRLSポリシー設定
ALTER VIEW user_article_stats SET (security_invoker = on);

-- 6. コメント追加
COMMENT ON COLUMN works.content_type IS 'コンテンツタイプ（article, design, photo, video, podcast, event）';
COMMENT ON COLUMN works.article_word_count IS '記事の文字数（記事コンテンツのみ）';
COMMENT ON COLUMN works.article_has_content IS '記事本文が入力されているかのフラグ';
COMMENT ON VIEW user_article_stats IS 'ユーザーごとの記事統計情報（プロフィール表示用）'; 