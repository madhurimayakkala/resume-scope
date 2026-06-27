export interface Recommendation {
  title: string;
  description: string;
  reason: string;
  priority: number;
  category:
    | "critical_gap"
    | "keyword_coverage"
    | "impact"
    | "language"
    | "role_fit"
    | "differentiation"
    | "structure";
}

interface GapSkill {
  skill: string;
  count: number;
}

interface ResumeSignals {
  hasQuantifiedImpact: boolean;
  hasStrongVerbs: boolean;
  hasProjectsSection: boolean;
  hasExperienceSection: boolean;
  wordCount: number;
}

export interface RecommendationInput {
  score: number;
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
  matchedSkills: string[];
  missingSkills: string[];
  resumeText: string;
  jdText: string;
}

function detectResumeSignals(resumeText: string): ResumeSignals {
  return {
    hasQuantifiedImpact:
      /\d+\s*%|\d+x\b|\$\s*\d+|\d+\s*k\b|\d+\s*users|\d+\s*ms|\d+\s*requests/i.test(
        resumeText
      ),
    hasStrongVerbs:
      /\b(built|shipped|reduced|increased|led|designed|architected|deployed|optimized|improved|launched|developed|implemented|scaled|automated|refactored|integrated|migrated|delivered|engineered)\b/i.test(
        resumeText
      ),
    hasProjectsSection: /\bprojects?\b/i.test(resumeText),
    hasExperienceSection:
      /\b(experience|work history|employment)\b/i.test(resumeText),
    wordCount: resumeText.split(/\s+/).filter(Boolean).length,
  };
}

function inferRoleType(jdText: string): string {
  const text = jdText.toLowerCase();

  const scores: Record<string, number> = {
    ml: 0,
    devops: 0,
    frontend: 0,
    backend: 0,
  };

  const indicators: Record<string, string[]> = {
    ml: [
      "tensorflow",
      "pytorch",
      "machine learning",
      "deep learning",
      "nlp",
      "computer vision",
      "model training",
      "data science",
      "scikit",
      "huggingface",
      "langchain",
    ],
    devops: [
      "kubernetes",
      "terraform",
      "ci/cd",
      "infrastructure",
      "helm",
      "ansible",
      "sre",
      "observability",
      "prometheus",
      "grafana",
    ],
    frontend: [
      "react",
      "next.js",
      "vue",
      "angular",
      "css",
      "ui",
      "ux",
      "frontend",
      "accessibility",
      "responsive",
    ],
    backend: [
      "node.js",
      "postgresql",
      "rest api",
      "graphql",
      "microservices",
      "backend",
      "server",
      "database",
      "api design",
      "fastapi",
      "django",
    ],
  };

  for (const [role, keywords] of Object.entries(indicators)) {
    scores[role] = keywords.filter((k) => text.includes(k)).length;
  }

  const max = Math.max(...Object.values(scores));
  if (max === 0) return "fullstack";

  return (
    Object.entries(scores).find(([, score]) => score === max)?.[0] ??
    "fullstack"
  );
}

