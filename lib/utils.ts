export function normalizeText(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function removeDuplicates(arr: string[]) {
  return [...new Set(arr)];
}

export function truncateText(
  text: string,
  maxLength: number
) {
  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + "...";
}