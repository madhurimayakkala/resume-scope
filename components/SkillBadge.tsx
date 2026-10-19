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
        px-4 py-2 rounded-full text-sm border transition-colors duration-300
        ${
          muted
            ? "bg-surface-raised border-line text-ink-secondary"
            : "bg-good-soft border-good-line text-good"
        }
      `}
    >
      {label}
    </div>
  );
}
