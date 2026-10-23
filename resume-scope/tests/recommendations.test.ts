import { describe, expect, it } from "vitest";
import { generateRecommendations, type RecommendationInput } from "@/lib/recommendations";

const filler = " Collaborated with teammates on reviews and planning.".repeat(30);
const goodResume =
  "PROJECTS\nBuilt and shipped an app that served 500 users and cut latency by 30%." + filler;

const base: RecommendationInput = {
  score: 70,
  criticalGaps: [],
  moderateGaps: [],
  minorGaps: [],
  matchedSkills: [],
  missingSkills: [],
  resumeText: goodResume,
  jdText: "Full stack engineer",
};

const titles = (over: Partial<RecommendationInput>) =>
  generateRecommendations({ ...base, ...over }).map((r) => r.title);

describe("generateRecommendations — each category", () => {
  it("critical_gap", () => {
    const recs = generateRecommendations({
      ...base,
      criticalGaps: [
        { skill: "docker", count: 4, niceToHave: false },
        { skill: "aws", count: 3, niceToHave: false },
        { skill: "jest", count: 3, niceToHave: false },
        { skill: "git", count: 3, niceToHave: false },
      ],
    });
    expect(recs[0]).toMatchObject({ category: "critical_gap", priority: 100 });
    expect(recs[0].description).toContain("docker, aws, jest and 1 more");
    expect(recs[0].reason).toContain("docker appears 4 times");
  });

  it("critical_gap with three or fewer skills has no '... and N more' suffix", () => {
    const recs = generateRecommendations({
      ...base,
      criticalGaps: [{ skill: "docker", count: 3, niceToHave: false }],
    });
    expect(recs[0].description).not.toContain("more");
  });

  it("differentiation at 85+", () => {
    const recs = generateRecommendations({ ...base, score: 90 });
    expect(recs.find((r) => r.category === "differentiation")?.title).toBe("Shift focus to impact");
  });

  it("keyword_coverage for a low score with several moderate gaps and no critical ones", () => {
    const moderate = ["a", "b", "c"].map((s) => ({ skill: s, count: 2, niceToHave: false }));
    const recs = generateRecommendations({ ...base, score: 40, moderateGaps: moderate });
    const rec = recs.find((r) => r.category === "keyword_coverage");
    expect(rec?.description).toContain("weighted skill coverage is 40%");
  });

  it("impact when no quantified results exist (priority depends on score)", () => {
    const resume = "PROJECTS\nBuilt and shipped an app." + filler;
    const high = generateRecommendations({ ...base, score: 80, resumeText: resume });
    const mid = generateRecommendations({ ...base, score: 60, resumeText: resume });
    expect(high.find((r) => r.category === "impact")?.priority).toBe(90);
    expect(mid.find((r) => r.category === "impact")?.priority).toBe(68);
  });

  it("language when there are no strong verbs", () => {
    const resume = "PROJECTS\nWorked on an app that served 500 users." + filler.replace(/Collaborated/g, "Helped");
    expect(titles({ resumeText: resume })).toContain("Use stronger action verbs");
  });

  it.each([
    ["backend", "We need a backend engineer for our server and database", ["docker"], "Add deployment context"],
    ["ml", "Machine learning with pytorch and tensorflow", ["pytorch"], "Surface ML project evidence"],
    ["frontend", "Frontend work in react and css", ["jest"], "Add testing or accessibility evidence"],
    ["devops", "Kubernetes and terraform infrastructure with ci/cd", ["terraform"], "Add infrastructure and pipeline experience"],
  ])("role_fit: %s", (_role, jdText, missingSkills, title) => {
    const recs = generateRecommendations({ ...base, jdText, missingSkills });
    expect(recs.find((r) => r.category === "role_fit")?.title).toBe(title);
  });

  it("no role_fit when the role's skills are not missing", () => {
    expect(
      generateRecommendations({ ...base, jdText: "backend server database", missingSkills: ["jest"] }).some(
        (r) => r.category === "role_fit"
      )
    ).toBe(false);
  });

  it("structure: missing projects section (only below 75)", () => {
    const resume = "Just prose about things I built and shipped, serving 500 users." + filler;
    expect(titles({ resumeText: resume, score: 60 })).toContain("Label your projects section clearly");
    expect(titles({ resumeText: resume, score: 80 })).not.toContain("Label your projects section clearly");
  });

  it("structure: sparse resume reports the real word count", () => {
    const recs = generateRecommendations({ ...base, resumeText: "PROJECTS\nBuilt 3 things for 50% less." });
    const sparse = recs.find((r) => r.title === "Resume may be too sparse");
    expect(sparse?.description).toMatch(/Only \d+ words/);
  });

  it("differentiation: positive signal when well optimized", () => {
    const recs = generateRecommendations({
      ...base,
      score: 78,
      matchedSkills: ["a", "b", "c", "d", "e", "f"],
    });
    expect(recs.find((r) => r.title === "Resume is well-optimized for this role")).toBeDefined();
  });
});

describe("generateRecommendations — dedupe and top-3", () => {
  it("keeps only the highest-priority rec per category", () => {
    const recs = generateRecommendations({
      ...base,
      score: 90,
      matchedSkills: ["a", "b", "c", "d", "e", "f"],
    });
    const categories = recs.map((r) => r.category);
    expect(new Set(categories).size).toBe(categories.length);
    expect(recs.filter((r) => r.category === "differentiation")).toHaveLength(1);
    expect(recs[0].title).toBe("Shift focus to impact");
  });

  it("returns at most three, sorted by descending priority", () => {
    const recs = generateRecommendations({
      score: 50,
      criticalGaps: [{ skill: "docker", count: 4, niceToHave: false }],
      moderateGaps: [],
      minorGaps: [],
      matchedSkills: [],
      missingSkills: ["docker"],
      resumeText: "I worked on things.",
      jdText: "Backend server work",
    });
    expect(recs.length).toBeLessThanOrEqual(3);
    const priorities = recs.map((r) => r.priority);
    expect([...priorities].sort((a, b) => b - a)).toEqual(priorities);
    expect(recs[0].category).toBe("critical_gap");
  });

  it("returns nothing when nothing applies", () => {
    expect(generateRecommendations({ ...base, score: 60 })).toEqual([]);
  });
});
