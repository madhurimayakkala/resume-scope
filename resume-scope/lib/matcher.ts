import {
  AMBIGUOUS_TERMS,
  SKILL_KEYWORDS,
  SKILL_SATISFIED_BY,
  type AmbiguityRule,
} from "./skillKeywords";
import { SYNONYMS } from "./synonyms";
import {
  detectJdSections,
  detectResumeSections,
  isListLikeLine,
  isNiceSentence,
  lineIndexAt,
  sentenceAt,
} from "./sections";
import type { GapSkill, MatchResult } from "./schemas";
import { escapeRegExp, normalizeForExtraction } from "./utils";

/*
  Tunables. Change these in one place to affect the entire pipeline.
*/
export const CRITICAL_THRESHOLD = 3;
export const MODERATE_THRESHOLD = 2;
export const MAX_SKILL_WEIGHT = 5;
/** Multiplier for skills the JD only lists as nice-to-have. */
export const NICE_TO_HAVE_MULTIPLIER = 0.5;
/** Credit for a skill that appears only in a Skills list, never in context. */
export const LISTED_ONLY_CREDIT = 0.6;

interface SkillStats {
  count: number;
  /** Resume evidence: mentions outside a skills list. */
  contextCount: number;
  /** Resume evidence: mentions inside a skills list. */
  listedCount: number;
  /** JD: mentions in required context. */
  requiredCount: number;
  /** JD: mentions flagged nice-to-have. */
  niceCount: number;
}

/* ------------------------------------------------------------------ *
 * LEXICON — every surface form we recognise, mapped to its canonical skill
 * ------------------------------------------------------------------ */

interface LexiconEntry {
  surface: string;
  canonical: string;
  regex: RegExp;
  rule?: AmbiguityRule;
}

const WORD_BEFORE = "(?<![A-Za-z0-9_])";
const WORD_AFTER = "(?![A-Za-z0-9_])";

/*
  Builds a pattern for a surface form that tolerates the separator
  variants PDF extraction produces: "ci/cd" also matches "ci-cd",
  "ci cd", "cicd"; "next.js" also matches "Next. js" and "nextjs".
  Only "-", "_", whitespace and the separator the surface itself uses
  are accepted, so "the rest. API" cannot match "rest api".
*/
function buildPattern(surface: string, rule?: AmbiguityRule): string {
  if (rule?.pattern) return rule.pattern;

  const lead = surface.startsWith(".") ? "\\." : "";
  const body = surface.replace(/^\./, "");
  const tokens = body.split(/([\s\-_./]+)/);

  let source = lead;
  tokens.forEach((token, i) => {
    if (i % 2 === 0) {
      source += escapeRegExp(token);
      return;
    }
    const own = token.replace(/[^./]/g, "");
    const cls = "\\-_" + [...new Set(own)].map((c) => escapeRegExp(c)).join("");
    source += `[ \\t]*[${cls}]?[ \\t]*`;
  });

  if (/[a-z0-9]$/i.test(body) && !/s$/i.test(body) && body.length >= 4) {
    source += "s?";
  }
  return WORD_BEFORE + source + WORD_AFTER;
}

function buildLexicon(): LexiconEntry[] {
  const bySurface = new Map<string, string>();
  for (const keyword of SKILL_KEYWORDS) bySurface.set(keyword.toLowerCase(), keyword.toLowerCase());
  for (const [variant, canonical] of Object.entries(SYNONYMS)) bySurface.set(variant, canonical);

  return [...bySurface].map(([surface, canonical]) => {
    const rule = AMBIGUOUS_TERMS[surface];
    return {
      surface,
      canonical,
      rule,
      regex: new RegExp(buildPattern(surface, rule), "gi"),
    };
  });
}

const LEXICON = buildLexicon();

/* ------------------------------------------------------------------ *
 * STAGE 2/3 — CANDIDATE SCAN + AMBIGUITY FILTER
 * ------------------------------------------------------------------ */

