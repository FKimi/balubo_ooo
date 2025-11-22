import { Work, InputData } from "../types";

export type CreatorType = string;

export interface CreatorTypeResult {
    type: CreatorType;
    description: string;
    icon: string;
}

export interface CareerFit {
    title: string;
    matchScore: number;
    reason: string;
    skills: string[];
}

/**
 * クリエイタータイプを判定する
 */
/**
 * クリエイタータイプを判定する
 */
export const detectCreatorType = (works: Work[], inputs?: InputData[]): CreatorTypeResult => {
    if (!works || works.length === 0) {
        return {
            type: "新進クリエイター",
            description: "これからの活躍が期待されるクリエイター",
            icon: "🌱",
        };
    }

    // 役割とタグの集計
    const allRoles = works.flatMap((work) => work.roles || []);
    const allTags = works.flatMap((work) => work.tags || []);
    const uniqueRoles = new Set(allRoles);
    const roleCount = uniqueRoles.size;

    // インプットタグの集計
    const inputTags = inputs?.flatMap(i => i.tags) || [];

    // 特定の専門領域タグ
    const medicalTags = ["Medical", "Healthcare", "医療", "ヘルスケア", "看護", "医師"];
    const financeTags = ["Finance", "Fintech", "金融", "投資", "株", "資産運用"];
    const techTags = ["Tech", "Technology", "AI", "SaaS", "Engineering", "IT", "Web3"];
    const marketingTags = ["Marketing", "SEO", "Ads", "マーケティング", "広告", "PR"];

    const hasTag = (tags: string[], targetTags: string[]) => tags.some(t => targetTags.includes(t));

    // ライター系の判定
    if (uniqueRoles.has("Writer") || uniqueRoles.has("ライター")) {
        if (hasTag(allTags, medicalTags)) {
            return { type: "メディカルライター", description: "医療・ヘルスケア領域の専門知識を持つ", icon: "🏥" };
        }
        if (hasTag(allTags, financeTags)) {
            return { type: "金融ライター", description: "金融・投資領域の専門知識を持つ", icon: "💰" };
        }
        if (hasTag(allTags, techTags) || hasTag(inputTags, techTags)) {
            return { type: "テックライター", description: "最新技術やITトレンドに精通している", icon: "💻" };
        }
        if (hasTag(allTags, marketingTags)) {
            return { type: "マーケティングライター", description: "マーケティング視点でコンテンツを制作", icon: "📈" };
        }
    }

    // デザイナー系の判定
    if (uniqueRoles.has("Designer") || uniqueRoles.has("デザイナー")) {
        if (hasTag(allTags, ["SaaS", "BtoB"])) {
            return { type: "SaaSプロダクトデザイナー", description: "複雑な業務課題をデザインで解決する", icon: "🔷" };
        }
        if (hasTag(allTags, ["Brand", "Branding", "Logo"])) {
            return { type: "ブランドデザイナー", description: "ブランドの世界観を視覚化する", icon: "🎨" };
        }
    }

    // 活動期間を計算（月数）
    const dates = works
        .map((w) => new Date(w.date || w.productionDate || new Date().toISOString()))
        .sort((a, b) => a.getTime() - b.getTime());

    const firstDate = dates[0] || new Date();
    const lastDate = dates[dates.length - 1] || new Date();
    const activityMonths =
        (lastDate.getFullYear() - firstDate.getFullYear()) * 12 +
        (lastDate.getMonth() - firstDate.getMonth());

    // 判定ロジック (既存)
    if (roleCount >= 4) {
        return {
            type: "マルチロールクリエイター",
            description: "複数の役割をこなす柔軟性が強み",
            icon: "🎭",
        };
    }

    if (roleCount >= 2 && works.length >= 10) {
        return {
            type: "ハイブリッドクリエイター",
            description: "複数の領域で実績を積み重ねている",
            icon: "⚡",
        };
    }

    if (works.length >= 20) {
        return {
            type: "スペシャリスト",
            description: "特定の領域で豊富な実績を持つ",
            icon: "💎",
        };
    }

    if (activityMonths >= 12 && works.length >= 8) {
        return {
            type: "コンスタントクリエイター",
            description: "継続的に作品を生み出している",
            icon: "🔄",
        };
    }

    if (works.length >= 5) {
        return {
            type: "成長中クリエイター",
            description: "着実に実績を増やしている",
            icon: "🚀",
        };
    }

    return {
        type: "新進クリエイター",
        description: "これからの活躍が期待されるクリエイター",
        icon: "🌱",
    };
};

/**
 * 活動期間を計算する
 */
