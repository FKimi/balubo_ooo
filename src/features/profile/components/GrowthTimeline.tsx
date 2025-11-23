import React, { useMemo } from "react";
import { Work, CareerItem } from "../types";
import { analyzeGrowth, generateNextSteps } from "../lib/skillAnalysis";

interface GrowthTimelineProps {
    works: Work[];
    career?: CareerItem[];
}

interface TimelineItem {
    type: 'career' | 'work';
    phase: string;
    period: string;
    description: string;
    skills: string[];
    workCount?: number;
    date: Date;
}

export const GrowthTimeline: React.FC<GrowthTimelineProps> = ({ works, career = [] }) => {
    // 作品データからの成長フェーズ
    const workPhases = useMemo(() => analyzeGrowth(works), [works]);

    // キャリアデータと作品データを統合したタイムライン
    const combinedTimeline = useMemo(() => {
        const timeline: TimelineItem[] = [];

        // キャリア情報をタイムラインに追加
        career.forEach(careerItem => {
            const startDate = careerItem.startDate ? new Date(careerItem.startDate) : new Date();
            const endDate = careerItem.isCurrent ? new Date() : (careerItem.endDate ? new Date(careerItem.endDate) : new Date());

            timeline.push({
                type: 'career',
                phase: careerItem.position,
                period: `${careerItem.startDate || ''} - ${careerItem.isCurrent ? '現在' : (careerItem.endDate || '')}`,
                description: `${careerItem.company}${careerItem.department ? ` - ${careerItem.department}` : ''}${careerItem.description ? `\n${careerItem.description}` : ''}`,
                skills: [], // キャリアからスキルを抽出することも可能
                date: startDate
            });
        });

        // 作品フェーズをタイムラインに追加
        workPhases.forEach(phase => {
            // 期間文字列から日付を推定
            const yearMatch = phase.period.match(/(\d{4})/);
            const date = yearMatch ? new Date(parseInt(yearMatch[1]), 0, 1) : new Date();

            timeline.push({
                type: 'work',
                phase: phase.phase,
                period: phase.period,
                description: phase.description,
                skills: phase.skills,
                workCount: phase.workCount,
                date
            });
        });

        // 日付順にソート（古い順）
        return timeline.sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [workPhases, career]);

    const nextSteps = useMemo(() => generateNextSteps(works), [works]);

    if (combinedTimeline.length === 0) return null;

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
                {combinedTimeline.map((item, index) => (
                    <div key={index} className="relative">
                        {/* ドット */}
                        <div
                            className={`absolute -left-[39px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm ${index === combinedTimeline.length - 1
                                    ? "bg-blue-500 ring-4 ring-blue-100"
                                    : item.type === 'career'
                                        ? "bg-purple-400"
                                        : "bg-gray-300"
                                }`}
                        ></div>

                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="sm:w-32 flex-shrink-0">
                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${index === combinedTimeline.length - 1
                                            ? "bg-blue-100 text-blue-700"
                                            : item.type === 'career'
                                                ? "bg-purple-100 text-purple-700"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {item.type === 'career' ? '💼 ' : '🎨 '}{item.phase}
                                </span>
                                <div className="text-xs text-gray-400 font-medium">
                                    {item.period}
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className="text-gray-800 font-medium mb-3 whitespace-pre-line">
                                    {item.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {item.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 bg-gray-50 border border-gray-100 rounded text-xs text-gray-600"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {item.workCount !== undefined && (
                                        <span className="px-2 py-1 text-xs text-gray-400">
                                            {item.workCount}作品
                                        </span>
                                    )}
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
