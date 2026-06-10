import { NextResponse } from "next/server";

import { matchSkills } from "@/lib/matcher";

import { calculateMatchScore } from "@/lib/scorer";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      resumeText,
      jobDescription,
    } = body;

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        {
          error:
            "Resume text and job description are required.",
        },
        {
          status: 400,
        }
      );
    }

    /*
      MATCH SKILLS
    */

      const {
  matchedSkills,
  missingSkills,
  jdSkills,

  matchedWeight,
  totalWeight,

  criticalGaps,
  moderateGaps,
  minorGaps,
} = matchSkills(
  resumeText,
  jobDescription
);
    /*
      CALCULATE SCORE
    */

const matchScore =
  calculateMatchScore(
    matchedWeight,
    totalWeight
  );

    /*
      GENERATE SUMMARY
    */

   const aiExplanation = `
Your resume matches ${matchScore}% of the detected ATS keywords.

Matched skills:
${matchedSkills.join(", ") || "None"}

Critical gaps:
${
  criticalGaps
    .map(
      (gap) =>
        `${gap.skill} (${gap.count} mentions)`
    )
    .join(", ") || "None"
}

Moderate gaps:
${
  moderateGaps
    .map(
      (gap) =>
        `${gap.skill} (${gap.count} mentions)`
    )
    .join(", ") || "None"
}

Minor gaps:
${
  minorGaps
    .map(
      (gap) =>
        `${gap.skill} (${gap.count} mentions)`
    )
    .join(", ") || "None"
}

Focus on the critical gaps first because they appear most frequently in the job description.
`;

    /*
      RETURN RESPONSE
    */

    return NextResponse.json({
  matchScore,

  matchedSkills,

  missingSkills,

  criticalGaps,

  moderateGaps,

  minorGaps,

  aiExplanation,
});
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to analyze resume.",
      },
      {
        status: 500,
      }
    );
  }
}