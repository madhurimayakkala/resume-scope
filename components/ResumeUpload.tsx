"use client";

import { useRef } from "react";

interface ResumeUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export default function ResumeUpload({
  file,
  setFile,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = e.target.files?.[0];

    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

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
          <div className="w-20 h-20 rounded-[24px] bg-white/[0.04] flex items-center justify-center text-3xl transition-all duration-300 hover:scale-[1.02]">
            ↑
          </div>

          <h3 className="mt-8 text-2xl font-medium">
            {file ? file.name : "Drop PDF Resume"}
          </h3>

          <p className="mt-4 text-secondary max-w-md leading-[1.8]">
            Upload your resume to begin ATS analysis and skill matching.
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