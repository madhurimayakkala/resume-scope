export type SkillChipState = "matched" | "critical" | "moderate" | "minor";

interface SkillChipProps {
  label: string;
  state: SkillChipState;
  frequency?: number;
}

/*
  Each state differs by colour AND by shape/marker, so meaning never
  depends on colour alone:
    matched  - tinted fill + check
    critical - solid strong border + "!" marker
    moderate - solid border
    minor    - dashed border
*/
const STYLES: Record<SkillChipState, string> = {
  matched: "bg-good-soft border-good-line text-good",
  critical: "bg-critical-soft border-critical-line text-critical font-medium",
  moderate: "bg-moderate-soft border-moderate-line text-moderate",
  minor: "bg-minor-soft border-dashed border-minor-line text-minor",
};

const STATE_WORD: Record<SkillChipState, string> = {
  matched: "Matched",
  critical: "Critical gap",
  moderate: "Moderate gap",
  minor: "Minor gap",
};

export default function SkillChip({
  label,
  state,
  frequency,
}: SkillChipProps) {
  const showCount = state !== "matched" && frequency && frequency > 0;

  return (
    <div
      title={
        frequency
          ? `Appears ${frequency} time${frequency > 1 ? "s" : ""} in this job description`
          : undefined
      }
      className={`
        inline-flex items-center gap-1.5
        px-3.5 py-1.5 rounded-full text-[13px] border
        transition-colors duration-200
        ${STYLES[state]}
      `}
    >
      {state === "matched" && (
        <span aria-hidden="true" className="text-[11px]">✓</span>
      )}
      {state === "critical" && (
        <span aria-hidden="true" className="text-[11px] font-semibold">!</span>
      )}

      <span className="sr-only">{STATE_WORD[state]}: </span>
      {label}

      {showCount && (
        <span className="text-[11px] opacity-80 tabular-nums">×{frequency}</span>
      )}
    </div>
  );
}
