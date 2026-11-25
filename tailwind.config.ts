import type { Config } from "tailwindcss";
import tokens from "./brand/tokens.json";

const names = tokens.color.tokens.map((t) => t.name);
const colors = Object.fromEntries(names.map((n) => [n, `rgb(var(--c-${n}) / <alpha-value>)`]));

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { ...colors, good: "#1E9E6A", gold: "#F2B84B" },
      fontFamily: {
        display: ["Archivo", "Arial Black", "sans-serif"],
        sans: ["Atkinson Hyperlegible", "system-ui", "sans-serif"],
      },
      borderRadius: { card: "24px" },
      boxShadow: { soft: "0 2px 12px rgba(0,33,68,.08)", lift: "0 8px 28px rgba(0,33,68,.14)" },
    },
  },
} satisfies Config;
