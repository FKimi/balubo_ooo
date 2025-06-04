import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">プロフィールが見つかりません</h1>
          <p className="text-gray-600 mb-6">
            このプロフィールは存在しないか、公開されていない可能性があります。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full">
              ホームに戻る
            </Button>
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>お探しのプロフィールが見つからない場合は、</p>
            <p>URLが正しいか確認してください。</p>
          </div>
        </div>
      </div>
    </div>
  )
} 