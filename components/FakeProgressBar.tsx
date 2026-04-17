"use client";

import { useEffect, useState } from "react";

interface Props {
  onComplete: () => void;
}

type Phase =
  | { name: "racing"; progress: number }
  | { name: "stalled" }
  | { name: "warning" }
  | { name: "finishing"; progress: number }
  | { name: "done" };

const MESSAGES = [
  "Uploading resume...",
  "Parsing your life's work...",
  "Cross-referencing with LinkedIn (we already looked)...",
  "Calculating culture fit score...",
  "Synergizing buzzword matrix...",
  "Consulting Magic 8-Ball...",
  "Determining how to ignore your qualifications...",
  "Preparing personalized rejection...",
];

export default function FakeProgressBar({ onComplete }: Props) {
  const [phase, setPhase] = useState<Phase>({ name: "racing", progress: 0 });
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    let rafId: number;
    let startTime: number;

    function race(ts: number) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      // Accelerate to 99% over ~1.8s with easing
      const raw = Math.min(99, (elapsed / 1800) * 100);
      const eased = raw < 99 ? raw * (1 - raw / 300) + raw * 0.01 : 99;
      const progress = Math.min(99, Math.round(eased));

      setPhase({ name: "racing", progress });

      if (progress < 99) {
        rafId = requestAnimationFrame(race);
      } else {
        // Stall at 99%
        setTimeout(() => setPhase({ name: "stalled" }), 100);
      }
    }

    rafId = requestAnimationFrame(race);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Rotate loading messages
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIdx((i) => (i + 1) % MESSAGES.length);
    }, 700);
    return () => clearInterval(id);
  }, []);

  // Stalled phase — wait 5s then show warning
  useEffect(() => {
    if (phase.name !== "stalled") return;
    const id = setTimeout(() => setPhase({ name: "warning" }), 5000);
    return () => clearTimeout(id);
  }, [phase.name]);

  // Warning phase — show for 1.5s then finish
  useEffect(() => {
    if (phase.name !== "warning") return;
    const id = setTimeout(() => setPhase({ name: "finishing", progress: 99 }), 1500);
    return () => clearTimeout(id);
  }, [phase.name]);

  // Finishing phase — race to 100
  useEffect(() => {
    if (phase.name !== "finishing") return;
    let p = 99;
    const id = setInterval(() => {
      p += 1;
      setPhase({ name: "finishing", progress: p });
      if (p >= 100) {
        clearInterval(id);
        setTimeout(() => {
          setPhase({ name: "done" });
          onComplete();
        }, 400);
      }
    }, 80);
    return () => clearInterval(id);
  }, [phase.name, onComplete]);

  const progress =
    phase.name === "racing" ? phase.progress
    : phase.name === "stalled" ? 99
    : phase.name === "warning" ? 99
    : phase.name === "finishing" ? phase.progress
    : 100;

  const isWarning = phase.name === "warning";
  const isStalled = phase.name === "stalled";

  return (
    <div className="space-y-4">
      <div className="bg-blue-900 border-4 border-blue-400 p-6 font-mono">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-blue-200 uppercase tracking-widest text-xs">
            {isWarning ? (
              <span className="text-red-400 animate-pulse font-black">
                ⚠ FORMATTING LOST ⚠
              </span>
            ) : isStalled ? (
              <span className="text-yellow-300">Processing... (please wait)</span>
            ) : (
              <span className="text-green-400">{MESSAGES[msgIdx]}</span>
            )}
          </span>
          <span
            className={`font-black text-lg ${
              progress === 99 && !isWarning ? "text-yellow-300 animate-pulse" : "text-white"
            }`}
          >
            {progress}%
          </span>
        </div>

        {/* Progress bar track */}
        <div className="w-full h-8 bg-blue-950 border-2 border-blue-500 relative overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ${
              isWarning
                ? "bg-red-600 animate-pulse"
                : progress < 99
                ? "bg-green-400"
                : "bg-yellow-400"
            }`}
            style={{ width: `${progress}%` }}
          />
          {/* Scanline shimmer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {isStalled && (
          <p className="text-yellow-300 text-xs mt-2 animate-pulse text-center">
            Our systems are "thinking." Please do not close this tab.
            We will notice. We are always watching.
          </p>
        )}

        {isWarning && (
          <div className="mt-3 bg-red-900 border-2 border-red-400 p-2 text-center">
            <p className="text-red-200 font-black text-sm animate-pulse">
              ⚠ CRITICAL ERROR: FORMATTING LOST ⚠
            </p>
            <p className="text-red-300 text-xs mt-1">
              Do not panic. Your data is fine. We just want you to feel uncertain.
            </p>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 font-mono">
          Application ID: ATS-{Math.random().toString(36).slice(2, 10).toUpperCase()}-VOID
        </p>
      </div>
    </div>
  );
}
