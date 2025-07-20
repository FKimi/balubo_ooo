import { NextResponse } from 'next/server'

export async function GET() {
  const envVars = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY ? '設定済み' : '未設定',
    GEMINI_API_KEY_LENGTH: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '設定済み' : '未設定',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '設定済み' : '未設定'
  }

  return NextResponse.json({
    success: true,
    environment: envVars,
    timestamp: new Date().toISOString()
  })
} 