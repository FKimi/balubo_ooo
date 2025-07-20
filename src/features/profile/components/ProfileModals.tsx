'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { CareerItem } from '../types'

interface ProfileModalsProps {
  /* --- Skill --- */
  isSkillModalOpen: boolean
  setIsSkillModalOpen: (open: boolean) => void
  newSkill: string
  setNewSkill: (value: string) => void
  onAddSkill: () => void
  isUpdatingSkills: boolean
  skillError: string | null
  setSkillError: (err: string | null) => void
  /* --- Introduction --- */
  isIntroductionModalOpen: boolean
  setIsIntroductionModalOpen: (open: boolean) => void
  currentIntroduction: string
  setCurrentIntroduction: (value: string) => void
  isUpdatingIntroduction: boolean
  onUpdateIntroduction: (intro: string) => void
  /* --- Career add --- */
  isCareerModalOpen: boolean
  setIsCareerModalOpen: (open: boolean) => void
  newCareer: Partial<CareerItem>
  setNewCareer: (career: Partial<CareerItem>) => void
  onAddCareer: () => void
  /* --- Career edit --- */
  isEditCareerModalOpen: boolean
  setIsEditCareerModalOpen: (open: boolean) => void
  editingCareer: CareerItem | null
  setEditingCareer: (career: CareerItem | null) => void
  onUpdateCareer: () => void
  /* --- Career delete --- */
  isDeleteConfirmOpen: boolean
  setIsDeleteConfirmOpen: (open: boolean) => void
  deletingCareerId: string | null
  setDeletingCareerId: (id: string | null) => void
  onDeleteCareer: () => void
  isUpdatingCareer: boolean
}

