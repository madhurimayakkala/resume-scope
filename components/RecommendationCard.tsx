interface RecommendationCardProps {
  title: string;
  description: string;
  reason?: string;
  rank: number;
}

/*
  Priority is shown as a numbered marker (colour is only a hint),
  so rank is readable without relying on colour.
*/
const RANK_STYLE: Record<number, string> = {
  1: "border-critical-line text-critical",
  2: "border-moderate-line text-moderate",
  3: "border-minor-line text-minor",
};

export default function RecommendationCard({
  title,
  description,
  reason,
  rank,
}: RecommendationCardProps) {
  return (
    <div className="rounded-[18px] border border-line bg-surface p-5 flex flex-col gap-3 transition-all duration-300 hover:border-accent-line hover:-translate-y-[2px]">
      <div className="flex items-start gap-3">
        <span
          className={`mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-medium tabular-nums ${RANK_STYLE[rank] ?? "border-line text-ink-muted"}`}
        >
          <span className="sr-only">Priority </span>
          {rank}
        </span>
        <h3 className="text-[15px] font-medium leading-snug">{title}</h3>
      </div>

      <p className="text-ink-secondary leading-[1.75] text-[13.5px] pl-8">
        {description}
      </p>

      {reason && (
        <p className="text-[12.5px] text-ink-muted leading-[1.7] pl-8 pt-2 border-t border-line-soft">
          {reason}
        </p>
      )}
    </div>
  );
}
