import { create } from "zustand";
import { persist } from "zustand/middleware";
import { dayKey, berlinHour, emptyStreak, grantWeeklyFreeze, recordActivity, settleStreak, STREAK_MILESTONES, weekKey, type Streak } from "../lib/dates";
import { levelInfo } from "../lib/levels";
import { schedule, type SrsItem } from "../lib/srs";
import { newBadges, rollChest, comboMultiplier, type ChestReward } from "../lib/rewards";
import type { CategorySlug } from "../brand";
import { courseBySlug, courses, lessonOrder } from "../content";
import { fx } from "./fx";

export interface DayStat { sec: number; snacks: number; lessons: number; reviews: number; correct: number }
export interface Settings {
  sound: boolean; haptics: boolean; theme: "system" | "light" | "dark"; goal: 5 | 10 | 15; favorites: CategorySlug[];
}
export interface State {
  xp: number;
  onboarded: boolean;
  tapHintSeen: boolean;
  progress: Record<string, string[]>; // course → finished lesson slugs
  perfect: string[]; // "course/lesson"
  lastCourse: string | null;
  bookmarks: string[];
  saved: { id: string; at: number }[];
  srs: Record<string, SrsItem>;
  streak: Streak;
  days: Record<string, DayStat>;
  totals: { lessons: number; correct: number; answered: number; snacks: number; reviews: number; maxCombo: number };
  categoriesTried: string[];
  combo: number;
  chestDay: string | null;
  boostUntil: number;
  badges: Record<string, number>;
  collection: string[]; // finished course slugs + chest card ids
  feedSeen: Record<string, string>; // snack id → day
  milestones: number[];
  recapWeek: string | null;
  goalDay: string | null;
  settings: Settings;
}
interface Actions {
  set: (p: Partial<State>) => void;
  setSettings: (p: Partial<Settings>) => void;
  startOfDay: () => void;
  gain: (base: number, opts?: { noCombo?: boolean }) => number;
  answer: (id: string | null, correct: boolean, opts?: { review?: boolean }) => number;
  addTime: (sec: number) => void;
  completeLesson: (course: string | null, lesson: string, perfect: boolean, category?: string) => { bonus: number; unlockedCard: boolean; unitDone: boolean };
  completeReview: () => void;
  seeSnack: (id: string) => void;
  toggleSave: (id: string) => boolean;
  ensureSaved: (id: string) => void;
  toggleBookmark: (slug: string) => void;
  openChest: () => ChestReward;
  checkBadges: (justLearned?: boolean) => void;
  reset: () => void;
}

const emptyDay: DayStat = { sec: 0, snacks: 0, lessons: 0, reviews: 0, correct: 0 };
export const initialState: State = {
  xp: 0, onboarded: false, tapHintSeen: false, progress: {}, perfect: [], lastCourse: null, bookmarks: [], saved: [], srs: {},
  streak: emptyStreak, days: {}, totals: { lessons: 0, correct: 0, answered: 0, snacks: 0, reviews: 0, maxCombo: 0 }, categoriesTried: [],
  combo: 0, chestDay: null, boostUntil: 0, badges: {}, collection: [], feedSeen: {}, milestones: [], recapWeek: null, goalDay: null,
  settings: { sound: true, haptics: true, theme: "system", goal: 10, favorites: [] },
};

export const today = () => dayKey();
export const dayOf = (s: State, k = today()) => s.days[k] ?? emptyDay;

