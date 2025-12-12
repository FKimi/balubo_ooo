"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface WorkDetailData {
    id: string;
    title: string;
    description?: string;
    external_url?: string;
    tags?: string[];
    roles?: string[];
    categories?: string[];
    production_date?: string;
    production_notes?: string;
    user_id: string;
    [key: string]: unknown;
}

interface UseWorkActionsOptions {
    work: WorkDetailData | null;
    setWork: React.Dispatch<React.SetStateAction<WorkDetailData | null>>;
    currentUserId: string | null;
}

interface UseWorkActionsReturn {
    // 制作メモ
    productionNotes: string;
    setProductionNotes: React.Dispatch<React.SetStateAction<string>>;
    isEditingProductionNotes: boolean;
    setIsEditingProductionNotes: React.Dispatch<React.SetStateAction<boolean>>;
    isSavingProductionNotes: boolean;
    handleSaveProductionNotes: () => Promise<void>;
    handleCancelProductionNotes: () => void;

    // 作品説明
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    isEditingDescription: boolean;
    setIsEditingDescription: React.Dispatch<React.SetStateAction<boolean>>;
    isSavingDescription: boolean;
    handleSaveDescription: () => Promise<void>;
    handleCancelDescription: () => void;

    // 削除
    showDeleteModal: boolean;
    setShowDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
    isDeleting: boolean;
    handleDelete: () => Promise<void>;

    // メッセージ
    successMessage: string | null;
    error: string | null;
}

/**
 * 作品詳細ページの編集・削除アクションを管理するフック
 */
export function useWorkActions({
    work,
    setWork,
    currentUserId,
}: UseWorkActionsOptions): UseWorkActionsReturn {
    // 制作メモ
    const [productionNotes, setProductionNotes] = useState(
        work?.production_notes || "",
    );
    const [isEditingProductionNotes, setIsEditingProductionNotes] = useState(false);
    const [isSavingProductionNotes, setIsSavingProductionNotes] = useState(false);

    // 作品説明
    const [description, setDescription] = useState(work?.description || "");
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [isSavingDescription, setIsSavingDescription] = useState(false);

    // 削除
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // メッセージ
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const showSuccess = useCallback((msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    }, []);

    const showError = useCallback((msg: string) => {
        setError(msg);
        setTimeout(() => setError(null), 3000);
    }, []);

    // 認証ヘッダー取得
    const getAuthHeaders = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        return headers;
    }, []);

    // 制作メモ保存処理
    const handleSaveProductionNotes = useCallback(async () => {
        if (!work || !currentUserId) return;

        try {
            setIsSavingProductionNotes(true);
            const headers = await getAuthHeaders();

            const response = await fetch(`/api/works/${work.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    title: work.title,
                    description: work.description || "",
                    externalUrl: work.external_url || "",
                    tags: work.tags || [],
                    roles: work.roles || [],
                    categories: work.categories || [],
                    productionDate: work.production_date || "",
                    productionNotes: productionNotes,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `制作メモの保存に失敗しました: ${errorData.error || response.statusText}`,
                );
            }

            setIsEditingProductionNotes(false);
            setWork({
                ...work,
                production_notes: productionNotes,
            });
            showSuccess("制作メモを保存しました");
        } catch (err) {
            console.error("制作メモ保存エラー:", err);
            showError("制作メモの保存に失敗しました");
        } finally {
            setIsSavingProductionNotes(false);
        }
    }, [
        work,
        currentUserId,
        productionNotes,
        getAuthHeaders,
        setWork,
        showSuccess,
        showError,
    ]);

    // 制作メモ編集キャンセル処理
    const handleCancelProductionNotes = useCallback(() => {
        setProductionNotes(work?.production_notes || "");
        setIsEditingProductionNotes(false);
    }, [work?.production_notes]);

    // 作品説明の保存処理
    const handleSaveDescription = useCallback(async () => {
        if (!work || !currentUserId) return;

        try {
            setIsSavingDescription(true);
            const headers = await getAuthHeaders();

            const response = await fetch(`/api/works/${work.id}`, {
                method: "PUT",
                headers,
                body: JSON.stringify({
                    title: work.title,
                    description: description,
                    externalUrl: work.external_url || "",
                    tags: work.tags || [],
                    roles: work.roles || [],
                    categories: work.categories || [],
                    productionDate: work.production_date || "",
                    productionNotes: work.production_notes || "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    `作品説明の保存に失敗しました: ${errorData.error || response.statusText}`,
                );
            }

            setIsEditingDescription(false);
            setWork({
                ...work,
                description: description,
            });
            showSuccess("作品説明を保存しました");
        } catch (err) {
            console.error("作品説明保存エラー:", err);
            showError("作品説明の保存に失敗しました");
        } finally {
            setIsSavingDescription(false);
        }
    }, [
        work,
        currentUserId,
        description,
        getAuthHeaders,
        setWork,
        showSuccess,
        showError,
    ]);

    // 作品説明編集キャンセル処理
    const handleCancelDescription = useCallback(() => {
        setDescription(work?.description || "");
        setIsEditingDescription(false);
    }, [work?.description]);

    // 削除処理
    const handleDelete = useCallback(async () => {
        if (!work || !currentUserId) return;

        try {
            setIsDeleting(true);
            const headers = await getAuthHeaders();

            const response = await fetch(`/api/works/${work.id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                throw new Error("作品の削除に失敗しました");
            }

            // 削除成功後、プロフィールページにリダイレクト
            window.location.href = "/profile";
        } catch (err) {
            console.error("作品削除エラー:", err);
            showError("作品の削除に失敗しました");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    }, [work, currentUserId, getAuthHeaders, showError]);

    return {
        // 制作メモ
        productionNotes,
        setProductionNotes,
        isEditingProductionNotes,
        setIsEditingProductionNotes,
        isSavingProductionNotes,
        handleSaveProductionNotes,
        handleCancelProductionNotes,

        // 作品説明
        description,
        setDescription,
        isEditingDescription,
        setIsEditingDescription,
        isSavingDescription,
        handleSaveDescription,
        handleCancelDescription,

        // 削除
        showDeleteModal,
        setShowDeleteModal,
        isDeleting,
        handleDelete,

        // メッセージ
        successMessage,
        error,
    };
}
