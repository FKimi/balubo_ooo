import { NextResponse } from 'next/server'

export async function GET() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY
  const geminiKeyLength = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
  
  return NextResponse.json({
    success: true,
    environment: {
      hasGeminiKey,
      geminiKeyLength,
      nodeEnv: process.env.NODE_ENV,
      // セキュリティのため、実際のキーは表示しない
    },
    apiConfig: {
      geminiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      availableEndpoints: [
        '/api/ai-analyze',
        '/api/ai-analyze/article',
        '/api/ai-analyze/design',
        '/api/ai-analyze/test',
        '/api/ai-analyze/debug'
      ]
    },
    timestamp: new Date().toISOString()
  })
} 