export function generateRecommendations(
  input: RecommendationInput
): Recommendation[] {
  const {
    score,
    criticalGaps,
    moderateGaps,
    missingSkills,
    matchedSkills,
    resumeText,
    jdText,
  } = input;

  const signals = detectResumeSignals(resumeText);
  const roleType = inferRoleType(jdText);
  const recs: Recommendation[] = [];

  /*
    CRITICAL GAPS
    Surface the most urgent missing skills with frequency context.
  */
  if (criticalGaps.length > 0) {
    const topSkill = criticalGaps[0];
    const listed = criticalGaps
      .slice(0, 3)
      .map((g) => g.skill)
      .join(", ");
    const remainder = criticalGaps.length - 3;
    const suffix = remainder > 0 ? ` and ${remainder} more` : "";

    recs.push({
      title: "Add high-priority missing skills",
      description: `Your resume is missing: ${listed}${suffix}. These appear repeatedly in the job description and are likely core requirements, not optional preferences.`,
      reason: `${topSkill.skill} appears ${topSkill.count} times in this job description — a strong signal it is non-negotiable for this role.`,
      priority: 100,
      category: "critical_gap",
    });
  }

  /*
    HIGH SCORE — shift focus from keywords to differentiation
  */
  if (score >= 85) {
    recs.push({
      title: "Shift focus to impact",
      description:
        "Your keyword coverage is strong. The next barrier is standing out to a human reviewer — make your project outcomes specific and measurable.",
      reason: `At ${score}%, further keyword optimization has diminishing returns. Human review is the bottleneck now.`,
      priority: 95,
      category: "differentiation",
    });
  }

  /*
    MODERATE KEYWORD GAP
  */
  if (score < 60 && criticalGaps.length === 0 && moderateGaps.length > 2) {
    const listed = moderateGaps
      .slice(0, 4)
      .map((g) => g.skill)
      .join(", ");

    recs.push({
      title: "Improve keyword coverage",
      description: `Your resume matches ${score}% of the skills detected in this job description. Consider incorporating: ${listed}.`,
      reason:
        "These terms appear more than once in the job description, which typically indicates they are expected rather than preferred.",
      priority: 80,
      category: "keyword_coverage",
    });
  }

  /*
    QUANTIFIED IMPACT
  */
  if (score >= 55 && !signals.hasQuantifiedImpact) {
    recs.push({
      title: "Add measurable outcomes",
      description:
        "No quantified results were detected. Add metrics where honest — users reached, latency reduced, test coverage added, or load handled. Numbers make technical claims credible.",
      reason:
        "Your keyword match is reasonable, but descriptions without metrics are harder for reviewers to evaluate.",
      priority: score >= 75 ? 90 : 68,
      category: "impact",
    });
  }

  /*
    WEAK ACTION VERBS
  */
  if (!signals.hasStrongVerbs && signals.wordCount > 80) {
    recs.push({
      title: "Use stronger action verbs",
      description:
        "Replace passive phrasing like 'worked on' or 'was responsible for' with ownership language: built, shipped, reduced, optimized, architected, delivered.",
      reason:
        "Action verbs signal ownership and initiative — two things engineering reviewers look for in project descriptions.",
      priority: 62,
      category: "language",
    });
  }

  /*
    ROLE-SPECIFIC: BACKEND
  */
  if (
    roleType === "backend" &&
    missingSkills.some((s) =>
      ["docker", "kubernetes", "aws", "ci/cd", "linux"].includes(
        s.toLowerCase()
      )
    )
  ) {
    recs.push({
      title: "Add deployment context",
      description:
        "Backend roles typically expect production deployment experience. If you have used Docker, a cloud provider, or any CI/CD pipeline — even for a personal project — add it explicitly.",
      reason:
        "Deployment skills are absent from your resume but present in this job description. Backend roles increasingly own their own infrastructure.",
      priority: 74,
      category: "role_fit",
    });
  }

  /*
    ROLE-SPECIFIC: ML
  */
  if (
    roleType === "ml" &&
    missingSkills.some((s) =>
      ["tensorflow", "pytorch", "python", "scikit-learn"].includes(
        s.toLowerCase()
      )
    )
  ) {
    recs.push({
      title: "Surface ML project evidence",
      description:
        "Add a project entry with the model type, dataset, and a measurable result. Stating the framework and task is more credible than listing skills alone.",
      reason:
        "ML roles weight project evidence heavily. A skills list without a corresponding project is a weak signal.",
      priority: 82,
      category: "role_fit",
    });
  }

  /*
    ROLE-SPECIFIC: FRONTEND
  */
  if (
    roleType === "frontend" &&
    missingSkills.some((s) =>
      ["jest", "cypress", "playwright", "vitest", "accessibility"].includes(
        s.toLowerCase()
      )
    )
  ) {
    recs.push({
      title: "Add testing or accessibility evidence",
      description:
        "Frontend roles increasingly require testing and accessibility awareness. If you have written tests or implemented ARIA roles, make that explicit.",
      reason:
        "Testing and accessibility skills appear in this JD but are not reflected in your resume.",
      priority: 70,
      category: "role_fit",
    });
  }

  /*
    STRUCTURE: MISSING PROJECTS SECTION
  */
  if (!signals.hasProjectsSection && score < 75) {
    recs.push({
      title: "Label your projects section clearly",
      description:
        "No projects section was detected. Make sure your projects are under a heading that contains the word 'Projects' so parsers can identify it correctly.",
      reason:
        "ATS systems and resume parsers look for section headers. Unlabeled sections are often skipped.",
      priority: 72,
      category: "structure",
    });
  }

  /*
    STRUCTURE: SHORT RESUME
  */
  if (signals.wordCount < 200) {
    recs.push({
      title: "Resume may be too sparse",
      description: `Only ${signals.wordCount} words were detected. This could indicate a PDF parsing issue, or the resume may need more content. Most competitive SWE resumes run 400–600 words.`,
      reason:
        "Short resumes often score lower not because of missing skills but because there is not enough text for the parser to extract from.",
      priority: 78,
      category: "structure",
    });
  }

  /*
    POSITIVE SIGNAL: WELL OPTIMIZED
  */
  if (
    matchedSkills.length >= 6 &&
    score >= 70 &&
    criticalGaps.length === 0 &&
    signals.hasQuantifiedImpact
  ) {
    recs.push({
      title: "Resume is well-optimized for this role",
      description: `You match ${matchedSkills.length} skills with no critical gaps and measurable impact in your descriptions. Focus on the cover letter and tailoring your project narrative to this company.`,
      reason:
        "Strong keyword coverage, no critical gaps, and quantified outcomes — the resume is competitive.",
      priority: 60,
      category: "differentiation",
    });
  }

  /*
    DEDUPLICATE by category, sort by priority, return top 3
  */
  const seen = new Set<string>();
  const deduplicated = recs
    .sort((a, b) => b.priority - a.priority)
    .filter((rec) => {
      if (seen.has(rec.category)) return false;
      seen.add(rec.category);
      return true;
    });

  return deduplicated.slice(0, 3);
}