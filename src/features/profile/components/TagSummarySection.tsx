import { useState, useEffect } from 'react'

interface TagSummarySectionProps {
  tags: [string, number][]
}

export function TagSummarySection({ tags }: TagSummarySectionProps) {
  const [summary, setSummary] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string>('')

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
  }, [JSON.stringify(tagsPayload)])

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
    <div className="mb-4">
      {summary ? (
        <p className="text-sm text-gray-600 mb-3 whitespace-pre-line leading-relaxed">{summary}</p>
      ) : (
        <p className="text-sm text-gray-500 mb-3">まだAI紹介文が生成されていません</p>
      )}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="flex items-center gap-1 text-sm px-4 py-1.5 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50 disabled:opacity-50"
      >
        ⚡
        {loading ? '生成中...' : summary ? '再生成' : 'AIで生成'}
      </button>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  )
} 