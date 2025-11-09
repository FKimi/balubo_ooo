"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import StickyCTA from "@/components/landing/StickyCTA";

export default function EnterpriseLandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [email] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // 任意アンケート項目（全て任意）
  const [industry, setIndustry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [painPoints, setPainPoints] = useState("");
  const [expectations, setExpectations] = useState("");
  const [budget, setBudget] = useState("");
  const [budgetMin, setBudgetMin] = useState<string>("");
  const [budgetMax, setBudgetMax] = useState<string>("");
  const [budgetPeriod, setBudgetPeriod] = useState<"monthly" | "per_project" | "other">("per_project");
  const [preferredBusinessModel, setPreferredBusinessModel] = useState("");
  const [businessModelChoice, setBusinessModelChoice] = useState("subscription");
  const [preferredPeople, setPreferredPeople] = useState("");
  const [contentIntent, setContentIntent] = useState("");
  const [freeText, setFreeText] = useState("");
  const [interviewOptIn, setInterviewOptIn] = useState(false);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  function resetSurvey() {
    setIndustry("");
    setCompanyName("");
    setJobRole("");
    setPainPoints("");
    setExpectations("");
    setBudget("");
    setBudgetMin("");
    setBudgetMax("");
    setBudgetPeriod("per_project");
    setPreferredBusinessModel("");
    setBusinessModelChoice("subscription");
    setPreferredPeople("");
    setContentIntent("");
    setFreeText("");
    setInterviewOptIn(false);
  }

  async function submitSurvey() {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          industry,
          companyName,
          jobRole,
          painPoints,
          expectations,
          budget,
          budgetMin: budgetMin ? Number(budgetMin) : undefined,
          budgetMax: budgetMax ? Number(budgetMax) : undefined,
          budgetPeriod,
          preferredBusinessModel,
          businessModelChoice,
          preferredPeople,
          contentIntent,
          freeText,
          interviewOptIn,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "送信に失敗しました");
      setIsSurveyOpen(false);
      resetSurvey();
      alert("ご協力ありがとうございました！");
    } catch (err) {
      alert(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

  // アンケートモーダルのアクセシビリティ（ESCで閉じる + フォーカストラップ + 初期フォーカス）
  useEffect(() => {
    if (!isSurveyOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSurveyOpen(false);
        return;
      }
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first?.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // 初期フォーカス
    setTimeout(() => {
      const el = modalRef.current?.querySelector<HTMLElement>(
        "input, textarea, select, button",
      );
      el?.focus();
    }, 0);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSurveyOpen]);

  if (!mounted) return null;

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center space-x-2" aria-label="balubo トップページ">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900 tracking-tight">balubo</span>
            </div>
          </Link>
          <nav className="hidden md:flex items-center space-x-6" aria-label="グローバルナビゲーション">
            <Link href="/" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              クリエイター向け
            </Link>
            <Link href="#why" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              サービス
            </Link>
            <Link href="#pricing" className="text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium">
              料金
            </Link>
            <Button asChild className="rounded-xl bg-blue-600 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30">
              <a href="#waitlist">無料登録</a>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* 1. ファーストビュー */}
        <section className="relative bg-white pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="grid w-full grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
                {/* Left Content */}
                <div className="space-y-8 md:space-y-12 text-center lg:text-left">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                    <span className="block leading-[1.05]">
                      クリエイター探しで、<br />もう<span className="text-blue-600">時間を溶かさない</span>
                    </span>
                  </h1>

                  <div className="mx-auto max-w-2xl space-y-6 lg:mx-0">
                    <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-bold">
                      専門性でマッチングする時代へ。
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      <span className="text-blue-600 font-semibold">balubo</span>は、AIがクリエイターの「専門性」を可視化し、BtoB企業と最適なプロとの出会いを実現する専門性マッチングプラットフォームです。
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      ゼロからの事業説明も、終わらない探索も、ミスマッチも。すべての課題を解決し、あなたの事業を深く理解したプロクリエイターと、瞬時に出会えます。
                    </p>
                  </div>

                  {/* 社会的証明バッジ */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-50/80 rounded-full border border-blue-200 shadow-sm">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">ウェイトリスト受付中</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                      <Button
                        asChild
                        size="lg"
                        className="w-full rounded-xl bg-blue-600 px-10 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 sm:w-auto"
                      >
                        <a href="#waitlist" className="inline-flex items-center justify-center">
                          無料でウェイトリストに登録
                          <svg
                            className="ml-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </a>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full rounded-lg border border-gray-200 bg-white px-10 py-4 text-base font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50 sm:w-auto"
                      >
                        <a href="#why">サービスを見る</a>
                      </Button>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-gray-600">
                      <span className="flex items-center justify-center lg:justify-start">
                        <svg className="mr-1.5 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        ベータ版無料
                      </span>
                      <span className="flex items-center justify-center lg:justify-start">
                        <svg className="mr-1.5 h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        クレジットカード不要
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Visual */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-blue-100/40 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">AI</div>
                          <div className="flex-1">
                            <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                            <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                              <div className="flex-1">
                                <div className="h-2 bg-gray-200 rounded-full w-full mb-1"></div>
                                <div className="h-2 bg-gray-100 rounded-full w-2/3"></div>
                              </div>
                            <div className="text-blue-600">
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 課題提起 */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                担当者を疲弊させる<br className="sm:hidden" />「<span className="text-gray-700">制作フロー</span>」の実態
              </h2>
              <p className="text-lg text-gray-600 mt-4">多くのBtoB企業が直面する、クリエイター採用の課題</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-600">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">1</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">長期化する探索</h3>
                <p className="text-gray-600 leading-relaxed">SNSやポートフォリオサイトを探し続け、貴重な時間が消えていく。気づけば何週間も経っている。</p>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-600">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">2</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">ミスマッチの繰り返し</h3>
                <p className="text-gray-600 leading-relaxed">やっと見つけても、業界理解が浅くゼロから事業説明。意図が伝わらず、期待したアウトプットが得られない。</p>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-600">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">3</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">修正作業の繰り返し</h3>
                <p className="text-gray-600 leading-relaxed">何度も修正依頼を出し、結局担当者が自ら手直しする。本来の戦略業務に時間を使えない。</p>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-400">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">4</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">担当者の疲弊</h3>
                <p className="text-gray-600 leading-relaxed">「もう、外部の人にゼロから説明したくない...」この非効率なフローの繰り返しが、担当者を疲弊させる。</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 損失の明示 */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  このミスマッチが生む、<br className="sm:hidden" />3つの損失
                </h2>
                <p className="text-lg text-gray-600 mt-4">失っているのは、時間だけではありません</p>
              </div>
              <div className="grid gap-6 md:gap-8">
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-blue-600 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">機会損失の増大</h3>
                      <p className="text-gray-700 leading-relaxed">質の低いコンテンツで、本来獲得できたはずのリードや商談を逃している。SEO順位の低下、CVRの低下、そして売上の停滞。</p>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gray-400 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">ブランド毀損のリスク</h3>
                      <p className="text-gray-700 leading-relaxed">専門性の低いコンテンツは、企業の信頼性や権威性を損なう。一度失った信頼を取り戻すには、膨大な時間とコストが必要。</p>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-gray-400 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">担当者の疲弊と離職</h3>
                      <p className="text-gray-700 leading-relaxed">優秀なマーケターが、創造性のない作業に疲弊し、モチベーションを失っていく。採用・育成コストの無駄遣い。</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-xl border-2 border-blue-200">
                <div className="text-center">
                  <p className="text-xl md:text-2xl font-bold text-gray-900 leading-relaxed">
                    これらの課題を解決することが、<br className="sm:hidden" />BtoB企業のコンテンツマーケティング<span className="text-blue-600">成功の鍵</span>です。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 解決策の提示 */}
        <section id="why" className="relative bg-gradient-to-b from-white to-blue-50 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] opacity-40" style={{backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, rgb(241 245 249 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(241 245 249 / 0.3) 1px, transparent 1px)'}}></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                その課題を、<br className="sm:hidden" />baluboが解決します。
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                AIがクリエイターの「専門性」を可視化し、あなたの事業に最適なプロとの出会いを実現。<br className="hidden sm:block" />
                BtoB企業とクリエイターをつなぐ、専門性マッチングプラットフォームです。
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI専門性分析</h3>
                  <p className="text-gray-600 leading-relaxed">
                    ポートフォリオ、実績、クライアント評価を多角的に解析。数値では見えないスキルや経験値を可視化します。
                  </p>
                </div>
              </div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">瞬時マッチング</h3>
                  <p className="text-gray-600 leading-relaxed">
                    プロジェクトの要件を入力するだけ。AIが最適なクリエイターを瞬時に提案。膨大な探索時間を劇的に短縮。
                  </p>
                </div>
              </div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">信頼ネットワーク</h3>
                  <p className="text-gray-600 leading-relaxed">
                    業界プロによる推薦システム。信頼できる仲間が、さらに信頼できるクリエイターを繋ぎます。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 導入メリット */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                baluboがもたらす、<br className="sm:hidden" /><span className="text-blue-600">3つの価値</span>
              </h2>
              <p className="text-lg text-gray-600">クリエイター採用の課題を、根本から解決します</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-blue-200 hover:border-blue-600 transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">1</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">探索時間の短縮</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    AIが最適なクリエイターを瞬時に提案。<span className="font-bold text-blue-600">膨大な探索時間を削減</span>し、戦略業務に集中できます。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>SNS探索の無限ループから解放</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>面談調整・選考プロセスの効率化</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>本来の戦略業務に集中可能</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-blue-200 hover:border-blue-600 transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">2</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">ミスマッチの削減</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    専門性と事業理解度で選べるから、<span className="font-bold text-blue-600">ゼロからの説明が不要</span>。初日から本質的な議論ができます。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>業界知識・専門性の事前可視化</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>相性・コミュニケーションスタイルの分析</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>過去プロジェクトの成功パターン共有</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-blue-200 hover:border-blue-600 transition-all duration-300 hover:-translate-y-2">
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg">3</div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">コンテンツ品質の向上</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <span className="font-bold text-blue-600">専門性の高いプロ</span>が、事業を深く理解したコンテンツを制作。修正回数が減り、成果が向上します。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>専門性の高いコンテンツ制作</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>修正回数の大幅削減</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>リード獲得・CV率の向上</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. なぜ実現できるのか */}
        <section className="bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  なぜ、baluboは<br className="sm:hidden" /><span className="text-blue-600">最適なマッチング</span>を<br className="sm:hidden" />実現できるのか？
                </h2>
                <p className="text-lg text-gray-600 mt-4">2つのコア技術</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-10 border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">独自の「専門性解析AI」</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    ポートフォリオ、執筆記事、SNS投稿、クライアント評価など、多様なデータソースを統合解析。スキルや実績を客観的なデータとして可視化します。
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">業界特化度・専門性の定量評価</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">コミュニケーション適性の分析</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">プロジェクト成功率の予測</span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-10 border-2 border-gray-200 hover:border-gray-400 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">業界プロの「信頼の紹介」</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    ベテランクリエイターが、自身の実績と信頼を賭けて仲間を推薦。スキルだけでなく、人柄や仕事への姿勢まで保証されます。
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">実績あるプロによる推薦</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">信頼関係の連鎖的構築</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">品質保証の仕組み</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6.5 こんな人におすすめ */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  こんな方に<span className="text-blue-600">おすすめ</span>です
                </h2>
                <p className="text-lg text-gray-600">
                  baluboは、BtoB領域でコンテンツ制作に関わるすべての方を支援します
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* スタートアップの一人広報 */}
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">スタートアップの一人広報</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    限られたリソースで、コンテンツマーケティングの成果を最大化したい方
                  </p>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>時間をかけずに質の高いライターを見つけたい</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>予算は限られているが成果は出したい</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>事業成長に直結するコンテンツを作りたい</span>
                    </div>
                  </div>
                </div>

                {/* 自動車メーカーの広報担当者 */}
                <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 hover:shadow-2xl transition-all duration-300 shadow-xl">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">自動車メーカーの広報・マーケ担当者</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    業界の深い理解が必要な専門コンテンツを制作したい方
                  </p>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>業界知識のあるライターが見つからない</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>ゼロからの事業説明に疲れた</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>技術の価値を正しく伝えたい</span>
                    </div>
                  </div>
                </div>

                {/* メディア・制作会社・代理店 */}
                <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-blue-600 hover:shadow-2xl transition-all duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">メディア・制作会社・代理店</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    クライアントに最適なクリエイターを紹介したいプロフェッショナル
                  </p>
                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>特定業界に強いクリエイターを探している</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>データで専門性を証明したい</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>クライアント満足度を高めたい</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-lg text-gray-700 mb-6">
                  あなたのチームに最適な活用方法を、ご提案します
                </p>
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                  <a href="#waitlist">無料で試してみる</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 料金プラン */}
        <section id="pricing" className="bg-white py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                  <span className="text-sm font-medium text-blue-600">シンプルで分かりやすい料金体系</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                  あなたに最適なプランを<br className="sm:hidden" />お選びください
                </h2>
                <p className="text-lg text-gray-600">
                  まずはベータ版を無料でお試しいただけます
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {/* ベータ版プラン */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-semibold">ベータ版</span>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">無料</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-gray-900">¥0</span>
                      <span className="text-gray-600">/月</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      まずは無料で試してみたい方に
                    </p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">月5件までのプロジェクト登録</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">基本的なAIマッチング機能</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">クリエイター検索機能</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">メールサポート</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <a href="#waitlist">無料で始める</a>
                  </Button>
                </div>

                {/* スタンダードプラン */}
                <div className="relative bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 scale-105">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold">おすすめ</span>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">スタンダード</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-blue-600">¥4,980</span>
                      <span className="text-gray-600">/月</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      本格的に活用したい企業向け
                    </p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700"><span className="font-semibold">無制限</span>のプロジェクト登録</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">高度なAIマッチング機能</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">優先的なクリエイター紹介</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">プロジェクト管理機能</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">チャット・メールサポート</span>
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <a href="#waitlist">今すぐ始める</a>
                  </Button>
                </div>

                {/* エンタープライズプラン */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-semibold">Enterprise</span>
                  </div>
                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">エンタープライズ</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-extrabold text-gray-900">要相談</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                      大規模組織・カスタマイズ希望の方
                    </p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">スタンダードの全機能</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">専任カスタマーサクセス</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">カスタム機能開発</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">優先サポート（24時間対応）</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-gray-900 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">導入支援・トレーニング</span>
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                    <a href="mailto:sales@balubo.com">お問い合わせ</a>
                  </Button>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">
                  プラン選びでお悩みですか？お気軽にご相談ください
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild variant="outline" size="lg" className="rounded-xl border-2">
                    <a href="mailto:sales@balubo.com">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      相談する
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ セクション */}
        <section className="bg-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  よくあるご質問
                </h2>
                <p className="text-lg text-gray-600">お気軽にお問い合わせください</p>
              </div>
              <div className="space-y-6">
                {[
                  {
                    question: "baluboの利用料金はどのくらいですか？",
                    answer: "現在、料金プランを調整中です。ウェイトリスト登録いただいた方には、正式リリース前に先行案内と特別料金をご案内いたします。一般的なクラウドソーシングサービスよりも、コストパフォーマンスの高いプランをご用意する予定です。"
                  },
                  {
                    question: "どんな業界・業種に対応していますか？",
                    answer: "BtoB SaaS、IT、コンサルティング、金融、製造業、ヘルスケアなど、幅広い業界に対応しています。特にBtoB企業のコンテンツマーケティング、オウンドメディア運営、ホワイトペーパー制作などで高い実績があります。"
                  },
                  {
                    question: "マッチング後のサポートはありますか？",
                    answer: "はい、プロジェクト開始から完了まで、専任のカスタマーサクセスチームがサポートいたします。進捗管理、品質チェック、トラブル対応など、安心してご利用いただけます。"
                  },
                  {
                    question: "無料トライアルはありますか？",
                    answer: "ウェイトリスト登録いただいた企業様には、限定的な無料トライアル期間をご用意する予定です。実際にAIマッチングの精度と、クリエイターの品質を体験いただけます。"
                  },
                  {
                    question: "契約期間の縛りはありますか？",
                    answer: "プランによって異なりますが、基本的に長期契約の縛りはございません。プロジェクト単位でのご利用も可能です。柔軟なプランをご用意していますので、お気軽にご相談ください。"
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 hover:border-blue-600">
                    <button
                      className="w-full p-6 md:p-8 flex items-center justify-between text-left font-bold text-lg text-gray-900 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      aria-expanded={openFaqIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <span>{faq.question}</span>
                      <svg
                        className={`w-6 h-6 flex-shrink-0 text-blue-600 transition-transform duration-300 ${
                          openFaqIndex === index ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div
                      id={`faq-answer-${index}`}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openFaqIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 md:px-8 pb-6 md:pb-8">
                        <p className="text-gray-700 leading-relaxed bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <p className="text-gray-600 mb-4">その他のご質問がある場合は</p>
                <Button asChild variant="outline" size="lg" className="rounded-xl border-2">
                  <a href="mailto:info@balubo.com">お問い合わせはこちら</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 8. 最終CTA */}
        <section id="waitlist" className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white py-24 px-4 sm:py-32">
          <div className="container relative z-10 mx-auto max-w-5xl">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl leading-tight mb-8">
                クリエイター探しの課題は、
                <br />
                <span className="text-blue-600">今日で終わりにしませんか？</span>
              </h2>
              
              <div className="mx-auto max-w-3xl space-y-6 mb-12">
                <p className="text-xl md:text-2xl leading-relaxed text-gray-800 font-medium">
                  <span className="text-blue-600 font-bold">balubo</span>で、あなたの事業を深く理解したプロと出会う。
                </p>
                <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                  新しい出会い、新しいコンテンツ、新しい成果が、あなたを待っています。
                </p>
              </div>

              <div className="mx-auto max-w-3xl bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-2xl p-8 md:p-10 mb-12">
                <p className="text-3xl md:text-4xl text-gray-900 font-bold leading-tight mb-6">
                  今すぐウェイトリストに<br className="sm:hidden" /><span className="text-blue-600">無料で登録</span>
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-base text-gray-700 mb-8">
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ベータ版無料
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    1分で登録完了
                  </span>
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-1.5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    先行案内・限定特典
                  </span>
                </div>

                <Button 
                  asChild
                  size="lg"
                  className="w-full max-w-md rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-6 text-xl font-bold text-white transition-all duration-200 hover:shadow-2xl hover:scale-105 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
                >
                  <a 
                    href="https://docs.google.com/forms/d/e/1FAIpQLSc7UzTNUD-8Fs2BAoOuKNGlju5PX5qxneXmhvmN7pwGH6FtCg/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    無料で登録する
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-600">
                {[
                  { text: "クレジットカード不要", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> },
                  { text: "いつでもキャンセル可能", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> },
                  { text: "情報は安全に保護", icon: <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg> }
                ].map((feature) => (
                  <div key={feature.text} className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                      {feature.icon}
                    </div>
                    <span className="font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* 最終メッセージ */}
              <div className="mt-16 pt-8 border-t border-gray-200">
                <blockquote className="text-center">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    &quot;もう、クリエイター探しで時間を無駄にしない&quot;
                  </p>
                  <p className="text-xl md:text-2xl text-gray-700">
                    — 今日から、それを実現しませんか？
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>
        {isSurveyOpen && (
          <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSurveyOpen(false)} />
            <div
              ref={modalRef}
              className="relative w-full max-w-3xl mx-4 bg-white rounded-lg shadow-lg p-6 z-[2147483647] max-h-[85vh] overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-labelledby="survey-title"
              aria-describedby="survey-desc"
            >
              <button
                type="button"
                onClick={() => setIsSurveyOpen(false)}
                aria-label="閉じる"
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                ×
              </button>
              <h2 id="survey-title" className="text-lg font-semibold mb-4">任意アンケート（すべて任意）</h2>
              <p id="survey-desc" className="sr-only">baluboの任意アンケートです。すべて任意項目です。</p>
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="industry">業界</Label>
                    <Input id="industry" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="例：B2B SaaS" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">会社名（任意）</Label>
                    <Input id="companyName" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="例：バルボ株式会社" />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">職種</Label>
                    <Input id="jobRole" value={jobRole} onChange={(e) => setJobRole(e.target.value)} placeholder="例：コンテンツマーケ、広報、PR、編集 など" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">どれくらい支払えそうか（目安）</Label>
                    <div className="grid grid-cols-3 gap-3">
                      <Input id="budgetMin" type="number" inputMode="numeric" min="0" placeholder="最小" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} aria-invalid={budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax) ? true : undefined} aria-describedby={budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax) ? "budget-range-error" : undefined} />
                      <Input id="budgetMax" type="number" inputMode="numeric" min="0" placeholder="最大" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} aria-invalid={budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax) ? true : undefined} aria-describedby={budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax) ? "budget-range-error" : undefined} />
                      <select aria-label="期間" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={budgetPeriod} onChange={(e) => setBudgetPeriod(e.target.value as any)}>
                        <option value="per_project">案件ごと</option>
                        <option value="monthly">月額</option>
                        <option value="other">その他</option>
                      </select>
                    </div>
                    {budgetMin && budgetMax && Number(budgetMin) > Number(budgetMax) && (
                      <p id="budget-range-error" role="alert" className="text-xs text-red-600 mt-1">最小金額が最大金額を上回っています。数値を見直してください。</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">任意：数値レンジと期間を選べます（例：最小5万円〜最大20万円、案件ごと）。</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painPoints">抱えている課題や悩み</Label>
                  <Textarea id="painPoints" value={painPoints} onChange={(e) => setPainPoints(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectations">baluboに期待していること</Label>
                  <Textarea id="expectations" value={expectations} onChange={(e) => setExpectations(e.target.value)} />
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredBusinessModel">嬉しいビジネスモデル（任意記述）</Label>
                    <Input id="preferredBusinessModel" value={preferredBusinessModel} onChange={(e) => setPreferredBusinessModel(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessModelChoice">あなたはどれを選ぶか（選好）</Label>
                    <select id="businessModelChoice" className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={businessModelChoice} onChange={(e) => setBusinessModelChoice(e.target.value)}>
                      <option value="subscription">サブスク（月額）</option>
                      <option value="per_project">案件ごと（出来高/都度）</option>
                      <option value="success_fee">成功報酬</option>
                      <option value="ticket">チケット制</option>
                      <option value="retainer">リテイナー（月固定）</option>
                      <option value="other">その他</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredPeople">どんな人と会いたいか</Label>
                  <Textarea id="preferredPeople" value={preferredPeople} onChange={(e) => setPreferredPeople(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentIntent">どんなコンテンツを作りたいか</Label>
                  <Textarea id="contentIntent" value={contentIntent} onChange={(e) => setContentIntent(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeText">自由記入欄</Label>
                  <Textarea id="freeText" value={freeText} onChange={(e) => setFreeText(e.target.value)} />
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input type="checkbox" className="mt-1 h-4 w-4" checked={interviewOptIn} onChange={(e) => setInterviewOptIn(e.target.checked)} />
                  <span>任意: baluboのユーザーヒアリング（30分〜）に協力可能です。面談OKの方にはメールでご連絡させていただく場合があります（別手段のご希望があればご記載ください）。</span>
                </label>

                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="ghost" onClick={() => { setIsSurveyOpen(false); resetSurvey(); }}>スキップ</Button>
                  <Button
                    onClick={submitSurvey}
                    disabled={
                      isSubmitting || (Boolean(budgetMin) && Boolean(budgetMax) && Number(budgetMin) > Number(budgetMax))
                    }
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {isSubmitting ? "送信中..." : "回答を送信する"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <SharedFooter />
      <StickyCTA />
    </div>
  );
}


