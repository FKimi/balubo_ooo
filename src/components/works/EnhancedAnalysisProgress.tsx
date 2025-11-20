"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  predictAnalysisTime,
  startAnalysisTracking,
  endAnalysisTracking,
} from "@/lib/analysisTimeTracker";

interface EnhancedAnalysisProgressProps {
  contentType: string;
  contentLength?: number;
  hasImages?: boolean;
  onCancel: () => void;
}

interface AnalysisStep {
  id: string;
  title: string;
  description: string;
  duration: number; // 予想時間（秒）
  icon: string;
}

export function EnhancedAnalysisProgress({
  contentType,
  contentLength = 0,
  hasImages = false,
  onCancel,
}: EnhancedAnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // 分析ステップの定義
  const analysisSteps: AnalysisStep[] = [
    {
      id: "content_analysis",
      title: "コンテンツ解析中",
      description:
        contentType === "design"
          ? "画像の視覚的要素、色彩、レイアウトを詳細に分析しています"
          : "記事の構成、文体、専門性を解析しています",
      duration: 8,
      icon: "🔍",
    },
    {
      id: "ai_processing",
      title: "AI分析実行中",
      description: "課題・目的や想定読者、解決策、成果を分析し、業界と専門性を可視化しています",
      duration: 12,
      icon: "🤖",
    },
    {
      id: "tag_generation",
      title: "タグ生成中",
      description: "作品の特徴に基づいて最適なタグを自動生成しています",
      duration: 6,
      icon: "🏷️",
    },
    {
      id: "summary_creation",
      title: "要約作成中",
      description: "分析結果をまとめて、分かりやすい要約を作成しています",
      duration: 4,
      icon: "📝",
    },
  ];

  // 楽しいヒントメッセージ
  const tips = [
    "💡 分析中に他の作品も準備しておくと効率的です",
    "🎯 タグは後から編集できるので、まずは保存してみましょう",
    "📊 分析結果はポートフォリオでも活用できます",
    "🚀 高品質な作品ほど詳細な分析が行われます",
    "⭐ 分析時間は作品の複雑さによって変わります",
  ];

  useEffect(() => {
    // 分析開始を記録
    const newSessionId = startAnalysisTracking(
      contentType,
      contentLength,
      hasImages,
    );
    setSessionId(newSessionId);

    // 実際の分析時間を予測
    const predictedTime = predictAnalysisTime(
      contentType,
      contentLength,
      hasImages,
    );
    setEstimatedTotalTime(predictedTime);

    // ステップ進行のタイマー（予想時間に基づいて調整）
    const stepDuration = Math.max(predictedTime / analysisSteps.length, 2); // 最低2秒
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration * 1000);

    // 経過時間のタイマー
    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // ヒント表示のタイマー
    const tipInterval = setInterval(() => {
      setShowTips(true);
      setTimeout(() => setShowTips(false), 3000);
    }, 8000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(timeInterval);
      clearInterval(tipInterval);
    };
  }, [contentType, contentLength, hasImages, analysisSteps.length]);

  // コンポーネントのアンマウント時に分析終了を記録
  useEffect(() => {
    return () => {
      if (sessionId) {
        endAnalysisTracking(sessionId);
      }
    };
  }, [sessionId]);

  const progressPercentage = Math.min(
    (elapsedTime / estimatedTotalTime) * 100,
    95,
  );
  const remainingTime = Math.max(estimatedTotalTime - elapsedTime, 0);
  const currentTip = tips[Math.floor(elapsedTime / 8) % tips.length];

  return (
    <div className="mb-8 bg-white border-2 border-gray-200 rounded-2xl shadow-lg overflow-hidden">
      {/* ヘッダー（青いバー） */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                記事が解決する課題・目的／想定読者／解決策／成果を分析し、業界と専門性を可視化
              </p>
            </div>
          </div>
          <div className="text-white/90 text-sm font-medium hidden sm:block">
            あなたの専門性を客観的に証明
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="p-6">
        {/* ヘッダー部分 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg">
                  {analysisSteps[currentStep]?.icon || "🤖"}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold text-xl mb-1">
                高度AI分析を実行中...
              </h3>
              <p className="text-gray-600 text-sm">
                予想時間: 約{Math.ceil(estimatedTotalTime / 60)}分 | 経過: {elapsedTime}秒
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="text-gray-600 hover:text-gray-800 border-gray-300"
          >
            キャンセル
          </Button>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-700 mb-2">
            <span className="font-medium">進捗</span>
            <span className="font-semibold">{Math.round(progressPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* 現在のステップ（大きく表示） */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-blue-50/80 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
              {currentStep + 1}
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {analysisSteps[currentStep]?.title || "分析完了間近"}
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {analysisSteps[currentStep]?.description ||
                  "最終的な分析結果をまとめています..."}
              </p>
            </div>
          </div>
        </div>

        {/* ステップ一覧（2x2グリッド） */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {analysisSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 border-blue-700 text-white shadow-lg scale-105"
                    : isCompleted
                    ? "bg-blue-50 border-blue-300 text-blue-800"
                    : "bg-gray-50 border-gray-200 text-gray-500"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{step.icon}</span>
                  <span className="font-semibold text-sm flex-1">{step.title}</span>
                  {isCompleted && (
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
                {(isActive || isCompleted) && (
                  <div className={`text-xs mt-1 ${isActive ? "text-white/80" : "text-blue-600"}`}>
                    約{step.duration}秒
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 残り時間とヒント */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="text-sm font-medium text-gray-700">
            {remainingTime > 0 ? (
              <>残り約{Math.ceil(remainingTime / 60)}分</>
            ) : (
              <span className="text-blue-600">まもなく完了します...</span>
            )}
          </div>

          {showTips && (
            <div className="text-sm text-blue-700 bg-blue-50 border border-blue-200 px-4 py-2 rounded-lg animate-fade-in">
              {currentTip}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
