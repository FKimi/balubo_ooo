// ブラウザの開発者ツールのコンソールで実行してテスト通知を作成
// 1. ログインしていることを確認
// 2. 開発者ツールを開く
// 3. このコードをコンソールに貼り付けて実行

async function createTestNotification() {
  try {
    // 現在のJWTトークンを取得（AuthContextから）
    const token = localStorage.getItem('supabase.auth.token') || 
                 sessionStorage.getItem('supabase.auth.token');
    
    if (!token) {
      console.error('認証トークンが見つかりません。ログインしてください。');
      return;
    }

    const response = await fetch('/api/notifications/test', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('テスト通知が作成されました:', result);
      // 通知ベルをチェックしてください
    } else {
      console.error('テスト通知の作成に失敗しました:', result);
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

// 実行
createTestNotification();