import { Metadata } from 'next'
import { generateDefaultOGPMetadata } from '@/lib/ogp-utils'

export const metadata: Metadata = generateDefaultOGPMetadata({
  title: 'OGPテストページ - balubo',
  description: 'SNS投稿時の画像表示をテストするためのページです。',
  url: 'https://www.balubo.jp/og-test',
  imageUrl: '/api/og?title=OGPテスト&description=SNS投稿時の画像表示テスト&type=default'
})

export default function OGTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            OGPテストページ
          </h1>
          
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                📱 SNS投稿時の画像表示テスト
              </h2>
              <p className="text-blue-800 mb-4">
                このページはSNS投稿時にOGP画像が正しく表示されるかをテストするためのページです。
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-2">🔗 テスト用URL</h3>
                  <p className="text-sm text-gray-600 mb-2">以下のURLをSNSで共有してテストしてください：</p>
                  <code className="bg-gray-100 p-2 rounded text-sm block break-all">
                    https://www.balubo.jp/og-test
                  </code>
                </div>
                
                <div className="bg-white rounded-lg p-4 border">
                  <h3 className="font-semibold text-gray-900 mb-2">🖼️ OGP画像URL</h3>
                  <p className="text-sm text-gray-600 mb-2">生成されるOGP画像：</p>
                  <code className="bg-gray-100 p-2 rounded text-sm block break-all">
                    /api/og?title=OGPテスト&description=SNS投稿時の画像表示テスト&type=default
                  </code>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">
                ✅ 確認方法
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Twitter/X</h3>
                  <p className="text-green-700 text-sm">
                    Twitter Card Validator: <a href="https://cards-dev.twitter.com/validator" target="_blank" rel="noopener noreferrer" className="underline">https://cards-dev.twitter.com/validator</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">Facebook</h3>
                  <p className="text-green-700 text-sm">
                    Facebook Sharing Debugger: <a href="https://developers.facebook.com/tools/debug/" target="_blank" rel="noopener noreferrer" className="underline">https://developers.facebook.com/tools/debug/</a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-green-800 mb-2">LinkedIn</h3>
                  <p className="text-green-700 text-sm">
                    LinkedIn Post Inspector: <a href="https://www.linkedin.com/post-inspector/" target="_blank" rel="noopener noreferrer" className="underline">https://www.linkedin.com/post-inspector/</a>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">
                🔧 トラブルシューティング
              </h2>
              <div className="space-y-3 text-yellow-800">
                <div>
                  <h3 className="font-semibold mb-2">画像が表示されない場合：</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>OGP画像のURLが正しく設定されているか確認</li>
                    <li>画像のサイズが1200×630ピクセルになっているか確認</li>
                    <li>画像がHTTPSでアクセス可能か確認</li>
                    <li>SNSのキャッシュをクリアして再試行</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">キャッシュクリア方法：</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Facebook: Sharing Debuggerで「Scrape Again」をクリック</li>
                    <li>Twitter: Card Validatorで「Validate & Fetch」をクリック</li>
                    <li>LinkedIn: Post Inspectorで「Inspect」をクリック</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-purple-900 mb-4">
                📊 現在のOGP設定
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">メタデータ</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li><strong>タイトル:</strong> OGPテストページ - balubo</li>
                    <li><strong>説明:</strong> SNS投稿時の画像表示をテストするためのページです。</li>
                    <li><strong>URL:</strong> https://www.balubo.jp/og-test</li>
                    <li><strong>画像サイズ:</strong> 1200×630px</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">Twitter Card</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li><strong>カードタイプ:</strong> summary_large_image</li>
                    <li><strong>サイト:</strong> @AiBalubo56518</li>
                    <li><strong>作成者:</strong> @AiBalubo56518</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
