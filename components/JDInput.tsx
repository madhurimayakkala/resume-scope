interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JDInput({ value, onChange }: JDInputProps) {
  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;

  return (
    <div className="glass-surface rounded-[32px] p-7 md:p-8 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="eyebrow">Job description</p>

          <h2 className="text-3xl font-semibold mt-2">
            Paste the role details
          </h2>
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the full job description here..."
        className="
          mt-8
          flex-1
          w-full
          min-h-[300px]
          resize-none
          rounded-[24px]
          border border-line-soft
          bg-tint
          px-6
          py-5
          text-[14px]
          leading-[1.9]
          outline-none
          transition-all duration-300
          placeholder:text-ink-muted
          focus:border-accent-line
          focus:bg-tint-strong
        "
      />

      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-xs text-ink-muted">
          Include the full description for best results.
        </p>

        <p className="text-xs text-ink-muted tabular-nums">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </p>
      </div>
    </div>
  );
}