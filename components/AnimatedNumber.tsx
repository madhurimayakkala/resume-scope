"use client";

import { useEffect, useState } from "react";

interface AnimatedNumberProps {
  target: number;
  durationMs?: number;
}

export default function AnimatedNumber({
  target,
  durationMs = 800,
}: AnimatedNumberProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);

    const steps = 40;
    const stepDuration = durationMs / steps;
    const increment = target / steps;

    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      current += increment;

      if (step >= steps) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(current));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [target, durationMs]);

  return <>{value}</>;
}