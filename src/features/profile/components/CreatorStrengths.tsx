import React, { useMemo } from "react";
import { Work, InputData } from "../types";
import { extractCreatorStrengths } from "../lib/creatorTypeAnalysis";

interface CreatorStrengthsProps {
    works: Work[];
    inputs?: InputData[];
}

export const CreatorStrengths: React.FC<CreatorStrengthsProps> = ({
    works,
    inputs,
}) => {
    const strengths = useMemo(() => extractCreatorStrengths(works, inputs), [works, inputs]);

    if (strengths.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strengths.map((strength, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col h-full relative overflow-hidden group hover:shadow-md transition-shadow duration-300">
                    {/* 背景装飾 */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-gray-50 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50" />

                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100">
                            {strength.icon}
                        </div>
                        <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-gray-50 px-2 py-1 rounded-full">
                            {strength.subtitle}
                        </span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                            {strength.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-auto">
                            {strength.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
