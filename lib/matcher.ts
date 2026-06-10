import { SKILL_KEYWORDS } from "./skillKeywords";
import { normalizeText } from "./utils";

export function extractSkills(text: string) {
  const normalizedText =
    normalizeText(text);

  return SKILL_KEYWORDS.filter(
    (skill) => {
      const escapedSkill =
        skill.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const regex = new RegExp(
        `\\b${escapedSkill.toLowerCase()}\\b`,
        "i"
      );

      return regex.test(
        normalizedText
      );
    }
  );
}

export function matchSkills(
  resumeText: string,
  jdText: string
) {
  const resumeSkills =
    extractSkills(resumeText);

  const jdSkills =
    extractSkills(jdText);

  const matchedSkills =
    jdSkills.filter((skill) =>
      resumeSkills.includes(skill)
    );

  const missingSkills =
    jdSkills.filter(
      (skill) =>
        !resumeSkills.includes(skill)
    );

  const skillFrequency: Record<
    string,
    number
  > = {};

  jdSkills.forEach((skill) => {
    const escapedSkill =
      skill.replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

    const regex = new RegExp(
      `\\b${escapedSkill}\\b`,
      "gi"
    );

    skillFrequency[skill] =
      (jdText.match(regex) || [])
        .length;
  });

  const criticalGaps: {
    skill: string;
    count: number;
  }[] = [];

  const moderateGaps: {
    skill: string;
    count: number;
  }[] = [];

  const minorGaps: {
    skill: string;
    count: number;
  }[] = [];

  missingSkills.forEach(
    (skill) => {
      const count =
        skillFrequency[skill] || 1;

      if (count >= 5) {
        criticalGaps.push({
          skill,
          count,
        });
      } else if (count >= 2) {
        moderateGaps.push({
          skill,
          count,
        });
      } else {
        minorGaps.push({
          skill,
          count,
        });
      }
    }
  );

  const totalWeight = Object.values(
    skillFrequency
  ).reduce(
    (sum, count) => sum + count,
    0
  );

  const matchedWeight =
    matchedSkills.reduce(
      (sum, skill) =>
        sum +
        (skillFrequency[skill] || 0),
      0
    );

  return {
    matchedSkills,
    missingSkills,
    resumeSkills,
    jdSkills,

    skillFrequency,

    matchedWeight,
    totalWeight,

    criticalGaps,
    moderateGaps,
    minorGaps,
  };
}