// シンプルなモーダルコンポーネント
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Disable background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return

    const originalStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  // モーダルを表示しない条件はここで判定（すべての Hooks を呼び出した後）
  if (!mounted || !isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-lg shadow-lg p-6 z-10">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

export function ProfileModals({
  /* Skill */
  isSkillModalOpen,
  setIsSkillModalOpen,
  newSkill,
  setNewSkill,
  onAddSkill,
  isUpdatingSkills,
  skillError,
  setSkillError,
  /* Intro */
  isIntroductionModalOpen,
  setIsIntroductionModalOpen,
  currentIntroduction,
  setCurrentIntroduction,
  isUpdatingIntroduction,
  onUpdateIntroduction,
  /* Career add */
  isCareerModalOpen,
  setIsCareerModalOpen,
  newCareer,
  setNewCareer,
  onAddCareer,
  /* Career edit */
  isEditCareerModalOpen,
  setIsEditCareerModalOpen,
  editingCareer,
  setEditingCareer,
  onUpdateCareer,
  /* Career delete */
  isDeleteConfirmOpen,
  setIsDeleteConfirmOpen,
  deletingCareerId, // unused here but kept for completeness
  setDeletingCareerId, // unused
  onDeleteCareer,
  isUpdatingCareer
}: ProfileModalsProps) {
  /* Skill handlers */
  const closeSkillModal = () => {
    setSkillError(null)
    setIsSkillModalOpen(false)
  }

  /* Intro handlers */
  const closeIntroModal = () => setIsIntroductionModalOpen(false)

  /* Career add handlers */
  const closeCareerModal = () => setIsCareerModalOpen(false)

  /* Career edit handlers */
  const closeEditCareerModal = () => setIsEditCareerModalOpen(false)

  /* Delete confirm handlers */
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false)

  return (
    <>
      {/* Skill Modal */}
      <Modal isOpen={isSkillModalOpen} onClose={closeSkillModal} title="スキルを追加">
        <div className="space-y-4">
          <Input
            value={newSkill}
            placeholder="例: ライティング"
            onChange={(e) => setNewSkill(e.target.value)}
            disabled={isUpdatingSkills}
          />
          {skillError && <p className="text-sm text-red-600">{skillError}</p>}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeSkillModal} disabled={isUpdatingSkills}>キャンセル</Button>
            <Button onClick={onAddSkill} disabled={isUpdatingSkills || !newSkill.trim()}>
              {isUpdatingSkills ? '追加中...' : '追加'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Introduction Modal */}
      <Modal isOpen={isIntroductionModalOpen} onClose={closeIntroModal} title="自己紹介を編集">
        <div className="space-y-4">
          <Textarea
            value={currentIntroduction}
            rows={8}
            onChange={(e) => setCurrentIntroduction(e.target.value)}
            disabled={isUpdatingIntroduction}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeIntroModal} disabled={isUpdatingIntroduction}>キャンセル</Button>
            <Button onClick={() => onUpdateIntroduction(currentIntroduction)} disabled={isUpdatingIntroduction}>
              {isUpdatingIntroduction ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Career Add Modal */}
      <Modal isOpen={isCareerModalOpen} onClose={closeCareerModal} title="キャリアを追加">
        <div className="space-y-4">
          <Input
            placeholder="会社名"
            value={newCareer.company ?? ''}
            onChange={(e) => setNewCareer({ ...newCareer, company: e.target.value })}
            disabled={isUpdatingCareer}
          />
          <Input
            placeholder="役職 / ポジション"
            value={newCareer.position ?? ''}
            onChange={(e) => setNewCareer({ ...newCareer, position: e.target.value })}
            disabled={isUpdatingCareer}
          />
          <Input
            placeholder="部署 (任意)"
            value={newCareer.department ?? ''}
            onChange={(e) => setNewCareer({ ...newCareer, department: e.target.value })}
            disabled={isUpdatingCareer}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="開始年月 (例: 2020/04)"
              value={newCareer.startDate ?? ''}
              onChange={(e) => setNewCareer({ ...newCareer, startDate: e.target.value })}
              disabled={isUpdatingCareer}
            />
            {!newCareer.isCurrent && (
              <Input
                type="text"
                placeholder="終了年月 (例: 2023/03)"
                value={newCareer.endDate ?? ''}
                onChange={(e) => setNewCareer({ ...newCareer, endDate: e.target.value })}
                disabled={isUpdatingCareer}
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isCurrent"
              type="checkbox"
              checked={newCareer.isCurrent ?? false}
              onChange={(e) => setNewCareer({ ...newCareer, isCurrent: e.target.checked })}
              disabled={isUpdatingCareer}
            />
            <label htmlFor="isCurrent" className="text-sm text-gray-700">現在の職歴</label>
          </div>
          <Textarea
            placeholder="職務内容・実績 (任意)"
            value={newCareer.description ?? ''}
            onChange={(e) => setNewCareer({ ...newCareer, description: e.target.value })}
            disabled={isUpdatingCareer}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeCareerModal} disabled={isUpdatingCareer}>キャンセル</Button>
            <Button onClick={onAddCareer} disabled={isUpdatingCareer || !(newCareer.company && newCareer.position && newCareer.startDate)}>
              {isUpdatingCareer ? '追加中...' : '追加'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Career Edit Modal */}
      <Modal isOpen={isEditCareerModalOpen} onClose={closeEditCareerModal} title="キャリアを編集">
        {editingCareer && (
          <div className="space-y-4">
            <Input
              placeholder="会社名"
              value={editingCareer.company}
              onChange={(e) => setEditingCareer({ ...editingCareer, company: e.target.value })}
              disabled={isUpdatingCareer}
            />
            <Input
              placeholder="役職 / ポジション"
              value={editingCareer.position}
              onChange={(e) => setEditingCareer({ ...editingCareer, position: e.target.value })}
              disabled={isUpdatingCareer}
            />
            <Input
              placeholder="部署 (任意)"
              value={editingCareer.department ?? ''}
              onChange={(e) => setEditingCareer({ ...editingCareer, department: e.target.value })}
              disabled={isUpdatingCareer}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                type="text"
                placeholder="開始年月 (例: 2020/04)"
                value={editingCareer.startDate}
                onChange={(e) => setEditingCareer({ ...editingCareer, startDate: e.target.value })}
                disabled={isUpdatingCareer}
              />
              {!editingCareer.isCurrent && (
                <Input
                  type="text"
                  placeholder="終了年月 (例: 2023/03)"
                  value={editingCareer.endDate ?? ''}
                  onChange={(e) => setEditingCareer({ ...editingCareer, endDate: e.target.value })}
                  disabled={isUpdatingCareer}
                />
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                id="editIsCurrent"
                type="checkbox"
                checked={editingCareer.isCurrent}
                onChange={(e) =>
                  setEditingCareer({
                    ...editingCareer,
                    isCurrent: e.target.checked,
                    endDate: e.target.checked ? '' : (editingCareer.endDate ?? '')
                  })
                }
                disabled={isUpdatingCareer}
              />
              <label htmlFor="editIsCurrent" className="text-sm text-gray-700">現在の職歴</label>
            </div>
            <Textarea
              placeholder="職務内容・実績 (任意)"
              value={editingCareer.description}
              onChange={(e) => setEditingCareer({ ...editingCareer, description: e.target.value })}
              disabled={isUpdatingCareer}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={closeEditCareerModal} disabled={isUpdatingCareer}>キャンセル</Button>
              <Button onClick={onUpdateCareer} disabled={isUpdatingCareer}>
                {isUpdatingCareer ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Career Confirm Modal */}
      <Modal isOpen={isDeleteConfirmOpen} onClose={closeDeleteConfirm} title="キャリアを削除">
        <p className="mb-6 text-sm text-gray-700">このキャリア情報を削除してもよろしいですか？</p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeDeleteConfirm} disabled={isUpdatingCareer}>キャンセル</Button>
          <Button className="bg-red-600 text-white hover:bg-red-700" onClick={onDeleteCareer} disabled={isUpdatingCareer}>
            {isUpdatingCareer ? '削除中...' : '削除'}
          </Button>
        </div>
      </Modal>
    </>
  )
}
  
