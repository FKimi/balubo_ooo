import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkData } from "@/features/work/types";
import { calculateTopTags } from "@/features/profile/lib/profileUtils";
import { takeFirst } from "@/utils/arrayUtils";

interface AIFieldSummary {
  averageScore: number;
  insights: string[];
  scoreLevel: {
    level: string;
    color: string;
    bgColor: string;
    description: string;
  };
  topWorks: Array<{ title: string; score: number; reason?: string }>;
}

interface ComprehensiveAnalysis {
  technology: AIFieldSummary;
  creativity: AIFieldSummary;
  expertise: AIFieldSummary;
  impact: AIFieldSummary;
}

interface WorksSectionProps {
  works: WorkData[];
  workStats: any;
  analysis?: ComprehensiveAnalysis;
}

export function WorksSection({
  works,
  workStats,
  analysis,
}: WorksSectionProps) {
  // タグ分析（トップ3のみ）
  const tagAnalysis = () => takeFirst(calculateTopTags(works), 3);

  // カテゴリ分析（トップ3のみ）
  const categoryAnalysis = () => {
    const categoryCount: { [key: string]: number } = {};
    works.forEach((work) => {
      if (work.categories && Array.isArray(work.categories)) {
        work.categories.forEach((category) => {
          categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
      }
    });
    return takeFirst(
      Object.entries(categoryCount).sort(([, a], [, b]) => b - a),
      3,
    );
  };

  // コンテンツタイプ分析（トップ3のみ）
  const contentTypeAnalysis = () => {
    const typeCount: { [key: string]: number } = {};
    works.forEach((work) => {
      const type = work.content_type || "その他";
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return takeFirst(
      Object.entries(typeCount).sort(([, a], [, b]) => b - a),
      3,
    );
  };

  const categories = categoryAnalysis();
  const tags = tagAnalysis();
  const contentTypes = contentTypeAnalysis();

  // 記事作品の統計
  const articleWorks = works.filter((work) => work.content_type === "article");
  const totalWordCount = articleWorks.reduce(
    (sum, work) => sum + (work.article_word_count || 0),
    0,
  );

  // 役割分布（トップ3のみ）
  const topRoles = takeFirst(workStats.roleDistribution, 3);

  const renderFieldCard = (
    title: string,
    gradient: string,
    field: AIFieldSummary,
    _colorPrefix: string,
  ) => {
    const topInsight =
      field.topWorks?.[0]?.reason ||
      field.insights?.[0] ||
      "分析結果がありません";

    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden flex flex-col">
        <div className={`px-6 py-4 ${gradient}`}>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {field.averageScore > 0 && (
            <p className="text-sm text-white opacity-80 mt-1">
              Avg {field.averageScore} / 100
            </p>
          )}
        </div>
        <div className="p-6 flex-grow flex flex-col justify-center">
          <p className="text-sm text-gray-600 leading-relaxed text-center">
            {topInsight}
          </p>
        </div>
      </div>
    );
  };

  const renderEvaluationGrid = () => {
    if (!analysis) return null;
    return (
      <div className="grid gap-6 md:grid-cols-4 mb-10">
        {analysis.technology.averageScore > 0 &&
          renderFieldCard(
            "技術力",
            "bg-gradient-to-r from-gray-500 to-gray-600",
            analysis.technology,
            "gray",
          )}
        {analysis.creativity.averageScore > 0 &&
          renderFieldCard(
            "創造性",
            "bg-gradient-to-r from-purple-500 to-purple-600",
            analysis.creativity,
            "purple",
          )}
        {analysis.expertise.averageScore > 0 &&
          renderFieldCard(
            "専門性",
            "bg-gradient-to-r from-blue-500 to-blue-600",
            analysis.expertise,
            "blue",
          )}
        {analysis.impact.averageScore > 0 &&
          renderFieldCard(
            "影響力",
            "bg-gradient-to-r from-orange-500 to-orange-600",
            analysis.impact,
            "orange",
          )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* AI評価サマリー */}
      {/* {analysis && renderScoreScale()} */}
      {analysis && renderEvaluationGrid()}

      {/* 基本統計（3つの箇条書きに統一） */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{works.length}件</strong>の作品を制作済み
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                総文字数<strong>{totalWordCount.toLocaleString()}文字</strong>
                を執筆
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 font-bold">•</span>
              <span className="text-gray-700">
                <strong>{workStats.roleDistribution.length}種類</strong>
                の役割を担当
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* シンプルな分析（2カラムレイアウト） */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 主要役割 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">主要役割</CardTitle>
          </CardHeader>
          <CardContent>
            {topRoles.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {topRoles.map((role: any) => (
                  <span
                    key={role.role}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {role.role} ({role.count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                役割が設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* コンテンツタイプ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">コンテンツタイプ</CardTitle>
          </CardHeader>
          <CardContent>
            {contentTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contentTypes.map(([type, count]) => (
                  <span
                    key={type}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {type} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                コンテンツタイプが設定されていません
              </div>
            )}
          </CardContent>
        </Card>

        {/* 主要カテゴリ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">主要カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map(([category, count]) => (
                  <span
                    key={category}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
                  >
                    {category} ({count}件)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                カテゴリが設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>

        {/* よく使用するタグ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">よく使用するタグ</CardTitle>
          </CardHeader>
          <CardContent>
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tags.map(([tag, count]) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {tag} ({count}回)
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-gray-500 text-sm">
                タグが設定された作品がありません
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
