export function calculateMatchScore(
  matchedSkills: string[],
  jdSkills: string[]
) {
  if (jdSkills.length === 0) {
    return 0;
  }

  const score =
    (matchedSkills.length / jdSkills.length) * 100;

  return Math.round(score);
}