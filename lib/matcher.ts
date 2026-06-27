import { SKILL_KEYWORDS } from "./skillKeywords";
import { SYNONYMS } from "./synonyms";
import { tokenize, normalizeToken } from "./utils";

export interface GapSkill {
  skill: string;
  count: number;
}

export interface MatchResult {
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jdSkills: string[];
  skillFrequency: Record<string, number>;
  matchedWeight: number;
  totalWeight: number;
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
}

/*
  STAGE 1 — PHRASE DETECTION
  Scans text for known multi-word phrases before tokenization.
  This ensures "machine learning", "rest api", "github actions"
  are captured as single units rather than split into noise tokens.
  Returns an array of detected phrase strings (lowercased).
*/
function detectPhrases(text: string): string[] {
  const lower = text.toLowerCase();
  const detected: string[] = [];

  /*
    Multi-word phrases to scan for explicitly.
    Order matters — longer phrases first to avoid partial matches.
  */
  const PHRASES = [
    "machine learning",
    "deep learning",
    "computer vision",
    "natural language processing",
    "rest api",
    "restful api",
    "rest apis",
    "restful apis",
    "github actions",
    "react native",
    "node.js",
    "next.js",
    "vue.js",
    "express.js",
    "spring boot",
    "tailwind css",
    "data structures",
    "ci/cd",
    "ci cd",
    "continuous integration",
    "continuous deployment",
    "web sockets",
    "websockets",
    "sql server",
    "google cloud",
    "amazon web services",
    "microsoft azure",
    "hugging face",
    "scikit-learn",
    "testing library",
    "system design",
    "object oriented",
    "object-oriented",
    "data engineering",
    "data science",
    "large language models",
    "large language model",
    "version control",
  ];

  for (const phrase of PHRASES) {
    /*
      Use word-boundary aware matching.
      Escape special chars in the phrase for safe regex usage.
    */
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      detected.push(phrase.toLowerCase());
    }
  }

  return detected;
}

/*
  STAGE 2 — TERM EXTRACTION
  Extracts both single-word tokens and known phrases from text.
  Also extracts common tech patterns like C++, C#, .NET, gRPC.
*/
function extractTerms(text: string): string[] {
  const terms: string[] = [];

  /*
    Detect multi-word phrases first before tokenization
    breaks them apart.
  */
  const phrases = detectPhrases(text);
  terms.push(...phrases);

  /*
    Extract special-character tech terms that tokenization
    would otherwise destroy: C++, C#, .NET, gRPC, tRPC, GraphQL
  */
  const specialPatterns = [
    /\bc\+\+/gi,
    /\bc#/gi,
    /\.net\b/gi,
    /\bgrpc\b/gi,
    /\btrpc\b/gi,
    /\bgraphql\b/gi,
    /\bsql\b/gi,
    /\bnosql\b/gi,
    /\bsaas\b/gi,
    /\bpaas\b/gi,
    /\biaas\b/gi,
    /\borm\b/gi,
    /\bapi\b/gi,
    /\baws\b/gi,
    /\bgcp\b/gi,
    /\bci\/cd\b/gi,
    /\bhtml\b/gi,
    /\bcss\b/gi,
    /\bphp\b/gi,
    /\bcss3\b/gi,
    /\bhtml5\b/gi,
  ];

  for (const pattern of specialPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        terms.push(match.toLowerCase());
      }
    }
  }

  /*
    Tokenize the remaining text into individual words.
  */
  const tokens = tokenize(text);
  terms.push(...tokens);

  return terms;
}

/*
  STAGE 3 — NORMALIZATION
  Applies synonym mapping to each term.
  Maps variants to canonical forms: "reactjs" → "react", "k8s" → "kubernetes"
*/
function normalizeTerms(terms: string[]): string[] {
  return terms.map((term) => {
    const cleaned = normalizeToken(term);
    return SYNONYMS[cleaned] ?? cleaned;
  });
}

/*
  STAGE 4 — DEDUPLICATION
  Removes duplicate terms while preserving first occurrence order.
*/
function deduplicateTerms(terms: string[]): string[] {
  return [...new Set(terms)];
}

