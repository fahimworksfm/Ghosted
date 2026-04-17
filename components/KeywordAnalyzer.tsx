"use client";

import type { RealAnalysis } from "@/lib/real-analysis";

interface Props {
  analysis: RealAnalysis;
}

const PRIORITY_STYLES = {
  high: { dot: "bg-red-500", label: "text-red-400", badge: "bg-red-900/50 border-red-600" },
  medium: { dot: "bg-yellow-500", label: "text-yellow-400", badge: "bg-yellow-900/30 border-yellow-700" },
  low: { dot: "bg-green-500", label: "text-green-400", badge: "bg-green-900/20 border-green-800" },
};

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 45 ? "bg-yellow-500" : "bg-red-500";
  const label =
    score >= 70 ? "ATS-Friendly" : score >= 45 ? "Needs Work" : "High Risk";

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400 font-mono uppercase tracking-wide">
          ATS Compatibility Score
        </span>
        <span
          className={`font-black font-mono ${
            score >= 70 ? "text-green-400" : score >= 45 ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {score}/100 — {label}
        </span>
      </div>
      <div className="w-full h-5 bg-gray-800 border border-gray-700 relative overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
      </div>
    </div>
  );
}

export default function KeywordAnalyzer({ analysis }: Props) {
  return (
    <div className="space-y-5">
      {/* System override banner */}
      <div className="bg-green-900 border-2 border-green-400 p-3 text-center">
        <p className="text-green-200 font-black text-xs uppercase tracking-widest">
          ⚡ SYSTEM OVERRIDE — GENUINE ATS ANALYSIS ⚡
        </p>
        <p className="text-green-400 text-xs mt-1">
          This section bypassed the satire engine. The data below is real and actionable.
        </p>
      </div>

      {/* Score meter */}
      <ScoreMeter score={analysis.atsFriendlyScore} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 border border-gray-700 p-3 text-center">
          <div
            className={`text-2xl font-black ${
              analysis.powerVerbsFound.length >= 5
                ? "text-green-400"
                : analysis.powerVerbsFound.length >= 2
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {analysis.powerVerbsFound.length}
          </div>
          <div className="text-gray-400 text-xs font-mono uppercase mt-1">
            Action Verbs
          </div>
          {analysis.powerVerbsFound.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {analysis.powerVerbsFound.slice(0, 4).map((v) => (
                <span key={v} className="bg-green-900/40 text-green-300 text-xs px-1 border border-green-800 font-mono">
                  {v}
                </span>
              ))}
              {analysis.powerVerbsFound.length > 4 && (
                <span className="text-gray-500 text-xs font-mono">
                  +{analysis.powerVerbsFound.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3 text-center">
          <div
            className={`text-2xl font-black ${
              analysis.quantifiedCount >= 3
                ? "text-green-400"
                : analysis.quantifiedCount >= 1
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {analysis.quantifiedCount}
          </div>
          <div className="text-gray-400 text-xs font-mono uppercase mt-1">
            Quantified Results
          </div>
          <div className="text-gray-600 text-xs mt-1">
            {analysis.hasQuantifiedResults ? "✓ metrics detected" : "⚠ no numbers found"}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3 text-center">
          <div
            className={`text-2xl font-black ${
              analysis.weakPhrasesFound.length === 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {analysis.weakPhrasesFound.length}
          </div>
          <div className="text-gray-400 text-xs font-mono uppercase mt-1">
            Weak Phrases
          </div>
          {analysis.weakPhrasesFound.length > 0 && (
            <div className="mt-1 text-red-400 text-xs font-mono">
              "{analysis.weakPhrasesFound[0]}"
            </div>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-700 p-3 text-center">
          <div
            className={`text-2xl font-black ${
              analysis.foundSections.length >= 3
                ? "text-green-400"
                : analysis.foundSections.length >= 2
                ? "text-yellow-400"
                : "text-red-400"
            }`}
          >
            {analysis.foundSections.length}
            <span className="text-sm text-gray-500">/7</span>
          </div>
          <div className="text-gray-400 text-xs font-mono uppercase mt-1">
            ATS Sections
          </div>
          <div className="text-gray-600 text-xs mt-1">
            {analysis.foundSections.slice(0, 3).join(", ")}
          </div>
        </div>
      </div>

      {/* Missing sections */}
      {analysis.missingSections.length > 0 && (
        <div className="bg-red-950/50 border border-red-800 p-3">
          <p className="text-red-400 text-xs font-bold uppercase mb-1">
            Missing ATS-Critical Sections
          </p>
          <div className="flex gap-2 flex-wrap">
            {analysis.missingSections.map((s) => (
              <span key={s} className="bg-red-900/50 text-red-300 text-xs px-2 py-1 border border-red-700 font-mono">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="space-y-2">
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">
          Actionable Recommendations
        </p>
        {analysis.recommendations.map((r, i) => {
          const st = PRIORITY_STYLES[r.priority];
          return (
            <div key={i} className={`border ${st.badge} p-3 space-y-1`}>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
                <span className={`text-xs font-bold uppercase ${st.label}`}>
                  {r.priority} priority · {r.category}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{r.tip}</p>
              <p className="text-gray-500 text-xs font-mono italic">↳ {r.example}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
