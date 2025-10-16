"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function MidCallToAction() {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  return (
    <section className="relative bg-gradient-to-r from-[#0A66C2] to-[#004182] py-16 px-4">
      <div className="container mx-auto max-w-4xl text-center">
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight">
            専門性を証明し、価値を最大化する
          </h2>
          
          <p className="text-base md:text-lg text-blue-100 leading-relaxed max-w-3xl mx-auto">
            証明する、繋がる、成長する。baluboは単なるツールではありません。
            <br />
            あなたの専門性を正当に評価されるパートナーです。
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-[#0A66C2] hover:bg-gray-50 px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
              disabled={isRedirecting}
              onClick={() => {
                setIsRedirecting(true);
                router.push("/register");
              }}
            >
              {isRedirecting ? "読み込み中…" : "無料で価値を可視化する"}
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-blue-100">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              完全無料
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              1分で登録
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
