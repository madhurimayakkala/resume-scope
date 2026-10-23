import type { HTMLAttributes } from "react";

import { cn } from "@/lib/cn";

/* Shared vertical rhythm for every page section. */
export default function Section({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section {...props} className={cn("container-width py-16 md:py-24", className)} />;
}
