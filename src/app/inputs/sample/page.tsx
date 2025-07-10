'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/header'

export default function SampleInputsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const sampleInputs: any[] = [
    {
      title: 'ワンピース',
      type: 'manga',
      category: '少年漫画',
      authorCreator: '尾田栄一郎',
      rating: 5,
      review: '友情、冒険、夢を追いかける素晴らしい作品。ルフィの前向きさに毎回感動します。',
      tags: ['冒険', 'バトル', '友情', '海賊', '夢'],
      genres: ['少年漫画', 'バトル', 'アドベンチャー'],
      status: 'reading',
      favorite: true,
      consumptionDate: new Date().toISOString().split('T')[0]!,
      notes: '仲間との絆が描かれている名作'
    },
    {
      title: '君の名は。',
      type: 'movie',
      category: 'アニメ映画',
      authorCreator: '新海誠',
      rating: 4,
      review: '美しい映像と感動的なストーリー。時空を超えた恋愛が切ない。',
      tags: ['恋愛', '青春', 'タイムスリップ', '感動'],
      genres: ['アニメ映画', 'ロマンス', 'ドラマ'],
      status: 'completed',
      favorite: true,
      consumptionDate: new Date(Date.now() - 86400000).toISOString().split('T')[0]!,
      notes: '映像美が印象的'
    },
    {
      title: 'ゼルダの伝説 ブレス オブ ザ ワイルド',
      type: 'game',
      category: 'アクションアドベンチャー',
      authorCreator: '任天堂',
      rating: 5,
      review: 'オープンワールドの自由度が素晴らしい。探索が楽しくて時間を忘れる。',
      tags: ['冒険', 'オープンワールド', 'パズル', 'アクション'],
      genres: ['アクションRPG', 'アドベンチャー'],
      status: 'completed',
      favorite: true,
      consumptionDate: new Date(Date.now() - 172800000).toISOString().split('T')[0]!,
      notes: '神ゲー。何周でもできる'
    },
    {
      title: '鬼滅の刃',
      type: 'anime',
      category: 'バトルアニメ',
      authorCreator: 'ufotable',
      rating: 4,
      review: '戦闘シーンのアニメーションが圧巻。家族愛のテーマも良い。',
      tags: ['バトル', '家族愛', '成長', '和風'],
      genres: ['バトルアニメ', '時代劇'],
      status: 'completed',
      favorite: false,
      consumptionDate: new Date(Date.now() - 259200000).toISOString().split('T')[0]!,
      notes: '映像クオリティが高い'
    },
    {
      title: 'ハリー・ポッターと賢者の石',
      type: 'book',
      category: 'ファンタジー小説',
      authorCreator: 'J.K.ローリング',
      rating: 5,
      review: '魔法世界の設定が細かく、読み始めたら止まらない。主人公の成長も見どころ。',
      tags: ['魔法', 'ファンタジー', '成長', '友情', '学園'],
      genres: ['ファンタジー', '児童文学'],
      status: 'completed',
      favorite: true,
      consumptionDate: new Date(Date.now() - 345600000).toISOString().split('T')[0]!,
      notes: '魔法世界への憧れが蘇る'
    },
    {
      title: 'あつまれ どうぶつの森',
      type: 'game',
      category: 'シミュレーション',
      authorCreator: '任天堂',
      rating: 4,
      review: 'ほのぼのとした世界観で癒される。島づくりが楽しい。',
      tags: ['癒し', 'ほのぼの', '島づくり', 'どうぶつ'],
      genres: ['シミュレーション', 'ライフスタイル'],
      status: 'playing',
      favorite: false,
      consumptionDate: new Date(Date.now() - 432000000).toISOString().split('T')[0]!,
      notes: 'ストレス解消に最適'
    }
  ]

  const createSampleInputs = async () => {
    if (!user?.id) {
      alert('ログインが必要です')
      return
    }

    setIsLoading(true)

    try {
      console.log('サンプルインプット作成開始...')

      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('認証が必要です')
      }

      // 各サンプルデータを順次作成
      for (const inputData of sampleInputs) {
        const dataWithUserId = {
          ...inputData,
          userId: user.id
        }

        const response = await fetch('/api/inputs', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataWithUserId),
        })

        if (!response.ok) {
          const errorData = await response.json()
          console.error('サンプル作成エラー:', errorData)
          throw new Error(errorData.error || 'サンプル作成に失敗しました')
        }

        const result = await response.json()
        console.log('サンプル作成成功:', result.input.title)
      }

      console.log('サンプルインプット作成完了')
      alert(`${sampleInputs.length}件のサンプルインプットを作成しました！`)

      // プロフィールページのインプットタブにリダイレクト
      router.push('/profile?tab=inputs')

    } catch (error) {
      console.error('サンプル作成エラー:', error)
      alert(`作成に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            {/* ヘッダー */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">🎯 サンプルインプット作成</h1>
              <p className="text-gray-600">
                テスト用のサンプルインプットデータを一括作成して、機能を試してみましょう
              </p>
            </div>

            {/* 説明カード */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>作成されるサンプルデータ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    以下のサンプルインプットが作成されます：
                  </p>
                  <ul className="space-y-2">
                    {sampleInputs.map((input, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">
                          {input.type === 'book' && '📚'}
                          {input.type === 'manga' && '📖'}
                          {input.type === 'movie' && '🎬'}
                          {input.type === 'anime' && '🎭'}
                          {input.type === 'game' && '🎮'}
                        </span>
                        <div>
                          <div className="font-medium text-gray-900">{input.title}</div>
                          <div className="text-sm text-gray-600">
                            {input.authorCreator} • {input.category}
                            {input.favorite && ' ⭐'}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* アクションボタン */}
            <div className="flex gap-4">
              <Button
                onClick={createSampleInputs}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? '作成中...' : `🎯 ${sampleInputs.length}件のサンプルを作成`}
              </Button>
              <Link href="/profile?tab=inputs">
                <Button variant="outline" className="px-6">
                  キャンセル
                </Button>
              </Link>
            </div>

            {/* 注意事項 */}
            <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-medium text-yellow-800 mb-2">注意事項</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• このページはテスト用です。本番環境では使用しないでください</li>
                <li>• サンプルデータが既に存在する場合、重複して作成されます</li>
                <li>• 作成後はプロフィールページで確認できます</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 