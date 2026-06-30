interface RecommendationCardProps {
  title: string;
  description: string;
  reason?: string;
  rank: number;
}

const RANK_COLOR: Record<number, string> = {
  1: "bg-red-400",
  2: "bg-yellow-400",
  3: "bg-blue-400",
};

export default function RecommendationCard({
  title,
  description,
  reason,
  rank,
}: RecommendationCardProps) {
  return (
    <div className="rounded-[18px] border border-[#4B5563] bg-[#2A3441] p-5 flex flex-col gap-3 transition-all duration-300 hover:border-white/25 hover:-translate-y-[2px]">
      <div className="flex items-start gap-3">
        <span
          className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${RANK_COLOR[rank] ?? "bg-muted"}`}
        />
        <h3 className="text-[15px] font-medium leading-snug">
          {title}
        </h3>
      </div>

      <p className="text-secondary leading-[1.75] text-[13.5px] pl-[18px]">
        {description}
      </p>

      {reason && (
        <p className="text-[12.5px] text-muted leading-[1.7] pl-[18px] pt-2 border-t border-white/[0.06]">
          {reason}
        </p>
      )}
    </div>
  );
}