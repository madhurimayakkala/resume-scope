import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** `lg` for page-level cards, `md` for panels nested inside one. */
  radius?: "lg" | "md";
  padding?: "md" | "lg" | "none";
}

const RADIUS = { lg: "rounded-lg", md: "rounded-md" } as const;
const PADDING = { none: "", md: "p-6", lg: "p-6 md:p-10" } as const;

export default function Card({
  radius = "lg",
  padding = "lg",
  className,
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "border border-border bg-surface shadow-soft",
        RADIUS[radius],
        PADDING[padding],
        className
      )}
    />
  );
}
