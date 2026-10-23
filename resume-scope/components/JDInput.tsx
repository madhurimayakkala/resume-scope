import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { JOB_DESCRIPTION_MAX } from "@/lib/schemas";

interface JDInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function JDInput({ value, onChange }: JDInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <Card className="flex h-full flex-col">
      <Eyebrow>Job description</Eyebrow>

      <label
        htmlFor="jd-input"
        className="mt-4 font-display text-h2 font-bold text-primary"
      >
        Paste the role details
      </label>

      <textarea
        id="jd-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={JOB_DESCRIPTION_MAX}
        aria-describedby="jd-help"
        placeholder="Paste the full job description here..."
        className="mt-8 min-h-80 w-full flex-1 resize-none rounded-md border border-border bg-background/40 px-6 py-5 text-body text-primary transition duration-200 placeholder:text-muted hover:border-secondary focus-visible:border-accent"
      />

      <div className="mt-3 flex items-center justify-between px-1 text-caption text-muted">
        <p id="jd-help">Include the full description for best results.</p>
        <p aria-live="polite" className="tabular-nums">
          {wordCount} {wordCount === 1 ? "word" : "words"}
        </p>
      </div>
    </Card>
  );
}
