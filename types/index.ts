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

export interface GapSkill {
  skill: string;
  count: number;
}

export interface AnalysisResult {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
  aiExplanation: string;
  recommendations: Recommendation[];
}

export interface MatchSkillsResult {
  matchedSkills: string[];
  missingSkills: string[];
  resumeSkills: string[];
  jdSkills: string[];
  skillFrequency: Record<string, number>;
  matchedWeight: number;
  totalWeight: number;
  criticalGaps: GapSkill[];
  moderateGaps: GapSkill[];
  minorGaps: GapSkill[];
}