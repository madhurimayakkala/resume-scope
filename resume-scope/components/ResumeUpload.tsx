"use client";

import { useRef, useState } from "react";

import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import { cn } from "@/lib/cn";
import { MAX_RESUME_FILE_BYTES } from "@/lib/schemas";

interface ResumeUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  sampleLoaded?: boolean;
}

export default function ResumeUpload({ file, setFile, sampleLoaded = false }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateAndSet(selected: File) {
    setError(null);

    if (!/\.pdf$/i.test(selected.name)) {
      setError("Only PDF files are supported.");
      return;
    }
    if (selected.size > MAX_RESUME_FILE_BYTES) {
      setError("File must be under 5MB.");
      return;
    }
    setFile(selected);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
    // Let the same file be chosen again after an error or replacement.
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSet(dropped);
  }

  const describedBy = error ? "resume-help resume-error" : "resume-help";

  return (
    <Card>
      <Eyebrow>Resume</Eyebrow>
      <h2 className="mt-4 font-display text-h2 font-bold">Upload your resume</h2>

      {/* A real button: focusable, and Enter/Space open the file picker. */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        aria-describedby={describedBy}
        className={cn(
          "mt-8 flex w-full flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-12 text-center transition duration-200 ease-smooth",
          dragging ? "border-accent bg-surface-hover" : "border-border hover:bg-surface-hover"
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-16 w-16 items-center justify-center rounded-md bg-background/40 text-h2"
        >
          {sampleLoaded && !file ? "✓" : "↑"}
        </span>

        {file ? (
          <>
            <span className="mt-6 break-all font-display text-h3 font-bold">{file.name}</span>
            <span className="mt-2 text-caption text-secondary">
              {(file.size / 1024).toFixed(0)} KB · PDF
            </span>
            <span className="mt-4 text-caption text-muted">Click to replace</span>
          </>
        ) : sampleLoaded ? (
          <>
            <span className="mt-6 font-display text-h3 font-bold">Sample resume loaded</span>
            <span className="mt-2 text-caption text-secondary">
              Click to upload your own PDF instead.
            </span>
          </>
        ) : (
          <>
            <span className="mt-6 font-display text-h3 font-bold">Drop your PDF here</span>
            <span className="mt-2 text-caption text-secondary">or click to browse</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={handleFileChange}
      />

      <p id="resume-help" className="mt-4 text-center text-caption text-muted">
        PDF only, max 5MB. Text-based PDFs work best.
      </p>

      <p
        id="resume-error"
        role="alert"
        aria-live="assertive"
        className={cn("text-center text-caption text-critical", error && "mt-2")}
      >
        {error}
      </p>
    </Card>
  );
}
