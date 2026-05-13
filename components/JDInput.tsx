interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JDInput({
  value,
  onChange,
}: JDInputProps) {
  return (
    <div className="glass-surface rounded-[32px] p-8 md:p-10 h-full">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">
            Job Description
          </p>

          <h2 className="text-3xl font-semibold mt-4">
            Paste the role details
          </h2>
        </div>

        <div className="text-sm text-secondary">
          ATS Target
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste the job description here..."
        className="
          mt-10
          w-full
          min-h-[420px]
          resize-none
          rounded-[28px]
          border border-white/10
          bg-white/[0.03]
          px-6
          py-6
          text-[15px]
          leading-[1.9]
          outline-none
          transition-all duration-300
          placeholder:text-white/30
          focus:border-white/20
          focus:bg-white/[0.05]
        "
      />
    </div>
  );
}