export const calculateActivityPeriod = (works: Work[]): { years: number; months: number } => {
    if (!works || works.length === 0) {
        return { years: 0, months: 0 };
    }

    const dates = works
        .map((w) => new Date(w.date || w.productionDate || new Date().toISOString()))
        .filter((d) => !isNaN(d.getTime()))
        .sort((a, b) => a.getTime() - b.getTime());

    if (dates.length === 0) {
        return { years: 0, months: 0 };
    }

    const firstDate = dates[0] || new Date();
    // ウォークスルーの仕様に合わせて、単純に期間を計算

    // 現在までの期間とする場合
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - firstDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);

    return { years, months };
};

/**
 * 主な専門性を抽出する (ビジネス/業界タグ優先)
 */
export const extractMainExpertise = (works: Work[]): string[] => {
    if (!works || works.length === 0) return [];

    const tagCounts: Record<string, number> = {};
    const businessTags = [
        "Medical", "Healthcare", "Finance", "Fintech", "SaaS", "BtoB", "Marketing", "Real Estate",
        "Education", "Law", "Travel", "Food", "Beauty", "Tech", "AI", "Startup", "Business",
        "医療", "金融", "不動産", "教育", "法律", "旅行", "食", "美容", "技術", "経営"
    ];

    works.forEach((work) => {
        work.tags?.forEach((tag) => {
            if (businessTags.includes(tag) || businessTags.some(bt => tag.includes(bt))) {
                tagCounts[tag] = (tagCounts[tag] || 0) + 5; // ビジネス系タグは重み付け
            } else {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            }
        });
        // 役割もカウントするが重みは低く
        work.roles?.forEach((role) => {
            tagCounts[role] = (tagCounts[role] || 0) + 1;
        });
    });

    return Object.entries(tagCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3) // Top 3
        .map(([tag]) => tag);
};

/**
 * クリエイターの3つの強みを抽出する (データに基づく具体的強み)
 */
export const extractCreatorStrengths = (works: Work[], inputs?: InputData[]): Array<{ title: string; subtitle: string; description: string; icon: string; type: 'core' | 'domain' | 'unique' }> => {
    const strengths = [];

    // データ集計
    const allRoles = works.flatMap((w) => w.roles || []);
    const roleCounts: Record<string, number> = {};
    allRoles.forEach(r => roleCounts[r] = (roleCounts[r] || 0) + 1);
    const sortedRoles = Object.entries(roleCounts).sort(([, a], [, b]) => b - a);

    const allTags = works.flatMap((w) => w.tags || []);
    const tagCounts: Record<string, number> = {};
    allTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

    const inputTags = inputs?.flatMap(i => i.tags) || [];

    // 1. Core Competence (最も得意な役割/スキル)
    if (sortedRoles.length > 0 && sortedRoles[0]) {
        const [topRole, count] = sortedRoles[0];
        const ratio = Math.round((count / works.length) * 100);

        if (ratio >= 70) {
            strengths.push({
                type: 'core' as const,
                title: `${topRole}のスペシャリスト`,
                subtitle: "CORE COMPETENCE",
                description: `全作品の${ratio}%で${topRole}を担当。確固たる軸を持っています。`,
                icon: "🎯"
            });
        } else {
            strengths.push({
                type: 'core' as const,
                title: "マルチな制作スキル",
                subtitle: "CORE COMPETENCE",
                description: "複数の役割を柔軟にこなし、プロジェクト全体をカバーします。",
                icon: "🛠️"
            });
        }
    }

    // 2. Domain Expertise (最も得意な領域)
    // ビジネス系タグを優先して探す
    const businessTags = [
        "Medical", "Healthcare", "Finance", "Fintech", "SaaS", "BtoB", "Marketing", "Real Estate",
        "Education", "Law", "Travel", "Food", "Beauty", "Tech", "AI", "Startup", "Business",
        "医療", "金融", "不動産", "教育", "法律", "旅行", "食", "美容", "技術", "経営"
    ];

    const topBusinessTag = sortedTags.find(([tag]) => businessTags.includes(tag) || businessTags.some(bt => tag.includes(bt)));

    if (topBusinessTag) {
        strengths.push({
            type: 'domain' as const,
            title: `${topBusinessTag[0]}領域のエキスパート`,
            subtitle: "DOMAIN EXPERTISE",
            description: `${topBusinessTag[0]}関連の実績が豊富で、業界特有の文脈を理解しています。`,
            icon: "🏢"
        });
    } else if (sortedTags.length > 0 && sortedTags[0]) {
        // ビジネス系がなければトップのタグを使用
        strengths.push({
            type: 'domain' as const,
            title: `${sortedTags[0][0]}の実績多数`,
            subtitle: "DOMAIN EXPERTISE",
            description: `${sortedTags[0][0]}ジャンルでの制作経験が豊富です。`,
            icon: "🏆"
        });
    }

    // 3. Unique Value (掛け合わせやスタイル)
    const uniqueRoles = new Set(allRoles);
    const hasTechInput = inputTags.some(t => ["Tech", "AI", "Programming"].includes(t));
    const hasBusinessInput = inputTags.some(t => ["Business", "Marketing"].includes(t));

    if (uniqueRoles.has("Engineer") && uniqueRoles.has("Designer")) {
        strengths.push({
            type: 'unique' as const,
            title: "デザイン × エンジニアリング",
            subtitle: "UNIQUE VALUE",
            description: "実装可能性を考慮したデザインと、UIにこだわった実装が可能です。",
            icon: "⚡"
        });
    } else if (uniqueRoles.has("Writer") && hasTechInput) {
        strengths.push({
            type: 'unique' as const,
            title: "技術への深い理解",
            subtitle: "UNIQUE VALUE",
            description: "技術トレンドを常にキャッチアップし、専門的な内容も噛み砕いて表現します。",
            icon: "🔬"
        });
    } else if (uniqueRoles.has("Designer") && hasBusinessInput) {
        strengths.push({
            type: 'unique' as const,
            title: "ビジネス視点のデザイン",
            subtitle: "UNIQUE VALUE",
            description: "見た目の美しさだけでなく、ビジネス課題を解決するデザインを提案します。",
            icon: "💼"
        });
    } else {
        // デフォルトのユニークバリュー
        const period = calculateActivityPeriod(works);
        if (period.years >= 3) {
            strengths.push({
                type: 'unique' as const,
                title: "安定したプロジェクト進行",
                subtitle: "UNIQUE VALUE",
                description: "豊富な経験に基づき、確実かつ円滑にプロジェクトを推進します。",
                icon: "⚓"
            });
        } else {
            strengths.push({
                type: 'unique' as const,
                title: "高い成長性と吸収力",
                subtitle: "UNIQUE VALUE",
                description: "新しい技術やトレンドを貪欲に吸収し、アウトプットに反映させます。",
                icon: "🚀"
            });
        }
    }

    // 足りない場合は補完 (念のため)
    while (strengths.length < 3) {
        strengths.push({
            type: 'unique' as const,
            title: "クライアントワークの経験",
            subtitle: "PROFESSIONAL",
            description: "クライアントの要望を汲み取り、期待を超える提案を行います。",
            icon: "🤝"
        });
    }

    return strengths.slice(0, 3);
};

