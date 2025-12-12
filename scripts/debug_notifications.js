// ブラウザの開発者ツールのコンソールで実行してください

console.log('=== 通知機能デバッグ開始 ===');

// 1. 認証状態の確認
console.log('1. 認証状態の確認');
const authData = localStorage.getItem('sb-' + window.location.hostname.replace(/\./g, '-') + '-auth-token');
console.log('Auth data exists:', !!authData);
if (authData) {
  try {
    const parsed = JSON.parse(authData);
    console.log('Access token exists:', !!parsed.access_token);
    console.log('Token preview:', parsed.access_token?.substring(0, 20) + '...');
  } catch (e) {
    console.error('Auth data parse error:', e);
  }
}

// 2. 通知API直接テスト
console.log('\n2. 通知API直接テスト');
async function testNotificationAPI() {
  try {
    const authData = localStorage.getItem('sb-' + window.location.hostname.replace(/\./g, '-') + '-auth-token');
    if (!authData) {
      console.error('認証データが見つかりません');
      return;
    }

    const { access_token } = JSON.parse(authData);
    if (!access_token) {
      console.error('アクセストークンが見つかりません');
      return;
    }

    const response = await fetch('/api/notifications?limit=10', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log('API Response:', data);
    
    if (data.notifications) {
      console.log('通知数:', data.notifications.length);
      console.log('未読数:', data.unreadCount);
      data.notifications.forEach((notif, index) => {
        console.log(`通知${index + 1}:`, {
          id: notif.id,
          type: notif.type,
          message: notif.message,
          is_read: notif.is_read,
          created_at: notif.created_at
        });
      });
    }
  } catch (error) {
    console.error('API Test Error:', error);
  }
}

await testNotificationAPI();

// 3. 通知ベルコンポーネントの状態確認
console.log('\n3. 通知ベルコンポーネントの状態確認');
const bellElement = document.querySelector('[data-testid="notification-bell"]') || 
                   document.querySelector('button[aria-label*="通知"]') ||
                   document.querySelector('button svg[class*="Bell"]')?.parentElement;

if (bellElement) {
  console.log('通知ベル要素が見つかりました:', bellElement);
  
  // バッジ要素の確認
  const badge = bellElement.querySelector('[class*="badge"]') || 
                bellElement.querySelector('[class*="Badge"]') ||
                bellElement.querySelector('span[class*="absolute"]');
  console.log('バッジ要素:', badge);
  
  // クリックイベントの確認
  console.log('クリックイベントをシミュレート...');
  bellElement.click();
  
  setTimeout(() => {
    const dropdown = document.querySelector('[class*="dropdown"]') || 
                    document.querySelector('[class*="Dropdown"]') ||
                    document.querySelector('[role="menu"]');
    console.log('ドロップダウン要素:', dropdown);
  }, 100);
} else {
  console.error('通知ベル要素が見つかりません');
}

// 4. リアルタイム接続の確認
console.log('\n4. リアルタイム接続の確認');
if (window.supabase) {
  console.log('Supabase client exists');
  // リアルタイム接続状態の確認
  const channels = window.supabase.getChannels();
  console.log('Active channels:', channels.length);
  channels.forEach((channel, index) => {
    console.log(`Channel ${index}:`, channel.topic, channel.state);
  });
} else {
  console.log('Supabase client not found in window');
}

console.log('=== 通知機能デバッグ完了 ===');