interface StatTileProps {
  label: string;
  value: string | number;
  tone?: "neutral" | "good" | "warning" | "critical";
}

const TONE_COLORS: Record<string, string> = {
  neutral: "text-[#F5EFE6]",
  good: "text-emerald-400",
  warning: "text-yellow-400",
  critical: "text-red-400",
};

export default function StatTile({
  label,
  value,
  tone = "neutral",
}: StatTileProps) {
  return (
    <div className="rounded-[18px] border border-[#4B5563] bg-[#2A3441] px-6 py-5 flex flex-col gap-2">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">
        {label}
      </p>
      <p className={`text-3xl font-semibold tabular-nums ${TONE_COLORS[tone]}`}>
        {value}
      </p>
    </div>
  );
}