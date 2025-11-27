"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CareerItem } from "../types";

interface ProfileModalsProps {
  /* --- Skill --- */
  isSkillModalOpen: boolean;
  setIsSkillModalOpen: (_open: boolean) => void;
  newSkill: string;
  setNewSkill: (_value: string) => void;
  onAddSkill: () => void;
  skillError: string | null;
  setSkillError: (_err: string | null) => void;
  /* --- Introduction --- */
  isIntroductionModalOpen: boolean;
  setIsIntroductionModalOpen: (_open: boolean) => void;
  currentIntroduction: string;
  setCurrentIntroduction: (_value: string) => void;
  onUpdateIntroduction: (_intro: string) => void;
  /* --- Career add --- */
  isCareerModalOpen: boolean;
  setIsCareerModalOpen: (_open: boolean) => void;
  newCareer: Partial<CareerItem>;
  setNewCareer: (_career: Partial<CareerItem>) => void;
  onAddCareer: () => void;
  /* --- Career edit --- */
  isEditCareerModalOpen: boolean;
  setIsEditCareerModalOpen: (_open: boolean) => void;
  editingCareer: CareerItem | null;
  setEditingCareer: (_career: CareerItem | null) => void;
  onUpdateCareer: () => void;
  /* --- Career delete --- */
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (_open: boolean) => void;
  deletingCareerId: string | null;
  setDeletingCareerId: (_id: string | null) => void;
  onDeleteCareer: () => void;
  /* --- Loading state --- */
  isSaving?: boolean;
}

