"use client";

import { useEffect, useState } from "react";
import type { RejectionResult } from "@/lib/rejection-engine";

interface Props {
  result: RejectionResult;
  onStampRevealed?: () => void;
}

const TIER_COLORS: Record<string, string> = {
  bronze: "text-amber-700 border-amber-600",
  silver: "text-gray-500 border-gray-400",
  gold: "text-yellow-600 border-yellow-500",
  platinum: "text-purple-600 border-purple-500",
};

export default function RejectionLetter({ result, onStampRevealed }: Props) {
  const [stampVisible, setStampVisible] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setStampVisible(true);
      onStampRevealed?.();
    }, 800);
    return () => clearTimeout(id);
  }, [onStampRevealed]);

  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const tierColor = TIER_COLORS[result.tier] ?? "text-red-500 border-red-500";

  return (
    <div
      className="bg-white border-4 border-gray-400 shadow-2xl p-8 max-w-2xl mx-auto relative overflow-hidden"
      style={{ fontFamily: "'Courier New', Courier, monospace" }}
    >
      {/* Letterhead */}
      <div className="border-b-4 border-double border-gray-400 pb-4 mb-6 text-center">
        <div className="text-2xl font-black tracking-widest text-blue-900 uppercase">
          MegaCorp Industries™
        </div>
        <div className="text-xs text-gray-500 mt-1">
          "People Are Our Most Important Downsizing Opportunity"
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Talent Acquisition Division · Automated Correspondence Unit · Floor B2 (Basement)
        </div>
      </div>

      {/* Date, tier, ref */}
      <div className="flex justify-between items-start text-xs text-gray-500 mb-6">
        <span>{date}</span>
        <div className="text-right space-y-1">
          <div className={`border ${tierColor} px-2 py-0.5 text-xs font-bold uppercase`}>
            {result.tierLabel}
          </div>
          <div>REF: {result.primaryCode}</div>
        </div>
      </div>

      {/* Salutation */}
      <p className="mb-4">Dear Valued Applicant,</p>

      {/* Opening */}
      <p className="mb-4 font-bold">{result.opening}</p>

      {/* Primary rejection reason */}
      <div className="my-4 bg-red-50 border-l-4 border-red-500 p-4">
        <p className="text-red-800 text-sm font-bold mb-1 uppercase tracking-wide">
          Primary Disqualification Flag:
        </p>
        <p className="text-red-700 text-sm">{result.primaryReason}</p>
        <p className="text-red-400 text-xs mt-2 font-mono">Error Code: {result.primaryCode}</p>
      </div>

      {/* Additional reason */}
      <div className="my-4 bg-yellow-50 border-l-4 border-yellow-500 p-4">
        <p className="text-yellow-800 text-sm font-bold mb-1 uppercase tracking-wide">
          Secondary Algorithmic Concern:
        </p>
        <p className="text-yellow-700 text-sm">{result.additionalReason}</p>
      </div>

      {/* Stats */}
      <div className="my-4 bg-gray-100 border border-gray-300 p-3 text-xs font-mono text-gray-600">
        <p className="font-bold text-gray-700 mb-2">SYSTEM ANALYSIS REPORT</p>
        <p>Word Count: {result.stats.wordCount} words</p>
        <p>
          Buzzwords Flagged:{" "}
          {result.stats.buzzwordsFound.length > 0
            ? result.stats.buzzwordsFound.slice(0, 5).join(", ") +
              (result.stats.buzzwordsFound.length > 5
                ? ` (+${result.stats.buzzwordsFound.length - 5} more)`
                : "")
            : "None (this is also a problem)"}
        </p>
        <p>ATS Score: {result.realAnalysis.atsFriendlyScore}/100</p>
        <p>Processing Time: {result.stats.processingTimeMs}ms (your career reviewed in milliseconds)</p>
        <p>Human Involvement: 0.00%</p>
        <p>Regret Level: Simulated · Rejection Tier: {result.tierLabel}</p>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        We wish you the very best in your search and encourage you to apply again in 6 months,
        at which point this role will have been eliminated, reinstated at a lower salary grade,
        and filled by someone who &quot;just felt right.&quot;
      </p>

      {/* Sign off */}
      <div className="mt-6 border-t-2 border-gray-300 pt-4 whitespace-pre-line text-sm text-gray-600">
        {result.signOff}
      </div>

      {/* Animated REJECTED stamp */}
      <div
        className={`absolute bottom-8 right-8 border-4 border-red-500 text-red-500 font-black text-2xl px-4 py-2
                    transition-all duration-500 ${
                      stampVisible
                        ? "opacity-80 rotate-[-8deg] scale-100"
                        : "opacity-0 scale-150"
                    }`}
        style={{ fontFamily: "Arial Black, sans-serif" }}
      >
        REJECTED
      </div>
    </div>
  );
}
