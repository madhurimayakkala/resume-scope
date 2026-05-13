interface RecommendationCardProps {
  title: string;
  description: string;
}

export default function RecommendationCard({
  title,
  description,
}: RecommendationCardProps) {
  return (
    <div className="rounded-[20px] border border-[#4B5563] bg-[#2A3441] p-6 transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#313C4B]">
      <h3 className="text-lg font-medium">
        {title}
      </h3>

      <p className="mt-3 text-secondary leading-[1.8] text-[15px]">
        {description}
      </p>
    </div>
  );
}