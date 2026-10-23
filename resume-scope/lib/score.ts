/*
  Single source of truth for how a score is labelled and colored.
  Used by the score card, the results page and exports.
*/
export type StatusTone = "matched" | "partial" | "critical";

export interface ScoreBand {
  label: string;
  tone: StatusTone;
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return { label: "Strong match", tone: "matched" };
  if (score >= 60) return { label: "Moderate match", tone: "partial" };
  if (score >= 40) return { label: "Partial match", tone: "partial" };
  return { label: "Low match", tone: "critical" };
}

export function getVerdict(score: number, criticalCount: number): string {
  if (criticalCount > 0) {
    return "A few critical gaps stand between you and a strong match.";
  }
  if (score >= 80) return "Strong alignment with this role.";
  if (score >= 60) return "Solid foundation, with room to tighten the gaps below.";
  if (score >= 40) return "Partial match. Worth tailoring before applying.";
  return "Limited alignment with this role as written.";
}
