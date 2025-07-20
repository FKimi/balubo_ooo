'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getMediaTypeIcon } from '@/features/profile/lib/profileUtils'
import type { InputData } from '@/types/input'

interface InputCardProps {
  input: InputData
  linkPath?: string
  isPublic?: boolean
}

export function InputCard({ input, linkPath, isPublic: _isPublic = false }: InputCardProps) {
  const CardContent = () => (
    <div className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer">
      {/* インプット画像またはプレースホルダー */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {(input.coverImageUrl || (input as any).cover_image_url) ? (
          <Image
            src={input.coverImageUrl || (input as any).cover_image_url}
            alt={input.title}
            fill
            sizes="100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {getMediaTypeIcon(input.type)}
              </div>
              <p className="text-gray-500 text-sm">{input.type}</p>
            </div>
          </div>
        )}
      </div>

      {/* タイトルのみ */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm">
          {input.title}
        </h3>
      </div>
    </div>
  )

  // リンクがある場合はLink要素でラップ、ない場合はそのまま表示
  if (linkPath) {
    return (
      <Link href={linkPath}>
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
} 