import rules from "@/data/chaos-rules.json";
import { analyzeResume, type RealAnalysis } from "@/lib/real-analysis";

export type RejectionTier = "bronze" | "silver" | "gold" | "platinum";

export interface FakeScore {
  name: string;
  score: number; // 0–10
  verdict: string;
}

export interface TimelineEvent {
  day: number;
  event: string;
  icon: string;
  status: "complete" | "rejected";
}

export interface RejectionResult {
  opening: string;
  primaryReason: string;
  primaryCode: string;
  additionalReason: string;
  signOff: string;
  tier: RejectionTier;
  tierLabel: string;
  tierDescription: string;
  improvementTips: string[];
  fakeScores: FakeScore[];
  ghostingTimeline: TimelineEvent[];
  realAnalysis: RealAnalysis;
  stats: {
    wordCount: number;
    buzzwordsFound: string[];
    processingTimeMs: number;
  };
}

// ─── helpers ────────────────────────────────────────────────────────────────

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

// ─── tier ───────────────────────────────────────────────────────────────────

interface TierInfo {
  label: string;
  description: string;
}

const TIER_INFO: Record<RejectionTier, TierInfo> = {
  bronze: {
    label: "Bronze Rejection",
    description: "Participation trophy. The ATS barely had to try.",
  },
  silver: {
    label: "Silver Rejection",
    description: "Honorable mention in mediocrity. You showed potential for being passed over.",
  },
  gold: {
    label: "Gold Rejection",
    description: "Distinguished failure. A genuinely strong resume, heroically ignored.",
  },
  platinum: {
    label: "Platinum Rejection",
    description:
      "Elite-tier incompatibility. Your resume was so comprehensive it became a threat. You were rejected preemptively.",
  },
};

function computeTier(
  wordCount: number,
  buzzwordCount: number,
  hasYearsExperience: boolean,
  hasEducation: boolean,
  hasSkills: boolean,
  realAnalysis: RealAnalysis
): RejectionTier {
  let score = 0;
  if (wordCount > 150) score++;
  if (wordCount > 350) score++;
  if (wordCount > 600) score++;
  if (buzzwordCount >= 3) score++;
  if (buzzwordCount >= 7) score++;
  if (hasYearsExperience) score++;
  if (hasEducation) score++;
  if (hasSkills) score++;
  if (realAnalysis.hasQuantifiedResults) score++;
  if (realAnalysis.powerVerbsFound.length >= 3) score++;

  if (score >= 7) return "platinum";
  if (score >= 5) return "gold";
  if (score >= 3) return "silver";
  return "bronze";
}

// ─── fake scores ─────────────────────────────────────────────────────────────

const FAKE_METRIC_DEFS: Array<{ name: string; badHigh: boolean; verdicts: string[] }> = [
  {
    name: "Nepotism Potential",
    badHigh: false,
    verdicts: ["None detected. Red flag.", "Insufficient connections.", "No internal sponsor found.", "Dangerously self-made."],
  },
  {
    name: "Salary Negotiation Aggression Risk",
    badHigh: true,
    verdicts: ["Will definitely ask for more.", "Dangerously market-aware.", "Knows their worth. Unacceptable.", "Expects to be paid fairly."],
  },
  {
    name: "Aura Score™",
    badHigh: false,
    verdicts: ["Undetectable.", "Statistically irrelevant.", "Below threshold.", "Aura failed to load."],
  },
  {
    name: "Vibes-Based Culture Fit",
    badHigh: false,
    verdicts: ["Wrong vibe.", "Insufficient ping-pong table enthusiasm.", "Shows signs of work-life balance.", "Not enough LinkedIn posts."],
  },
  {
    name: "Overqualification Risk",
    badHigh: true,
    verdicts: ["Critically overqualified.", "Will leave in 6 months.", "Too many skills.", "Knows what they're doing."],
  },
  {
    name: "Unpaid Overtime Willingness",
    badHigh: false,
    verdicts: ["Expects compensation. Alarming.", "Believes in 40-hr weeks.", "Healthy boundaries detected.", "Will not 'live to work.'"],
  },
  {
    name: "LinkedIn Photo Energy",
    badHigh: false,
    verdicts: ["Photo unverified. Suspicious.", "Could not assess charisma.", "Smile: non-corporate.", "Did not use AI headshot."],
  },
  {
    name: "References Quality (Unverified)",
    badHigh: false,
    verdicts: ["References not checked.", "Will not be checked.", "Were never going to be checked.", "Nobody called them. Nobody ever does."],
  },
];

