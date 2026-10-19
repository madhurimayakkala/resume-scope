import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ResumePreview from "@/components/ResumePreview";
import HowScoring from "@/components/HowScoring";

export default function HomePage() {
  return (
    <main>
      <nav className="container-width flex items-center justify-between py-8">
        <div className="text-base font-medium text-ink">Resume Scope</div>

        <Link href="#how-scoring" className="text-link text-sm">
          How scoring works
        </Link>
      </nav>

      <HeroSection />

      <ResumePreview />

      <HowScoring />
    </main>
  );
}
