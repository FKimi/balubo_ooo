"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkData } from "@/features/work/types";

interface MatchingAffinityProps {
  works: WorkData[];
}

interface ProjectMatch {
  title: string;
  description: string;
  matchReason: string;
  compatibility: number; // 1-100
  icon: string;
}

interface CompanyMatch {
  companyType: string;
  industry: string;
  description: string;
  matchReason: string;
  compatibility: number; // 1-100
  icon: string;
}

interface MatchingAnalysis {
  projectMatches: ProjectMatch[];
  companyMatches: CompanyMatch[];
  topStrengths: string[];
  recommendedSkills: string[];
}

export function MatchingAffinitySection({ works }: MatchingAffinityProps) {
  // ポートフォリオ内容からマッチング分析を行う（実際のデータベースに基づく分析）
  const analyzeMatching = (): MatchingAnalysis => {
    if (works.length === 0) {
      return {
        projectMatches: [
          {
            title: "ポートフォリオ制作プロジェクト",
            description: "個人や企業のブランディングサイト制作",
            matchReason: "まずはポートフォリオを充実させることから始めましょう",
            compatibility: 85,
            icon: "📁",
          },
        ],
        companyMatches: [
          {
            companyType: "スタートアップ企業",
            industry: "IT・Web",
            description: "成長意欲の高い少数精鋭チーム",
            matchReason: "新しいチャレンジを積極的に取り組める環境",
            compatibility: 75,
            icon: "🚀",
          },
        ],
        topStrengths: ["学習意欲", "成長ポテンシャル", "柔軟性"],
        recommendedSkills: [
          "作品説明力",
          "プレゼンテーション",
          "ポートフォリオ構築",
        ],
      };
    }

    // 実際の作品データを詳細分析
    const workTypes = works
      .map((work) => work.content_type?.toLowerCase() || "")
      .filter(Boolean);
    const uniqueTypes = new Set(workTypes);
    const descriptions = works
      .map((work) => work.description || "")
      .filter(Boolean);
    const allDescription = descriptions.join(" ");
    const avgDescLength =
      descriptions.length > 0 ? allDescription.length / descriptions.length : 0;
    const designTools = works
      .flatMap((work) => work.design_tools || [])
      .filter(Boolean);
    const uniqueTechnologies = new Set(
      designTools.map((tech) => tech.toLowerCase()),
    );

    // 業界キーワード分析
    const industryKeywords = {
      ecommerce: ["ec", "shop", "ショップ", "通販", "オンライン", "販売"],
      finance: ["金融", "銀行", "投資", "finance", "資産", "保険"],
      healthcare: ["医療", "病院", "health", "健康", "クリニック"],
      education: ["教育", "学習", "education", "学校", "スクール"],
      entertainment: ["エンタメ", "ゲーム", "音楽", "映画", "entertainment"],
      corporate: ["企業", "コーポレート", "会社", "business", "btob"],
      startup: ["スタートアップ", "ベンチャー", "startup", "新規"],
    };

    const experiencedIndustries = Object.entries(industryKeywords)
      .filter(([_industry, keywords]) =>
        keywords.some((keyword) =>
          allDescription.toLowerCase().includes(keyword),
        ),
      )
      .map(([industry]) => industry);

    const analysis: MatchingAnalysis = {
      projectMatches: [],
      companyMatches: [],
      topStrengths: [],
      recommendedSkills: [],
    };

    // 作品タイプに基づくプロジェクトマッチング（より詳細）
    const webTypes = ["web", "サイト", "website", "landing", "lp"];
    const uiTypes = ["ui", "ux", "app", "アプリ", "interface", "dashboard"];
    const graphicTypes = [
      "graphic",
      "logo",
      "ロゴ",
      "poster",
      "ポスター",
      "flyer",
    ];
    const brandingTypes = ["branding", "ブランド", "identity", "ci", "vi"];

    if (workTypes.some((type) => webTypes.some((web) => type.includes(web)))) {
      const worksWithType = works.filter(
        (w) =>
          (w.content_type || "").toLowerCase() &&
          webTypes.some((web) =>
            (w.content_type || "").toLowerCase().includes(web),
          ),
      ).length;
      const typeRatio = works.length > 0 ? worksWithType / works.length : 0;
      const modernToolList = ["react", "vue", "next", "typescript"];
      const toolMatch = designTools.filter((t) =>
        modernToolList.includes(String(t).toLowerCase()),
      ).length;
      const toolRatio =
        designTools.length > 0 ? toolMatch / designTools.length : 0;
      const comp = Math.round(60 + 40 * (0.7 * typeRatio + 0.3 * toolRatio));

      analysis.projectMatches.push({
        title: "Webサイト・ランディングページ制作",
        description: "コーポレートサイト、ECサイト、プロモーションサイトの制作",
        matchReason: "Web系の作品比率と関連ツールの使用状況に基づく評価",
        compatibility: Math.max(55, Math.min(95, comp)),
        icon: "🌐",
      });
    }

    if (workTypes.some((type) => uiTypes.some((ui) => type.includes(ui)))) {
      const worksWithType = works.filter(
        (w) =>
          (w.content_type || "").toLowerCase() &&
          uiTypes.some((ui) =>
            (w.content_type || "").toLowerCase().includes(ui),
          ),
      ).length;
      const typeRatio = works.length > 0 ? worksWithType / works.length : 0;
      const uiToolList = ["figma", "sketch", "adobe xd", "react", "vue"];
      const toolMatch = designTools.filter((t) =>
        uiToolList.includes(String(t).toLowerCase()),
      ).length;
      const toolRatio =
        designTools.length > 0 ? toolMatch / designTools.length : 0;
      const comp = Math.round(60 + 40 * (0.7 * typeRatio + 0.3 * toolRatio));

      analysis.projectMatches.push({
        title: "モバイルアプリ・WebアプリUI/UX設計",
        description: "ユーザー体験を重視したデジタルプロダクトの設計・開発",
        matchReason: "UI/UX関連の作品比率とツール使用状況に基づく評価",
        compatibility: Math.max(55, Math.min(95, comp)),
        icon: "📱",
      });
    }

    if (
      workTypes.some((type) =>
        graphicTypes.some((graphic) => type.includes(graphic)),
      )
    ) {
      const worksWithType = works.filter(
        (w) =>
          (w.content_type || "").toLowerCase() &&
          graphicTypes.some((g) =>
            (w.content_type || "").toLowerCase().includes(g),
          ),
      ).length;
      const typeRatio = works.length > 0 ? worksWithType / works.length : 0;
      const graphicToolList = ["illustrator", "photoshop", "indesign"];
      const toolMatch = designTools.filter((t) =>
        graphicToolList.includes(String(t).toLowerCase()),
      ).length;
      const toolRatio =
        designTools.length > 0 ? toolMatch / designTools.length : 0;
      const comp = Math.round(60 + 40 * (0.7 * typeRatio + 0.3 * toolRatio));

      analysis.projectMatches.push({
        title: "グラフィックデザイン・印刷物制作",
        description: "ポスター、パンフレット、名刺、パッケージデザイン等",
        matchReason: "グラフィック領域の作品比率とツール適合度に基づく評価",
        compatibility: Math.max(55, Math.min(95, comp)),
        icon: "🎨",
      });
    }

    if (
      workTypes.some((type) =>
        brandingTypes.some((brand) => type.includes(brand)),
      )
    ) {
      const worksWithType = works.filter(
        (w) =>
          (w.content_type || "").toLowerCase() &&
          brandingTypes.some((b) =>
            (w.content_type || "").toLowerCase().includes(b),
          ),
      ).length;
      const typeRatio = works.length > 0 ? worksWithType / works.length : 0;
      const brandingToolList = ["illustrator", "photoshop", "figma"];
      const toolMatch = designTools.filter((t) =>
        brandingToolList.includes(String(t).toLowerCase()),
      ).length;
      const toolRatio =
        designTools.length > 0 ? toolMatch / designTools.length : 0;
      const comp = Math.round(60 + 40 * (0.7 * typeRatio + 0.3 * toolRatio));

      analysis.projectMatches.push({
        title: "ブランドアイデンティティ構築",
        description: "ロゴ設計からトータルブランディングまでの一貫したデザイン",
        matchReason: "ブランディング関連の実績密度とツール適合度に基づく評価",
        compatibility: Math.max(55, Math.min(95, comp)),
        icon: "🏆",
      });
    }

    // 経験値と多様性に基づくマッチング
    if (works.length >= 8 && uniqueTypes.size >= 3) {
      const volumeRatio = Math.min(1, works.length / 15);
      const diversityRatio = Math.min(1, uniqueTypes.size / 5);
      const comp = Math.round(
        65 + 35 * (0.6 * volumeRatio + 0.4 * diversityRatio),
      );
      analysis.projectMatches.push({
        title: "クリエイティブディレクション・プロジェクト統括",
        description: "複数のクリエイター・デザイナーを統括するディレクター職",
        matchReason: "制作量と分野多様性の指標に基づく評価",
        compatibility: Math.min(95, comp),
        icon: "🎯",
      });
    }

    // デフォルトマッチング
    if (analysis.projectMatches.length === 0) {
      analysis.projectMatches.push({
        title: "デジタルコンテンツ制作",
        description: "SNS投稿、バナー、プレゼン資料等の制作業務",
        matchReason:
          "クリエイティブスキルを活かして多様なコンテンツ制作に貢献できます",
        compatibility: 82,
        icon: "✨",
      });
    }

    // 企業タイプマッチング（実績に基づく）
    if (
      experiencedIndustries.includes("finance") ||
      experiencedIndustries.includes("corporate")
    ) {
      const industryMatch = 1;
      const techDiversity = Math.min(1, uniqueTechnologies.size / 6);
      const comp = Math.round(
        65 + 35 * (0.8 * industryMatch + 0.2 * techDiversity),
      );
      analysis.companyMatches.push({
        companyType: "大手企業・金融機関",
        industry: "金融・保険・コンサルティング",
        description: "信頼性と品質を重視する大規模組織",
        matchReason: "関連業界キーワードの実績と技術多様性を考慮",
        compatibility: Math.min(96, comp),
        icon: "🏢",
      });
    }

    if (
      experiencedIndustries.includes("startup") ||
      uniqueTechnologies.size >= 3
    ) {
      const industryMatch = experiencedIndustries.includes("startup") ? 1 : 0;
      const techDiversity = Math.min(1, uniqueTechnologies.size / 6);
      const comp = Math.round(
        65 + 35 * (0.6 * industryMatch + 0.4 * techDiversity),
      );
      analysis.companyMatches.push({
        companyType: "テック系スタートアップ",
        industry: "IT・SaaS・フィンテック",
        description: "技術革新と迅速な成長を目指すベンチャー企業",
        matchReason: "スタートアップ関連の記述と技術スタックの幅を評価",
        compatibility: Math.min(95, comp),
        icon: "🚀",
      });
    }

    if (
      experiencedIndustries.includes("ecommerce") ||
      experiencedIndustries.includes("entertainment")
    ) {
      const industryMatch = 1;
      const comp = Math.round(68 + 32 * industryMatch);
      analysis.companyMatches.push({
        companyType: "EC・エンタメ関連企業",
        industry: "Eコマース・ゲーム・メディア",
        description: "ユーザー体験を重視するBtoC向けサービス",
        matchReason: "該当業界への言及度に基づく評価",
        compatibility: Math.min(94, comp),
        icon: "🛍️",
      });
    }

    if (uniqueTypes.size >= 4) {
      const diversityRatio = Math.min(1, uniqueTypes.size / 6);
      const comp = Math.round(70 + 30 * diversityRatio);
      analysis.companyMatches.push({
        companyType: "クリエイティブエージェンシー",
        industry: "広告・マーケティング・デザイン",
        description: "多様なクライアントの課題解決を行うクリエイティブ集団",
        matchReason: "分野の多様性に基づく適応力評価",
        compatibility: Math.min(96, comp),
        icon: "💡",
      });
    }

    // デフォルト企業マッチング
    if (analysis.companyMatches.length === 0) {
      analysis.companyMatches.push({
        companyType: "中小企業・地域企業",
        industry: "製造業・サービス業・小売業",
        description: "地域密着型で人とのつながりを大切にする企業",
        matchReason:
          "柔軟性とコミュニケーション力で、様々な業種の課題解決に貢献できます",
        compatibility: 85,
        icon: "🏪",
      });
    }

    // 強みの特定（実績ベース）
    analysis.topStrengths = ["視覚的表現力", "クリエイティブ思考"];

    if (works.length >= 10) {
      analysis.topStrengths.push("継続的な制作力");
    }
    if (avgDescLength > 100) {
      analysis.topStrengths.push("詳細な企画・説明力");
    }
    if (uniqueTypes.size >= 3) {
      analysis.topStrengths.push("多分野への適応力");
    }
    if (uniqueTechnologies.size >= 5) {
      analysis.topStrengths.push("技術的多様性");
    }
    if (experiencedIndustries.length >= 2) {
      analysis.topStrengths.push("業界理解力");
    }

    // 推奨スキル（不足分野の提案）
    analysis.recommendedSkills = [];

    if (
      !designTools.some((tech) =>
        ["figma", "sketch", "adobe xd"].includes(tech.toLowerCase()),
      )
    ) {
      analysis.recommendedSkills.push("最新デザインツールの習得（Figma等）");
    }
    if (!workTypes.some((type) => uiTypes.some((ui) => type.includes(ui)))) {
      analysis.recommendedSkills.push("UI/UXデザインスキル");
    }
    if (avgDescLength < 50) {
      analysis.recommendedSkills.push("企画書・提案書作成スキル");
    }
    if (uniqueTypes.size <= 2) {
      analysis.recommendedSkills.push("他分野デザインへの挑戦");
    }

    // 基本的な推奨スキル
    analysis.recommendedSkills.push("クライアントコミュニケーション");
    analysis.recommendedSkills.push("プロジェクト管理");

    return analysis;
  };

  const analysis = analyzeMatching();

  const _getCompatibilityColor = (score: number): string => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-gray-500";
  };

  const _getCompatibilityBgColor = (score: number): string => {
    if (score >= 90) return "bg-green-50 border-green-200";
    if (score >= 80) return "bg-blue-50 border-blue-200";
    if (score >= 70) return "bg-yellow-50 border-yellow-200";
    return "bg-gray-50 border-gray-200";
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-gray-900">
          適性評価
        </CardTitle>
        <p className="text-xs text-gray-500 mt-1">
          適合プロジェクトと企業タイプ
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.projectMatches.slice(0, 2).map((project, index) => (
            <div key={index} className="border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-medium text-gray-900 text-sm">
                  {project.title}
                </h5>
                <span className="text-xs font-semibold text-blue-600">
                  {project.compatibility}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${project.compatibility}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">{project.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {analysis.companyMatches.slice(0, 2).map((company, index) => (
            <div key={index} className="border border-gray-200 rounded p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h5 className="font-medium text-gray-900 text-sm">
                    {company.companyType}
                  </h5>
                  <span className="text-xs text-gray-500">
                    {company.industry}
                  </span>
                </div>
                <span className="text-xs font-semibold text-blue-600">
                  {company.compatibility}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mb-3">
                <div
                  className="bg-blue-600 h-1 rounded-full"
                  style={{ width: `${company.compatibility}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">{company.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">主要スキル</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.topStrengths.slice(0, 4).map((strength, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-blue-300 bg-white px-3 py-1 text-xs text-gray-700"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500">発展領域</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.recommendedSkills.slice(0, 4).map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-3 py-1 text-xs text-gray-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
