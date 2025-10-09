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
        <section className="bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 py-20 sm:py-24 md:py-28">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
                クリエイター探しに、もう<span className="text-[#0A66C2]">時間を溶かさない</span>。
              </h1>
              <p className="mt-6 text-lg text-gray-800 leading-8">
                AIが、あなたの事業を深く理解したプロを、わずか3分で発見します。BtoB企業のための専門性マッチングプラットフォーム「<span className="font-semibold">balubo</span>」、始動。
              </p>
              <div className="mt-8">
                <Button asChild className="rounded-lg bg-[#0A66C2] text-white font-semibold hover:bg-[#004182] focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2 shadow">
                  <a href="#waitlist">ウェイトリストに無料で登録する</a>
                </Button>
                <Button asChild variant="ghost" className="ml-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-[#0A66C2] focus-visible:ring-offset-2">
                  <a href="#why">導入の流れへ</a>
                </Button>
                <p className="mt-2 text-xs text-gray-500">先行案内・限定特典を受け取る</p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />

        {/* 2. 課題提起 */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">こんな「悪夢のフロー」に、心当たりはありませんか？</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">① 終わらない探索</p>
                <p className="mt-2 text-sm text-gray-600">SNSの海を彷徨い、貴重な時間が溶けていく。</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">② 絶望のミスマッチ</p>
                <p className="mt-2 text-sm text-gray-600">ゼロから事業説明。業界知識の齟齬で話が噛み合わない。</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">③ 終わらない修正地獄</p>
                <p className="mt-2 text-sm text-gray-600">赤字だらけの修正依頼。担当者が自ら手直し。</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">④ そして、心が折れる</p>
                <p className="mt-2 text-sm text-gray-600">「もう、外部の人にゼロから説明したくない…」</p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-white" heightClass="h-8" />

        {/* 3. 損失の明示 */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">その結果、失っているのは「時間」だけではありません。</h2>
            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="list-disc ml-5"><span className="font-semibold">機会損失の増大：</span>質の低いコンテンツで、本来獲得できたはずのリードや商談を逃している。</li>
              <li className="list-disc ml-5"><span className="font-semibold">ブランド毀損のリスク：</span>専門性の低いコンテンツは、企業の信頼性や権威性を損なう。</li>
              <li className="list-disc ml-5"><span className="font-semibold">担当者の疲弊と離職：</span>優秀なマーケターが、創造性のない作業に疲弊し、モチベーションを失っていく。</li>
            </ul>
          </div>
        </section>

        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />

        {/* 4. 解決策の提示 */}
        <section id="why" className="bg-gray-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">その「悪夢」を、baluboが終わらせます。</h2>
            <p className="mt-4 text-gray-700">
              baluboは、AIがクリエイターの「専門性」という目に見えない価値を可視化し、あなたの事業に最適なプロとの出会いを科学する、BtoB特化型のマッチングプラットフォームです。
            </p>
          </div>
        </section>

        <SectionDivider colorClass="text-white" heightClass="h-8" />

        {/* 5. 導入メリット */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">baluboがもたらす、3つの革命。</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">① 時間革命</p>
                <p className="mt-2 text-sm text-gray-700">クリエイター探索の数週間が最短3分に。戦略業務へ集中。</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">② ミスマッチ革命</p>
                <p className="mt-2 text-sm text-gray-700">ゼロからの事業説明は不要。業界理解度の高いプロと本質的議論。</p>
              </div>
              <div className="rounded-xl border border-gray-200 p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                <p className="font-semibold text-gray-900">③ 品質革命</p>
                <p className="mt-2 text-sm text-gray-700">成果につながる高品質なコンテンツで事業成長を後押し。</p>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />

        {/* 6. なぜ実現できるのか */}
        <section className="bg-gray-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">なぜ、baluboは「最高の出会い」を実現できるのか？</h2>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="list-disc ml-5"><span className="font-semibold">独自の「専門性解析AI」：</span>ポートフォリオを解析し、スキルや実績を客観的データとして可視化。</li>
              <li className="list-disc ml-5"><span className="font-semibold">業界プロの「信頼の紹介」：</span>ベテランクリエイターが信頼できる仲間を推薦。</li>
            </ul>
          </div>
        </section>

        <SectionDivider colorClass="text-white" heightClass="h-8" />

        {/* 7. 創業者メッセージ */}
        <section className="bg-white">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">私自身が、この課題の当事者でした。</h2>
            <p className="mt-4 text-gray-700">
              「企業の探す苦しみ」と「クリエイターの伝わらないもどかしさ」。双方の痛みを知る私だからこそ、この根深い課題を解決できると信じています。
            </p>
          </div>
        </section>

        <SectionDivider colorClass="text-gray-50" heightClass="h-8" />

        {/* 8. 最終CTA */}
        <section id="waitlist" className="bg-gray-50">
          <div className="container mx-auto px-4 py-16 md:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">次の「最高の出会い」を、誰よりも早く。</h2>
            <p className="mt-3 text-gray-700">もう、クリエイター探しで失敗しない。専門家と最速で出会えるbaluboの先行案内・限定特典を、今すぐ手に入れてください。</p>
            <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-6 max-w-3xl">
              <div className="flex gap-3">
                <Label htmlFor="waitlist-email" className="sr-only">メールアドレス</Label>
                <Input
                  type="email"
                  id="waitlist-email"
                  name="email"
                  placeholder="メールアドレス"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                  aria-label="メールアドレス"
                  autoComplete="email"
                  inputMode="email"
                  aria-describedby="waitlist-help waitlist-error waitlist-status"
                />
                <Button type="submit" disabled={isSubmitting} className="bg-[#0A66C2] text-white hover:bg-[#004182]">
                  {isSubmitting ? "送信中..." : "ウェイトリストに無料で登録する"}
                </Button>
              </div>
              <span id="waitlist-help" className="sr-only">メールアドレスを入力してください。</span>
              {message && (
                <div className="mt-3 flex items-center gap-3" aria-live="polite">
                  <p id="waitlist-status" role="status" className="text-sm text-green-600">{message}</p>
                  <Button type="button" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setIsSurveyOpen(true)}>
                    アンケートに回答する
                  </Button>
                </div>
              )}
              {error && (
                <p id="waitlist-error" role="alert" aria-live="assertive" className="mt-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* アンケートはモーダルで表示するため、ここからは削除 */}
            </form>
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


