import { useMemo } from 'react'
import type { WorkData } from '@/types/work'

interface MonthlyActivity {
  year: number
  month: number
  count: number
  works: WorkData[]
  displayMonth: string // "2024年1月" のような表示用文字列
}

interface YearlyActivity {
  year: number
  count: number
  months: MonthlyActivity[]
}

interface WorkStatistics {
  totalWorks: number
  totalWordCount: number // 総文字数を追加
  roleDistribution: {
    role: string
    count: number
    percentage: number
    color: string
  }[]
  monthlyActivity: MonthlyActivity[] // 月別アクティビティ
  yearlyActivity: YearlyActivity[] // 年別アクティビティ
  mostActiveMonth: MonthlyActivity | null // 最も活動的だった月
  mostActiveYear: YearlyActivity | null // 最も活動的だった年
  recentActivity: MonthlyActivity[] // 最近6ヶ月のアクティビティ
}

// 役割ごとの色を定義
const ROLE_COLORS = [
  '#8B5CF6', // Purple
  '#06B6D4', // Cyan
  '#10B981', // Green
  '#F59E0B', // Yellow
  '#EF4444', // Red
  '#8B5A2B', // Brown
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#84CC16', // Lime
  '#F97316', // Orange
]

export function useWorkStatistics(works: WorkData[]): WorkStatistics {
  return useMemo(() => {
    //console.log('useWorkStatistics received works:', works);

    const totalWorks = works.length

    // 総文字数の計算（記事タイプの作品のみ）
    const totalWordCount = works
      .filter(work => work.content_type === 'article' && work.article_word_count)
      .reduce((sum, work) => sum + (work.article_word_count || 0), 0)
    
    // フォールバック: article_word_countが設定されていない場合はdescriptionの文字数で推定
    const fallbackWordCount = totalWordCount === 0 
      ? works
          .filter(work => work.description && work.description.length > 10)
          .reduce((sum, work) => sum + (work.description?.length || 0), 0)
      : totalWordCount

    // 役割分布の計算
    const roleCount: { [key: string]: number } = {}
    works.forEach(work => {
      if (work.roles && Array.isArray(work.roles)) {
        work.roles.forEach(role => {
          roleCount[role] = (roleCount[role] || 0) + 1
        })
      }
    })

    //console.log('DEBUG: Role counts:', roleCount);

    const totalRoles = Object.values(roleCount).reduce((sum, count) => sum + count, 0)

    const roleDistribution = Object.entries(roleCount)
      .map(([role, count], index) => ({
        role,
        count,
        percentage: totalRoles > 0 ? (count / totalRoles) * 100 : 0,
        color: ROLE_COLORS[index % ROLE_COLORS.length] || '#6B7280'
      }))
      .sort((a, b) => b.count - a.count)

    //console.log('DEBUG: Calculated roleDistribution:', roleDistribution);

    // 月別アクティビティの計算
    const monthlyActivityMap: { [key: string]: MonthlyActivity } = {}
    
    works.forEach(work => {
      if (work.production_date) {
        const date = new Date(work.production_date)
        const year = date.getFullYear()
        const month = date.getMonth() + 1 // 0ベースなので+1
        const key = `${year}-${month.toString().padStart(2, '0')}`
        
        if (!monthlyActivityMap[key]) {
          monthlyActivityMap[key] = {
            year,
            month,
            count: 0,
            works: [],
            displayMonth: `${year}年${month}月`
          }
        }
        
        monthlyActivityMap[key].count++
        monthlyActivityMap[key].works.push(work)
      }
    })

    const monthlyActivity = Object.values(monthlyActivityMap)
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year
        return b.month - a.month
      })

    // 年別アクティビティの計算
    const yearlyActivityMap: { [year: number]: YearlyActivity } = {}
    
    monthlyActivity.forEach(monthActivity => {
      const year = monthActivity.year
      if (!yearlyActivityMap[year]) {
        yearlyActivityMap[year] = {
          year: year,
          count: 0,
          months: []
        }
      }
      
      const yearActivity = yearlyActivityMap[year]
      if (yearActivity) {
        yearActivity.count += monthActivity.count
        yearActivity.months.push(monthActivity)
      }
    })

    const yearlyActivity = Object.values(yearlyActivityMap)
      .sort((a, b) => b.year - a.year)

    // 最も活動的だった月と年
    const mostActiveMonth = monthlyActivity.length > 0 
      ? monthlyActivity.reduce((max, current) => current.count > max.count ? current : max)
      : null

    const mostActiveYear = yearlyActivity.length > 0
      ? yearlyActivity.reduce((max, current) => current.count > max.count ? current : max)
      : null

    // 最近6ヶ月のアクティビティ
    const now = new Date()
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)
    
    const recentActivity = monthlyActivity.filter(activity => {
      const activityDate = new Date(activity.year, activity.month - 1, 1)
      return activityDate >= sixMonthsAgo
    }).slice(0, 6)

    return {
      totalWorks,
      totalWordCount: fallbackWordCount,
      roleDistribution,
      monthlyActivity,
      yearlyActivity,
      mostActiveMonth,
      mostActiveYear,
      recentActivity
    }
  }, [works])
} 