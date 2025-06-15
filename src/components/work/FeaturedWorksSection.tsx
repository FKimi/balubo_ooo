import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { WorkCard } from '@/components/work/WorkCard'
import { WorkData } from '@/types/work'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { SortableWorkCard } from '@/components/work/SortableWorkCard'

interface FeaturedWorksSectionProps {
  savedWorks: WorkData[]
  setSavedWorks: (works: WorkData[]) => void
  deleteWork: (workId: string) => void
}

export function FeaturedWorksSection({ 
  savedWorks, 
  setSavedWorks, 
  deleteWork 
}: FeaturedWorksSectionProps) {
  const [isEditMode, setIsEditMode] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // 代表作を取得（featured_orderでソート）
  const featuredWorks = savedWorks
    .filter(work => work.is_featured)
    .sort((a, b) => (a.featured_order || 0) - (b.featured_order || 0))

  // 代表作以外の作品を取得
  const nonFeaturedWorks = savedWorks.filter(work => !work.is_featured)

  // 代表作の順序を更新
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = featuredWorks.findIndex(work => work.id === active.id)
    const newIndex = featuredWorks.findIndex(work => work.id === over.id)

    if (oldIndex !== -1 && newIndex !== -1) {
      const reorderedFeatured = arrayMove(featuredWorks, oldIndex, newIndex)
      
      // featured_orderを更新
      const updatedFeatured = reorderedFeatured.map((work, index) => ({
        ...work,
        featured_order: index + 1
      }))

      // 全作品リストを更新
      const updatedWorks = [
        ...updatedFeatured,
        ...nonFeaturedWorks
      ]

      setSavedWorks(updatedWorks)
    }
  }

  // 代表作に追加
  const addToFeatured = async (workId: string) => {
    if (featuredWorks.length >= 3) {
      alert('代表作は最大3つまで設定できます')
      return
    }

    setIsUpdating(true)
    try {
      const updatedWorks = savedWorks.map(work => 
        work.id === workId 
          ? { 
              ...work, 
              is_featured: true, 
              featured_order: featuredWorks.length + 1 
            }
          : work
      )
      
      setSavedWorks(updatedWorks)
      await updateFeaturedWorksInDatabase(updatedWorks)
    } catch (error) {
      console.error('代表作追加エラー:', error)
      alert('代表作の設定に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  // 代表作から削除
  const removeFromFeatured = async (workId: string) => {
    setIsUpdating(true)
    try {
      const updatedWorks = savedWorks.map(work => 
        work.id === workId 
          ? { 
              ...work, 
              is_featured: false, 
              featured_order: undefined 
            }
          : work
      )
      
      setSavedWorks(updatedWorks)
      await updateFeaturedWorksInDatabase(updatedWorks)
    } catch (error) {
      console.error('代表作削除エラー:', error)
      alert('代表作の解除に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  // データベースに代表作情報を保存
  const updateFeaturedWorksInDatabase = async (works: WorkData[]) => {
    const { supabase } = await import('@/lib/supabase')
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.access_token) return

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`
    }

    // 代表作の情報のみを更新
    const featuredUpdates = works
      .filter(work => work.is_featured !== undefined)
      .map(work => ({
        id: work.id,
        is_featured: work.is_featured,
        featured_order: work.featured_order
      }))

    for (const update of featuredUpdates) {
      await fetch(`/api/works/${update.id}/featured`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          is_featured: update.is_featured,
          featured_order: update.featured_order
        })
      })
    }
  }

  // 編集モードの保存
  const handleSaveEditMode = async () => {
    setIsUpdating(true)
    try {
      await updateFeaturedWorksInDatabase(savedWorks)
      setIsEditMode(false)
    } catch (error) {
      console.error('保存エラー:', error)
      alert('保存に失敗しました')
    } finally {
      setIsUpdating(false)
    }
  }

  if (featuredWorks.length === 0 && !isEditMode) {
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span className="text-2xl">⭐</span>
            代表作
          </h3>
          <Button
            onClick={() => setIsEditMode(true)}
            variant="outline"
            className="text-sm"
          >
            代表作を設定
          </Button>
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🌟</div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">代表作を設定しましょう</h4>
          <p className="text-gray-600 mb-4">
            最大3つまでの作品を代表作として設定できます。<br />
            訪問者が最初に目にする重要な作品です。
          </p>
          <Button
            onClick={() => setIsEditMode(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            代表作を選択
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          代表作
          <span className="text-sm font-normal text-gray-500">
            ({featuredWorks.length}/3)
          </span>
        </h3>
        <div className="flex gap-2">
          {isEditMode ? (
            <>
              <Button
                onClick={() => setIsEditMode(false)}
                variant="outline"
                className="text-sm"
                disabled={isUpdating}
              >
                キャンセル
              </Button>
              <Button
                onClick={handleSaveEditMode}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isUpdating}
              >
                {isUpdating ? '保存中...' : '保存'}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditMode(true)}
              variant="outline"
              className="text-sm"
            >
              編集
            </Button>
          )}
        </div>
      </div>

      {isEditMode ? (
        <div className="space-y-6">
          {/* 現在の代表作 */}
          {featuredWorks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">現在の代表作</h4>
              <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={featuredWorks.map(w => w.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {featuredWorks.map((work) => (
                      <div key={work.id} className="relative">
                        <SortableWorkCard
                          work={work}
                          onDelete={deleteWork}
                          isDraggable={true}
                        />
                        <Button
                          onClick={() => removeFromFeatured(work.id)}
                          className="absolute top-2 right-2 w-8 h-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-full"
                          disabled={isUpdating}
                        >
                          ×
                        </Button>
                        <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          #{work.featured_order}
                        </div>
                      </div>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {/* 代表作候補 */}
          {featuredWorks.length < 3 && nonFeaturedWorks.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                代表作に追加 
                <span className="text-sm font-normal text-gray-500 ml-2">
                  (クリックして追加)
                </span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nonFeaturedWorks.slice(0, 6).map((work) => (
                  <div 
                    key={work.id} 
                    className="relative cursor-pointer transform hover:scale-105 transition-transform"
                    onClick={() => addToFeatured(work.id)}
                  >
                    <WorkCard
                      work={work}
                      onDelete={deleteWork}
                      isDraggable={false}
                    />
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-0 hover:bg-opacity-10 rounded-lg transition-all flex items-center justify-center">
                      <div className="bg-blue-600 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredWorks.map((work) => (
            <div key={work.id} className="relative">
              <WorkCard
                work={work}
                onDelete={deleteWork}
                isDraggable={false}
              />
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <span>⭐</span>
                代表作
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 