"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "q1",
    label: "How many rounds of interviews are you willing to endure?",
    options: [
      "As many as it takes (I have no self-respect)",
      "Up to 7 rounds (I am emotionally stable but flexible)",
      "3 or fewer (UNACCEPTABLE — next candidate)",
      "One. I have other offers. (LIAR)",
      "I expect to be paid for interview time (DISQUALIFIED)",
      "However many you need — I thrive in chaos",
      "I stopped counting after round 11",
      "What is an interview? I only do 'culture fits'",
    ],
  },
  {
    id: "q2",
    label: "How would you describe your 'passion' for this role?",
    options: [
      "I am passionate about receiving a salary",
      "Deeply passionate — I have dreamed of this specific job posting",
      "I googled your company 20 minutes ago",
      "Passionate enough to fake it through onboarding",
      "I have repressed all passions for maximum productivity",
      "My passion is 'scalable' and 'data-driven'",
      "I will perform passion on request",
      "What is passion and why does it belong in a job application",
    ],
  },
  {
    id: "q3",
    label: "Where do you see yourself in 5 years?",
    options: [
      "In your role, honestly",
      "Haunting this very applicant tracking system",
      "I cannot see the future — that is a human limitation",
      "Wherever the equity vests",
      "Recovered from this hiring process",
      "Still waiting to hear back from this application",
      "Fully healed from corporate America",
      "Aggressively pivoting to a different industry",
    ],
  },
];

// Deterministically shuffle options using Fisher-Yates with a fixed seed
function shuffleOptions(options: string[], seed: number): string[] {
  const arr = [...options];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface Props {
  onChange: (answers: Record<string, string>) => void;
  onCompanyChange: (company: string) => void;
}

export default function Questionnaire({ onChange, onCompanyChange }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [company, setCompany] = useState("");

  function handleChange(id: string, value: string) {
    const updated = { ...answers, [id]: value };
    setAnswers(updated);
    onChange(updated);
  }

  function handleCompanyChange(value: string) {
    setCompany(value);
    onCompanyChange(value);
  }

  return (
    <div className="space-y-6">
      <div className="bg-yellow-300 border-4 border-red-600 p-3 text-center">
        <p className="text-red-700 font-black text-sm uppercase tracking-widest">
          ⚠ MANDATORY PRE-SCREENING QUESTIONNAIRE ⚠
        </p>
        <p className="text-red-600 text-xs mt-1">
          Failure to complete all fields will result in immediate disqualification
          and possible legal action.
        </p>
      </div>

      {/* Company name field */}
      <div className="border-2 border-blue-700 bg-white p-4 shadow-[4px_4px_0px_#dc2626]">
        <label className="block text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">
          Company Name <span className="text-gray-400 font-normal normal-case">(optional — for the counter)</span>
        </label>
        <p className="text-gray-600 text-xs mb-3">
          Which company&apos;s ATS will be processing your rejection today?
        </p>
        <input
          type="text"
          placeholder="e.g. Google, Amazon, MegaCorp Industries™"
          value={company}
          onChange={(e) => handleCompanyChange(e.target.value)}
          className="w-full border-2 border-blue-600 bg-yellow-50 text-gray-900 p-2 text-sm font-mono
                     focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400"
        />
        <p className="text-gray-400 text-xs mt-1 font-mono">
          We&apos;ll show you how many others have checked this company. Solidarity through data.
        </p>
      </div>

      {QUESTIONS.map((q, qi) => {
        const shuffled = shuffleOptions(q.options, qi * 31337 + 42);
        return (
          <div
            key={q.id}
            className="border-2 border-blue-700 bg-white p-4 shadow-[4px_4px_0px_#dc2626]"
          >
            <label className="block text-sm font-bold text-blue-900 mb-2 uppercase tracking-wide">
              Question {qi + 1} of {QUESTIONS.length}:{" "}
              <span className="text-red-600">*</span>
            </label>
            <p className="text-gray-800 font-semibold mb-3">{q.label}</p>
            <select
              className="w-full border-2 border-blue-600 bg-yellow-50 text-gray-900 p-2 text-sm font-mono
                         focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-400 cursor-pointer"
              value={answers[q.id] ?? ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
            >
              <option value="" disabled>
                — SELECT AN OPTION (ALL ARE WRONG) —
              </option>
              {shuffled.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
}
