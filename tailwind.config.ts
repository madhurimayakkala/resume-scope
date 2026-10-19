import type { Config } from "tailwindcss";

/*
  All colours resolve to the CSS variables in app/globals.css,
  so globals.css is the single source of truth for the palette.
*/
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter Variable'", "Inter", "system-ui", "sans-serif"],
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--text-primary)",

        surface: {
          DEFAULT: "var(--surface)",
          hover: "var(--surface-hover)",
          raised: "var(--surface-raised)",
        },

        line: {
          DEFAULT: "var(--border)",
          soft: "var(--border-soft)",
        },

        tint: {
          DEFAULT: "var(--tint)",
          strong: "var(--tint-strong)",
        },

        ink: {
          DEFAULT: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
        },

        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          line: "var(--accent-line)",
        },

        good: {
          DEFAULT: "var(--good)",
          soft: "var(--good-soft)",
          line: "var(--good-line)",
        },

        critical: {
          DEFAULT: "var(--critical)",
          soft: "var(--critical-soft)",
          line: "var(--critical-line)",
        },

        moderate: {
          DEFAULT: "var(--moderate)",
          soft: "var(--moderate-soft)",
          line: "var(--moderate-line)",
        },

        minor: {
          DEFAULT: "var(--minor)",
          soft: "var(--minor-soft)",
          line: "var(--minor-line)",
        },
      },

      borderRadius: {
        xl2: "24px",
      },

      boxShadow: {
        soft: "var(--shadow-soft)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [],
};

export default config;
