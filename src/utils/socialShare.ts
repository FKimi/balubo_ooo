import type { WorkData } from "@/features/work/types";

// X（Twitter）共有用のデータ型
interface ShareData {
  text: string;
  url?: string;
  hashtags?: string[];
}

// 作品共有用メッセージ生成
export function generateWorkShareMessage(
  work: WorkData,
  _userDisplayName: string = "クリエイター",
): ShareData {
  const contentTypeMap = {
    article: "記事",
    design: "デザイン",
    photo: "写真",
    video: "動画",
    podcast: "ポッドキャスト",
    event: "イベント",
  };

  const contentTypeText =
    contentTypeMap[work.content_type as keyof typeof contentTypeMap] || "作品";

  // 基本メッセージ
  let message = `新しい${contentTypeText}作品を公開しました！\n\n📝 ${work.title}`;

  // 説明文があれば追加（140文字制限を考慮）
  if (work.description && work.description.length > 0) {
    const maxDescLength = 50;
    const desc =
      work.description.length > maxDescLength
        ? work.description.substring(0, maxDescLength) + "..."
        : work.description;
    message += `\n\n${desc}`;
  }

  // 文字数統計があれば追加
  if (
    work.content_type === "article" &&
    work.article_word_count &&
    work.article_word_count > 0
  ) {
    message += `\n\n${work.article_word_count.toLocaleString()}文字`;
  }

  // 役割があれば追加
  if (work.roles && work.roles.length > 0) {
    const rolesText = work.roles.slice(0, 3).join("・");
    message += `\n🎯 ${rolesText}`;
  }

  message += "\n\n#ポートフォリオ #クリエイター";

  // ハッシュタグ生成
  const hashtags = ["balubo", "AI分析", "ポートフォリオ", "クリエイター"];

  // コンテンツタイプ別ハッシュタグ
  switch (work.content_type) {
    case "article":
      hashtags.push("記事", "ライター", "ライティング");
      break;
    case "design":
      hashtags.push("デザイン", "デザイナー", "クリエイティブ");
      break;
    case "photo":
      hashtags.push("写真", "フォトグラファー", "撮影");
      break;
    case "video":
      hashtags.push("動画", "映像制作", "ビデオ");
      break;
    case "podcast":
      hashtags.push("ポッドキャスト", "音声配信", "ラジオ");
      break;
    case "event":
      hashtags.push("イベント", "企画", "イベント制作");
      break;
  }

  // 作品タグを追加（最大3つまで）
  if (work.tags && work.tags.length > 0) {
    work.tags.slice(0, 3).forEach((tag) => {
      if (tag.length <= 10) {
        // 長すぎるタグは除外
        hashtags.push(tag);
      }
    });
  }

  const result: ShareData = {
    text: message,
    hashtags: hashtags.slice(0, 10), // 最大10個まで
  };

  // 作品詳細ページのURLを使用（external_urlの代わりに）
  if (work.id && typeof window !== "undefined") {
    result.url = `${window.location.origin}/works/${work.id}`;
  }

  return result;
}

// X共有URL生成
export function generateTwitterShareUrl(shareData: ShareData): string {
  const baseUrl = "https://twitter.com/intent/tweet";
  const params = new URLSearchParams();

  // テキスト設定
  params.append("text", shareData.text);

  // URL設定
  if (shareData.url) {
    params.append("url", shareData.url);
  }

  // ハッシュタグ設定
  if (shareData.hashtags && shareData.hashtags.length > 0) {
    params.append("hashtags", shareData.hashtags.join(","));
  }

  return `${baseUrl}?${params.toString()}`;
}

// 共有モーダル用コンポーネント用のデータ生成
export function generateShareModalData(
  data: WorkData,
  userDisplayName?: string,
) {
  const shareData = generateWorkShareMessage(data, userDisplayName);

  return {
    ...shareData,
    twitterUrl: generateTwitterShareUrl(shareData),
    preview: {
      type: "作品",
      title: data.title,
      message: shareData.text,
    },
  };
}

// 簡単共有（直接X画面を開く）
export function shareToTwitter(data: WorkData, userDisplayName?: string) {
  try {
    const shareData = generateWorkShareMessage(data, userDisplayName);
    const twitterUrl = generateTwitterShareUrl(shareData);

    // 新しいタブでX共有画面を開く
    window.open(
      twitterUrl,
      "_blank",
      "width=600,height=400,resizable=yes,scrollbars=yes",
    );
  } catch (error) {
    console.error("X共有エラー:", error);
  }
}
