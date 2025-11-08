import type { WorkData } from "@/features/work/types";
import { takeFirst } from "./arrayUtils";

// X（Twitter）共有用のデータ型
interface ShareData {
  text: string;
  url?: string;
  hashtags?: string[];
}

// AI分析の課題・解決策・成果を要約して投稿文に含める（140文字以内に収める）
function generateContentAnalysisSummary(work: WorkData, maxLength: number = 100): string {
  const analysis = work.ai_analysis_result as any;
  const contentAnalysis = analysis?.contentAnalysis;

  if (!contentAnalysis) return "";

  const parts: string[] = [];

  // 課題を簡潔に（最大30文字）
  if (contentAnalysis.problem) {
    const problem = contentAnalysis.problem.length > 30
      ? contentAnalysis.problem.substring(0, 27) + "..."
      : contentAnalysis.problem;
    parts.push(`🎯${problem}`);
  }

  // 解決策を簡潔に（最大35文字）
  if (contentAnalysis.solution) {
    const solution = contentAnalysis.solution.length > 35
      ? contentAnalysis.solution.substring(0, 32) + "..."
      : contentAnalysis.solution;
    parts.push(`💡${solution}`);
  }

  // 成果を強調（数値があれば強調、最大35文字）
  if (contentAnalysis.result) {
    let result = contentAnalysis.result;
    if (result.length > 35) {
      result = result.substring(0, 32) + "...";
    }
    parts.push(`✨${result}`);
  }

  const summary = parts.join(" ");
  
  // 最大文字数を超える場合はさらに短縮
  if (summary.length > maxLength) {
    const ratio = maxLength / summary.length;
    return parts.map(part => {
      const targetLength = Math.floor(part.length * ratio);
      return part.length > targetLength ? part.substring(0, targetLength - 1) + "..." : part;
    }).join(" ").substring(0, maxLength);
  }

  return summary;
}

// 作品共有用メッセージ生成（バイラル重視）
export function generateWorkShareMessage(
  work: WorkData,
  _userDisplayName: string = "クリエイター",
): ShareData {
  // タイトルを短縮（最大30文字）
  const title = work.title || "無題の作品";
  const shortTitle = title.length > 30
    ? title.substring(0, 27) + "..."
    : title;

  // AI分析の要約を取得（140文字以内に収めるため、残り文字数を計算）
  // タイトル + その他の固定文 = 約50文字を想定
  const availableLength = 90; // 140文字 - 50文字（タイトル等の余裕）
  const analysisSummary = generateContentAnalysisSummary(work, availableLength);

  // バイラルしやすい投稿文を構築（140文字以内）
  let message = "";

  // フック（興味を引く冒頭）
  if (analysisSummary) {
    message = `【${shortTitle}】\n${analysisSummary}\n\n詳細👇`;
  } else {
    // AI分析がない場合は従来の形式
    const desc = work.description && work.description.length > 0
      ? (work.description.length > 60
          ? work.description.substring(0, 57) + "..."
          : work.description)
      : "";
    
    message = `【${shortTitle}】\n${desc}\n\n詳細👇`;
  }

  // 140文字を超える場合は強制的に短縮
  if (message.length > 140) {
    message = message.substring(0, 137) + "...";
  }

  // ハッシュタグ生成（バイラル重視）
  const hashtags = ["balubo", "AI分析", "専門性証明"];

  // コンテンツタイプ別ハッシュタグ
  switch (work.content_type) {
    case "article":
      hashtags.push("記事", "ライター", "ライティング", "ビジネスコンテンツ");
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
    takeFirst(work.tags, 3).forEach((tag) => {
      if (tag.length <= 10 && !hashtags.includes(tag)) {
        hashtags.push(tag);
      }
    });
  }

  // AI分析から専門性タグを追加
  const analysis = work.ai_analysis_result as any;
  if (analysis?.tags && analysis.tags.length > 0) {
    takeFirst(analysis.tags as string[], 2).forEach((tag: string) => {
      if (tag.length <= 10 && !hashtags.includes(tag)) {
        hashtags.push(tag);
      }
    });
  }

  const result: ShareData = {
    text: message.trim(),
    hashtags: takeFirst(hashtags, 10), // 最大10個まで
  };

  // 作品詳細ページのURLを使用
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