// シンプルなモーダルコンポーネント
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Disable background scroll while modal is open
  // Disable background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  // モーダルを表示しない条件はここで判定（すべての Hooks を呼び出した後）
  if (!mounted || !isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-[0_20px_50px_rgba(15,23,42,0.12)] p-6 sm:p-8 z-10 border border-white/60 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export function ProfileModals({
  /* Skill */
  isSkillModalOpen,
  setIsSkillModalOpen,
  newSkill,
  setNewSkill,
  onAddSkill,
  skillError,
  setSkillError,
  /* Intro */
  isIntroductionModalOpen,
  setIsIntroductionModalOpen,
  currentIntroduction,
  setCurrentIntroduction,
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
  deletingCareerId: _deletingCareerId, // unused here but kept for completeness
  setDeletingCareerId: _setDeletingCareerId, // unused
  onDeleteCareer,
  /* Loading state */
  isSaving = false,
}: ProfileModalsProps) {
  /* Skill handlers */
  const closeSkillModal = () => {
    setSkillError(null);
    setIsSkillModalOpen(false);
  };

  /* Intro handlers */
  const closeIntroModal = () => setIsIntroductionModalOpen(false);

  /* Career add handlers */
  const closeCareerModal = () => setIsCareerModalOpen(false);

  /* Career edit handlers */
  const closeEditCareerModal = () => setIsEditCareerModalOpen(false);

  /* Delete confirm handlers */
  const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

  return (
    <>
      {/* Skill Modal */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={closeSkillModal}
        title="スキルを追加"
      >
        <div className="space-y-4">
          <Input
            value={newSkill}
            placeholder="例: ライティング"
            onChange={(e) => setNewSkill(e.target.value)}
          />
          {skillError && <p className="text-sm text-red-600">{skillError}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeSkillModal}
            >
              キャンセル
            </Button>
            <Button
              onClick={onAddSkill}
              disabled={!newSkill.trim() || isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSaving ? "追加中..." : "追加"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Introduction Modal */}
      <Modal
        isOpen={isIntroductionModalOpen}
        onClose={closeIntroModal}
        title="自己紹介を編集"
      >
        <div className="space-y-4">
          <Textarea
            value={currentIntroduction}
            rows={8}
            onChange={(e) => setCurrentIntroduction(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeIntroModal}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => onUpdateIntroduction(currentIntroduction)}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSaving ? "保存中..." : "保存"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Career Add Modal */}
      <Modal
        isOpen={isCareerModalOpen}
        onClose={closeCareerModal}
        title="キャリアを追加"
      >
        <div className="space-y-4">
          <Input
            placeholder="会社名"
            value={newCareer.company ?? ""}
            onChange={(e) =>
              setNewCareer({ ...newCareer, company: e.target.value })
            }
          />
          <Input
            placeholder="役職 / ポジション"
            value={newCareer.position ?? ""}
            onChange={(e) =>
              setNewCareer({ ...newCareer, position: e.target.value })
            }
          />
          <Input
            placeholder="部署 (任意)"
            value={newCareer.department ?? ""}
            onChange={(e) =>
              setNewCareer({ ...newCareer, department: e.target.value })
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input
              type="text"
              placeholder="開始年月 (例: 2020/04)"
              value={newCareer.startDate ?? ""}
              onChange={(e) =>
                setNewCareer({ ...newCareer, startDate: e.target.value })
              }
            />
            {!newCareer.isCurrent && (
              <Input
                type="text"
                placeholder="終了年月 (例: 2023/03)"
                value={newCareer.endDate ?? ""}
                onChange={(e) =>
                  setNewCareer({ ...newCareer, endDate: e.target.value })
                }
              />
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isCurrent"
              type="checkbox"
              checked={newCareer.isCurrent ?? false}
              onChange={(e) =>
                setNewCareer({ ...newCareer, isCurrent: e.target.checked })
              }
            />
            <label htmlFor="isCurrent" className="text-sm text-gray-700">
              現在の職歴
            </label>
          </div>
          <Textarea
            placeholder="職務内容・実績 (任意)"
            value={newCareer.description ?? ""}
            onChange={(e) =>
              setNewCareer({ ...newCareer, description: e.target.value })
            }
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={closeCareerModal}
            >
              キャンセル
            </Button>
            <Button
              onClick={onAddCareer}
              disabled={
                !(
                  newCareer.company &&
                  newCareer.position &&
                  newCareer.startDate
                ) || isSaving
              }
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSaving && (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSaving ? "追加中..." : "追加"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Career Edit Modal */}
      <Modal
        isOpen={isEditCareerModalOpen}
        onClose={closeEditCareerModal}
        title="キャリアを編集"
      >
        {editingCareer && (
          <div className="space-y-4">
            <Input
              placeholder="会社名"
              value={editingCareer.company}
              onChange={(e) =>
                setEditingCareer({ ...editingCareer, company: e.target.value })
              }
            />
            <Input
              placeholder="役職 / ポジション"
              value={editingCareer.position}
              onChange={(e) =>
                setEditingCareer({ ...editingCareer, position: e.target.value })
              }
            />
            <Input
              placeholder="部署 (任意)"
              value={editingCareer.department ?? ""}
              onChange={(e) =>
                setEditingCareer({
                  ...editingCareer,
                  department: e.target.value,
                })
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Input
                type="text"
                placeholder="開始年月 (例: 2020/04)"
                value={editingCareer.startDate}
                onChange={(e) =>
                  setEditingCareer({
                    ...editingCareer,
                    startDate: e.target.value,
                  })
                }
              />
              {!editingCareer.isCurrent && (
                <Input
                  type="text"
                  placeholder="終了年月 (例: 2023/03)"
                  value={editingCareer.endDate ?? ""}
                  onChange={(e) =>
                    setEditingCareer({
                      ...editingCareer,
                      endDate: e.target.value,
                    })
                  }
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
                    endDate: e.target.checked
                      ? ""
                      : (editingCareer.endDate ?? ""),
                  })
                }
              />
              <label htmlFor="editIsCurrent" className="text-sm text-gray-700">
                現在の職歴
              </label>
            </div>
            <Textarea
              placeholder="職務内容・実績 (任意)"
              value={editingCareer.description}
              onChange={(e) =>
                setEditingCareer({
                  ...editingCareer,
                  description: e.target.value,
                })
              }
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={closeEditCareerModal}
              >
                キャンセル
              </Button>
              <Button onClick={onUpdateCareer} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {isSaving && (
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Career Confirm Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={closeDeleteConfirm}
        title="キャリアを削除"
      >
        <p className="mb-6 text-sm text-gray-700">
          このキャリア情報を削除してもよろしいですか？
        </p>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={closeDeleteConfirm}
          >
            キャンセル
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700 rounded-full"
            onClick={onDeleteCareer}
          >
            削除
          </Button>
        </div>
      </Modal>
    </>
  );
}
