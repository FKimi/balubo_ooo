"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { FadeIn } from "@/components/ui/motion";

const faqs = [
    {
        question: "どのようなクリエイターが登録していますか？",
        answer:
            "IT・SaaS、製造業、金融、医療・ヘルスケアなど、専門知識が必要なBtoB領域で実績のあるライター、編集者、マーケターが中心です。独自の審査基準とAI解析により、専門性を担保しています。",
    },
    {
        question: "依頼から納品までの期間はどのくらいですか？",
        answer:
            "ご依頼内容によりますが、記事制作の場合、キックオフから初稿納品まで通常2〜3週間程度です。お急ぎの場合はご相談ください。",
    },
    {
        question: "専門的な内容でも対応可能ですか？",
        answer:
            "はい、可能です。baluboは「専門性」のマッチングに特化しており、業界経験者や有資格者など、その分野に精通したクリエイターをアサインします。",
    },
    {
        question: "料金体系について教えてください。",
        answer:
            "月額固定のプランと、プロジェクトごとの個別見積もりが可能です。ご予算や課題に合わせて最適なプランをご提案しますので、まずはお問い合わせください。",
    },
    {
        question: "トライアルで1本だけ依頼することはできますか？",
        answer:
            "はい、可能です。スタータープランや、単発でのトライアル発注も承っております。品質をご確認いただいた上で、継続的なお取引をご検討いただけます。",
    },
];

export function EnterpriseFAQ() {
    return (
        <section className="bg-base-soft-blue py-20 md:py-32">
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto">
                    <FadeIn className="text-left mb-12">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary mb-6 tracking-tight">
                            よくあるご質問
                        </h2>
                        <p className="text-lg text-text-secondary">
                            ご不明な点がございましたら、お気軽にお問い合わせください
                        </p>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="border border-gray-200 bg-base-white rounded-2xl px-6 data-[state=open]:shadow-soft transition-all duration-200"
                                >
                                    <AccordionTrigger className="text-left text-base font-bold text-text-primary py-6 hover:no-underline hover:text-primary-blue transition-colors">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-text-secondary text-base leading-relaxed pb-6">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
