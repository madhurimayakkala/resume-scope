import { z } from "zod";

/*
  Single source of truth for every shape that crosses a boundary
  (API request/response, matcher output, recommendations).
  TypeScript types are derived with z.infer; do not hand-write them.
*/

export const RESUME_TEXT_MIN = 50;
export const RESUME_TEXT_MAX = 50_000;
export const JOB_DESCRIPTION_MIN = 20;
export const JOB_DESCRIPTION_MAX = 20_000;
export const MAX_RESUME_FILE_BYTES = 5 * 1024 * 1024;

export const GapSkillSchema = z.object({
  skill: z.string().min(1),
  /** How many times the job description mentions the skill. */
  count: z.number().int().min(1),
  niceToHave: z.boolean(),
});

export const RecommendationCategorySchema = z.enum([
  "critical_gap",
  "keyword_coverage",
  "impact",
  "language",
  "role_fit",
  "differentiation",
  "structure",
]);

export const RecommendationSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  reason: z.string().min(1),
  priority: z.number().int(),
  category: RecommendationCategorySchema,
});

/* Output of lib/matcher.ts */
export const MatchResultSchema = z.object({
  matchedSkills: z.array(z.string()),
  partialSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  resumeSkills: z.array(z.string()),
  jdSkills: z.array(z.string()),
  skillFrequency: z.record(z.string(), z.number()),
  skillWeights: z.record(z.string(), z.number()),
  matchedVia: z.record(z.string(), z.string()),
  matchedWeight: z.number(),
  totalWeight: z.number(),
  criticalGaps: z.array(GapSkillSchema),
  moderateGaps: z.array(GapSkillSchema),
  minorGaps: z.array(GapSkillSchema),
});

/* POST /api/analyze */
export const AnalyzeRequestSchema = z.object({
  resumeText: z.string().min(RESUME_TEXT_MIN).max(RESUME_TEXT_MAX),
  jobDescription: z.string().min(JOB_DESCRIPTION_MIN).max(JOB_DESCRIPTION_MAX),
});

export const AnalyzeResponseSchema = z.object({
  matchScore: z.number().int().min(0).max(100),
  matchedSkills: z.array(z.string()),
  partialSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  jdSkills: z.array(z.string()),
  resumeSkills: z.array(z.string()),
  skillFrequency: z.record(z.string(), z.number()),
  criticalGaps: z.array(GapSkillSchema),
  moderateGaps: z.array(GapSkillSchema),
  minorGaps: z.array(GapSkillSchema),
  summary: z.string(),
  recommendations: z.array(RecommendationSchema),
});

/* POST /api/parse-resume */
export const ParseResumeResponseSchema = z.object({ text: z.string() });

/* Every non-2xx response from either route. */
export const ApiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    issues: z
      .array(z.object({ path: z.string(), message: z.string() }))
      .optional(),
  }),
});

export type GapSkill = z.infer<typeof GapSkillSchema>;
export type RecommendationCategory = z.infer<typeof RecommendationCategorySchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
export type MatchResult = z.infer<typeof MatchResultSchema>;
export type AnalyzeRequest = z.infer<typeof AnalyzeRequestSchema>;
export type AnalyzeResponse = z.infer<typeof AnalyzeResponseSchema>;
export type ParseResumeResponse = z.infer<typeof ParseResumeResponseSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
