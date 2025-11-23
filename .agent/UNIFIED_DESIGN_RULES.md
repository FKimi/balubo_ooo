# 🎨 統一デザインルール 2025

**プロジェクト:** balubo  
**最終更新:** 2025-11-23  
**目的:** LP全体のデザイン一貫性を保ち、親しみやすく清潔感のある体験を提供

---

## 📖 目次

1. [全体のトーン](#1-全体のトーン)
2. [配色ルール](#2-配色ルール)
3. [形状と影のルール](#3-形状と影のルール)
4. [アイコンのルール](#4-アイコンのルール)
5. [レイアウトと整列のルール](#5-レイアウトと整列のルール)
6. [ノイズ削除のルール](#6-ノイズ削除のルール)
7. [セクション区切りのルール](#7-セクション区切りのルール)
8. [ユーザビリティ・UX原則](#8-ユーザビリティux原則)
9. [実装チェックリスト](#実装チェックリスト)

---

## 1. 全体のトーン

### 🎯 目標
「親しみやすさ」「清潔感」「柔らかさ」を最優先とする。

### 📌 インスピレーション
- **参考:** Nani!? (nani.now) のデザインテイスト
- **キーワード:** モダン、ミニマル、ソフト、プレミアム

### ✅ 実装例
```css
/* フォント */
font-family: "Inter", "Noto Sans JP", sans-serif;
font-weight: 400;
line-height: 1.6;
letter-spacing: -0.01em;
```

---

## 2. 配色ルール

### 🎨 カラーパレット

| 用途 | カラー | Tailwind | 備考 |
|------|--------|----------|------|
| **セクション背景(カード有)** | `#F4F7FF` | `bg-base-soft-blue` | 情報カード配置セクション |
| **セクション背景(カード無)** | `#FFFFFF` | `bg-white` | ヒーロー、フッターなど |
| **カード背景** | `#FFFFFF` | `bg-white` | 必要に応じて`bg-white/95` |
| **CTAボタン** | `#007AFF` | `variant="cta"` | 主要アクション |
| **テキスト(見出し)** | `#111111` | `text-gray-900` | 黒またはダークグレー |
| **テキスト(本文)** | `#333333` | `text-gray-600` | 読みやすいグレー |

### ✅ CSS変数定義
```css
:root {
  --primary: 211 100% 50%;        /* #007AFF */
  --secondary: 224 100% 98%;      /* #F4F7FF */
  --foreground: 0 0% 7%;          /* #111111 */
  --background: 0 0% 100%;        /* #FFFFFF */
}
```

### ❌ 禁止事項
- 装飾的なアクセント以外でのカラー文字乱用
- 中途半端なグレー背景の使用

---

## 3. 形状と影のルール

### 📐 角丸ルール

| 要素 | 角丸サイズ | Tailwind | 備考 |
|------|-----------|----------|------|
| **カード(大)** | `32px` | `rounded-[32px]` | メインカード |
| **カード(中)** | `24px` | `rounded-2xl` | サブカード、小カード |
| **ボタン(CTA)** | `999px` | `rounded-full` | ピル形状 |
| **タグ・バッジ** | `8px` | `rounded-lg` | 小要素 |

### 🌑 影のルール

```css
/* 柔らかい影 */
.shadow-soft {
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
}

/* 柔らかい影(強調) */
.shadow-soft-lg {
  box-shadow: 0 20px 50px rgba(37, 99, 235, 0.35);
}

/* クレイモーフィズム用 */
.shadow-clay {
  box-shadow: 0 12px 28px rgba(191, 219, 254, 0.95);
}
```

### ❌ 禁止事項
- `rounded-md` (8px) の使用 → `rounded-lg` (12px) 以上に
- `rounded-lg` (12px) のカード → `rounded-2xl` (24px) 以上に
- 濃すぎる影、エッジが固い影

---

## 4. アイコンのルール

### 🎨 クレイモーフィズムスタイル

**構造:** 外側の淡い丸 + 内側のグラデーション丸 + 柔らかい影

```tsx
{/* 標準的なクレイアイコン */}
<div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 shadow-[0_12px_28px_rgba(191,219,254,0.95)]">
  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-400 text-white shadow-[0_10px_26px_rgba(37,99,235,0.45)]">
    {/* アイコンSVG */}
  </div>
</div>
```

### ✅ 適用箇所
- 特徴セクションのアイコン
- ステップフローのアイコン
- プロフィールバッジ

---

## 5. レイアウトと整列のルール

### 📏 テキスト整列の原則

| セクションタイプ | 整列 | 理由 |
|-----------------|------|------|
| **情報セクション** | 左揃え | 視線の流れが自然、読みやすい |
| **CTAセクション** | 中央揃え | アクションへの注目を集める |

### ✅ 情報セクションの例
```tsx
<div className="mx-auto max-w-5xl text-left">
  <h2 className="mb-6 text-3xl font-bold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
    こんなお悩みはありませんか?
  </h2>
  <p className="text-lg leading-relaxed text-gray-600">
    説明文...
  </p>
</div>
```

### 📐 カード内テキストの整列
- 複数カラムのカードでは、各カード内の「タイトル+本文」ブロックの上端を揃える
- `min-h`や余白を使って「本文開始位置」を水平に揃える

---

## 6. ノイズ削除のルール

### 🗑️ 削除対象

#### ❌ 不要な英語ラベル
- `"Why balubo?"`
- `"Voices"`
- `"Recently Added"`
- `"Final step"`
- `"FAQ"`

#### ✅ 代わりに
- 日本語のメイン見出し(H2)がセクションタイトルとして機能

### 📝 簡潔な表現
- 「専門性可視化までの3ステップ」→ 削除または簡略化
- 見れば分かる情報の重複説明は避ける

---

## 7. セクション区切りのルール

### 🌊 波形デバイダーの使用

**原則:** 直線の境界線は禁止。柔らかい波形SVGを使用。

### 📐 適用ルール

| 遷移パターン | デバイダー配置 | カラー |
|-------------|---------------|--------|
| **白 → 薄い青** | 白セクションの最下部 | `text-blue-50` |
| **薄い青 → 白** | 薄い青セクションの最下部 | `text-white` |

### ✅ 実装例
```tsx
import { SectionDivider } from '@/components/landing/SectionDivider';

{/* 白背景セクション */}
<section className="bg-white">
  {/* コンテンツ */}
  <SectionDivider colorClass="text-blue-50" heightClass="h-10" />
</section>

{/* 薄い青背景セクション */}
<section className="bg-base-soft-blue">
  {/* コンテンツ */}
  <SectionDivider colorClass="text-white" heightClass="h-10" />
</section>
```

---

## 8. ユーザビリティ・UX原則

### 🎯 基本思想
「見た目の美しさ」だけでなく、「使いやすさ(Usability)」を徹底する。

### 1️⃣ Non-blocking (操作がブロックされない)

#### ✅ 実装ポイント
- 処理中も他の操作を可能な限り許容
- 長時間処理はキャンセル可能に
- モーダルはEscキーや背景クリックで閉じられる

```tsx
// モーダル実装例
<Dialog onEscapeKeyDown={handleClose} onInteractOutside={handleClose}>
  {/* コンテンツ */}
</Dialog>
```

### 2️⃣ Immediate Feedback (即座のフィードバック)

#### ✅ 実装ポイント
- ボタンクリック時の即座の反応
- ローディング状態の明示
- 成功/エラーの明確な通知

```tsx
// フィードバック実装例
const [isLoading, setIsLoading] = useState(false);

<Button 
  onClick={handleClick}
  disabled={isLoading}
>
  {isLoading ? '処理中...' : '送信'}
</Button>
```

### 3️⃣ Reversibility (可逆性)

#### ✅ 実装ポイント
- 「元の状態に戻る」導線を確保
- スクロール位置の保持
- モーダル閉じた後のコンテキスト維持

```tsx
// スクロール位置保持例
useEffect(() => {
  const scrollPos = window.scrollY;
  return () => {
    window.scrollTo(0, scrollPos);
  };
}, []);
```

### 💡 実装コストとのバランス
- **コア体験:** 徹底的に作り込む
- **その他:** 標準パターンで効率化

---

## 実装チェックリスト

### 🎨 デザイン

- [ ] セクション背景は`bg-white`または`bg-base-soft-blue`
- [ ] カードは`bg-white`で`rounded-2xl`以上
- [ ] CTAボタンは`rounded-full`で`#007AFF`
- [ ] テキストは`text-gray-900`または`text-gray-600`
- [ ] 影は`shadow-soft`または`shadow-soft-lg`

### 📐 レイアウト

- [ ] 情報セクションの見出しは左揃え
- [ ] CTAセクションは中央揃え
- [ ] カード内のテキスト開始位置が揃っている
- [ ] 不要な英語ラベルを削除

### 🌊 セクション区切り

- [ ] 白→薄い青の遷移に波形デバイダー
- [ ] 薄い青→白の遷移に波形デバイダー
- [ ] デバイダーの色が適切

### 🎯 UX

- [ ] モーダルはEscキーで閉じられる
- [ ] ローディング状態を表示
- [ ] エラーメッセージを表示
- [ ] スクロール位置を保持

---

## 🔧 トラブルシューティング

### Q: カードの角丸が統一されていない
**A:** `rounded-xl`以下を使用している箇所を`rounded-2xl`以上に変更

### Q: セクション見出しが中央揃えになっている
**A:** 情報セクションは`text-left`に変更(CTAセクション以外)

### Q: 影が濃すぎる
**A:** `shadow-soft`または`shadow-soft-lg`を使用

### Q: 波形デバイダーが表示されない
**A:** `SectionDivider`コンポーネントの`colorClass`を確認

---

## 📚 参考資料

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [デザイン監査レポート](./.agent/DESIGN_AUDIT_REPORT.md)

---

**最終更新:** 2025-11-23  
**メンテナンス:** このドキュメントは定期的に更新してください
