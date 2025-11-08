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
  const jobMatchingHints: string[] = [];
  topCategories.forEach((category) => {
    const hints = getJobMatchingHints(category.title);
    jobMatchingHints.push(...hints);
  });

  return {
    strengths: topCategories.map((cat) => ({
      title: cat.title,
      description: cat.tags.slice(0, 3).join(" / "),
    })),
    expertiseScore,
    consistencyScore,
    uniquenessScore,
    trendAnalysis,
    jobMatchingHints: [...new Set(jobMatchingHints)].slice(0, 3), // 重複除去して3つまで
  };
}

/**
 * カテゴリに基づく仕事マッチングのヒントを生成
 */
function getJobMatchingHints(category: string): string[] {
  const hintsMap: Record<string, string[]> = {
    "AI・機械学習活用": [
      "AI関連企業のコンテンツ制作",
      "技術ブログ・ホワイトペーパー執筆",
      "AI導入支援企業のマーケティング支援",
    ],
    "DX・デジタル変革": [
      "デジタルトランスフォーメーション関連の記事制作",
      "IT企業向けのサービス紹介コンテンツ",
      "業務効率化ソリューションの説明資料作成",
    ],
    マーケティング: [
      "マーケティング代理店でのコンテンツ制作",
      "ブランド戦略立案支援",
      "キャンペーン企画・実行支援",
    ],
    "UI/UX・デザイン": [
      "デザイン会社でのドキュメント作成",
      "プロダクトマネージャー支援",
      "ユーザー調査・分析レポート作成",
    ],
    ビジネス戦略: [
      "コンサルティングファームでの資料作成",
      "事業企画・戦略立案支援",
      "市場分析レポート作成",
    ],
    "スタートアップ・起業": [
      "スタートアップ企業のPR支援",
      "ピッチ資料・事業計画書作成",
      "起業支援サービスのコンテンツ制作",
    ],
    BtoBコンテンツ: [
      "BtoB企業のコンテンツマーケティング",
      "法人向けサービス紹介資料作成",
      "業界分析レポート作成",
    ],
    コピーライティング: [
      "広告代理店でのコピー制作",
      "ブランドメッセージ開発",
      "キャンペーン用コンテンツ作成",
    ],
  };

  return (
    hintsMap[category] || [
      `${category}関連の専門的なコンテンツ制作`,
      "業界レポート・分析資料の作成",
      "専門領域でのコンサルティング支援",
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
