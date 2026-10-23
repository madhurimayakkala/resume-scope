import HeroSection from "@/components/HeroSection";
import Nav from "@/components/Nav";
import ResumePreview from "@/components/ResumePreview";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Eyebrow from "@/components/ui/Eyebrow";
import Section from "@/components/ui/Section";

export default function HomePage() {
  return (
    <>
      <Nav cta={{ href: "/analyze", label: "Start analysis" }} />

      <main id="main">
        <HeroSection />
        <ResumePreview />

        <Section>
          <Card className="text-center md:p-12">
            <Eyebrow>Resume Scope</Eyebrow>

            <h2 className="mx-auto mt-6 max-w-3xl font-display text-h2 font-bold md:text-h1">
              See exactly where your resume falls short.
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-body text-secondary">
              Paste any job description and get a detailed breakdown of matched skills, critical
              gaps, and prioritized recommendations — no guesswork.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button href="/analyze">Start analysis</Button>
              <Button href="/analyze?demo=true" variant="secondary">
                View demo
              </Button>
            </div>
          </Card>
        </Section>
      </main>
    </>
  );
}
