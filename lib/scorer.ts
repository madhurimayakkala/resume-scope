/*
  Calculates the match score as a percentage of weighted
  JD skill coverage achieved by the resume.

  matchedWeight = sum of frequencies of skills the resume has
  totalWeight   = sum of frequencies of all skills in the JD

  Returns 0 if the JD has no detectable skills.
*/
export function calculateMatchScore(
  matchedWeight: number,
  totalWeight: number
): number {
  if (totalWeight === 0) return 0;
  return Math.round((matchedWeight / totalWeight) * 100);
}