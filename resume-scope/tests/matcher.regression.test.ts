/*
  Regression tests for the matcher bugs listed in the Section 1 brief.
  Each case was written to FAIL against the original matcher and pass
  once fixed. Cases are grouped by the bug number in the brief.
*/
import { describe, expect, it } from "vitest";

import { matchSkills } from "@/lib/matcher";
import { calculateMatchScore } from "@/lib/scorer";
import { generateRecommendations } from "@/lib/recommendations";
import { SAMPLE_JD, SAMPLE_RESUME } from "@/lib/sampleData";

const jdSkills = (text: string) => matchSkills("filler", text).jdSkills;
const resumeSkills = (text: string) => matchSkills(text, "filler").resumeSkills;
const score = (resume: string, jd: string) => {
  const r = matchSkills(resume, jd);
  return calculateMatchScore(r.matchedWeight, r.totalWeight);
};

describe("1.1 false positives on ordinary prose", () => {
  const cases: [string, string, string][] = [
    ["CV is not computer vision", "Please attach your CV and a cover letter.", "computer vision"],
    ["'express interest' is not express", "Candidates who express interest will be contacted.", "express"],
    ["'spark of joy' is not spark", "She brings a spark of joy to the team.", "spark"],
    ["'I rest well' is not rest api", "I rest well after long sprints.", "rest api"],
    ["'go ahead' is not go", "Go ahead and apply today.", "go"],
    ["'go to market' is not go", "Our Go to market team is growing.", "go"],
    ["'250 ml' is not machine learning", "Add 250 ml of water.", "machine learning"],
    ["'pg 3' is not postgresql", "See pg 3 of the handbook.", "postgresql"],
    ["'RN' is not react native", "Licensed RN with five years of nursing.", "react native"],
    ["'hf radio' is not huggingface", "Operates hf radio equipment.", "huggingface"],
    ["lowercase 'ts' is not typescript", "Please sign the ts and cs.", "typescript"],
    ["'py' is not python", "Rename the py file.", "python"],
    ["'dl' is not deep learning", "Use the dl link below.", "deep learning"],
    ["verb 'react' is not React", "Be able to react quickly to changing priorities.", "react"],
    ["'tree node' is not node.js", "Each tree node holds a value.", "node.js"],
    ["'Vitamin C' is not C", "Take Vitamin C daily.", "c"],
    ["person named Ruby is not Ruby", "Ruby Sharma, Student", "ruby"],
  ];

  it.each(cases)("%s (JD side)", (_name, text, skill) => {
    expect(jdSkills(text)).not.toContain(skill);
  });

  it.each(cases)("%s (resume side)", (_name, text, skill) => {
    expect(resumeSkills(text)).not.toContain(skill);
  });

  const positives: [string, string, string][] = [
    ["Python, Go, Rust", "Languages: Python, Go, Rust", "go"],
    ["Express.js", "Backend built with Express.js", "express"],
    ["REST APIs", "Building REST APIs", "rest api"],
    ["ML in caps", "Trained ML models for ranking", "machine learning"],
    ["JS in caps", "Strong JS fundamentals", "javascript"],
    ["TS in caps", "Comfortable with TS", "typescript"],
    ["Apache Spark", "Pipelines on Apache Spark", "spark"],
    ["React in a list", "Frontend: React, Redux", "react"],
    ["C with language context", "Systems work in C and C++", "c"],
  ];

  it.each(positives)("still detects: %s", (_name, text, skill) => {
    expect(jdSkills(text)).toContain(skill);
  });
});

describe("1.2 weights count every spelling of a skill", () => {
  const cases: [string, string, string, number][] = [
    ["k8s x4", "k8s k8s k8s k8s", "kubernetes", 4],
    ["JS x4", "JS JS JS JS", "javascript", 4],
    ["C# x3", "C# C# C#", "c#", 3],
    ["mixed spellings of one skill", "Kubernetes, k8s and kube", "kubernetes", 3],
  ];

  it.each(cases)("%s", (_name, text, skill, expected) => {
    expect(matchSkills("filler", text).skillFrequency[skill]).toBe(expected);
  });
});

describe("1.3 no double counting", () => {
  it("GitHub Actions does not also yield github", () => {
    const skills = jdSkills("Experience with GitHub Actions");
    expect(skills).toContain("github actions");
    expect(skills).not.toContain("github");
  });

  it("React Native does not also yield react", () => {
    expect(jdSkills("Build apps with React Native")).not.toContain("react");
  });

  it("Tailwind CSS does not also yield css", () => {
    const skills = jdSkills("Styling with Tailwind CSS");
    expect(skills).toContain("tailwind");
    expect(skills).not.toContain("css");
  });

  it("'version control' is not mapped to git", () => {
    expect(jdSkills("Experience with version control")).not.toContain("git");
  });

  it("'Git and version control' does not inflate git's weight", () => {
    const r = matchSkills("filler", "Understanding of Git and version control");
    expect(r.skillFrequency["git"]).toBe(1);
  });
});

describe("1.4 skill hierarchy and the single-letter skill", () => {
  const cases: [string, string, string][] = [
    ["GitHub satisfies git", "Projects: shipped with GitHub pull requests", "Requirements: Git"],
    ["PostgreSQL satisfies sql", "Projects: tuned PostgreSQL queries", "Requirements: SQL"],
    ["MySQL satisfies sql", "Projects: designed MySQL schemas", "Requirements: SQL"],
    ["SQLite satisfies sql", "Projects: embedded SQLite storage", "Requirements: SQL"],
  ];

  it.each(cases)("%s", (_name, resume, jd) => {
    const r = matchSkills(resume, jd);
    expect(r.missingSkills).toEqual([]);
    expect(r.matchedSkills.length).toBe(1);
  });

  it("detects C when it sits among other languages", () => {
    expect(jdSkills("Proficiency in C and C++ is required")).toEqual(
      expect.arrayContaining(["c", "c++"])
    );
  });

  it("matches resume C against JD C", () => {
    const r = matchSkills(
      "Languages: C, C++, Python. Built a kernel module in C.",
      "Requirements: C programming"
    );
    expect(r.matchedSkills).toContain("c");
  });
});

