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
      setMessageIndex((prev) =>
        prev < MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-6">
      <div className="h-12 w-12 rounded-full border-2 border-line border-t-accent animate-spin" />

      <p className="text-ink-secondary text-sm transition-all duration-300">
        {MESSAGES[messageIndex]}
      </p>
    </div>
  );
}