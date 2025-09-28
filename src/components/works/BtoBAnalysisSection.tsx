"use client";

import { useState } from "react";
import { AIAnalysisResult } from "@/features/work/types";

interface BtoBAnalysisSectionProps {
  aiAnalysis: AIAnalysisResult;
}

export function BtoBAnalysisSection({ aiAnalysis }: BtoBAnalysisSectionProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );

  const toggleExpanded = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const btobAnalysis = aiAnalysis?.btobAnalysis;

  // btobAnalysisが存在しない場合は、デフォルトの分析結果を表示
  if (!btobAnalysis?.scores) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-xl font-bold text-purple-900">専門性分析</h4>
            <p className="text-purple-700 text-sm">
              プロクリエイターの専門性を5軸で評価
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-purple-600"
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
          </div>
          <p className="text-purple-600 mb-2 font-medium">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "専門性分析データを処理中です..."
              : "専門性分析データを準備中です..."}
          </p>
          <p className="text-sm text-purple-500">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "AI分析が完了しましたが、専門性分析データが見つかりません。"
              : "AI分析が完了すると、5軸の詳細な専門性分析が表示されます。"}
          </p>
          <div className="mt-4 text-xs text-purple-400">
            <p>• 業界・領域の特定</p>
            <p>• 課題・目的の分析</p>
            <p>• 実績・成果の抽出</p>
            <p>• ターゲット読者の推定</p>
            <p>• ビジネス文脈の理解度</p>
          </div>
        </div>
      </div>
    );
  }

  const scores = btobAnalysis.scores;
  const summaries = btobAnalysis.summaries;

  // スコアに基づく色の決定
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 80) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 70) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  // スコアに基づくアイコンの決定
  const getScoreIcon = (score: number) => {
    if (score >= 90) return "🏆";
    if (score >= 80) return "⭐";
    if (score >= 70) return "👍";
    return "📊";
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <div>
          <h4 className="text-xl font-bold text-purple-900">専門性分析</h4>
          <p className="text-purple-700 text-sm">
            プロクリエイターの専門性を5軸で評価
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ① 業界・領域の特定 */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreColor(scores.industryIdentification.score)}`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleExpanded("industry")}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getScoreIcon(scores.industryIdentification.score)}
              </span>
              <div>
                <h5 className="font-semibold">業界・領域の特定</h5>
                <p className="text-sm opacity-75">
                  {summaries?.industryIdentification}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scores.industryIdentification.score}
              </div>
              <div className="text-xs">/100</div>
            </div>
          </div>

          {expandedSections.has("industry") && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm mb-3">
                {scores.industryIdentification.reason}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium opacity-75">
                    業界タグ:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.industryIdentification.industryTags?.map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium opacity-75">
                    専門用語:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.industryIdentification.domainKeywords?.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ② 課題・目的の分析 */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreColor(scores.problemPurposeAnalysis.score)}`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleExpanded("problem")}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getScoreIcon(scores.problemPurposeAnalysis.score)}
              </span>
              <div>
                <h5 className="font-semibold">課題・目的の分析</h5>
                <p className="text-sm opacity-75">
                  {summaries?.problemPurposeAnalysis}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scores.problemPurposeAnalysis.score}
              </div>
              <div className="text-xs">/100</div>
            </div>
          </div>

          {expandedSections.has("problem") && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm mb-3">
                {scores.problemPurposeAnalysis.reason}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium opacity-75">
                    課題タグ:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.problemPurposeAnalysis.problemTags?.map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium opacity-75">
                    目的キーワード:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.problemPurposeAnalysis.purposeKeywords?.map(
                      (keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ③ 実績・成果の抽出 */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreColor(scores.achievementExtraction.score)}`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleExpanded("achievement")}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getScoreIcon(scores.achievementExtraction.score)}
              </span>
              <div>
                <h5 className="font-semibold">実績・成果の抽出</h5>
                <p className="text-sm opacity-75">
                  {summaries?.achievementExtraction}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scores.achievementExtraction.score}
              </div>
              <div className="text-xs">/100</div>
            </div>
          </div>

          {expandedSections.has("achievement") && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm mb-3">
                {scores.achievementExtraction.reason}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium opacity-75">
                    定量的成果:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.achievementExtraction.quantitativeResults?.map(
                      (result, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          {result}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium opacity-75">
                    インパクトスコア:
                  </span>
                  <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-bold">
                    {scores.achievementExtraction.impactScore}/100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ④ ターゲット読者の推定 */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${getScoreColor(scores.targetReaderEstimation.score)}`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleExpanded("target")}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getScoreIcon(scores.targetReaderEstimation.score)}
              </span>
              <div>
                <h5 className="font-semibold">ターゲット読者の推定</h5>
                <p className="text-sm opacity-75">
                  {summaries?.targetReaderEstimation}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scores.targetReaderEstimation.score}
              </div>
              <div className="text-xs">/100</div>
            </div>
          </div>

          {expandedSections.has("target") && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm mb-3">
                {scores.targetReaderEstimation.reason}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium opacity-75">
                    ターゲットタグ:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.targetReaderEstimation.targetTags?.map(
                      (tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium opacity-75">
                    読者レベル:
                  </span>
                  <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-bold">
                    {scores.targetReaderEstimation.readerLevel}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ⑤ BtoB文脈の理解度 */}
        <div
          className={`p-4 rounded-lg border-2 transition-all duration-200 md:col-span-2 ${getScoreColor(scores.btobContextUnderstanding.score)}`}
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleExpanded("btob")}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getScoreIcon(scores.btobContextUnderstanding.score)}
              </span>
              <div>
                <h5 className="font-semibold">ビジネス文脈の理解度</h5>
                <p className="text-sm opacity-75">
                  {summaries?.btobContextUnderstanding}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                {scores.btobContextUnderstanding.score}
              </div>
              <div className="text-xs">/100</div>
            </div>
          </div>

          {expandedSections.has("btob") && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <p className="text-sm mb-3">
                {scores.btobContextUnderstanding.reason}
              </p>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium opacity-75">
                    ビジネス要素:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {scores.btobContextUnderstanding.btobElements?.map(
                      (element, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-white bg-opacity-50 rounded text-xs"
                        >
                          {element}
                        </span>
                      ),
                    ) || (
                      <span className="text-xs text-gray-500">データなし</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium opacity-75">
                    文脈スコア:
                  </span>
                  <span className="ml-2 px-2 py-1 bg-white bg-opacity-50 rounded text-xs font-bold">
                    {scores.btobContextUnderstanding.contextScore}/100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 総合評価 */}
      <div className="mt-6 p-4 bg-white bg-opacity-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">総</span>
          </div>
          <div>
            <h5 className="font-semibold text-purple-900">専門性総合評価</h5>
            <p className="text-sm text-purple-700">
              プロクリエイターとしての専門性を5軸で総合評価
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