export const useStore = create<State & Actions>()(
  persist(
    (set, get) => {
      const patchDay = (p: (d: DayStat) => Partial<DayStat>) => {
        const k = today();
        const d = dayOf(get(), k);
        set({ days: { ...get().days, [k]: { ...d, ...p(d) } } });
      };
      const activity = () => {
        const { streak, grew } = recordActivity(get().streak, today());
        set({ streak });
        if (grew && STREAK_MILESTONES.includes(streak.count) && !get().milestones.includes(streak.count)) {
          set({ milestones: [...get().milestones, streak.count] });
          fx.push({ kind: "milestone", days: streak.count });
        }
      };
      const checkGoal = () => {
        const s = get();
        if (s.goalDay !== today() && dayOf(s).sec >= s.settings.goal * 60) {
          set({ goalDay: today() });
          fx.push({ kind: "goal" });
        }
      };
      return {
        ...initialState,
        set: (p) => set(p),
        setSettings: (p) => set({ settings: { ...get().settings, ...p } }),
        startOfDay: () => {
          const k = today();
          set({ streak: settleStreak(grantWeeklyFreeze(get().streak, k), k) });
        },
        gain: (base, opts) => {
          const s = get();
          const mult = (opts?.noCombo ? 1 : comboMultiplier(s.combo)) * (Date.now() < s.boostUntil ? 2 : 1);
          const amount = base * mult;
          const before = levelInfo(s.xp).level;
          set({ xp: s.xp + amount });
          fx.puls(amount);
          const after = levelInfo(s.xp + amount).level;
          if (after > before) fx.push({ kind: "levelup", level: after });
          return amount;
        },
        answer: (id, correct, opts) => {
          const s = get();
          const combo = correct ? s.combo + 1 : 0;
          set({
            combo,
            srs: id ? { ...s.srs, [id]: schedule(s.srs[id], correct, today()) } : s.srs,
            totals: { ...s.totals, answered: s.totals.answered + 1, correct: s.totals.correct + (correct ? 1 : 0), maxCombo: Math.max(s.totals.maxCombo, combo) },
          });
          if (correct) patchDay((d) => ({ correct: d.correct + 1 }));
          return correct ? get().gain(opts?.review ? 5 : 10, { noCombo: opts?.review }) : 0;
        },
        addTime: (sec) => {
          if (sec <= 0) return;
          patchDay((d) => ({ sec: d.sec + Math.min(sec, 120) }));
          checkGoal();
        },
        completeLesson: (course, lesson, perfect, category) => {
          const s = get();
          let unlockedCard = false, unitDone = false;
          const done = course ? Array.from(new Set([...(s.progress[course] ?? []), lesson])) : [];
          if (course) {
            const c = courseBySlug[course];
            const unit = c?.units.find((u) => u.lessons.includes(lesson));
            unitDone = !!unit && unit.lessons.every((l) => done.includes(l)) && !unit.lessons.every((l) => (s.progress[course] ?? []).includes(l));
            unlockedCard = !!c && lessonOrder(c).every((l) => done.includes(l)) && !s.collection.includes(course);
            set({
              progress: { ...s.progress, [course]: done }, lastCourse: course,
              perfect: perfect ? Array.from(new Set([...s.perfect, `${course}/${lesson}`])) : s.perfect,
              collection: unlockedCard ? [...s.collection, course] : s.collection,
            });
          }
          set({
            totals: { ...get().totals, lessons: get().totals.lessons + 1 },
            categoriesTried: category && !get().categoriesTried.includes(category) ? [...get().categoriesTried, category] : get().categoriesTried,
          });
          patchDay((d) => ({ lessons: d.lessons + 1 }));
          activity();
          const bonus = perfect ? get().gain(25, { noCombo: true }) : 0;
          get().checkBadges(true);
          return { bonus, unlockedCard, unitDone };
        },
        completeReview: () => {
          set({ totals: { ...get().totals, reviews: get().totals.reviews + 1 } });
          patchDay((d) => ({ reviews: d.reviews + 1 }));
          activity();
          get().checkBadges(true);
        },
        seeSnack: (id) => {
          const s = get();
          if (s.feedSeen[id] === today()) return;
          set({ feedSeen: { ...s.feedSeen, [id]: today() }, totals: { ...s.totals, snacks: s.totals.snacks + 1 } });
          patchDay((d) => ({ snacks: d.snacks + 1 }));
          if (dayOf(get()).snacks === 10) activity();
        },
        toggleSave: (id) => {
          const s = get();
          const has = s.saved.some((x) => x.id === id);
          set({ saved: has ? s.saved.filter((x) => x.id !== id) : [{ id, at: Date.now() }, ...s.saved] });
          if (!has) get().checkBadges();
          return !has;
        },
        ensureSaved: (id) => {
          if (!get().saved.some((x) => x.id === id)) get().toggleSave(id);
        },
        toggleBookmark: (slug) => {
          const b = get().bookmarks;
          set({ bookmarks: b.includes(slug) ? b.filter((x) => x !== slug) : [...b, slug] });
        },
        openChest: () => {
          const s = get();
          const reward = rollChest(s.collection);
          set({ chestDay: today() });
          if (reward.kind === "puls") get().gain(reward.amount, { noCombo: true });
          if (reward.kind === "boost") set({ boostUntil: Date.now() + reward.minutes * 60_000 });
          if (reward.kind === "freeze") set({ streak: { ...s.streak, freezes: s.streak.freezes + 1 } });
          if (reward.kind === "card") set({ collection: [...s.collection, reward.id] });
          return reward;
        },
        checkBadges: (justLearned = false) => {
          const s = get();
          const fin = (slug: string) => s.collection.includes(slug);
          const ids = newBadges({
            lessonsTotal: s.totals.lessons, streakBest: s.streak.best, correctTotal: s.totals.correct,
            categoriesTried: s.categoriesTried.length, categoriesAll: new Set(courses.map((c) => c.category)).size,
            booksDone: courses.filter((c) => c.format === "book" && fin(c.slug)).length, perfectTotal: s.perfect.length,
            savedTotal: s.saved.length, snacksTotal: s.totals.snacks, reviewRounds: s.totals.reviews,
            coursesDone: courses.filter((c) => fin(c.slug)).length, level: levelInfo(s.xp).level, maxCombo: s.totals.maxCombo,
            hour: berlinHour(), justLearned,
          }, s.badges);
          if (!ids.length) return;
          set({ badges: { ...s.badges, ...Object.fromEntries(ids.map((id) => [id, Date.now()])) } });
          ids.forEach((id) => fx.push({ kind: "badge", id }));
        },
        reset: () => set({ ...initialState, onboarded: true, tapHintSeen: true, settings: get().settings }),
      };
    },
    { name: "ympuls", version: 1 },
  ),
);

export const weekRecapDue = (s: State) => {
  const wk = weekKey(today());
  return s.recapWeek !== wk && Object.keys(s.days).some((d) => d < wk);
};
