import fs from "fs";
import path from "path";

const STATS_PATH = path.join(process.cwd(), "data", "stats.json");

interface StatsData {
  total: number;
  today: { date: string; count: number };
  companies: Record<string, number>;
  tierCounts: Record<string, number>;
}

function readStats(): StatsData {
  try {
    return JSON.parse(fs.readFileSync(STATS_PATH, "utf-8")) as StatsData;
  } catch {
    return {
      total: 0,
      today: { date: "", count: 0 },
      companies: {},
      tierCounts: { bronze: 0, silver: 0, gold: 0, platinum: 0 },
    };
  }
}

function writeStats(data: StatsData): void {
  const tmp = STATS_PATH + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, STATS_PATH);
}

export function recordEvaluation(companyName: string, tier: string): void {
  const data = readStats();
  const today = new Date().toISOString().slice(0, 10);

  data.total += 1;

  if (data.today.date !== today) {
    data.today = { date: today, count: 1 };
  } else {
    data.today.count += 1;
  }

  const key = companyName.toLowerCase().trim() || "unknown";
  data.companies[key] = (data.companies[key] ?? 0) + 1;
  data.tierCounts[tier] = (data.tierCounts[tier] ?? 0) + 1;

  writeStats(data);
}

export interface StatsResult {
  total: number;
  todayCount: number;
  companyCount: number;
  companyName: string;
  topCompanies: Array<{ name: string; count: number }>;
  tierCounts: Record<string, number>;
}

export function getStats(companyName = ""): StatsResult {
  const data = readStats();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = data.today.date === today ? data.today.count : 0;
  const key = companyName.toLowerCase().trim();
  const companyCount = key ? (data.companies[key] ?? 0) : 0;

  const topCompanies = Object.entries(data.companies)
    .filter(([name]) => name !== "unknown")
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  return {
    total: data.total,
    todayCount,
    companyCount,
    companyName: key,
    topCompanies,
    tierCounts: data.tierCounts,
  };
}
