"use client";

import { useEffect, useState } from "react";
import type { StatsResult } from "@/lib/stats";

interface Props {
  companyName: string;
}

function getCounterMessage(companyName: string, count: number): { main: string; sub: string } {
  const name = companyName
    ? companyName.charAt(0).toUpperCase() + companyName.slice(1)
    : "this company";

  if (count <= 1) {
    return {
      main: `You are the FIRST person to check ${name}.`,
      sub: "Brave. Or naive. Possibly both.",
    };
  }
  if (count <= 10) {
    return {
      main: `You are person #${count} to check ${name}.`,
      sub: "You are not alone in your suffering. Others have stood where you stand.",
    };
  }
  if (count <= 50) {
    return {
      main: `${count} people have checked ${name}.`,
      sub: "You saw the red flags in the job description. You applied anyway. Respect.",
    };
  }
  if (count <= 150) {
    return {
      main: `${count} people have checked ${name}.`,
      sub: "A growing support group. There are snacks at the back. The snacks are also rejections.",
    };
  }
  return {
    main: `${count} people have checked ${name}.`,
    sub: `${name} has developed a reputation. Please consider seeking support.`,
  };
}

export default function CompanyCounter({ companyName }: Props) {
  const [stats, setStats] = useState<StatsResult | null>(null);

  useEffect(() => {
    const url = companyName
      ? `/api/stats?company=${encodeURIComponent(companyName)}`
      : `/api/stats`;
    fetch(url)
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
  }, [companyName]);

  if (!stats) {
    return (
      <div className="bg-blue-950/40 border-2 border-blue-800 p-4 text-center animate-pulse">
        <p className="text-blue-400 text-xs font-mono">Querying rejection database...</p>
      </div>
    );
  }

  const { main, sub } = getCounterMessage(companyName, stats.companyCount + (companyName ? 1 : 0));

  return (
    <div className="border-2 border-blue-600 bg-blue-950/40 p-4 space-y-3">
      {/* Company-specific */}
      {companyName && (
        <div className="text-center space-y-1">
          <p className="text-blue-200 font-black text-base">{main}</p>
          <p className="text-blue-400 text-sm italic">{sub}</p>
        </div>
      )}

      {/* Global stats strip */}
      <div className="grid grid-cols-3 gap-2 border-t border-blue-800 pt-3">
        <div className="text-center">
          <div className="text-yellow-400 font-black text-xl tabular-nums">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-gray-500 text-xs font-mono uppercase">Total Rejected</div>
        </div>
        <div className="text-center border-x border-blue-800">
          <div className="text-red-400 font-black text-xl tabular-nums">
            {stats.todayCount}
          </div>
          <div className="text-gray-500 text-xs font-mono uppercase">Today</div>
        </div>
        <div className="text-center">
          <div className="text-purple-400 font-black text-xl tabular-nums">
            {stats.tierCounts["platinum"] ?? 0}
          </div>
          <div className="text-gray-500 text-xs font-mono uppercase">Platinum</div>
        </div>
      </div>
    </div>
  );
}
