-- ===================================================================
-- 020: フィードパフォーマンス向上用のRPC関数
-- likes/commentsのカウントをSQL集約で実行してパフォーマンス向上
-- ===================================================================

-- likesカウント取得関数
CREATE OR REPLACE FUNCTION get_likes_count(
  work_ids UUID[],
  target_type TEXT DEFAULT 'work'
)
RETURNS TABLE(work_id UUID, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.target_id::UUID as work_id,
    COUNT(*)::BIGINT as count
  FROM likes l
  WHERE l.target_id = ANY(work_ids)
    AND l.target_type = get_likes_count.target_type
  GROUP BY l.target_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- commentsカウント取得関数
CREATE OR REPLACE FUNCTION get_comments_count(
  work_ids UUID[],
  target_type TEXT DEFAULT 'work'
)
RETURNS TABLE(work_id UUID, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.target_id::UUID as work_id,
    COUNT(*)::BIGINT as count
  FROM comments c
  WHERE c.target_id = ANY(work_ids)
    AND c.target_type = get_comments_count.target_type
  GROUP BY c.target_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- インデックスの最適化（既存のインデックスを確認）
-- worksテーブルのcreated_atインデックスが存在することを確認
CREATE INDEX IF NOT EXISTS idx_works_created_at_desc ON works(created_at DESC);

-- likesテーブルの複合インデックス（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_likes_target_type_target_id_user_id 
ON likes(target_type, target_id, user_id);

-- commentsテーブルの複合インデックス（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_comments_target_type_target_id 
ON comments(target_type, target_id);



