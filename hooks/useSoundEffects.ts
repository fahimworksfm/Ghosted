"use client";

import { useCallback, useState } from "react";

type AudioCtx = AudioContext & { webkitAudioContext?: AudioContext };

function getCtx(): AudioContext | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
    return Ctor ? new Ctor() : null;
  } catch {
    return null;
  }
}

export function useSoundEffects() {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("sfx") !== "false";
  });

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem("sfx", String(next));
      return next;
    });
  }, []);

  // Sad trombone wah-wah descend
  const playTrombone = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    const freqs = [311, 277, 247, 220];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.33;
      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  }, [enabled]);

  // Heavy stamp thud
  const playStamp = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "square";
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(35, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
  }, [enabled]);

  // Obnoxious air horn chord
  const playAirHorn = useCallback(() => {
    if (!enabled) return;
    const ctx = getCtx();
    if (!ctx) return;
    [440, 554, 659].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.14, ctx.currentTime + i * 0.01);
      gain.gain.setValueAtTime(0.14, ctx.currentTime + 0.45);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.65);
      osc.start(ctx.currentTime + i * 0.01);
      osc.stop(ctx.currentTime + 0.7);
    });
  }, [enabled]);

  return { enabled, toggle, playTrombone, playStamp, playAirHorn };
}
