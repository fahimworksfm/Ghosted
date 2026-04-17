export interface Recommendation {
  priority: "high" | "medium" | "low";
  category: "verbs" | "metrics" | "structure" | "content";
  tip: string;
  example: string;
}

export interface RealAnalysis {
  powerVerbsFound: string[];
  weakPhrasesFound: string[];
  hasQuantifiedResults: boolean;
  quantifiedCount: number;
  foundSections: string[];
  missingSections: string[];
  atsFriendlyScore: number;
  recommendations: Recommendation[];
}

const POWER_VERBS = [
  "achieved", "automated", "built", "championed", "consolidated", "created",
  "delivered", "deployed", "designed", "developed", "directed", "drove",
  "engineered", "established", "executed", "expanded", "founded", "generated",
  "grew", "guided", "implemented", "improved", "increased", "initiated",
  "integrated", "launched", "led", "managed", "mentored", "migrated",
  "modernized", "negotiated", "optimized", "orchestrated", "pioneered",
  "produced", "rebuilt", "reduced", "refactored", "resolved", "scaled",
  "secured", "shipped", "spearheaded", "streamlined", "transformed",
  "unified", "won",
];

const WEAK_PHRASES = [
  "responsible for", "worked on", "helped with", "assisted", "participated in",
  "involved in", "was part of", "contributed to", "supported", "handled",
  "tasked with", "duties included", "worked with", "was responsible",
  "helped to", "aided in",
];

const SECTION_PATTERNS: Record<string, RegExp[]> = {
  experience: [
    /\b(work\s+)?experience\b/i,
    /\bemployment\b/i,
    /\bwork\s+history\b/i,
    /\bprofessional\s+experience\b/i,
    /\bcareer\s+history\b/i,
  ],
  education: [/\beducation\b/i, /\bacademic\b/i, /\bdegree\b/i],
  skills: [/\bskills\b/i, /\bcompetencies\b/i, /\btechnologies\b/i, /\btechnical\b/i],
  summary: [/\bsummary\b/i, /\bprofile\b/i, /\bobjective\b/i, /\babout\b/i],
  certifications: [/\bcertif/i, /\blicense/i, /\bcredential/i],
  projects: [/\bprojects?\b/i, /\bportfolio\b/i],
  achievements: [/\bachievement/i, /\baccomplishment/i, /\baward/i, /\bhonor/i],
};

const REQUIRED_SECTIONS = ["experience", "education", "skills", "summary"];

export function analyzeResume(text: string): RealAnalysis {
  const powerVerbsFound = POWER_VERBS.filter((v) =>
    new RegExp(`\\b${v}(d|ed|s|ing)?\\b`, "i").test(text)
  );

  const lower = text.toLowerCase();
  const weakPhrasesFound = WEAK_PHRASES.filter((p) => lower.includes(p));

  const quantMatches =
    text.match(
      /\b\d+(\.\d+)?\s*(%|x|X|\s*(million|billion|thousand|k\b|M\b|users?|customers?|employees?|people|teams?|projects?|products?|clients?|accounts?|revenue|sales?|leads?|hours?|days?|weeks?|months?|years?))/gi
    ) ?? [];
  const hasQuantifiedResults = quantMatches.length > 0;
  const quantifiedCount = quantMatches.length;

  const foundSections: string[] = [];
  const missingSections: string[] = [];
  for (const [section, patterns] of Object.entries(SECTION_PATTERNS)) {
    if (patterns.some((p) => p.test(text))) {
      foundSections.push(section);
    } else if (REQUIRED_SECTIONS.includes(section)) {
      missingSections.push(section);
    }
  }

  let score = 0;
  score += Math.min(25, powerVerbsFound.length * 5);
  score += hasQuantifiedResults ? 20 : 0;
  score += Math.min(15, quantifiedCount * 3);
  score += foundSections.includes("experience") ? 15 : 0;
  score += foundSections.includes("skills") ? 10 : 0;
  score += foundSections.includes("education") ? 5 : 0;
  score += foundSections.includes("summary") ? 5 : 0;
  score -= Math.min(20, weakPhrasesFound.length * 5);
  score -= missingSections.length * 5;
  const atsFriendlyScore = Math.max(0, Math.min(100, score));

  const recommendations: Recommendation[] = [];

  if (powerVerbsFound.length === 0) {
    recommendations.push({
      priority: "high",
      category: "verbs",
      tip: "Start every bullet point with a strong action verb.",
      example:
        "Instead of \"Responsible for the backend,\" write \"Built and deployed the backend API, reducing response time by 35%.\"",
    });
  } else if (powerVerbsFound.length < 4) {
    recommendations.push({
      priority: "medium",
      category: "verbs",
      tip: `You used ${powerVerbsFound.length} action verb(s). Aim for one strong verb per bullet.`,
      example:
        "Power verbs: Led, Built, Reduced, Scaled, Shipped, Grew, Optimized, Automated.",
    });
  }

  if (!hasQuantifiedResults) {
    recommendations.push({
      priority: "high",
      category: "metrics",
      tip: "Add numbers. ATS systems and humans both respond to quantified impact.",
      example:
        "\"Reduced page load time by 40%\" beats \"Improved performance\" — every single time.",
    });
  } else if (quantifiedCount < 3) {
    recommendations.push({
      priority: "medium",
      category: "metrics",
      tip: `You have ${quantifiedCount} metric(s). Aim for at least 3–5 across your bullets.`,
      example:
        "Useful metrics: team size, revenue impact, %, time saved, user count, cost reduced.",
    });
  }

  if (weakPhrasesFound.length > 0) {
    recommendations.push({
      priority: "high",
      category: "verbs",
      tip: `Remove passive language: "${weakPhrasesFound.slice(0, 2).join('", "')}"`,
      example:
        "\"Responsible for onboarding\" → \"Onboarded 15 engineers, cutting ramp-up time by 30%.\"",
    });
  }

  if (missingSections.length > 0) {
    recommendations.push({
      priority: "medium",
      category: "structure",
      tip: `Add missing section headers: ${missingSections
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(", ")}.`,
      example:
        "ATS systems do literal header scans. \"Experience,\" \"Skills,\" \"Education\" are non-negotiable.",
    });
  }

  if (!foundSections.includes("summary")) {
    recommendations.push({
      priority: "low",
      category: "content",
      tip: "Add a 2–3 sentence professional summary at the top.",
      example:
        "\"Senior engineer with 5 years in distributed systems, specializing in reducing infrastructure cost at scale.\"",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "low",
      category: "content",
      tip: "Your resume structure is solid. Tailor keywords to each specific job posting.",
      example:
        "Mirror exact phrases from the job description — ATS matching is literal, not semantic.",
    });
  }

  return {
    powerVerbsFound,
    weakPhrasesFound,
    hasQuantifiedResults,
    quantifiedCount,
    foundSections,
    missingSections,
    atsFriendlyScore,
    recommendations,
  };
}
