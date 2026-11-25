import tokens from "../brand/tokens.json";

type Theme = "light" | "dark";
const hexToRgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(" ");
const vars = (t: Theme) => tokens.color.tokens.map((x) => `--c-${x.name}:${hexToRgb((x.value as Record<Theme, string>)[t])};`).join("");

/** CSS custom properties for both themes, straight from brand/tokens.json. */
export const tokenCss = `:root{${vars("light")}}.dark{${vars("dark")}}`;
export const color = Object.fromEntries(tokens.color.tokens.map((x) => [x.name, x.value])) as Record<string, Record<Theme, string>>;
export const GOOD = "#1E9E6A";
export const GOLD = "#F2B84B";

export const categories = [
  { slug: "finanzen", label: "Finanzen", color: "#1E9E6A" },
  { slug: "self", label: "Persönlichkeit", color: "#7B5CD6" },
  { slug: "sport", label: "Sport & Training", color: "#D11F3A" },
  { slug: "ernaehrung", label: "Ernährung", color: "#F2B84B" },
  { slug: "technik", label: "Technik", color: "#2F7FD8" },
  { slug: "business", label: "Karriere & Business", color: "#002144" },
  { slug: "buecher", label: "Bücher & Konzepte", color: "#B5651D" },
] as const;
export type CategorySlug = (typeof categories)[number]["slug"];
export const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c])) as Record<CategorySlug, (typeof categories)[number]>;
export const spring = { type: "spring", stiffness: 420, damping: 30 } as const;
