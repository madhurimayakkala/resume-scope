"use client";

import { useRef, useState } from "react";

interface ResumeUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
  sampleLoaded?: boolean;
}

export default function ResumeUpload({
  file,
  setFile,
  sampleLoaded = false,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function validateAndSet(selected: File) {
    setError(null);

    if (!selected.name.endsWith(".pdf")) {
      setError("Only PDF files are supported.");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB.");
      return;
    }

    setFile(selected);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) validateAndSet(selected);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) validateAndSet(dropped);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  /*
    When sample data is loaded, show a distinct state
    instead of the normal upload prompt.
  */

  if (sampleLoaded) {
    return (
      <div className="glass-surface rounded-[32px] p-8 md:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-muted">
              Resume
            </p>

            <h2 className="text-3xl font-semibold mt-4">
              Upload your resume
            </h2>
          </div>

          <div className="w-3 h-3 rounded-full bg-[#F0E7D5]/70 mt-2" />
        </div>

        <div
          onClick={() => inputRef.current?.click()}
          className="
            mt-10
            border border-dashed border-white/10
            rounded-[28px]
            p-14
            cursor-pointer
            transition-all duration-300
            hover:border-white/20
            hover:bg-white/[0.03]
          "
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-[20px] bg-white/[0.04] flex items-center justify-center text-2xl">
              ✓
            </div>

            <h3 className="mt-6 text-xl font-medium">
              Sample resume loaded
            </h3>

            <p className="mt-3 text-secondary text-sm leading-[1.8] max-w-xs">
              Click to upload your own PDF instead.
            </p>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            hidden
            onChange={handleFileChange}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="glass-surface rounded-[32px] p-8 md:p-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-muted">
            Resume
          </p>

          <h2 className="text-3xl font-semibold mt-4">
            Upload your resume
          </h2>
        </div>

        <div className="w-3 h-3 rounded-full bg-[#F0E7D5]/70 mt-2" />
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          mt-10
          border border-dashed
          rounded-[28px]
          p-14
          cursor-pointer
          transition-all duration-300
          ${
            dragging
              ? "border-white/30 bg-white/[0.05]"
              : "border-white/10 hover:border-white/20 hover:bg-white/[0.03]"
          }
        `}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-[20px] bg-white/[0.04] flex items-center justify-center text-2xl transition-all duration-300 hover:scale-[1.02]">
            ↑
          </div>

          {file ? (
            <>
              <h3 className="mt-6 text-xl font-medium">{file.name}</h3>
              <p className="mt-2 text-secondary text-sm">
                {(file.size / 1024).toFixed(0)} KB · PDF
              </p>
              <p className="mt-4 text-muted text-sm">
                Click to replace
              </p>
            </>
          ) : (
            <>
              <h3 className="mt-6 text-xl font-medium">
                Drop your PDF here
              </h3>
              <p className="mt-3 text-secondary text-sm leading-[1.8] max-w-xs">
                or click to browse. PDF only, max 5MB.
              </p>
            </>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-400 text-center">
          {error}
        </p>
      )}
    </div>
  );
}