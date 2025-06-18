"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * FeaturesSection
 * 主要機能紹介 (4 features + CTA) をまとめたセクション。
 */
export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-accent-dark-blue/5 via-base-light-gray to-primary-light-blue/10">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            あなたの挑戦を後押しする <span className="text-accent-dark-blue">4 つの機能</span>
          </h2>
          <p className="text-lg text-text-secondary">
            インプットとアウトプットの両面から、努力の軌跡を可視化します
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 機能1: AI作品分析 */}
          <FeatureCard
            gradient="from-accent-dark-blue to-primary-blue"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            }
            title="AI作品分析 & ストーリー抽出"
            description="作品をアップロードすると、AI が作風・得意分野・挑戦の背景まで多角的に分析。言語化しづらい魅力を発見できます。"
            details={[
              "作風：“温かみのある親しみやすいトーン”",
              "得意分野：“ライフスタイル・グルメ系コンテンツ”",
              "潜在スキル：“感情に訴える表現力”",
            ]}
          />

          {/* 機能2: AI強み言語化 */}
          <FeatureCard
            reverse
            gradient="from-primary-blue to-primary-light-blue"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            }
            title="AIが強みを言語化・キャッチコピー生成"
            description="経歴や作品、回答したインプット情報から強みを抽出し、魅力的な自己紹介文・スキルタグを提案します。"
            customDetails={
              <div className="text-sm text-text-secondary">
                <p className="mb-2">“読者の心に響く、ストーリーテリングのスペシャリスト”</p>
                <div className="flex flex-wrap gap-2">
                  <Tag color="accent-dark-blue">感情表現</Tag>
                  <Tag color="primary-blue">共感力</Tag>
                  <Tag color="success-green">体験重視</Tag>
                </div>
              </div>
            }
          />

          {/* 機能3: SNS機能 */}
          <FeatureCard
            gradient="from-success-green to-info-blue"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            }
            title="承認型SNSで質の高いつながり"
            description="双方向承認のSNSで、共感し合えるクリエイターや企業とつながり、次の挑戦の機会を広げます。"
            details={["双方向承認でのつながり形成", "タグベースでの相互レビュー", "他クリエイターの活動をフィードで確認"]}
          />

          {/* 機能4: スマートポートフォリオ */}
          <FeatureCard
            reverse
            gradient="from-warning-yellow to-info-blue"
            icon={
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
            title="スマートポートフォリオ"
            description="AI分析結果を自動統合したポートフォリオで、努力の軌跡と成果を一目で伝えられます。"
            details={["レスポンシブ対応の美しいレイアウト", "AI分析結果の自動統合表示", "カスタマイズ可能な公開設定"]}
          />
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-text-secondary mb-6">
            これらの機能を、<span className="font-semibold text-accent-dark-blue">完全無料</span>でお試しいただけます
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-accent-dark-blue hover:bg-primary-blue text-lg px-10 py-4 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              無料でAI機能を体験する
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- helpers -------------------------------- */

function FeatureCard({
  gradient,
  icon,
  title,
  description,
  details,
  customDetails,
  reverse = false,
}: {
  gradient: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  reverse?: boolean;
  details?: string[];
  customDetails?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className={`flex items-start gap-6 ${reverse ? 'lg:flex-row-reverse lg:text-right' : ''}`}>
        <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center flex-shrink-0`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-text-primary mb-4">{title}</h3>
          <p className="text-text-secondary leading-relaxed mb-6">{description}</p>

          {details && (
            <div className="bg-base-light-gray rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">できること：</h4>
              <ul className="text-sm text-text-secondary space-y-1">
                {details.map((d) => (
                  <li key={d}>• {d}</li>
                ))}
              </ul>
            </div>
          )}

          {customDetails && <div className="bg-base-light-gray rounded-lg p-4">{customDetails}</div>}
        </div>
      </div>
    </div>
  );
}

function Tag({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span className={`bg-${color}/10 text-${color} px-2 py-1 rounded-full text-xs`}>{children}</span>
  );
}