function generateFakeScores(seed: number): FakeScore[] {
  let s = seed;
  return FAKE_METRIC_DEFS.map((m, i) => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const raw = Math.abs(s) % 10;
    // Bias scores toward bad outcomes for the candidate
    const score = m.badHigh ? Math.max(7, raw % 4 + 7) : Math.min(3, raw % 4);
    const verdict = m.verdicts[Math.abs(s + i) % m.verdicts.length];
    return { name: m.name, score, verdict };
  });
}

// ─── ghosting timeline ───────────────────────────────────────────────────────

const GHOSTING_TIMELINE: TimelineEvent[] = [
  { day: 1, event: "Application submitted via 47-step portal", icon: "📨", status: "complete" },
  { day: 2, event: "Auto-acknowledgment received: \"We value your interest\"", icon: "🤖", status: "complete" },
  { day: 5, event: "Recruiter viewed your LinkedIn (did not connect)", icon: "👁️", status: "complete" },
  { day: 8, event: "Phone screen scheduled", icon: "📅", status: "complete" },
  { day: 10, event: "Phone screen rescheduled (their conflict, your problem)", icon: "🔄", status: "complete" },
  { day: 12, event: "Phone screen completed. Recruiter: \"This went really well!\"", icon: "📞", status: "complete" },
  { day: 15, event: "Take-home technical assessment assigned (8 hours, unpaid)", icon: "💻", status: "complete" },
  { day: 18, event: "Assessment submitted. Recruiter: \"Fantastic work!\"", icon: "🤩", status: "complete" },
  { day: 22, event: "Panel interview (5 rounds, 6 hours, 11 interviewers)", icon: "🎭", status: "complete" },
  { day: 35, event: "Final round with the VP's assistant's manager's delegate", icon: "🏁", status: "complete" },
  { day: 38, event: "Reference checks requested (and then not done)", icon: "📋", status: "complete" },
  { day: 44, event: "Recruiter: \"Decision imminent! Stay close.\"", icon: "⏳", status: "complete" },
  { day: 47, event: "This email.", icon: "💀", status: "rejected" },
];

// ─── improvement tips (real advice + satirical contradiction) ─────────────────

function generateImprovementTips(
  wordCount: number,
  buzzwordsFound: string[],
  realAnalysis: RealAnalysis,
  tier: RejectionTier
): string[] {
  const tips: string[] = [];

  if (wordCount < 300) {
    tips.push(
      "Your resume is too short — add 2–3 specific bullet points per role with measurable outcomes. (Note: Doing so will trigger rejection for excessive verbosity.)"
    );
  } else if (wordCount > 700) {
    tips.push(
      "Trim to one page. Hiring managers average 7 seconds of review time. (Note: A one-page resume will be rejected for \"insufficient depth of experience.\")"
    );
  }

  if (buzzwordsFound.length >= 5) {
    tips.push(
      "Remove vague buzzwords — replace \"synergy\" and \"leverage\" with concrete outcomes and numbers. (Note: Without buzzwords, our ATS cannot categorize you and will reject you for \"unclassifiable skill set.\")"
    );
  } else {
    tips.push(
      "Include keywords from the job description verbatim — ATS does exact-string matching, not semantic understanding. (Note: This will trigger rejection for \"buzzword contamination.\")"
    );
  }

  if (realAnalysis.powerVerbsFound.length < 3) {
    tips.push(
      "Start every bullet with a strong action verb: \"Led,\" \"Built,\" \"Reduced,\" \"Scaled.\" Shows ownership. (Note: Strong verbs signal a \"results-obsessed personality,\" which threatens our culture of vague accountability.)"
    );
  }

  if (!realAnalysis.hasQuantifiedResults) {
    tips.push(
      "Quantify everything: \"reduced load time by 40%\" is 10× more compelling than \"improved performance.\" Numbers get past ATS and impress humans. (Note: Metrics imply you expect to be evaluated on outcomes. We find this deeply presumptuous.)"
    );
  }

  if (realAnalysis.weakPhrasesFound.length > 0) {
    tips.push(
      `Replace "${realAnalysis.weakPhrasesFound[0]}" with an active construction. Passive language buries impact. (Note: Too much active voice suggests \"dangerous initiative\" and \"alarming self-direction.\")`
    );
  }

  if (realAnalysis.missingSections.length > 0) {
    tips.push(
      `Add a clear "${realAnalysis.missingSections[0].charAt(0).toUpperCase() + realAnalysis.missingSections[0].slice(1)}" section header. ATS systems do literal header scans. (Note: Standard formatting will flag you as a "template user, lacking originality.")`
    );
  }

  if (tier === "platinum") {
    tips.push(
      "Your resume is actually very strong. The problem is structural, not personal. Our ATS rejects strong candidates specifically to filter out people who have other options. This tip is free of satire. Good luck."
    );
  }

  return tips.slice(0, 5);
}

