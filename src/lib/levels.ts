export const LEVEL_TITLES = [
  "Neugierig", "Funke", "Entdecker", "Wissbegierig", "Aufgeweckt", "Querdenker", "Durchstarter", "Ideensammler",
  "Kopfsportler", "Wissensläufer", "Aha-Jäger", "Denkmaschine", "Klarseher", "Puls-Profi", "Vordenker",
  "Wissensathlet", "Strategiekopf", "Meisterhirn", "Weitblick", "Puls-Legende",
];
// Level n needs 100 + 50·(n-1) more Puls than level n-1: 100, 250, 450, 700 …
export const levelStart = (lvl: number) => (lvl <= 1 ? 0 : 25 * (lvl - 1) * (lvl + 2));
export function levelInfo(xp: number) {
  let level = 1;
  while (level < LEVEL_TITLES.length && xp >= levelStart(level + 1)) level++;
  const start = levelStart(level);
  const next = level < LEVEL_TITLES.length ? levelStart(level + 1) : start;
  return { level, title: LEVEL_TITLES[level - 1], start, next, progress: next === start ? 1 : (xp - start) / (next - start) };
}
