import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '利用規約 | balubo',
  description: 'balubo（バルボ）の利用規約ページです。サービスをご利用の前に必ずお読みください。',
}

export default function TermsPage() {
  return (
    <div className="bg-white px-4 py-20 md:py-24">
      <div className="container mx-auto max-w-4xl space-y-10 text-slate-800">
        {/* ページタイトル */}
        <h1 className="text-4xl font-bold md:text-5xl">利用規約</h1>
        <p className="text-sm text-slate-600">
          最終更新日: 2025年4月30日
        </p>

        {/* 序文 */}
        <section className="space-y-4 leading-relaxed">
          <p>
            本規約（以下「本規約」といいます。）は、balubo（以下「当サービス」といいます。）を運営するbalubo&nbsp;運営チーム（以下「当社」といいます。）が提供するウェブサイト及び関連サービスの利用条件を定めるものです。ユーザーの皆さま（以下「ユーザー」といいます。）は、本規約に従って当サービスをご利用いただきます。
          </p>
        </section>
        

        {/* 目次 */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">目次</h2>
          <ol className="list-decimal space-y-1 pl-5 text-slate-700">
            <li>適用</li>
            <li>定義</li>
            <li>利用登録</li>
            <li>アカウント管理</li>
            <li>禁止事項</li>
            <li>サービスの提供の停止等</li>
            <li>著作権</li>
            <li>保証の否認および免責</li>
            <li>利用規約の変更</li>
            <li>通知または連絡</li>
            <li>準拠法・裁判管轄</li>
          </ol>
        </section>

        {/* 各条項 */}
        <section className="space-y-6 leading-relaxed text-slate-700">
          <div>
            <h3 className="mb-2 text-xl font-semibold">1. 適用</h3>
            <p>
              本規約は、ユーザーと当社との間の当サービスの利用に関わる一切の関係に適用されるものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">2. 定義</h3>
            <p>
              本規約において「コンテンツ」とは、テキスト、画像、動画、音声、その他一切の情報を意味します。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">3. 利用登録</h3>
            <p>
              当サービスの利用を希望する者は、本規約に同意の上、当社の定める方法により利用登録を申請し、当社がこれを承認することで、利用契約が成立するものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">4. アカウント管理</h3>
            <p>
              ユーザーは、自己の責任において当サービスのアカウント情報を適切に管理しなければなりません。ユーザーは、いかなる場合にもアカウントを第三者に譲渡・貸与・共有してはならないものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">5. 禁止事項</h3>
            <p>ユーザーは、以下の行為を行ってはなりません。</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為または犯罪行為に結びつく行為</li>
              <li>当社、他のユーザー、または第三者の権利や利益を侵害する行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>不正アクセスを試みる行為</li>
              <li>その他、当社が不適切と判断する行為</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">6. サービスの提供の停止等</h3>
            <p>
              当社は、システム保守、本サービスのアップデート、天災地変等の不可抗力、その他当社が必要と判断した場合には、ユーザーに事前に通知することなく当サービスの全部または一部の提供を停止または中断することがあります。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">7. 著作権</h3>
            <p>
              当サービス上でユーザーが投稿またはアップロードしたコンテンツの著作権は、原則としてユーザーに帰属します。ただし、ユーザーは、当社に対して、当サービスの運営・宣伝・改善を目的とする範囲で当該コンテンツを無償で利用する非独占的権利を許諾するものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">8. 保証の否認および免責</h3>
            <p>
              当社は、当サービスがユーザーの特定の目的に適合すること、期待する機能・商品的価値・正確性・有用性を有すること、及び不具合が生じないことについて一切保証いたしません。また、当サービスの利用により生じた一切の損害について、当社に故意または重過失がある場合を除き、当社は責任を負わないものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">9. 利用規約の変更</h3>
            <p>
              当社は、必要と判断した場合には、ユーザーへ適宜通知の上、本規約を変更することができるものとします。変更後の本規約は、当社が別途定める場合を除き、当サービス上に掲示した時点から効力を生じるものとします。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">10. 通知または連絡</h3>
            <p>
              当社からユーザーへの通知または連絡は、当サービス内での掲示、メール送信、その他当社が適当と判断する方法で行います。
            </p>
          </div>

          <div>
            <h3 className="mb-2 text-xl font-semibold">11. 準拠法・裁判管轄</h3>
            <p>
              本規約は日本法を準拠法とし、本サービスに関連して生じる紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </div>
        </section>

        {/* 戻るリンク */}
        <div>
          <Link href="/" className="text-blue-600 hover:underline">
            &larr; ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  )
} 