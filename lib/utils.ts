export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function removeDuplicates(arr: string[]): string[] {
  return [...new Set(arr)];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/*
  Tokenizes raw text into individual words.
  Strips punctuation, lowercases, removes empty tokens.
*/
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.#+\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);
}

/*
  Normalizes a single token for comparison.
  Strips trailing punctuation and excess whitespace.
*/
export function normalizeToken(token: string): string {
  return token
    .toLowerCase()
    .replace(/[^a-z0-9.#+\s-]/g, "")
    .trim();
}