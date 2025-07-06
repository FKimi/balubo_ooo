import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createAuthenticatedClient } from '@/lib/supabase-client'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'
const CACHE_VERSION = 'v4'

// Service Role Key を使用した Supabase クライアント
const supabaseAdmin = createAuthenticatedClient(undefined, true)

export async function POST(request: NextRequest) {
  try {
    const { tags } = await request.json()

    if (!Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json({ error: 'Invalid tags data' }, { status: 400 })
    }

    // hash 作成（タグ名と件数で安定化）
    const canonical = [CACHE_VERSION, ...tags
      .sort((a: any, b: any) => a.name.localeCompare(b.name))
      .map((t: any) => `${t.name}:${t.count}`)]
      .join('|')

    const tagsHash = createHash('sha256').update(canonical).digest('hex')

    // 1. キャッシュ確認
    const { data: cached, error: cacheErr } = await supabaseAdmin
      .from('tag_summaries')
      .select('summary')
      .eq('tags_hash', tagsHash)
      .single()

    const cacheOnly = request.headers.get('x-cache-only') === 'true'
    const forceRegenerate = request.headers.get('x-force-regenerate') === 'true'

    if (!forceRegenerate && !cacheErr && cached) {
      return NextResponse.json({ summary: cached.summary })
    }

    // キャッシュのみ要求時はここで終了
    if (cacheOnly) {
      return NextResponse.json({ summary: null }, { status: 204 })
    }

    // タグ一覧をプロンプト用テキストへ整形
    const tagList = tags
      .map((t: { name: string; count: number }) => `${t.name}: ${t.count}件`)
      .join('\n')

    const prompt = `あなたはクリエイターの強みを見抜くキャリアアドバイザーです。以下のタグ一覧から作品傾向を分析し、クライアントに魅力が伝わる紹介文を500字以内で日本語で生成してください。\n\n要件:\n1. 改行せずに1段落で書く。\n2. タグの具体キーワード列挙は最大3個まで。\n3. 「技術力」「創造性」「専門性」「影響力」を意識した描写を含める。\n4. 親しみやすくプロフェッショナルなトーン。\n5. 名前や「Aさん」「このクリエイター」といった呼称を使わず、作品特徴の描写から書き始める。\n6. 見出しやラベルは書かない。\n\nタグ一覧:\n${tagList}`;

    // Gemini へリクエスト
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 256
        }
      })
    })

    if (!response.ok) {
      throw new Error('Gemini API Error')
    }

    const data = await response.json()
    const summaryText: string | undefined = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!summaryText) {
      return NextResponse.json({ error: 'No summary generated' }, { status: 500 })
    }

    // 文字数制限（500字以内）
    const finalSummary = summaryText.trim().slice(0, 500)

    // 2. キャッシュ保存
    await supabaseAdmin.from('tag_summaries').upsert({
      tags_hash: tagsHash,
      summary: finalSummary
    })

    return NextResponse.json({ summary: finalSummary })
  } catch (error) {
    console.error('tag-summary error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 