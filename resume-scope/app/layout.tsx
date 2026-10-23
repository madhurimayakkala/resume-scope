import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

import Footer from "@/components/Footer";
import { BRAND } from "@/lib/brand";
import "./globals.css";

/* Bricolage Grotesque for headings, Inter for UI, JetBrains Mono for data. */
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  style: "normal",
  display: "swap",
  variable: "--font-display",
  fallback: ["Inter", "system-ui", "sans-serif"],
});

const sans = Inter({
  subsets: ["latin"],
  style: "normal",
  display: "swap",
  variable: "--font-sans",
  fallback: ["system-ui", "sans-serif"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  style: "normal",
  display: "swap",
  variable: "--font-mono",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

const SITE_NAME = "Resume Scope";
const DESCRIPTION =
  "Match your resume against any job description. See matched skills, critical gaps and prioritized fixes, all from a deterministic, explainable engine.";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${SITE_NAME} — see how well your resume fits the role`,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — see how well your resume fits the role`,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — see how well your resume fits the role`,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: BRAND.background,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-accent focus-visible:px-4 focus-visible:py-2 focus-visible:text-accent-foreground"
        >
          Skip to content
        </a>
        {children}
        <Footer />
      </body>
    </html>
  );
}
