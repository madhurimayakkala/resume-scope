"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

interface AnimatedNumberProps {
  target: number;
  durationMs?: number;
  /** Set false to render the final value immediately (e.g. server-rendered previews). */
  animateOnMount?: boolean;
}

/* The only counting animation in the app. */
export default function AnimatedNumber({
  target,
  durationMs = 1000,
  animateOnMount = true,
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const instant = reduce || !animateOnMount;
  const value = useMotionValue(instant ? target : 0);
  const rounded = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    if (instant) {
      value.set(target);
      return;
    }
    const controls = animate(value, target, { duration: durationMs / 1000, ease: "easeOut" });
    return () => controls.stop();
  }, [target, durationMs, instant, value]);

  return <motion.span>{rounded}</motion.span>;
}
