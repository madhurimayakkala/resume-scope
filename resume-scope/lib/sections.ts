/*
  Section detection for resumes and job descriptions.

  A section header must be a short standalone line that matches a known
  heading. Prose that merely contains the word ("I enjoy side projects")
  is never a header.
*/

export interface Line {
  text: string;
  start: number;
  end: number;
}

export function splitLines(text: string): Line[] {
  const lines: Line[] = [];
  let start = 0;
  for (const part of text.split("\n")) {
    lines.push({ text: part, start, end: start + part.length });
    start += part.length + 1;
  }
  return lines;
}

export function lineIndexAt(lines: Line[], offset: number): number {
  let lo = 0;
  let hi = lines.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (lines[mid].start <= offset) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}

const MAX_HEADING_WORDS = 5;

/* Returns the lowercase heading text of a line, or null if it is not heading-shaped. */
function headingText(line: string): string | null {
  const cleaned = line
    .trim()
    .replace(/^[#*_\s]+|[*_\s]+$/g, "")
    .replace(/[:\-–—\s]+$/, "")
    .trim();
  if (!cleaned) return null;
  if (/^[-•*·▪●]/.test(line.trim())) return null;
  if (cleaned.split(/\s+/).length > MAX_HEADING_WORDS) return null;
  if (/[.,;]/.test(cleaned)) return null;
  return cleaned.toLowerCase();
}

/* ---------------------------- RESUME SECTIONS ---------------------------- */

export type ResumeSectionType = "skills" | "projects" | "experience" | "other";

const RESUME_HEADINGS: [ResumeSectionType, RegExp][] = [
  [
    "skills",
    /^((technical|key|core|relevant) )?(skills|competencies)( (&|and) [a-z ]+)?$|^(technologies|tech stack|technical stack|tools|tools (&|and) technologies|technologies (&|and) tools)$/,
  ],
  ["projects", /^((academic|personal|selected|key|side|notable) )?projects?$/],
  [
    "experience",
    /^((work|professional|relevant|industry) )?(experience|history)$|^employment( history)?$|^internships?( experience)?$/,
  ],
  [
    "other",
    /^(education|summary|professional summary|profile|objective|career objective|about( me)?|certifications?|achievements|awards|coursework|relevant coursework|courses|publications|volunteer(ing)?( experience)?|leadership|extracurriculars?( activities)?|activities|interests|references|languages)$/,
  ],
];

/* "Skills: React, Node" on a single line is a skills list, not a heading. */
const INLINE_SKILLS_LABEL =
  /^\s*((technical|key|core) )?(skills|technologies|tech stack|tools)\s*:/i;

export function classifyResumeHeading(line: string): ResumeSectionType | null {
  const heading = headingText(line);
  if (!heading) return null;
  for (const [type, pattern] of RESUME_HEADINGS) {
    if (pattern.test(heading)) return type;
  }
  return null;
}

export interface ResumeSections {
  lines: Line[];
  /** Section type for each line index, or null before the first heading. */
  byLine: (ResumeSectionType | null)[];
}

export function detectResumeSections(text: string): ResumeSections {
  const lines = splitLines(text);
  const byLine: (ResumeSectionType | null)[] = [];
  let current: ResumeSectionType | null = null;
  for (const line of lines) {
    const heading = classifyResumeHeading(line.text);
    if (heading) current = heading;
    byLine.push(INLINE_SKILLS_LABEL.test(line.text) ? "skills" : current);
  }
  return { lines, byLine };
}

export function hasResumeSection(
  text: string,
  type: Exclude<ResumeSectionType, "other">
): boolean {
  return splitLines(text).some((l) => classifyResumeHeading(l.text) === type);
}

/*
  Fallback when no heading precedes a mention: a short comma/pipe-separated
  line that does not read as a sentence is a bare list of tools.
*/
export function isListLikeLine(line: string): boolean {
  const body = line.includes(":") ? line.slice(line.indexOf(":") + 1) : line;
  const trimmed = body.trim();
  if (!trimmed || /[.!?]$/.test(trimmed)) return false;
  const segments = trimmed.split(/[,|•·;]/).map((s) => s.trim()).filter(Boolean);
  return segments.length >= 3 && segments.every((s) => s.split(/\s+/).length <= 3);
}

/* ------------------------------ JD SECTIONS ------------------------------ */

export type JdRequirement = "required" | "nice";

const JD_NICE_HEADING =
  /^(nice[- ]to[- ]haves?( skills| qualifications)?|preferred( qualifications| skills| experience| requirements)?|bonus( points| skills| qualifications)?|good to have|desirable( skills)?|a plus|pluses|extra credit|optional|what would be a (plus|bonus))$/;

const JD_RESET_HEADING =
  /^(requirements?|required( qualifications| skills| experience)?|(minimum|basic) qualifications|qualifications|must[- ]haves?|what you('ll| will)? need|what we('re| are) looking for|what you bring|who you are|your profile|skills( (&|and) experience)?|responsibilities|key responsibilities|what you('ll| will) do|about (the role|us|you|the team|the job|the position)|the role|overview|benefits|perks|what we offer|job description|why join us|how to apply|compensation)$/;

/* Cues inside a sentence that mark its skills as optional. */
const NICE_SENTENCE_CUE =
  /\b(nice[- ]to[- ]haves?|bonus points?|preferred|desirable|ideally|not required|optional)\b|\b(?:is|are|would be|will be)?\s*an? (?:plus|bonus|advantage)\b|\((?:plus|bonus)\)/i;

export function isNiceSentence(sentence: string): boolean {
  return NICE_SENTENCE_CUE.test(sentence);
}

export interface JdSections {
  lines: Line[];
  byLine: JdRequirement[];
}

export function detectJdSections(text: string): JdSections {
  const lines = splitLines(text);
  const byLine: JdRequirement[] = [];
  let current: JdRequirement = "required";
  for (const line of lines) {
    const heading = headingText(line.text);
    if (heading) {
      if (JD_NICE_HEADING.test(heading)) current = "nice";
      else if (JD_RESET_HEADING.test(heading)) current = "required";
    }
    byLine.push(current);
  }
  return { lines, byLine };
}

/* The sentence of `line` that contains `offsetInLine`. */
export function sentenceAt(line: string, offsetInLine: number): string {
  let pos = 0;
  for (const piece of line.split(/(?<=[.!?;])\s+/)) {
    const idx = line.indexOf(piece, pos);
    const end = idx + piece.length;
    if (offsetInLine < end) return piece;
    pos = end;
  }
  return line;
}
