import React, { useMemo } from "react";
import { Work } from "../types";
import { analyzeGrowth, generateNextSteps } from "../lib/skillAnalysis";

interface GrowthTimelineProps {
    works: Work[];
}

export const GrowthTimeline: React.FC<GrowthTimelineProps> = ({ works }) => {
    const phases = useMemo(() => analyzeGrowth(works), [works]);
    const nextSteps = useMemo(() => generateNextSteps(works), [works]);

    if (phases.length === 0) return null;

    return (
        <div className="w-full bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                        成長の軌跡
                    </h3>
                    <p className="text-sm text-gray-500">
                        これまでの活動と今後の展望
                    </p>
                </div>
            </div>

            {/* タイムライン */}
            <div className="relative pl-8 border-l-2 border-gray-100 space-y-12 mb-12">
                {phases.map((phase, index) => (
                    <div key={index} className="relative">
                        {/* ドット */}
                        <div
                            className={`absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm ${index === phases.length - 1
                                    ? "bg-blue-500 ring-4 ring-blue-100"
                                    : "bg-gray-300"
                                }`}
                        ></div>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="sm:w-32 flex-shrink-0">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${index === phases.length - 1
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {phase.phase}
                                </span>
                                <div className="text-xs text-gray-400 font-medium">
                                    {phase.period}
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-800 font-medium mb-3">
                                    {phase.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {phase.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    <span className="px-2 py-1 text-xs text-gray-400">
                                        {phase.workCount}作品
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 次のステップ */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-100">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-xl">🚀</span>
                    Next Steps
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {nextSteps.map((step, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
                                {step.type === "role"
                                    ? "目指すべき役割"
                                    : step.type === "skill"
                                        ? "習得推奨スキル"
                                        : "アクション"}
                            </div>
                            <h5 className="font-bold text-gray-900 mb-2 text-sm">
                                {step.title}
                            </h5>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
