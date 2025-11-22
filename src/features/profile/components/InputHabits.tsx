import React, { useMemo } from "react";
import { InputData } from "../types";

interface InputHabitsProps {
    inputs: InputData[];
}

export function InputHabits({ inputs }: InputHabitsProps) {
    const habits = useMemo(() => {
        if (!inputs || inputs.length === 0) return [];

        const tagCounts: Record<string, number> = {};
        inputs.forEach((input) => {
            input.tags.forEach((tag) => {
                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });

        return Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5) // Top 5 tags
            .map(([tag, count]) => ({ tag, count }));
    }, [inputs]);

    if (!inputs || inputs.length === 0 || habits.length === 0) return null;

    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-xl">
                    <span className="text-2xl">📚</span>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">インプット習慣</h2>
                    <p className="text-sm text-gray-500">
                        学習や情報収集の傾向
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {habits.map((item, index) => (
                    <div key={item.tag} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-500 w-6">
                                {index + 1}
                            </span>
                            <span className="text-gray-900 font-medium">{item.tag}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 rounded-full"
                                    style={{
                                        width: `${(item.count / (habits[0]?.count || 1)) * 100}%`,
                                    }}
                                />
                            </div>
                            <span className="text-sm text-gray-500 w-8 text-right">
                                {item.count}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-500">
                    <span>総インプット数</span>
                    <span className="font-bold text-gray-900">{inputs.length} 件</span>
                </div>
            </div>
        </div>
    );
}
