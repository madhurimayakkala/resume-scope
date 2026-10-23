import { describe, expect, it } from "vitest";

import { cn } from "@/lib/cn";
import { formatResultsJson, formatResultsText } from "@/lib/exportResults";
import { SAMPLE_JD, SAMPLE_JD_EXCERPT } from "@/lib/sampleData";
import { getScoreBand, getVerdict } from "@/lib/score";
import type { AnalyzeResponse } from "@/lib/schemas";

describe("cn", () => {
  it("joins truthy parts only", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });
});

describe("getScoreBand", () => {
  const cases: [number, string, string][] = [
    [100, "Strong match", "matched"],
    [80, "Strong match", "matched"],
    [79, "Moderate match", "partial"],
    [60, "Moderate match", "partial"],
    [59, "Partial match", "partial"],
    [40, "Partial match", "partial"],
    [39, "Low match", "critical"],
    [0, "Low match", "critical"],
  ];
  it.each(cases)("%i -> %s", (score, label, tone) => {
    expect(getScoreBand(score)).toEqual({ label, tone });
  });
});

describe("getVerdict", () => {
  it("prioritizes critical gaps over the score", () => {
    expect(getVerdict(95, 1)).toMatch(/critical gaps/);
  });
  it.each([
    [85, /Strong alignment/],
    [65, /Solid foundation/],
    [45, /Partial match/],
    [10, /Limited alignment/],
  ])("%i", (score, re) => {
    expect(getVerdict(score, 0)).toMatch(re);
  });
});

const result: AnalyzeResponse = {
  matchScore: 72,
  matchedSkills: ["react"],
  partialSkills: [],
  missingSkills: ["docker"],
  jdSkills: ["react", "docker"],
  resumeSkills: ["react"],
  skillFrequency: { react: 1, docker: 3 },
  criticalGaps: [{ skill: "docker", count: 3, niceToHave: false }],
  moderateGaps: [],
  minorGaps: [],
  summary: "Weighted skill coverage is 72%.",
  recommendations: [
    { title: "Add Docker", description: "Show it.", reason: "Appears 3 times.", priority: 100, category: "critical_gap" },
  ],
};

describe("export formatting", () => {
  it("text report includes score, summary, recommendations and gaps", () => {
    const text = formatResultsText(result);
    expect(text).toContain("Match score: 72% (Moderate match)");
    expect(text).toContain("Weighted skill coverage is 72%.");
    expect(text).toContain("1. Add Docker — Show it.");
    expect(text).toContain("Critical gaps: docker (3×)");
    expect(text).toContain("Moderate gaps: None");
  });

  it("omits the recommendations block when there are none", () => {
    expect(formatResultsText({ ...result, recommendations: [] })).not.toContain("Recommendations:");
  });

  it("JSON export round-trips", () => {
    expect(JSON.parse(formatResultsJson(result))).toEqual(result);
  });
});

describe("SAMPLE_JD_EXCERPT", () => {
  it("is drawn from the Requirements section of the sample JD", () => {
    expect(SAMPLE_JD_EXCERPT).toContain("JavaScript or TypeScript");
    for (const part of SAMPLE_JD_EXCERPT.split(". ")) {
      expect(SAMPLE_JD).toContain(part.replace(/\.$/, ""));
    }
  });
});
