interface SkillBadgeProps {
  label: string;
  muted?: boolean;
}

export default function SkillBadge({
  label,
  muted = false,
}: SkillBadgeProps) {
  return (
    <div
      className={`
        px-4 py-2 rounded-full text-sm border transition-all duration-300
        ${
          muted
            ? "bg-[#374151] border-[#4B5563] text-secondary"
            : "bg-[#2A3441] border-[#4B5563] text-[#F5EFE6]"
        }
      `}
    >
      {label}
    </div>
  );
}