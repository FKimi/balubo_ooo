"use client";

import { Button } from "@/components/ui/button";
import { ProfileData, CareerItem } from "@/features/profile/types";
import { Plus, Pencil, Trash2, Briefcase, Award } from "lucide-react";

interface ProfileOverviewProps {
    profileData: ProfileData | null;
    onAddSkill: () => void;
    onRemoveSkill?: ((_index: number) => void) | undefined;
    onEditCareer: (_career: CareerItem) => void;
    onDeleteCareerConfirm: (_careerId: string) => void;
    onAddCareer: () => void;
    onUpdateIntroduction: () => void;
}

export function ProfileOverview({
    profileData,
    onAddSkill,
    onRemoveSkill,
    onEditCareer,
    onDeleteCareerConfirm,
    onAddCareer,
    onUpdateIntroduction,
}: ProfileOverviewProps) {
    // 新規ユーザー向けウェルカムメッセージ判定
    const isProfileEmpty =
        !profileData?.bio &&
        (!profileData?.skills || profileData.skills.length === 0) &&
        (!profileData?.career || profileData.career.length === 0);

    return (
        <div className="space-y-5">
            {/* 新規ユーザー向けウェルカムメッセージ */}
            {isProfileEmpty && (
                <div className="border border-dashed border-gray-300 bg-gray-50 rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        プロフィールを完成させましょう
                    </h3>
                    <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                        スキルや経歴を追加することで、あなたの強みが伝わりやすくなり、信頼性が向上します。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button
                            onClick={onAddSkill}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md shadow-blue-500/20"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            スキルを追加
                        </Button>
                        <Button
                            onClick={onAddCareer}
                            variant="outline"
                            className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full"
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            キャリアを追加
                        </Button>
                    </div>
                </div>
            )}

            {/* 詳細自己紹介セクション */}
            <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                        自己紹介
                    </h3>
                    <Button
                        onClick={onUpdateIntroduction}
                        size="sm"
                        variant="ghost"
                        className="text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full h-8 w-8 p-0"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>

                {profileData?.introduction ? (
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                        {profileData.introduction}
                    </p>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            詳細な自己紹介はまだありません。
                        </p>
                        <Button
                            onClick={onUpdateIntroduction}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs"
                        >
                            自己紹介を追加
                        </Button>
                    </div>
                )}
            </div>

            {/* できること（スキル）セクション */}
            <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">
                        できること・スキル
                    </h3>
                    <Button
                        onClick={onAddSkill}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50 rounded-full text-xs font-medium"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        追加
                    </Button>
                </div>
                {profileData?.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill, index) => (
                            <div
                                key={index}
                                className="px-3 py-1.5 bg-white text-gray-700 rounded-full border border-gray-200 text-sm flex items-center gap-2 group hover:border-blue-300 hover:shadow-sm transition-all"
                            >
                                <span className="font-medium">{skill}</span>
                                {onRemoveSkill && (
                                    <button
                                        onClick={() => onRemoveSkill(index)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            スキルが登録されていません。
                        </p>
                        <Button
                            onClick={onAddSkill}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs"
                        >
                            スキルを追加
                        </Button>
                    </div>
                )}
            </div>

            {/* キャリアセクション - タイムライン風デザイン */}
            <div className="border border-gray-200 rounded-2xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-semibold text-gray-900">
                        キャリア
                    </h3>
                    <Button
                        onClick={onAddCareer}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:bg-blue-50 rounded-full text-xs font-medium"
                    >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        追加
                    </Button>
                </div>

                {profileData?.career && profileData.career.length > 0 ? (
                    <div className="relative pl-2 space-y-8 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-gray-100 before:content-['']">
                        {[...profileData.career]
                            .sort((a, b) => {
                                const parseYearMonth = (dateStr: string): number => {
                                    const match = dateStr.match(/(\d{4})\D*(\d{1,2})?/);
                                    if (!match) return 0;
                                    const year = Number(match[1]);
                                    const month = match[2] ? Number(match[2]) - 1 : 0;
                                    return new Date(year, month).getTime();
                                };
                                return parseYearMonth(b.startDate) - parseYearMonth(a.startDate);
                            })
                            .map((careerItem) => (
                                <div key={careerItem.id} className="relative pl-8 group">
                                    {/* タイムラインのドット */}
                                    <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-1 ring-blue-100 group-hover:scale-110 transition-transform"></div>

                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h4 className="font-bold text-gray-900 text-base">
                                                    {careerItem.position}
                                                </h4>
                                                {careerItem.isCurrent && (
                                                    <span className="bg-blue-50 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-blue-100">
                                                        Current
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1 font-medium">
                                                <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                                                {careerItem.company}
                                                {careerItem.department && (
                                                    <span className="text-gray-500 font-normal">
                                                        • {careerItem.department}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                                                <span className="inline-block w-1 h-1 rounded-full bg-gray-300"></span>
                                                {careerItem.startDate} - {careerItem.isCurrent ? "Present" : careerItem.endDate || "Unknown"}
                                            </p>

                                            {careerItem.description && (
                                                <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-100 mt-2">
                                                    {careerItem.description}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity self-end sm:self-start mt-2 sm:mt-0">
                                            <Button
                                                onClick={() => onEditCareer(careerItem)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                                onClick={() => onDeleteCareerConfirm(careerItem.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">
                            キャリア情報が登録されていません。
                        </p>
                        <Button
                            onClick={onAddCareer}
                            variant="outline"
                            size="sm"
                            className="rounded-full text-xs"
                        >
                            キャリアを追加
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
