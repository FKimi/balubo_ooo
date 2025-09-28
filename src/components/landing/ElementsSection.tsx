"use client";

import React from "react";
import { useStaggeredAnimation } from "@/hooks";

const elements = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-indigo-500"
      >
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    ),
    title: "業界への解像度",
    subtitle: "Industry Expertise",
    description:
      "クライアントの業界特有の課題、商習慣、言語をどれだけ深く理解しているかを分析。専門用語や文脈から、あなたの業界知識レベルを証明します。",
    color: "purple",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-indigo-500"
      >
        <path d="M21.2 15c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3" />
        <path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3" />
        <path d="M10 10.3c.7-1.2 1-2.5.7-3.9-.6-2.4-3.4-4.1-6.1-4.1-1.6 0-3.1.5-4.4 1.3" />
        <path d="m2.8 15.1.7-1.2 1.2.7-1.2.7-.7-1.2Zm1.5-8.2.7-1.2 1.2.7-1.2.7-.7-1.2Zm8.9 4.3.7-1.2 1.2.7-1.2.7-.7-1.2Z" />
      </svg>
    ),
    title: "課題解決力",
    subtitle: "Problem Solving",
    description:
      "制作物が「誰の、どんな課題を、どのように解決したか」を分析。あなたの思考プロセスと、ビジネス課題への貢献度を可視化します。",
    color: "emerald",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-indigo-500"
      >
        <path d="M10 17a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v5a5 5 0 0 0 5 5h3Z" />
        <path d="M21 17a5 5 0 0 0 0-10h-1a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h1Z" />
      </svg>
    ),
    title: "専門性",
    subtitle: "Quality & Skill",
    description:
      "専門知識の正確性や技術的熟練度を評価し、制作物の完成度を客観的に測定。プロフェッショナルとしての品質の高さを証明します。",
    color: "orange",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-7 w-7 text-indigo-500"
      >
        <path d="m7 21 5-5 5 5" />
        <path d="m7 14 5-5 5 5" />
      </svg>
    ),
    title: "実績インパクト",
    subtitle: "Performance",
    description:
      "制作物がもたらした具体的な成果（CVR改善、リード獲得数など）を分析。あなたの仕事がビジネスに与えた影響力を定量的に示します。",
    color: "sky",
  },
];

const colorClasses = {
  purple: "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
  emerald: "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
  orange: "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
  sky: "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
  rose: "border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300",
} as const;

export default function ElementsSection() {
  const { ref, visibleItems } = useStaggeredAnimation(elements.length, 250);

  return (
    <section id="analysis" className="bg-white pt-32 pb-2 px-4 md:pt-1 md:pb-1">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 md:text-5xl">
            専門性を多角的に分析・証明
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
            baluboは、従来の指標では測れなかった「ビジネス貢献度」を可視化します。
          </p>
        </div>

        <div ref={ref} className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-2">
          {elements.map((el, idx) => {
            return (
              <div
                key={el.title}
                className={`rounded-3xl border p-8 shadow-lg backdrop-blur-sm transition-all duration-700 ease-out ${
                  colorClasses[el.color as keyof typeof colorClasses]
                } ${
                  visibleItems.includes(idx)
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 translate-y-8 scale-95"
                } hover:scale-105 hover:shadow-xl`}
                style={{
                  transitionDelay: `${idx * 250}ms`,
                }}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-all duration-500 ${
                      visibleItems.includes(idx)
                        ? "scale-100 rotate-0"
                        : "scale-75 rotate-12"
                    } hover:scale-110`}
                    style={{
                      transitionDelay: `${idx * 250 + 200}ms`,
                    }}
                  >
                    {el.icon}
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold text-slate-900 transition-all duration-500 ${
                        visibleItems.includes(idx)
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4"
                      }`}
                      style={{
                        transitionDelay: `${idx * 250 + 300}ms`,
                      }}
                    >
                      {el.title}
                    </h3>
                    <p
                      className={`text-sm font-semibold text-indigo-600 transition-all duration-500 ${
                        visibleItems.includes(idx)
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 translate-x-4"
                      }`}
                      style={{
                        transitionDelay: `${idx * 250 + 400}ms`,
                      }}
                    >
                      {el.subtitle}
                    </p>
                  </div>
                </div>
                <p
                  className={`text-base leading-relaxed text-slate-600 transition-all duration-500 ${
                    visibleItems.includes(idx)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-4"
                  }`}
                  style={{
                    transitionDelay: `${idx * 250 + 500}ms`,
                  }}
                >
                  {el.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
