'use client'

import React from 'react'

export default function DeveloperSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-accent-dark-blue">開発者からのメッセージ</h2>
        <p className="text-text-secondary text-lg md:text-xl leading-relaxed mb-8">
          baluboは、ライター・編集者などクリエイターが<strong>自分の才能を正しく評価</strong>し、
          <strong>チャンスを掴める場</strong>を作るために生まれました。<br />
          AI技術とコミュニティの力で、あなたの作品や文章がもつ可能性を世界へ届けます。
        </p>
      </div>
    </section>
  )
}
