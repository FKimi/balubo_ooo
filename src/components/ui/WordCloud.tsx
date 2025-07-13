'use client'

import React from 'react'
import { TagCloud } from 'react-tagcloud'

interface WordCloudData {
  value: string
  count: number
}

interface WordCloudProps {
  data: WordCloudData[]
  minSize?: number
  maxSize?: number
  className?: string
}

export function WordCloud({ 
  data, 
  minSize = 12, 
  maxSize = 35, 
  className = '' 
}: WordCloudProps) {
  // データが空の場合は何も表示しない
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-32 text-gray-400 ${className}`}>
        <p className="text-sm">データがありません</p>
      </div>
    )
  }

  // react-tagcloudの形式に変換
  const tagCloudData = data.map(item => ({
    value: item.value,
    count: item.count
  }))

  return (
    <div className={`word-cloud-container ${className}`}>
      <TagCloud
        minSize={minSize}
        maxSize={maxSize}
        tags={tagCloudData}
        className="word-cloud"
        onClick={(_tag: any) => {
          // タグクリック時の処理（必要に応じて実装）
        }}
        renderer={(_tag: any, size: number, color: string) => (
          <span
            key={_tag.value}
            style={{
              animation: `blinker 3s linear infinite, float 4s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s, ${Math.random() * 2}s`,
              fontSize: `${size}px`,
              margin: '3px',
              padding: '3px',
              display: 'inline-block',
              cursor: 'pointer',
              color: color,
              fontWeight: size > 20 ? 'bold' : 'normal',
              opacity: 0.7 + (size / maxSize) * 0.3,
              transition: 'all 0.3s ease',
              textShadow: size > 25 ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.15)'
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.zIndex = '10'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.opacity = String(0.7 + (size / maxSize) * 0.3)
              e.currentTarget.style.zIndex = 'auto'
            }}
          >
            {_tag.value}
          </span>
        )}
      />
      <style jsx>{`
        .word-cloud-container {
          width: 100%;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          position: relative;
        }
        
        .word-cloud {
          text-align: center;
          line-height: 1.5;
          width: 100%;
          height: 100%;
        }
        
        @keyframes blinker {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  )
} 