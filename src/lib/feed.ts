import { daysBetween } from "./dates";

export interface FeedSnack { id: string; category: string; interactive: boolean }

/** Small seeded PRNG (mulberry32) so a feed order is stable within a session. */
export function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Orders feed snacks (CLAUDE.md §7.2): nothing repeated within 14 days (falls back to the least recently seen
 * when the pool runs dry), favourite categories weighted ×2.5, interactive and passive cards alternate.
 */
export function orderFeed(snacks: FeedSnack[], o: { favorites: string[]; seen: Record<string, string>; today: string; seed: number }): FeedSnack[] {
  const rand = rng(o.seed);
  const age = (s: FeedSnack) => (o.seen[s.id] ? daysBetween(o.seen[s.id], o.today) : Infinity);
  const fresh = snacks.filter((s) => age(s) >= 14);
  const stale = snacks.filter((s) => age(s) < 14).sort((a, b) => age(b) - age(a));
  // Weighted random order (Efraimidis–Spirakis): key = u^(1/w)
  const keyed = fresh.map((s) => ({ s, k: Math.pow(rand(), 1 / (o.favorites.includes(s.category) ? 2.5 : 1)) })).sort((a, b) => b.k - a.k).map((x) => x.s);
  const pool = [...keyed, ...stale];
  const out: FeedSnack[] = [];
  while (pool.length) {
    const want = out.length ? !out[out.length - 1].interactive : pool[0].interactive;
    const i = pool.findIndex((s) => s.interactive === want);
    out.push(pool.splice(i >= 0 && i < 4 ? i : 0, 1)[0]);
  }
  return out;
}
