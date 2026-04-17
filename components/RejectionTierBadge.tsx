"use client";

import { useEffect, useRef } from "react";
import type { RejectionTier } from "@/lib/rejection-engine";

interface Props {
  tier: RejectionTier;
  label: string;
  description: string;
}

const TIER_STYLES: Record<RejectionTier, { ring: string; bg: string; text: string; icon: string; glow: string }> = {
  bronze: {
    ring: "border-amber-600",
    bg: "bg-amber-950",
    text: "text-amber-400",
    icon: "🥉",
    glow: "shadow-[0_0_30px_rgba(180,83,9,0.5)]",
  },
  silver: {
    ring: "border-gray-400",
    bg: "bg-gray-900",
    text: "text-gray-300",
    icon: "🥈",
    glow: "shadow-[0_0_30px_rgba(156,163,175,0.4)]",
  },
  gold: {
    ring: "border-yellow-400",
    bg: "bg-yellow-950",
    text: "text-yellow-300",
    icon: "🥇",
    glow: "shadow-[0_0_30px_rgba(250,204,21,0.5)]",
  },
  platinum: {
    ring: "border-purple-400",
    bg: "bg-purple-950",
    text: "text-purple-300",
    icon: "💎",
    glow: "shadow-[0_0_40px_rgba(168,85,247,0.6)]",
  },
};

export default function RejectionTierBadge({ tier, label, description }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Confetti burst for platinum
  useEffect(() => {
    if (tier !== "platinum") return;
    let active = true;

    async function burst() {
      const mod = await import("canvas-confetti");
      const confetti = mod.default;
      if (!active) return;
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ["#a855f7", "#ec4899", "#6366f1", "#f59e0b"] });
      setTimeout(() => {
        if (!active) return;
        confetti({ particleCount: 60, spread: 60, origin: { x: 0.1, y: 0.5 }, angle: 60 });
        confetti({ particleCount: 60, spread: 60, origin: { x: 0.9, y: 0.5 }, angle: 120 });
      }, 400);
    }

    burst();
    return () => { active = false; };
  }, [tier]);

  const s = TIER_STYLES[tier];

  return (
    <div className={`border-4 ${s.ring} ${s.bg} ${s.glow} p-6 text-center relative overflow-hidden`}>
      {tier === "platinum" && (
        <div className="absolute inset-0 pointer-events-none animate-pulse opacity-20 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600" />
      )}

      <div className="relative">
        <div className="text-5xl mb-2">{s.icon}</div>
        <div className={`text-xs uppercase tracking-[0.4em] font-bold ${s.text} mb-1`}>
          Application Evaluation Complete
        </div>
        <div className={`text-2xl font-black uppercase tracking-wide ${s.text}`}>{label}</div>
        <div className={`text-sm mt-2 ${s.text} opacity-80 italic`}>{description}</div>

        {tier === "platinum" && (
          <div className="mt-3 inline-block bg-purple-600 px-3 py-1 text-white text-xs font-black uppercase tracking-widest animate-bounce">
            ✨ CONGRATULATIONS ON YOUR PREMIUM REJECTION ✨
          </div>
        )}
      </div>
    </div>
  );
}
