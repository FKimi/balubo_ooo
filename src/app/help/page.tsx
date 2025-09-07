'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { MobileBottomNavigation } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ChevronRight, 
  User, 
  Upload, 
  Users, 
  BarChart3, 
  Heart,
  MessageCircle,
  Share2,
  Search,
  Filter,
  Settings,
  Eye,
  FileText,
  Camera,
  Palette,
  Briefcase,
  Star,
  HelpCircle,
  ExternalLink
} from 'lucide-react'

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  description: string
}

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction')

  const sections: Section[] = [
    {
      id: 'introduction',
      title: 'はじめに',
      icon: <User className="w-5 h-5" />,
      description: 'baluboの概要と基本的な使い方'
    },
    {
      id: 'profile',
      title: 'プロフィール設定',
      icon: <Settings className="w-5 h-5" />,
      description: 'アカウント作成とプロフィール情報の設定'
    },
    {
      id: 'works',
      title: '作品投稿',
      icon: <Upload className="w-5 h-5" />,
      description: '作品の投稿・編集・管理方法'
    },
    {
      id: 'social',
      title: 'フォロー・フィード',
      icon: <Users className="w-5 h-5" />,
      description: 'フォロー機能とフィード画面の使い方'
    },
    {
      id: 'analysis',
      title: 'AI分析機能',
      icon: <BarChart3 className="w-5 h-5" />,
      description: '強み分析と詳細レポートの活用'
    },
    {
      id: 'faq',
      title: 'よくある質問',
      icon: <HelpCircle className="w-5 h-5" />,
      description: 'トラブルシューティングとFAQ'
    }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">baluboへようこそ！</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                baluboは、ライター・クリエイター向けの次世代ポートフォリオプラットフォームです。
                あなたの作品を魅力的に展示し、他のクリエイターとつながり、AI分析による強みの発見ができます。
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-[#5570F3]/20 hover:border-[#5570F3]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#5570F3]/10 rounded-full flex items-center justify-center">
                      <Palette className="w-6 h-6 text-[#5570F3]" />
                    </div>
                    <h3 className="text-xl font-semibold">AI自動化で簡単投稿</h3>
                  </div>
                  <p className="text-gray-600">
                    URLを入力するだけで作品情報を自動生成。タイトル・説明文・タグまでAIがサポートします。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20 hover:border-[#5570F3]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#5570F3]/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#5570F3]" />
                    </div>
                    <h3 className="text-xl font-semibold">仲間と繋がる</h3>
                  </div>
                  <p className="text-gray-600">
                    同じ分野のクリエイターをフォローして、インスピレーションを得ましょう。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20 hover:border-[#5570F3]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#5570F3]/10 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-[#5570F3]" />
                    </div>
                    <h3 className="text-xl font-semibold">AIが強み・魅力を言語化</h3>
                  </div>
                  <p className="text-gray-600">
                    作品分析であなたの隠れた強みや魅力を発見し、言葉にして伝えやすくします。
                  </p>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20 hover:border-[#5570F3]/40 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#5570F3]/10 rounded-full flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-[#5570F3]" />
                    </div>
                    <h3 className="text-xl font-semibold">簡単シェア</h3>
                  </div>
                  <p className="text-gray-600">
                    作成したポートフォリオは簡単にシェアして、より多くの人に見てもらえます。
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-[#5570F3]/5 rounded-2xl p-6 border border-[#5570F3]/20">
              <h3 className="text-xl font-semibold mb-3 text-[#5570F3]">はじめるには</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span>プロフィール情報を設定する</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span>最初の作品を投稿する</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span>他のクリエイターをフォローする</span>
                </div>
              </div>
            </div>
          </div>
        )

      case 'profile':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">プロフィール設定</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                魅力的なプロフィールを作成して、あなたの個性とスキルをアピールしましょう。
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Camera className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">プロフィール画像・背景画像</h3>
                      <p className="text-gray-600 mb-4">
                        プロフィール画像は顔写真や作品の一部、背景画像はあなたらしさを表現する画像を設定しましょう。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-[#5570F3] text-[#5570F3]">推奨サイズ: 400×400px</Badge>
                        <Badge variant="outline" className="border-[#5570F3] text-[#5570F3]">形式: JPG, PNG</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">自己紹介</h3>
                      <p className="text-gray-600 mb-4">
                        あなたの経歴、得意分野、創作に対する想いなどを詳しく書きましょう。検索でも重要な情報になります。
                      </p>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 italic">
                          「グラフィックデザイナーとして5年の経験があります。企業のブランディングデザインを得意とし、
                          シンプルで印象的なデザインを心がけています...」
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">スキル・経験</h3>
                      <p className="text-gray-600 mb-4">
                        使用できるツールや技術、得意な分野をタグ形式で追加しましょう。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[#5570F3]/10 text-[#5570F3] border-[#5570F3]/20">Photoshop</Badge>
                        <Badge className="bg-[#5570F3]/10 text-[#5570F3] border-[#5570F3]/20">Illustrator</Badge>
                        <Badge className="bg-[#5570F3]/10 text-[#5570F3] border-[#5570F3]/20">ブランディング</Badge>
                        <Badge className="bg-[#5570F3]/10 text-[#5570F3] border-[#5570F3]/20">ライティング</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">キャリア情報</h3>
                      <p className="text-gray-600 mb-4">
                        職歴や学歴、現在の所属などを登録してください。信頼性向上につながります。
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">会社名・部署名</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">役職・担当業務</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">期間（開始日〜終了日）</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-[#5570F3]/5 rounded-2xl p-6 border border-[#5570F3]/20">
              <h3 className="text-xl font-semibold mb-3 text-[#5570F3]">プライバシー設定</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-[#5570F3]" />
                  <div>
                    <span className="font-medium">ポートフォリオの公開設定</span>
                    <p className="text-sm text-gray-600">「公開」にすると検索結果に表示され、URLでシェアできます</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'works':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">作品投稿</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                URLを入力するだけで AI が自動で作品情報を生成！効率的に魅力的なポートフォリオを作成できます。
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Upload className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">作品の投稿方法</h3>
                      <div className="bg-[#5570F3]/5 p-4 rounded-lg mb-4 border border-[#5570F3]/20">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">✨</span>
                          <h4 className="font-medium text-[#5570F3]">baluboの強み: 簡単自動化</h4>
                        </div>
                        <p className="text-sm text-gray-700">
                          URLを入力するだけで、AI が作品タイトル・説明文・タグを自動生成！
                          さらに作品の強みや魅力も言語化してくれます。
                        </p>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                          <div>
                            <span className="font-medium">「作品追加」ボタンをクリック</span>
                            <p className="text-sm text-gray-600">ヘッダーの青いボタンから簡単にスタート</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                          <div>
                            <span className="font-medium">作品のURLを入力</span>
                            <p className="text-sm text-gray-600">ポートフォリオサイトやBehanceなどのURLを貼り付け</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                          <div>
                            <span className="font-medium">AI が自動で情報を取得</span>
                            <p className="text-sm text-gray-600">タイトル・説明文が自動入力され、編集も可能</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</div>
                          <div>
                            <span className="font-medium">バナー画像をアップロード</span>
                            <p className="text-sm text-gray-600">推奨サイズ: 1200×630px（JPG, PNG対応）</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">5</div>
                          <div>
                            <span className="font-medium">AI分析で自動タグ生成</span>
                            <p className="text-sm text-gray-600">関連技術・スタイル・業界のタグを AI が提案</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">6</div>
                          <div>
                            <span className="font-medium">強み・魅力の言語化</span>
                            <p className="text-sm text-gray-600">AI があなたの作品の特徴を分析して文章化</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">AI自動化機能の詳細</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#5570F3]/5 to-[#5570F3]/10 p-4 rounded-lg border border-[#5570F3]/20">
                        <h4 className="font-medium text-[#5570F3] mb-2 flex items-center gap-2">
                          <span className="text-lg">🤖</span>
                          URL自動解析
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• OGP情報からタイトル取得</li>
                          <li>• メタデータから説明文生成</li>
                          <li>• 画像の自動検出・取得</li>
                          <li>• サイト構造の分析</li>
                        </ul>
                      </div>
                      <div className="bg-gradient-to-br from-[#5570F3]/5 to-[#5570F3]/10 p-4 rounded-lg border border-[#5570F3]/20">
                        <h4 className="font-medium text-[#5570F3] mb-2 flex items-center gap-2">
                          <span className="text-lg">🏷️</span>
                          スマートタグ生成
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• コンテンツ内容の AI解析</li>
                          <li>• 技術スタック自動検出</li>
                          <li>• デザインスタイル判定</li>
                          <li>• 業界・カテゴリ分類</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-[#5570F3]/5 to-[#5570F3]/10 p-4 rounded-lg border border-[#5570F3]/20">
                        <h4 className="font-medium text-[#5570F3] mb-2 flex items-center gap-2">
                          <span className="text-lg">💎</span>
                          強み言語化
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• 作品の特徴・魅力を分析</li>
                          <li>• 技術的な強みを抽出</li>
                          <li>• デザイン傾向の特定</li>
                          <li>• 差別化ポイントの発見</li>
                        </ul>
                      </div>
                      <div className="bg-[#5570F3]/5 p-4 rounded-lg border border-[#5570F3]/20">
                        <h4 className="font-medium text-[#5570F3] mb-2">📝 編集・カスタマイズ</h4>
                        <p className="text-sm text-gray-600">
                          AI が生成した内容は全て編集可能です。
                          自動生成をベースに、あなたらしい表現に調整してください。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">主な作品の設定</h3>
                      <p className="text-gray-600 mb-4">
                        特に自信のある作品は「主な作品」として設定しましょう。プロフィール上部に優先的に表示されます。
                      </p>
                      <div className="bg-[#5570F3]/5 p-4 rounded-lg border border-[#5570F3]/20">
                        <p className="text-sm text-gray-700">
                          💡 <strong>コツ:</strong> 多様なスキルをアピールできるよう、異なるタイプの作品を主な作品に設定するのがおすすめです。
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">フォロー・フィード機能</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                他のクリエイターとつながり、インスピレーションを得ましょう。
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">フォロー機能</h3>
                      <p className="text-gray-600 mb-4">
                        気になるクリエイターをフォローして、最新の作品をフィードで確認できます。
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">プロフィールページの「フォロー」ボタンをクリック</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">フォロー中のユーザー一覧はプロフィールページで確認</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-[#5570F3] rounded-full"></div>
                          <span className="text-sm">相互フォローでより深いつながりを築けます</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Search className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">フィード画面の使い方</h3>
                      <p className="text-gray-600 mb-4">
                        フィード画面では、様々な作品を発見し、検索・フィルタリングが可能です。
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#5570F3]">「すべて」タブ</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• 全ユーザーの最新作品</li>
                            <li>• 検索・タグ絞り込み可能</li>
                            <li>• 新しい発見がある</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-[#5570F3]">「フォロー中」タブ</h4>
                          <ul className="space-y-1 text-sm text-gray-600">
                            <li>• フォロー中のユーザーの作品のみ</li>
                            <li>• よりパーソナライズされた体験</li>
                            <li>• 見逃したくない作品をチェック</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">いいね・コメント</h3>
                      <p className="text-gray-600 mb-4">
                        作品に対する評価や感想を伝えて、クリエイター同士の交流を深めましょう。
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 bg-[#5570F3]/5 px-3 py-2 rounded-lg">
                          <Heart className="w-4 h-4 text-[#5570F3]" />
                          <span className="text-sm">いいね</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#5570F3]/5 px-3 py-2 rounded-lg">
                          <MessageCircle className="w-4 h-4 text-[#5570F3]" />
                          <span className="text-sm">コメント</span>
                        </div>
                        <div className="flex items-center gap-2 bg-[#5570F3]/5 px-3 py-2 rounded-lg">
                          <Share2 className="w-4 h-4 text-[#5570F3]" />
                          <span className="text-sm">シェア</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'analysis':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI分析機能</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                AIがあなたの作品を分析して、隠れた強みや特徴を発見してくれます。
              </p>
            </div>

            <div className="space-y-6">
              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#5570F3]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-[#5570F3]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">詳細レポート</h3>
                      <p className="text-gray-600 mb-4">
                        投稿した作品から、あなたのクリエイティブな特徴や強みを分析します。
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-[#5570F3]/5 p-4 rounded-lg border border-[#5570F3]/20">
                          <h4 className="font-medium text-[#5570F3] mb-2">テイスト分析</h4>
                          <p className="text-sm text-gray-600">デザインスタイルや色彩傾向を分析</p>
                        </div>
                        <div className="bg-[#5570F3]/5 p-4 rounded-lg border border-[#5570F3]/20">
                          <h4 className="font-medium text-[#5570F3] mb-2">思考プロセス</h4>
                          <p className="text-sm text-gray-600">制作アプローチの特徴を言語化</p>
                        </div>
                        <div className="bg-[#5570F3]/5 p-4 rounded-lg border border-[#5570F3]/20">
                          <h4 className="font-medium text-[#5570F3] mb-2">マッチング相性</h4>
                          <p className="text-sm text-gray-600">適性のある業界・職種を提案</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">分析精度を高めるコツ</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                      <div>
                        <h4 className="font-medium">多様な作品を投稿</h4>
                        <p className="text-sm text-gray-600">異なるタイプの作品を複数投稿することで、より詳細な分析が可能になります</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                      <div>
                        <h4 className="font-medium">詳細な説明文を記載</h4>
                        <p className="text-sm text-gray-600">制作意図や工夫した点を詳しく書くことで、AIがより深く理解できます</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-[#5570F3] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                      <div>
                        <h4 className="font-medium">適切なタグ設定</h4>
                        <p className="text-sm text-gray-600">使用ツールや技術、ジャンルを正確にタグ付けしましょう</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">分析結果の活用方法</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-[#5570F3] mb-3">キャリア開発</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 強みを活かせる職種の発見</li>
                        <li>• スキルアップの方向性決定</li>
                        <li>• 転職・案件獲得時のアピール材料</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#5570F3] mb-3">作品制作</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li>• 自分の特徴を意識した制作</li>
                        <li>• 新しいチャレンジ領域の発見</li>
                        <li>• ポートフォリオの方向性決定</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 'faq':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">よくある質問</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                困ったときはこちらをご確認ください。解決しない場合はお気軽にお問い合わせください。
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  question: '無料で利用できますか？',
                  answer: 'はい、baluboは基本機能を無料でご利用いただけます。作品投稿、プロフィール作成、フォロー機能、AI分析など主要機能をすべて無料でお使いいただけます。'
                },
                {
                  question: '投稿できる作品の数に制限はありますか？',
                  answer: '作品投稿数に制限はありません。お気軽にたくさんの作品を投稿してください。ただし、一つの作品のファイルサイズは10MBまでとなっています。'
                },
                {
                  question: '他の人の作品をダウンロードできますか？',
                  answer: '作品の著作権は投稿者に帰属します。他の人の作品を無断で使用することはできません。利用したい場合は、必ず投稿者に直接お問い合わせください。'
                },
                {
                  question: 'AI分析はどの程度正確ですか？',
                  answer: 'AI分析は投稿された作品データに基づいて行われます。より多くの作品を投稿し、詳細な情報を記載することで分析精度が向上します。参考情報としてご活用ください。'
                },
                {
                  question: 'アカウントを削除したい場合は？',
                  answer: 'プロフィール設定ページからアカウント削除を行えます。削除すると、投稿した作品やプロフィール情報はすべて削除され、復元できませんのでご注意ください。'
                },
                {
                  question: '商用利用は可能ですか？',
                  answer: 'はい、baluboで作成したポートフォリオを商用目的でご利用いただけます。営業資料や提案書への掲載、クライアントへの共有なども可能です。'
                },
                {
                  question: '技術的な問題が発生した場合は？',
                  answer: 'お使いのブラウザを最新版に更新し、キャッシュをクリアしてから再度お試しください。問題が解決しない場合は、お問い合わせフォームからご連絡ください。'
                }
              ].map((item, index) => (
                <Card key={index} className="border-[#5570F3]/20">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3 text-[#5570F3]">Q. {item.question}</h3>
                    <p className="text-gray-700 leading-relaxed">A. {item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-[#5570F3]/20 bg-[#5570F3]/5">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-semibold mb-3 text-[#5570F3]">その他のお問い合わせ</h3>
                <p className="text-gray-700 mb-4">
                  上記で解決しない問題や、機能についてのご要望がございましたらお気軽にご連絡ください。
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-[#5570F3] hover:bg-[#4461E8]">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    お問い合わせ
                  </Button>
                  <Button variant="outline" className="border-[#5570F3] text-[#5570F3] hover:bg-[#5570F3]/10">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    運営会社サイト
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* サイドバーナビゲーション */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="border-[#5570F3]/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">ヘルプ・使い方</h2>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-[#5570F3] text-white shadow-lg'
                            : 'text-gray-700 hover:bg-[#5570F3]/10 hover:text-[#5570F3]'
                        }`}
                      >
                        {section.icon}
                        <div className="flex-1">
                          <div className="font-medium">{section.title}</div>
                          <div className={`text-xs ${
                            activeSection === section.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {section.description}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform ${
                          activeSection === section.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className="lg:col-span-3">
            <Card className="border-[#5570F3]/20">
              <CardContent className="p-8">
                {renderContent()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileBottomNavigation />
    </div>
  )
}
