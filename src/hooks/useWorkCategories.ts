import { useState, useEffect } from 'react'
import { fetcher } from '@/utils/fetcher'
import type { WorkData, WorkCategory } from '@/types/work'

// デフォルトカテゴリは削除し、空の配列から開始
const DEFAULT_CATEGORIES: WorkCategory[] = []

export function useWorkCategories(savedWorks: WorkData[], setSavedWorks: (works: WorkData[]) => void) {
  const [categories, setCategories] = useState<WorkCategory[]>(DEFAULT_CATEGORIES)

  // 作品をカテゴリに分類
  useEffect(() => {
    const categorizedWorks: WorkCategory[] = []

    // 作品から動的にカテゴリを生成
    savedWorks.forEach(work => {
      if (work.categories && work.categories.length > 0) {
        // 作品が属するカテゴリに追加
        work.categories.forEach(categoryName => {
          const existingCategory = categorizedWorks.find(cat => cat.name === categoryName)
          if (existingCategory) {
            existingCategory.works.push(work)
          } else {
            // 新しいカテゴリを作成
            const newCategory: WorkCategory = {
              id: `category_${categoryName.replace(/\s+/g, '_').toLowerCase()}`,
              name: categoryName,
              color: '#F59E0B',
              works: [work]
            }
            categorizedWorks.push(newCategory)
          }
        })
      } else {
        // 未分類に追加（未分類カテゴリがない場合は作成）
        let uncategorized = categorizedWorks.find(cat => cat.id === 'uncategorized')
        if (!uncategorized) {
          uncategorized = {
            id: 'uncategorized',
            name: '未分類',
            color: '#6B7280',
            works: []
          }
          categorizedWorks.push(uncategorized)
        }
        uncategorized.works.push(work)
      }
    })

    setCategories(categorizedWorks)
  }, [savedWorks])

  // 新しいカテゴリを追加
  const addCategory = () => {
    const categoryNumber = categories.length + 1
    const newCategoryId = `category_${Date.now()}`
    const newCategory: WorkCategory = {
      id: newCategoryId,
      name: `カテゴリ${categoryNumber}`,
      color: '#6366F1',
      works: []
    }
    setCategories([...categories, newCategory])
    
    return newCategoryId
  }

  // カテゴリ名のバリデーション
  const validateCategoryName = (name: string, excludeId?: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'カテゴリ名を入力してください' }
    }
    
    if (name.trim().length > 20) {
      return { isValid: false, error: 'カテゴリ名は20文字以内で入力してください' }
    }
    
    // 重複チェック（編集時は自分自身を除外）
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === name.trim().toLowerCase() && cat.id !== excludeId
    )
    if (existingCategory) {
      return { isValid: false, error: `「${existingCategory.name}」と同じ名前のカテゴリが既に存在します` }
    }
    
    return { isValid: true }
  }

  // カテゴリ情報を更新（データベースと連携）
  const updateCategory = async (categoryId: string, newName: string, newColor: string) => {
    try {
      // バリデーション
      const validation = validateCategoryName(newName, categoryId)
      if (!validation.isValid) {
        throw new Error(validation.error)
      }

      const category = categories.find(cat => cat.id === categoryId)
      if (!category) {
        throw new Error('カテゴリが見つかりません')
      }

      const oldName = category.name
      
      // 該当カテゴリの作品のカテゴリ名をデータベースで更新
      if (oldName !== newName && category.works.length > 0) {
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) {
          throw new Error('認証が必要です')
        }

        // 該当カテゴリの全作品のカテゴリ名を更新
        for (const work of category.works) {
          const updatedCategories = work.categories?.map(cat => 
            cat === oldName ? newName : cat
          ) || []

          await fetcher(`/api/works/${work.id}/category`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ categories: updatedCategories }),
          })
        }

        // ローカル状態の更新
        const updatedWorks = savedWorks.map(work => {
          if (work.categories?.includes(oldName)) {
            return {
              ...work,
              categories: work.categories.map(cat => cat === oldName ? newName : cat)
            }
          }
          return work
        })
        setSavedWorks(updatedWorks)
      }

      // カテゴリ情報の更新
      setCategories(categories.map(cat => 
        cat.id === categoryId 
          ? { ...cat, name: newName, color: newColor }
          : cat
      ))

    } catch (error) {
      console.error('カテゴリ更新エラー:', error)
      throw error // エラーを上位に投げて、UI側で適切に処理
    }
  }

  // カテゴリを削除（データベースと連携）
  const deleteCategory = async (categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id === categoryId)
      if (!category) return

      // 該当カテゴリの作品をデータベースで未分類に移動
      if (category.works.length > 0) {
        const { supabase } = await import('@/lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session?.access_token) {
          throw new Error('認証が必要です')
        }

        // 該当カテゴリの全作品を未分類に移動
        for (const work of category.works) {
          const updatedCategories = work.categories?.filter(cat => cat !== category.name) || []

          await fetcher(`/api/works/${work.id}/category`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ categories: updatedCategories }),
          })
        }

        // ローカル状態の更新
        const updatedWorks = savedWorks.map(work => {
          if (work.categories?.includes(category.name)) {
            return {
              ...work,
              categories: work.categories.filter(cat => cat !== category.name)
            }
          }
          return work
        })
        setSavedWorks(updatedWorks)
      }

      // カテゴリを削除
      setCategories(categories.filter(cat => cat.id !== categoryId))

    } catch (error) {
      console.error('カテゴリ削除エラー:', error)
      alert(`カテゴリの削除に失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`)
    }
  }

  // 作品のカテゴリを更新（ドラッグアンドドロップ時）
  const updateWorkCategory = async (workId: string, newCategoryName: string) => {
    try {
      const { supabase } = await import('@/lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('認証が必要です')
      }

      await fetcher(`/api/works/${workId}/category`, {
        method: 'PUT',
        body: JSON.stringify({
          categories: newCategoryName === '未分類' || newCategoryName === '' ? [] : [newCategoryName],
        }),
      })

      // ローカル状態を更新
      const updatedWorks = savedWorks.map(work => 
        work.id === workId 
          ? { ...work, categories: newCategoryName === '未分類' || newCategoryName === '' ? [] : [newCategoryName] }
          : work
      )
      setSavedWorks(updatedWorks)

    } catch (error) {
      console.error('カテゴリ更新エラー:', error)
      alert('カテゴリの更新に失敗しました')
    }
  }

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    updateWorkCategory,
    validateCategoryName
  }
} 