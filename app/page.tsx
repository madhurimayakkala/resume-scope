import HeroSection from "@/components/HeroSection";
import ResumePreview from "@/components/ResumePreview";

export default function HomePage() {
  return (
    <main>
      <nav className="container-width flex items-center justify-between py-8">
        <div className="text-sm tracking-[0.24em] uppercase text-secondary">
        ResumeScope
        </div>

        <button className="secondary-button text-sm">
          Analyze Resume
        </button>
      </nav>

      <HeroSection />

      <ResumePreview />

      <section className="container-width py-28">
        <div className="rounded-[24px] border border-[#4B5563] bg-[#2A3441] p-12 text-center shadow-[0_10px_30px_rgba(0,0,0,0.18)]">
          <p className="text-sm uppercase tracking-[0.24em] text-muted mb-6">
            Resume Intelligence
          </p>

          <h2 className="text-4xl md:text-5xl font-semibold max-w-3xl mx-auto leading-[1.1]">
            A calmer way to understand your ATS compatibility.
          </h2>

          <p className="text-secondary mt-6 max-w-xl mx-auto">
            Upload your resume, compare it with a job description,
            and instantly identify missing skills and opportunities.
          </p>

          <div className="mt-10">
            <button className="primary-button">
              Start Analysis
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}