describe("1.5 required vs nice-to-have", () => {
  const jd = `Requirements
- Docker

Nice to Have
- Kubernetes`;

  it("down-weights nice-to-have skills", () => {
    const r = matchSkills("Projects: built with Docker", jd);
    expect(r.totalWeight).toBeCloseTo(1.5);
    expect(score("Projects: built with Docker", jd)).toBe(67);
  });

  it("missing a nice-to-have costs less than missing a required skill", () => {
    const missNice = score("Projects: built with Docker", jd);
    const missRequired = score("Projects: built with Kubernetes", jd);
    expect(missNice).toBeGreaterThan(missRequired);
  });

  it("honours inline 'is a plus' cues", () => {
    const r = matchSkills("x", "We use Docker. Experience with Kubernetes is a plus.");
    expect(r.totalWeight).toBeCloseTo(1.5);
  });
});

describe("1.6 keyword stuffing", () => {
  const jd = "Requirements\n- React\n- Node.js\n- Docker\n- PostgreSQL";

  it("a bare skills list no longer scores 100%", () => {
    const stuffed = "SKILLS\nReact, Node.js, Docker, PostgreSQL";
    expect(score(stuffed, jd)).toBeLessThan(100);
    expect(score(stuffed, jd)).toBeGreaterThan(0);
  });

  it("skills shown in project context score higher than a bare list", () => {
    const stuffed = "SKILLS\nReact, Node.js, Docker, PostgreSQL";
    const shown = `SKILLS
React, Node.js, Docker, PostgreSQL

PROJECTS
Built a dashboard in React backed by Node.js and PostgreSQL, shipped in Docker.`;
    expect(score(shown, jd)).toBe(100);
    expect(score(shown, jd)).toBeGreaterThan(score(stuffed, jd));
  });
});

describe("1.7 PDF-extraction artifacts", () => {
  const cases: [string, string, string][] = [
    ["ci-cd", "Pipelines with ci-cd", "ci/cd"],
    ["github-actions", "Workflows in github-actions", "github actions"],
    ["rest-api", "Designed a rest-api", "rest api"],
    ["Next. js", "Built with Next. js", "next.js"],
    ["scikit learn", "Models in scikit learn", "scikit-learn"],
    ["soft hyphen", "Wrote Type\u00ADScript daily", "typescript"],
    ["line-break hyphen", "Wrote Type-\nScript daily", "typescript"],
    ["ligature", "Built a \uFB01ne Pytorch pipeline", "pytorch"],
  ];

  it.each(cases)("%s", (_name, text, skill) => {
    expect(resumeSkills(text)).toContain(skill);
    expect(jdSkills(text)).toContain(skill);
  });
});

describe("1.8 recommendations: role inference and section detection", () => {
  /* Long enough (200+ words) that the "too sparse" structure rec stays out of the way. */
  const padding = " Collaborated with teammates on reviews and planning.".repeat(30);
  const base = {
    score: 70,
    criticalGaps: [],
    moderateGaps: [],
    minorGaps: [],
    matchedSkills: [],
    missingSkills: ["jest", "docker"],
    resumeText:
      "PROJECTS\nBuilt an app that served 500 users and reduced latency by 30%." +
      padding,
  };

  it("'build', 'guide', 'requirements' do not make a role frontend", () => {
    const titles = generateRecommendations({
      ...base,
      jdText: "We build and guide the server layer. See requirements.",
    }).map((r) => r.title);
    expect(titles).toContain("Add deployment context");
    expect(titles).not.toContain("Add testing or accessibility evidence");
  });

  it("the word 'projects' in prose is not a projects section", () => {
    const titles = generateRecommendations({
      ...base,
      score: 60,
      resumeText:
        "I enjoy side projects in my spare time and built a few apps that served 500 users." +
        padding,
      jdText: "Backend engineer",
    }).map((r) => r.title);
    expect(titles).toContain("Label your projects section clearly");
  });

  it("a real PROJECTS heading is detected", () => {
    const titles = generateRecommendations({
      ...base,
      score: 60,
      jdText: "Backend engineer",
    }).map((r) => r.title);
    expect(titles).not.toContain("Label your projects section clearly");
  });
});

describe("1.9 summary wording", () => {
  it("does not claim the weighted score is a share of skills", async () => {
    const { POST } = await import("@/app/api/analyze/route");
    const res = await POST(
      new Request("http://test/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: SAMPLE_RESUME,
          jobDescription: SAMPLE_JD,
        }),
      })
    );
    const body = await res.json();
    expect(body).not.toHaveProperty("aiExplanation");
    expect(typeof body.summary).toBe("string");
    expect(body.summary).not.toMatch(/matches \d+% of the skills/i);
    expect(body.summary).toMatch(/weighted/i);
  });
});

describe("1.10 sample data demo", () => {
  it("scores a realistic mid-to-strong match with a few meaningful gaps", () => {
    const r = matchSkills(SAMPLE_RESUME, SAMPLE_JD);
    const s = calculateMatchScore(r.matchedWeight, r.totalWeight);
    expect(s).toBeGreaterThanOrEqual(70);
    expect(s).toBeLessThanOrEqual(88);
    expect(r.missingSkills.length).toBeGreaterThanOrEqual(2);
    expect(r.missingSkills.length).toBeLessThanOrEqual(5);
  });
});
