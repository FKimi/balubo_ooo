import type { WorkData } from "@/features/work/types";
import { takeFirst } from "./arrayUtils";

// X（Twitter）共有用のデータ型
interface ShareData {
  text: string;
  url?: string;
  hashtags?: string[];
}

// AI分析の課題・目的／想定読者／解決策／成果を要約して投稿文に含める（140文字以内に収める）
function generateContentAnalysisSummary(work: WorkData, maxLength: number = 100): string {
  const analysis = work.ai_analysis_result as any;
  const contentAnalysis = analysis?.contentAnalysis;

  if (!contentAnalysis) return "";

  const parts: string[] = [];
  const sanitizeLines = (value?: string) =>
    (value || "")
      .split("\n")
      .map((line: string) => line.replace(/^[・\-\*]\s*/, "").trim())
      .filter((line: string) => line.length > 0);
  const formatPart = (emoji: string, text: string, limit = 28) => {
    let trimmed = text.replace(/。+$/, "");
    if (trimmed.length > limit) {
      trimmed = trimmed.substring(0, limit - 3) + "...";
    }
    return `${emoji}${trimmed}`;
  };

  // 課題・目的
  const problemLines = sanitizeLines(
    contentAnalysis.problemPurpose || contentAnalysis.problem,
  );
  if (problemLines.length > 0) {
    parts.push(formatPart("🎯", problemLines[0]));
  }

  // 想定読者
  const targetLines = sanitizeLines(
    contentAnalysis.targetAudience || analysis?.targetAudience,
  );
  if (targetLines.length > 0) {
    parts.push(formatPart("👤", targetLines[0]));
  }

  // 解決策（切り口や構成）
  const solutionLines = sanitizeLines(
    contentAnalysis.solutionApproach || contentAnalysis.solution,
  );
  if (solutionLines.length > 0) {
    parts.push(formatPart("💡", solutionLines[0]));
  }

  // 成果を強調（数値があれば強調、箇条書きから最初の1項目を取得し、末尾の「。」を削除）
  const resultLines = sanitizeLines(contentAnalysis.result);
  if (resultLines.length > 0) {
    parts.push(formatPart("✨", resultLines[0]));
  }

  const summary = parts.join(" ");
  
  // 最大文字数を超える場合は、各項目を均等に短縮
  if (summary.length > maxLength) {
    const excess = summary.length - maxLength;
    const partCount = parts.length;
    const reducePerPart = Math.ceil(excess / partCount);
    
    const shortenedParts = parts.map(part => {
      // 絵文字を除いたテキスト部分を取得
      const emoji = part[0];
      const text = part.substring(1);
      const targetLength = Math.max(5, text.length - reducePerPart); // 最低5文字は残す
      const shortenedText = text.length > targetLength 
        ? text.substring(0, targetLength - 1) + "..."
        : text;
      return emoji + shortenedText;
    });
    
    return shortenedParts.join(" ").substring(0, maxLength);
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
    // タイトル部分と「詳細👇」の文字数を計算
    const titlePart = `【${shortTitle}】\n`;
    const footerPart = `\n\n詳細👇`;
    const fixedLength = titlePart.length + footerPart.length;
    const availableForSummary = 140 - fixedLength;
    
    // 分析要約が利用可能文字数を超える場合は短縮
    let finalSummary = analysisSummary;
    if (analysisSummary.length > availableForSummary) {
      // 各項目を均等に短縮
      const parts = analysisSummary.split(" ");
      const excess = analysisSummary.length - availableForSummary;
      const reducePerPart = Math.ceil(excess / parts.length);
      
      finalSummary = parts.map(part => {
        if (part.length <= reducePerPart + 3) return part; // 短すぎる場合はそのまま
        return part.substring(0, part.length - reducePerPart - 1) + "...";
      }).join(" ").substring(0, availableForSummary);
    }
    
    message = `${titlePart}${finalSummary}${footerPart}`;
  } else {
    // AI分析がない場合は従来の形式
    const titlePart = `【${shortTitle}】\n`;
    const footerPart = `\n\n詳細👇`;
    const fixedLength = titlePart.length + footerPart.length;
    const availableForDesc = 140 - fixedLength;
    
    const desc = work.description && work.description.length > 0
      ? (work.description.length > availableForDesc
          ? work.description.substring(0, availableForDesc - 3) + "..."
          : work.description)
      : "";
    
    message = `${titlePart}${desc}${footerPart}`;
  }

  // 念のため140文字を超える場合は強制的に短縮（最後の安全策）
  if (message.length > 140) {
    const titlePart = `【${shortTitle}】\n`;
    const footerPart = `\n\n詳細👇`;
    const fixedLength = titlePart.length + footerPart.length;
    const availableLength = 140 - fixedLength;
    
    if (analysisSummary) {
      const summaryOnly = analysisSummary.substring(0, availableLength);
      message = `${titlePart}${summaryOnly}${footerPart}`;
    } else {
      const desc = work.description || "";
      const descOnly = desc.substring(0, availableLength);
      message = `${titlePart}${descOnly}${footerPart}`;
    }
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
