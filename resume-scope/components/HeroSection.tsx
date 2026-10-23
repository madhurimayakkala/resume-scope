import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";

export default function HeroSection() {
  return (
    <section className="container-width pb-16 pt-16 md:pb-24 md:pt-28">
      <div className="max-w-5xl">
        <Eyebrow className="fade-up">Resume intelligence</Eyebrow>

        <h1 className="fade-up fade-delay-1 mt-8 font-display text-h1 font-extrabold text-primary md:text-display">
          Know where your resume stands.
        </h1>

        <p className="fade-up fade-delay-2 mt-8 max-w-2xl text-lead text-secondary">
          Upload your resume, compare it against any job description, and understand your fit
          instantly.
        </p>

        <div className="fade-up fade-delay-3 mt-12 flex flex-col items-start gap-4 sm:flex-row">
          <Button href="/analyze">Start analysis</Button>
          <Button href="/analyze?demo=true" variant="secondary">
            View demo
          </Button>
        </div>
      </div>
    </section>
  );
}
