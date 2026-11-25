import { describe, expect, it } from "vitest";
import { orderFeed } from "../src/lib/feed";

const mk = (n: number, cat: string, interactive: boolean) => Array.from({ length: n }, (_, i) => ({ id: `${cat}-${interactive ? "q" : "f"}${i}`, category: cat, interactive }));
const snacks = [...mk(10, "sport", false), ...mk(10, "sport", true), ...mk(10, "technik", false), ...mk(10, "technik", true)];

describe("feed order", () => {
  it("keeps every snack exactly once", () => {
    const r = orderFeed(snacks, { favorites: [], seen: {}, today: "2026-11-25", seed: 1 });
    expect(new Set(r.map((s) => s.id)).size).toBe(snacks.length);
  });
  it("alternates interactive and passive", () => {
    const r = orderFeed(snacks, { favorites: [], seen: {}, today: "2026-11-25", seed: 2 });
    const flips = r.slice(1).filter((s, i) => s.interactive !== r[i].interactive).length;
    expect(flips).toBeGreaterThanOrEqual(r.length - 3);
  });
  it("puts recently seen snacks last", () => {
    const seen = Object.fromEntries(snacks.slice(0, 5).map((s) => [s.id, "2026-11-20"]));
    const r = orderFeed(snacks, { favorites: [], seen, today: "2026-11-25", seed: 3 });
    expect(r.slice(0, 30).some((s) => seen[s.id])).toBe(false);
  });
  it("weights favourite categories", () => {
    let fav = 0;
    for (let seed = 0; seed < 40; seed++) fav += orderFeed(snacks, { favorites: ["sport"], seen: {}, today: "2026-11-25", seed }).slice(0, 10).filter((s) => s.category === "sport").length;
    expect(fav / 40).toBeGreaterThan(6);
  });
});
