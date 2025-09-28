"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkData } from "@/features/work/types";

interface ThoughtProcessProps {
  works: WorkData[];
}

interface ThoughtProcessAnalysis {
  workingStyle: string[];
  valueOrientation: string[];
  communicationStyle: string[];
  problemSolvingApproach: string[];
  creativityPattern: string[];
}

export function ThoughtProcessSection({ works }: ThoughtProcessProps) {
  // 作品の説明文や実績から思考プロセスを分析する（実際のデータベースに基づく分析）
  const analyzeThoughtProcess = useMemo((): ThoughtProcessAnalysis => {
    if (works.length === 0) {
      return {
        workingStyle: ["データ不足のため分析できませんでした"],
        valueOrientation: ["より多くの作品情報が必要です"],
        communicationStyle: ["作品の説明文を追加してください"],
        problemSolvingApproach: ["詳細な制作プロセスの記載をお勧めします"],
        creativityPattern: ["創作の背景情報を充実させてください"],
      };
    }

    // 実際の作品データから詳細分析
    const descriptions = works
      .map((work) => work.description || "")
      .filter(Boolean);
    const allDescription = descriptions.join(" ");
    const workCount = works.length;
    const avgDescriptionLength =
      descriptions.length > 0 ? allDescription.length / descriptions.length : 0;

    // 作成期間の分析
    const dates = works
      .map((work) => new Date(work.created_at || ""))
      .filter((date) => !isNaN(date.getTime()));
    const hasDateRange = dates.length > 1;
    let workSpan = 0;
    if (hasDateRange) {
      const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
      const latest = new Date(Math.max(...dates.map((d) => d.getTime())));
      workSpan =
        (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 30); // 月単位
    }

    // 技術スタックの分析
    const allTechnologies = works
      .flatMap((work) => work.design_tools || [])
      .filter(Boolean);
    const uniqueTechnologies = new Set(allTechnologies).size;
    const techDiversity =
      uniqueTechnologies / Math.max(allTechnologies.length, 1);

    // 作品タイプの分析
    const workTypes = works
      .map((work) => work.content_type || "")
      .filter(Boolean);
    const uniqueTypes = new Set(workTypes).size;
    const typeDiversity = uniqueTypes / Math.max(workTypes.length, 1);

    const analysis: ThoughtProcessAnalysis = {
      workingStyle: [],
      valueOrientation: [],
      communicationStyle: [],
      problemSolvingApproach: [],
      creativityPattern: [],
    };

    // 働き方の特徴分析
    if (workCount >= 15) {
      analysis.workingStyle.push(
        "豊富な制作実績から、高い生産性と継続力を持つプロフェッショナルです。",
      );
      analysis.workingStyle.push(
        "多様なプロジェクトを並行して進められる、優れた時間管理能力があります。",
      );
    } else if (workCount >= 8) {
      analysis.workingStyle.push(
        "着実に作品を積み重ねる継続的な制作姿勢が特徴的です。",
      );
      analysis.workingStyle.push(
        "質と量のバランスを考慮した、計画的な制作アプローチを取っています。",
      );
    } else if (workCount >= 3) {
      analysis.workingStyle.push(
        "厳選したプロジェクトに集中的に取り組む、質重視の制作スタイルです。",
      );
    } else {
      analysis.workingStyle.push(
        "少数精鋭の作品で確実な成果を出す、集中型の制作アプローチです。",
      );
    }

    // 継続期間による分析
    if (workSpan > 12) {
      analysis.workingStyle.push(
        "長期間にわたる継続的な活動から、安定した制作力を持っています。",
      );
    } else if (workSpan > 6) {
      analysis.workingStyle.push(
        "中期的な視点で着実にスキルアップを図る計画性があります。",
      );
    }

    // 価値観・姿勢の分析
    if (avgDescriptionLength > 150) {
      analysis.valueOrientation.push(
        "制作プロセスや背景への深い理解を重視し、丁寧な説明を心がけています。",
      );
      analysis.valueOrientation.push(
        "作品に込めた想いや意図を大切にし、ストーリー性を重視する姿勢があります。",
      );
    } else if (avgDescriptionLength > 50) {
      analysis.valueOrientation.push(
        "要点を押さえた説明により、効率的な情報伝達を重視しています。",
      );
      analysis.valueOrientation.push(
        "実用性と美しさのバランスを考慮した、実践的なアプローチを取ります。",
      );
    } else {
      analysis.valueOrientation.push(
        "シンプルで直感的な表現を好み、本質的な価値に集中する傾向があります。",
      );
    }

    // コミュニケーションスタイル分析
    const detailKeywords = [
      "詳細",
      "具体的",
      "丁寧",
      "工夫",
      "こだわり",
      "プロセス",
    ];
    const efficiencyKeywords = ["効率", "シンプル", "最適", "迅速", "スムーズ"];

    const detailCount = detailKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;
    const efficiencyCount = efficiencyKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;

    if (detailCount > efficiencyCount) {
      analysis.communicationStyle.push(
        "詳細で丁寧な説明を通じて、深い理解を促すコミュニケーションを好みます。",
      );
      analysis.communicationStyle.push(
        "相手の立場を考慮し、分かりやすく情報を整理して伝える能力があります。",
      );
    } else if (efficiencyCount > detailCount) {
      analysis.communicationStyle.push(
        "要点を絞った効率的なコミュニケーションで、迅速な意思決定をサポートします。",
      );
      analysis.communicationStyle.push(
        "シンプルで明確な表現により、誤解を避ける配慮ができます。",
      );
    } else {
      analysis.communicationStyle.push(
        "状況に応じて詳細さと簡潔さのバランスを調整できる柔軟性があります。",
      );
    }

    // 問題解決アプローチ分析
    const systematicKeywords = [
      "分析",
      "データ",
      "検証",
      "測定",
      "改善",
      "ロジック",
    ];
    const creativeKeywords = [
      "アイデア",
      "インスピレーション",
      "発想",
      "創造",
      "表現",
      "オリジナル",
    ];

    const systematicCount = systematicKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;
    const creativeCount = creativeKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;

    if (systematicCount > creativeCount) {
      analysis.problemSolvingApproach.push(
        "データ分析や検証を重視した、論理的な問題解決アプローチを得意とします。",
      );
      analysis.problemSolvingApproach.push(
        "体系的なプロセスにより、再現性のある品質を保つことができます。",
      );
    } else if (creativeCount > systematicCount) {
      analysis.problemSolvingApproach.push(
        "創造的なアイデアと独自の発想で、革新的な解決策を提案します。",
      );
      analysis.problemSolvingApproach.push(
        "直感と経験を活かし、ユニークな価値を生み出すことを得意とします。",
      );
    } else {
      analysis.problemSolvingApproach.push(
        "論理的思考と創造性をバランスよく活用し、総合的な解決策を見つけます。",
      );
    }

    // 創造性パターン分析
    if (typeDiversity > 0.8) {
      analysis.creativityPattern.push(
        "多様な分野での制作経験により、幅広い表現力と適応力を持っています。",
      );
      analysis.creativityPattern.push(
        "異なるジャンルの知見を組み合わせ、革新的なアプローチを生み出します。",
      );
    } else if (typeDiversity > 0.5) {
      analysis.creativityPattern.push(
        "主要な専門領域を持ちながら、関連分野への展開力も備えています。",
      );
      analysis.creativityPattern.push(
        "専門性と多様性のバランスを保ち、安定した成果を生み出します。",
      );
    } else {
      analysis.creativityPattern.push(
        "特定の領域に深い専門性を持ち、一貫した高品質な成果を追求しています。",
      );
      analysis.creativityPattern.push(
        "専門分野での深い知識と経験により、独自の価値を提供できます。",
      );
    }

    if (techDiversity > 0.7) {
      analysis.creativityPattern.push(
        "多様な技術の習得により、技術的制約に囚われない自由な発想ができます。",
      );
    } else if (techDiversity > 0.4) {
      analysis.creativityPattern.push(
        "核となる技術を中心に、必要に応じて新しい技術を取り入れる柔軟性があります。",
      );
    }

    // 基本的な価値観を追加
    analysis.valueOrientation.push(
      "クリエイティブな表現を通じて、社会や人々に価値を提供することを重視しています。",
    );
    analysis.problemSolvingApproach.push(
      "ユーザーの視点を常に意識し、実用性の高い解決策を提案することを心がけています。",
    );

    return analysis;
  }, [works]);

  const analysis = analyzeThoughtProcess;

  // データドリブンな重要度順に並べ替え（頻度・長さ・多様性など簡易スコア）
  const rankItems = (items: string[]): string[] => {
    const scoreByKeyword: Record<string, number> = {
      継続: 3,
      計画: 2,
      詳細: 3,
      効率: 2,
      データ: 3,
      分析: 3,
      創造: 3,
      独自: 2,
      柔軟: 2,
      品質: 2,
    };
    return [...items]
      .map((text) => {
        const base = 1;
        const bonus = Object.entries(scoreByKeyword).reduce(
          (acc, [kw, v]) => acc + (text.includes(kw) ? v : 0),
          0,
        );
        return { text, score: base + bonus };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.text);
  };

  const generateSummary = (): string => {
    const totalWorks = works.length;
    if (totalWorks === 0) {
      return "ポートフォリオが充実すると、より詳細な思考プロセス分析が可能になります。";
    }

    // 実際のデータに基づく分析
    const descriptions = works
      .map((work) => work.description || "")
      .filter(Boolean);
    const allDescription = descriptions.join(" ");
    const avgDescLength =
      descriptions.length > 0 ? allDescription.length / descriptions.length : 0;
    const uniqueTypes = new Set(
      works.map((work) => work.content_type || "").filter(Boolean),
    ).size;
    const uniqueTechnologies = new Set(
      works.flatMap((work) => work.design_tools || []).filter(Boolean),
    ).size;

    // 分析キーワード
    const systematicKeywords = [
      "分析",
      "データ",
      "検証",
      "測定",
      "改善",
      "ロジック",
      "効率",
    ];
    const creativeKeywords = [
      "アイデア",
      "インスピレーション",
      "発想",
      "創造",
      "表現",
      "オリジナル",
    ];
    const detailKeywords = [
      "詳細",
      "具体的",
      "丁寧",
      "工夫",
      "こだわり",
      "プロセス",
    ];

    const systematicCount = systematicKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;
    const creativeCount = creativeKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;
    const detailCount = detailKeywords.filter((keyword) =>
      allDescription.includes(keyword),
    ).length;

    // 主要な思考特性を判定
    let primaryType = "";
    const secondaryTraits: string[] = [];

    if (systematicCount > creativeCount && systematicCount > detailCount) {
      primaryType = "論理的思考型";
      secondaryTraits.push("データに基づく分析的アプローチ");
    } else if (creativeCount > systematicCount && creativeCount > detailCount) {
      primaryType = "創造重視型";
      secondaryTraits.push("独創的なアイデア創出力");
    } else if (detailCount > systematicCount && detailCount > creativeCount) {
      primaryType = "丁寧実行型";
      secondaryTraits.push("細部への配慮と品質へのこだわり");
    } else {
      primaryType = "バランス型";
      secondaryTraits.push("論理と創造性の調和");
    }

    // 作品数による特性
    if (totalWorks >= 10) {
      secondaryTraits.push("継続的な制作力");
    }

    // 多様性による特性
    if (uniqueTypes >= 4) {
      secondaryTraits.push("多分野適応力");
    }

    // 技術的多様性
    if (uniqueTechnologies >= 5) {
      secondaryTraits.push("技術的好奇心");
    }

    // 説明力
    if (avgDescLength > 150) {
      secondaryTraits.push("詳細な企画・説明力");
    } else if (avgDescLength < 50) {
      secondaryTraits.push("簡潔な表現力");
    }

    const traitDescription =
      secondaryTraits.length > 0
        ? `、特に${secondaryTraits.slice(0, 2).join("と")}に優れています`
        : "";

    return `作品分析の結果、${primaryType}の傾向が強く${traitDescription}。クリエイティブな課題解決において独自の価値を発揮できることが分かります。`;
  };

  const summary = generateSummary();

  const ChipList = ({
    items,
    color = "gray",
  }: {
    items: string[];
    color?: "gray" | "blue";
  }) => (
    <div className="flex flex-wrap gap-2">
      {rankItems(items)
        .slice(0, 2)
        .map((item, index) => (
          <span
            key={index}
            className={`inline-flex items-center rounded-full border border-${color}-300 bg-white px-3 py-1 text-xs text-gray-700`}
          >
            {item}
          </span>
        ))}
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          ワークスタイル
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">制作アプローチの要点</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50/60 p-4 rounded border border-blue-100">
          <p className="text-sm text-blue-900 leading-relaxed">{summary}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">
              制作アプローチ
            </h4>
            <ChipList items={analysis.workingStyle} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">価値観・姿勢</h4>
            <ChipList items={analysis.valueOrientation} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">問題解決</h4>
            <ChipList items={analysis.problemSolvingApproach} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
