import React, { useMemo, useState } from "react";
import { Work, InputData } from "../types";
import { analyzeCareerFit } from "../lib/creatorTypeAnalysis";

interface CareerFitAnalysisProps {
    works: Work[];
    inputs?: InputData[];
}

export const CareerFitAnalysis: React.FC<CareerFitAnalysisProps> = ({
    works,
    inputs,
}) => {
    const careerFits = useMemo(() => analyzeCareerFit(works, inputs), [works, inputs]);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    if (careerFits.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        適性の高い案件
                    </h3>
                    <p className="text-sm text-gray-500">
                        あなたの専門性を活かせる可能性のある案件
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {careerFits.map((fit, index) => {
                    const isExpanded = expandedIndex === index;
                    const rankColor =
                        index === 0
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : index === 1
                                ? "bg-gray-100 text-gray-700 border-gray-200"
                                : "bg-orange-100 text-orange-800 border-orange-200";

                    const scoreColor =
                        fit.matchScore >= 90 ? "text-green-600" :
                            fit.matchScore >= 80 ? "text-blue-600" : "text-gray-600";

                    return (
                        <div
                            key={index}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${isExpanded
                                ? "border-blue-200 bg-blue-50/30 shadow-sm"
                                : "border-gray-100 hover:border-gray-200 hover:bg-gray-50/50"
                                }`}
                        >
                            <button
                                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${rankColor}`}
                                    >
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{fit.title}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 md:hidden">
                                            {fit.reason}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">適合度</div>
                                        <div className={`text-lg font-bold ${scoreColor}`}>
                                            {fit.matchScore}%
                                        </div>
                                    </div>
                                    <div
                                        className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                                            }`}
                                    >
                                        <svg
                                            className="w-5 h-5 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                <div className="px-4 pb-4 pt-0 border-t border-blue-100/50 mt-2">
                                    <div className="pt-3">
                                        <p className="text-sm text-gray-700 mb-3 font-medium">
                                            {fit.reason}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {fit.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-600"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
