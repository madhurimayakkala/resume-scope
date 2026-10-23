import type { MatchResult } from "./schemas";

/*
  Plain-text, human-readable summary of an analysis. The score is a
  weighted coverage figure (frequency, required vs nice-to-have, and
  evidence credit), so it is never described as a share of skills.
*/
export function buildSummary(score: number, result: MatchResult): string {
  const total = result.jdSkills.length;
  const covered = result.matchedSkills.length;

  const lines: string[] = [];
  if (total === 0) {
    lines.push(
      "No recognizable skills were found in this job description, so no weighted score could be computed."
    );
  } else {
    lines.push(
      `Weighted skill coverage is ${score}%. Your resume covers ${covered} of the ${total} skills detected in the job description; skills the posting stresses count more, and nice-to-have skills count less.`
    );
  }

  if (result.partialSkills.length > 0) {
    lines.push(
      `Listed only in a skills section (partial credit): ${result.partialSkills.join(", ")}. Show them in a project or experience entry for full credit.`
    );
  }

  const gapList = (gaps: MatchResult["criticalGaps"], withCount: boolean) =>
    gaps.map((g) => (withCount ? `${g.skill} (${g.count}×)` : g.skill)).join(", ") ||
    "None";

  lines.push(`Matched skills (${covered}): ${result.matchedSkills.join(", ") || "None"}`);
  lines.push(`Critical gaps: ${gapList(result.criticalGaps, true)}`);
  lines.push(`Moderate gaps: ${gapList(result.moderateGaps, true)}`);
  lines.push(`Minor gaps: ${gapList(result.minorGaps, false)}`);

  return lines.join("\n\n");
}
