interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "neutral" | "good" | "warning" | "critical";
}

const TONE_COLORS: Record<string, string> = {
  neutral: "text-ink",
  good: "text-good",
  warning: "text-moderate",
  critical: "text-critical",
};

export default function StatTile({
  label,
  value,
  tone = "neutral",
}: StatTileProps) {
  return (
    <div className="rounded-[18px] border border-line bg-surface px-6 py-5 flex flex-col gap-2">
      <p className="text-sm text-ink-muted">{label}</p>
      <p className={`text-3xl font-semibold tabular-nums ${TONE_COLORS[tone]}`}>
        {value}
      </p>
    </div>
  );
}