/**
 * キャリアフィット分析
 */
export const analyzeCareerFit = (works: Work[], inputs?: InputData[]): CareerFit[] => {
    if (!works || works.length === 0) return [];

    const fits: CareerFit[] = [];

    // 役割とタグの集計
    const allTags = works.flatMap((w) => w.tags || []);

    // インプット分析
    const inputTags = inputs?.flatMap(i => i.tags) || [];


    // 専門領域の特定（タグとインプットの両方から検出）
    const combinedTags = [...new Set([...allTags, ...inputTags])]; // Use Set to avoid duplicates
    const hasMedical = combinedTags.some(t => ["Medical", "Healthcare", "医療", "ヘルスケア", "製薬", "病院"].includes(t));
    const hasFinance = combinedTags.some(t => ["Finance", "Fintech", "金融", "投資", "証券", "銀行", "経済"].includes(t));
    const hasLegal = combinedTags.some(t => ["Law", "Legal", "法律", "規制", "弁護士", "法務"].includes(t));
    const hasTech = combinedTags.some(t => ["Tech", "Technology", "AI", "SaaS", "IT", "エンジニアリング", "プログラミング"].includes(t));
    const hasMarketing = combinedTags.some(t => ["Marketing", "マーケティング", "SEO", "広告", "PR"].includes(t));
    const hasBusiness = combinedTags.some(t => ["Business", "ビジネス", "経営", "スタートアップ", "BtoB"].includes(t));

    // 医療業界
    if (hasMedical) {
        fits.push({
            title: "医療業界のオウンドメディア記事執筆",
            matchScore: 95,
            reason: "医療知識を活かして、ヘルステック企業のブログコンテンツを制作",
            skills: ["医療知識", "SEO", "コンテンツ戦略"],
        });
        fits.push({
            title: "製薬業界の患者向け情報コンテンツ制作",
            matchScore: 92,
            reason: "専門性を活かして、正確でわかりやすい医療情報記事を執筆",
            skills: ["医療ライティング", "編集", "薬事法理解"],
        });
        fits.push({
            title: "ヘルスケア業界のプレスリリース作成",
            matchScore: 88,
            reason: "医療の専門性とライティングスキルでメディア向け記事を執筆",
            skills: ["PR", "メディアリレーション", "ストーリーテリング"],
        });
    }
    // 金融業界
    else if (hasFinance) {
        fits.push({
            title: "金融業界のホワイトペーパー作成",
            matchScore: 95,
            reason: "金融知識を活かして、投資家向けの専門的なコンテンツを制作",
            skills: ["金融知識", "コンテンツマーケティング", "データ分析"],
        });
        fits.push({
            title: "証券業界の投資情報記事執筆",
            matchScore: 92,
            reason: "金融リテラシーを活かして、投資家向けの情報記事を執筆",
            skills: ["金融ライティング", "市場分析", "編集"],
        });
        fits.push({
            title: "Fintech業界の解説記事・コラム執筆",
            matchScore: 88,
            reason: "経済ニュースや投資情報を分かりやすく解説する記事を執筆",
            skills: ["経済知識", "ニュース編集", "データ分析"],
        });
    }
    // 法律業界
    else if (hasLegal) {
        fits.push({
            title: "法律業界のオウンドメディア記事執筆",
            matchScore: 95,
            reason: "法律知識を活かして、法務SaaS企業のブログコンテンツを制作",
            skills: ["法律知識", "コンテンツ編集", "SEO"],
        });
        fits.push({
            title: "法律業界のWebサイト記事・コラム執筆",
            matchScore: 92,
            reason: "法律の専門性を活かして、一般向けの法律情報記事を執筆",
            skills: ["法律ライティング", "Web編集", "マーケティング"],
        });
        fits.push({
            title: "企業法務業界の解説記事執筆",
            matchScore: 88,
            reason: "企業の法務担当者向けに、法改正や判例情報の記事を執筆",
            skills: ["法律知識", "ビジネスライティング", "リサーチ"],
        });
    }
    // IT/Tech業界
    else if (hasTech) {
        fits.push({
            title: "IT業界の技術ドキュメント作成",
            matchScore: 95,
            reason: "技術ドキュメントやAPI仕様書など、エンジニア向けコンテンツを制作",
            skills: ["技術理解", "ドキュメント作成", "構造化"],
        });
        fits.push({
            title: "SaaS業界のブログ記事・ホワイトペーパー執筆",
            matchScore: 92,
            reason: "プロダクトの価値を伝えるブログやホワイトペーパーを執筆",
            skills: ["SaaS理解", "コンテンツ戦略", "SEO"],
        });
        fits.push({
            title: "テック業界の技術解説記事執筆",
            matchScore: 88,
            reason: "最新技術トレンドや製品レビュー記事を執筆",
            skills: ["技術知識", "ニュース編集", "トレンド分析"],
        });
    }
    // マーケティング業界
    else if (hasMarketing) {
        fits.push({
            title: "BtoB業界のケーススタディ記事作成",
            matchScore: 92,
            reason: "ホワイトペーパーやケーススタディでリード獲得を支援",
            skills: ["コンテンツ戦略", "SEO", "リード獲得"],
        });
        fits.push({
            title: "マーケティング業界のクライアント向けコンテンツ制作",
            matchScore: 88,
            reason: "複数クライアントのコンテンツ制作を担当",
            skills: ["ディレクション", "戦略立案", "プロジェクト管理"],
        });
        fits.push({
            title: "Web業界のSEO記事執筆",
            matchScore: 85,
            reason: "SEOを意識した記事で、オーガニック流入を増やす",
            skills: ["SEOライティング", "キーワード選定", "分析"],
        });
    }
    // ビジネス業界
    else if (hasBusiness) {
        fits.push({
            title: "ビジネス業界のオウンドメディア記事執筆",
            matchScore: 90,
            reason: "ビジネス知識を活かして、企業のブログコンテンツを制作",
            skills: ["ビジネスライティング", "SEO", "コンテンツ戦略"],
        });
        fits.push({
            title: "スタートアップ業界のPR記事・プレスリリース作成",
            matchScore: 88,
            reason: "スタートアップの魅力を伝えるPRコンテンツを制作",
            skills: ["PR", "ストーリーテリング", "メディアリレーション"],
        });
        fits.push({
            title: "BtoB業界のホワイトペーパー作成",
            matchScore: 85,
            reason: "専門的なビジネスコンテンツでリード獲得を支援",
            skills: ["ビジネス知識", "コンテンツマーケティング", "分析"],
        });
    }
    // デフォルト（専門領域が検出されない場合）
    else {
        fits.push({
            title: "メディア業界の記事執筆・編集",
            matchScore: 85,
            reason: "幅広いテーマで記事を執筆し、メディア運営に貢献",
            skills: ["ライティング", "編集", "SEO"],
        });
        fits.push({
            title: "企業のブログコンテンツ制作",
            matchScore: 82,
            reason: "企業のオウンドメディアで記事を執筆",
            skills: ["コンテンツ企画", "ライティング", "SEO"],
        });
        fits.push({
            title: "メディア業界のインタビュー記事執筆",
            matchScore: 80,
            reason: "対話を通じて情報を引き出し、記事を執筆",
            skills: ["ヒアリング", "構成力", "ライティング"],
        });
    }

    // スコア順にソートして上位3件を返す
    return fits.sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
};
