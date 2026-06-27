import { NextResponse } from "next/server";

import { matchSkills } from "@/lib/matcher";
import { calculateMatchScore } from "@/lib/scorer";
import { generateRecommendations } from "@/lib/recommendations";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { resumeText, jobDescription } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { error: "Resume text and job description are required." },
        { status: 400 }
      );
    }

    /*
      MATCH SKILLS
    */

    const {
      matchedSkills,
      missingSkills,
      jdSkills,
      resumeSkills,
      matchedWeight,
      totalWeight,
      skillFrequency,
      criticalGaps,
      moderateGaps,
      minorGaps,
    } = matchSkills(resumeText, jobDescription);

    /*
      CALCULATE SCORE
    */

    const matchScore = calculateMatchScore(matchedWeight, totalWeight);

    /*
      GENERATE SUMMARY
    */

    const aiExplanation = `Your resume matches ${matchScore}% of the skills detected in this job description.

Matched skills (${matchedSkills.length}): ${matchedSkills.join(", ") || "None"}

Critical gaps: ${
      criticalGaps.map((g) => `${g.skill} (${g.count}×)`).join(", ") || "None"
    }

Moderate gaps: ${
      moderateGaps.map((g) => `${g.skill} (${g.count}×)`).join(", ") || "None"
    }

Minor gaps: ${
      minorGaps.map((g) => g.skill).join(", ") || "None"
    }`;

    /*
      GENERATE DYNAMIC RECOMMENDATIONS
    */

    const recommendations = generateRecommendations({
      score: matchScore,
      criticalGaps,
      moderateGaps,
      minorGaps,
      matchedSkills,
      missingSkills,
      resumeText,
      jdText: jobDescription,
    });

    /*
      RETURN RESPONSE
    */

    return NextResponse.json({
      matchScore,
      matchedSkills,
      missingSkills,
      jdSkills,
      resumeSkills,
      skillFrequency,
      criticalGaps,
      moderateGaps,
      minorGaps,
      aiExplanation,
      recommendations,
    });
  } catch (error) {
    console.error("[analyze] error:", error);

    return NextResponse.json(
      { error: "Failed to analyze resume." },
      { status: 500 }
    );
  }
}