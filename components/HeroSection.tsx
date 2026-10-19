import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container-width pt-20 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-5xl">
        <div className="fade-up">
          <span className="eyebrow">Rule-based skill matching</span>
        </div>

        <div className="mt-8 fade-up fade-delay-1">
          <h1 className="text-5xl md:text-7xl lg:text-[88px] leading-[0.96] font-semibold">
            Know where your resume stands.
          </h1>
        </div>

        <div className="mt-10 fade-up fade-delay-2">
          <p className="text-lg md:text-xl text-ink-secondary max-w-2xl leading-[1.8]">
            Upload your resume, paste a job description, and see which skills
            match and which don&apos;t. Every score is explainable.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-start gap-4 fade-up fade-delay-3">
          <Link href="/analyze">
            <button className="primary-button">Start Analysis</button>
          </Link>

          <Link href="/analyze?demo=true">
            <button className="secondary-button">View Demo</button>
          </Link>
        </div>
      </div>
    </section>
  );
}
