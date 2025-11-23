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
 * クリエイタータイプを判定する（タグベースの専門性検出）
 */
export const detectCreatorType = (works: Work[], inputs?: InputData[]): CreatorTypeResult => {
    if (!works || works.length === 0) {
        return {
            type: "新進クリエイター",
            description: "これからの活躍が期待されるクリエイター",
            icon: "🌱",
        };
    }

    // タグの使用頻度を集計
    const allTags = works.flatMap((work) => work.tags || []);
    const tagCounts = new Map<string, number>();
    allTags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });

    // 最も使用頻度の高いタグTOP3を取得
    const topTags = Array.from(tagCounts.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([tag]) => tag);

    // 役割の集計
    const allRoles = works.flatMap((work) => work.roles || []);
    const roleSet = new Set(allRoles);
    const primaryRole = allRoles.length > 0 ?
        Array.from(new Set(allRoles))
            .map(role => ({ role, count: allRoles.filter(r => r === role).length }))
            .sort((a, b) => b.count - a.count)[0]?.role || "クリエイター"
        : "クリエイター";

    // 業界・領域マッピング（タグから業界を特定）
    const industryMapping: Record<string, { industry: string; icon: string; description: string }> = {
        // 食品業界
        "米国食品業界ニュース": { industry: "食品業界", icon: "🍽️", description: "食品業界の専門知識と最新トレンドに精通" },
        "食品添加物規制": { industry: "食品規制", icon: "📋", description: "食品規制の専門知識を持つ" },
        "食品業界トレンド": { industry: "食品業界", icon: "📊", description: "食品業界のトレンド分析に強み" },
        "Food": { industry: "食品業界", icon: "🍽️", description: "食品分野の専門性を持つ" },

        // 医療・ヘルスケア
        "Medical": { industry: "医療業界", icon: "🏥", description: "医療分野の深い知識を持つ" },
        "Healthcare": { industry: "ヘルスケア業界", icon: "💊", description: "ヘルスケア領域の専門性を持つ" },
        "医療": { industry: "医療業界", icon: "🏥", description: "医療分野の専門知識を持つ" },
        "ヘルスケア": { industry: "ヘルスケア業界", icon: "💊", description: "ヘルスケア領域に精通" },
        "製薬": { industry: "製薬業界", icon: "💊", description: "製薬業界の専門知識を持つ" },

        // 金融・Fintech
        "Finance": { industry: "金融業界", icon: "💰", description: "金融分野の深い知見を持つ" },
        "Fintech": { industry: "Fintech", icon: "💳", description: "Fintech領域の専門性を持つ" },
        "金融": { industry: "金融業界", icon: "💰", description: "金融分野に精通" },
        "投資": { industry: "投資・資産運用", icon: "📈", description: "投資分野の専門知識を持つ" },

        // Technology・SaaS
        "Tech": { industry: "テクノロジー", icon: "💻", description: "最新技術に精通" },
        "Technology": { industry: "テクノロジー", icon: "💻", description: "技術分野の専門性を持つ" },
        "AI": { industry: "AI・機械学習", icon: "🤖", description: "AI分野の深い知識を持つ" },
        "SaaS": { industry: "SaaS", icon: "☁️", description: "SaaS業界の専門性を持つ" },
        "IT": { industry: "IT業界", icon: "💻", description: "IT分野に精通" },

        // BtoB・Business
        "BtoB": { industry: "BtoBマーケティング", icon: "🏢", description: "BtoB領域の専門性を持つ" },
        "Business": { industry: "ビジネス", icon: "💼", description: "ビジネス領域に精通" },
        "ビジネス": { industry: "ビジネス", icon: "📊", description: "ビジネス分野の専門知識を持つ" },

        // 不動産・教育・法律など
        "Real Estate": { industry: "不動産業界", icon: "🏠", description: "不動産分野の専門性を持つ" },
        "不動産": { industry: "不動産業界", icon: "🏠", description: "不動産業界に精通" },
        "Education": { industry: "教育業界", icon: "📚", description: "教育分野の専門性を持つ" },
        "教育": { industry: "教育業界", icon: "📚", description: "教育分野に精通" },
        "Law": { industry: "法律業界", icon: "⚖️", description: "法律分野の専門知識を持つ" },
        "法律": { industry: "法律業界", icon: "⚖️", description: "法律分野に精通" },

        // マーケティング・広告
        "Marketing": { industry: "マーケティング", icon: "📈", description: "マーケティング領域の専門性を持つ" },
        "マーケティング": { industry: "マーケティング", icon: "📈", description: "マーケティング分野に精通" },
        "SEO": { industry: "SEO・コンテンツマーケティング", icon: "🔍", description: "SEO領域の専門性を持つ" },
        "広告": { industry: "広告業界", icon: "📺", description: "広告分野に精通" },
    };

    // TOP3のタグから業界を特定
    let detectedIndustry: { industry: string; icon: string; description: string } | null = null;
    for (const tag of topTags) {
        if (industryMapping[tag]) {
            detectedIndustry = industryMapping[tag];
            break;
        }
    }

    // 役割名を日本語に変換
    const roleMapping: Record<string, string> = {
        "Writer": "ライター",
        "ライター": "ライター",
        "Editor": "エディター",
        "エディター": "エディター",
        "Designer": "デザイナー",
        "デザイナー": "デザイナー",
        "Marketer": "マーケター",
        "マーケター": "マーケター",
        "Planner": "プランナー",
        "プランナー": "プランナー",
    };

    const roleInJapanese = roleMapping[primaryRole] || primaryRole;

    // 業界が特定できた場合は、業界+役割の組み合わせで返す
    if (detectedIndustry) {
        return {
            type: `${detectedIndustry.industry}の${roleInJapanese}`,
            description: detectedIndustry.description,
            icon: detectedIndustry.icon,
        };
    }

    // 業界が特定できない場合は、役割と実績ベースで判定
    const roleCount = roleSet.size;

    // 複数の役割を持つ場合
    if (roleCount >= 3 && works.length >= 10) {
        return {
            type: "マルチスキル・クリエイター",
            description: "複数の専門領域を横断して活躍",
            icon: "🎭",
        };
    }

    if (works.length >= 20) {
        return {
            type: `${roleInJapanese}・スペシャリスト`,
            description: "豊富な実績を持つ専門家",
            icon: "💎",
        };
    }

    if (works.length >= 10) {
        return {
            type: `経験豊富な${roleInJapanese}`,
            description: "着実に実績を積み重ねている",
            icon: "⚡",
        };
    }

    if (works.length >= 5) {
        return {
            type: `成長中の${roleInJapanese}`,
            description: "実績を増やし続けている",
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
 * 主な専門性を抽出する (ビジネス/業界タグ優先、グルーピングあり)
 */
export const extractMainExpertise = (works: Work[]): string[] => {
    if (!works || works.length === 0) return [];

    // 業界カテゴリーマッピング（タグをグループ化）
    const industryCategories: Record<string, {
        category: string;
        tags: string[];
        weight: number
    }> = {
        food: {
            category: "食品業界",
            tags: ["米国食品業界ニュース", "食品添加物規制", "食品業界トレンド", "Food", "食品", "food"],
            weight: 10
        },
        medical: {
            category: "医療・ヘルスケア",
            tags: ["Medical", "Healthcare", "医療", "ヘルスケア", "看護", "医師", "製薬", "病院"],
            weight: 10
        },
        finance: {
            category: "金融・投資",
            tags: ["Finance", "Fintech", "金融", "投資", "株", "資産運用", "証券", "銀行"],
            weight: 10
        },
        tech: {
            category: "テクノロジー・IT",
            tags: ["Tech", "Technology", "IT", "技術", "エンジニアリング", "プログラミング"],
            weight: 10
        },
        ai: {
            category: "AI・機械学習",
            tags: ["AI", "機械学習", "ML", "Deep Learning", "人工知能"],
            weight: 10
        },
        saas: {
            category: "SaaS・クラウド",
            tags: ["SaaS", "Cloud", "クラウド", "Web3"],
            weight: 10
        },
        marketing: {
            category: "マーケティング・広告",
            tags: ["Marketing", "SEO", "Ads", "マーケティング", "広告", "PR"],
            weight: 10
        },
        business: {
            category: "ビジネス・経営",
            tags: ["Business", "BtoB", "ビジネス", "経営", "スタートアップ"],
            weight: 8
        },
        realEstate: {
            category: "不動産",
            tags: ["Real Estate", "不動産"],
            weight: 8
        },
        education: {
            category: "教育",
            tags: ["Education", "教育", "EdTech"],
            weight: 8
        },
        law: {
            category: "法律・法務",
            tags: ["Law", "Legal", "法律", "規制", "弁護士", "法務"],
            weight: 8
        },
        travel: {
            category: "旅行・観光",
            tags: ["Travel", "旅行", "観光", "Tourism"],
            weight: 8
        },
        beauty: {
            category: "美容・コスメ",
            tags: ["Beauty", "美容", "コスメ", "化粧品"],
            weight: 8
        }
    };

    // カテゴリーごとのスコアを計算
    const categoryScores: Record<string, { category: string; score: number; tagCount: number }> = {};

    works.forEach((work) => {
        work.tags?.forEach((tag) => {
            // どのカテゴリーに属するかチェック
            let matched = false;
            Object.entries(industryCategories).forEach(([key, { category, tags, weight }]) => {
                if (tags.some(t => tag.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(tag.toLowerCase()))) {
                    if (!categoryScores[key]) {
                        categoryScores[key] = { category, score: 0, tagCount: 0 };
                    }
                    categoryScores[key].score += weight;
                    categoryScores[key].tagCount += 1;
                    matched = true;
                }
            });

            // どのカテゴリーにもマッチしない場合は個別タグとしてカウント
            if (!matched) {
                const key = `other_${tag}`;
                if (!categoryScores[key]) {
                    categoryScores[key] = { category: tag, score: 0, tagCount: 0 };
                }
                categoryScores[key].score += 3; // 個別タグは低めの重み
                categoryScores[key].tagCount += 1;
            }
        });

        // 役割も低い重みでカウント
        work.roles?.forEach((role) => {
            const key = `role_${role}`;
            if (!categoryScores[key]) {
                categoryScores[key] = { category: role, score: 0, tagCount: 0 };
            }
            categoryScores[key].score += 2; // 役割は低めの重み
            categoryScores[key].tagCount += 1;
        });
    });

    // スコア順にソートして上位3つを取得
    const topExpertise = Object.values(categoryScores)
        .sort((a, b) => {
            // スコアが同じ場合は、タグの出現回数で比較
            if (b.score === a.score) {
                return b.tagCount - a.tagCount;
            }
            return b.score - a.score;
        })
        .slice(0, 3)
        .map(item => item.category);

    return topExpertise;
};

/**
 * クリエイターの3つの強みを抽出する (よく使用するタグから生成)
 */
export const extractCreatorStrengths = (works: Work[], inputs?: InputData[]): Array<{ title: string; subtitle: string; description: string; icon: string; type: 'core' | 'domain' | 'unique' }> => {
    const strengths = [];

    // タグの使用頻度を計算
    const allTags = works.flatMap((w) => w.tags || []);
    const tagCounts: Record<string, number> = {};
    allTags.forEach(t => tagCounts[t] = (tagCounts[t] || 0) + 1);
    const sortedTags = Object.entries(tagCounts).sort(([, a], [, b]) => b - a);

    // タグごとの専門性マッピング
    const getTagStrength = (tag: string, count: number, totalWorks: number): { title: string; subtitle: string; description: string; icon: string; type: 'core' | 'domain' | 'unique' } => {
        const ratio = Math.round((count / totalWorks) * 100);

        // 業界/領域別のマッピング
        const industryMap: Record<string, { title: string; subtitle: string; description: string; icon: string }> = {
            // 医療・ヘルスケア
            "Medical": { title: "医療業界の専門知識", subtitle: "DOMAIN EXPERTISE", description: `医療分野での制作実績が豊富で、専門用語や業界の文脈を深く理解しています。`, icon: "🏥" },
            "Healthcare": { title: "ヘルスケア領域のエキスパート", subtitle: "DOMAIN EXPERTISE", description: `ヘルスケア関連コンテンツの制作経験が豊富で、正確性と読みやすさを両立します。`, icon: "💊" },
            "医療": { title: "医療コンテンツの専門性", subtitle: "DOMAIN EXPERTISE", description: `医療分野での実績が${count}件。専門的な内容を分かりやすく伝えます。`, icon: "🏥" },

            // 金融・Fintech
            "Finance": { title: "金融業界の深い知見", subtitle: "DOMAIN EXPERTISE", description: `金融分野での制作実績が豊富で、複雑な金融商品や市場動向を分かりやすく説明できます。`, icon: "💰" },
            "Fintech": { title: "Fintechトレンドへの精通", subtitle: "DOMAIN EXPERTISE", description: `Fintech領域の最新動向をキャッチアップし、革新的なサービスを分かりやすく伝えます。`, icon: "💳" },
            "金融": { title: "金融コンテンツの専門性", subtitle: "DOMAIN EXPERTISE", description: `金融分野での実績が${count}件。経済や投資の専門知識を活かします。`, icon: "💰" },

            // Technology・SaaS
            "Tech": { title: "テクノロジートレンドへの理解", subtitle: "DOMAIN EXPERTISE", description: `技術トレンドを常にキャッチアップし、最新のテクノロジーを分かりやすく解説します。`, icon: "💻" },
            "SaaS": { title: "SaaSプロダクトへの深い理解", subtitle: "DOMAIN EXPERTISE", description: `SaaS業界での制作経験が豊富で、プロダクトの価値を効果的に伝えます。`, icon: "☁️" },
            "AI": { title: "AI・機械学習の知見", subtitle: "DOMAIN EXPERTISE", description: `AI・機械学習分野の実績が豊富で、複雑な技術を分かりやすく説明できます。`, icon: "🤖" },
            "IT": { title: "IT業界の幅広い知識", subtitle: "DOMAIN EXPERTISE", description: `IT分野での実績が${count}件。技術的な内容を分かりやすく伝えます。`, icon: "💻" },

            // BtoB・Business
            "BtoB": { title: "BtoBマーケティングの経験", subtitle: "DOMAIN EXPERTISE", description: `BtoB企業向けのコンテンツ制作が得意で、専門的な内容を効果的に伝えます。`, icon: "🏢" },
            "Business": { title: "ビジネスコンテンツの専門性", subtitle: "DOMAIN EXPERTISE", description: `ビジネス領域での実績が${count}件。経営層向けの提案も可能です。`, icon: "💼" },
            "ビジネス": { title: "ビジネス文脈の理解", subtitle: "DOMAIN EXPERTISE", description: `ビジネス関連のコンテンツ制作が得意で、戦略的な視点を持っています。`, icon: "📊" },

            // Marketing・SEO
            "Marketing": { title: "マーケティング視点のコンテンツ", subtitle: "UNIQUE VALUE", description: `マーケティングの知見を活かし、成果につながるコンテンツを制作します。`, icon: "📈" },
            "SEO": { title: "SEOを意識した制作", subtitle: "UNIQUE VALUE", description: `SEOの知識を活かし、検索エンジンで見つけられやすいコンテンツを制作します。`, icon: "🔍" },
            "マーケティング": { title: "マーケティング戦略の理解", subtitle: "UNIQUE VALUE", description: `マーケティング視点でコンテンツを企画・制作できます。`, icon: "📈" },

            // 不動産・教育・法律など
            "Real Estate": { title: "不動産業界の知見", subtitle: "DOMAIN EXPERTISE", description: `不動産分野での制作実績が豊富で、業界特有の専門用語を理解しています。`, icon: "🏠" },
            "Education": { title: "教育コンテンツの経験", subtitle: "DOMAIN EXPERTISE", description: `教育分野での制作経験を活かし、分かりやすく学びやすいコンテンツを作ります。`, icon: "📚" },
            "Law": { title: "法律領域の専門知識", subtitle: "DOMAIN EXPERTISE", description: `法律分野での実績が豊富で、正確性と分かりやすさを両立します。`, icon: "⚖️" },

            // 日本語の業界タグ
            "米国食品業界ニュース": { title: "食品業界ニュースの専門性", subtitle: "DOMAIN EXPERTISE", description: `米国食品業界関連の実績が${count}件。業界トレンドを深く理解しています。`, icon: "🍽️" },
            "食品添加物規制": { title: "食品規制への精通", subtitle: "DOMAIN EXPERTISE", description: `食品添加物や規制に関する専門知識を活かし、正確なコンテンツを制作します。`, icon: "📋" },
            "食品業界トレンド": { title: "食品業界トレンドの理解", subtitle: "DOMAIN EXPERTISE", description: `食品業界の最新トレンドをキャッチアップし、タイムリーなコンテンツを提供します。`, icon: "📊" },
        };

        // マッピングに該当するタグがある場合
        if (industryMap[tag]) {
            return { ...industryMap[tag], type: 'domain' as const };
        }

        // その他のタグの場合は汎用的な説明を生成
        return {
            title: `${tag}分野での実績`,
            subtitle: "CORE COMPETENCE",
            description: `${tag}に関連するコンテンツを${count}件制作。この領域での経験が豊富です。`,
            icon: "🎯",
            type: 'core' as const
        };
    };

    // TOP3のタグから強みを生成
    const top3Tags = sortedTags.slice(0, 3);
    top3Tags.forEach(([tag, count]) => {
        strengths.push(getTagStrength(tag, count, works.length));
    });

    // 強みが3つ未満の場合は補完
    while (strengths.length < 3) {
        const allRoles = works.flatMap((w) => w.roles || []);
        const uniqueRoles = new Set(allRoles);

        if (uniqueRoles.size > 0) {
            strengths.push({
                type: 'unique' as const,
                title: "多様なスキルセット",
                subtitle: "UNIQUE VALUE",
                description: "複数の役割をこなせる柔軟性と、幅広い制作スキルを持っています。",
                icon: "🛠️"
            });
        } else {
            strengths.push({
                type: 'unique' as const,
                title: "高い成長性",
                subtitle: "UNIQUE VALUE",
                description: "新しい分野にも積極的に挑戦し、常にスキルアップを続けています。",
                icon: "🚀"
            });
        }
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
