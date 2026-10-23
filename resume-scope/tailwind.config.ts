import type { Config } from "tailwindcss";

/*
  Every color, radius and type size in the UI comes from here, and every
  color resolves to a CSS variable defined once in app/globals.css.
  Do not use arbitrary values (text-[13px], rounded-[24px], bg-[#...]).
*/
const color = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      background: color("background"),
      surface: color("surface"),
      "surface-hover": color("surface-hover"),
      border: color("border"),
      primary: color("text-primary"),
      secondary: color("text-secondary"),
      muted: color("text-muted"),
      accent: color("accent"),
      "accent-foreground": color("accent-foreground"),
      matched: color("matched"),
      partial: color("partial"),
      critical: color("critical"),
    },

    /* Three radii plus pill. */
    borderRadius: {
      none: "0",
      sm: "12px",
      md: "20px",
      lg: "28px",
      full: "9999px",
    },

    /* Named type scale. Only `display` carries tight tracking. */
    fontSize: {
      eyebrow: ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.18em" }],
      caption: ["0.8125rem", { lineHeight: "1.25rem" }],
      body: ["1rem", { lineHeight: "1.75rem" }],
      lead: ["1.125rem", { lineHeight: "1.875rem" }],
      h3: ["1.25rem", { lineHeight: "1.75rem" }],
      h2: ["2rem", { lineHeight: "2.5rem" }],
      h1: ["3rem", { lineHeight: "3.25rem" }],
      display: ["4.5rem", { lineHeight: "4.5rem", letterSpacing: "-0.035em" }],
    },

    fontFamily: {
      sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      display: ["var(--font-display)", "Inter", "system-ui", "sans-serif"],
      mono: [
        "var(--font-mono)",
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace",
      ],
    },

    extend: {
      boxShadow: {
        soft: "0 10px 40px rgb(0 0 0 / 0.18)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [],
};

export default config;
