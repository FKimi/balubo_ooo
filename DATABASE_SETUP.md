# Supabaseデータベース設定手順

このドキュメントでは、baluboアプリケーションでSupabaseデータベースを設定し、作品データを保存する手順を説明します。

## 1. Supabaseプロジェクトの設定

### 1.1 プロジェクトの確認
- プロジェクトURL: `https://kdrnxnorxquxvxutkwnq.supabase.co`
- 既にGoogleログイン機能で使用中のプロジェクトを利用

### 1.2 データベーステーブルの作成
Supabase Dashboard → SQL Editor で以下のSQLを実行：

```sql
-- 作品テーブルの作成
CREATE TABLE IF NOT EXISTS works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  external_url TEXT,
  tags TEXT[] DEFAULT '{}',
  roles TEXT[] DEFAULT '{}',
  banner_image_url TEXT,
  preview_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) を有効化
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分の作品のみアクセス可能
CREATE POLICY "Users can view their own works" ON works
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own works" ON works
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own works" ON works
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own works" ON works
  FOR DELETE USING (auth.uid() = user_id);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS works_user_id_idx ON works(user_id);
CREATE INDEX IF NOT EXISTS works_created_at_idx ON works(created_at DESC);

-- updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_works_updated_at BEFORE UPDATE ON works
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 2. 環境変数の設定

`.env.local`ファイルに以下を追加：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://kdrnxnorxquxvxutkwnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# 既存の設定
LINKPREVIEW_API_KEY=23c2c2d4e248bc250a0adf683ac26621
GEMINI_API_KEY=your_gemini_api_key_here
```

**注意**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`は、Supabase Dashboard → Settings → API から取得してください。

## 3. 実装済み機能

### 3.1 ハイブリッド対応
現在の実装では、以下のハイブリッド対応を行っています：

- **認証あり**: Supabaseデータベースに保存
- **認証なし（開発用）**: 既存のJSONファイル（`data/works.json`）に保存

### 3.2 API エンドポイント

#### 作品一覧取得
```
GET /api/works
```

#### 作品作成
```
POST /api/works
Content-Type: application/json

{
  "title": "作品タイトル",
  "description": "作品説明",
  "externalUrl": "https://example.com",
  "tags": ["タグ1", "タグ2"],
  "roles": ["役割1", "役割2"],
  "previewData": {
    "image": "https://example.com/image.jpg",
    "title": "プレビュータイトル"
  }
}
```

#### 作品取得
```
GET /api/works/[id]
```

#### 作品更新
```
PUT /api/works/[id]
Content-Type: application/json

{
  "title": "更新されたタイトル",
  "description": "更新された説明",
  "externalUrl": "https://example.com",
  "tags": ["タグ1", "タグ2"],
  "roles": ["役割1", "役割2"]
}
```

#### 作品削除
```
DELETE /api/works/[id]
```

## 4. データベーススキーマ

### works テーブル

| カラム名 | 型 | 説明 |
|---------|---|------|
| id | UUID | 主キー（自動生成） |
| user_id | UUID | ユーザーID（auth.usersテーブルの外部キー） |
| title | TEXT | 作品タイトル（必須） |
| description | TEXT | 作品説明 |
| external_url | TEXT | 外部URL |
| tags | TEXT[] | タグ配列 |
| roles | TEXT[] | 役割配列 |
| banner_image_url | TEXT | バナー画像URL |
| preview_data | JSONB | プレビューデータ（LinkPreview APIの結果） |
| created_at | TIMESTAMP | 作成日時 |
| updated_at | TIMESTAMP | 更新日時（自動更新） |

## 5. セキュリティ

### 5.1 Row Level Security (RLS)
- 各ユーザーは自分の作品のみアクセス可能
- 認証されていないユーザーはデータにアクセス不可

### 5.2 認証
- Supabase Authを使用
- Googleログイン対応済み
- JWTトークンによる認証

## 6. 既存データの移行

現在`data/works.json`に保存されている作品データをSupabaseに移行する場合：

1. Googleログインでユーザー認証を行う
2. 既存のJSONデータを読み込み
3. 各作品をSupabaseに保存
4. 移行完了後、JSONファイルをバックアップとして保持

## 7. トラブルシューティング

### 7.1 よくあるエラー

**エラー**: "Invalid URL"
- **解決方法**: 環境変数`NEXT_PUBLIC_SUPABASE_URL`が正しく設定されているか確認

**エラー**: "JWT expired"
- **解決方法**: ユーザーの再ログインが必要

**エラー**: "Row Level Security policy violation"
- **解決方法**: ユーザーが認証されているか、適切なuser_idが設定されているか確認

### 7.2 デバッグ方法
1. Supabase Dashboard → Authentication → Users でユーザー状況を確認
2. Supabase Dashboard → Table Editor → works でデータ状況を確認
3. ブラウザの開発者ツールでネットワークリクエストを確認

---

**注意**: この機能を本番環境で使用する前に、必ずテスト環境で動作確認を行ってください。 