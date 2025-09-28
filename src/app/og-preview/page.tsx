import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "OGP画像プレビュー | balubo",
  description: "SNS投稿時のOGP画像プレビューページ",
};

export default function OGPreviewPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          OGP画像プレビュー
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 静的OGP画像 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">静的OGP画像</h2>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Image
                  src="/api/og"
                  alt="静的OGP画像"
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>URL:</strong> /api/og
                </p>
                <p>
                  <strong>サイズ:</strong> 1200x630px
                </p>
                <p>
                  <strong>形式:</strong> PNG
                </p>
              </div>
            </div>
          </div>

          {/* 動的OGP画像 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">動的OGP画像</h2>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Image
                  src="/api/og?title=サンプル作品&description=これは動的OGP画像のサンプルです&type=work&author=クリエイター"
                  alt="動的OGP画像"
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>URL:</strong> /api/og
                </p>
                <p>
                  <strong>パラメータ:</strong> title, description, type, author
                </p>
                <p>
                  <strong>サイズ:</strong> 1200x630px
                </p>
              </div>
            </div>
          </div>

          {/* 作品詳細OGP画像 */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">作品詳細OGP画像</h2>
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Image
                  src="/api/og/analysis/sample-work-id"
                  alt="作品詳細OGP画像"
                  width={1200}
                  height={630}
                  className="w-full h-auto"
                />
              </div>
              <div className="text-sm text-gray-600">
                <p>
                  <strong>URL:</strong> /api/og/analysis/[workId]
                </p>
                <p>
                  <strong>データ:</strong> データベースから動的取得
                </p>
                <p>
                  <strong>サイズ:</strong> 1200x630px
                </p>
              </div>
            </div>
          </div>

          {/* SNSプレビュー */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">SNSプレビュー</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    B
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">balubo</div>
                    <div className="text-sm text-gray-600">
                      クリエイターのためのポートフォリオプラットフォーム
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="font-medium text-gray-900 mb-2">
                    balubo - クリエイターのためのポートフォリオプラットフォーム
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    作品を共有し、つながりを深め、新しい機会を見つけよう。AIがあなたの実績を言語化し、クリエイターとしての価値を最大化します。
                  </div>
                  <div className="border rounded-lg overflow-hidden">
                    <Image
                      src="/api/og"
                      alt="OGP画像"
                      width={1200}
                      height={630}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 使用方法 */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">使用方法</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900">1. 静的OGP画像</h3>
              <p className="text-gray-600">
                デフォルトのOGP画像として使用されます。
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">2. 動的OGP画像</h3>
              <p className="text-gray-600">
                クエリパラメータでカスタマイズ可能です。
              </p>
              <code className="block bg-gray-100 p-2 rounded mt-2">
                /api/og?title=タイトル&description=説明&type=work&author=作者
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                3. 作品詳細OGP画像
              </h3>
              <p className="text-gray-600">
                作品IDに基づいて自動生成されます。
              </p>
              <code className="block bg-gray-100 p-2 rounded mt-2">
                /api/og/analysis/[workId]
              </code>
            </div>
          </div>
        </div>

        {/* テスト用リンク */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">
            テスト用リンク
          </h2>
          <div className="space-y-2 text-sm">
            <p className="text-blue-800">
              以下のリンクをSNSで投稿してOGP画像の表示をテストしてください：
            </p>
            <div className="bg-white p-3 rounded border">
              <code className="text-blue-600">https://www.balubo.jp</code>
            </div>
            <div className="bg-white p-3 rounded border">
              <code className="text-blue-600">
                https://www.balubo.jp/og-preview
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
