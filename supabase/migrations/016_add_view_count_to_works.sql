-- worksテーブルに閲覧数カラムを追加
ALTER TABLE public.works
ADD COLUMN view_count INT DEFAULT 0 NOT NULL;

-- 閲覧数をインクリメントするためのRPC関数を作成
CREATE OR REPLACE FUNCTION increment_work_view_count(work_id_param UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.works
  SET view_count = view_count + 1
  WHERE id = work_id_param;
END;
$$; 