"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { StatsResult } from "@/lib/stats";

function AnimatedNumber({ target }: { target: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1200;
    const steps = 60;
    const step = target / steps;
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(Math.round(current));
      if (current >= target) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [target]);

  return <span>{display.toLocaleString()}</span>;
}

const TIER_META: Record<string, { icon: string; color: string; label: string }> = {
  bronze: { icon: "🥉", color: "text-amber-400", label: "Bronze" },
  silver: { icon: "🥈", color: "text-gray-400", label: "Silver" },
  gold: { icon: "🥇", color: "text-yellow-400", label: "Gold" },
  platinum: { icon: "💎", color: "text-purple-400", label: "Platinum" },
};

export default function HallOfFamePage() {
  const [stats, setStats] = useState<StatsResult | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => null);
  }, []);

  const totalTiers = stats
    ? Object.values(stats.tierCounts).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-purple-900 border-b-4 border-purple-400 py-8 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 opacity-50 animate-pulse" />
        <div className="relative">
          <p className="text-purple-300 text-xs uppercase tracking-[0.4em] font-bold mb-2">
            MegaCorp Industries™
          </p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            <span className="text-white">Hall of </span>
            <span className="text-yellow-400">Shame</span>
          </h1>
          <p className="text-purple-300 text-sm mt-2">
            A monument to the ambitions we have crushed. Updated in real time.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-10">
        {/* Global counters */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Rejected", value: stats?.total ?? 0, color: "text-red-400" },
            { label: "Today", value: stats?.todayCount ?? 0, color: "text-orange-400" },
            { label: "Top Tier (Gold)", value: stats?.tierCounts["gold"] ?? 0, color: "text-yellow-400" },
            { label: "Elite (Platinum)", value: stats?.tierCounts["platinum"] ?? 0, color: "text-purple-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-gray-900 border-2 border-gray-700 p-4 text-center">
              <div className={`text-3xl font-black font-mono tabular-nums ${color}`}>
                {stats ? <AnimatedNumber target={value} /> : "—"}
              </div>
              <div className="text-gray-500 text-xs uppercase mt-1 font-mono">{label}</div>
            </div>
          ))}
        </section>

        {/* Tier distribution */}
        <section className="space-y-3">
          <h2 className="text-white font-black text-lg uppercase tracking-widest border-b border-gray-800 pb-2">
            Rejection Tier Distribution
          </h2>
          {stats &&
            Object.entries(stats.tierCounts)
              .sort(([, a], [, b]) => b - a)
              .map(([tier, count]) => {
                const meta = TIER_META[tier];
                const pct = totalTiers > 0 ? Math.round((count / totalTiers) * 100) : 0;
                return (
                  <div key={tier} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className={`font-bold ${meta.color}`}>
                        {meta.icon} {meta.label} Rejection
                      </span>
                      <span className="text-gray-400 font-mono">
                        {count.toLocaleString()} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-5 bg-gray-800 border border-gray-700 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ease-out ${
                          tier === "bronze" ? "bg-amber-700"
                          : tier === "silver" ? "bg-gray-500"
                          : tier === "gold" ? "bg-yellow-500"
                          : "bg-purple-600"
                        }`}
                        style={{ width: stats ? `${pct}%` : "0%" }}
                      />
                    </div>
                  </div>
                );
              })}
        </section>

        {/* Most-checked companies */}
        <section className="space-y-3">
          <h2 className="text-white font-black text-lg uppercase tracking-widest border-b border-gray-800 pb-2">
            Most-Checked Companies
          </h2>
          <p className="text-gray-500 text-xs font-mono">
            These companies have been checked most often before applying. Draw your own conclusions.
          </p>
          {stats?.topCompanies.map(({ name, count }, i) => (
            <div key={name} className="flex items-center gap-4 bg-gray-900 border border-gray-800 p-3">
              <span className="text-gray-600 font-mono text-sm w-6 text-right flex-shrink-0">
                {i + 1}.
              </span>
              <span className="text-white font-bold flex-1 capitalize">{name}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-3 bg-gray-800 border border-gray-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-700"
                    style={{
                      width: stats.topCompanies[0]
                        ? `${(count / stats.topCompanies[0].count) * 100}%`
                        : "0%",
                    }}
                  />
                </div>
                <span className="text-blue-400 font-mono text-sm tabular-nums">
                  {count.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* Notable rejections (static, for flavor) */}
        <section className="space-y-3">
          <h2 className="text-white font-black text-lg uppercase tracking-widest border-b border-gray-800 pb-2">
            Notable Rejection Error Codes
          </h2>
          <p className="text-gray-500 text-xs font-mono">
            A selection of codes our system has issued. Each represents a life briefly
            reviewed and immediately dismissed.
          </p>
          {[
            { code: "ERR_DANGEROUS_SELF_AWARENESS", count: 312, desc: "Candidate demonstrated knowledge of their own value" },
            { code: "ERR_BUZZWORD_CONTAMINATION", count: 289, desc: "Resume contained language indistinguishable from our own job postings" },
            { code: "ERR_TEMPORAL_BIAS_DETECTED", count: 241, desc: "Candidate listed years of experience, implying the passage of time" },
            { code: "ERR_PARADOX_LENGTH", count: 198, desc: "Resume was simultaneously too long and too short for our dual-screener system" },
            { code: "ERR_FILE_RECEIVED", count: 207, desc: "File successfully received; automatic rejection triggered per SOP" },
            { code: "ERR_CREDENTIAL_PARADOX", count: 154, desc: "Has degree (overqualified) / No degree (underqualified)" },
          ].map(({ code, count, desc }) => (
            <div key={code} className="bg-gray-900 border border-red-900 p-3 space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-red-400 font-mono text-xs font-bold">{code}</span>
                <span className="text-gray-500 font-mono text-xs">{count.toLocaleString()}×</span>
              </div>
              <p className="text-gray-400 text-xs">{desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="flex gap-4 justify-center pt-4 border-t border-gray-800">
          <Link
            href="/"
            className="px-8 py-3 bg-red-700 text-white font-black uppercase tracking-widest border-b-4 border-red-900 hover:bg-red-600 transition-colors text-sm"
          >
            Add Your Rejection
          </Link>
          <Link
            href="/results"
            className="px-8 py-3 bg-gray-800 text-gray-300 font-black uppercase tracking-widest border-b-4 border-gray-900 hover:bg-gray-700 transition-colors text-sm"
          >
            View My Letter
          </Link>
        </div>
      </div>
    </main>
  );
}
