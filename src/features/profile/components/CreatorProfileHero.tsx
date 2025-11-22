import React, { useMemo } from "react";
import { Work } from "../types";
import {
    detectCreatorType,
    calculateActivityPeriod,
    extractMainExpertise,
} from "../lib/creatorTypeAnalysis";
import { InputData } from "../types";

interface CreatorProfileHeroProps {
    works: Work[];
    inputs?: InputData[];
}

export const CreatorProfileHero: React.FC<CreatorProfileHeroProps> = ({
    works,
    inputs,
}) => {
    const creatorType = useMemo(() => detectCreatorType(works, inputs), [works, inputs]);
    const activityPeriod = useMemo(() => calculateActivityPeriod(works), [works]);
    const mainExpertise = useMemo(() => extractMainExpertise(works), [works]);

    const stats = [
        {
            label: "活動期間",
            value: `${activityPeriod.years}年${activityPeriod.months}ヶ月`,
            color: "bg-blue-100 text-blue-700",
        },
        {
            label: "総作品数",
            value: works.length,
            unit: "作品",
            color: "bg-purple-100 text-purple-700",
        },
        {
            label: "役割の幅",
            value: new Set(works.flatMap((w) => w.roles || [])).size,
            unit: "職種",
            color: "bg-green-100 text-green-700",
        },
        {
            label: "活動タグ",
            value: new Set(works.flatMap((w) => w.tags || [])).size,
            unit: "個",
            color: "bg-orange-100 text-orange-700",
        },
    ];

    return (
        <div className="w-full rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 border border-gray-100 shadow-sm">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl shadow-md flex items-center justify-center text-5xl md:text-6xl">
                        {creatorType.icon}
                    </div>
                    <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                                {creatorType.type}
                            </h2>
                            <span className="px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
                                BETA
                            </span>
                        </div>
                        <p className="text-gray-600 text-lg">{creatorType.description}</p>

                        {mainExpertise.length > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                                <span className="text-sm text-gray-500 font-medium">主な専門性:</span>
                                <div className="flex gap-2">
                                    {mainExpertise.map((role) => (
                                        <span
                                            key={role}
                                            className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-700"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-2xl ${stat.color} bg-opacity-50 backdrop-blur-sm`}
                        >
                            <div className="text-xs font-bold opacity-70 mb-1">
                                {stat.label}
                            </div>
                            <div className="text-xl md:text-2xl font-bold">
                                {stat.value}
                                {stat.unit && (
                                    <span className="text-sm font-normal ml-1 opacity-80">
                                        {stat.unit}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
