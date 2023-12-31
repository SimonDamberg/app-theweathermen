import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /bg-*/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /ring-offset-*/,
      variants: ["focus"],
    },
    {
      pattern: /ring-*/,
      variants: ["focus", "focus-visible"],
    },
    {
      pattern: /divide-*/,
    },
    {
      pattern: /text-*/,
      variants: ["hover", "focus"],
    },
    {
      pattern: /border-*/,
    },
  ],
};
export default config;
