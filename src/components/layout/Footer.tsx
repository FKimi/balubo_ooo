"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mb-16 md:mb-0">
      <div className="container mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            href="https://corp.balubo.jp/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="運営会社：株式会社balubo（新しいタブで開く）"
            className="text-sm leading-6 text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
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
            className="text-sm leading-6 text-gray-600 hover:text-gray-900 flex items-center gap-1"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            X (Twitter)
          </a>
          <Link
            href="/terms"
            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
          >
            利用規約
          </Link>
          <Link
            href="/privacy"
            className="text-sm leading-6 text-gray-600 hover:text-gray-900"
          >
            プライバシーポリシー
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; 2025 balubo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
