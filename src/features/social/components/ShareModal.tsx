"use client";

import { useEffect, useMemo, useState } from "react";
import { generateShareModalData } from "@/utils/socialShare";
import type { WorkData } from "@/features/work/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { X } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "work" | "input";
  data: WorkData | any;
  userDisplayName?: string;
  variant?: "modal" | "toast";
}

export function ShareModal({
  isOpen,
  onClose,
  type,
  data,
  userDisplayName,
  variant: _variant = "modal",
}: ShareModalProps) {
  const modalData = useMemo(() => {
    if (type === "work") {
      return generateShareModalData(data, userDisplayName);
    }
    return generateShareModalData(data, userDisplayName);
  }, [type, data, userDisplayName]);

  // 作品の場合はシェア用画像 URL を生成 (OGP Route)
  const ogImageUrl = useMemo(() => {
    if (
      type === "work" &&
      (data as WorkData).id &&
      typeof window !== "undefined"
    ) {
      return `${window.location.origin}/api/og/analysis/${(data as WorkData).id}`;
    }
    return null;
  }, [type, data]);

  const [copied, setCopied] = useState(false);
  const [editedText, setEditedText] = useState(modalData.text);

  // modalDataが変更されたら編集テキストも更新
  useMemo(() => {
    setEditedText(modalData.text);
  }, [modalData.text]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("コピーに失敗しました", e);
    }
  };

  const handleShare = () => {
    // 編集されたテキストでシェア
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(editedText)}${modalData.url ? `&url=${encodeURIComponent(modalData.url)}` : ""}${modalData.hashtags ? `&hashtags=${modalData.hashtags.join(",")}` : ""}`;
    window.open(
      twitterUrl,
      "_blank",
      "width=600,height=400,resizable=yes,scrollbars=yes",
    );
  };

  // Escキーとスクロールロックの制御
  useEffect(() => {
    if (!isOpen) return;

    // スクロールロック
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Escキー対応
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/25">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.71 4.28 4.28 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97 8.58 8.58 0 01-5.31 1.83A8.65 8.65 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.65 8.65 0 0022.46 6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Xでシェア</h2>
              <p className="text-sm text-gray-500">あなたの作品を広めましょう</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="閉じる"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 本文 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* プレビュー画像 */}
          {ogImageUrl && (
            <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={ogImageUrl}
                alt="シェアプレビュー"
                width={1200}
                height={630}
                className="w-full h-auto"
                unoptimized
              />
            </div>
          )}

          {/* 編集可能なテキストエリア */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                投稿内容を編集できます
              </label>
              <span className={`text-xs font-medium ${editedText.length > 140 ? "text-red-600" : editedText.length > 120 ? "text-orange-600" : "text-gray-500"
                }`}>
                {editedText.length} / 140文字
              </span>
            </div>
            <Textarea
              value={editedText}
              onChange={(e) => {
                // 140文字を超えないように制限
                const newText = e.target.value.length > 140 ? e.target.value.substring(0, 140) : e.target.value;
                setEditedText(newText);
              }}
              className={`min-h-[150px] text-base leading-relaxed resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500 ${editedText.length > 140 ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""
                }`}
              placeholder="投稿内容を入力..."
            />
            {editedText.length > 140 && (
              <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                140文字以内に収めてください
              </p>
            )}
            {editedText.length <= 140 && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                投稿前に内容を確認・編集できます（140文字以内推奨）
              </p>
            )}
          </div>

          {/* プレビュー情報 */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-50/80 rounded-xl p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  シェアのメリット
                </p>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li>• あなたの専門性が多くの人に伝わります</li>
                  <li>• 同じ課題を持つ人に価値を提供できます</li>
                  <li>• 新しい仕事の機会につながる可能性があります</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="border-t border-gray-100 p-6 bg-gray-50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleShare}
                disabled={editedText.length > 140 || editedText.trim().length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 text-base shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.29 3.9 12.14 12.14 0 01-8.82-4.47 4.28 4.28 0 001.32 5.71 4.28 4.28 0 01-1.94-.54v.05a4.28 4.28 0 003.44 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97 8.58 8.58 0 01-5.31 1.83A8.65 8.65 0 012 19.54a12.13 12.13 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.37-.01-.56A8.65 8.65 0 0022.46 6z" />
                </svg>
                Xでシェアする
              </Button>
              <Button
                variant="outline"
                onClick={handleCopy}
                className="flex-1 h-12 text-base border-2 hover:bg-gray-50 rounded-full"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    コピーしました
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    テキストをコピー
                  </>
                )}
              </Button>
            </div>
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium py-2 transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
