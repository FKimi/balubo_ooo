# balubo - クリエイターのためのポートフォリオプラットフォーム

ライター・クリエイター向けのポートフォリオサイトです。作品を共有し、つながりを深め、新しい機会を見つけることができます。

## 🚀 特徴

- **プロフィール管理**: 詳細なプロフィール情報、スキル、キャリア情報の管理
- **作品ポートフォリオ**: 作品の投稿・管理・公開
- **リアルタイム同期**: MCP（Model Context Protocol）風の高度なデータベース連携
- **レスポンシブデザイン**: モダンなUI/UXデザイン

## 🛠 技術スタック

- **フロントエンド**: Next.js 14, TypeScript, Tailwind CSS
- **データベース**: Supabase (PostgreSQL)
- **認証**: Supabase Auth
- **リアルタイム**: Enhanced Supabase Client (MCP風)

## 📁 プロジェクト構造

```
src/
├── app/               # Next.js App Router pages
├── components/        # 共通UIコンポーネント
├── features/          # 機能別モジュール
│   ├── profile/       # プロフィール機能
│   │   ├── components/
│   │   └── hooks/
│   └── work/          # 作品機能
│       ├── components/
│       └── hooks/
├── lib/               # ユーティリティ・共通ロジック
│   ├── database/      # リポジトリパターン
│   │   ├── ProfileRepository.ts
│   │   ├── WorkRepository.ts
│   │   └── InputRepository.ts
│   ├── logger.ts      # 環境別ロガー
│   └── errors.ts      # 共通エラー型
└── __tests__/         # テストファイル
```

## ⚙️ セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

開発を開始する前に、環境変数ファイルを設定してください：

1. `.env.example`を`.env.local`にコピー
```bash
cp .env.example .env.local
```

2. `.env.local`ファイルを開き、実際の値を設定：
- `NEXT_PUBLIC_SUPABASE_URL`: SupabaseプロジェクトのURL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabaseの匿名キー
- `SUPABASE_SERVICE_ROLE_KEY`: Supabaseのサービスロールキー（公開プロフィール機能に必要）
- `GOOGLE_CLIENT_ID`: Google OAuth クライアントID
- `GOOGLE_CLIENT_SECRET`: Google OAuth クライアントシークレット
- `GEMINI_API_KEY`: Google Gemini APIキー

**重要**: `SUPABASE_SERVICE_ROLE_KEY`は公開プロフィール共有機能で使用されます。これにより、認証が不要な状況でも他のユーザーの公開データにアクセスできます。この値は機密情報なので、絶対に公開しないでください。

### 3. Supabaseの設定

#### データベースマイグレーション

```sql
-- プロフィールテーブルの作成
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  professions TEXT[],
  skills TEXT[],
  location TEXT,
  website_url TEXT,
  portfolio_visibility TEXT DEFAULT 'public',
  background_image_url TEXT,
  avatar_image_url TEXT,
  desired_rate TEXT,
  job_change_intention TEXT DEFAULT 'not_considering',
  side_job_intention TEXT DEFAULT 'not_considering',
  project_recruitment_status TEXT DEFAULT 'not_recruiting',
  experience_years INTEGER,
  working_hours TEXT,
  career JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### リアルタイム機能の有効化

**重要**: MCP風のリアルタイム機能を使用するために、以下の設定が必要です：

1. **Supabaseダッシュボードでの設定**:
   - プロジェクトの「Settings」→ 「API」に移動
   - 「Realtime」セクションで「profiles」テーブルを有効化
   - または以下のSQLを実行：

```sql
-- リアルタイム機能の有効化
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
```

2. **Row Level Security (RLS) の設定**:

```sql
-- RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のプロフィールのみアクセス可能
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 🔧 MCP風データベース連携について

本プロジェクトでは、Model Context Protocol (MCP) にインスパイアされた高度なSupabaseクライアントを実装しています：

### 特徴

- **自動フォールバック**: リアルタイム接続が失敗した場合、ポーリング方式に自動切り替え
- **エラーハンドリング**: 堅牢なエラー処理とリトライ機能
- **接続状態管理**: アクティブな購読とその状態の監視
- **タイムアウト処理**: 10秒のタイムアウトで接続失敗を検出

### 使用例

```typescript
import { getSupabaseBrowserClient } from '@/lib/supabase'

// プロフィールデータの取得
const supabase = getSupabaseBrowserClient()
const { data: profile, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single()

// リアルタイム購読
const subscription = supabase
  .channel('profiles')
  .on('postgres_changes', { 
    event: 'UPDATE', 
    schema: 'public', 
    table: 'profiles',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    console.log('プロフィールが更新されました:', payload.new)
})
  .subscribe()

// 購読の解除
subscription.unsubscribe()
```

## 🐛 トラブルシューティング

### リアルタイム機能のエラー

「リアルタイム購読でエラーが発生しました」が表示される場合：

1. **Supabaseプロジェクトの確認**:
   - リアルタイム機能がプランに含まれているか確認
   - `profiles`テーブルがリアルタイム対象に追加されているか確認

2. **ネットワーク接続の確認**:
   - WebSocketが利用可能な環境か確認
   - プロキシやファイアウォールの設定確認

3. **自動フォールバック**:
   - エラーが発生してもポーリング方式で動作継続
   - データの同期は5秒間隔で実行

### データベース接続エラー

1. 環境変数の確認
2. Supabaseプロジェクトの状態確認
3. APIキーの有効性確認

## 📝 ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## 🤝 コントリビューション

プルリクエストやイシューの報告を歓迎します。

## セキュリティ注意事項

- `.env.local`ファイルは絶対にGitにコミットしないでください
- APIキーなどの機密情報は環境変数として管理してください
- 本番環境では適切な環境変数を設定してください

## デプロイ

本番環境（Vercel等）では、環境変数を適切に設定してからデプロイしてください。

## トラブルシューティング

### デプロイエラー
- 環境変数が正しく設定されているか確認
- TypeScriptエラーがないか確認
- 必要な依存関係がインストールされているか確認 # Force redeploy Fri Oct 10 11:55:22 JST 2025
