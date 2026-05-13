import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#212842",

        foreground: "#F0E7D5",

        surface: "rgba(255,255,255,0.04)",
      },

      borderRadius: {
        xl2: "24px",
      },

      boxShadow: {
        soft:
          "0 10px 40px rgba(0,0,0,0.18)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },

  plugins: [],
};

export default config;