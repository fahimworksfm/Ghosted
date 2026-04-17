"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Props {
  onDismiss: () => void;
}

export default function TalentNetworkModal({ onDismiss }: Props) {
  const [closeAttempts, setCloseAttempts] = useState(0);
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [captchaError, setCaptchaError] = useState(false);
  const [email, setEmail] = useState("");
  const [desperate, setDesperate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // The actual close — only allowed after 4 failed attempts + captcha
  const canClose = closeAttempts >= 4 && showCaptcha;

  const handleCloseAttempt = useCallback(() => {
    if (closeAttempts < 3) {
      setCloseAttempts((n) => n + 1);
      setDesperate(closeAttempts >= 1);
      // Move the X button to a random position
      const x = (Math.random() - 0.5) * 300;
      const y = (Math.random() - 0.5) * 200;
      setBtnPos({ x, y });
      return;
    }
    if (closeAttempts === 3) {
      setCloseAttempts(4);
      setShowCaptcha(true);
      return;
    }
    // Verify captcha — the "correct" answer is intentionally absurd
    if (captchaAnswer.toLowerCase().trim() === "no") {
      onDismiss();
    } else {
      setCaptchaError(true);
    }
  }, [closeAttempts, captchaAnswer, onDismiss]);

  // Escalating guilt messages
  const guiltMessages = [
    "Are you sure? We have SO many opportunities just for you.",
    "Please don't go. Our algorithm worked very hard on this.",
    "This is your last chance to join a community of rejected applicants.",
    "You're breaking our KPIs. Do you want that on your conscience?",
  ];

  useEffect(() => {
    // Prevent scrolling while modal is open
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={handleCloseAttempt}
      />

      {/* Modal box */}
      <div
        ref={containerRef}
        className="relative z-10 bg-white border-8 border-blue-600 shadow-[0_0_60px_rgba(0,0,255,0.5)] w-full max-w-lg mx-4 overflow-hidden"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* Header bar */}
        <div className="bg-blue-700 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-yellow-300 text-xl">★</span>
            <span className="text-white font-black text-sm uppercase tracking-widest">
              Join Our Talent Network!
            </span>
            <span className="text-yellow-300 text-xl">★</span>
          </div>

          {/* Runaway close button */}
          <button
            onClick={handleCloseAttempt}
            style={{
              transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
              transition: "transform 0.2s ease-out",
            }}
            className="text-white hover:text-red-300 font-black text-xl w-7 h-7 flex items-center justify-center
                       border-2 border-white/40 hover:border-red-300 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {closeAttempts === 0 && (
            <>
              <div className="bg-yellow-300 border-2 border-yellow-600 p-3 text-center">
                <p className="font-black text-yellow-900 uppercase text-sm">
                  🎉 CONGRATULATIONS ON YOUR REJECTION! 🎉
                </p>
              </div>
              <p className="text-gray-700 text-sm">
                While we cannot offer you employment, dignity, or closure —
                we <em>can</em> offer you the opportunity to receive{" "}
                <strong>even more rejection emails</strong> directly to your inbox!
              </p>
              <p className="text-gray-600 text-sm">
                Join our Talent Network™ and be the first to be automatically
                disqualified from future opportunities.
              </p>
            </>
          )}

          {closeAttempts > 0 && closeAttempts < 4 && (
            <div className="bg-red-50 border-2 border-red-400 p-4 text-center">
              <p className="text-red-700 font-bold text-sm">
                {guiltMessages[Math.min(closeAttempts - 1, guiltMessages.length - 1)]}
              </p>
              {desperate && (
                <p className="text-red-500 text-xs mt-2 italic">
                  (The close button has been relocated for your protection.)
                </p>
              )}
            </div>
          )}

          {!showCaptcha && (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide">
                  Email Address (will be sold to 847 partners)
                </label>
                <input
                  type="email"
                  placeholder="your@soul.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-2 border-blue-400 p-2 text-sm focus:outline-none focus:border-blue-700"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-blue-800 uppercase tracking-wide">
                  Upload Updated Resume (we will also reject this one)
                </label>
                <div className="border-2 border-dashed border-blue-400 p-4 text-center text-sm text-gray-500">
                  Drag file here or{" "}
                  <span className="text-blue-600 underline cursor-pointer">browse</span>
                  <br />
                  <span className="text-xs">Accepted: .pdf, .docx, .png, .jpg, .hope</span>
                </div>
              </div>

              <button
                className="w-full bg-blue-700 text-white font-black py-3 uppercase tracking-widest
                           hover:bg-blue-600 transition-colors text-sm border-b-4 border-blue-900 active:border-b-0"
              >
                YES! Sign Me Up for More Rejection!
              </button>

              <p className="text-center text-xs text-gray-400">
                By clicking above you agree to our{" "}
                <span className="underline cursor-pointer text-blue-400">
                  Terms of Emotional Distress
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer text-blue-400">
                  Privacy Policy (lol)
                </span>
                .
              </p>
            </>
          )}

          {showCaptcha && (
            <div className="space-y-4">
              <div className="bg-gray-100 border-2 border-gray-400 p-4">
                <p className="text-xs font-bold text-gray-700 uppercase mb-2">
                  Security Verification Required
                </p>
                <p className="text-sm text-gray-700 mb-3">
                  To confirm you are a human who has suffered enough,
                  please answer the following question:
                </p>
                <div className="bg-white border border-gray-300 p-3 font-mono text-sm text-center mb-3">
                  Is this job application process ethical?
                </div>
                <input
                  type="text"
                  placeholder='Type "no" to proceed'
                  value={captchaAnswer}
                  onChange={(e) => { setCaptchaAnswer(e.target.value); setCaptchaError(false); }}
                  className="w-full border-2 border-gray-400 p-2 text-sm focus:outline-none focus:border-blue-500"
                />
                {captchaError && (
                  <p className="text-red-600 text-xs mt-1">
                    Incorrect. The answer is "no." We find your optimism concerning.
                  </p>
                )}
              </div>

              <button
                onClick={handleCloseAttempt}
                className="w-full bg-gray-700 text-white py-2 text-sm font-bold uppercase hover:bg-gray-600"
              >
                Submit & Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
