export interface DailyUsage {
  date: string;
  jobs: number;
  pages: number;
}

export interface UsageSummary {
  planName: string;
  periodStart: string;
  periodEnd: string;
  currentPeriodJobs: number;
  currentPeriodPages: number;
  includedJobs: number;
  includedPages: number;
  daily: DailyUsage[];
}

function makeDaily(days: number): DailyUsage[] {
  const result: DailyUsage[] = [];
  const base = new Date("2026-02-01");
  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    result.push({
      date: d.toISOString().split("T")[0],
      jobs: Math.floor(Math.random() * 80) + 20,
      pages: Math.floor(Math.random() * 300) + 50,
    });
  }
  return result;
}

export const mockUsage: UsageSummary = {
  planName: "Growth",
  periodStart: "Feb 1, 2026",
  periodEnd: "Feb 28, 2026",
  currentPeriodJobs: 1843,
  currentPeriodPages: 7211,
  includedJobs: 5000,
  includedPages: 20000,
  daily: makeDaily(20),
};
