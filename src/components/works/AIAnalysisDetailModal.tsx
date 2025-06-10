'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AIAnalysisDetailModalProps {
  isOpen: boolean
  onClose: () => void
  contentType: string
}

// コンテンツタイプ別のAI分析詳細情報
const analysisDetails = {
  article: {
    name: '記事・ライティング',
    emoji: '📝',
    icon: '✍️',
    color: 'bg-blue-500',
    description: 'ブログ記事、コラム、ニュース記事などのライティング作品の分析',
    analysisPoints: [
      '✍️ ライティングスキル',
      '🔍 取材力・調査力',
      '💡 独自性・オリジナリティ',
      '📚 専門性・知識の深さ',
      '🎯 読者ターゲティング',
      '📈 SEO対策',
      '🔗 構成力・論理性',
      '📝 文体・表現力'
    ],
    specificAnalysis: [
      {
        category: '文章力分析',
        points: ['文体の一貫性', '読みやすさ', '表現力', '語彙力']
      },
      {
        category: '内容分析',
        points: ['情報の正確性', '独自の視点', '取材の深さ', '専門性']
      },
      {
        category: '構成分析',
        points: ['論理構成', '起承転結', '見出し構成', '読者導線']
      },
      {
        category: 'SEO・リーチ分析',
        points: ['キーワード選定', 'タイトル最適化', '検索意図への対応', 'シェアのしやすさ']
      }
    ]
  },
  design: {
    name: 'デザイン',
    emoji: '🎨',
    icon: '🎨',
    color: 'bg-purple-500',
    description: 'グラフィックデザイン、UI/UXデザイン、ロゴなどのデザイン作品の分析',
    analysisPoints: [
      '🎨 美的センス・デザイン力',
      '🎯 ブランディング力',
      '👥 ユーザビリティ',
      '🔧 技術スキル・ツール活用',
      '💡 創造性・アイデア力',
      '📐 レイアウト・構成力',
      '🌈 色彩センス',
      '📱 レスポンシブ対応'
    ],
    specificAnalysis: [
      {
        category: 'ビジュアル分析',
        points: ['色彩バランス', 'タイポグラフィ', 'レイアウト', '視覚的階層']
      },
      {
        category: 'UX分析',
        points: ['使いやすさ', 'ナビゲーション', 'アクセシビリティ', 'ユーザー体験']
      },
      {
        category: 'ブランド分析',
        points: ['ブランド一貫性', 'コンセプト表現', 'ターゲット適合性', '差別化要素']
      },
      {
        category: '技術分析',
        points: ['実装技術', 'パフォーマンス', 'レスポンシブ', 'アニメーション']
      }
    ]
  },
  photo: {
    name: '写真',
    emoji: '📸',
    icon: '📷',
    color: 'bg-green-500',
    description: '写真撮影、フォトレタッチなどの写真作品の分析',
    analysisPoints: [
      '📷 撮影技術・テクニック',
      '💡 光の使い方・露出',
      '🎨 構図・フレーミング',
      '✨ レタッチスキル',
      '📖 ストーリーテリング',
      '🎯 被写体選定',
      '🌅 シーン構築力',
      '🔧 機材活用力'
    ],
    specificAnalysis: [
      {
        category: '撮影技術分析',
        points: ['露出コントロール', 'フォーカス技術', 'シャッタースピード', '絞り設定']
      },
      {
        category: '構図・表現分析',
        points: ['三分割法', '対角線構図', '遠近感', '視線誘導']
      },
      {
        category: 'ライティング分析',
        points: ['自然光活用', '人工光セッティング', '影の使い方', '色温度管理']
      },
      {
        category: 'ポストプロダクション分析',
        points: ['色調補正', 'レタッチ技術', 'RAW現像', 'クリエイティブ編集']
      }
    ]
  },
  video: {
    name: '動画',
    emoji: '🎬',
    icon: '🎥',
    color: 'bg-red-500',
    description: '動画制作、映像編集、アニメーションなどの動画作品の分析',
    analysisPoints: [
      '🎬 撮影技術・映像美',
      '✂️ 編集技術・カット割り',
      '📖 ストーリー構成力',
      '🎵 音響・BGM選定',
      '🎭 演出力・表現力',
      '⚡ 視覚エフェクト',
      '🎯 テンポ・リズム感',
      '📱 配信最適化'
    ],
    specificAnalysis: [
      {
        category: '映像技術分析',
        points: ['撮影技術', 'カメラワーク', '画質・解像度', 'カラーグレーディング']
      },
      {
        category: '編集技術分析',
        points: ['カット割り', 'トランジション', 'エフェクト', 'モーショングラフィックス']
      },
      {
        category: 'ストーリー分析',
        points: ['脚本構成', 'キャラクター', '起承転結', 'メッセージ性']
      },
      {
        category: '音響分析',
        points: ['音質', 'BGM選定', 'SE効果', 'ナレーション']
      }
    ]
  },
  podcast: {
    name: 'ポッドキャスト',
    emoji: '🎙️',
    icon: '🔊',
    color: 'bg-orange-500',
    description: '音声コンテンツ、ラジオ番組などのポッドキャスト作品の分析',
    analysisPoints: [
      '🎤 話術・プレゼン力',
      '📋 企画力・構成力',
      '🎧 音響品質',
      '👥 エンゲージメント力',
      '📚 コンテンツの質',
      '⏰ 時間配分・テンポ',
      '🎯 ターゲティング',
      '📈 継続性・一貫性'
    ],
    specificAnalysis: [
      {
        category: 'コンテンツ分析',
        points: ['企画力', '情報価値', '独自性', 'エンターテイメント性']
      },
      {
        category: '話術分析',
        points: ['話し方', '声の魅力', '間の取り方', '聞き取りやすさ']
      },
      {
        category: '技術分析',
        points: ['音質', 'ノイズ処理', 'マイク技術', 'ポストプロダクション']
      },
      {
        category: 'エンゲージメント分析',
        points: ['リスナー参加', 'コミュニティ形成', 'ファン獲得', '継続率']
      }
    ]
  },
  event: {
    name: 'イベント',
    emoji: '🎪',
    icon: '🎊',
    color: 'bg-pink-500',
    description: 'イベント企画・運営、カンファレンスなどのイベント作品の分析',
    analysisPoints: [
      '📋 企画力・アイデア力',
      '👥 運営力・チームマネジメント',
      '🎯 ターゲティング・集客力',
      '💰 予算管理・コスト効率',
      '🤝 参加者エンゲージメント',
      '📱 デジタル活用力',
      '⚡ 問題解決力・対応力',
      '📈 成果測定・分析力'
    ],
    specificAnalysis: [
      {
        category: '企画分析',
        points: ['コンセプト設計', 'ターゲット設定', '差別化要素', '価値提案']
      },
      {
        category: '運営分析',
        points: ['スケジュール管理', 'チーム連携', 'リスク管理', '品質管理']
      },
      {
        category: 'マーケティング分析',
        points: ['集客戦略', 'プロモーション', 'ブランディング', '口コミ創出']
      },
      {
        category: '成果分析',
        points: ['参加者満足度', 'KPI達成', 'ROI測定', '継続性評価']
      }
    ]
  }
}

