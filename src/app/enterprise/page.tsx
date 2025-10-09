"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import SectionDivider from "@/components/landing/SectionDivider";
import StickyCTA from "@/components/landing/StickyCTA";

export default function EnterpriseLandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  const [registeredEmail, setRegisteredEmail] = useState<string>("");
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
          email: registeredEmail || email,
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
      setMessage("ご協力ありがとうございました！");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailTrimmed)) {
      setError("有効なメールアドレスを入力してください");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailTrimmed, source: "enterprise" }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "登録に失敗しました");
      }
      setMessage("ウェイトリストに登録しました。任意のアンケートにご協力いただけますか？");
      setRegisteredEmail(emailTrimmed);
      setEmail("");
      // 低確率の再描画タイミング問題に備え、わずかに遅延してモーダルを開く
      setTimeout(() => setIsSurveyOpen(true), 50);
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <Button asChild variant="ghost" className="text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2">
              <Link href="/login">ログイン</Link>
            </Button>
            <Button asChild className="rounded-lg bg-[#0A66C2] text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#004182] focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 shadow-sm">
              <Link href="/register">無料で「AI分析レポート」を見てみる</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        {/* 1. ファーストビュー */}
        <section className="relative bg-gradient-to-br from-white via-blue-50/30 to-gray-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" style={{backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, rgb(241 245 249 / 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgb(241 245 249 / 0.3) 1px, transparent 1px)'}}></div>
          <div className="container mx-auto px-4 py-20 sm:py-28 md:py-36">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0A66C2] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0A66C2]"></span>
                  </span>
                  <span className="text-sm font-medium text-[#0A66C2]">先行登録受付中</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
                  クリエイター探しに、<br />もう<span className="text-[#0A66C2] relative">時間を溶かさない<span className="absolute bottom-0 left-0 w-full h-3 bg-[#0A66C2]/10 -z-10"></span></span>。
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
                  AIが、あなたの事業を深く理解したプロを、<span className="font-bold text-[#0A66C2]">わずか3分</span>で発見します。BtoB企業のための専門性マッチングプラットフォーム「<span className="font-semibold text-gray-900">balubo</span>」、始動。
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button asChild size="lg" className="rounded-xl bg-[#0A66C2] text-white font-bold hover:bg-[#004182] focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-6 text-base">
                    <a href="#waitlist">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      ウェイトリストに無料で登録する
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="rounded-xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 font-semibold px-8 py-6 text-base transition-all duration-200">
                    <a href="#why">
                      導入の流れを見る
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </a>
                  </Button>
                </div>
                <p className="mt-4 text-sm text-gray-500 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  先行案内・限定特典を受け取る　クレジットカード不要
                </p>
              </div>
              <div className="hidden lg:block relative">
                <div className="relative w-full aspect-square max-w-lg mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0A66C2]/20 to-blue-100/40 rounded-3xl blur-3xl"></div>
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl border border-blue-100">
                        <div className="w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-xl">AI</div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded-full w-3/4 mb-2"></div>
                          <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-3xl font-bold text-[#0A66C2]">3分</div>
                          <div className="text-xs text-gray-600 mt-1">マッチング時間</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="text-3xl font-bold text-[#0A66C2]">95%</div>
                          <div className="text-xs text-gray-600 mt-1">満足度</div>
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
                            <div className="text-green-500">
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
        </section>

        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />

        {/* 統計セクション */}
        <section className="bg-white border-y border-gray-200">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-2">3分</div>
                <div className="text-sm text-gray-600">平均マッチング時間</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-2">95%</div>
                <div className="text-sm text-gray-600">クライアント満足度</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-2">1000+</div>
                <div className="text-sm text-gray-600">登録クリエイター</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[#0A66C2] mb-2">-70%</div>
                <div className="text-sm text-gray-600">採用工数削減</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 課題提起 */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                こんな<span className="text-red-600">「悪夢のフロー」</span>に、<br className="hidden sm:block" />心当たりはありませんか？
              </h2>
              <p className="text-lg text-gray-600 mt-4">多くのBtoB企業が抱える、クリエイター採用の4つの壁</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-red-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">1</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-600 group-hover:bg-red-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">終わらない探索</h3>
                <p className="text-gray-600 leading-relaxed">SNSの海を彷徨い、貴重な時間が溶けていく。気づけば1週間、2週間...</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-red-600 font-semibold">⏱️ 平均2週間の工数</p>
                </div>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-orange-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">2</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 text-orange-600 group-hover:bg-orange-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">絶望のミスマッチ</h3>
                <p className="text-gray-600 leading-relaxed">ゼロから事業説明。業界知識の齟齬で話が噛み合わない。</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-orange-600 font-semibold">💔 ミスマッチ率60%</p>
                </div>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-yellow-300">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">3</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">終わらない修正地獄</h3>
                <p className="text-gray-600 leading-relaxed">赤字だらけの修正依頼。担当者が自ら手直しする日々。</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-yellow-600 font-semibold">🔄 平均5回の修正依頼</p>
                </div>
              </div>
              <div className="group relative rounded-2xl border-2 border-gray-200 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-gray-400">
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">4</div>
                <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-600 group-hover:bg-gray-200 transition-colors">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">そして、心が折れる</h3>
                <p className="text-gray-600 leading-relaxed">「もう、外部の人にゼロから説明したくない...」</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-600 font-semibold">😰 担当者の疲弊</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 損失の明示 */}
        <section className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  その結果、失っているのは<br className="sm:hidden" />「時間」だけではありません。
                </h2>
                <p className="text-lg text-gray-600 mt-4">見えないコストが、あなたのビジネスを蝕んでいます</p>
              </div>
              <div className="grid gap-6 md:gap-8">
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-red-500 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">機会損失の増大</h3>
                      <p className="text-gray-700 leading-relaxed mb-3">質の低いコンテンツで、本来獲得できたはずのリードや商談を逃している。SEO順位の低下、CVRの低下、そして売上の停滞。</p>
                      <div className="flex items-center gap-2 text-sm text-red-600 font-semibold">
                        <span>💸</span>
                        <span>年間数百万円〜数千万円の売上機会損失</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-orange-500 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">ブランド毀損のリスク</h3>
                      <p className="text-gray-700 leading-relaxed mb-3">専門性の低いコンテンツは、企業の信頼性や権威性を損なう。一度失った信頼を取り戻すには、膨大な時間とコストが必要。</p>
                      <div className="flex items-center gap-2 text-sm text-orange-600 font-semibold">
                        <span>⚠️</span>
                        <span>ブランド価値の長期的な低下</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl p-8 shadow-lg border-l-4 border-yellow-500 hover:shadow-2xl transition-all duration-300 hover:-translate-x-2">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-2">担当者の疲弊と離職</h3>
                      <p className="text-gray-700 leading-relaxed mb-3">優秀なマーケターが、創造性のない作業に疲弊し、モチベーションを失っていく。採用・育成コストの無駄遣い。</p>
                      <div className="flex items-center gap-2 text-sm text-yellow-600 font-semibold">
                        <span>😰</span>
                        <span>離職率の上昇と組織の弱体化</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-12 p-8 bg-white rounded-2xl shadow-xl border-2 border-gray-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 mb-2">合計すると...</p>
                  <p className="text-5xl font-extrabold text-red-600 mb-4">年間1,000万円以上</p>
                  <p className="text-gray-600">の見えないコストを失っている可能性があります</p>
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
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#0A66C2] to-blue-600 mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
                その<span className="text-[#0A66C2]">「悪夢」</span>を、<br className="sm:hidden" />baluboが終わらせます。
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                baluboは、AIがクリエイターの「専門性」という目に見えない価値を可視化し、あなたの事業に最適なプロとの出会いを<span className="font-bold text-[#0A66C2]">科学する</span>、BtoB特化型のマッチングプラットフォームです。
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A66C2] to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A66C2] to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">3分マッチング</h3>
                  <p className="text-gray-600 leading-relaxed">
                    プロジェクトの要件を入力するだけ。AIが最適なクリエイターを瞬時に提案。数週間の探索が3分に。
                  </p>
                </div>
              </div>
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A66C2] to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                <div className="relative bg-white rounded-2xl p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-[#0A66C2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                baluboがもたらす、<br className="sm:hidden" /><span className="text-[#0A66C2]">3つの革命</span>
              </h2>
              <p className="text-lg text-gray-600">クリエイター採用のすべてが変わります</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-green-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">1</div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-green-600">-70%</div>
                      <div className="text-sm text-gray-600">工数削減</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">⚡ 時間革命</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    クリエイター探索の<span className="font-bold text-green-600">数週間が最短3分</span>に。膨大な時間を戦略業務へシフトできます。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>SNS探索の無限ループから解放</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>面談調整・選考プロセスの効率化</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>本来の戦略業務に集中可能</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">2</div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-blue-600">95%</div>
                      <div className="text-sm text-gray-600">満足度</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🎯 ミスマッチ革命</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <span className="font-bold text-blue-600">ゼロからの事業説明は不要</span>。業界理解度の高いプロと、初日から本質的な議論が可能に。
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
                <div className="absolute -inset-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl p-8 md:p-10 shadow-xl border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">3</div>
                    <div className="text-right">
                      <div className="text-3xl font-extrabold text-purple-600">3x</div>
                      <div className="text-sm text-gray-600">成果向上</div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">🚀 品質革命</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    <span className="font-bold text-purple-600">成果につながる高品質なコンテンツ</span>で、事業成長を加速。ROI最大化を実現します。
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>専門性の高いコンテンツ制作</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>修正回数の大幅削減</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
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
                  なぜ、baluboは<br className="sm:hidden" /><span className="text-[#0A66C2]">「最高の出会い」</span>を<br className="sm:hidden" />実現できるのか？
                </h2>
                <p className="text-lg text-gray-600 mt-4">2つの革新的テクノロジーの融合</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="group relative bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 md:p-10 border-2 border-blue-100 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-[#0A66C2] flex items-center justify-center text-white font-bold text-xl">1</div>
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A66C2] to-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
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
                      <div className="w-2 h-2 rounded-full bg-[#0A66C2]"></div>
                      <span className="text-gray-700">業界特化度・専門性の定量評価</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#0A66C2]"></div>
                      <span className="text-gray-700">コミュニケーション適性の分析</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-[#0A66C2]"></div>
                      <span className="text-gray-700">プロジェクト成功率の予測</span>
                    </div>
                  </div>
                </div>
                <div className="group relative bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 md:p-10 border-2 border-purple-100 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">2</div>
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
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
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700">実績あるプロによる推薦</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700">信頼関係の連鎖的構築</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700">品質保証の仕組み</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. 創業者メッセージ */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0A66C2] to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    F
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-900">創業者より</p>
                    <p className="text-sm text-gray-600">Founder&apos;s Message</p>
                  </div>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                  私自身が、<br className="sm:hidden" />この課題の<span className="text-[#0A66C2]">当事者</span>でした。
                </h2>
                <div className="space-y-6 text-gray-700 leading-relaxed text-lg">
                  <p>
                    「企業の探す苦しみ」と「クリエイターの伝わらないもどかしさ」。
                  </p>
                  <p>
                    SNSで何時間も彷徨い、ようやく見つけたクリエイターとの打ち合わせで「え、そういうことじゃないんだけど...」と心の中で思った経験。誰もが一度は経験したことがあるはずです。
                  </p>
                  <p>
                    一方、クリエイター側も「自分の本当の強みや経験が、企業に正しく伝わらない」というもどかしさを抱えています。
                  </p>
                  <p className="font-semibold text-gray-900">
                    双方の痛みを知る私だからこそ、この根深い課題を解決できると信じています。
                  </p>
                  <p>
                    baluboは、AIの力で「専門性」という目に見えない価値を可視化し、企業とクリエイターの真の相互理解を実現します。もう、時間を無駄にする必要はありません。
                  </p>
                </div>
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <p className="font-bold text-gray-900">Fumiya Kimiwada</p>
                      <p className="text-sm text-gray-600">balubo 創業者 / CEO</p>
                    </div>
                    <Button asChild className="bg-[#0A66C2] text-white hover:bg-[#004182] shadow-lg">
                      <a href="#waitlist">ウェイトリストに登録する</a>
                    </Button>
                  </div>
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
                <details className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <summary className="cursor-pointer p-6 md:p-8 flex items-center justify-between font-bold text-lg text-gray-900 hover:text-[#0A66C2] transition-colors">
                    <span>baluboの利用料金はどのくらいですか？</span>
                    <svg className="w-6 h-6 flex-shrink-0 text-[#0A66C2] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-700 leading-relaxed">
                    現在、料金プランを調整中です。ウェイトリスト登録いただいた方には、正式リリース前に先行案内と特別料金をご案内いたします。一般的なクラウドソーシングサービスよりも、コストパフォーマンスの高いプランをご用意する予定です。
                  </div>
                </details>
                <details className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <summary className="cursor-pointer p-6 md:p-8 flex items-center justify-between font-bold text-lg text-gray-900 hover:text-[#0A66C2] transition-colors">
                    <span>どんな業界・業種に対応していますか？</span>
                    <svg className="w-6 h-6 flex-shrink-0 text-[#0A66C2] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-700 leading-relaxed">
                    BtoB SaaS、IT、コンサルティング、金融、製造業、ヘルスケアなど、幅広い業界に対応しています。特にBtoB企業のコンテンツマーケティング、オウンドメディア運営、ホワイトペーパー制作などで高い実績があります。
                  </div>
                </details>
                <details className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <summary className="cursor-pointer p-6 md:p-8 flex items-center justify-between font-bold text-lg text-gray-900 hover:text-[#0A66C2] transition-colors">
                    <span>マッチング後のサポートはありますか？</span>
                    <svg className="w-6 h-6 flex-shrink-0 text-[#0A66C2] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-700 leading-relaxed">
                    はい、プロジェクト開始から完了まで、専任のカスタマーサクセスチームがサポートいたします。進捗管理、品質チェック、トラブル対応など、安心してご利用いただけます。
                  </div>
                </details>
                <details className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <summary className="cursor-pointer p-6 md:p-8 flex items-center justify-between font-bold text-lg text-gray-900 hover:text-[#0A66C2] transition-colors">
                    <span>無料トライアルはありますか？</span>
                    <svg className="w-6 h-6 flex-shrink-0 text-[#0A66C2] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-700 leading-relaxed">
                    ウェイトリスト登録いただいた企業様には、限定的な無料トライアル期間をご用意する予定です。実際にAIマッチングの精度と、クリエイターの品質を体験いただけます。
                  </div>
                </details>
                <details className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <summary className="cursor-pointer p-6 md:p-8 flex items-center justify-between font-bold text-lg text-gray-900 hover:text-[#0A66C2] transition-colors">
                    <span>契約期間の縛りはありますか？</span>
                    <svg className="w-6 h-6 flex-shrink-0 text-[#0A66C2] transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 md:px-8 pb-6 md:pb-8 text-gray-700 leading-relaxed">
                    プランによって異なりますが、基本的に長期契約の縛りはございません。プロジェクト単位でのご利用も可能です。柔軟なプランをご用意していますので、お気軽にご相談ください。
                  </div>
                </details>
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
        <section id="waitlist" className="relative bg-gradient-to-br from-[#0A66C2] via-blue-600 to-blue-700 py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" style={{backgroundSize: '30px 30px', backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)'}}></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                <span className="text-sm font-medium text-white">先行登録受付中 - 限定特典あり</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
                次の<span className="relative"><span className="relative z-10">「最高の出会い」</span><span className="absolute bottom-0 left-0 w-full h-4 bg-white/20 -z-0"></span></span>を、<br className="hidden sm:block" />誰よりも早く。
              </h2>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed">
                もう、クリエイター探しで失敗しない。<br className="hidden sm:block" />専門家と最速で出会えるbaluboの<br className="sm:hidden" />先行案内・限定特典を、<br className="hidden sm:block" />今すぐ手に入れてください。
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">ウェイトリスト登録で得られる特典</h3>
                <div className="grid sm:grid-cols-3 gap-6 mb-10">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">初月50%OFF</p>
                    <p className="text-sm text-blue-100 mt-1">特別料金でお試し</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">優先マッチング</p>
                    <p className="text-sm text-blue-100 mt-1">トップ層を優先紹介</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-white font-semibold">専任サポート</p>
                    <p className="text-sm text-blue-100 mt-1">導入まで徹底支援</p>
                  </div>
                </div>
            <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <Label htmlFor="waitlist-email" className="sr-only">メールアドレス</Label>
                <Input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 h-14 px-6 text-lg bg-white/90 backdrop-blur-sm border-white/20 text-gray-900 placeholder:text-gray-500 focus:bg-white"
                  aria-label="メールアドレス"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="waitlist-help waitlist-error waitlist-status"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  size="lg"
                  className="h-14 px-8 bg-white text-[#0A66C2] hover:bg-gray-100 font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 whitespace-nowrap"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      送信中...
                    </>
                  ) : (
                    <>
                      無料で登録する
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
              <span id="waitlist-help" className="sr-only">メールアドレスを入力してください。</span>
              {message && (
                <div className="mt-4 p-4 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30" aria-live="polite">
                  <p id="waitlist-status" role="status" className="text-white font-semibold mb-2">✓ {message}</p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="text-white hover:bg-white/20 border border-white/30" 
                    onClick={() => setIsSurveyOpen(true)}
                  >
                    アンケートに回答する →
                  </Button>
                </div>
              )}
              {error && (
                <p id="waitlist-error" role="alert" aria-live="assertive" className="mt-4 p-4 bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-400/30 text-white">
                  ⚠️ {error}
                </p>
              )}
              <p className="mt-4 text-sm text-blue-100 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                あなたの情報は安全に保護されます
              </p>

              {/* アンケートはモーダルで表示するため、ここからは削除 */}
            </form>
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
                className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2"
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
                    className="bg-[#0A66C2] text-white hover:bg-[#004182]"
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