/*
  STAGE 5 — SKILL FILTERING
  Filters extracted terms against the known skill taxonomy.
  This prevents noise words ("the", "and", "experience", "team")
  from polluting the skill set while still allowing free-form
  extraction to catch terms not in the original 55-word list.

  Strategy:
  - Accept any term that matches the SKILL_KEYWORDS taxonomy
  - Accept any term that was a detected phrase (phrases are
    always intentional tech terms)
  - Accept synonyms that resolve to known skills
  - Reject generic English words
*/
function filterToSkills(
  terms: string[],
  detectedPhrases: string[]
): string[] {
  const phraseSet = new Set(detectedPhrases);
  const keywordSet = new Set(SKILL_KEYWORDS.map((k) => k.toLowerCase()));
  const synonymValues = new Set(Object.values(SYNONYMS));

  return terms.filter(
    (term) =>
      keywordSet.has(term) ||
      phraseSet.has(term) ||
      synonymValues.has(term)
  );
}

/*
  STAGE 6 — WEIGHT CALCULATION
  Counts how many times each JD skill term appears in the raw JD text.
  Frequency drives the gap severity tiers:
    >= 3 mentions → critical
    >= 2 mentions → moderate
    1 mention     → minor
  Cap at 5 to prevent a single repeated term from dominating the score.
*/
function calculateWeights(
  skills: string[],
  rawText: string
): Record<string, number> {
  const lower = rawText.toLowerCase();
  const weights: Record<string, number> = {};

  for (const skill of skills) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "gi");
    const matches = lower.match(regex);
    weights[skill] = Math.min(matches?.length ?? 1, 5);
  }

  return weights;
}

/*
  STAGE 7 — SKILL COMPARISON
  Compares resume skills against JD skills.
  Returns matched, missing, and gap-tiered arrays.
*/
function compareSkills(
  resumeSkills: string[],
  jdSkills: string[],
  jdWeights: Record<string, number>
): {
  matchedSkills: string[];
  missingSkills: string[];
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
  matchedWeight: number;
  totalWeight: number;
} {
  const resumeSet = new Set(resumeSkills);

  const matchedSkills = jdSkills.filter((skill) => resumeSet.has(skill));
  const missingSkills = jdSkills.filter((skill) => !resumeSet.has(skill));

  const criticalGaps: GapSkill[] = [];
  const moderateGaps: GapSkill[] = [];
  const minorGaps: GapSkill[] = [];

  for (const skill of missingSkills) {
    const count = jdWeights[skill] ?? 1;
    if (count >= 3) {
      criticalGaps.push({ skill, count });
    } else if (count >= 2) {
      moderateGaps.push({ skill, count });
    } else {
      minorGaps.push({ skill, count });
    }
  }

  /*
    Sort each tier by frequency descending so the most
    important gaps appear first.
  */
  criticalGaps.sort((a, b) => b.count - a.count);
  moderateGaps.sort((a, b) => b.count - a.count);
  minorGaps.sort((a, b) => b.count - a.count);

  const totalWeight = Object.values(jdWeights).reduce(
    (sum, w) => sum + w,
    0
  );

  const matchedWeight = matchedSkills.reduce(
    (sum, skill) => sum + (jdWeights[skill] ?? 0),
    0
  );

  return {
    matchedSkills,
    missingSkills,
    criticalGaps,
    moderateGaps,
    minorGaps,
    matchedWeight,
    totalWeight,
  };
}

/*
  PUBLIC ENTRY POINT
  Runs the full pipeline in order:
  extract → normalize → deduplicate → filter → weight → compare
*/
export function matchSkills(
  resumeText: string,
  jdText: string
): MatchResult {
  /*
    Extract and normalize resume skills
  */
  const resumePhrases = detectPhrases(resumeText);
  const rawResumeTerms = extractTerms(resumeText);
  const normalizedResumeTerms = normalizeTerms(rawResumeTerms);
  const dedupedResumeTerms = deduplicateTerms(normalizedResumeTerms);
  const resumeSkills = filterToSkills(dedupedResumeTerms, resumePhrases);

  /*
    Extract and normalize JD skills
  */
  const jdPhrases = detectPhrases(jdText);
  const rawJdTerms = extractTerms(jdText);
  const normalizedJdTerms = normalizeTerms(rawJdTerms);
  const dedupedJdTerms = deduplicateTerms(normalizedJdTerms);
  const jdSkills = filterToSkills(dedupedJdTerms, jdPhrases);

  /*
    Calculate frequency weights from raw JD text
  */
  const skillFrequency = calculateWeights(jdSkills, jdText);

  /*
    Compare and return results
  */
  const comparison = compareSkills(resumeSkills, jdSkills, skillFrequency);

  return {
    ...comparison,
    resumeSkills,
    jdSkills,
    skillFrequency,
  };
}