interface Mention {
  start: number;
  end: number;
  canonical: string;
}

function passesRule(
  rule: AmbiguityRule,
  matched: string,
  line: string,
  after: string
): boolean {
  if (rule.deny?.test(after)) return false;
  if (rule.caseSensitive.includes(matched)) {
    return rule.context ? rule.context.test(line) : true;
  }
  return Boolean(rule.lowerContext && rule.lowerContext.test(line));
}

function scanCandidates(text: string, lines: ReturnType<typeof detectJdSections>["lines"]): Mention[] {
  const candidates: Mention[] = [];

  for (const entry of LEXICON) {
    entry.regex.lastIndex = 0;
    for (const m of text.matchAll(entry.regex)) {
      const start = m.index ?? 0;
      const end = start + m[0].length;

      if (entry.rule) {
        const line = lines[lineIndexAt(lines, start)].text;
        if (!passesRule(entry.rule, m[0], line, text.slice(end, end + 24))) continue;
      }
      candidates.push({ start, end, canonical: entry.canonical });
    }
  }
  return candidates;
}

/*
  STAGE 4 — OVERLAP RESOLUTION
  Longest match wins, so "GitHub Actions" consumes "GitHub", "React Native"
  consumes "React", "Tailwind CSS" consumes "CSS". Ties go to the earlier
  match. Each surviving mention is exactly one occurrence of one skill.
*/
function resolveOverlaps(candidates: Mention[], length: number): Mention[] {
  const taken = new Uint8Array(length);
  const chosen: Mention[] = [];
  const ordered = [...candidates].sort(
    (a, b) => b.end - b.start - (a.end - a.start) || a.start - b.start
  );

  for (const c of ordered) {
    let free = true;
    for (let i = c.start; i < c.end; i++) {
      if (taken[i]) {
        free = false;
        break;
      }
    }
    if (!free) continue;
    taken.fill(1, c.start, c.end);
    chosen.push(c);
  }
  return chosen.sort((a, b) => a.start - b.start);
}

/* ------------------------------------------------------------------ *
 * STAGE 5 — AGGREGATION (counts + evidence per canonical skill)
 * ------------------------------------------------------------------ */

function newStats(): SkillStats {
  return { count: 0, contextCount: 0, listedCount: 0, requiredCount: 0, niceCount: 0 };
}

function extractResumeSkills(rawText: string): Map<string, SkillStats> {
  const text = normalizeForExtraction(rawText);
  const { lines, byLine } = detectResumeSections(text);
  const mentions = resolveOverlaps(scanCandidates(text, lines), text.length);
  const skills = new Map<string, SkillStats>();

  for (const mention of mentions) {
    const idx = lineIndexAt(lines, mention.start);
    const section = byLine[idx];
    const listed =
      section === "skills" || (section === null && isListLikeLine(lines[idx].text));

    const stats = skills.get(mention.canonical) ?? newStats();
    stats.count += 1;
    if (listed) stats.listedCount += 1;
    else stats.contextCount += 1;
    skills.set(mention.canonical, stats);
  }
  return skills;
}

function extractJdSkills(rawText: string): Map<string, SkillStats> {
  const text = normalizeForExtraction(rawText);
  const { lines, byLine } = detectJdSections(text);
  const mentions = resolveOverlaps(scanCandidates(text, lines), text.length);
  const skills = new Map<string, SkillStats>();

  for (const mention of mentions) {
    const idx = lineIndexAt(lines, mention.start);
    const line = lines[idx];
    const nice =
      byLine[idx] === "nice" ||
      isNiceSentence(sentenceAt(line.text, mention.start - line.start));

    const stats = skills.get(mention.canonical) ?? newStats();
    stats.count += 1;
    if (nice) stats.niceCount += 1;
    else stats.requiredCount += 1;
    skills.set(mention.canonical, stats);
  }

  /*
    "Git and version control" is one idea, not two: drop the generic
    umbrella skill when a specific one it covers is also in the JD.
  */
  const umbrella = skills.get("version control");
  if (umbrella && (SKILL_SATISFIED_BY["version control"] ?? []).some((s) => skills.has(s))) {
    skills.delete("version control");
  }
  return skills;
}

