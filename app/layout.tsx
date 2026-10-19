import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";
import PageTransition from "@/components/PageTransition";
import IntroGate from "@/components/IntroGate";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Resume Scope",
  description: "See how well your resume fits any role, instantly.",
};

/*
  Runs before first paint. Decides whether the home-page intro plays so the
  cover is present from the first frame (or never rendered) with no flash.
*/
const INTRO_SCRIPT = `(function(){var r=document.documentElement;try{var skip=location.pathname!=="/"||sessionStorage.getItem("resumescope_intro_seen")==="1"||window.matchMedia("(prefers-reduced-motion: reduce)").matches;r.classList.add(skip?"intro-skip":"intro-active")}catch(e){r.classList.add("intro-skip")}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <IntroGate />
        <PageTransition>
          {children}
          <SiteFooter />
        </PageTransition>
      </body>
    </html>
  );
}