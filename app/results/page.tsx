"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import RejectionLetter from "@/components/RejectionLetter";
import RejectionTierBadge from "@/components/RejectionTierBadge";
import GhostingTimeline from "@/components/GhostingTimeline";
import ScoreCard from "@/components/ScoreCard";
import KeywordAnalyzer from "@/components/KeywordAnalyzer";
import ImprovementTips from "@/components/ImprovementTips";
import CompanyCounter from "@/components/CompanyCounter";
import ShareButtons from "@/components/ShareButtons";
import SoundToggle from "@/components/SoundToggle";
import TalentNetworkModal from "@/components/TalentNetworkModal";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import type { RejectionResult } from "@/lib/rejection-engine";
import type { RealAnalysis } from "@/lib/real-analysis";

// ── fallback result (shown when arriving via shared link with no sessionStorage) ──
function makeDefaultAnalysis(): RealAnalysis {
  return {
    powerVerbsFound: [],
    weakPhrasesFound: [],
    hasQuantifiedResults: false,
    quantifiedCount: 0,
    foundSections: [],
    missingSections: ["experience", "skills", "education", "summary"],
    atsFriendlyScore: 0,
    recommendations: [
      {
        priority: "high",
        category: "structure",
        tip: "Upload your resume to get a real ATS analysis.",
        example: "Drag and drop your PDF or .txt resume on the home page.",
      },
    ],
  };
}

const FALLBACK: RejectionResult = {
  opening:
    "We received thousands of applications for this role, all of which we rejected. Yours, however, was special.",
  primaryReason:
    "Resume flagged: File successfully received. Automatic rejection triggered as per standard operating procedure.",
  primaryCode: "ERR_FILE_RECEIVED",
  additionalReason:
    "Your file size is not a prime number. We only hire candidates whose documents are mathematically elegant.",
  signOff:
    "Best of luck in your future endeavors (elsewhere),\nThe Talent Acquisition Team\nP.S. Please do not reply to this email. We have already forgotten you.",
  tier: "silver",
  tierLabel: "Silver Rejection",
  tierDescription: "Honorable mention in mediocrity. You showed potential for being passed over.",
  improvementTips: [
    "Upload your resume for personalised improvement tips. (Note: They will be simultaneously correct and useless.)",
  ],
  fakeScores: [
    { name: "Nepotism Potential", score: 1, verdict: "None detected. Red flag." },
    { name: "Aura Score™", score: 2, verdict: "Aura failed to load." },
    { name: "Vibes-Based Culture Fit", score: 1, verdict: "Wrong vibe." },
    { name: "Overqualification Risk", score: 9, verdict: "Critically overqualified." },
    { name: "Salary Negotiation Aggression Risk", score: 8, verdict: "Knows their worth. Unacceptable." },
    { name: "Unpaid Overtime Willingness", score: 1, verdict: "Believes in 40-hr weeks." },
    { name: "LinkedIn Photo Energy", score: 2, verdict: "Could not assess charisma." },
    { name: "References Quality (Unverified)", score: 1, verdict: "Nobody called them. Nobody ever does." },
  ],
  ghostingTimeline: [
    { day: 1, event: "Application submitted", icon: "📨", status: "complete" },
    { day: 47, event: "This email.", icon: "💀", status: "rejected" },
  ],
  realAnalysis: makeDefaultAnalysis(),
  stats: { wordCount: 0, buzzwordsFound: [], processingTimeMs: 3 },
};

// ── URL decode helper ─────────────────────────────────────────────────────────
function decodeFromUrl(encoded: string): Partial<RejectionResult> | null {
  try {
    const json = decodeURIComponent(
      atob(encoded.replace(/-/g, "+").replace(/_/g, "/"))
    );
    const p = JSON.parse(json);
    return {
      opening: p.o,
      primaryReason: p.p,
      primaryCode: p.c,
      additionalReason: p.a,
      signOff: p.s,
      tier: p.t,
      tierLabel: p.tl,
      tierDescription: p.td,
      stats: { wordCount: p.w, buzzwordsFound: p.b ?? [], processingTimeMs: 0 },
    };
  } catch {
    return null;
  }
}

type ActiveTab = "scorecard" | "analysis" | "tips";

function ResultsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [result, setResult] = useState<RejectionResult | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>("analysis");
  const { enabled, toggle, playTrombone, playStamp, playAirHorn } = useSoundEffects();

  useEffect(() => {
    // Try URL param first (shared link), then sessionStorage
    const urlData = params.get("d");
    if (urlData) {
      const decoded = decodeFromUrl(urlData);
      if (decoded) {
        setResult({ ...FALLBACK, ...decoded });
        setCompanyName("");
        return;
      }
    }

    try {
      const stored = sessionStorage.getItem("rejectionResult");
      const storedCompany = sessionStorage.getItem("companyName") ?? "";
      setResult(stored ? (JSON.parse(stored) as RejectionResult) : FALLBACK);
      setCompanyName(storedCompany);
    } catch {
      setResult(FALLBACK);
    }
  }, [params]);

  // Play trombone when result loads
  useEffect(() => {
    if (!result) return;
    const id = setTimeout(() => playTrombone(), 600);
    return () => clearTimeout(id);
  }, [result, playTrombone]);

  // Show modal 1.2s after result appears
  useEffect(() => {
    if (!result) return;
    const id = setTimeout(() => {
      setShowModal(true);
      playAirHorn();
    }, 1200);
    return () => clearTimeout(id);
  }, [result, playAirHorn]);

  const handleStampRevealed = useCallback(() => {
    playStamp();
  }, [playStamp]);

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 font-mono animate-pulse">Loading rejection data...</p>
      </div>
    );
  }

  const tabs: Array<{ id: ActiveTab; label: string; icon: string }> = [
    { id: "analysis", label: "Real ATS Analysis", icon: "⚡" },
    { id: "scorecard", label: "ATS Score Card", icon: "📊" },
    { id: "tips", label: "Improvement Tips", icon: "💡" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-red-900 border-b-4 border-red-500 py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-start justify-between gap-4">
          <div>
            <p className="text-red-300 text-xs uppercase tracking-[0.4em] font-bold mb-1">
              Application Decision — Final
            </p>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
              <span className="text-white">We Regret</span>{" "}
              <span className="text-yellow-400">to Inform You</span>
            </h1>
          </div>
          <SoundToggle enabled={enabled} onToggle={toggle} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Tier badge */}
        <RejectionTierBadge
          tier={result.tier}
          label={result.tierLabel}
          description={result.tierDescription}
        />

        {/* Company counter */}
        <CompanyCounter companyName={companyName} />

        {/* Ghosting timeline */}
        <GhostingTimeline events={result.ghostingTimeline} />

        {/* Rejection letter */}
        <RejectionLetter result={result} onStampRevealed={handleStampRevealed} />

        {/* Analysis tabs */}
        <div className="border-2 border-gray-700 bg-gray-900">
          {/* Tab bar */}
          <div className="flex border-b-2 border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-2 py-3 text-xs font-black uppercase tracking-wide transition-colors flex items-center justify-center gap-1 ${
                  activeTab === tab.id
                    ? "bg-gray-800 text-white border-b-2 border-yellow-400 -mb-px"
                    : "text-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-5">
            {activeTab === "analysis" && (
              <KeywordAnalyzer analysis={result.realAnalysis} />
            )}
            {activeTab === "scorecard" && (
              <ScoreCard scores={result.fakeScores} />
            )}
            {activeTab === "tips" && (
              <ImprovementTips tips={result.improvementTips} />
            )}
          </div>
        </div>

        {/* Share / download */}
        <ShareButtons result={result} />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
          <button
            onClick={() => router.push("/")}
            className="flex-1 px-6 py-3 bg-blue-700 text-white font-black uppercase tracking-widest border-b-4 border-blue-900 hover:bg-blue-600 transition-colors text-sm"
          >
            Apply Again (Why Not)
          </button>
          <button
            onClick={() => router.push("/hall-of-fame")}
            className="flex-1 px-6 py-3 bg-purple-800 text-white font-black uppercase tracking-widest border-b-4 border-purple-900 hover:bg-purple-700 transition-colors text-sm"
          >
            🏆 Hall of Shame
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs font-mono">
          This rejection was generated without human involvement.
          No feelings were considered. No exceptions will be made.
        </p>
      </div>

      {/* Talent Network modal */}
      {showModal && !modalDismissed && (
        <TalentNetworkModal onDismiss={() => setModalDismissed(true)} />
      )}
    </main>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400 font-mono animate-pulse">Loading rejection data...</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
