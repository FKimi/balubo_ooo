'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section className="bg-base-light-gray py-20 px-4">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text */}
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 text-accent-dark-blue">
            AIが<strong className="text-primary-blue">クリエイター</strong>の
            <br className="hidden md:block" />新しい魅力を発見・証明
          </h2>
          <p className="text-text-secondary text-lg md:text-xl mb-8 leading-relaxed">
            baluboは、ライター・編集者をはじめとするクリエイターの作品をAIが多角的に解析し<strong>新しい魅力と強み</strong>を可視化。
            <br />客観性のあるポートフォリオでミスマッチのない最適な仕事とつながります。
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-accent-dark-blue hover:bg-primary-blue">
                無料で始める
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="lg" className="text-accent-dark-blue">
                ログイン
              </Button>
            </Link>
          </div>
        </div>

        {/* Illustration */}
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-80 h-80 bg-primary-light-blue rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🤖</span>
          </div>
        </div>
      </div>
    </section>
  )
}