interface RecommendationCardProps {
  title: string;
  description: string;
  reason?: string;
}

export default function RecommendationCard({
  title,
  description,
  reason,
}: RecommendationCardProps) {
  return (
    <div className="rounded-[20px] border border-[#4B5563] bg-[#2A3441] p-6 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#313C4B]">
      <h3 className="text-base font-medium leading-snug">
        {title}
      </h3>

      <p className="text-secondary leading-[1.8] text-[14px] flex-1">
        {description}
      </p>

      {reason && (
        <p className="text-[13px] text-muted leading-[1.7] pt-3 border-t border-white/[0.06]">
          {reason}
        </p>
      )}
    </div>
  );
}