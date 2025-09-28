import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "プライバシーポリシー | balubo",
  description:
    "balubo（バルボ）のプライバシーポリシーページです。個人情報の取り扱いについてご確認ください。",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white px-4 py-20 md:py-24">
      <div className="container mx-auto max-w-4xl space-y-10 text-slate-800">
        {/* ページタイトル */}
        <h1 className="text-4xl font-bold md:text-5xl">プライバシーポリシー</h1>
        <p className="text-sm text-slate-600">最終更新日: 2025年4月30日</p>

        {/* 序文 */}
        <section className="space-y-4 leading-relaxed text-slate-700">
          <p>
            balubo（以下「当サービス」といいます。）は、ユーザーの個人情報を適切に保護することを重要な責務と考え、
            本プライバシーポリシー（以下「本ポリシー」といいます。）を定めます。
            当サービスをご利用いただく際は、本ポリシーをご確認ください。
          </p>
        </section>

        {/* 目次 */}
        <section className="space-y-2">
          <h2 className="text-2xl font-semibold">目次</h2>
          <ol className="list-decimal space-y-1 pl-5 text-slate-700">
            <li>収集する情報</li>
            <li>情報の利用目的</li>
            <li>情報の共有</li>
            <li>クッキー等の利用</li>
            <li>第三者サービスとの連携</li>
            <li>情報の保管とセキュリティ</li>
            <li>ユーザーの権利</li>
            <li>プライバシーポリシーの変更</li>
            <li>お問い合わせ</li>
            <li>準拠法・裁判管轄</li>
          </ol>
        </section>

        {/* 各条項 */}
        <section className="space-y-6 leading-relaxed text-slate-700">
          {/* 1. 収集する情報 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">1. 収集する情報</h3>
            <p>当サービスは、以下の情報を収集する場合があります。</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>名前、メールアドレスなどのアカウント登録情報</li>
              <li>プロフィール情報（職業、自己紹介、SNSリンク等）</li>
              <li>ユーザーが投稿するテキスト・画像などのコンテンツ</li>
              <li>サービス利用履歴、アクセスログ、IP アドレス等の技術情報</li>
              <li>クッキーや類似技術を通じて取得する情報</li>
            </ul>
          </div>

          {/* 2. 情報の利用目的 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">2. 情報の利用目的</h3>
            <p>当サービスは、収集した情報を以下の目的で利用します。</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>サービスの提供・維持・改善</li>
              <li>本人確認、認証、セキュリティ強化</li>
              <li>ユーザーサポートの提供、お問い合わせ対応</li>
              <li>新機能・キャンペーン等の案内</li>
              <li>利用規約の違反調査、詐欺防止</li>
              <li>統計データの作成およびマーケティング分析</li>
            </ul>
          </div>

          {/* 3. 情報の共有 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">3. 情報の共有</h3>
            <p>
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者へ開示・提供しません。
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>ユーザー本人の同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>
                人の生命・身体・財産の保護のために必要で、本人の同意を得ることが難しい場合
              </li>
              <li>
                公衆衛生の向上・児童の健全育成推進のために必要で、本人の同意を得ることが難しい場合
              </li>
              <li>
                国の機関等が法令の定める事務を遂行する際に協力する必要がある場合
              </li>
              <li>合併・事業譲渡等に伴い事業を継承する場合</li>
            </ul>
          </div>

          {/* 4. クッキー等の利用 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">4. クッキー等の利用</h3>
            <p>
              当サービスは、ユーザー体験向上やアクセス解析のためにクッキー（Cookies）や類似技術を使用します。クッキーの利用を希望しない場合、ブラウザの設定で無効化できますが、一部機能が利用できなくなる可能性があります。
            </p>
          </div>

          {/* 5. 第三者サービスとの連携 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              5. 第三者サービスとの連携
            </h3>
            <p>
              当サービスは、Google
              認証など第三者サービスと連携する場合があります。これらサービスの利用に際しては、各サービス提供者のプライバシーポリシーも併せてご確認ください。
            </p>
          </div>

          {/* 6. 情報の保管とセキュリティ */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              6. 情報の保管とセキュリティ
            </h3>
            <p>
              当サービスは、個人情報への不正アクセス、紛失、破壊、改ざんおよび漏えいを防止するため、合理的な安全対策を講じます。
            </p>
          </div>

          {/* 7. ユーザーの権利 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">7. ユーザーの権利</h3>
            <p>
              ユーザーは、自己の個人情報について、開示・訂正・削除・利用停止を求める権利を有します。具体的な手続きは「10.
              お問い合わせ」をご参照ください。
            </p>
          </div>

          {/* 8. プライバシーポリシーの変更 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">
              8. プライバシーポリシーの変更
            </h3>
            <p>
              当サービスは、必要に応じて本ポリシーを変更します。重要な変更がある場合、当サービス上でお知らせします。
            </p>
          </div>

          {/* 9. お問い合わせ */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">9. お問い合わせ</h3>
            <p>
              本ポリシーに関するご質問・ご要望は、以下のメールアドレスまでご連絡ください。
            </p>
            <p className="mt-2 font-medium">baluboport@gmail.com</p>
          </div>

          {/* 10. 準拠法・裁判管轄 */}
          <div>
            <h3 className="mb-2 text-xl font-semibold">10. 準拠法・裁判管轄</h3>
            <p>
              本ポリシーは日本法を準拠法とし、本サービスに関連して生じる紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
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
  );
}
