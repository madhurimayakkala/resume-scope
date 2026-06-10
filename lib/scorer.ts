export function calculateMatchScore(
  matchedWeight: number,
  totalWeight: number
) {
  if (totalWeight === 0) {
    return 0;
  }

  return Math.round(
    (matchedWeight / totalWeight) * 100
  );
}