/*
  Text helpers shared by the matcher pipeline.
*/

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/*
  STAGE 0 — INPUT NORMALIZATION
  PDF text extraction leaves artifacts that defeat keyword matching:
  soft hyphens, zero-width characters, ligatures ("ﬁ"), unicode dashes,
  CRLF line endings, URLs and emails (so github.com/you is not a "GitHub"
  skill) and words broken across lines with a hyphen
  ("Type-\nScript"). Everything downstream assumes this has run.
*/
export function normalizeForExtraction(text: string): string {
  return text
    .normalize("NFKC")
    .replace(/[\u00AD\u200B-\u200D\u2060\uFEFF]/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/https?:\/\/\S+|www\.\S+|\S+@\S+\.\S+|\b(?:github|gitlab|linkedin)\.com\/\S*/gi, " ")
    .replace(/[\u2010-\u2015\u2212]/g, "-")
    .replace(/([A-Za-z])-[ \t]*\n[ \t]*([A-Za-z])/g, "$1$2")
    .replace(/[ \t]+/g, " ");
}
