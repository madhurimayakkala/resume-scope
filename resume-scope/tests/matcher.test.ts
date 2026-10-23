import { describe, expect, it } from "vitest";
import {
  LISTED_ONLY_CREDIT,
  MAX_SKILL_WEIGHT,
  matchSkills,
} from "@/lib/matcher";
import { SKILL_KEYWORDS, SKILL_SATISFIED_BY, AMBIGUOUS_TERMS } from "@/lib/skillKeywords";
import { SYNONYMS } from "@/lib/synonyms";
import { buildSummary } from "@/lib/summary";
import { calculateMatchScore } from "@/lib/scorer";

describe("taxonomy integrity", () => {
  const keywords = new Set(SKILL_KEYWORDS);

  it("every synonym maps to a known skill", () => {
    const unknown = Object.values(SYNONYMS).filter((v) => !keywords.has(v));
    expect([...new Set(unknown)]).toEqual([]);
  });

  it("all keys and values are lowercase", () => {
    for (const [k, v] of Object.entries(SYNONYMS)) {
      expect(k).toBe(k.toLowerCase());
      expect(v).toBe(v.toLowerCase());
    }
  });

  it("hierarchy only references known skills", () => {
    for (const [parent, children] of Object.entries(SKILL_SATISFIED_BY)) {
      expect(keywords.has(parent)).toBe(true);
      children.forEach((c) => expect(keywords.has(c)).toBe(true));
    }
  });

  it("ambiguity rules are keyed by lowercase surface forms", () => {
    Object.keys(AMBIGUOUS_TERMS).forEach((k) => expect(k).toBe(k.toLowerCase()));
  });

  it("has no duplicate keywords", () => {
    expect(SKILL_KEYWORDS.length).toBe(keywords.size);
  });
});

describe("extraction edge cases", () => {
  it("returns an empty result for empty input", () => {
    const r = matchSkills("", "");
    expect(r.jdSkills).toEqual([]);
    expect(r.totalWeight).toBe(0);
    expect(calculateMatchScore(r.matchedWeight, r.totalWeight)).toBe(0);
  });

  it("is case-insensitive for unambiguous skills", () => {
    expect(matchSkills("", "POSTGRESQL and Docker and kubernetes").jdSkills).toEqual([
      "postgresql",
      "docker",
      "kubernetes",
    ]);
  });

  it("orders skills by first appearance", () => {
    expect(matchSkills("", "Docker then React then Python").jdSkills).toEqual([
      "docker",
      "react",
      "python",
    ]);
  });

  it("accepts plurals and separator variants", () => {
    const skills = matchSkills("", "microservice, algorithm, web socket, github action").jdSkills;
    expect(skills).toEqual(
      expect.arrayContaining(["microservices", "algorithms", "websockets", "github actions"])
    );
  });

  it("does not let '. ' glue a sentence-ending 'rest' to the next word", () => {
    expect(matchSkills("", "Take the rest. API docs follow.").jdSkills).not.toContain("rest api");
  });

  it("detects .NET and C++ and C# symbols", () => {
    expect(matchSkills("", "Experience in .NET, C++ and C#").jdSkills).toEqual([
      ".net",
      "c++",
      "c#",
    ]);
  });

  it("does not read 'net income' as .NET", () => {
    expect(matchSkills("", "Net income grew").jdSkills).not.toContain(".net");
  });

  it("denies TS/SCI clearance as TypeScript", () => {
    expect(matchSkills("", "Active TS/SCI clearance").jdSkills).not.toContain("typescript");
  });

  it("denies 'React to' as the library but accepts lowercase react in a tech list", () => {
    expect(matchSkills("", "React to feedback quickly").jdSkills).not.toContain("react");
    expect(matchSkills("", "frontend: react, redux").jdSkills).toContain("react");
  });

  it("requires context for context-gated capitalized terms", () => {
    expect(matchSkills("", "Express yourself. Spark ideas.").jdSkills).toEqual([]);
    expect(matchSkills("", "Node and Express for the backend").jdSkills).toEqual([
      "node.js",
      "express",
    ]);
    expect(matchSkills("", "Streaming with Kafka and Spark").jdSkills).toEqual(
      expect.arrayContaining(["kafka", "spark"])
    );
  });
});

