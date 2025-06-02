'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CareerItem } from '@/types/profile'

interface ProfileModalsProps {
  // スキル関連
  isSkillModalOpen: boolean
  setIsSkillModalOpen: (open: boolean) => void
  newSkill: string
  setNewSkill: (skill: string) => void
  isUpdatingSkills: boolean
  skillError: string | null
  setSkillError: (error: string | null) => void
  onAddSkill: () => void

  // キャリア関連
  isCareerModalOpen: boolean
  setIsCareerModalOpen: (open: boolean) => void
  newCareer: Partial<CareerItem>
  setNewCareer: (career: Partial<CareerItem>) => void
  onAddCareer: () => void

  // キャリア編集関連
  isEditCareerModalOpen: boolean
  setIsEditCareerModalOpen: (open: boolean) => void
  editingCareer: CareerItem | null
  setEditingCareer: React.Dispatch<React.SetStateAction<CareerItem | null>>
  isUpdatingCareer: boolean
  onUpdateCareer: () => void

  // 削除確認関連
  isDeleteConfirmOpen: boolean
  setIsDeleteConfirmOpen: (open: boolean) => void
  deletingCareerId: string | null
  setDeletingCareerId: (id: string | null) => void
  onDeleteCareer: () => void
}

export function ProfileModals({
  isSkillModalOpen,
  setIsSkillModalOpen,
  newSkill,
  setNewSkill,
  isUpdatingSkills,
  skillError,
  setSkillError,
  onAddSkill,
  isCareerModalOpen,
  setIsCareerModalOpen,
  newCareer,
  setNewCareer,
  onAddCareer,
  isEditCareerModalOpen,
  setIsEditCareerModalOpen,
  editingCareer,
  setEditingCareer,
  isUpdatingCareer,
  onUpdateCareer,
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  deletingCareerId,
  setDeletingCareerId,
  onDeleteCareer
}: ProfileModalsProps) {
  return (
    <>
      {/* スキル追加モーダル */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">新しいスキルを追加</h3>
                <button
                  onClick={() => setIsSkillModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                {/* エラー表示 */}
                {skillError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-red-700 text-sm">{skillError}</span>
                    </div>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="newSkill" className="text-sm font-medium text-gray-700 mb-2 block">
                    スキル名
                  </Label>
                  <Input
                    id="newSkill"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="例: React, Photoshop, ライティング"
                    className="w-full"
                    disabled={isUpdatingSkills}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isUpdatingSkills) {
                        onAddSkill()
                      }
                    }}
                  />
                </div>
                
                {/* よく使われるスキルの候補 */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">
                    よく使われるスキル
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {['ライティング', '編集', 'SEO', 'WordPress', 'Photoshop', 'Illustrator', 'Figma', 'HTML/CSS', 'JavaScript', 'React'].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setNewSkill(skill)}
                        disabled={isUpdatingSkills}
                        className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 text-sm rounded-lg border border-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onAddSkill}
                  disabled={!newSkill.trim() || isUpdatingSkills}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingSkills ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      追加中...
                    </div>
                  ) : (
                    '追加'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsSkillModalOpen(false)
                    setSkillError(null)
                    setNewSkill('')
                  }}
                  variant="outline"
                  className="px-6"
                  disabled={isUpdatingSkills}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* キャリア追加モーダル */}
      {isCareerModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">新しいキャリアを追加</h3>
                <button
                  onClick={() => setIsCareerModalOpen(false)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700 mb-2 block">
                    会社名 *
                  </Label>
                  <Input
                    id="company"
                    value={newCareer.company || ''}
                    onChange={(e) => setNewCareer({ ...newCareer, company: e.target.value })}
                    placeholder="例: 株式会社○○"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="position" className="text-sm font-medium text-gray-700 mb-2 block">
                    職種 *
                  </Label>
                  <Input
                    id="position"
                    value={newCareer.position || ''}
                    onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })}
                    placeholder="例: ライター、エディター"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="department" className="text-sm font-medium text-gray-700 mb-2 block">
                    部署・チーム
                  </Label>
                  <Input
                    id="department"
                    value={newCareer.department || ''}
                    onChange={(e) => setNewCareer({ ...newCareer, department: e.target.value })}
                    placeholder="例: 編集部、マーケティング部"
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      開始日 *
                    </Label>
                    <Input
                      id="startDate"
                      value={newCareer.startDate || ''}
                      onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
                      placeholder="例: 2020年4月"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      終了日
                    </Label>
                    <Input
                      id="endDate"
                      value={newCareer.endDate || ''}
                      onChange={(e) => setNewCareer({ ...newCareer, endDate: e.target.value })}
                      placeholder="例: 2023年3月"
                      className="w-full"
                      disabled={newCareer.isCurrent}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    checked={newCareer.isCurrent || false}
                    onChange={(e) => {
                      const updated = { ...newCareer, isCurrent: e.target.checked }
                      if (e.target.checked) {
                        const { endDate, ...rest } = updated
                        setNewCareer(rest)
                      } else {
                        setNewCareer(updated)
                      }
                    }}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="isCurrent" className="text-sm text-gray-700">
                    現在の職場
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    業務内容
                  </Label>
                  <textarea
                    id="description"
                    value={newCareer.description || ''}
                    onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
                    placeholder="例: Webメディアでの記事執筆、編集業務"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onAddCareer}
                  disabled={!newCareer.company || !newCareer.position || !newCareer.startDate}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  追加
                </Button>
                <Button
                  onClick={() => setIsCareerModalOpen(false)}
                  variant="outline"
                  className="px-6"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* キャリア編集モーダル */}
      {isEditCareerModalOpen && editingCareer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">キャリア情報を編集</h3>
                <button
                  onClick={() => {
                    setIsEditCareerModalOpen(false)
                    setEditingCareer(null)
                  }}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-company" className="text-sm font-medium text-gray-700 mb-2 block">
                    会社名 *
                  </Label>
                  <Input
                    id="edit-company"
                    value={editingCareer.company}
                    onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, company: e.target.value } : null)}
                    placeholder="例: 株式会社○○"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-position" className="text-sm font-medium text-gray-700 mb-2 block">
                    職種 *
                  </Label>
                  <Input
                    id="edit-position"
                    value={editingCareer.position}
                    onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, position: e.target.value } : null)}
                    placeholder="例: ライター、エディター"
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-department" className="text-sm font-medium text-gray-700 mb-2 block">
                    部署・チーム
                  </Label>
                  <Input
                    id="edit-department"
                    value={editingCareer.department || ''}
                    onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, department: e.target.value } : null)}
                    placeholder="例: 編集部、マーケティング部"
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-startDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      開始日 *
                    </Label>
                    <Input
                      id="edit-startDate"
                      value={editingCareer.startDate}
                      onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, startDate: e.target.value } : null)}
                      placeholder="例: 2020年4月"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-endDate" className="text-sm font-medium text-gray-700 mb-2 block">
                      終了日
                    </Label>
                    <Input
                      id="edit-endDate"
                      value={editingCareer.endDate || ''}
                      onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, endDate: e.target.value } : null)}
                      placeholder="例: 2023年3月"
                      className="w-full"
                      disabled={editingCareer.isCurrent}
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-isCurrent"
                    checked={editingCareer.isCurrent}
                    onChange={(e) => setEditingCareer((prev: CareerItem | null) => {
                      if (!prev) return null
                      const updated = { ...prev, isCurrent: e.target.checked }
                      if (e.target.checked) {
                        const { endDate, ...rest } = updated
                        return rest
                      }
                      return updated
                    })}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <Label htmlFor="edit-isCurrent" className="text-sm text-gray-700">
                    現在の職場
                  </Label>
                </div>
                
                <div>
                  <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700 mb-2 block">
                    業務内容
                  </Label>
                  <textarea
                    id="edit-description"
                    value={editingCareer.description}
                    onChange={(e) => setEditingCareer((prev: CareerItem | null) => prev ? { ...prev, description: e.target.value } : null)}
                    placeholder="例: Webメディアでの記事執筆、編集業務"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  onClick={onUpdateCareer}
                  disabled={!editingCareer.company || !editingCareer.position || !editingCareer.startDate || isUpdatingCareer}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingCareer ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      更新中...
                    </div>
                  ) : (
                    '更新'
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setIsEditCareerModalOpen(false)
                    setEditingCareer(null)
                  }}
                  variant="outline"
                  className="px-6"
                  disabled={isUpdatingCareer}
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">キャリア情報を削除</h3>
                  <p className="text-sm text-gray-600 mt-1">この操作は取り消せません。</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                選択したキャリア情報を削除してもよろしいですか？
              </p>
              
              <div className="flex gap-3">
                <Button
                  onClick={onDeleteCareer}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  削除する
                </Button>
                <Button
                  onClick={() => {
                    setIsDeleteConfirmOpen(false)
                    setDeletingCareerId(null)
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  キャンセル
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 