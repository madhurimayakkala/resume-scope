import type { StatusTone } from "@/lib/score";

/* Static class maps (Tailwind must see full class names in source). */
export const TONE_TEXT: Record<StatusTone, string> = {
  matched: "text-matched",
  partial: "text-partial",
  critical: "text-critical",
};

export const TONE_DOT: Record<StatusTone, string> = {
  matched: "bg-matched",
  partial: "bg-partial",
  critical: "bg-critical",
};
