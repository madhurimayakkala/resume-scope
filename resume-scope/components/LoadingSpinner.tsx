"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Parsing resume...",
  "Extracting skills...",
  "Comparing against job description...",
  "Generating recommendations...",
];

export default function LoadingSpinner() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < MESSAGES.length - 1 ? prev + 1 : prev));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center gap-6 py-24">
      <div
        aria-hidden="true"
        className="h-12 w-12 animate-spin rounded-full border-2 border-border border-t-accent"
      />
      <p className="text-caption text-secondary">{MESSAGES[messageIndex]}</p>
    </div>
  );
}
