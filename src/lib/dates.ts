/** All calendar logic runs in Europe/Berlin. Day keys are "YYYY-MM-DD". */
const TZ = "Europe/Berlin";
const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const hourFmt = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" });

export const dayKey = (d: Date = new Date()) => fmt.format(d);
export const berlinHour = (d: Date = new Date()) => Number(hourFmt.format(d));
const toUtc = (k: string) => Date.UTC(+k.slice(0, 4), +k.slice(5, 7) - 1, +k.slice(8, 10));
export const daysBetween = (a: string, b: string) => Math.round((toUtc(b) - toUtc(a)) / 86_400_000);
export const addDays = (k: string, n: number) => new Date(toUtc(k) + n * 86_400_000).toISOString().slice(0, 10);
/** 0 = Monday … 6 = Sunday */
export const weekday = (k: string) => (new Date(toUtc(k)).getUTCDay() + 6) % 7;
/** Monday of the week containing k – used as the week key. */
export const weekKey = (k: string) => addDays(k, -weekday(k));
export const lastNDays = (today: string, n: number) => Array.from({ length: n }, (_, i) => addDays(today, i - n + 1));

export function greeting(h = berlinHour()) {
  if (h < 5) return "Noch wach?";
  if (h < 11) return "Guten Morgen";
  if (h < 17) return "Hallo";
  if (h < 22) return "Guten Abend";
  return "Gute Nacht";
}

export interface Streak { count: number; best: number; last: string | null; freezes: number; freezeWeek: string | null }
export const emptyStreak: Streak = { count: 0, best: 0, last: null, freezes: 0, freezeWeek: null };
const MAX_FREEZES = 3;

/** Grants the free weekly streak freeze once per Monday-week. */
export function grantWeeklyFreeze(s: Streak, today: string): Streak {
  const wk = weekKey(today);
  if (s.freezeWeek === wk) return s;
  return { ...s, freezeWeek: wk, freezes: Math.min(MAX_FREEZES, s.freezes + 1) };
}

/** Settles missed days up to yesterday: spends freezes or resets. Idempotent per day. */
export function settleStreak(s: Streak, today: string): Streak {
  if (!s.last) return s;
  const missed = daysBetween(s.last, today) - 1;
  if (missed <= 0) return s;
  if (s.freezes >= missed) return { ...s, freezes: s.freezes - missed, last: addDays(today, -1) };
  return { ...s, count: 0, last: null };
}

/** Records a qualifying activity day. Returns the new streak and whether it grew. */
export function recordActivity(s: Streak, today: string): { streak: Streak; grew: boolean } {
  const settled = settleStreak(s, today);
  if (settled.last === today) return { streak: settled, grew: false };
  const count = settled.count + 1;
  return { streak: { ...settled, count, best: Math.max(settled.best, count), last: today }, grew: true };
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100];
