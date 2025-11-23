import { Work } from "../types";

export interface SkillCategory {
    name: string;
    score: number;
    color: string;
    fullMark: number;
}

export interface GrowthPhase {
    phase: string; // "2017年"や"2020-2022年"など実際の年を表示
    period: string;
    description: string;
    skills: string[];
    workCount: number;
}

export interface NextStep {
    title: string;
    description: string;
    type: "role" | "skill" | "action";
}

/**
 * スキルカテゴリを抽出してスコア化する
 */
export const extractSkillCategories = (works: Work[]): SkillCategory[] => {
    if (!works || works.length === 0) return [];

    const categories = {
        writing: { name: "ライティング", score: 0, color: "#3B82F6", keywords: ["Writer", "ライター", "Editor", "編集", "Copy", "コピー"] },
        design: { name: "デザイン", score: 0, color: "#8B5CF6", keywords: ["Designer", "デザイナー", "UI", "UX", "Web Design", "Graphic"] },
        strategy: { name: "戦略", score: 0, color: "#10B981", keywords: ["Director", "ディレクター", "Planner", "プランナー", "Strategy", "戦略"] },
        marketing: { name: "マーケティング", score: 0, color: "#F59E0B", keywords: ["Marketer", "マーケター", "SNS", "SEO", "Ads", "広告"] },
        tech: { name: "技術", score: 0, color: "#EF4444", keywords: ["Engineer", "エンジニア", "Coder", "コーダー", "Frontend", "Backend"] },
        planning: { name: "企画", score: 0, color: "#EC4899", keywords: ["Planner", "企画", "Concept", "コンセプト", "Idea", "アイデア"] },
    };

    works.forEach((work) => {
        // 役割からのスコア加算 (+15)
        work.roles?.forEach((role) => {
            Object.values(categories).forEach((cat) => {
                if (cat.keywords.some((k) => role.includes(k))) {
                    cat.score += 15;
                }
            });
        });

        // タグからのスコア加算 (+5)
        work.tags?.forEach((tag) => {
            Object.values(categories).forEach((cat) => {
                if (cat.keywords.some((k) => tag.includes(k))) {
                    cat.score += 5;
                }
            });
        });
    });

    // 正規化 (最大100)
    const result = Object.values(categories).map((cat) => ({
        ...cat,
        score: Math.min(100, cat.score),
        fullMark: 100,
    }));

    // スコアが0の項目を除外せず、レーダーチャートのために全て返す
    return result;
};

/**
 * 成長の軌跡を分析する（実際の年単位でフェーズ分け）
 */
export const analyzeGrowth = (works: Work[]): GrowthPhase[] => {
    if (!works || works.length === 0) return [];

    // 作品を日付順にソート
    const sortedWorks = [...works].sort(
        (a, b) =>
            new Date(a.date || a.productionDate || "").getTime() -
            new Date(b.date || b.productionDate || "").getTime()
    );

    // 年ごとにグループ化
    const worksByYear = new Map<number, Work[]>();
    sortedWorks.forEach(work => {
        const date = new Date(work.date || work.productionDate || "");
        const year = date.getFullYear();
        if (!isNaN(year) && year > 1900) { // 有効な年のみ
            const existing = worksByYear.get(year) || [];
            existing.push(work);
            worksByYear.set(year, existing);
        }
    });

    // 年の範囲を取得
    const years = Array.from(worksByYear.keys()).sort((a, b) => a - b);
    if (years.length === 0) return [];

    const phases: GrowthPhase[] = [];

    // 年をグループ化してフェーズを作成
    // 1-2年分を1フェーズとする（作品数が少ない場合は複数年まとめる）
    let currentPhaseYears: number[] = [];
    let currentPhaseWorks: Work[] = [];

    years.forEach((year, index) => {
        currentPhaseYears.push(year);
        const yearWorks = worksByYear.get(year) || [];
        currentPhaseWorks.push(...yearWorks);

        // 以下の条件でフェーズを確定:
        // - 作品が5件以上溜まった
        // - 2年以上経過した
        // - 最後の年
        const shouldCreatePhase =
            currentPhaseWorks.length >= 5 ||
            currentPhaseYears.length >= 2 ||
            index === years.length - 1;

        if (shouldCreatePhase && currentPhaseWorks.length > 0) {
            const startYear = currentPhaseYears[0];
            const endYear = currentPhaseYears[currentPhaseYears.length - 1];

            // フェーズ名: 単年なら"2017年"、複数年なら"2020-2022年"
            const phaseName = startYear === endYear
                ? `${startYear}年`
                : `${startYear}-${endYear}年`;

            // このフェーズでの主なスキル/役割を抽出
            const skills = Array.from(
                new Set(currentPhaseWorks.flatMap((w) => w.roles || []))
            ).slice(0, 3);

            // このフェーズでの主なタグを抽出
            const tags = Array.from(
                new Set(currentPhaseWorks.flatMap((w) => w.tags || []))
            ).slice(0, 3);

            // 説明文を生成
            const description = generatePhaseDescription(
                currentPhaseWorks.length,
                skills,
                tags,
                index === years.length - 1
            );

            phases.push({
                phase: phaseName,
                period: `${startYear}年${startYear === endYear ? '' : ` - ${endYear}年`}`,
                description,
                skills,
                workCount: currentPhaseWorks.length,
            });

            // リセット
            currentPhaseYears = [];
            currentPhaseWorks = [];
        }
    });

    return phases;
};

