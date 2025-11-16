"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Footer as SharedFooter } from "@/components/layout/Footer";
import StickyCTA from "@/components/landing/StickyCTA";
import SectionDivider from "@/components/landing/SectionDivider";

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
        <section className="relative bg-[#F4F7FF] pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
          <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="grid w-full grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2 lg:gap-24 xl:gap-32">
                {/* Left Content */}
                <div className="space-y-8 md:space-y-12 text-center lg:text-left">
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                    <span className="block leading-[1.05]">
                      クリエイターは、<br />
                      <span className="text-blue-600">「専門性」で選ぶ時代へ。</span>
                    </span>
                  </h1>

                  <div className="mx-auto max-w-2xl space-y-6 lg:mx-0">
                    <p className="text-2xl md:text-3xl text-gray-900 leading-relaxed font-bold">
                      汎用的なコンテンツは、AIがつくれるようになりました。
                    </p>
                    <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                      だからこそ、BtoB企業が本当に求めているのは「誰でも書ける70点」ではなく、
                      業界の文脈を深く理解した<span className="font-semibold">「120点のプロクリエイター」</span>です。
                    </p>
                    <p className="text-base text-gray-700 leading-relaxed">
                      <span className="text-blue-600 font-semibold">balubo</span>は、AIがクリエイターの「専門性」を可視化し、
                      これまで感覚でしか伝えられなかった強みをデータとして提示します。
                      BtoB企業は、自社と親和性の高いプロと出会い、
                      クリエイターは自分の専門性に自信を持って選ばれる——そんな出会いをつくる専門性マッチングプラットフォームです。
                    </p>
                  </div>

                  {/* 社会的証明バッジ */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full border border-blue-100 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 shadow-md shadow-blue-500/40">
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
                        className="w-full rounded-full bg-blue-600 px-10 py-4 text-base font-semibold text-white transition-colors duration-200 hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 sm:w-auto"
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
                        className="w-full rounded-full border border-gray-200 bg-white px-10 py-4 text-base font-semibold text-gray-800 transition-colors duration-200 hover:bg-gray-50 sm:w-auto"
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

                {/* Right Visual：BtoB企業 ⇄ balubo ⇄ プロクリエイター */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-2xl">
                    <div className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-blue-500/10 via-blue-200/40 to-indigo-300/30 blur-3xl" />
                    <div className="relative rounded-[40px] border border-blue-50/90 bg-white/95 px-6 py-7 shadow-[0_26px_70px_rgba(15,23,42,0.16)]">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-stretch">
                        {/* BtoB企業 */}
                        <div className="flex flex-col items-center rounded-2xl bg-[#F4F7FF] px-6 py-6 text-center">
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/50">
                            <svg
                              className="h-9 w-9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4H11v17H4Z" />
                              <path d="M13 21V8.5A1.5 1.5 0 0 1 14.5 7H19a1 1 0 0 1 1 1v13h-7Z" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 md:text-base">
                            BtoB企業
                          </p>
                        </div>

                        {/* balubo */}
                        <div className="flex flex-col items-center rounded-2xl bg-blue-600 px-6 py-6 text-center text-white shadow-md shadow-blue-500/50">
                          <span className="mb-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-wide md:text-sm">
                            balubo
                          </span>
                          <p className="text-sm font-semibold md:text-base">
                            専門性で
                            <br />
                            マッチング
                          </p>
                          <span className="mt-2 text-lg md:text-xl">⇄</span>
                        </div>

                        {/* プロクリエイター */}
                        <div className="flex flex-col items-center rounded-2xl bg-[#F4F7FF] px-6 py-6 text-center">
                          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/50">
                            <svg
                              className="h-9 w-9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.8}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="8" r="3" />
                              <circle cx="6" cy="11" r="2.2" />
                              <circle cx="18" cy="11" r="2.2" />
                              <path d="M4 19a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 md:text-base">
                            プロクリエイター
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-white" heightClass="h-10" flip />

        {/* こんなお悩みはありませんか？（担当者のモヤモヤ） */}
        <section className="bg-[#F4F7FF] py-20 px-4 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
                こんなお悩みはありませんか？
              </h2>
              <p className="mt-4 text-base text-gray-600 md:text-lg">
                BtoBのコンテンツづくりで、「なんとなくうまくいかない」「伝わりきっていない」と感じることはありませんか？
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* 悩み1 */}
              <div className="flex flex-col items-center rounded-[32px] border border-blue-100 bg-[#F4F7FF] p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/40">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 4h14v2H5zM7 9h10v2H7zM9 14h6v2H9z" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-bold text-gray-900 md:text-xl">
                  いい記事なのに読まれない
                </p>
                <p className="text-sm text-gray-600">
                  社内では好評なのに、外に出すと反応が薄い。コンテンツが「誰のどんな課題」に刺さっているのか、手応えが持てない。
                </p>
              </div>

              {/* 悩み2 */}
              <div className="flex flex-col items-center rounded-[32px] border border-blue-100 bg-[#F4F7FF] p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/40">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a5 5 0 0 1 5 5v1h1a2 2 0 0 1 0 4h-1v1a5 5 0 0 1-10 0v-1H6a2 2 0 0 1 0-4h1V7a5 5 0 0 1 5-5Z" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-bold text-gray-900 md:text-xl">
                  業界が分かるライターが見つからない
                </p>
                <p className="text-sm text-gray-600">
                  用語や商習慣の説明から毎回スタート。業界の前提から共有しなければならず、コンテンツ制作のたびに負担が大きい。
                </p>
              </div>

              {/* 悩み3 */}
              <div className="flex flex-col items-center rounded-[32px] border border-blue-100 bg-[#F4F7FF] p-8 text-center shadow-[0_18px_45px_rgba(15,23,42,0.04)]">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/40">
                  <svg
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 10h10M7 14h6" />
                    <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-bold text-gray-900 md:text-xl">
                  成果にどうつながったか説明しづらい
                </p>
                <p className="text-sm text-gray-600">
                  「このコンテンツがビジネスにどう効いたのか」を、社内や経営層にうまく説明できず、投資判断が難しい。
                </p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-blue-50" heightClass="h-10" />

        {/* 6. なぜ実現できるのか（お悩みへの解決策） */}
        <section className="bg-[#F4F7FF] py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  なぜ、baluboなら<br className="sm:hidden" /><span className="text-blue-600">この悩みを解決できる</span>のか？
                </h2>
                <p className="text-lg text-gray-600 mt-4">
                  「いいコンテンツなのに伝わりきらない」「業界が分かるライターが見つからない」
                  「成果を説明しづらい」。こうした悩みに、2つのコア技術で応えます。
                </p>
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
                    ポートフォリオ、執筆記事、クライアント評価などをAIが多角的に解析し、
                    「業界・想定顧客・課題・成果」といった観点で構造化。良いコンテンツの「どこが効いているのか」を
                    データとして可視化することで、社内への説明や振り返りがしやすくなります。
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">業界特化度・専門性の定量評価（どの領域に強いかが一目で分かる）</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">コンテンツの「狙い」と「成果」の紐づけ</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="text-gray-700">プロジェクト成功率の予測・振り返りに使えるレポート出力</span>
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
                    BtoB領域で実績のあるプロクリエイターが、自身のネットワークから信頼できる仲間を推薦。
                    「業界の文脈が分かるか」「技術や商習慣への理解があるか」といった、AIだけでは判断しづらい部分を
                    人の目で補完することで、「最初から話が早い」パートナー候補に出会えます。
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">実績あるプロによる推薦（業界やテーマごとの得意領域が明確）</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">「この人に任せれば大丈夫」という安心感のある出会い</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 rounded-full bg-gray-900"></div>
                      <span className="text-gray-700">AI＋人の目で、専門性と相性の両方を担保</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-blue-100" heightClass="h-10" flip />

        {/* 6.5 こんな人におすすめ */}
        <section className="bg-[#F4F7FF] py-20 md:py-32">
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

        <SectionDivider colorClass="text-blue-100" heightClass="h-10" />

        {/* 7. 料金プラン */}
        <section id="pricing" className="bg-[#F4F7FF] py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-4">
                  <span className="text-sm font-medium text-blue-600">
                    クリエイターはずっと無料
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                  企業の方には、柔軟な料金プランをご用意
                </h2>
                <p className="text-lg text-gray-600">
                  成果報酬型・SaaSモデル・ディレクションプランなど、
                  貴社の体制や案件にあわせてお選びいただけます。
                </p>
              </div>

              <div className="grid gap-8 max-w-6xl mx-auto md:grid-cols-2 xl:grid-cols-4">
                {/* フリープラン */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      フリープラン
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      まずはお試しに
                    </p>
                    <div className="mb-4">
                      <span className="text-3xl font-extrabold text-gray-900">
                        ¥0
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      検索や情報収集から気軽に始めたい方向けの無料プランです。
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      検索機能・プロフィール匿名閲覧
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      応募管理・マッチング度の確認
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      初期費用0円でいつでもアップグレード可能
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <a href="#waitlist">無料で始める</a>
                  </Button>
                </div>

                {/* スポット利用（成果報酬型） */}
                <div className="relative bg-white rounded-2xl border-2 border-blue-600 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 scale-105">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      スポット利用
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-blue-600 mb-1">
                      成果報酬型
                    </p>
                    <div className="mb-2">
                      <span className="text-3xl font-extrabold text-blue-600">
                        10–15%
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      1案件ごとに利用できる、成果報酬型のスポットプランです。
                      初期費用はかかりません。
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      スカウト送信・応募管理
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      マッチング度を踏まえた候補者比較
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      初期費用0円で気軽に導入可能
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <a href="#waitlist">このモデルで相談する</a>
                  </Button>
                </div>

                {/* プレミアム（SaaSモデル） */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-50 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                      プレミアム
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      SaaSモデル（月額制）
                    </p>
                    <div className="mb-2">
                      <span className="text-3xl font-extrabold text-gray-900">
                        月額制
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      継続的に採用・発注を行う企業向け。
                      固定料金で高機能をお使いいただけます。
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      無制限スカウト・優先表示
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      チーミング対応（複数担当者で運用）
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      専用サポート付き
                    </li>
                  </ul>
                  <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSduddB7969fstVTNmprN0xuSeNY5HLz3wkdWkvV8i2tkTQWcQ/viewform?usp=publish-editor">
                      料金プランを相談する
                    </a>
                  </Button>
                </div>

                {/* ディレクションプラン */}
                <div className="relative bg-white rounded-2xl border-2 border-gray-200 p-8 hover:shadow-2xl transition-all duration-300">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      ディレクション
                    </span>
                  </div>
                  <div className="text-center mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">
                      お見積もり
                    </p>
                    <div className="mb-2">
                      <span className="text-3xl font-extrabold text-gray-900">
                        要お見積もり
                      </span>
                    </div>
                    <p className="text-gray-600 mb-6 text-sm">
                      与件整理からクリエイター選定、ディレクションまで
                      丸ごと任せたい企業向けのプランです。
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      専任担当者による与件整理・戦略設計
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      求人広告・募集要項の作成〜掲載まで「丸投げ」OK
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-4 w-4 flex-shrink-0 rounded-full bg-blue-600" />
                      進行管理・品質管理まで含めたディレクション
                    </li>
                  </ul>
                  <Button asChild variant="outline" className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-50">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLSduddB7969fstVTNmprN0xuSeNY5HLz3wkdWkvV8i2tkTQWcQ/viewform?usp=publish-editor">
                      個別に相談する
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-blue-200" heightClass="h-10" flip />

        {/* FAQ セクション */}
        <section className="bg-[#F4F7FF] py-20 md:py-28" id="faq">
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
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSduddB7969fstVTNmprN0xuSeNY5HLz3wkdWkvV8i2tkTQWcQ/viewform?usp=publish-editor">
                    お問い合わせはこちら
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-blue-50" heightClass="h-10" flip />

        {/* 8. 最終CTA */}
        <section id="waitlist" className="relative overflow-hidden bg-[#F4F7FF] py-24 px-4 sm:py-32">
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

              <div className="mx-auto max-w-3xl bg-white border-2 border-blue-200 rounded-[32px] p-8 md:p-10 mb-12 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
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
                  className="w-full max-w-md rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-12 py-6 text-xl font-bold text-white transition-all duration-200 hover:shadow-2xl hover:scale-105 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30"
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


