"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface EnterpriseSurveyModalProps {
    isOpen: boolean;
    onClose: () => void;
    email?: string;
}

export function EnterpriseSurveyModal({ isOpen, onClose, email = "" }: EnterpriseSurveyModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const modalRef = useRef<HTMLDivElement | null>(null);

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
            onClose();
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
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
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
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[2147483647] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
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
                    onClick={onClose}
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
                        <Button variant="ghost" onClick={() => { onClose(); resetSurvey(); }}>スキップ</Button>
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
    );
}
