/*
  Match score: the share of the JD's total skill weight that the resume
  covers, as a whole percentage in 0..100.

  matchedWeight = sum of (weight x credit) over JD skills the resume covers
  totalWeight   = sum of weights over all JD skills

  Returns 0 when the JD has no detectable skills or the inputs are not
  usable numbers.
*/
export function calculateMatchScore(
  matchedWeight: number,
  totalWeight: number
): number {
  if (!Number.isFinite(matchedWeight) || !Number.isFinite(totalWeight)) return 0;
  if (totalWeight <= 0) return 0;

  const percent = Math.round((Math.max(0, matchedWeight) / totalWeight) * 100);
  return Math.min(100, percent);
}
