export interface AnalysisResult {
  matchScore: number;

  matchedSkills: string[];

  missingSkills: string[];

  aiExplanation: string;
}

export interface MatchSkillsResult {
  matchedSkills: string[];

  missingSkills: string[];

  resumeSkills: string[];

  jdSkills: string[];
}