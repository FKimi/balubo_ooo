-- ===================================================================
-- 003: インプットテーブル作成
-- ユーザーの読書・視聴履歴等の管理
-- ===================================================================

-- インプットテーブルの作成
CREATE TABLE IF NOT EXISTS public.inputs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'book' CHECK (type IN ('book', 'manga', 'movie', 'anime', 'tv', 'game', 'podcast', 'other')),
    category TEXT DEFAULT '',
    author_creator TEXT DEFAULT '',
    release_date DATE,
    consumption_date DATE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'reading', 'watching', 'playing', 'listening', 'planning', 'paused', 'dropped')),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT DEFAULT '',
    tags TEXT[] DEFAULT '{}',
    genres TEXT[] DEFAULT '{}',
    external_url TEXT DEFAULT '',
    cover_image_url TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    favorite BOOLEAN DEFAULT FALSE,
    ai_analysis_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_inputs_user_id ON public.inputs(user_id);
CREATE INDEX IF NOT EXISTS idx_inputs_type ON public.inputs(type);
CREATE INDEX IF NOT EXISTS idx_inputs_status ON public.inputs(status);
CREATE INDEX IF NOT EXISTS idx_inputs_favorite ON public.inputs(favorite);
CREATE INDEX IF NOT EXISTS idx_inputs_created_at ON public.inputs(created_at);
CREATE INDEX IF NOT EXISTS idx_inputs_tags ON public.inputs USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_inputs_genres ON public.inputs USING GIN(genres);

-- Row Level Security (RLS) の有効化
ALTER TABLE public.inputs ENABLE ROW LEVEL SECURITY;

-- RLSポリシーの作成
CREATE POLICY "Users can view their own inputs" ON public.inputs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own inputs" ON public.inputs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own inputs" ON public.inputs
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inputs" ON public.inputs
    FOR DELETE USING (auth.uid() = user_id);

-- トリガー関数は既に001で作成済みのためスキップ

-- トリガーの作成
DROP TRIGGER IF EXISTS update_inputs_updated_at ON public.inputs;
CREATE TRIGGER update_inputs_updated_at
    BEFORE UPDATE ON public.inputs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 