describe("weights", () => {
  it("caps the weight of a repeated skill", () => {
    const r = matchSkills("", "Docker. ".repeat(9));
    expect(r.skillFrequency.docker).toBe(9);
    expect(r.skillWeights.docker).toBe(MAX_SKILL_WEIGHT);
  });

  it("tiers gaps by weight and sorts the heaviest first", () => {
    const jd = "Docker Docker Docker Jest Jest Git";
    const r = matchSkills("none", jd);
    expect(r.criticalGaps).toEqual([{ skill: "docker", count: 3, niceToHave: false }]);
    expect(r.moderateGaps).toEqual([{ skill: "jest", count: 2, niceToHave: false }]);
    expect(r.minorGaps).toEqual([{ skill: "git", count: 1, niceToHave: false }]);
  });

  it("a nice-to-have skill can never become critical", () => {
    const r = matchSkills("none", "Nice to Have\nDocker Docker Docker Docker Docker");
    expect(r.criticalGaps).toEqual([]);
    expect(r.moderateGaps[0]).toMatchObject({ skill: "docker", niceToHave: true });
  });

  it("a skill that is also required elsewhere stays required", () => {
    const r = matchSkills("", "Docker is required.\nNice to Have\nDocker");
    expect(r.skillWeights.docker).toBe(2);
  });
});

describe("evidence credit", () => {
  const jd = "Requirements\n- React";

  it("lists-only gets partial credit, context gets full", () => {
    const listed = matchSkills("SKILLS\nReact", jd);
    expect(listed.partialSkills).toEqual(["react"]);
    expect(listed.matchedWeight).toBeCloseTo(LISTED_ONLY_CREDIT);

    const shown = matchSkills("PROJECTS\nBuilt a UI in React", jd);
    expect(shown.partialSkills).toEqual([]);
    expect(shown.matchedWeight).toBe(1);
  });

  it("falls back to a list-shape heuristic when there are no headings", () => {
    const r = matchSkills("React, Node.js, Docker, Jest", jd);
    expect(r.partialSkills).toEqual(["react"]);
    const prose = matchSkills("I built the checkout flow in React last year.", jd);
    expect(prose.partialSkills).toEqual([]);
  });

  it("records the skill that satisfied a hierarchy match", () => {
    const r = matchSkills("PROJECTS\nShipped using GitHub", "Requirements\n- Git");
    expect(r.matchedVia).toEqual({ git: "github" });
  });

  it("does not satisfy the other direction (git does not give github)", () => {
    const r = matchSkills("PROJECTS\nUsed Git daily", "Requirements\n- GitHub");
    expect(r.missingSkills).toEqual(["github"]);
  });

  it("drops the 'version control' umbrella when Git is also in the JD", () => {
    expect(matchSkills("", "Git and version control").jdSkills).toEqual(["git"]);
    expect(matchSkills("", "version control").jdSkills).toEqual(["version control"]);
  });

  it("version control is satisfied by git", () => {
    const r = matchSkills("PROJECTS\nUsed Git daily", "Experience with version control");
    expect(r.missingSkills).toEqual([]);
  });
});

describe("buildSummary", () => {
  it("describes a weighted score, never a share of skills", () => {
    const r = matchSkills("SKILLS\nReact", "Requirements\n- React\n- Docker Docker Docker");
    const text = buildSummary(30, r);
    expect(text).toMatch(/Weighted skill coverage is 30%/);
    expect(text).toMatch(/partial credit\): react/);
    expect(text).toMatch(/Critical gaps: docker \(3×\)/);
    expect(text).toMatch(/Minor gaps: None/);
  });

  it("handles a JD with no recognizable skills", () => {
    expect(buildSummary(0, matchSkills("x", "We value kindness."))).toMatch(/No recognizable skills/);
  });

  it("omits the partial-credit sentence when there is none", () => {
    const r = matchSkills("PROJECTS\nBuilt in React", "React");
    expect(buildSummary(100, r)).not.toMatch(/partial credit/);
  });
});
