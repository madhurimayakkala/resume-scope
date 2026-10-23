import { NextResponse } from "next/server";

import { errorResponse, validationError } from "@/lib/api";
import { matchSkills } from "@/lib/matcher";
import { generateRecommendations } from "@/lib/recommendations";
import {
  AnalyzeRequestSchema,
  AnalyzeResponseSchema,
  type AnalyzeResponse,
} from "@/lib/schemas";
import { calculateMatchScore } from "@/lib/scorer";
import { buildSummary } from "@/lib/summary";

export const runtime = "nodejs";

/* Generous ceiling for the JSON body: both text fields at max length, with room for escaping. */
const MAX_BODY_BYTES = 512 * 1024;

export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return errorResponse(413, "payload_too_large", "The request body is too large.");
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return errorResponse(400, "invalid_json", "The request body must be valid JSON.");
  }

  const parsed = AnalyzeRequestSchema.safeParse(raw);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const { resumeText, jobDescription } = parsed.data;
    const result = matchSkills(resumeText, jobDescription);
    const matchScore = calculateMatchScore(result.matchedWeight, result.totalWeight);

    const response: AnalyzeResponse = AnalyzeResponseSchema.parse({
      matchScore,
      matchedSkills: result.matchedSkills,
      partialSkills: result.partialSkills,
      missingSkills: result.missingSkills,
      jdSkills: result.jdSkills,
      resumeSkills: result.resumeSkills,
      skillFrequency: result.skillFrequency,
      criticalGaps: result.criticalGaps,
      moderateGaps: result.moderateGaps,
      minorGaps: result.minorGaps,
      summary: buildSummary(matchScore, result),
      recommendations: generateRecommendations({
        score: matchScore,
        criticalGaps: result.criticalGaps,
        moderateGaps: result.moderateGaps,
        minorGaps: result.minorGaps,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        resumeText,
        jdText: jobDescription,
      }),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[analyze] unexpected error:", error);
    return errorResponse(500, "internal_error", "Failed to analyze resume.");
  }
}
