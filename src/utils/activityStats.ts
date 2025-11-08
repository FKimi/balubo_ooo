import type { WorkData } from "@/features/work/types";
import { formatLocalizedDate } from "./dateFormat";

/**
 * 月別のアウトプット（作品）数とインプット数を計算して返す。
 * 返却形式: [{ month: 'YYYY-MM', works: number, inputs: number }]
 */
export function calculateMonthlyProgress(works: WorkData[], inputs: any[]) {
  const monthlyData: Record<string, { works: number; inputs: number }> = {};

  works.forEach((work) => {
    if (work.production_date) {
      const month = new Date(work.production_date).toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { works: 0, inputs: 0 };
      monthlyData[month].works += 1;
    }
  });

  inputs.forEach((input) => {
    if (input.consumptionDate) {
      const month = new Date(input.consumptionDate).toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { works: 0, inputs: 0 };
      monthlyData[month].inputs += 1;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // 直近12ヶ月のみ
    .map(([month, data]) => ({
      month,
      works: data.works,
      inputs: data.inputs,
    }));
}

export type TimelineEvent = {
  date: string;
  event: string;
  type: "work" | "input";
};

/**
 * 作品制作とインプット学習のタイムライン（最新20件）を生成する。
 */
export function generateTimeline(
  works: WorkData[],
  inputs: any[],
): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  works.forEach((work) => {
    if (work.production_date) {
      events.push({
        date: formatLocalizedDate(work.production_date),
        event: `作品「${work.title}」を制作`,
        type: "work",
      });
    }
  });

  inputs.forEach((input) => {
    if (input.consumptionDate) {
      events.push({
        date: formatLocalizedDate(input.consumptionDate),
        event: `「${input.title}」を学習`,
        type: "input",
      });
    }
  });

  return events
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);
}
