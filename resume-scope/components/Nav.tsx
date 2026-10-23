import Link from "next/link";

import Button from "@/components/ui/Button";

interface NavProps {
  cta: { href: string; label: string; variant?: "primary" | "secondary" };
}

/* Shared top bar used by every page. */
export default function Nav({ cta }: NavProps) {
  return (
    <nav aria-label="Primary" className="container-width flex items-center justify-between py-8">
      <Link
        href="/"
        className="font-sans text-eyebrow font-semibold uppercase text-secondary hover:text-primary"
      >
        Resume Scope
      </Link>
      <Button href={cta.href} variant={cta.variant ?? "secondary"} size="sm">
        {cta.label}
      </Button>
    </nav>
  );
}
