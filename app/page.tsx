import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import ResumePreview from "@/components/ResumePreview";

export default function HomePage() {
  return (
    <main>
      <nav className="container-width flex items-center justify-between py-8">
        <div className="text-sm tracking-[0.24em] uppercase text-secondary">
          Resume Scope
        </div>

        <Link href="/analyze">
          <button className="secondary-button text-sm">
            Start Analysis
          </button>
        </Link>
      </nav>

      <HeroSection />

      <ResumePreview />

      <section className="container-width py-28">
        <div className="rounded-[24px] border border-[#4B5563] bg-[#2A3441] p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.24em] text-muted mb-6">
            Resume Scope
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold max-w-3xl mx-auto leading-[1.1]">
            See exactly where your resume falls short.
          </h2>

          <p className="text-secondary mt-6 max-w-xl mx-auto leading-[1.8]">
            Paste any job description and get a detailed breakdown
            of matched skills, critical gaps, and prioritized
            recommendations — no guesswork.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/analyze">
              <button className="primary-button">
                Start Analysis
              </button>
            </Link>

            <Link href="/analyze?demo=true">
              <button className="secondary-button">
                View Demo
              </button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}