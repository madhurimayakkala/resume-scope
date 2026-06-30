interface SkillChipProps {
  label: string;
  state: "matched" | "missing" | "critical";
  frequency?: number;
}

export default function SkillChip({
  label,
  state,
  frequency,
}: SkillChipProps) {
  const styles = {
    matched:
      "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    missing:
      "bg-transparent border-white/15 text-secondary",
    critical:
      "bg-transparent border-red-500/40 text-red-300 font-medium",
  };

  return (
    <div
      title={
        frequency ? `Appears ${frequency} time${frequency > 1 ? "s" : ""} in this job description` : undefined
      }
      className={`
        inline-flex items-center gap-1.5
        px-3.5 py-1.5 rounded-full text-[13px] border
        transition-all duration-200
        hover:border-opacity-60
        ${styles[state]}
      `}
    >
      {state === "matched" && (
        <span className="text-emerald-400 text-[11px]">●</span>
      )}
      {label}
    </div>
  );
}