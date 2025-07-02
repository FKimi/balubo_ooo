'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { WorkCard } from './WorkCard'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { WorkCategory, WorkData } from '@/types/work'

interface CategoryDropZoneProps {
  category: WorkCategory
  works: WorkData[]
  onDeleteWork: (id: string) => void
  onUpdateCategory: (categoryId: string, newName: string, newColor: string) => void
}

export function CategoryDropZone({ 
  category, 
  works, 
  onDeleteWork,
  onUpdateCategory 
}: CategoryDropZoneProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(category.name)
  const [editColor, setEditColor] = useState(category.color)

  const handleSave = () => {
    if (editName.trim()) {
      onUpdateCategory(category.id, editName.trim(), editColor)
      setIsEditing(false)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  return (
    <div className="mb-8">
      {/* カテゴリヘッダー */}
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-40"
              placeholder="カテゴリ名"
            />
            <input
              type="color"
              value={editColor}
              onChange={(e) => setEditColor(e.target.value)}
              className="w-8 h-8 rounded border"
            />
            <Button size="sm" onClick={handleSave}>保存</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>キャンセル</Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
            <span className="text-sm text-gray-500">({works.length}件)</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              className="ml-2"
            >
              編集
            </Button>
          </div>
        )}
      </div>

      {/* 作品グリッド */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          // ドラッグエンドの処理は親コンポーネントで処理
        }}
      >
        <SortableContext items={works.map(w => w.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[200px] p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
            {works.length > 0 ? (
              works.map((work) => (
                <WorkCard
                  key={work.id}
                  work={work}
                  onDelete={onDeleteWork}
                />
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📂</div>
                  <p>このカテゴリには作品がありません</p>
                  <p className="text-sm">作品をドラッグ&ドロップで移動できます</p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
} 