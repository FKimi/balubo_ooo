import type { WorkData, WorkCategory } from "@/features/work/types";
import { CATEGORY_COLORS } from "@/utils/constants";

/**
 * 作品データからよく使用するタグを計算する
 */
export function calculateTopTags(works: WorkData[]): [string, number][] {
  const tagCount: { [key: string]: number } = {};

  works.forEach((work) => {
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);
}

/**
 * インプットデータからよく使用するタグを計算する
 */
export function calculateInputTopTags(inputs: any[]): [string, number][] {
  const tagCount: { [key: string]: number } = {};

  inputs.forEach((input) => {
    if (input.tags && Array.isArray(input.tags)) {
      input.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);
}

/**
 * 作品とインプットの両方からタグを統合集計する
 */
export function calculateCombinedTopTags(
  works: WorkData[],
  inputs: any[],
): [string, number][] {
  const tagCount: { [key: string]: number } = {};

  // 作品のタグを集計
  works.forEach((work) => {
    if (work.tags && Array.isArray(work.tags)) {
      work.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  // インプットのタグを集計
  inputs.forEach((input) => {
    if (input.tags && Array.isArray(input.tags)) {
      input.tags.forEach((tag: string) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    }
  });

  return Object.entries(tagCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);
}

/**
 * インプットデータからジャンル分布を計算する
 */
export function calculateGenreDistribution(inputs: any[]): [string, number][] {
  const genreCount: { [key: string]: number } = {};

  inputs.forEach((input) => {
    if (input.genres && Array.isArray(input.genres)) {
      input.genres.forEach((genre: string) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    }
  });

  return Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
}

/**
 * メディアタイプに対応するアイコンを取得する
 */
export function getMediaTypeIcon(type: string): string {
  const iconMap: { [key: string]: string } = {
    book: "本",
    manga: "漫画",
    movie: "映画",
    anime: "映像",
    tv: "TV",
    youtube: "動画",
    game: "ゲーム",
    podcast: "音声",
    other: "その他",
  };
  return iconMap[type] || "その他";
}

/**
 * メディアタイプの日本語名を取得する
 */
export function getMediaTypeLabel(type: string): string {
  const labelMap: { [key: string]: string } = {
    book: "書籍",
    manga: "漫画",
    movie: "映画",
    anime: "アニメ",
    tv: "TV番組",
    game: "ゲーム",
    podcast: "ポッドキャスト",
    other: "その他",
  };
  return labelMap[type] || "その他";
}

/**
 * インプット分析の統計情報を計算する
 */
export function calculateInputStats(inputs: any[]) {
  const totalInputs = inputs.length;
  const favoriteCount = inputs.filter((input) => input.favorite).length;
  const averageRating =
    totalInputs > 0
      ? inputs.reduce((sum, input) => sum + (input.rating || 0), 0) /
        totalInputs
      : 0;

  const typeDistribution = inputs.reduce(
    (acc, input) => {
      const type = input.type || "未分類";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return {
    totalInputs,
    favoriteCount,
    averageRating,
    typeDistribution,
  };
}

export function summarizeTopTags(topTags: [string, number][]): string {
  if (!topTags || topTags.length === 0) return "";

  // 上位3件のタグ名を取得
  const tagNames = topTags.slice(0, 3).map(([tag]) => tag);

  if (tagNames.length === 1) {
    return `${tagNames[0]}に関する作品が多く、専門性を発揮しています。`;
  }
  if (tagNames.length === 2) {
    return `${tagNames[0]}や${tagNames[1]}などの分野で多くの作品を制作しています。`;
  }
  return `${tagNames[0]}、${tagNames[1]}、${tagNames[2]}などの分野で多くの作品を制作しています。`;
}

function splitBulletLines(text: string) {
  if (!text) return [];
  return text
    .split("\n")
    .map((line) => line.replace(/^[・*-\s]+/, "").trim())
    .filter((line) => line.length > 0);
}

function formatBulletString(items: string[]) {
  if (!items || items.length === 0) return "";
  return items
    .map((item) => (item.startsWith("・") ? item : `・${item}`))
    .join("\n");
}

export interface CreatorContentAnalysisSummary {
  problemPurpose?: string;
  targetAudience?: string;
  solutionApproach?: string;
  result?: string;
  sourceCount: number;
}

export function aggregateCreatorContentAnalysis(
  works: WorkData[],
  {
    maxWorks = 8,
    maxItemsPerField = 4,
  }: { maxWorks?: number; maxItemsPerField?: number } = {},
): CreatorContentAnalysisSummary | null {
  if (!works || works.length === 0) return null;

  const sortedWorks = [...works].sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0).getTime();
    const dateB = new Date(b.updated_at || b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const targetWorks = sortedWorks
    .filter((work) => {
      const content = work.ai_analysis_result?.contentAnalysis;
      return Boolean(
        content?.problemPurpose ||
          content?.problem ||
          content?.targetAudience ||
          content?.solutionApproach ||
          content?.solution ||
          content?.result ||
          work.ai_analysis_result?.targetAudience ||
          work.ai_analysis_result?.detailedAnalysis?.targetReaderProfile,
      );
    })
    .slice(0, maxWorks);

  if (targetWorks.length === 0) return null;

  const collectFieldItems = (
    extractor: (_work: WorkData) => string | undefined,
  ) => {
    const seen = new Set<string>();
    const items: string[] = [];
    targetWorks.forEach((work) => {
      const raw = extractor(work);
      if (!raw) return;
      splitBulletLines(raw).forEach((line) => {
        if (!line || seen.has(line)) return;
        seen.add(line);
        items.push(line);
      });
    });
    return items.slice(0, maxItemsPerField);
  };

  const problemItems = collectFieldItems(
    (work) =>
      work.ai_analysis_result?.contentAnalysis?.problemPurpose ||
      work.ai_analysis_result?.contentAnalysis?.problem,
  );
  const targetItems = collectFieldItems(
    (work) =>
      work.ai_analysis_result?.contentAnalysis?.targetAudience ||
      work.ai_analysis_result?.targetAudience ||
      work.ai_analysis_result?.detailedAnalysis?.targetReaderProfile,
  );
  const solutionItems = collectFieldItems(
    (work) =>
      work.ai_analysis_result?.contentAnalysis?.solutionApproach ||
      work.ai_analysis_result?.contentAnalysis?.solution,
  );
  const resultItems = collectFieldItems(
    (work) => work.ai_analysis_result?.contentAnalysis?.result,
  );

  if (
    problemItems.length === 0 &&
    targetItems.length === 0 &&
    solutionItems.length === 0 &&
    resultItems.length === 0
  ) {
    return null;
  }

  return {
    problemPurpose: formatBulletString(problemItems),
    targetAudience: formatBulletString(targetItems),
    solutionApproach: formatBulletString(solutionItems),
    result: formatBulletString(resultItems),
    sourceCount: targetWorks.length,
  };
}

/**
 * 作品データから詳細な強み分析を行う
 */
export function analyzeStrengthsFromWorks(works: WorkData[]) {
  if (!works || works.length === 0) {
    return {
      strengths: [],
      expertiseScore: 0,
      consistencyScore: 0,
      uniquenessScore: 0,
      trendAnalysis: null,
      jobMatchingHints: [],
    };
  }

  // タグ出現回数集計
  const tagCounts = new Map<string, number>();
  const workTimestamps: number[] = [];

  works.forEach((work: any) => {
    const tags = work.ai_analysis_result?.tags || work.tags || [];
    tags.forEach((tag: string) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });

    // 作品のタイムスタンプ収集（トレンド分析用）
    if (work.created_at) {
      workTimestamps.push(new Date(work.created_at).getTime());
    }
  });

  if (tagCounts.size === 0) {
    return {
      strengths: [],
      expertiseScore: 0,
      consistencyScore: 0,
      uniquenessScore: 0,
      trendAnalysis: null,
      jobMatchingHints: [],
    };
  }

  // カテゴリ分析
  const categoryRules = AI_STRENGTH_CATEGORY_RULES;
  const categoryMap = new Map<
    string,
    { title: string; tags: string[]; count: number }
  >();

  tagCounts.forEach((count, tag) => {
    const rule = categoryRules.find((r) => r.regex.test(tag));
    const key = rule ? rule.title : "その他";
    const entry = categoryMap.get(key) || { title: key, tags: [], count: 0 };
    entry.tags.push(tag);
    entry.count += count;
    categoryMap.set(key, entry);
  });

  // 上位カテゴリ取得
  let topCategories = [...categoryMap.values()].sort(
    (a, b) => b.count - a.count,
  );
  let filtered = topCategories.filter((c) => c.title !== "その他");
  if (filtered.length === 0) {
    filtered = topCategories;
  }
  topCategories = filtered.slice(0, 3);

  // 専門度スコア計算（作品数、タグ多様性、一貫性）
  const totalWorks = works.length;
  const totalTags = Array.from(tagCounts.values()).reduce(
    (sum, count) => sum + count,
    0,
  );
  const uniqueTags = tagCounts.size;
  const expertiseScore = Math.min(
    100,
    Math.round(
      totalWorks * 10 + uniqueTags * 5 + (totalTags / works.length) * 2,
    ),
  );

  // 一貫性スコア（上位タグの集中度）
  const topTagCount =
    Array.from(tagCounts.values()).sort((a, b) => b - a)[0] || 0;
  const consistencyScore = Math.round((topTagCount / totalTags) * 100);

  // 独自性スコア（レアタグの割合）
  const rareTags = Array.from(tagCounts.values()).filter(
    (count) => count === 1,
  ).length;
  const uniquenessScore = Math.round((rareTags / uniqueTags) * 100);

  // トレンド分析
  let trendAnalysis = null;
  if (workTimestamps.length > 1) {
    workTimestamps.sort((a, b) => a - b);
    const recentWorks = workTimestamps.filter(
      (timestamp) => timestamp > Date.now() - 30 * 24 * 60 * 60 * 1000, // 過去30日
    );
    const trendScore =
      recentWorks.length > 0
        ? Math.round((recentWorks.length / workTimestamps.length) * 100)
        : 0;
    trendAnalysis = {
      recentActivity: recentWorks.length,
      trendScore,
      isActive: trendScore > 30,
    };
  }

  // 仕事マッチングのヒント生成
  const jobMatchingHints: JobMatchingHint[] = [];
  topCategories.forEach((category) => {
    const hints = getJobMatchingHints(category.title);
    jobMatchingHints.push(...hints);
  });

  // 重複を除去して3つまで（titleで判定）
  const uniqueHints = Array.from(
    new Map(jobMatchingHints.map((hint) => [hint.title, hint])).values(),
  ).slice(0, 3);

  return {
    strengths: topCategories.map((cat) => ({
      title: cat.title,
      description: cat.tags.slice(0, 3).join(" / "),
    })),
    expertiseScore,
    consistencyScore,
    uniquenessScore,
    trendAnalysis,
    jobMatchingHints: uniqueHints,
  };
}

/**
 * カテゴリに基づく仕事マッチングのヒントを生成（詳細版）
 */
export interface JobMatchingHint {
  title: string;
  description: string;
  reason: string;
  whyRecommended: string;
}

function getJobMatchingHints(category: string): JobMatchingHint[] {
  const hintsMap: Record<string, JobMatchingHint[]> = {
    "AI・機械学習活用": [
      {
        title: "AI関連企業のコンテンツ制作",
        description: "AI・機械学習を活用したサービスやプロダクトの紹介記事、技術ブログ、ホワイトペーパーの執筆",
        reason: "あなたの作品にはAI・機械学習に関する専門知識が豊富に含まれています。技術的な内容を分かりやすく伝える実績があります。",
        whyRecommended: "AI業界は急速に成長しており、専門的なコンテンツ制作の需要が高いです。あなたの技術理解を活かして、企業の技術コミュニケーションを支援できます。",
      },
      {
        title: "技術ブログ・ホワイトペーパー執筆",
        description: "エンジニア向けの技術解説記事や、企業の技術的な取り組みを紹介するホワイトペーパーの作成",
        reason: "技術的な内容を論理的に整理し、専門家にも一般読者にも伝わる文章を書く能力があります。",
        whyRecommended: "BtoB SaaS企業やテック企業は、技術的な信頼性を高めるために質の高い技術コンテンツを必要としています。",
      },
      {
        title: "AI導入支援企業のマーケティング支援",
        description: "AI導入を検討している企業向けの導入事例記事、導入ガイド、成功事例の作成",
        reason: "AI技術の実務的な活用方法を理解しており、導入企業の課題を理解したコンテンツを作成できます。",
        whyRecommended: "DX推進が進む中、AI導入を検討する企業が増えており、実践的なコンテンツの需要が高まっています。",
      },
    ],
    "DX・デジタル変革": [
      {
        title: "デジタルトランスフォーメーション関連の記事制作",
        description: "企業のDX推進事例、デジタル化の成功ストーリー、変革プロセスの解説記事の作成",
        reason: "デジタル変革の文脈を理解し、企業の課題と解決策を明確に伝える実績があります。",
        whyRecommended: "多くの企業がDXを推進しており、成功事例やノウハウを求める企業が多数存在します。",
      },
      {
        title: "IT企業向けのサービス紹介コンテンツ",
        description: "SaaSやクラウドサービスの機能説明、導入メリット、競合比較などのコンテンツ制作",
        reason: "ITサービスの価値を明確に伝え、技術的な内容を分かりやすく説明する能力があります。",
        whyRecommended: "BtoB SaaS市場は拡大しており、サービスを理解してもらうための質の高いコンテンツが常に必要です。",
      },
      {
        title: "業務効率化ソリューションの説明資料作成",
        description: "業務改善ツールの導入ガイド、ROI計算資料、社内提案資料の作成",
        reason: "業務プロセスの改善点を見出し、具体的な解決策を提示する実績があります。",
        whyRecommended: "働き方改革や業務効率化のニーズが高く、実践的な資料作成の需要が継続しています。",
      },
    ],
    マーケティング: [
      {
        title: "マーケティング代理店でのコンテンツ制作",
        description: "クライアント企業のブランドメッセージ開発、キャンペーン企画、コンテンツマーケティング戦略の立案",
        reason: "マーケティングの文脈を理解し、ターゲットに響くメッセージを創出する実績があります。",
        whyRecommended: "マーケティング代理店は常に質の高いコンテンツクリエイターを必要としており、実績のある方への需要が高いです。",
      },
      {
        title: "ブランド戦略立案支援",
        description: "企業のブランドポジショニング、メッセージ開発、ブランドガイドラインの作成",
        reason: "ブランドの本質を理解し、一貫性のあるメッセージを構築する能力があります。",
        whyRecommended: "ブランド戦略は企業の長期的な成長に直結するため、専門的な支援を求める企業が増えています。",
      },
      {
        title: "キャンペーン企画・実行支援",
        description: "マーケティングキャンペーンの企画書作成、コンテンツ制作、効果測定レポートの作成",
        reason: "キャンペーンの目的を明確にし、効果的なコンテンツを制作する実績があります。",
        whyRecommended: "デジタルマーケティングが主流となり、継続的なキャンペーン支援の需要が高まっています。",
      },
    ],
    "UI/UX・デザイン": [
      {
        title: "デザイン会社でのドキュメント作成",
        description: "デザインコンセプトの説明資料、デザインシステムのドキュメント、クライアント向け提案資料の作成",
        reason: "デザインの意図を言語化し、技術者と非技術者の両方に伝わる資料を作成する能力があります。",
        whyRecommended: "デザイン会社はクライアントへの説明力を高めるため、質の高いドキュメント作成を必要としています。",
      },
      {
        title: "プロダクトマネージャー支援",
        description: "プロダクトの機能仕様書、ユーザーストーリー、プロダクトロードマップの作成",
        reason: "プロダクトの価値を明確にし、開発チームとステークホルダーの橋渡しができる実績があります。",
        whyRecommended: "プロダクト開発の重要性が高まり、プロダクトマネージャーを支援する専門家の需要が増えています。",
      },
      {
        title: "ユーザー調査・分析レポート作成",
        description: "ユーザーインタビュー結果の分析、UX調査レポート、改善提案資料の作成",
        reason: "ユーザーの行動やニーズを分析し、具体的な改善提案に落とし込む実績があります。",
        whyRecommended: "ユーザー中心設計の重要性が高まり、データに基づいた改善提案の需要が継続しています。",
      },
    ],
    ビジネス戦略: [
      {
        title: "コンサルティングファームでの資料作成",
        description: "経営戦略の提案資料、市場分析レポート、事業計画書の作成",
        reason: "複雑なビジネス課題を整理し、論理的な解決策を提示する実績があります。",
        whyRecommended: "コンサルティングファームは高品質な資料作成を必要としており、専門的な支援を求める機会が多いです。",
      },
      {
        title: "事業企画・戦略立案支援",
        description: "新規事業の企画書、事業計画、市場参入戦略の立案と資料作成",
        reason: "市場の動向を分析し、実行可能な事業計画を立案する能力があります。",
        whyRecommended: "企業の新規事業開発が活発化しており、戦略立案を支援する専門家の需要が高まっています。",
      },
      {
        title: "市場分析レポート作成",
        description: "業界動向の分析、競合調査、市場機会の特定とレポート作成",
        reason: "データを分析し、ビジネスに活用できる洞察を導き出す実績があります。",
        whyRecommended: "市場環境の変化が激しい中、定期的な市場分析を必要とする企業が増えています。",
      },
    ],
    "スタートアップ・起業": [
      {
        title: "スタートアップ企業のPR支援",
        description: "プレスリリースの作成、メディア向け資料、投資家向けピッチ資料の作成",
        reason: "スタートアップの価値を明確に伝え、投資家やメディアに響くメッセージを創出する実績があります。",
        whyRecommended: "スタートアップは限られたリソースで最大限の効果を出す必要があり、質の高いPR支援の需要が高いです。",
      },
      {
        title: "ピッチ資料・事業計画書作成",
        description: "投資家向けのピッチデッキ、事業計画書、財務モデルの説明資料作成",
        reason: "事業の本質を理解し、投資家に伝わる形で整理する能力があります。",
        whyRecommended: "スタートアップの資金調達が活発化しており、効果的なピッチ資料作成の需要が継続しています。",
      },
      {
        title: "起業支援サービスのコンテンツ制作",
        description: "起業家向けのノウハウ記事、成功事例、起業支援プログラムの紹介コンテンツ作成",
        reason: "起業のプロセスを理解し、実践的なアドバイスを提供する実績があります。",
        whyRecommended: "起業支援サービスは信頼性の高いコンテンツを必要としており、専門的な支援を求める機会が多いです。",
      },
    ],
    BtoBコンテンツ: [
      {
        title: "BtoB企業のコンテンツマーケティング",
        description: "法人向けサービスの紹介記事、導入事例、業界レポートの作成",
        reason: "BtoBの購買プロセスを理解し、意思決定者に響くコンテンツを制作する実績があります。",
        whyRecommended: "BtoBマーケティングでは質の高いコンテンツが成約率に直結するため、専門的なコンテンツ制作の需要が高いです。",
      },
      {
        title: "法人向けサービス紹介資料作成",
        description: "企業向けSaaSやツールの機能説明、導入メリット、ROI計算資料の作成",
        reason: "企業の課題を理解し、サービス価値を明確に伝える能力があります。",
        whyRecommended: "BtoB SaaS市場は拡大しており、サービスを理解してもらうための質の高い資料が常に必要です。",
      },
      {
        title: "業界分析レポート作成",
        description: "特定業界の動向分析、市場規模の調査、トレンドレポートの作成",
        reason: "業界の構造を理解し、ビジネスに活用できる洞察を導き出す実績があります。",
        whyRecommended: "企業は意思決定の根拠として、定期的な業界分析を必要としており、専門的なレポート作成の需要が継続しています。",
      },
    ],
    コピーライティング: [
      {
        title: "広告代理店でのコピー制作",
        description: "広告キャンペーンのコピー、CM台本、SNS投稿文の作成",
        reason: "ターゲットに響くメッセージを創出し、ブランドの価値を伝える実績があります。",
        whyRecommended: "広告代理店は常に質の高いコピーライターを必要としており、実績のある方への需要が高いです。",
      },
      {
        title: "ブランドメッセージ開発",
        description: "企業のコアメッセージ、ブランドスローガン、コミュニケーションガイドラインの作成",
        reason: "ブランドの本質を理解し、一貫性のあるメッセージを構築する能力があります。",
        whyRecommended: "ブランドメッセージは企業の長期的な成長に直結するため、専門的な支援を求める企業が増えています。",
      },
      {
        title: "キャンペーン用コンテンツ作成",
        description: "マーケティングキャンペーンのコピー、メールマーケティング文、LPのコピー作成",
        reason: "キャンペーンの目的を明確にし、効果的なメッセージを制作する実績があります。",
        whyRecommended: "デジタルマーケティングが主流となり、継続的なキャンペーン支援の需要が高まっています。",
      },
    ],
    "医療・ヘルスケア": [
      {
        title: "医療機関向けのコンテンツ制作",
        description: "病院やクリニックのホームページ記事、患者向け情報コンテンツ、医療情報サイトの記事執筆",
        reason: "医療・ヘルスケア分野の専門知識を持ち、正確で分かりやすい情報を提供する実績があります。",
        whyRecommended: "医療機関は信頼性の高い情報発信を必要としており、専門知識を持つクリエイターの需要が高まっています。",
      },
      {
        title: "ヘルスケア企業のマーケティング支援",
        description: "ヘルスケア製品・サービスの紹介記事、健康情報コンテンツ、企業の取り組み紹介記事の作成",
        reason: "ヘルスケア業界の特性を理解し、適切な表現で情報を伝える能力があります。",
        whyRecommended: "ヘルスケア市場は成長を続けており、専門的なコンテンツ制作の需要が継続しています。",
      },
      {
        title: "医療情報サイトの記事執筆",
        description: "医療情報サイトの解説記事、健康情報の記事、医療ニュースの執筆",
        reason: "医療情報を正確に理解し、一般読者にも分かりやすく伝える実績があります。",
        whyRecommended: "医療情報の正確性が重視される中、専門知識を持つライターの需要が高まっています。",
      },
    ],
  };

  return (
    hintsMap[category] || [
      {
        title: `${category}関連の専門的なコンテンツ制作`,
        description: `${category}分野の専門知識を活かした記事、レポート、資料の作成`,
        reason: `あなたの作品には${category}に関する専門知識が豊富に含まれています。`,
        whyRecommended: `${category}分野は専門的なコンテンツを必要としており、実績のあるクリエイターへの需要が高いです。`,
      },
      {
        title: "業界レポート・分析資料の作成",
        description: "特定業界の動向分析、市場調査、トレンドレポートの作成",
        reason: "業界の構造を理解し、ビジネスに活用できる洞察を導き出す実績があります。",
        whyRecommended: "企業は意思決定の根拠として、定期的な業界分析を必要としており、専門的なレポート作成の需要が継続しています。",
      },
      {
        title: "専門領域でのコンサルティング支援",
        description: "専門知識を活かしたコンサルティング、アドバイザリー、戦略立案支援",
        reason: "専門分野の深い知識を持ち、実践的なアドバイスを提供する能力があります。",
        whyRecommended: "専門性の高いコンサルティング需要が増えており、実績のある専門家への需要が高まっています。",
      },
    ]
  );
}

/**
 * 作品データから生のタグデータを取得・集計
 */
export function getYourTagsFromWorks(
  works: WorkData[],
  limit: number = 20,
): Array<{ tag: string; count: number; category?: string | undefined }> {
  if (!works || works.length === 0) {
    return [];
  }

  // タグ出現回数集計
  const tagCounts = new Map<string, number>();
  works.forEach((work: any) => {
    const tags = work.ai_analysis_result?.tags || work.tags || [];
    tags.forEach((tag: string) => {
      if (tag && tag.trim()) {
        tagCounts.set(tag.trim(), (tagCounts.get(tag.trim()) ?? 0) + 1);
      }
    });
  });

  if (tagCounts.size === 0) {
    return [];
  }

  // カテゴリ判定用のルール
  const categoryRules = AI_STRENGTH_CATEGORY_RULES;

  // タグデータをカテゴリ付きで整理
  const tagsWithCategory = Array.from(tagCounts.entries())
    .map(([tag, count]) => {
      const rule = categoryRules.find((r) => r.regex.test(tag));
      return {
        tag,
        count,
        category: rule?.title,
      };
    })
    .sort((a, b) => b.count - a.count) // 出現回数で降順ソート
    .slice(0, limit); // 指定数に制限

  return tagsWithCategory;
}

/**
 * 作品データ配列をカテゴリごとにグループ化する（UIでのカテゴリ表示用）
 * @param works WorkData[]
 * @returns WorkCategory[]
 */
export function groupWorksByCategory(works: WorkData[]): WorkCategory[] {
  const categorizedWorks: WorkCategory[] = [];
  works.forEach((work) => {
    if (work.categories && work.categories.length > 0) {
      work.categories.forEach((categoryName) => {
        const existingCategory = categorizedWorks.find(
          (cat) => cat.name === categoryName,
        );
        if (existingCategory) {
          existingCategory.works.push(work);
        } else {
          const newCategory: WorkCategory = {
            id: `category_${categoryName.replace(/\s+/g, "_").toLowerCase()}`,
            name: categoryName,
            color: CATEGORY_COLORS.DEFAULT,
            works: [work],
          };
          categorizedWorks.push(newCategory);
        }
      });
    } else {
      let uncategorized = categorizedWorks.find(
        (cat) => cat.id === "uncategorized",
      );
      if (!uncategorized) {
        uncategorized = {
          id: "uncategorized",
          name: "未分類",
          color: CATEGORY_COLORS.UNCATEGORIZED,
          works: [],
        };
        categorizedWorks.push(uncategorized);
      }
      uncategorized.works.push(work);
    }
  });
  return categorizedWorks;
}

export const AI_STRENGTH_CATEGORY_RULES: { title: string; regex: RegExp }[] = [
  // --- デジタル・先端領域 ---
  {
    title: "AI・機械学習活用",
    regex: /AI|機械学習|人工知能|深層学習|ChatGPT|GPT|プロンプト/i,
  },
  {
    title: "DX・デジタル変革",
    regex: /DX|デジタル変革|IT導入|デジタル化|クラウド/i,
  },
  {
    title: "サステナビリティ・ESG",
    regex: /サステナビリティ|ESG|SDGs|環境|カーボンニュートラル|脱炭素/i,
  },
  {
    title: "スタートアップ・起業",
    regex: /スタートアップ|起業|資金調達|ピッチ|MVP/i,
  },

  // --- 業界特化 ---
  {
    title: "金融・フィンテック",
    regex: /金融|フィンテック|投資|ブロックチェーン|暗号資産|仮想通貨/i,
  },
  {
    title: "HR・人事",
    regex: /HR|人事|採用|組織開発|タレントマネジメント|働き方/i,
  },
  {
    title: "医療・ヘルスケア",
    regex: /医療|ヘルスケア|メディカル|健康|ウェルネス|バイオ/i,
  },
  {
    title: "教育・EdTech",
    regex: /教育|EdTech|e-?learning|学習|スキルアップ/i,
  },

  // --- ビジネス戦略領域 ---
  {
    title: "企画・アイデア創出",
    regex: /企画|アイデア|ブレインストーミング|0→1|0-1/i,
  },
  {
    title: "ビジネス戦略",
    regex: /ビジネス戦略|事業戦略|市場分析|競合分析|SWOT|ポジショニング/i,
  },
  {
    title: "コンサルティング",
    regex: /コンサル|コンサルティング|アドバイザリー|改善提案|課題解決/i,
  },
  {
    title: "プロジェクト管理",
    regex:
      /プロジェクト管理|PM|プロジェクトマネジメント|アジャイル|スクラム|カンバン/i,
  },
  {
    title: "事業開発",
    regex: /事業開発|BizDev|アライアンス|パートナーシップ|新規事業/i,
  },

  // --- マーケティング・PR ---
  {
    title: "マーケティング",
    regex: /マーケティング|マーケ|広告|プロモーション|キャンペーン/i,
  },
  {
    title: "PR・広報",
    regex: /PR|広報|メディアリレーション|プレスリリース|パブリシティ/i,
  },
  {
    title: "SNS運用",
    regex: /SNS|ソーシャルメディア|Twitter|Facebook|Instagram|TikTok/i,
  },

  // --- 専門領域 ---
  {
    title: "BtoBコンテンツ",
    regex: /B2B|BtoB|法人|企業向け|エンタープライズ/i,
  },
  {
    title: "テクニカルライティング",
    regex:
      /テクニカルライティング|技術文書|開発ドキュメント|APIドキュメント|SDK/i,
  },
  { title: "編集・校正", regex: /編集|校正|レビュー|校閲|チェック/i },
  {
    title: "翻訳・ローカライズ",
    regex: /翻訳|ローカライズ|多言語|英訳|和訳|国際化/i,
  },

  // --- クリエイティブ表現 ---
  { title: "UI/UX・デザイン", regex: /UI|UX|Figma|デザイン|ユーザー体験/i },
  {
    title: "ストーリーテリング",
    regex: /ストーリーテリング|物語|ナラティブ|シナリオライティング/i,
  },
  {
    title: "コピーライティング",
    regex: /コピーライティング|コピー制作|キャッチコピー|セールスコピー/i,
  },
  {
    title: "動画制作",
    regex:
      /動画制作|映像制作|ビデオ編集|モーショングラフィックス|AfterEffects|Premiere/i,
  },
  {
    title: "イラスト・グラフィック",
    regex: /イラスト|グラフィック|ドローイング|キャラクターデザイン/i,
  },
  {
    title: "クリエイティブディレクション",
    regex:
      /クリエイティブディレクション|アートディレクション|Creative ?Direction|CD/i,
  },

  // --- データ・リサーチ ---
  {
    title: "データ分析・リサーチ",
    regex: /データ分析|データサイエンス|統計|BI|リサーチ|調査/i,
  },

  // --- コミュニケーション ---
  {
    title: "ファシリテーション",
    regex: /ファシリテーション|会議進行|ワークショップ|合意形成/i,
  },
  {
    title: "交渉・調整力",
    regex: /交渉|ネゴシエーション|調整|ステークホルダー調整|折衝/i,
  },
  {
    title: "グローバル・多様性",
    regex: /グローバル|多様性|ダイバーシティ|国際|異文化|英語/i,
  },

  // --- 基本・汎用 ---
  { title: "文章構成力", regex: /ライティング|文章|構成|執筆/i },
  { title: "SEO・検索最適化", regex: /SEO|検索/i },
  { title: "読者目線", regex: /読者|ユーザー|ペルソナ/i },
];
