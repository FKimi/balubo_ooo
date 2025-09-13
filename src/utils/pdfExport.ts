import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import type { WorkData } from '@/features/work/types'

interface ProfileData {
  displayName: string
  bio?: string
  profileImageUrl?: string
  skills?: string[]
  location?: string
  website?: string
}

interface ExportData {
  profile: ProfileData
  works: WorkData[]
  inputs: any[]
  stats: {
    totalWorks: number
    totalWordCount: number
    avgRating: number
    topGenres: string[]
    topTags: string[]
  }
}

interface ComprehensiveReportData {
  profile: ProfileData
  overview: {
    expertLevel: string
    qualityScore: number
    totalWorks: number
    totalWordCount: number
    avgWordCount: number
    contentQualityRate: number
    avgInputRating: number
    availableRoles: number
    strengths: string[]
  }
  worksAnalysis: {
    works: WorkData[]
    genreDistribution: { [key: string]: number }
    tagDistribution: { [key: string]: number }
    monthlyProgress: { month: string; count: number }[]
    qualityMetrics: {
      avgWordCount: number
      completionRate: number
      tagVariety: number
    }
  }
  inputsAnalysis: {
    inputs: any[]
    genrePreferences: { [key: string]: number }
    ratingDistribution: { [key: number]: number }
    monthlyInputs: { month: string; count: number }[]
    learningInsights: {
      totalInputs: number
      avgRating: number
      topGenres: string[]
    }
  }
  growthInsights: {
    timeline: { date: string; event: string; type: 'work' | 'input' }[]
    productivityTrends: { month: string; works: number; inputs: number }[]
    skillEvolution: { skill: string; frequency: number; trend: 'up' | 'stable' | 'down' }[]
  }
}

// HTML要素から直接PDFを生成する関数（日本語完全対応版）
export async function exportHTMLToPDF(
  htmlContent: string, 
  fileName: string = 'report.pdf',
  pageOptions: { width?: number; height?: number } = {}
) {
  try {
    // 一時的なHTMLエレメントを作成
    const tempContainer = document.createElement('div')
    tempContainer.innerHTML = htmlContent
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '0'
    tempContainer.style.width = `${pageOptions.width || 800}px`
    tempContainer.style.backgroundColor = 'white'
    tempContainer.style.padding = '20px'
    tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif'
    tempContainer.style.fontSize = '14px'
    tempContainer.style.lineHeight = '1.5'
    tempContainer.style.color = '#000000'
    
    document.body.appendChild(tempContainer)
    
    // Canvas に変換
    const canvas = await html2canvas(tempContainer, {
      scale: 2, // 高解像度
      useCORS: true,
      backgroundColor: '#ffffff',
      width: pageOptions.width || 800,
      height: pageOptions.height || 1200
    })
    
    // PDFを作成
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210 // A4幅
    const pageHeight = 295 // A4高さ
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    // 最初のページ
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    // 必要に応じて追加ページ
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    // 一時要素を削除
    document.body.removeChild(tempContainer)
    
    // PDFをダウンロード
    pdf.save(fileName)
    
  } catch (error) {
    console.error('HTML to PDF変換エラー:', error)
    throw error
  }
}

