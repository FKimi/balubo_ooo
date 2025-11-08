"use client";

import { useState, useEffect } from "react";
import { AIAnalysisResult } from "@/features/work/types";
import { Textarea } from "@/components/ui/textarea";

interface BtoBAnalysisSectionProps {
  aiAnalysis: AIAnalysisResult;
  onUpdate?: (_updatedAnalysis: Partial<AIAnalysisResult>) => void;
  editable?: boolean; // 編集可能かどうか（デフォルト: true）
}

export function BtoBAnalysisSection({ aiAnalysis, onUpdate, editable = true }: BtoBAnalysisSectionProps) {
  const [editedContent, setEditedContent] = useState({
    problem: "",
    solution: "",
    result: "",
  });

  const contentAnalysis = aiAnalysis?.contentAnalysis;

  // 初期値を設定
  useEffect(() => {
    if (contentAnalysis) {
      setEditedContent({
        problem: contentAnalysis.problem || "",
        solution: contentAnalysis.solution || "",
        result: contentAnalysis.result || "",
      });
    }
  }, [contentAnalysis]);

  // 編集内容を親コンポーネントに通知
  const handleChange = (field: "problem" | "solution" | "result", value: string) => {
    const updated = {
      ...editedContent,
      [field]: value,
    };
    setEditedContent(updated);

    // 親コンポーネントに変更を通知
    if (onUpdate) {
      onUpdate({
        contentAnalysis: updated,
      });
    }
  };

  // テキストを箇条書きとして表示する関数
  const renderBulletList = (text: string) => {
    if (!text) return null;
    
    // 「・」で始まる行または改行で分割して箇条書きにする
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const items = lines.map(line => {
      // 「・」を削除してテキストを取得
      return line.replace(/^[・\-\*]\s*/, '').trim();
    }).filter(item => item.length > 0);

    if (items.length === 0) return null;

    return (
      <ul className="list-none space-y-2 pl-0">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed">
            <span className="text-gray-500 mt-1 flex-shrink-0">・</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    );
  };

  // contentAnalysisが存在しない場合は、デフォルトの分析結果を表示
  if (!contentAnalysis) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <p className="text-gray-600 mb-2 font-medium text-sm">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "コンテンツ分析データを処理中です..."
              : "コンテンツ分析データを準備中です..."}
          </p>
          <p className="text-xs text-gray-500">
            {aiAnalysis && Object.keys(aiAnalysis).length > 0
              ? "AI分析が完了しましたが、コンテンツ分析データが見つかりません。"
              : "AI分析が完了すると、課題・解決策・成果の詳細な分析が表示されます。"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">

      {/* 課題・解決策・成果 */}
      <div className="space-y-5">
        {/* 上部：課題と解決策を2カラム */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* 課題 */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5 transition-all duration-200 hover:border-gray-400">
            <h5 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
              </div>
              課題
            </h5>
            {editable ? (
              <Textarea
                value={editedContent.problem}
                onChange={(e) => handleChange("problem", e.target.value)}
                className="min-h-[120px] text-sm text-gray-700 leading-relaxed resize-none border-0 p-0 bg-transparent focus-visible:ring-0"
                placeholder="このコンテンツが解決する課題を箇条書きで記述してください（例：・課題1\n・課題2）"
              />
            ) : (
              <div className="min-h-[120px]">
                {renderBulletList(editedContent.problem) || (
                  <p className="text-sm text-gray-500">課題の分析結果がありません</p>
                )}
            </div>
          )}
          </div>

          {/* 解決策 */}
          <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5 transition-all duration-200 hover:border-gray-400">
            <h5 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              解決策
            </h5>
            {editable ? (
              <Textarea
                value={editedContent.solution}
                onChange={(e) => handleChange("solution", e.target.value)}
                className="min-h-[120px] text-sm text-gray-700 leading-relaxed resize-none border-0 p-0 bg-transparent focus-visible:ring-0"
                placeholder="どのようなアプローチで解決したかを箇条書きで記述してください（例：・アプローチ1\n・アプローチ2）"
              />
            ) : (
              <div className="min-h-[120px]">
                {renderBulletList(editedContent.solution) || (
                  <p className="text-sm text-gray-500">解決策の分析結果がありません</p>
                )}
            </div>
          )}
          </div>
        </div>

        {/* 下部：成果を1カラム */}
        <div className="bg-gray-50 border-2 border-gray-300 rounded-lg p-5 transition-all duration-200 hover:border-gray-400">
          <h5 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            成果
          </h5>
          {editable ? (
            <Textarea
              value={editedContent.result}
              onChange={(e) => handleChange("result", e.target.value)}
              className="min-h-[100px] text-sm text-gray-700 leading-relaxed resize-none border-0 p-0 bg-transparent focus-visible:ring-0"
              placeholder="もたらした成果や貢献を箇条書きで記述してください（例：・成果1\n・成果2）"
            />
          ) : (
            <div className="min-h-[100px]">
              {renderBulletList(editedContent.result) || (
                <p className="text-sm text-gray-500">成果の分析結果がありません</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
