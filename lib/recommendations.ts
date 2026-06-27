export interface Recommendation {
  title: string;
  description: string;
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

interface RecommendationInput {
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
    hasQuantifiedImpact: /\d+\s*%|\d+x\b|\$\s*\d+|\d+\s*k\b|\d+\s*users|\d+\s*ms/i.test(
      resumeText
    ),
    hasStrongVerbs:
      /\b(built|shipped|reduced|increased|led|designed|architected|deployed|optimized|improved|launched|developed|implemented|scaled|automated|refactored|integrated|migrated)\b/i.test(
        resumeText
      ),
    hasProjectsSection: /\bprojects?\b/i.test(resumeText),
    hasExperienceSection: /\b(experience|work history|employment)\b/i.test(
      resumeText
    ),
    wordCount: resumeText.split(/\s+/).filter(Boolean).length,
  };
}

function inferRoleType(jdText: string): string {
  const text = jdText.toLowerCase();

  const mlKeywords = [
    "tensorflow",
    "pytorch",
    "machine learning",
    "deep learning",
    "nlp",
    "computer vision",
    "model training",
    "data science",
  ];

  const devopsKeywords = [
    "kubernetes",
    "terraform",
    "ci/cd",
    "infrastructure",
    "helm",
    "ansible",
    "sre",
    "observability",
  ];

  const frontendKeywords = [
    "react",
    "next.js",
    "vue",
    "angular",
    "css",
    "ui",
    "ux",
    "frontend",
    "accessibility",
  ];

  const backendKeywords = [
    "node.js",
    "postgresql",
    "rest api",
    "graphql",
    "microservices",
    "backend",
    "server",
    "database",
  ];

  const mlScore = mlKeywords.filter((k) => text.includes(k)).length;
  const devopsScore = devopsKeywords.filter((k) => text.includes(k)).length;
  const frontendScore = frontendKeywords.filter((k) => text.includes(k)).length;
  const backendScore = backendKeywords.filter((k) => text.includes(k)).length;

  const max = Math.max(mlScore, devopsScore, frontendScore, backendScore);

  if (max === 0) return "fullstack";
  if (mlScore === max) return "ml";
  if (devopsScore === max) return "devops";
  if (frontendScore === max) return "frontend";
  if (backendScore === max) return "backend";

  return "fullstack";
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
    CRITICAL GAPS — always surfaces first if present
  */

  if (criticalGaps.length > 0) {
    const topGaps = criticalGaps
      .slice(0, 3)
      .map((g) => `${g.skill} (${g.count}×)`)
      .join(", ");

    const remainder = criticalGaps.length - 3;
    const suffix =
      remainder > 0 ? ` and ${remainder} more` : "";

    recs.push({
      title: "Add high-frequency missing skills",
      description: `These skills appear most in the job description but are absent from your resume: ${topGaps}${suffix}. Add them to your skills section and, where honest, demonstrate usage in project or experience descriptions.`,
      priority: 100,
      category: "critical_gap",
    });
  }

  /*
    HIGH SCORE — keyword advice is suppressed, focus on differentiation
  */

  if (score >= 85) {
    recs.push({
      title: "Strong match — focus on impact now",
      description: `At ${score}%, further keyword optimization has diminishing returns. Human reviewers will see this resume next. Make your project outcomes specific and measurable to stand out from other candidates with similar keyword coverage.`,
      priority: 95,
      category: "differentiation",
    });
  }

  /*
    LOW-TO-MID SCORE — keyword coverage is the blocker
  */

  if (score < 60 && criticalGaps.length === 0 && moderateGaps.length > 2) {
    const topModerate = moderateGaps
      .slice(0, 4)
      .map((g) => g.skill)
      .join(", ");

    recs.push({
      title: "Improve keyword coverage",
      description: `Your resume matches ${score}% of detected keywords. Mirror the job description's terminology more closely — especially: ${topModerate}. Avoid stuffing; integrate these naturally into descriptions.`,
      priority: 80,
      category: "keyword_coverage",
    });
  }

  /*
    QUANTIFIED IMPACT — relevant when score is decent but descriptions are weak
  */

  if (score >= 55 && !signals.hasQuantifiedImpact) {
    recs.push({
      title: "Quantify your project impact",
      description:
        "Your keyword match is reasonable, but no measurable outcomes were detected. Add numbers where honest — users reached, latency reduced, test coverage added, or requests handled. Metrics make claims credible to hiring managers.",
      priority: score >= 75 ? 90 : 68,
      category: "impact",
    });
  }

  /*
    ACTION VERBS — weak language in descriptions
  */

  if (!signals.hasStrongVerbs && signals.wordCount > 80) {
    recs.push({
      title: "Strengthen your action verbs",
      description:
        'Resume descriptions may be using passive language. Replace phrases like "worked on" or "was responsible for" with concrete verbs: built, shipped, reduced, optimized, architected, integrated. Strong verbs signal ownership.',
      priority: 62,
      category: "language",
    });
  }

  /*
    ROLE-SPECIFIC GAPS
  */

  if (
    roleType === "backend" &&
    missingSkills.some((s) =>
      ["docker", "kubernetes", "aws", "ci/cd"].includes(s.toLowerCase())
    )
  ) {
    recs.push({
      title: "Add deployment context for backend roles",
      description:
        "This backend role expects deployment experience. If you have used Docker, Vercel, Railway, or any cloud provider — even for a side project — add it explicitly. Backend roles assume production ownership.",
      priority: 74,
      category: "role_fit",
    });
  }

  if (
    roleType === "ml" &&
    missingSkills.some((s) =>
      ["tensorflow", "pytorch", "python"].includes(s.toLowerCase())
    )
  ) {
    recs.push({
      title: "Surface ML-specific project evidence",
      description:
        "This ML role expects hands-on model work. If you have built or fine-tuned any model — even a course project — add it with the model type, dataset, and metric. Stating the framework and task is more credible than listing skills alone.",
      priority: 82,
      category: "role_fit",
    });
  }

  if (
    roleType === "frontend" &&
    missingSkills.some((s) =>
      ["accessibility", "jest", "cypress", "playwright"].includes(
        s.toLowerCase()
      )
    )
  ) {
    recs.push({
      title: "Add testing or accessibility evidence",
      description:
        "Frontend roles increasingly require testing and accessibility awareness. If you have written any tests or implemented ARIA roles or keyboard navigation, make that explicit in your descriptions.",
      priority: 70,
      category: "role_fit",
    });
  }

  /*
    STRUCTURE — missing sections
  */

  if (!signals.hasProjectsSection && score < 75) {
    recs.push({
      title: "Projects section may be missing or unlabeled",
      description:
        "No clearly labeled projects section was detected. ATS systems scan for section headers. Make sure your projects are under a heading that uses the word 'Projects' so they are parsed correctly.",
      priority: 72,
      category: "structure",
    });
  }

  if (signals.wordCount < 200) {
    recs.push({
      title: "Resume appears short",
      description: `Only ${signals.wordCount} words were detected. This may indicate a parsing issue with your PDF, or the resume may be too sparse. Most competitive resumes for SWE roles run 400–600 words for a single page.`,
      priority: 78,
      category: "structure",
    });
  }

  /*
    ALREADY STRONG — positive signal when matched skills are broad
  */

  if (
    matchedSkills.length >= 6 &&
    score >= 70 &&
    criticalGaps.length === 0 &&
    signals.hasQuantifiedImpact
  ) {
    recs.push({
      title: "Resume is well-optimized for this role",
      description: `You match ${matchedSkills.length} skills with no critical gaps and measurable impact in your descriptions. The resume is competitive — focus on the cover letter and tailoring your project narrative to this specific company.`,
      priority: 60,
      category: "differentiation",
    });
  }

  /*
    DEDUPLICATE by category — keep only the highest-priority rec per category
    then sort by priority descending and return top 3
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