import React, { useMemo } from "react";
import { Work, InputData } from "../types";

interface CareerOutlookProps {
    works: Work[];
    inputs?: InputData[];
}

export const CareerOutlook: React.FC<CareerOutlookProps> = ({ works, inputs }) => {
    const outlooks = useMemo(() => {
        const items = [];

        // 役割とタグの集計
        const allTags = works.flatMap((w) => w.tags || []);

        // インプットタグ
        const inputTags = inputs?.flatMap(i => i.tags) || [];
        const combinedTags = [...new Set([...allTags, ...inputTags])];

        // 専門領域の特定
        const hasMedical = combinedTags.some(t => ["Medical", "Healthcare", "医療", "ヘルスケア", "製薬", "病院"].includes(t));
        const hasFinance = combinedTags.some(t => ["Finance", "Fintech", "金融", "投資", "証券", "銀行", "経済"].includes(t));
        const hasLegal = combinedTags.some(t => ["Law", "Legal", "法律", "規制", "弁護士", "法務"].includes(t));
        const hasTech = combinedTags.some(t => ["Tech", "Technology", "AI", "SaaS", "IT", "エンジニアリング", "プログラミング"].includes(t));
        const hasMarketing = combinedTags.some(t => ["Marketing", "マーケティング", "SEO", "広告", "PR"].includes(t));
        const hasBusiness = combinedTags.some(t => ["Business", "ビジネス", "経営", "スタートアップ", "BtoB"].includes(t));

        // 医療業界の展望
        if (hasMedical) {
            items.push({
                title: "医療コンテンツの事業化",
                description: "医療知識を活かしたオンライン講座やコンサルティング事業の立ち上げ",
                icon: "📋",
                color: "from-emerald-50 to-teal-50 border-emerald-100"
            });
            items.push({
                title: "専門性を活かした横展開",
                description: "医療で培った深い理解力を活かして、金融や法律など他の専門領域でも活躍",
                icon: "↗",
                color: "from-blue-50 to-indigo-50 border-blue-100"
            });
            items.push({
                title: "医療メディアの編集長",
                description: "医療系メディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
        }
        // 金融業界の展望
        else if (hasFinance) {
            items.push({
                title: "Fintech領域への進出",
                description: "金融知識を活かして、Fintechスタートアップのコンテンツ戦略を担当",
                icon: "↗",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
            items.push({
                title: "投資教育コンテンツの制作",
                description: "金融リテラシー向上のための教育コンテンツやセミナー事業",
                icon: "📊",
                color: "from-amber-50 to-orange-50 border-amber-100"
            });
            items.push({
                title: "金融メディアの編集長",
                description: "経済・金融メディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-blue-50 to-cyan-50 border-blue-100"
            });
        }
        // 法律業界の展望
        else if (hasLegal) {
            items.push({
                title: "リーガルテック領域への進出",
                description: "法律知識を活かして、リーガルテック企業のコンテンツ戦略を担当",
                icon: "↗",
                color: "from-indigo-50 to-purple-50 border-indigo-100"
            });
            items.push({
                title: "法律教育コンテンツの制作",
                description: "一般向けの法律教育コンテンツやセミナー事業の立ち上げ",
                icon: "📋",
                color: "from-blue-50 to-indigo-50 border-blue-100"
            });
            items.push({
                title: "法律メディアの編集長",
                description: "法律・法務メディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
        }
        // IT/Tech業界の展望
        else if (hasTech) {
            items.push({
                title: "テクニカルライターへの転身",
                description: "技術ドキュメントやAPI仕様書など、エンジニア向けコンテンツの専門家に",
                icon: "</>",
                color: "from-cyan-50 to-blue-50 border-cyan-100"
            });
            items.push({
                title: "テックメディアの編集長",
                description: "IT・テック系メディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
            items.push({
                title: "SaaS企業のコンテンツ責任者",
                description: "SaaS企業でコンテンツマーケティング全体を統括",
                icon: "↗",
                color: "from-blue-50 to-indigo-50 border-blue-100"
            });
        }
        // マーケティング業界の展望
        else if (hasMarketing) {
            items.push({
                title: "コンテンツマーケティング責任者",
                description: "ライティングスキルを活かして、企業のコンテンツ戦略全体を統括",
                icon: "📊",
                color: "from-rose-50 to-pink-50 border-rose-100"
            });
            items.push({
                title: "マーケティングメディアの編集長",
                description: "マーケティング系メディアの編集長として、業界をリード",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
            items.push({
                title: "コンテンツ制作会社の立ち上げ",
                description: "自身のスキルを活かして、コンテンツ制作会社を起業",
                icon: "★",
                color: "from-amber-50 to-orange-50 border-amber-100"
            });
        }
        // ビジネス業界の展望
        else if (hasBusiness) {
            items.push({
                title: "ビジネスメディアの編集長",
                description: "ビジネス系メディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
            items.push({
                title: "スタートアップのPR責任者",
                description: "スタートアップのPR・広報責任者として、ブランド構築をリード",
                icon: "↗",
                color: "from-blue-50 to-indigo-50 border-blue-100"
            });
            items.push({
                title: "コンテンツ制作会社の立ち上げ",
                description: "自身のスキルを活かして、コンテンツ制作会社を起業",
                icon: "★",
                color: "from-amber-50 to-orange-50 border-amber-100"
            });
        }
        // デフォルト展望（専門領域が検出されない場合）
        else {
            items.push({
                title: "メディアの編集長",
                description: "Webメディアの編集長として、コンテンツ戦略全体を統括",
                icon: "✦",
                color: "from-purple-50 to-pink-50 border-purple-100"
            });
            items.push({
                title: "専門性の深化",
                description: "現在の強みをさらに深め、その分野のスペシャリストを目指す",
                icon: "↑",
                color: "from-gray-50 to-slate-50 border-gray-100"
            });
            items.push({
                title: "コンテンツ制作会社の立ち上げ",
                description: "自身のスキルを活かして、コンテンツ制作会社を起業",
                icon: "★",
                color: "from-amber-50 to-orange-50 border-amber-100"
            });
        }

        return items.slice(0, 3);
    }, [works, inputs]);

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    今後のキャリア展望
                </h3>
                <p className="text-sm text-gray-500">
                    あなたの専門性を活かした、将来の可能性
                </p>
            </div>
            <div className="space-y-4">
                {outlooks.map((outlook, index) => (
                    <div
                        key={index}
                        className="group relative p-5 rounded-2xl border border-gray-200 bg-white shadow-[0_12px_35px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 cursor-default"
                    >
                        <div className="flex items-start gap-4">
                            {/* クレイモーフィズム風アイコン */}
                            <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${outlook.color} flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.08)] border border-white/50`}>
                                <span className="text-2xl">{outlook.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-base mb-2 text-gray-900 group-hover:text-gray-700 transition-colors">
                                    {outlook.title}
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {outlook.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
