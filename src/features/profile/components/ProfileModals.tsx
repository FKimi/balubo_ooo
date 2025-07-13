'use client'

import React from 'react'
import { CareerItem } from '@/types/profile'

interface ProfileModalsProps {
  // スキル関連
  isSkillModalOpen: boolean
  setIsSkillModalOpen: (_open: boolean) => void
  newSkill: string
  setNewSkill: (_skill: string) => void
  isUpdatingSkills: boolean
  skillError: string | null
  setSkillError: (_error: string | null) => void
  onAddSkill: () => void

  // 自己紹介関連
  isIntroductionModalOpen: boolean
  setIsIntroductionModalOpen: (_open: boolean) => void
  currentIntroduction: string
  setCurrentIntroduction: (_introduction: string) => void
  isUpdatingIntroduction: boolean
  onUpdateIntroduction: (_introduction: string) => void

  // キャリア関連
  isCareerModalOpen: boolean
  setIsCareerModalOpen: (_open: boolean) => void
  newCareer: Partial<CareerItem>
  setNewCareer: (_career: Partial<CareerItem>) => void
  onAddCareer: () => void

  // キャリア編集関連
  isEditCareerModalOpen: boolean
  setIsEditCareerModalOpen: (_open: boolean) => void
  editingCareer: CareerItem | null
  setEditingCareer: React.Dispatch<React.SetStateAction<CareerItem | null>>
  isUpdatingCareer: boolean
  onUpdateCareer: () => void

  // 削除確認関連
  isDeleteConfirmOpen: boolean
  setIsDeleteConfirmOpen: (_open: boolean) => void
  deletingCareerId: string | null
  setDeletingCareerId: (_id: string | null) => void
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
  isIntroductionModalOpen,
  setIsIntroductionModalOpen,
  currentIntroduction,
  setCurrentIntroduction,
  isUpdatingIntroduction,
  onUpdateIntroduction,
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
  setDeletingCareerId: _setDeletingCareerId,
  onDeleteCareer
}: ProfileModalsProps) {
  // TODO: 必要なUIを実装
  return null;
}
  
