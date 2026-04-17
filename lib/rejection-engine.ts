import rules from "@/data/chaos-rules.json";

export interface RejectionResult {
  opening: string;
  primaryReason: string;
  primaryCode: string;
  additionalReason: string;
  signOff: string;
  stats: {
    wordCount: number;
    buzzwordsFound: string[];
    processingTimeMs: number;
  };
}

function pick<T>(arr: T[], seed: number): T {
  return arr[Math.abs(seed) % arr.length];
}

function deterministicSeed(text: string): number {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function findBuzzwords(text: string): string[] {
  const lower = text.toLowerCase();
  return rules.buzzwords.filter((w) => lower.includes(w.toLowerCase()));
}

function hasPattern(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

export function evaluate(resumeText: string): RejectionResult {
  const start = Date.now();
  const seed = deterministicSeed(resumeText);
  const wordCount = countWords(resumeText);
  const buzzwordsFound = findBuzzwords(resumeText);
  const lower = resumeText.toLowerCase();

  const hasYearsExperience = hasPattern(lower, [
    /\d+\+?\s*years?\s*(of\s+)?experience/i,
    /experience[:\s]+\d+/i,
  ]);
  const hasEducation = hasPattern(lower, [
    /bachelor|master|phd|mba|degree|university|college|graduated/i,
  ]);
  const hasSkills = lower.includes("skill") || lower.includes("proficient") || lower.includes("expertise");

  // Evaluate all matching conditions and pick one deterministically
  const matchingReasons = rules.contradictoryReasons.filter((r) => {
    const c = r.condition;
    if (c === "always") return true;
    if (c === "wordCount < 200") return wordCount < 200;
    if (c === "wordCount >= 200 && wordCount < 400") return wordCount >= 200 && wordCount < 400;
    if (c === "wordCount >= 400 && wordCount < 600") return wordCount >= 400 && wordCount < 600;
    if (c === "wordCount >= 600") return wordCount >= 600;
    if (c === "hasBuzzwords") return buzzwordsFound.length >= 3;
    if (c === "noBuzzwords") return buzzwordsFound.length < 3;
    if (c === "hasYearsExperience") return hasYearsExperience;
    if (c === "noYearsExperience") return !hasYearsExperience;
    if (c === "hasEducation") return hasEducation;
    if (c === "noEducation") return !hasEducation;
    if (c === "hasSkills") return hasSkills;
    return false;
  });

  // Pick one that isn't "always" first; fallback to "always"
  const specificReasons = matchingReasons.filter((r) => r.condition !== "always");
  const primaryReason = specificReasons.length > 0
    ? pick(specificReasons, seed)
    : matchingReasons[matchingReasons.length - 1];

  const opening = pick(rules.openingLines, seed + 1);
  const additionalReason = pick(rules.additionalReasons, seed + 2);
  const signOff = pick(rules.signOffs, seed + 3);

  return {
    opening,
    primaryReason: primaryReason.reason,
    primaryCode: primaryReason.code,
    additionalReason,
    signOff,
    stats: {
      wordCount,
      buzzwordsFound,
      processingTimeMs: Date.now() - start,
    },
  };
}

export function evaluateMock(fileName: string): RejectionResult {
  const mockText = `
    Experienced professional with 5 years of experience in synergy and leveraging core competencies.
    Seeking to pivot my skills and bandwidth to a dynamic, innovative team.
    Bachelor of Science from State University. Skilled in stakeholder management and deliverables.
    ${fileName} ${Date.now()}
  `;
  return evaluate(mockText);
}
