"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Questionnaire from "@/components/Questionnaire";
import RunawayButton from "@/components/RunawayButton";
import FakeProgressBar from "@/components/FakeProgressBar";

type Stage = "form" | "loading";

export default function HomePage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("form");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allAnswered =
    Object.keys(answers).length === 3 &&
    Object.values(answers).every(Boolean);

  const handleSubmit = useCallback(async () => {
    if (!allAnswered) {
      setSubmitError(
        "You must answer all mandatory questions. All of them. Even the bad ones."
      );
      return;
    }
    setSubmitError(null);
    setStage("loading");

    const formData = new FormData();
    if (file) formData.append("resume", file);

    try {
      const res = await fetch("/api/evaluate", { method: "POST", body: formData });
      const data = await res.json();
      if (data.result) {
        sessionStorage.setItem("rejectionResult", JSON.stringify(data.result));
      }
    } catch {
      // Always proceed to rejection regardless of network issues
    }
  }, [allAnswered, file]);

  const handleProgressComplete = useCallback(() => {
    router.push("/results");
  }, [router]);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  if (stage === "loading") {
    return (
      <main className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center">
            <h2 className="text-yellow-400 font-black text-2xl uppercase tracking-widest animate-pulse">
              PROCESSING YOUR APPLICATION
            </h2>
            <p className="text-gray-400 text-sm mt-2 font-mono">
              Please do not refresh. We are judging you.
            </p>
          </div>
          <FakeProgressBar onComplete={handleProgressComplete} />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* Hero / Header */}
      <div className="bg-blue-900 border-b-4 border-yellow-400 px-6 py-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-16 h-16 bg-red-600 flex items-center justify-center text-white font-black text-xs text-center leading-tight p-1 animate-pulse">
          NOW HIRING
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 flex items-center justify-center text-white font-black text-xs text-center leading-tight p-1 animate-pulse">
          APPLY TODAY
        </div>

        <div className="mt-4">
          <p className="text-yellow-400 text-xs uppercase tracking-[0.3em] font-bold mb-2">
            MegaCorp Industries™ Presents
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
            <span className="text-white">APPLY</span>
            <span className="text-red-500">NOW</span>
          </h1>
          <p className="text-blue-300 text-sm mt-2 max-w-xl mx-auto">
            Our state-of-the-art Applicant Tracking System evaluates every resume
            with the care and precision of a server that has never once read a resume.
          </p>
          <div className="mt-3 inline-block bg-red-600 px-4 py-1 text-white text-xs font-black uppercase tracking-widest animate-bounce">
            ⚡ INSTANT DECISIONS ⚡
          </div>
        </div>
      </div>

      {/* Scrolling warning ticker */}
      <div className="bg-yellow-400 border-y-4 border-yellow-600 py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="text-yellow-900 font-black text-sm uppercase tracking-widest px-8">
            ⚠ WARNING: This application is evaluated by a system that does not care about you ⚠
            &nbsp;&nbsp;&nbsp; ⚠ All applications are final. There is no appeals process. ⚠
            &nbsp;&nbsp;&nbsp; ⚠ By applying you confirm this is worth your time ⚠
            &nbsp;&nbsp;&nbsp; ⚠ This role was filled internally but we are still collecting data ⚠
            &nbsp;&nbsp;&nbsp; ⚠ WARNING: This application is evaluated by a system that does not care about you ⚠
            &nbsp;&nbsp;&nbsp; ⚠ All applications are final. There is no appeals process. ⚠
            &nbsp;&nbsp;&nbsp; ⚠ By applying you confirm this is worth your time ⚠
            &nbsp;&nbsp;&nbsp; ⚠ This role was filled internally but we are still collecting data ⚠
          </span>
        </div>
      </div>

      {/* Main form */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        {/* Step 1: Questionnaire */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-600 text-white font-black w-8 h-8 flex items-center justify-center text-sm border-2 border-red-900">
              1
            </div>
            <h2 className="text-white font-black text-lg uppercase tracking-wide">
              Pre-Application Screening
            </h2>
          </div>
          <Questionnaire onChange={setAnswers} />
        </section>

        {/* Step 2: Resume upload */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-600 text-white font-black w-8 h-8 flex items-center justify-center text-sm border-2 border-red-900">
              2
            </div>
            <h2 className="text-white font-black text-lg uppercase tracking-wide">
              Resume Upload
            </h2>
          </div>

          <div
            className={`border-4 border-dashed p-8 text-center cursor-pointer transition-colors ${
              dragOver
                ? "border-yellow-400 bg-yellow-900/20"
                : "border-blue-500 bg-blue-950/40 hover:border-blue-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            {file ? (
              <div>
                <p className="text-green-400 font-black text-sm">
                  ✓ File received: {file.name}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  ({(file.size / 1024).toFixed(1)} KB of doomed ambitions)
                </p>
                <p className="text-yellow-400 text-xs mt-2">Click to change file</p>
              </div>
            ) : (
              <div>
                <p className="text-4xl mb-2">📄</p>
                <p className="text-blue-300 font-bold text-sm">
                  Drop your resume here or click to browse
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Accepted: PDF, DOC, DOCX, TXT · Max 10MB · Min 0 chance of success
                </p>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-xs mt-2 text-center font-mono">
            Note: Resume upload is optional. The outcome is not.
          </p>
        </section>

        {/* Step 3: Submit */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-600 text-white font-black w-8 h-8 flex items-center justify-center text-sm border-2 border-red-900">
              3
            </div>
            <h2 className="text-white font-black text-lg uppercase tracking-wide">
              Submit to the Void
            </h2>
          </div>

          {submitError && (
            <div className="bg-red-900 border-2 border-red-400 p-3 mb-4 text-center">
              <p className="text-red-200 text-sm font-bold">{submitError}</p>
            </div>
          )}

          {!allAnswered && (
            <p className="text-yellow-400 text-xs text-center mb-3 font-mono animate-pulse">
              ⚠ Complete all 3 screening questions before the button will cooperate.
            </p>
          )}

          <RunawayButton onClick={handleSubmit} disabled={!allAnswered} />

          <p className="text-center text-gray-600 text-xs mt-3 font-mono">
            By clicking submit you acknowledge that this process is a formality
            and the decision was made before you started typing.
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t-4 border-blue-900 bg-blue-950 py-6 text-center">
        <p className="text-blue-400 text-xs font-mono">
          © 2024 MegaCorp Industries™ · Equal Opportunity Rejecter
        </p>
        <p className="text-gray-600 text-xs mt-1">
          We reject candidates of all backgrounds, equally and without mercy.
        </p>
      </footer>
    </main>
  );
}
