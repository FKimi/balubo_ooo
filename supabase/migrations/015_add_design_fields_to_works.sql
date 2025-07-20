-- ===================================================================
-- 015: works テーブルにデザイン用フィールドを追加
-- デザインコンテンツタイプ対応
-- ===================================================================

-- 1. デザインツールフィールドを追加
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'design_tools') THEN
        ALTER TABLE works ADD COLUMN design_tools TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 2. カラーパレットフィールドを追加
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'color_palette') THEN
        ALTER TABLE works ADD COLUMN color_palette TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 3. ターゲットプラットフォームフィールドを追加
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'works' AND column_name = 'target_platform') THEN
        ALTER TABLE works ADD COLUMN target_platform TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- 4. インデックス追加（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_works_design_tools ON works USING GIN(design_tools);
CREATE INDEX IF NOT EXISTS idx_works_color_palette ON works USING GIN(color_palette);
CREATE INDEX IF NOT EXISTS idx_works_target_platform ON works USING GIN(target_platform);

-- 5. デザイン統計取得用のビューを作成
CREATE OR REPLACE VIEW user_design_stats AS
SELECT 
    user_id,
    COUNT(*) as total_designs,
    COUNT(*) FILTER (WHERE array_length(design_tools, 1) > 0) as designs_with_tools,
    COUNT(*) FILTER (WHERE array_length(color_palette, 1) > 0) as designs_with_colors,
    COUNT(*) FILTER (WHERE array_length(target_platform, 1) > 0) as designs_with_platforms,
    MIN(created_at) as first_design_date,
    MAX(created_at) as latest_design_date,
    -- よく使われるツールの統計
    (SELECT jsonb_object_agg(tool, count) 
     FROM (
       SELECT unnest(design_tools) as tool, COUNT(*) as count
       FROM works 
       WHERE user_id = w.user_id AND content_type = 'design' AND array_length(design_tools, 1) > 0
       GROUP BY tool
       ORDER BY count DESC
       LIMIT 5
     ) tool_stats
    ) as top_tools,
    -- よく使われる色の統計
    (SELECT jsonb_object_agg(color, count) 
     FROM (
       SELECT unnest(color_palette) as color, COUNT(*) as count
       FROM works 
       WHERE user_id = w.user_id AND content_type = 'design' AND array_length(color_palette, 1) > 0
       GROUP BY color
       ORDER BY count DESC
       LIMIT 5
     ) color_stats
    ) as top_colors
FROM works w
WHERE content_type = 'design'
GROUP BY user_id;

-- 6. ビューへのRLSポリシー設定
ALTER VIEW user_design_stats SET (security_invoker = on);

-- 7. コメント追加
COMMENT ON COLUMN works.design_tools IS '使用したデザインツール（Figma, Photoshop, Illustrator等）';
COMMENT ON COLUMN works.color_palette IS '使用したカラーパレット（色名またはカラーコード）';
COMMENT ON COLUMN works.target_platform IS 'ターゲットプラットフォーム（Web, iOS, Android等）';
COMMENT ON VIEW user_design_stats IS 'ユーザーごとのデザイン統計情報（プロフィール表示用）'; 