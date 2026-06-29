import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="container-width pt-24 md:pt-32 pb-24">
      <div className="max-w-5xl">
        <div className="fade-up">
          <span className="text-xs uppercase tracking-[0.28em] text-muted">
            Resume Intelligence
          </span>
        </div>

        <div className="mt-8 fade-up fade-delay-1">
          <h1 className="text-5xl md:text-7xl lg:text-[88px] leading-[0.96] font-semibold">
            Know where your resume stands.
          </h1>
        </div>

        <div className="mt-10 fade-up fade-delay-2">
          <p className="text-lg md:text-xl text-secondary max-w-2xl leading-[1.8]">
            Upload your resume, compare it against any job description,
            and understand your fit instantly.
          </p>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row items-start gap-4 fade-up fade-delay-3">
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
  );
}