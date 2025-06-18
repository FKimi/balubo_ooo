"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/** balubo開始 3 ステップセクション */
export default function StepsSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-base-light-gray via-primary-light-blue/5 to-base-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            3ステップで、あなたの挑戦の軌跡を世界へ
          </h2>
          <p className="text-lg text-text-secondary">
            必要なのは<span className="font-semibold text-accent-dark-blue">メールアドレスだけ</span>。カンタン3ステップで完了！
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              num={1}
              color="warning-yellow"
              gradient="from-accent-dark-blue to-primary-blue"
              title="無料アカウント登録"
              description="メールアドレスで簡単登録。SNS認証も利用可能です。"
              icon={
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              }
            />

            <StepCard
              num={2}
              color="success-green"
              gradient="from-primary-blue to-primary-light-blue"
              title="作品アップロード & ストーリー入力"
              description="インプット質問に答えて、挑戦の背景を記録しながら作品をアップロード。"
              icon={
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
            />

            <StepCard
              num={3}
              color="info-blue"
              gradient="from-success-green to-info-blue"
              title="AI分析&オファー受信！"
              description="AIがあなたを分析開始！新しい出会いとチャンスが待っています。"
              icon={
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-success-green mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold text-text-primary">すべて無料</span>
            </div>
            <p className="text-text-secondary mb-6">
              登録料、月額費用、すべて無料。クリエイターの皆様に気軽にお試しいただけます。
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                今すぐ無料で始める
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- helpers -------------------------------- */

function StepCard({
  num,
  color,
  gradient,
  title,
  description,
  icon,
}: {
  num: number;
  color: string;
  gradient: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="text-center group">
      <div className="relative mb-8">
        <div
          className={`w-24 h-24 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105`}
        >
          {icon}
        </div>
        <div
          className={`absolute -top-2 -left-2 w-8 h-8 bg-${color} rounded-full flex items-center justify-center shadow-lg`}
        >
          <span className="text-sm font-bold text-white">{num}</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-text-primary mb-3">{title}</h3>
      <p className="text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, "<br />") }} />
    </div>
  );
}