/* ------------------------------------------------------------------ *
 * STAGE 6 — WEIGHTS
 * ------------------------------------------------------------------ */

function jdWeight(stats: SkillStats): number {
  const base = Math.min(stats.count, MAX_SKILL_WEIGHT);
  return stats.requiredCount === 0 ? base * NICE_TO_HAVE_MULTIPLIER : base;
}

/* ------------------------------------------------------------------ *
 * STAGE 7 — COMPARISON (hierarchy + evidence credit)
 * ------------------------------------------------------------------ */

function evidenceCredit(stats: SkillStats): number {
  return stats.contextCount > 0 ? 1 : LISTED_ONLY_CREDIT;
}

function resolveCredit(
  jdSkill: string,
  resume: Map<string, SkillStats>
): { credit: number; via?: string } {
  let best = { credit: 0, via: undefined as string | undefined };

  const own = resume.get(jdSkill);
  if (own) best = { credit: evidenceCredit(own), via: undefined };

  for (const satisfier of SKILL_SATISFIED_BY[jdSkill] ?? []) {
    const stats = resume.get(satisfier);
    if (!stats) continue;
    const credit = evidenceCredit(stats);
    if (credit > best.credit) best = { credit, via: satisfier };
  }
  return best;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/*
  PUBLIC ENTRY POINT
  normalize -> sections -> scan -> ambiguity filter -> overlap resolution
  -> aggregate -> weight -> compare
*/
export function matchSkills(resumeText: string, jdText: string): MatchResult {
  const resume = extractResumeSkills(resumeText);
  const jd = extractJdSkills(jdText);

  const jdSkills = [...jd.keys()];
  const skillFrequency: Record<string, number> = {};
  const skillWeights: Record<string, number> = {};
  const matchedVia: Record<string, string> = {};
  const matchedSkills: string[] = [];
  const partialSkills: string[] = [];
  const missingSkills: string[] = [];
  const gaps: Record<"critical" | "moderate" | "minor", GapSkill[]> = {
    critical: [],
    moderate: [],
    minor: [],
  };

  let totalWeight = 0;
  let matchedWeight = 0;

  for (const [skill, stats] of jd) {
    const weight = jdWeight(stats);
    skillFrequency[skill] = stats.count;
    skillWeights[skill] = weight;
    totalWeight += weight;

    const { credit, via } = resolveCredit(skill, resume);
    if (credit > 0) {
      matchedSkills.push(skill);
      matchedWeight += weight * credit;
      if (credit < 1) partialSkills.push(skill);
      if (via) matchedVia[skill] = via;
      continue;
    }

    missingSkills.push(skill);
    const gap: GapSkill = { skill, count: stats.count, niceToHave: stats.requiredCount === 0 };
    if (weight >= CRITICAL_THRESHOLD) gaps.critical.push(gap);
    else if (weight >= MODERATE_THRESHOLD) gaps.moderate.push(gap);
    else gaps.minor.push(gap);
  }

  const byImportance = (a: GapSkill, b: GapSkill) =>
    skillWeights[b.skill] - skillWeights[a.skill] || b.count - a.count;

  return {
    matchedSkills,
    partialSkills,
    missingSkills,
    resumeSkills: [...resume.keys()],
    jdSkills,
    skillFrequency,
    skillWeights,
    matchedVia,
    matchedWeight: round2(matchedWeight),
    totalWeight: round2(totalWeight),
    criticalGaps: gaps.critical.sort(byImportance),
    moderateGaps: gaps.moderate.sort(byImportance),
    minorGaps: gaps.minor.sort(byImportance),
  };
}
