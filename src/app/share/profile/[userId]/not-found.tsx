import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <div className="text-8xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            プロフィールが見つかりません
          </h1>
          <p className="text-gray-600 mb-6">
            このプロフィールは存在しないか、公開されていない可能性があります。
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-xl">
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
  );
}