export function AIAnalysisDetailModal({ isOpen, onClose, contentType }: AIAnalysisDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  
  if (!isOpen || !contentType) return null

  const detail = analysisDetails[contentType as keyof typeof analysisDetails]
  if (!detail) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${detail.color} rounded-xl flex items-center justify-center`}>
                <span className="text-2xl text-white">{detail.icon}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{detail.name} AI分析詳細</h2>
                <p className="text-gray-600 mt-1">{detail.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="px-6 pt-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              概要
            </button>
            <button
              onClick={() => setActiveTab('detailed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'detailed'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              詳細分析項目
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 分析ポイント概要 */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">🔍 主要分析ポイント</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {detail.analysisPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-800">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI分析の特徴 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center space-x-2">
                  <span>🤖</span>
                  <span>AI分析の特徴</span>
                </h3>
                <div className="space-y-3 text-blue-800">
                  <p>• <strong>専門性重視:</strong> {detail.name}の業界基準に基づいた評価</p>
                  <p>• <strong>多角的分析:</strong> 技術面・創造面・実用面から総合評価</p>
                  <p>• <strong>改善提案:</strong> 具体的なスキルアップポイントを提示</p>
                  <p>• <strong>市場価値:</strong> 業界トレンドを踏まえた市場性評価</p>
                </div>
              </div>

              {/* 分析結果の活用方法 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>分析結果の活用方法</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">スキルアップ</h4>
                    <p className="text-green-700 text-sm">弱点分析から学習計画を立案</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">ポートフォリオ最適化</h4>
                    <p className="text-green-700 text-sm">強みを活かした作品構成</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">キャリア戦略</h4>
                    <p className="text-green-700 text-sm">市場価値向上のロードマップ</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">案件提案</h4>
                    <p className="text-green-700 text-sm">クライアント向け強み訴求</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 詳細分析カテゴリ</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {detail.specificAnalysis.map((category, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <div className={`w-3 h-3 ${detail.color} rounded-full`}></div>
                      <span>{category.category}</span>
                    </h4>
                    <div className="space-y-2">
                      {category.points.map((point, pointIndex) => (
                        <div key={pointIndex} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-700">{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* 分析精度について */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100 mt-8">
                <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center space-x-2">
                  <span>⚡</span>
                  <span>高精度分析の秘密</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-purple-800">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎯</div>
                    <h4 className="font-medium mb-1">専門特化</h4>
                    <p className="text-sm text-purple-700">{detail.name}の専門知識を活用</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <h4 className="font-medium mb-1">多次元評価</h4>
                    <p className="text-sm text-purple-700">複数の観点から総合分析</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📈</div>
                    <h4 className="font-medium mb-1">業界基準</h4>
                    <p className="text-sm text-purple-700">最新のトレンドを反映</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              💡 コンテンツタイプを選択することで、より専門的で精度の高いAI分析を受けることができます
            </p>
            <Button onClick={onClose} className="bg-gray-900 text-white hover:bg-gray-800">
              閉じる
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 