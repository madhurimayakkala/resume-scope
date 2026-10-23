import { describe, expect, it } from "vitest";
import {
  classifyResumeHeading,
  detectJdSections,
  detectResumeSections,
  hasResumeSection,
  isListLikeLine,
  isNiceSentence,
  lineIndexAt,
  sentenceAt,
  splitLines,
} from "@/lib/sections";
import { escapeRegExp, normalizeForExtraction } from "@/lib/utils";

describe("classifyResumeHeading", () => {
  const cases: [string, ReturnType<typeof classifyResumeHeading>][] = [
    ["SKILLS", "skills"],
    ["Technical Skills:", "skills"],
    ["Skills & Tools", "skills"],
    ["Tech Stack", "skills"],
    ["PROJECTS", "projects"],
    ["Personal Projects", "projects"],
    ["## Work Experience", "experience"],
    ["Employment History", "experience"],
    ["Internships", "experience"],
    ["Education", "other"],
    ["COURSEWORK", "other"],
    ["I enjoy side projects in my spare time", null],
    ["Projects, skills and more things here", null],
    ["- Projects", null],
    ["", null],
  ];
  it.each(cases)("%j -> %s", (line, expected) => {
    expect(classifyResumeHeading(line)).toBe(expected);
  });
});

describe("detectResumeSections", () => {
  it("assigns each line to the nearest preceding heading", () => {
    const { byLine } = detectResumeSections("Name\nSKILLS\nReact\nPROJECTS\nBuilt X");
    expect(byLine).toEqual([null, "skills", "skills", "projects", "projects"]);
  });

  it("treats an inline 'Skills:' label as a skills line", () => {
    const { byLine } = detectResumeSections("Skills: React, Node\nBuilt a thing");
    expect(byLine[0]).toBe("skills");
  });

  it("hasResumeSection only trusts heading lines", () => {
    expect(hasResumeSection("PROJECTS\nx", "projects")).toBe(true);
    expect(hasResumeSection("my projects are fun", "projects")).toBe(false);
    expect(hasResumeSection("Work Experience\nx", "experience")).toBe(true);
  });
});

describe("isListLikeLine", () => {
  it("accepts bare comma lists, with or without a label", () => {
    expect(isListLikeLine("React, Node.js, Docker")).toBe(true);
    expect(isListLikeLine("Languages: JavaScript, Python, Go")).toBe(true);
  });
  it("rejects sentences and short lists", () => {
    expect(isListLikeLine("Built with React, Node.js, and PostgreSQL.")).toBe(false);
    expect(isListLikeLine("React, Node.js")).toBe(false);
    expect(isListLikeLine("")).toBe(false);
    expect(isListLikeLine("Label:")).toBe(false);
  });
});

describe("detectJdSections", () => {
  const jd = [
    "About the Role",
    "- Docker",
    "Requirements",
    "- React",
    "Nice to Have:",
    "- AWS",
    "Preferred Qualifications",
    "- GCP",
    "Responsibilities",
    "- Ship",
  ].join("\n");

  it("flips to nice-to-have under those headings and resets on others", () => {
    expect(detectJdSections(jd).byLine).toEqual([
      "required", "required", "required", "required",
      "nice", "nice", "nice", "nice",
      "required", "required",
    ]);
  });

  it("ignores bullets that merely look like headings", () => {
    expect(detectJdSections("- Nice to have\nDocker").byLine).toEqual(["required", "required"]);
  });
});

describe("isNiceSentence / sentenceAt", () => {
  const nice = [
    "Kubernetes is a plus.",
    "TypeScript preferred",
    "Bonus points for Rust",
    "Terraform (plus)",
    "Ideally some Go",
    "Experience with Docker is a bonus",
  ];
  const required = ["Experience with Docker", "5+ years of Java", "Must know React"];

  it.each(nice)("nice: %s", (s) => expect(isNiceSentence(s)).toBe(true));
  it.each(required)("required: %s", (s) => expect(isNiceSentence(s)).toBe(false));

  it("scopes a cue to its own sentence", () => {
    const line = "We use Docker. Kubernetes is a plus.";
    expect(sentenceAt(line, 8)).toBe("We use Docker.");
    expect(sentenceAt(line, 20)).toBe("Kubernetes is a plus.");
    expect(sentenceAt("one", 99)).toBe("one");
  });
});

describe("line helpers", () => {
  it("splitLines tracks offsets and lineIndexAt finds the line", () => {
    const lines = splitLines("ab\ncde\nf");
    expect(lines.map((l) => [l.start, l.end])).toEqual([[0, 2], [3, 6], [7, 8]]);
    expect([0, 2, 3, 5, 7].map((o) => lineIndexAt(lines, o))).toEqual([0, 0, 1, 1, 2]);
  });
});

describe("normalizeForExtraction", () => {
  const cases: [string, string, string][] = [
    ["soft hyphen", "Type\u00ADScript", "TypeScript"],
    ["zero-width chars", "Re\u200Bact", "React"],
    ["CRLF", "a\r\nb", "a\nb"],
    ["ligature", "\uFB01x", "fix"],
    ["unicode dashes", "2022 \u2013 2026", "2022 - 2026"],
    ["line-break hyphen join", "Type-\nScript", "TypeScript"],
    ["collapses runs of spaces", "a   b\t\tc", "a b c"],
    ["strips emails", "mail me@x.com now", "mail now"],
    ["strips profile urls", "see github.com/me/repo ok", "see ok"],
    ["strips https urls", "go https://x.dev/a?b=1 now", "go now"],
  ];
  it.each(cases)("%s", (_n, input, expected) => {
    expect(normalizeForExtraction(input)).toBe(expected);
  });

  it("escapeRegExp escapes metacharacters", () => {
    expect(escapeRegExp("c++ (a.b)")).toBe("c\\+\\+ \\(a\\.b\\)");
  });
});
