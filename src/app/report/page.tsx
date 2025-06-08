'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// インラインプログレスバーコンポーネント
const SimpleProgress = ({ value, className }: { value: number; className?: string }) => (
  <div className={`relative w-full overflow-hidden rounded-full bg-gray-200 ${className || 'h-2'}`}>
    <div 
      className="h-full bg-blue-600 transition-all duration-300 ease-in-out rounded-full" 
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)

export default function ReportPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<string>('overview')

  // 認証チェック
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>ログインが必要です</div>
      </div>
    )
  }

  // ★ここから下を最小限に変更
  return (
    <div>
      <h1>🔥 テスト表示</h1>
      <p>この表示が出れば、問題はコンポーネントの組み合わせにあることが確定します。</p>
      <p>ユーザー名: {user?.email || 'Unknown'}</p>
    </div>
  );
} 