// 包括的レポート用のHTML生成関数
export function generateComprehensiveReportHTML(data: ComprehensiveReportData): string {
  const reportDate = new Date().toLocaleDateString('ja-JP')
  
  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
      <!-- ページ1: 概要 -->
      <div style="padding: 40px; page-break-after: always;">
        <h1 style="color: #2C5282; font-size: 32px; margin-bottom: 20px; text-align: center;">創作活動レポート</h1>
        <h2 style="color: #4A5568; font-size: 20px; margin-bottom: 15px; text-align: center;">${data.profile.displayName}</h2>
        <p style="color: #6B7280; text-align: center; margin-bottom: 30px;">レポート作成日: ${reportDate}</p>
        
        <hr style="border: none; height: 1px; background-color: #E5E7EB; margin: 30px 0;">
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">エキスパート認定</h3>
          <p style="color: #3B82F6; font-size: 18px; font-weight: bold;">${data.overview.expertLevel}</p>
          <p style="color: #22C55E; font-size: 16px;">品質スコア: ${data.overview.qualityScore}/100点</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">活動統計</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="padding: 15px; background-color: #EFF6FF; border-radius: 8px;">
              <p style="color: #3B82F6; font-size: 24px; font-weight: bold; margin: 0;">${data.overview.totalWorks}</p>
              <p style="color: #4B5563; margin: 5px 0 0 0;">総作品数</p>
            </div>
            <div style="padding: 15px; background-color: #F0FDF4; border-radius: 8px;">
              <p style="color: #22C55E; font-size: 24px; font-weight: bold; margin: 0;">${data.overview.totalWordCount.toLocaleString()}</p>
              <p style="color: #4B5563; margin: 5px 0 0 0;">総文字数</p>
            </div>
            <div style="padding: 15px; background-color: #F3F4F6; border-radius: 8px;">
              <p style="color: #A855F7; font-size: 24px; font-weight: bold; margin: 0;">${data.overview.avgWordCount.toLocaleString()}</p>
              <p style="color: #4B5563; margin: 5px 0 0 0;">平均文字数</p>
            </div>
            <div style="padding: 15px; background-color: #FFFBEB; border-radius: 8px;">
              <p style="color: #F59E0B; font-size: 24px; font-weight: bold; margin: 0;">${Math.round(data.overview.contentQualityRate)}%</p>
              <p style="color: #4B5563; margin: 5px 0 0 0;">品質率</p>
            </div>
          </div>
        </div>
        
        ${data.overview.strengths.length > 0 ? `
        <div>
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">強み・特徴</h3>
          <ul style="color: #4B5563; margin: 0; padding-left: 20px;">
            ${data.overview.strengths.map(strength => `<li style="margin-bottom: 8px;">${strength}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
      
      <!-- ページ2: 作品分析 -->
      <div style="padding: 40px; page-break-after: always;">
        <h2 style="color: #2C5282; font-size: 28px; margin-bottom: 30px;">作品分析</h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">作品品質指標</h3>
          <p style="color: #4B5563; margin-bottom: 8px;">平均文字数: ${data.worksAnalysis.qualityMetrics.avgWordCount.toLocaleString()}文字</p>
          <p style="color: #4B5563; margin-bottom: 8px;">完成率: ${Math.round(data.worksAnalysis.qualityMetrics.completionRate)}%</p>
          <p style="color: #4B5563; margin-bottom: 8px;">タグ多様性: ${data.worksAnalysis.qualityMetrics.tagVariety}種類</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">主要作品一覧</h3>
          ${data.worksAnalysis.works.slice(0, 5).map(work => `
                         <div style="margin-bottom: 15px; padding: 15px; border: 1px solid #E5E7EB; border-radius: 8px;">
               <h4 style="color: #1F2937; margin: 0 0 8px 0; font-size: 16px;">${work.title}</h4>
               <p style="color: #6B7280; margin: 0; font-size: 14px;">${(work as any).genre || 'ジャンル未設定'} | ${(work as any).wordCount?.toLocaleString() || '0'}文字</p>
             </div>
          `).join('')}
        </div>
      </div>
      
      <!-- ページ3: インプット分析 -->
      <div style="padding: 40px; page-break-after: always;">
        <h2 style="color: #2C5282; font-size: 28px; margin-bottom: 30px;">インプット分析</h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">学習洞察</h3>
          <p style="color: #4B5563; margin-bottom: 8px;">総インプット数: ${data.inputsAnalysis.learningInsights.totalInputs}件</p>
          <p style="color: #4B5563; margin-bottom: 8px;">平均評価: ${data.inputsAnalysis.learningInsights.avgRating.toFixed(1)}/5.0</p>
          <p style="color: #4B5563; margin-bottom: 8px;">上位ジャンル: ${data.inputsAnalysis.learningInsights.topGenres.join(', ')}</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">ジャンル分析</h3>
          ${Object.entries(data.inputsAnalysis.genrePreferences).slice(0, 5).map(([genre, count]) => `
            <div style="margin-bottom: 10px;">
              <span style="color: #1F2937; font-weight: 500;">${genre}</span>
              <span style="color: #6B7280; margin-left: 10px;">${count}件</span>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- ページ4: 成長の軌跡 -->
      <div style="padding: 40px;">
        <h2 style="color: #2C5282; font-size: 28px; margin-bottom: 30px;">成長の軌跡</h2>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">活動タイムライン</h3>
          ${data.growthInsights.timeline.slice(0, 10).map(item => `
            <div style="margin-bottom: 12px; padding: 12px; background-color: #F9FAFB; border-radius: 6px;">
              <span style="color: #6B7280; font-size: 12px;">${item.date}</span>
              <p style="color: #1F2937; margin: 4px 0 0 0; font-size: 14px;">${item.event}</p>
            </div>
          `).join('')}
        </div>
        
        <div>
          <h3 style="color: #1F2937; font-size: 20px; margin-bottom: 15px;">スキル進化</h3>
          ${data.growthInsights.skillEvolution.slice(0, 5).map(skill => `
            <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #1F2937;">${skill.skill}</span>
              <div style="display: flex; align-items: center;">
                <span style="color: #6B7280; margin-right: 10px;">${skill.frequency}回</span>
                <span style="color: ${skill.trend === 'up' ? '#22C55E' : skill.trend === 'down' ? '#EF4444' : '#6B7280'};">
                  ${skill.trend === 'up' ? '↗' : skill.trend === 'down' ? '↘' : '→'}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `
}

export async function exportToPDF(data: ExportData, fileName?: string) {
  try {
    // PDFドキュメントを作成
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    // 日本語対応の設定
    pdf.setFont('helvetica')
    pdf.setLanguage('ja')
    
    let currentY = 20
    const margin = 20
    const lineHeight = 7

    // 改良された日本語対応のヘルパー関数
    const addJapaneseText = (text: string, x: number, y: number, maxWidth?: number): number => {
      try {
        // より強力な文字正規化
        let normalizedText = text
          // Unicode特殊文字を標準的な文字に変換
          .replace(/[\u2018\u2019]/g, "'")      // スマートクォート（シングル）
          .replace(/[\u201C\u201D]/g, '"')      // スマートクォート（ダブル）
          .replace(/[\u2013\u2014]/g, '-')      // EMダッシュ、ENダッシュ
          .replace(/[\u2026]/g, '...')          // 省略記号
          .replace(/[\u00A0]/g, ' ')            // ノンブレーキングスペース
          .replace(/[\u3000]/g, ' ')            // 全角スペース
          // その他の問題のある文字を除去
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 制御文字
          // 文字列を適切な長さに制限
          .trim()
        
        if (normalizedText.length > 120) {
          normalizedText = normalizedText.substring(0, 117) + '...'
        }
        
        // 空文字やnull/undefinedの場合のフォールバック
        if (!normalizedText) {
          normalizedText = '情報なし'
        }
        
        // マルチライン対応
        if (maxWidth) {
          const words = normalizedText.split('')
          let lines: string[] = []
          let currentLine = ''
          
          for (const char of words) {
            const testLine = currentLine + char
            const testWidth = pdf.getTextWidth(testLine)
            
            if (testWidth > maxWidth && currentLine.length > 0) {
              lines.push(currentLine)
              currentLine = char
            } else {
              currentLine = testLine
            }
          }
          
          if (currentLine.length > 0) {
            lines.push(currentLine)
          }
          
          // 行数を制限（最大5行）
          if (lines.length > 5) {
            lines = lines.slice(0, 4)
            lines.push(lines[4] + '...')
          }
          
          let yOffset = 0
          lines.forEach((line: string) => {
            pdf.text(line, x, y + yOffset)
            yOffset += lineHeight
          })
          
          return lines.length * lineHeight
        } else {
          pdf.text(normalizedText, x, y)
          return lineHeight
        }
        
      } catch (error) {
        console.error('PDF日本語テキスト出力エラー:', error)
        
        // 最終フォールバック：安全な文字のみ
        try {
          const safeText = String(text || '')
            .replace(/[^\u0020-\u007E\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/g, '')
            .substring(0, 80) || '表示エラー'
          
          pdf.text(safeText, x, y)
          return lineHeight
        } catch (finalError) {
          console.error('最終フォールバックも失敗:', finalError)
          pdf.text('[Text Error]', x, y)
          return lineHeight
        }
      }
    }
    
    // ヘッダー部分
    pdf.setFontSize(24)
    pdf.setTextColor(44, 82, 130) // accent-dark-blue
    addJapaneseText('創作活動レポート', margin, currentY)
    
    currentY += 15
    pdf.setFontSize(14)
    pdf.setTextColor(75, 85, 99) // gray-600
    addJapaneseText(`${data.profile.displayName}`, margin, currentY)
    
    currentY += 10
    pdf.setFontSize(10)
    pdf.setTextColor(107, 114, 128) // gray-500
    const reportDate = new Date().toLocaleDateString('ja-JP')
    addJapaneseText(`レポート作成日: ${reportDate}`, margin, currentY)
    
    // 区切り線
    currentY += 10
    pdf.setDrawColor(229, 231, 235) // gray-200
    pdf.line(margin, currentY, pageWidth - margin, currentY)
    currentY += 15
    
    // プロフィール概要
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55) // gray-800
    addJapaneseText('プロフィール概要', margin, currentY)
    currentY += 10
    
    pdf.setFontSize(11)
    pdf.setTextColor(75, 85, 99)
    
    if (data.profile.bio) {
      currentY += addJapaneseText(data.profile.bio, margin, currentY, pageWidth - 2 * margin)
      currentY += 5
    }
    
    if (data.profile.skills && data.profile.skills.length > 0) {
      currentY += addJapaneseText(`スキル: ${data.profile.skills.join(', ')}`, margin, currentY, pageWidth - 2 * margin)
      currentY += 5
    }
    
    if (data.profile.location) {
      currentY += addJapaneseText(`拠点: ${data.profile.location}`, margin, currentY)
      currentY += 5
    }
    
    currentY += 10
    
    // 活動サマリー
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55)
    addJapaneseText('活動サマリー', margin, currentY)
    currentY += 10
    
    pdf.setFontSize(11)
    
    // 統計情報をカード風に表示
    const statBoxWidth = (pageWidth - 3 * margin) / 2
    const statBoxHeight = 25
    
    // 作品統計
    pdf.setFillColor(239, 246, 255) // blue-50
    pdf.rect(margin, currentY, statBoxWidth, statBoxHeight, 'F')
    pdf.setTextColor(59, 130, 246) // blue-500
    pdf.setFontSize(20)
    addJapaneseText(data.stats.totalWorks.toString(), margin + 5, currentY + 12)
    pdf.setFontSize(10)
    pdf.setTextColor(75, 85, 99)
    addJapaneseText('総作品数', margin + 5, currentY + 20)
    
    // 文字数統計
    pdf.setFillColor(240, 253, 244) // green-50
    pdf.rect(margin + statBoxWidth + 10, currentY, statBoxWidth, statBoxHeight, 'F')
    pdf.setTextColor(34, 197, 94) // green-500
    pdf.setFontSize(20)
    addJapaneseText(data.stats.totalWordCount.toLocaleString(), margin + statBoxWidth + 15, currentY + 12)
    pdf.setFontSize(10)
    pdf.setTextColor(75, 85, 99)
    addJapaneseText('総文字数', margin + statBoxWidth + 15, currentY + 20)
    
    currentY += statBoxHeight + 15
    
    // インプット統計（データがある場合）
    if (data.inputs.length > 0) {
      pdf.setFillColor(245, 243, 255) // purple-50
      pdf.rect(margin, currentY, statBoxWidth, statBoxHeight, 'F')
      pdf.setTextColor(168, 85, 247) // purple-500
      pdf.setFontSize(20)
      addJapaneseText(data.inputs.length.toString(), margin + 5, currentY + 12)
      pdf.setFontSize(10)
      pdf.setTextColor(75, 85, 99)
      addJapaneseText('インプット数', margin + 5, currentY + 20)
      
      if (data.stats.avgRating > 0) {
        pdf.setFillColor(255, 251, 235) // yellow-50
        pdf.rect(margin + statBoxWidth + 10, currentY, statBoxWidth, statBoxHeight, 'F')
        pdf.setTextColor(245, 158, 11) // yellow-500
        pdf.setFontSize(20)
        addJapaneseText(data.stats.avgRating.toFixed(1), margin + statBoxWidth + 15, currentY + 12)
        pdf.setFontSize(10)
        pdf.setTextColor(75, 85, 99)
        addJapaneseText('平均評価', margin + statBoxWidth + 15, currentY + 20)
      }
      
      currentY += statBoxHeight + 15
    }
    
    // 強み・特徴
    pdf.setFontSize(16)
    pdf.setTextColor(31, 41, 55)
    addJapaneseText('強み・特徴', margin, currentY)
    currentY += 10
    
    pdf.setFontSize(11)
    pdf.setTextColor(75, 85, 99)
    
    if (data.stats.topTags.length > 0) {
      currentY += addJapaneseText(`主要タグ: ${data.stats.topTags.slice(0, 8).join(', ')}`, margin, currentY, pageWidth - 2 * margin)
      currentY += 5
    }
    
    if (data.stats.topGenres.length > 0) {
      currentY += addJapaneseText(`好きなジャンル: ${data.stats.topGenres.slice(0, 6).join(', ')}`, margin, currentY, pageWidth - 2 * margin)
      currentY += 10
    }
    
    // 新しいページ - 作品一覧
    if (data.works.length > 0) {
      pdf.addPage()
      currentY = 20
      
      pdf.setFontSize(16)
      pdf.setTextColor(31, 41, 55)
      addJapaneseText('主要作品一覧', margin, currentY)
      currentY += 15
      
      // 最新の作品を最大6件表示
      const displayWorks = data.works.slice(0, 6)
      
      displayWorks.forEach((work, index) => {
        if (currentY > pageHeight - 40) {
          pdf.addPage()
          currentY = 20
        }
        
        // 作品タイトル
        pdf.setFontSize(12)
        pdf.setTextColor(31, 41, 55)
        currentY += addJapaneseText(work.title, margin, currentY, pageWidth - 2 * margin)
        currentY += 3
        
        // 作品詳細
        pdf.setFontSize(10)
        pdf.setTextColor(107, 114, 128)
        
        if (work.description) {
          const shortDesc = work.description.length > 150 ? work.description.substring(0, 150) + '...' : work.description
          currentY += addJapaneseText(shortDesc, margin, currentY, pageWidth - 2 * margin)
          currentY += 3
        }
        
        if (work.production_date) {
          const productionDate = new Date(work.production_date).toLocaleDateString('ja-JP')
          currentY += addJapaneseText(`制作日: ${productionDate}`, margin, currentY)
          currentY += 5
        }
        
        if (work.tags && work.tags.length > 0) {
          currentY += addJapaneseText(`タグ: ${work.tags.slice(0, 5).join(', ')}`, margin, currentY, pageWidth - 2 * margin)
          currentY += 5
        }
        
        if (work.roles && work.roles.length > 0) {
          currentY += addJapaneseText(`役割: ${work.roles.join(', ')}`, margin, currentY, pageWidth - 2 * margin)
          currentY += 5
        }
        
        // URLがある場合
        if (work.external_url) {
          pdf.setTextColor(59, 130, 246) // blue-500
          pdf.text(`URL: ${work.external_url}`, margin, currentY)
          currentY += 5
        }
        
        currentY += 10
        
        // 区切り線
        if (index < displayWorks.length - 1) {
          pdf.setDrawColor(229, 231, 235)
          pdf.line(margin, currentY, pageWidth - margin, currentY)
          currentY += 10
        }
      })
    }
    
    // フッター情報
    const totalPages = pdf.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(8)
      pdf.setTextColor(156, 163, 175) // gray-400
      pdf.text(
        `${i} / ${totalPages} - Generated by Balubo Portfolio System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }
    
    // PDFを保存
    const defaultFileName = `${data.profile.displayName}_活動レポート_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName || defaultFileName)
    
    return true
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('PDFの出力に失敗しました')
  }
}

// 包括的なレポートPDF出力（4セクション統合版） - HTML変換方式
export async function exportComprehensiveReportToPDF(data: ComprehensiveReportData, fileName?: string) {
  try {
    // HTML形式でレポートを生成
    const htmlContent = generateComprehensiveReportHTML(data)
    
    // ファイル名の設定
    const finalFileName = fileName || `ユーザー_包括レポート_${new Date().toISOString().split('T')[0]}.pdf`
    
    // HTML to PDF変換
    await exportHTMLToPDF(htmlContent, finalFileName, { width: 800, height: 1200 })
    
    return true
  } catch (error) {
    console.error('包括レポートPDF生成エラー:', error)
    throw error
  }
}

// スクリーンショット型のPDF出力（レイアウトを保持）
export async function exportScreenshotToPDF(elementId: string, fileName?: string) {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('指定された要素が見つかりません')
    }
    
    // スクリーンショットを撮影
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight
    })
    
    const imgData = canvas.toDataURL('image/png')
    
    // PDF作成
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    
    const imgWidth = pageWidth - 20 // 余白を考慮
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let position = 0
    const margin = 10
    
    // 画像が1ページに収まらない場合は複数ページに分割
    while (position < imgHeight) {
      if (position > 0) {
        pdf.addPage()
      }
      
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        margin - position,
        imgWidth,
        imgHeight
      )
      
      position += pageHeight - 20
    }
    
    const defaultFileName = `活動レポート_${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName || defaultFileName)
    
    return true
  } catch (error) {
    console.error('Screenshot PDF export error:', error)
    throw new Error('スクリーンショットPDFの出力に失敗しました')
  }
} 