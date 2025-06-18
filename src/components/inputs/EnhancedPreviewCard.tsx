import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface PreviewData {
  title: string
  description: string
  image: string
  author: string
  type: string
  category: string
  releaseDate: string
  genre: string[]
  tags: string[]
  rating?: number
  url: string
  enhancedData?: {
    accuracy: number
    confidence: number
    externalSources: string[]
    isbn?: string
    pageCount?: number
    publishedDate?: string
    averageRating?: number
    ratingsCount?: number
    keywords?: string[]
    similarWorks?: string[]
    detailedGenres?: string[]
  }
}

interface EnhancedPreviewCardProps {
  previewData: PreviewData
  onApplyData: () => void
  onClose: () => void
}

export function EnhancedPreviewCard({ previewData, onApplyData, onClose }: EnhancedPreviewCardProps) {
  const hasEnhancedData = previewData.enhancedData && previewData.enhancedData.externalSources.length > 0
  
  // 精度に基づく表示色
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-600 bg-green-50'
    if (accuracy >= 0.8) return 'text-blue-600 bg-blue-50'
    if (accuracy >= 0.7) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getAccuracyText = (accuracy: number) => {
    if (accuracy >= 0.9) return '高精度'
    if (accuracy >= 0.8) return '良好'
    if (accuracy >= 0.7) return '標準'
    return '基本'
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">📖 プレビュー情報</CardTitle>
          {hasEnhancedData && (
            <div className="flex items-center gap-2">
              <Badge className={`${getAccuracyColor(previewData.enhancedData!.accuracy)} border-0`}>
                {getAccuracyText(previewData.enhancedData!.accuracy)}
              </Badge>
              <div className="text-xs text-gray-500">
                {previewData.enhancedData!.externalSources.join(' + ')}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* 基本情報 */}
        <div className="flex gap-4">
          {previewData.image && (
            <img 
              src={previewData.image} 
              alt={previewData.title}
              className="w-20 h-28 object-cover rounded-lg shadow-sm"
            />
          )}
          <div className="flex-1 space-y-2">
            <h3 className="font-bold text-lg">{previewData.title}</h3>
            {previewData.author && (
              <p className="text-gray-600">作者: {previewData.author}</p>
            )}
            <div className="flex gap-2">
              <Badge variant="outline">{previewData.type}</Badge>
              <Badge variant="outline">{previewData.category}</Badge>
            </div>
          </div>
        </div>

        {/* 説明文 */}
        {previewData.description && (
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-1">説明</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {previewData.description.length > 200 
                ? `${previewData.description.substring(0, 200)}...` 
                : previewData.description}
            </p>
          </div>
        )}

        {/* 強化された情報 */}
        {hasEnhancedData && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-medium text-sm text-blue-900 mb-3 flex items-center gap-2">
              <span className="text-blue-600">✨</span>
              強化された情報
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* 詳細データ */}
              {previewData.enhancedData!.isbn && (
                <div>
                  <span className="font-medium text-blue-800">ISBN:</span>
                  <span className="ml-2 text-blue-700">{previewData.enhancedData!.isbn}</span>
                </div>
              )}
              
              {previewData.enhancedData!.pageCount && (
                <div>
                  <span className="font-medium text-blue-800">ページ数:</span>
                  <span className="ml-2 text-blue-700">{previewData.enhancedData!.pageCount}ページ</span>
                </div>
              )}
              
              {previewData.enhancedData!.averageRating && (
                <div>
                  <span className="font-medium text-blue-800">平均評価:</span>
                  <span className="ml-2 text-blue-700">
                    ⭐ {previewData.enhancedData!.averageRating.toFixed(1)}
                    {previewData.enhancedData!.ratingsCount && (
                      <span className="text-blue-600 ml-1">
                        ({previewData.enhancedData!.ratingsCount.toLocaleString()}件)
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              {previewData.enhancedData!.publishedDate && (
                <div>
                  <span className="font-medium text-blue-800">出版日:</span>
                  <span className="ml-2 text-blue-700">{previewData.enhancedData!.publishedDate}</span>
                </div>
              )}
            </div>

            {/* 類似作品 */}
            {previewData.enhancedData!.similarWorks && previewData.enhancedData!.similarWorks.length > 0 && (
              <div className="mt-3">
                <span className="font-medium text-blue-800 text-sm">類似作品:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {previewData.enhancedData!.similarWorks.slice(0, 3).map((work, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                      {work}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ジャンル・タグ */}
        <div className="space-y-3">
          {previewData.genre && previewData.genre.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">ジャンル</h4>
              <div className="flex flex-wrap gap-1">
                {previewData.genre.map((genre, index) => (
                  <Badge key={index} className="bg-purple-100 text-purple-800 text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {previewData.tags && previewData.tags.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">タグ</h4>
              <div className="flex flex-wrap gap-1">
                {previewData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onApplyData} className="flex-1">
            📝 この情報をフォームに適用
          </Button>
          <Button variant="outline" onClick={onClose}>
            キャンセル
          </Button>
        </div>

        {/* 情報源表示 */}
        {hasEnhancedData && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t">
            情報源: {previewData.enhancedData!.externalSources.join(', ')} 
            {previewData.enhancedData!.externalSources.includes('Google Books') && ' (Google Books API)'}
            {previewData.enhancedData!.externalSources.includes('TMDb') && ' (The Movie Database)'}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 