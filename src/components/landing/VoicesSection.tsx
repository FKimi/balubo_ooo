'use client'

import React, { useRef } from 'react'
import { motion, useInView, useAnimation, Variants } from 'framer-motion'

interface Voice {
  name: string
  role: string
  comment: string
  avatarInitial: string
}

const voices: Voice[] = [
  {
    name: '田中 美咲',
    role: 'フリーランスライター',
    comment: 'これまで感覚的に伝えていた自分の強みが、客観的なデータで可視化されて驚きました。クライアントへの提案でも説得力が格段に上がり、単価アップにも繋がっています。',
    avatarInitial: '田',
  },
  {
    name: '佐藤 健太',
    role: '編集者・ディレクター',
    comment: 'AIによる作品分析で、自分では気づかなかった得意分野が明らかになりました。今では特化した領域での案件依頼が増え、より充実した仕事ができています。',
    avatarInitial: '佐',
  },
  {
    name: '山田 雅子',
    role: 'コンテンツクリエイター',
    comment: 'ポートフォリオ作成にかかる時間が大幅に短縮され、制作活動に集中できるように。AI分析の結果も実感とマッチしていて、信頼して活用しています。',
    avatarInitial: '山',
  },
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function VoicesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const controls = useAnimation()

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <section className="relative overflow-hidden bg-white py-20 px-4 md:py-28">
       <div className="absolute inset-x-0 top-0 z-0 h-full bg-gradient-to-b from-blue-50/20 to-white"></div>
      <div className="container relative z-10 mx-auto max-w-5xl">
        <motion.div 
          className="text-center"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={itemVariants}
        >
          <h2 className="text-4xl font-extrabold text-slate-800 sm:text-5xl">
            <span className="bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-500 bg-clip-text text-transparent">
              先行ユーザーからの期待の声
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            すでに多くの方々から、baluboが提供する新しい価値にご期待いただいています。
          </p>
        </motion.div>

        <motion.div 
          className="mt-16 grid gap-8 md:mt-20 lg:grid-cols-3"
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {voices.map((voice) => (
            <motion.div
              key={voice.name} 
              variants={itemVariants}
              className="relative flex flex-col rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-lg transition-all duration-300 hover:border-slate-300 hover:shadow-xl"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-sky-500 rounded-t-3xl"/>
              <div className="flex-grow">
                <p className="relative text-base leading-relaxed text-slate-600">
                  <span className="absolute -left-3 -top-3 text-7xl font-bold text-blue-500/10 opacity-70">&quot;</span>
                  <span className="relative">{voice.comment}</span>
                </p>
              </div>
              <div className="mt-6 flex items-center pt-6 border-t border-slate-200/80">
                <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-sky-500 text-white text-xl font-bold">
                  {voice.avatarInitial}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{voice.name}</div>
                  <div className="text-sm text-slate-500">{voice.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
