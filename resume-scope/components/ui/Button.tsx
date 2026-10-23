import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  Omit<ComponentProps<typeof Link>, "className"> & { href: string };

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold " +
  "transition duration-200 ease-smooth disabled:cursor-not-allowed disabled:opacity-40 " +
  "motion-safe:hover:-translate-y-0.5";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-accent text-accent-foreground hover:shadow-soft",
  secondary: "border border-border text-primary hover:bg-surface-hover",
  ghost: "text-secondary hover:text-primary",
};

const SIZES: Record<Size, string> = {
  md: "px-6 py-3 text-body",
  sm: "px-4 py-2 text-caption",
};

/*
  One button for the whole app. Pass `href` to render a styled Link
  (a real <a>), which avoids the invalid <a><button/></a> nesting.
*/
export default function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, ...rest } = props;
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);

  if (typeof rest.href === "string") {
    return <Link {...(rest as Omit<ButtonAsLink, keyof CommonProps>)} className={classes} />;
  }

  const { type = "button", ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return <button type={type} {...buttonProps} className={classes} />;
}