// ─── PDF text extraction ──────────────────────────────────────────────────────

export function extractPdfText(buffer: Buffer): string {
  const content = buffer.toString("latin1");
  const blocks: string[] = [];
  const btEtRegex = /BT[\s\S]*?ET/g;
  let m;
  while ((m = btEtRegex.exec(content)) !== null) {
    const strRegex = /\(([^)\\]*(?:\\.[^)\\]*)*)\)/g;
    let sm;
    while ((sm = strRegex.exec(m[0])) !== null) {
      const t = sm[1]
        .replace(/\\n/g, " ")
        .replace(/\\r/g, " ")
        .replace(/\\\\/g, "\\")
        .replace(/\\\(/g, "(")
        .replace(/\\\)/g, ")");
      if (t.trim()) blocks.push(t);
    }
  }
  const joined = blocks.join(" ").replace(/\s+/g, " ").trim();
  if (joined.length > 50) return joined;
  // Fallback: strip binary, keep ASCII words
  return content
    .replace(/[^\x20-\x7E\n]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && /^[a-zA-Z]/.test(w))
    .join(" ");
}

// ─── main evaluator ──────────────────────────────────────────────────────────

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
  const hasSkills =
    lower.includes("skill") ||
    lower.includes("proficient") ||
    lower.includes("expertise");

  const realAnalysis = analyzeResume(resumeText);

  const tier = computeTier(
    wordCount,
    buzzwordsFound.length,
    hasYearsExperience,
    hasEducation,
    hasSkills,
    realAnalysis
  );

  // Pick primary rejection reason
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

  const specific = matchingReasons.filter((r) => r.condition !== "always");
  const primaryReason =
    specific.length > 0
      ? pick(specific, seed)
      : matchingReasons[matchingReasons.length - 1];

  const opening = pick(rules.openingLines, seed + 1);
  const additionalReason = pick(rules.additionalReasons, seed + 2);
  const signOff = pick(rules.signOffs, seed + 3);
  const fakeScores = generateFakeScores(seed);
  const improvementTips = generateImprovementTips(
    wordCount,
    buzzwordsFound,
    realAnalysis,
    tier
  );

  const tierMeta = TIER_INFO[tier];

  return {
    opening,
    primaryReason: primaryReason.reason,
    primaryCode: primaryReason.code,
    additionalReason,
    signOff,
    tier,
    tierLabel: tierMeta.label,
    tierDescription: tierMeta.description,
    improvementTips,
    fakeScores,
    ghostingTimeline: GHOSTING_TIMELINE,
    realAnalysis,
    stats: {
      wordCount,
      buzzwordsFound,
      processingTimeMs: Date.now() - start,
    },
  };
}

export function evaluateMock(seed: string): RejectionResult {
  const mockText = `
    Experienced professional with 5 years of experience in synergy and leveraging core competencies.
    Seeking to pivot my skills and bandwidth to a dynamic, innovative team.
    Bachelor of Science from State University. Skilled in stakeholder management and deliverables.
    Led team of 3. Reduced costs by 15%. Built internal tooling. ${seed} ${Date.now()}
  `;
  return evaluate(mockText);
}
