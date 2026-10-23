import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import Eyebrow from "./Eyebrow";

type Level = "h1" | "h2" | "h3";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  level?: Level;
  id?: string;
  /** Lets the heading take programmatic focus (e.g. after results load). */
  focusable?: boolean;
  className?: string;
}

const TITLE_STYLES: Record<Level, string> = {
  h1: "text-h1 font-extrabold md:text-display",
  h2: "text-h2 font-bold",
  h3: "text-h3 font-bold",
};

export default function SectionHeader({
  eyebrow,
  title,
  description,
  level = "h2",
  id,
  focusable,
  className,
}: SectionHeaderProps) {
  const Heading = level;
  return (
    <div className={cn(className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Heading
        id={id}
        tabIndex={focusable ? -1 : undefined}
        className={cn("font-display text-primary", eyebrow && "mt-4", TITLE_STYLES[level])}
      >
        {title}
      </Heading>
      {description && <p className="mt-4 max-w-xl text-body text-secondary">{description}</p>}
    </div>
  );
}
