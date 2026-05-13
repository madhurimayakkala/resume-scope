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
    } = matchSkills(
      resumeText,
      jobDescription
    );

    /*
      CALCULATE SCORE
    */

    const matchScore =
      calculateMatchScore(
        matchedSkills,
        jdSkills
      );

    /*
      GENERATE SUMMARY
    */

    const aiExplanation = `
Your resume matches ${matchScore}% of the detected ATS keywords.

Matched skills:
${matchedSkills.join(", ") || "None"}

Missing skills:
${missingSkills.join(", ") || "None"}

Improving keyword alignment and strengthening project descriptions can improve ATS compatibility.
`;

    /*
      RETURN RESPONSE
    */

    return NextResponse.json({
      matchScore,
      matchedSkills,
      missingSkills,
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