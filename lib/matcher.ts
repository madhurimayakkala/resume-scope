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

  return {
    matchedSkills,

    missingSkills,

    resumeSkills,

    jdSkills,
  };
}