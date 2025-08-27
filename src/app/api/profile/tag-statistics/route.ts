import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 全ユーザーの作品からタグ統計を取得
    const { data: works, error: worksError } = await supabase
      .from('works')
      .select('tags')
      .not('tags', 'is', null)

    if (worksError) {
      console.error('Works fetch error:', worksError)
      return NextResponse.json({ error: 'Failed to fetch works data' }, { status: 500 })
    }

    // タグの使用頻度を集計
    const tagCount: { [key: string]: number } = {}
    const totalWorks = works.length

    works.forEach(work => {
      if (work.tags && Array.isArray(work.tags)) {
        work.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1
        })
      }
    })

    // 使用頻度順にソート
    const sortedTags = Object.entries(tagCount)
      .sort(([, a], [, b]) => b - a)
      .map(([tag, count]) => ({
        tag,
        count,
        percentage: Math.round((count / totalWorks) * 100)
      }))

    return NextResponse.json({
      totalWorks,
      tagStatistics: sortedTags,
      topTags: sortedTags.slice(0, 20) // 上位20件を返す
    })

  } catch (error) {
    console.error('Tag statistics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 