/**
 * フェーズの説明文を生成
 */
const generatePhaseDescription = (
    workCount: number,
    skills: string[],
    tags: string[],
    isCurrent: boolean
): string => {
    const skillText = skills.length > 0 ? skills.join("・") : "制作活動";
    const tagText = tags.length > 0 ? `（${tags.slice(0, 2).join("、")}など）` : "";

    if (isCurrent) {
        return `${skillText}として活動中。${tagText}幅広い領域で価値を発揮しています。`;
    } else if (workCount >= 10) {
        return `${skillText}として積極的に活動。${tagText}多数の実績を積み上げました。`;
    } else if (workCount >= 5) {
        return `${skillText}として活動。${tagText}着実に実績を重ねました。`;
    } else {
        return `${skillText}としての活動を開始。${tagText}経験を積みました。`;
    }
};

/**
 * 次のステップを提案する
 */
export const generateNextSteps = (works: Work[]): NextStep[] => {
    const steps: NextStep[] = [];
    const categories = extractSkillCategories(works);

    // スコアが高いカテゴリに基づく提案
    const topCategory = categories.sort((a, b) => b.score - a.score)[0];
    if (topCategory && topCategory.score > 0) {
        steps.push({
            title: `${topCategory.name}のスペシャリストへ`,
            description: `現在の強みである${topCategory.name}をさらに伸ばし、業界の第一人者を目指しましょう。`,
            type: "role",
        });
    }

    // バランスに基づく提案
    const scores = categories.map(c => c.score).filter(s => s > 0);
    if (scores.length > 0) {
        // 標準偏差の簡易計算
        const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
        const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
        const stdDev = Math.sqrt(variance);

        if (stdDev < 15 && scores.length >= 3) {
            steps.push({
                title: "独自のポジションを確立",
                description: "バランスの取れたスキルセットを活かし、複数の領域を横断するプロジェクトに挑戦しましょう。",
                type: "action"
            });
        } else if (stdDev > 30) {
            steps.push({
                title: "周辺スキルの習得",
                description: "強みに関連する周辺スキルを習得することで、対応できる案件の幅が広がります。",
                type: "skill"
            });
        }
    }

    // 作品数に基づく提案
    if (works.length < 5) {
        steps.push({
            title: "ポートフォリオの充実",
            description: "まずは5作品を目指して、実績を可視化していきましょう。",
            type: "action"
        });
    }

    // デフォルト
    if (steps.length === 0) {
        steps.push({
            title: "新しい領域への挑戦",
            description: "現在のスキルとは異なる分野のプロジェクトに参加し、知見を広げましょう。",
            type: "action"
        });
    }

    return steps.slice(0, 3);
};
