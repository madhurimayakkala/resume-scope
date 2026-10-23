import { cn } from "@/lib/cn";

export type ChipTone = "neutral" | "matched" | "partial" | "missing" | "critical";

interface ChipProps {
  label: string;
  tone?: ChipTone;
  /** Mentions in the job description, shown as "· 3×". */
  count?: number;
  title?: string;
  className?: string;
}

const TONES: Record<ChipTone, string> = {
  neutral: "border-border bg-surface text-primary",
  matched: "border-matched/40 bg-matched/10 text-matched",
  partial: "border-partial/40 bg-partial/10 text-partial",
  missing: "border-border bg-transparent text-secondary",
  critical: "border-critical/50 bg-critical/10 text-critical",
};

/* Read by screen readers so state is never conveyed by color alone. */
const SR_STATE: Partial<Record<ChipTone, string>> = {
  matched: "Matched: ",
  partial: "Listed only: ",
  missing: "Missing: ",
  critical: "Critical gap: ",
};

/* One chip for every skill label in the product. */
export default function Chip({ label, tone = "neutral", count, title, className }: ChipProps) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-caption",
        TONES[tone],
        className
      )}
    >
      {SR_STATE[tone] && <span className="sr-only">{SR_STATE[tone]}</span>}
      {label}
      {count !== undefined && count > 0 && (
        <span className="tabular-nums">· {count}×</span>
      )}
    </span>
  );
}
