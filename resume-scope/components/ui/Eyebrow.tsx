import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/* The one small-caps label style used across the app. */
export default function Eyebrow({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      {...props}
      className={cn("font-sans text-eyebrow font-semibold uppercase text-muted", className)}
    />
  );
}
