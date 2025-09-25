'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { predictAnalysisTime, startAnalysisTracking, endAnalysisTracking } from '@/lib/analysisTimeTracker'

interface EnhancedAnalysisProgressProps {
  contentType: string
  contentLength?: number
  hasImages?: boolean
  onCancel: () => void
}

interface AnalysisStep {
  id: string
  title: string
  description: string
  duration: number // 予想時間（秒）
  icon: string
}

export function EnhancedAnalysisProgress({ 
  contentType, 
  contentLength = 0, 
  hasImages = false, 
  onCancel 
}: EnhancedAnalysisProgressProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [estimatedTotalTime, setEstimatedTotalTime] = useState(0)
  const [showTips, setShowTips] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  // 分析ステップの定義
  const analysisSteps: AnalysisStep[] = [
    {
      id: 'content_analysis',
      title: 'コンテンツ解析中',
      description: contentType === 'design' 
        ? '画像の視覚的要素、色彩、レイアウトを詳細に分析しています'
        : '記事の構成、文体、専門性を解析しています',
      duration: 8,
      icon: '🔍'
    },
    {
      id: 'ai_processing',
      title: 'AI分析実行中',
      description: '技術力・専門性・創造性・影響力を多角的に評価しています',
      duration: 12,
      icon: '🤖'
    },
    {
      id: 'tag_generation',
      title: 'タグ生成中',
      description: '作品の特徴に基づいて最適なタグを自動生成しています',
      duration: 6,
      icon: '🏷️'
    },
    {
      id: 'summary_creation',
      title: '要約作成中',
      description: '分析結果をまとめて、分かりやすい要約を作成しています',
      duration: 4,
      icon: '📝'
    }
  ]

  // 楽しいヒントメッセージ
  const tips = [
    '💡 分析中に他の作品も準備しておくと効率的です',
    '🎯 タグは後から編集できるので、まずは保存してみましょう',
    '📊 分析結果はポートフォリオでも活用できます',
    '🚀 高品質な作品ほど詳細な分析が行われます',
    '⭐ 分析時間は作品の複雑さによって変わります'
  ]

  useEffect(() => {
    // 分析開始を記録
    const newSessionId = startAnalysisTracking(contentType, contentLength, hasImages)
    setSessionId(newSessionId)

    // 実際の分析時間を予測
    const predictedTime = predictAnalysisTime(contentType, contentLength, hasImages)
    setEstimatedTotalTime(predictedTime)

    // ステップ進行のタイマー（予想時間に基づいて調整）
    const stepDuration = Math.max(predictedTime / analysisSteps.length, 2) // 最低2秒
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, stepDuration * 1000)

    // 経過時間のタイマー
    const timeInterval = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)

    // ヒント表示のタイマー
    const tipInterval = setInterval(() => {
      setShowTips(true)
      setTimeout(() => setShowTips(false), 3000)
    }, 8000)

    return () => {
      clearInterval(stepInterval)
      clearInterval(timeInterval)
      clearInterval(tipInterval)
    }
  }, [contentType, contentLength, hasImages, analysisSteps.length])

  // コンポーネントのアンマウント時に分析終了を記録
  useEffect(() => {
    return () => {
      if (sessionId) {
        endAnalysisTracking(sessionId)
      }
    }
  }, [sessionId])

  const progressPercentage = Math.min((elapsedTime / estimatedTotalTime) * 100, 95)
  const remainingTime = Math.max(estimatedTotalTime - elapsedTime, 0)
  const currentTip = tips[Math.floor(elapsedTime / 8) % tips.length]

  return (
    <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-lg">
              {analysisSteps[currentStep]?.icon || '🤖'}
            </div>
          </div>
          <div>
            <h3 className="text-blue-900 font-bold text-xl">高度AI分析を実行中...</h3>
            <p className="text-blue-700 text-sm">
              予想時間: 約{Math.ceil(estimatedTotalTime / 60)}分 | 経過: {elapsedTime}秒
            </p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800"
        >
          キャンセル
        </Button>
      </div>

      {/* プログレスバー */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-blue-700 mb-2">
          <span>進捗</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* 現在のステップ */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
            {currentStep + 1}
          </div>
          <h4 className="text-lg font-semibold text-blue-900">
            {analysisSteps[currentStep]?.title || '分析完了間近'}
          </h4>
        </div>
        <p className="text-blue-700 ml-11">
          {analysisSteps[currentStep]?.description || '最終的な分析結果をまとめています...'}
        </p>
      </div>

      {/* ステップ一覧 */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {analysisSteps.map((step, index) => (
          <div 
            key={step.id}
            className={`p-3 rounded-lg border-2 transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-blue-100 border-blue-400 text-blue-800' 
                : 'bg-gray-50 border-gray-200 text-gray-500'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{step.icon}</span>
              <span className="font-medium text-sm">{step.title}</span>
            </div>
            {index <= currentStep && (
              <div className="text-xs mt-1 opacity-75">
                約{step.duration}秒
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 残り時間とヒント */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-blue-600">
          {remainingTime > 0 ? (
            <>残り約{Math.ceil(remainingTime / 60)}分</>
          ) : (
            <>まもなく完了します...</>
          )}
        </div>
        
        {showTips && (
          <div className="text-sm text-blue-600 bg-blue-100 px-3 py-1 rounded-full animate-pulse">
            {currentTip}
          </div>
        )}
      </div>

      {/* 楽しいアニメーション要素 */}
      <div className="mt-4 flex justify-center">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
