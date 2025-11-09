import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WorkData } from "@/features/work/types";

interface InsightsSectionProps {
  works: WorkData[];
  inputs: any[];
  workStats: any;
}

export function InsightsSection({
  works,
  inputs,
  workStats,
}: InsightsSectionProps) {
  const hasInputs = inputs.length > 0;

  // クリエイター傾向のまとめ文章を生成
  const generateCreatorSummary = () => {
    const topRole =
      workStats.roleDistribution.length > 0
        ? workStats.roleDistribution[0].role
        : "クリエイター";
    const worksCount = works.length;
    const inputsCount = inputs.length;

    // 作品制作期間を計算
    const workDates = works
      .filter((work) => work.created_at)
      .map((work) => new Date(work.created_at!))
      .sort((a, b) => a.getTime() - b.getTime());

    const monthsActive =
      workDates.length > 1 && workDates[0] && workDates[workDates.length - 1]
        ? Math.max(
            1,
            Math.round(
              (workDates[workDates.length - 1]!.getTime() -
                workDates[0]!.getTime()) /
                (1000 * 60 * 60 * 24 * 30),
            ),
          )
        : 1;

    // 主要なコンテンツタイプ
    const contentTypes = works.reduce(
      (acc: { [key: string]: number }, work) => {
        const type = work.content_type || "その他";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {},
    );
    const topContentType =
      Object.entries(contentTypes).sort(([, a], [, b]) => b - a)[0]?.[0] ||
      "コンテンツ";

    // インプットの特徴
    let inputCharacteristic = "";
    if (hasInputs) {
      const inputTypes = inputs.reduce(
        (acc: { [key: string]: number }, input) => {
          acc[input.type] = (acc[input.type] || 0) + 1;
          return acc;
        },
        {},
      );
      const topInputType =
        Object.entries(inputTypes).sort(([, a], [, b]) => b - a)[0]?.[0] ||
        "book";
      const inputTypeJa =
        topInputType === "book"
          ? "書籍"
          : topInputType === "movie"
            ? "映画"
            : topInputType === "other"
              ? "多様なメディア"
              : "コンテンツ";
      inputCharacteristic = `また、${inputsCount}件の${inputTypeJa}インプットを通じて継続的な学習を行い、`;
    }

    // 活動の一貫性
    const consistencyNote =
      monthsActive >= 3
        ? `${monthsActive}ヶ月間にわたって継続的に活動し、`
        : "精力的に活動し、";

    return `このクリエイターは主に${topRole}として${worksCount}件の${topContentType}制作を手がけています。${consistencyNote}${inputCharacteristic}着実に実績を積み重ねています。特に${workStats.roleDistribution.length}種類の役割を担当することで、多角的なスキルを身につけており、${worksCount > 5 ? "豊富な制作経験" : "堅実な制作実績"}を持つクリエイターです。`;
  };

  // 興味・関心分析
  const getInterestAnalysis = () => {
    const interests: string[] = [];

    works.forEach((work) => {
      if (work.ai_analysis_result) {
        try {
          const analysis =
            typeof work.ai_analysis_result === "string"
              ? JSON.parse(work.ai_analysis_result)
              : work.ai_analysis_result;

          if (analysis.tagClassification?.interest) {
            interests.push(...analysis.tagClassification.interest);
          }
        } catch (error) {
          console.warn("AI分析結果のパースに失敗:", error);
        }
      }
    });

    const interestCount: { [key: string]: number } = {};
    interests.forEach((interest) => {
      interestCount[interest] = (interestCount[interest] || 0) + 1;
    });

    const topTags = Object.entries(interestCount)
      .map(([interest, count]) => ({ interest, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 7);

    return topTags;
  };

  // 月別活動データ（シンプル化）
  const getMonthlyActivity = () => {
    const now = new Date();
    const monthsData = Array.from({ length: 6 }, (_, i) => {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);

      const monthWorks = works.filter(
        (work) =>
          work.created_at &&
          new Date(work.created_at) >= monthStart &&
          new Date(work.created_at) <= monthEnd,
      ).length;

      const monthInputs = inputs.filter(
        (input) =>
          input.createdAt &&
          new Date(input.createdAt) >= monthStart &&
          new Date(input.createdAt) <= monthEnd,
      ).length;

      return {
        month: monthStart,
        works: monthWorks,
        inputs: monthInputs,
        total: monthWorks + monthInputs,
      };
    });

    return monthsData.reverse();
  };

  // 最近の活動傾向
  const getRecentTrend = () => {
    const recentMonth = new Date();
    recentMonth.setMonth(recentMonth.getMonth() - 1);

    const recentWorks = works.filter(
      (work) => work.created_at && new Date(work.created_at) >= recentMonth,
    ).length;

    const recentInputs = inputs.filter(
      (input) => input.createdAt && new Date(input.createdAt) >= recentMonth,
    ).length;

    return { recentWorks, recentInputs };
  };

  // 実用的な改善提案
  const generatePracticalSuggestions = () => {
    const suggestions = [];
    const { recentWorks, recentInputs } = getRecentTrend();

    // 作品制作に関する提案
    if (recentWorks === 0) {
      suggestions.push({
        title: "作品制作を再開しましょう",
        description:
          "最近1ヶ月間作品がありません。小さなプロジェクトから始めて制作リズムを取り戻しましょう。",
        icon: "palette",
        priority: "high",
      });
    } else if (recentWorks < 2) {
      suggestions.push({
        title: "制作ペースを上げてみましょう",
        description:
          "月2-3件の作品制作を目標にすることで、スキル向上と実績蓄積が期待できます。",
        icon: "zap",
        priority: "medium",
      });
    }

    // インプットに関する提案
    if (!hasInputs) {
      suggestions.push({
        title: "インプット記録を始めましょう",
        description:
          "書籍、映画、記事などのインプットを記録することで、創作活動に新たなアイデアをもたらします。",
        icon: "book",
        priority: "medium",
      });
    } else if (recentInputs < 2) {
      suggestions.push({
        title: "学習機会を増やしましょう",
        description:
          "月2-3件のインプットを目標にすることで、創作の幅が広がります。",
        icon: "bookOpen",
        priority: "medium",
      });
    }

    // 役割の多様化に関する提案
    if (workStats.roleDistribution.length < 3) {
      suggestions.push({
        title: "新しい役割にチャレンジしましょう",
        description:
          "異なる役割での作品制作により、スキルの幅を広げることができます。",
        icon: "star",
        priority: "low",
      });
    }

    return suggestions.slice(0, 3); // 最大3つまで
  };

  const monthlyData = getMonthlyActivity();
  const suggestions = generatePracticalSuggestions();
  const _maxActivity = Math.max(...monthlyData.map((m) => m.total), 1);
  const interestAnalysis = getInterestAnalysis();
  const creatorSummary = generateCreatorSummary();

  return (
    <div className="space-y-6">
      {/* クリエイター傾向まとめ */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50/80 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                クリエイター傾向
              </h3>
              <p className="text-gray-700 leading-relaxed">{creatorSummary}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 活動サマリー */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">
                最近30日の作品
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {getRecentTrend().recentWorks}
              </div>
              <div className="text-xs text-gray-500">件</div>
            </div>
          </CardContent>
        </Card>

        {hasInputs && (
          <Card className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-4 sm:p-6">
              <div className="text-center">
                <div className="text-xs sm:text-sm text-gray-600 mb-2">
                  最近30日のインプット
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                  {getRecentTrend().recentInputs}
                </div>
                <div className="text-xs text-gray-500">件</div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="text-xs sm:text-sm text-gray-600 mb-2">
                活動継続月数
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">
                {monthlyData.filter((m) => m.total > 0).length}
              </div>
              <div className="text-xs text-gray-500">/ 6ヶ月</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 活動傾向 */}
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>活動傾向</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              過去6ヶ月で{monthlyData.filter((m) => m.total > 0).length}
              ヶ月間活動実績があります
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 実用的な改善提案 */}
      {suggestions.length > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>次のステップ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 border-l-4 ${
                    suggestion.priority === "high"
                      ? "bg-red-50 border-red-400"
                      : suggestion.priority === "medium"
                        ? "bg-yellow-50 border-yellow-400"
                        : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-xl flex-shrink-0">
                      {suggestion.icon === "palette" && (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM7 3H5a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5a2 2 0 00-2-2z"
                          />
                        </svg>
                      )}
                      {suggestion.icon === "zap" && (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      )}
                      {suggestion.icon === "book" && (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      )}
                      {suggestion.icon === "bookOpen" && (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      )}
                      {suggestion.icon === "star" && (
                        <svg
                          className="w-5 h-5 text-gray-700"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        {suggestion.title}
                      </h4>
                      <p className="text-xs text-gray-600">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* よく使用するタグ */}
      {interestAnalysis.length > 0 && (
        <Card className="hover:shadow-md transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>トップ3タグ</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {interestAnalysis.slice(0, 3).map((item, _index) => (
                <span
                  key={item.interest}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
                >
                  {item.interest} ({item.count})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
