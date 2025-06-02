# Googleログイン機能の設定手順

このドキュメントでは、baluboアプリケーションでGoogleログイン機能を有効にするための設定手順を説明します。

## 1. Google Cloud Consoleでの設定

### 1.1 プロジェクトの作成または選択
1. [Google Cloud Console](https://console.cloud.google.com/)にアクセス
2. 新しいプロジェクトを作成するか、既存のプロジェクトを選択

### 1.2 Google+ APIの有効化
1. 「APIとサービス」→「ライブラリ」に移動
2. 「Google+ API」を検索して有効化

### 1.3 OAuth 2.0認証情報の作成
1. 「APIとサービス」→「認証情報」に移動
2. 「認証情報を作成」→「OAuth 2.0 クライアントID」を選択
3. アプリケーションの種類：「ウェブアプリケーション」
4. **承認済みの JavaScript 生成元**に以下を追加：
   - 開発環境：`http://localhost:3000`
   - 本番環境：`https://yourdomain.com`
5. **承認済みのリダイレクトURI**に以下を追加：
   - **Supabaseコールバック（必須）**: `https://kdrnxnorxquxvxutkwnq.supabase.co/auth/v1/callback`
   - 開発環境：`http://localhost:3000/auth/callback`
   - 本番環境：`https://yourdomain.com/auth/callback`

**重要**: Supabaseのコールバック URL `https://kdrnxnorxquxvxutkwnq.supabase.co/auth/v1/callback` を必ず追加してください。これがないとGoogleログインが失敗します。

## 2. Supabaseでの設定

### 2.1 Supabaseプロジェクトの設定
1. [Supabase Dashboard](https://app.supabase.com/)にログイン
2. プロジェクトを選択
3. 「Authentication」→「Providers」に移動

### 2.2 Google Providerの有効化
1. 「Google」プロバイダーを選択
2. 「Enable Google provider」をオンにする
3. Google Cloud Consoleで取得した以下の情報を入力：
   - **Client ID**: Google Cloud Consoleで作成したOAuth 2.0クライアントID
   - **Client Secret**: Google Cloud Consoleで作成したクライアントシークレット

### 2.3 リダイレクトURLの設定
Supabaseの設定画面で、以下のリダイレクトURLが正しく設定されていることを確認：
- 開発環境：`http://localhost:3000/auth/callback`
- 本番環境：`https://yourdomain.com/auth/callback`

## 3. 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# その他の既存設定
LINKPREVIEW_API_KEY=23c2c2d4e248bc250a0adf683ac26621
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

## 4. 実装済み機能

### 4.1 ログイン画面
- `/login`ページにGoogleログインボタンが追加済み
- 従来のメール/パスワードログインと併用可能

### 4.2 新規登録画面
- `/register`ページにGoogleアカウント登録ボタンが追加済み
- 従来のメール/パスワード登録と併用可能

### 4.3 認証フロー
1. ユーザーがGoogleログインボタンをクリック
2. Googleの認証画面にリダイレクト
3. ユーザーがGoogleアカウントで認証
4. `/auth/callback`ページで認証結果を処理
5. 成功時は`/profile`ページにリダイレクト

## 5. トラブルシューティング

### 5.1 よくあるエラー

**エラー**: "Supabase is not configured"
- **解決方法**: `.env.local`ファイルでSupabase環境変数が正しく設定されているか確認

**エラー**: "redirect_uri_mismatch"
- **解決方法**: Google Cloud ConsoleとSupabaseの両方でリダイレクトURIが一致しているか確認

**エラー**: "invalid_client"
- **解決方法**: Google Cloud ConsoleのクライアントIDとクライアントシークレットが正しくSupabaseに設定されているか確認

### 5.2 デバッグ方法
1. ブラウザの開発者ツールでネットワークタブを確認
2. Supabaseダッシュボードの「Authentication」→「Users」でユーザー作成状況を確認
3. コンソールログでエラーメッセージを確認

## 6. セキュリティ考慮事項

1. **クライアントシークレット**: 絶対に公開リポジトリにコミットしない
2. **リダイレクトURI**: 本番環境では必ずHTTPSを使用
3. **スコープ**: 必要最小限の権限のみを要求
4. **セッション管理**: Supabaseが自動的に処理

## 7. 今後の拡張可能性

- 他のOAuthプロバイダー（GitHub、Twitter等）の追加
- ソーシャルログイン後のプロフィール情報自動入力
- アカウント連携機能（既存アカウントとGoogleアカウントの紐付け）

---

**注意**: この機能を本番環境で使用する前に、必ずテスト環境で動作確認を行ってください。 