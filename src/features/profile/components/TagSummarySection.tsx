import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface TagSummarySectionProps {
  tags: [string, number][]
}

export function TagSummarySection({ tags }: TagSummarySectionProps) {
  const router = useRouter();
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [showReportPreview, setShowReportPreview] = useState(false);

  const tagsPayload = tags.slice(0, 10).map(([name, count]) => ({ name, count }))

  // 初回: キャッシュのみ取得
  useEffect(() => {
    if (tagsPayload.length === 0) {
      setInitialLoading(false)
      return
    }
    fetch('/api/ai-analyze/tag-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-cache-only': 'true' },
      body: JSON.stringify({ tags: tagsPayload })
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json()
          setSummary(data.summary || '')
        }
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false))
  }, [tagsPayload])

  const handleGenerate = () => {
    setLoading(true)
    setError('')
    fetch('/api/ai-analyze/tag-summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-force-regenerate': summary ? 'true' : 'false' },
      body: JSON.stringify({ tags: tagsPayload })
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('failed')
        const data = await res.json()
        setSummary(data.summary)
      })
      .catch(() => setError('生成に失敗しました'))
      .finally(() => setLoading(false))
  }

  if (initialLoading) {
    return (
      <div className="text-center py-4">読み込み中...</div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* タイトルと再生成ボタン */}
      <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex-shrink-0">分析サマリー</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-all duration-200 hover:shadow-md flex-shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          {loading ? '生成中...' : summary ? '再生成' : 'AI生成'}
        </button>
      </div>

      {/* コンテンツ */}
      <div className="w-full space-y-4">
        {summary ? (
          <div className="w-full">
            <p
              className="text-base md:text-lg text-gray-700 whitespace-pre-line leading-relaxed break-words line-clamp-4"
              style={{ maxWidth: '100%' }}
            >
              {summary.length > 280 ? summary.slice(0, 280) + '…' : summary}
            </p>
            {summary.length > 280 && (
              <div className="mt-2">
                <button
                  className="text-blue-600 hover:underline text-sm font-medium"
                  onClick={() => setShowReportPreview(true)}
                >
                  続きは詳細レポートへ
                </button>
                <div className="text-xs text-gray-500 mt-1">※詳細レポートは現在開発中です</div>
              </div>
            )}
            {/* 詳細レポートプレビューモーダル */}
            {showReportPreview && (
              <div className="fixed inset-0 z-50 flex items-start justify-center mt-24 px-4" onClick={() => setShowReportPreview(false)}>
                <div className="bg-white shadow-2xl rounded-xl border border-slate-200 max-w-md w-full" onClick={e => e.stopPropagation()}>
                  <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-700">詳細レポート (準備中)</h3>
                    <button className="text-slate-500 hover:text-slate-700" onClick={() => setShowReportPreview(false)}>
                      ×
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-200 rounded-lg flex items-center justify-center text-slate-500 text-xs">
                      Coming Soon Preview
                    </div>
                    <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                      AIが自動生成する"納得感・学び・自己肯定感"レポートをお届けします。まもなく公開！
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-base text-gray-500">まだAI紹介文が生成されていません</p>
        )}
        
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </div>
  )
} 