import { getScoreBand } from "./score";
import type { AnalyzeResponse } from "./schemas";

/* Plain-text report, suitable for pasting into notes or a message. */
export function formatResultsText(result: AnalyzeResponse): string {
  const band = getScoreBand(result.matchScore);
  const gapLine = (label: string, gaps: AnalyzeResponse["criticalGaps"]) =>
    `${label}: ${gaps.map((g) => `${g.skill} (${g.count}×)`).join(", ") || "None"}`;

  const sections = [
    `Resume Scope — match report`,
    `Match score: ${result.matchScore}% (${band.label})`,
    result.summary,
  ];

  if (result.recommendations.length > 0) {
    sections.push(
      "Recommendations:\n" +
        result.recommendations
          .map((r, i) => `${i + 1}. ${r.title} — ${r.description}`)
          .join("\n")
    );
  }

  sections.push(
    [
      gapLine("Critical gaps", result.criticalGaps),
      gapLine("Moderate gaps", result.moderateGaps),
      gapLine("Minor gaps", result.minorGaps),
    ].join("\n")
  );

  return sections.join("\n\n");
}

export function formatResultsJson(result: AnalyzeResponse): string {
  return JSON.stringify(result, null, 2);
}
