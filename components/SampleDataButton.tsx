interface SampleDataButtonProps {
  onLoad: () => void;
}

export default function SampleDataButton({
  onLoad,
}: SampleDataButtonProps) {
  return (
    <button
      onClick={onLoad}
      className="
        inline-flex items-center gap-2
        text-sm text-secondary
        border border-white/10
        rounded-full
        px-5 py-2.5
        transition-all duration-300
        hover:border-white/20
        hover:bg-white/[0.04]
        hover:text-[#F5EFE6]
      "
    >
      <span className="text-muted text-xs">↗</span>
      Try with sample data
    </button>
  );
}