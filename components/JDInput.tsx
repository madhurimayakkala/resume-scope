interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JDInput({ value, onChange }: JDInputProps) {
  const wordCount = value.trim()
    ? value.trim().split(/\s+/).length
    : 0;

  return (
    <div className="glass-surface rounded-[32px] p-8 md:p-10 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">
            Job Description
          </p>

          <h2 className="text-3xl font-semibold mt-4">
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
          min-h-[380px]
          resize-none
          rounded-[24px]
          border border-white/10
          bg-white/[0.03]
          px-6
          py-5
          text-[14px]
          leading-[1.9]
          outline-none
          transition-all duration-300
          placeholder:text-white/25
          focus:border-white/20
          focus:bg-white/[0.05]
        "
      />

      <div className="mt-3 flex items-center justify-between px-1">
        <p className="text-xs text-muted">
          Include the full description for best results.
        </p>

        <p className={`text-xs ${wordCount > 50 ? "text-muted" : "text-white/25"}`}>
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </p>
      </div>
    </div>
  );
}