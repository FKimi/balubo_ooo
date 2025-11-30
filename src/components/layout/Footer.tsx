"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* 上段：4カラムレイアウト */}
        <div className="grid gap-10 md:grid-cols-4 md:items-start">
          {/* ブランド / ミッション */}
          <div className="space-y-3">
            <div>
              <p className="text-xl font-bold tracking-tight text-gray-900">balubo</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                BtoB企業とプロフェッショナルをつなぎ、
                専門性が正しく評価される出会いを増やすためのポートフォリオプラットフォームです。
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-500">
                プロフィールのイメージを見てみたい方は{" "}
                <a
                  href="https://balubo.jp/fumiya-kimiwada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
                >
                  balubo.jp/fumiya-kimiwada
                </a>
                をご覧ください。
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://corp.balubo.jp"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="運営会社：株式会社balubo（新しいタブで開く）"
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                運営会社
              </a>
              <a
                href="https://x.com/AiBalubo56518"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="balubo公式X（旧Twitter）アカウント（新しいタブで開く）"
                className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter)
              </a>
            </div>
          </div>

          {/* baluboについて */}
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              baluboについて
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/enterprise" className="hover:text-gray-900">
                  企業の方はこちら
                </Link>
              </li>
              <li>
                <Link href="/vision" className="hover:text-gray-900">
                  baluboが目指す世界
                </Link>
              </li>
              <li>
                <Link href="/reason" className="hover:text-gray-900">
                  私たちがbaluboを創った理由
                </Link>
              </li>
              <li>
                <Link href="/updates" className="hover:text-gray-900">
                  最近のアップデート
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              サポート
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="#faq" className="hover:text-gray-900">
                  よくあるご質問
                </Link>
              </li>
              <li>
                <a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSduddB7969fstVTNmprN0xuSeNY5HLz3wkdWkvV8i2tkTQWcQ/viewform?usp=publish-editor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-900"
                >
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>

          {/* 規約など */}
          <div className="space-y-3 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              規約など
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link href="/terms" className="hover:text-gray-900">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-gray-900">
                  プライバシーポリシー
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 下段：コピーライト */}
        <div className="mt-10 border-t border-gray-100 pt-6">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; 2025 balubo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
