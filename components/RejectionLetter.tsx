"use client";

import type { RejectionResult } from "@/lib/rejection-engine";

interface Props {
  result: RejectionResult;
}

export default function RejectionLetter({ result }: Props) {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="bg-white border-4 border-gray-400 shadow-2xl p-8 max-w-2xl mx-auto"
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

      {/* Date & ref */}
      <div className="flex justify-between text-xs text-gray-500 mb-6">
        <span>{date}</span>
        <span>REF: {result.primaryCode}</span>
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
        <p>Word Count Detected: {result.stats.wordCount} words</p>
        <p>
          Buzzwords Flagged:{" "}
          {result.stats.buzzwordsFound.length > 0
            ? result.stats.buzzwordsFound.slice(0, 5).join(", ") +
              (result.stats.buzzwordsFound.length > 5
                ? ` (+${result.stats.buzzwordsFound.length - 5} more)`
                : "")
            : "None (this is also a problem)"}
        </p>
        <p>Processing Time: {result.stats.processingTimeMs}ms (your life reviewed in milliseconds)</p>
        <p>Human Involvement: 0%</p>
        <p>Regret Level: Simulated</p>
      </div>

      <p className="mt-4 text-sm text-gray-700">
        We wish you the very best in your search and encourage you to apply again in 6 months,
        at which point this role will have been eliminated, reinstated at a lower salary grade,
        and filled by someone who "just felt right."
      </p>

      {/* Sign off */}
      <div className="mt-6 border-t-2 border-gray-300 pt-4 whitespace-pre-line text-sm text-gray-600">
        {result.signOff}
      </div>

      {/* Footer stamp */}
      <div className="mt-8 flex justify-end">
        <div
          className="border-4 border-red-500 text-red-500 font-black text-2xl px-4 py-2 rotate-[-8deg] opacity-80"
          style={{ fontFamily: "Arial Black, sans-serif" }}
        >
          REJECTED
        </div>
      </div>
    </div>
  );
}
