"use client";

import { useRef, useState, useCallback } from "react";

interface Props {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export default function RunawayButton({ onClick, disabled, label = "SUBMIT APPLICATION" }: Props) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [runawayStyle, setRunawayStyle] = useState<React.CSSProperties>({});
  const [isRunning, setIsRunning] = useState(false);
  const [hasFled, setHasFled] = useState(false);
  const flightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runCount = useRef(0);

  const handleMouseEnter = useCallback(() => {
    if (disabled || hasFled) return;

    runCount.current += 1;
    setIsRunning(true);

    // After 2 seconds of running away, surrender and allow click
    if (flightTimeoutRef.current) clearTimeout(flightTimeoutRef.current);
    flightTimeoutRef.current = setTimeout(() => {
      setIsRunning(false);
      setHasFled(true);
      setRunawayStyle({});
    }, 2000);
  }, [disabled, hasFled]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isRunning || disabled) return;
      const btn = btnRef.current;
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      // Vector away from cursor
      const dx = btnCenterX - e.clientX;
      const dy = btnCenterY - e.clientY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;

      const fleeX = (dx / dist) * 120;
      const fleeY = (dy / dist) * 80;

      // Clamp to viewport
      const newX = Math.max(-200, Math.min(200, fleeX));
      const newY = Math.max(-150, Math.min(150, fleeY));

      setRunawayStyle({
        transform: `translate(${newX}px, ${newY}px)`,
        transition: "transform 0.15s ease-out",
      });
    },
    [isRunning, disabled]
  );

  return (
    <div
      className="relative flex justify-center items-center h-20 overflow-visible"
      onMouseMove={handleMouseMove}
    >
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        style={runawayStyle}
        className={`
          relative px-10 py-4 font-black text-lg uppercase tracking-widest border-4 transition-colors
          ${hasFled
            ? "bg-red-600 border-red-900 text-white cursor-pointer hover:bg-red-700 shadow-[0_0_20px_#ef4444]"
            : isRunning
            ? "bg-yellow-400 border-yellow-700 text-yellow-900 cursor-none"
            : "bg-red-600 border-red-900 text-white cursor-pointer hover:bg-red-500"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {isRunning ? "STOP CHASING ME" : hasFled ? "FINE. SUBMIT." : label}
      </button>
      {isRunning && (
        <p className="absolute bottom-0 text-xs text-yellow-400 font-bold animate-pulse">
          Please stop. I am just a button.
        </p>
      )}
    </div>
  );
}
