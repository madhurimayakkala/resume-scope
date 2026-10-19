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
        text-sm text-ink-secondary
        border border-line-soft
        rounded-full
        px-5 py-2.5
        transition-all duration-300
        hover:border-accent-line
        hover:bg-tint
        hover:text-ink
      "
    >
      <span aria-hidden="true" className="text-accent text-xs">↗</span>
      Try with sample data
    </button>
  );
}