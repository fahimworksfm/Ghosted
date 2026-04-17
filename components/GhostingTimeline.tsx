"use client";

import { useEffect, useState } from "react";
import type { TimelineEvent } from "@/lib/rejection-engine";

interface Props {
  events: TimelineEvent[];
}

export default function GhostingTimeline({ events }: Props) {
  const [visible, setVisible] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    setVisible(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setVisible(i);
      if (i >= events.length) clearInterval(id);
    }, 180);
    return () => clearInterval(id);
  }, [expanded, events.length]);

  return (
    <div className="border-2 border-blue-700 bg-blue-950/40">
      {/* Header / toggle */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between p-4 hover:bg-blue-900/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-blue-400 text-xl">📅</span>
          <div className="text-left">
            <p className="text-blue-200 font-black text-sm uppercase tracking-widest">
              The Ghosting Timeline
            </p>
            <p className="text-blue-400 text-xs">
              A complete reconstruction of the 47-day hiring process
            </p>
          </div>
        </div>
        <span className="text-blue-400 text-xl transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : "none" }}>
          ▼
        </span>
      </button>

      {/* Timeline */}
      {expanded && (
        <div className="px-4 pb-4 space-y-1">
          {events.map((ev, i) => (
            <div
              key={i}
              className={`flex gap-3 items-start transition-all duration-300 ${
                i < visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {/* Spine */}
              <div className="flex flex-col items-center pt-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 flex-shrink-0 ${
                    ev.status === "rejected"
                      ? "bg-red-900 border-red-500 text-red-200"
                      : "bg-blue-900 border-blue-500 text-blue-200"
                  }`}
                >
                  {ev.icon}
                </div>
                {i < events.length - 1 && (
                  <div className="w-px flex-1 min-h-4 bg-blue-800 mt-1" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-3">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-xs font-mono font-bold ${
                      ev.status === "rejected" ? "text-red-400" : "text-blue-500"
                    }`}
                  >
                    Day {ev.day}
                  </span>
                  <span
                    className={`text-sm ${
                      ev.status === "rejected"
                        ? "text-red-300 font-black"
                        : "text-blue-200"
                    }`}
                  >
                    {ev.event}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
