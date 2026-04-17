"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RejectionLetter from "@/components/RejectionLetter";
import TalentNetworkModal from "@/components/TalentNetworkModal";
import type { RejectionResult } from "@/lib/rejection-engine";

const FALLBACK_RESULT: RejectionResult = {
  opening: "We received thousands of applications for this role, all of which we rejected. Yours, however, was special.",
  primaryReason: "Resume flagged: File successfully received. Automatic rejection triggered as per our standard operating procedure.",
  primaryCode: "ERR_FILE_RECEIVED",
  additionalReason: "Your file size is not a prime number. We only hire candidates whose documents are mathematically elegant.",
  signOff: "Best of luck in your future endeavors (elsewhere),\nThe Talent Acquisition Team\nP.S. Please do not reply to this email. We have already forgotten you.",
  stats: { wordCount: 0, buzzwordsFound: [], processingTimeMs: 3 },
};

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<RejectionResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalDismissed, setModalDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("rejectionResult");
      setResult(stored ? JSON.parse(stored) : FALLBACK_RESULT);
    } catch {
      setResult(FALLBACK_RESULT);
    }

    // Show modal after a beat so the letter renders first
    const id = setTimeout(() => setShowModal(true), 800);
    return () => clearTimeout(id);
  }, []);

  if (!result) return null;

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Results header */}
      <div className="bg-red-800 border-b-4 border-red-500 py-6 px-4 text-center">
        <p className="text-red-200 text-xs uppercase tracking-[0.4em] font-bold mb-1">
          Application Decision
        </p>
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
          <span className="text-white">We Regret</span>{" "}
          <span className="text-yellow-400">to Inform You</span>
        </h1>
        <p className="text-red-300 text-sm mt-2">
          Your application has been carefully processed and unceremoniously rejected.
        </p>
      </div>

      {/* Letter area */}
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <div
          className="relative"
          style={{ filter: modalDismissed ? "none" : "blur(0px)" }}
        >
          <RejectionLetter result={result} />
        </div>

        {/* Action strip */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="px-8 py-3 bg-blue-700 text-white font-black uppercase tracking-widest border-b-4 border-blue-900
                       hover:bg-blue-600 transition-colors text-sm"
          >
            Apply Again (Why Not)
          </button>
          <button
            onClick={() => window.print()}
            className="px-8 py-3 bg-gray-700 text-white font-black uppercase tracking-widest border-b-4 border-gray-900
                       hover:bg-gray-600 transition-colors text-sm"
          >
            Print Rejection Letter
          </button>
        </div>

        <p className="text-center text-gray-600 text-xs font-mono">
          This rejection letter was generated entirely without human involvement.
          <br />
          No feelings were considered. No exceptions will be made.
        </p>
      </div>

      {/* Annoying modal */}
      {showModal && !modalDismissed && (
        <TalentNetworkModal onDismiss={() => setModalDismissed(true)} />
      )}
    </main>
  );
}
