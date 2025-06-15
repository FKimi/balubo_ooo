-- メッセージ機能用テーブル作成

-- 1. conversations テーブル（会話・チャットルーム）
CREATE TABLE public.conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    participant_1_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    participant_2_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_message_content TEXT,
    last_message_sender_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 同じユーザー同士の重複会話を防ぐ
    CONSTRAINT unique_conversation UNIQUE (participant_1_id, participant_2_id),
    -- 自分自身との会話を防ぐ
    CONSTRAINT no_self_conversation CHECK (participant_1_id != participant_2_id)
);

-- 2. messages テーブル（個別メッセージ）
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. message_participants テーブル（参加者の状態管理）
CREATE TABLE public.message_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_archived BOOLEAN DEFAULT FALSE,
    is_muted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- 同じ会話に同じユーザーが重複参加することを防ぐ
    CONSTRAINT unique_participant UNIQUE (conversation_id, user_id)
);

-- インデックス作成
CREATE INDEX idx_conversations_participants ON public.conversations(participant_1_id, participant_2_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_unread ON public.messages(is_read, created_at) WHERE is_read = FALSE;
CREATE INDEX idx_message_participants_user ON public.message_participants(user_id);

-- RLS (Row Level Security) ポリシー設定

-- conversations テーブル
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversations they participate in" ON public.conversations
    FOR SELECT USING (
        auth.uid() = participant_1_id OR auth.uid() = participant_2_id
    );

CREATE POLICY "Users can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        auth.uid() = participant_1_id OR auth.uid() = participant_2_id
    );

CREATE POLICY "Users can update conversations they participate in" ON public.conversations
    FOR UPDATE USING (
        auth.uid() = participant_1_id OR auth.uid() = participant_2_id
    );

-- messages テーブル
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (participant_1_id = auth.uid() OR participant_2_id = auth.uid())
        )
    );

CREATE POLICY "Users can send messages to their conversations" ON public.messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.conversations 
            WHERE id = conversation_id 
            AND (participant_1_id = auth.uid() OR participant_2_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = sender_id);

-- message_participants テーブル
ALTER TABLE public.message_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own participation records" ON public.message_participants
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own participation records" ON public.message_participants
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation records" ON public.message_participants
    FOR UPDATE USING (auth.uid() = user_id);

-- 自動更新トリガー関数
CREATE OR REPLACE FUNCTION update_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_message_participants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- トリガー作成
CREATE TRIGGER trigger_update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_conversations_updated_at();

CREATE TRIGGER trigger_update_messages_updated_at
    BEFORE UPDATE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_messages_updated_at();

CREATE TRIGGER trigger_update_message_participants_updated_at
    BEFORE UPDATE ON public.message_participants
    FOR EACH ROW
    EXECUTE FUNCTION update_message_participants_updated_at();

-- 会話の最終メッセージ情報を自動更新する関数
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    -- 新しいメッセージが追加された場合
    IF TG_OP = 'INSERT' THEN
        UPDATE public.conversations 
        SET 
            last_message_at = NEW.created_at,
            last_message_content = NEW.content,
            last_message_sender_id = NEW.sender_id,
            updated_at = NOW()
        WHERE id = NEW.conversation_id;
        RETURN NEW;
    END IF;
    
    -- メッセージが削除された場合（最新メッセージを再計算）
    IF TG_OP = 'DELETE' THEN
        UPDATE public.conversations 
        SET 
            last_message_at = COALESCE(
                (SELECT created_at FROM public.messages 
                 WHERE conversation_id = OLD.conversation_id 
                 ORDER BY created_at DESC LIMIT 1), 
                NOW()
            ),
            last_message_content = COALESCE(
                (SELECT content FROM public.messages 
                 WHERE conversation_id = OLD.conversation_id 
                 ORDER BY created_at DESC LIMIT 1), 
                ''
            ),
            last_message_sender_id = (
                SELECT sender_id FROM public.messages 
                WHERE conversation_id = OLD.conversation_id 
                ORDER BY created_at DESC LIMIT 1
            ),
            updated_at = NOW()
        WHERE id = OLD.conversation_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

-- 最終メッセージ更新トリガー
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT OR DELETE ON public.messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_participants; 