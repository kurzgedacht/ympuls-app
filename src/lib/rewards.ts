export type Rarity = "normal" | "selten" | "episch";
export type ChestReward =
  | { kind: "puls"; amount: number; rarity: Rarity }
  | { kind: "boost"; minutes: number; rarity: Rarity }
  | { kind: "freeze"; rarity: Rarity }
  | { kind: "card"; id: string; rarity: Rarity };

/** Bonus collectibles that only drop from the daily chest. */
export const CHEST_CARDS = [
  { id: "bonus-puls", title: "Ruhepuls", line: "Wer ruhig bleibt, denkt klarer.", icon: "💓" },
  { id: "bonus-zins", title: "Zinseszins", line: "Kleine Schritte, riesige Kurve.", icon: "📈" },
  { id: "bonus-fokus", title: "Tunnelblick", line: "Eine Sache. Ganz.", icon: "🎯" },
  { id: "bonus-schlaf", title: "Nachtschicht", line: "Muskeln wachsen im Schlaf.", icon: "🌙" },
  { id: "bonus-start", title: "Erster Kunde", line: "Fertig schlägt perfekt.", icon: "🚀" },
  { id: "bonus-buch", title: "Eselsohr", line: "Ein Buch, eine Idee, ein Schritt.", icon: "📚" },
];

/** Weighted chest roll. rnd is injectable for tests. */
export function rollChest(owned: string[], rnd: () => number = Math.random): ChestReward {
  const r = rnd();
  const missing = CHEST_CARDS.filter((c) => !owned.includes(c.id));
  if (r < 0.06 && missing.length) return { kind: "card", id: missing[Math.floor(rnd() * missing.length)].id, rarity: "episch" };
  if (r < 0.16) return { kind: "freeze", rarity: "selten" };
  if (r < 0.32) return { kind: "boost", minutes: 15, rarity: "selten" };
  if (r < 0.45) return { kind: "puls", amount: 50, rarity: "selten" };
  return { kind: "puls", amount: 10 + Math.floor(rnd() * 3) * 5, rarity: "normal" };
}

export interface BadgeStats {
  lessonsTotal: number; streakBest: number; correctTotal: number; categoriesTried: number; categoriesAll: number;
  booksDone: number; perfectTotal: number; savedTotal: number; snacksTotal: number; reviewRounds: number;
  coursesDone: number; level: number; maxCombo: number; hour: number; justLearned: boolean;
}
export const BADGES: { id: string; title: string; desc: string; icon: string; test: (s: BadgeStats) => boolean }[] = [
  { id: "first-lesson", title: "Erste Lektion", desc: "Die erste Lektion geschafft.", icon: "🎯", test: (s) => s.lessonsTotal >= 1 },
  { id: "streak-3", title: "Warmgelaufen", desc: "3 Tage am Stück gelernt.", icon: "🔥", test: (s) => s.streakBest >= 3 },
  { id: "streak-7", title: "7-Tage-Streak", desc: "Eine ganze Woche dabei.", icon: "📅", test: (s) => s.streakBest >= 7 },
  { id: "streak-30", title: "Monats-Puls", desc: "30 Tage Streak.", icon: "🏆", test: (s) => s.streakBest >= 30 },
  { id: "early-bird", title: "Frühaufsteher", desc: "Vor 8 Uhr gelernt.", icon: "🌅", test: (s) => s.justLearned && s.hour < 8 },
  { id: "night-owl", title: "Nachteule", desc: "Nach 22 Uhr gelernt.", icon: "🦉", test: (s) => s.justLearned && s.hour >= 22 },
  { id: "correct-100", title: "100 Treffer", desc: "100 Fragen richtig beantwortet.", icon: "💯", test: (s) => s.correctTotal >= 100 },
  { id: "all-cats", title: "Allrounder", desc: "Alle Kategorien probiert.", icon: "🧭", test: (s) => s.categoriesAll >= 5 && s.categoriesTried >= s.categoriesAll },
  { id: "bookworm", title: "Bücherwurm", desc: "5 Buch-Guides fertig.", icon: "📚", test: (s) => s.booksDone >= 5 },
  { id: "perfect-5", title: "Fehlerlos", desc: "5 perfekte Lektionen.", icon: "👑", test: (s) => s.perfectTotal >= 5 },
  { id: "collector", title: "Sammler", desc: "25 Karten gespeichert.", icon: "🗂️", test: (s) => s.savedTotal >= 25 },
  { id: "feed-100", title: "Snack-Profi", desc: "100 Feed-Snacks gesehen.", icon: "🍿", test: (s) => s.snacksTotal >= 100 },
  { id: "review-10", title: "Gedächtnis", desc: "10 Wiederholungsrunden.", icon: "🧠", test: (s) => s.reviewRounds >= 10 },
  { id: "course-1", title: "Kurs komplett", desc: "Den ersten Kurs abgeschlossen.", icon: "🎓", test: (s) => s.coursesDone >= 1 },
  { id: "level-5", title: "Level 5", desc: "Level 5 erreicht.", icon: "⚡", test: (s) => s.level >= 5 },
  { id: "level-10", title: "Level 10", desc: "Level 10 erreicht.", icon: "🚀", test: (s) => s.level >= 10 },
  { id: "combo-10", title: "Hochpuls", desc: "10 richtige Antworten in Folge.", icon: "💓", test: (s) => s.maxCombo >= 10 },
];
export const newBadges = (s: BadgeStats, owned: Record<string, number>) => BADGES.filter((b) => !owned[b.id] && b.test(s)).map((b) => b.id);

/** Combo: heart rate display and Puls multiplier. */
export const comboBpm = (combo: number) => Math.min(72 + combo * 18, 190);
export const comboMultiplier = (combo: number) => (combo >= 3 ? 2 : 1);
