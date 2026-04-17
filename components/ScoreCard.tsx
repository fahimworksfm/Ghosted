"use client";

import { useEffect, useState } from "react";
import type { FakeScore } from "@/lib/rejection-engine";

interface Props {
  scores: FakeScore[];
}

const COLOR_MAP = [
  { bar: "bg-red-500", text: "text-red-400" },
  { bar: "bg-orange-500", text: "text-orange-400" },
  { bar: "bg-yellow-500", text: "text-yellow-400" },
  { bar: "bg-green-500", text: "text-green-400" },
];

function scoreColor(score: number, name: string) {
  // "Bad" metrics (high = bad): show high scores in red
  const badHigh = name.toLowerCase().includes("risk") ||
    name.toLowerCase().includes("overquali") ||
    name.toLowerCase().includes("aggression");
  const normalised = badHigh ? score : 10 - score;
  if (normalised >= 7) return COLOR_MAP[0];
  if (normalised >= 5) return COLOR_MAP[1];
  if (normalised >= 3) return COLOR_MAP[2];
  return COLOR_MAP[3];
}

export default function ScoreCard({ scores }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setAnimated(true), 150);
    return () => clearTimeout(id);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-yellow-300 border-2 border-yellow-600 p-2 text-center">
        <p className="text-yellow-900 font-black text-xs uppercase tracking-widest">
          ⚠ PROPRIETARY EVALUATION METRICS ⚠ PATENT PENDING
        </p>
      </div>

      <div className="space-y-3">
        {scores.map((s) => {
          const { bar, text } = scoreColor(s.score, s.name);
          return (
            <div key={s.name} className="space-y-1">
              <div className="flex justify-between items-baseline">
                <span className="text-gray-300 text-xs font-mono font-bold uppercase tracking-wide">
                  {s.name}
                </span>
                <span className={`text-xs font-black font-mono ${text}`}>
                  {s.score}/10
                </span>
              </div>
              {/* Bar track */}
              <div className="w-full h-4 bg-gray-800 border border-gray-700 overflow-hidden relative">
                <div
                  className={`h-full ${bar} transition-all duration-700 ease-out`}
                  style={{ width: animated ? `${s.score * 10}%` : "0%" }}
                />
                {/* Scanline */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              </div>
              <p className="text-gray-500 text-xs italic font-mono">{s.verdict}</p>
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-600 text-xs font-mono border-t border-gray-800 pt-3">
        These metrics are proprietary, legally binding, and completely made up.
        <br />
        They are also the only metrics that matter.
      </p>
    </div>
  );
}
