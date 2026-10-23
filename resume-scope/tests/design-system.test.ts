/*
  Guards for the design-system rules: tokens are the only source of
  color, radii and type sizes come from the scale, fonts load through
  next/font, nothing is italic or serif, and text contrast meets WCAG AA.
*/
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { BRAND } from "@/lib/brand";

const root = path.resolve(__dirname, "..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");

function walk(dir: string): string[] {
  return readdirSync(path.join(root, dir)).flatMap((name) => {
    const rel = path.join(dir, name);
    return statSync(path.join(root, rel)).isDirectory() ? walk(rel) : [rel];
  });
}

const sourceFiles = [...walk("app"), ...walk("components")].filter((f) => /\.(tsx?|css)$/.test(f));
const componentFiles = sourceFiles.filter((f) => f.endsWith(".tsx") || f.endsWith(".ts"));

const css = read("app/globals.css");

function token(name: string): [number, number, number] {
  const m = css.match(new RegExp(`--${name}:\\s*(\\d+) (\\d+) (\\d+);`));
  if (!m) throw new Error(`token --${name} not found`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

const luminance = ([r, g, b]: number[]) => {
  const [R, G, B] = [r, g, b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = ([r, g, b]: number[]) =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

describe("no hardcoded values in components", () => {
  it.each(sourceFiles.filter((f) => !f.endsWith("globals.css")))("%s has no hex colors", (file) => {
    expect(read(file)).not.toMatch(/#[0-9a-fA-F]{3,8}\b(?![\w-])/);
  });

  it.each(componentFiles)("%s has no arbitrary radius or text size", (file) => {
    const src = read(file);
    expect(src).not.toMatch(/rounded(-[a-z]+)?-\[/);
    expect(src).not.toMatch(/text-\[/);
    expect(src).not.toMatch(/tracking-\[/);
  });

  it.each(componentFiles)("%s is free of italic, serif and outline-none", (file) => {
    const src = read(file);
    expect(src).not.toMatch(/\bitalic\b|font-serif|font-italic|<em[\s>]/);
    expect(src).not.toMatch(/outline-none/);
  });

  it("has no inline style attributes carrying colors in components", () => {
    for (const file of componentFiles.filter((f) => f.startsWith("components"))) {
      expect(read(file)).not.toMatch(/style=\{\{[^}]*(color|background)/);
    }
  });
});

describe("design tokens", () => {
  it("globals.css defines exactly one navy and one cream", () => {
    expect(hex(token("background"))).toBe(BRAND.background);
    expect(hex(token("text-primary"))).toBe(BRAND.cream);
    expect(token("accent")).toEqual(token("text-primary"));
    expect(token("accent-foreground")).toEqual(token("background"));
  });

  it("BRAND mirrors the CSS tokens", () => {
    expect(hex(token("surface"))).toBe(BRAND.surface);
    expect(hex(token("border"))).toBe(BRAND.border);
    expect(hex(token("text-muted"))).toBe(BRAND.muted);
  });

  it("the status colors are the specified muted palette", () => {
    expect(hex(token("matched"))).toBe("#9DB8A0");
    expect(hex(token("partial"))).toBe("#D9B26F");
    expect(hex(token("critical"))).toBe("#D98B7A");
  });

  it("tailwind exposes a 3-step radius scale plus pill and a named type scale", () => {
    const config = read("tailwind.config.ts");
    expect(config).toMatch(/sm: "12px"[\s\S]*md: "20px"[\s\S]*lg: "28px"[\s\S]*full:/);
    for (const size of ["eyebrow", "caption", "body", "lead", "h3", "h2", "h1", "display"]) {
      expect(config).toMatch(new RegExp(`\\b${size}: \\[`));
    }
    // only display carries tight tracking
    expect(config.match(/letterSpacing: "-/g)).toHaveLength(1);
  });
});

describe("WCAG AA contrast (>= 4.5:1) on every surface", () => {
  const surfaces = ["background", "surface", "surface-hover"];
  const texts = ["text-primary", "text-secondary", "text-muted", "matched", "partial", "critical"];

  for (const surface of surfaces) {
    for (const text of texts) {
      it(`${text} on ${surface}`, () => {
        expect(contrast(token(text), token(surface))).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it("accent-foreground on accent (primary button)", () => {
    expect(contrast(token("accent-foreground"), token("accent"))).toBeGreaterThanOrEqual(4.5);
  });
});

describe("fonts", () => {
  const layout = read("app/layout.tsx");

  it("loads all three families through next/font/google with swap and CSS variables", () => {
    expect(layout).toMatch(/from "next\/font\/google"/);
    for (const family of ["Bricolage_Grotesque", "Inter", "JetBrains_Mono"]) {
      expect(layout).toContain(family);
    }
    expect(layout.match(/display: "swap"/g)).toHaveLength(3);
    for (const v of ["--font-display", "--font-sans", "--font-mono"]) expect(layout).toContain(v);
  });

  it("Bricolage is upright 700/800 only", () => {
    expect(layout).toMatch(/weight: \["700", "800"\]/);
    expect(layout.match(/style: "normal"/g)).toHaveLength(3);
  });

  it("global CSS forces upright text and applies no global heading tracking", () => {
    expect(css).toMatch(/em,[\s\S]*font-style: normal/);
    expect(css).not.toMatch(/h1,\s*h2[\s\S]{0,80}letter-spacing/);
  });
});

describe("motion", () => {
  it("respects prefers-reduced-motion and keeps fade-up from flashing", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(css).toMatch(/animation: fadeUp[^;]*\bboth\b/);
    expect(css).not.toMatch(/forwards/);
  });

  it("no PageTransition gate remains", () => {
    expect(componentFiles.some((f) => f.includes("PageTransition"))).toBe(false);
  });
});
