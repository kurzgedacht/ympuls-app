import { describe, expect, it } from "vitest";
import { schedule, dueIds } from "../src/lib/srs";
import { levelInfo, levelStart } from "../src/lib/levels";
import { rollChest, newBadges, comboMultiplier, comboBpm } from "../src/lib/rewards";
import { lessonRuleErrors, type Card } from "../src/content/schema";

describe("srs", () => {
  it("climbs 1,3,7,16,35 and falls back to 1 day", () => {
    let it1 = schedule(undefined, true, "2026-11-01");
    expect(it1).toEqual({ box: 0, due: "2026-11-02" });
    it1 = schedule(it1, true, "2026-11-02");
    expect(it1.due).toBe("2026-11-05");
    it1 = schedule(schedule(schedule(it1, true, "2026-11-05"), true, "2026-11-12"), true, "2026-11-28");
    expect(it1.box).toBe(4);
    expect(schedule(it1, false, "2026-12-01")).toEqual({ box: 0, due: "2026-12-02" });
  });
  it("caps due items at 10", () => {
    const srs = Object.fromEntries(Array.from({ length: 15 }, (_, i) => [`q${i}`, { box: 0, due: "2026-11-01" }]));
    expect(dueIds(srs, "2026-11-02")).toHaveLength(10);
    expect(dueIds(srs, "2026-10-31")).toHaveLength(0);
  });
});

describe("levels", () => {
  it("uses growing thresholds 100, 250, 450", () => {
    expect([2, 3, 4].map(levelStart)).toEqual([100, 250, 450]);
    expect(levelInfo(0).level).toBe(1);
    expect(levelInfo(260)).toMatchObject({ level: 3, start: 250, next: 450 });
    expect(levelInfo(1e9).level).toBe(20);
  });
});

describe("rewards", () => {
  it("rolls weighted chest rewards", () => {
    expect(rollChest([], () => 0.01).kind).toBe("card");
    expect(rollChest([], () => 0.1).kind).toBe("freeze");
    expect(rollChest([], () => 0.2).kind).toBe("boost");
    expect(rollChest([], () => 0.9)).toMatchObject({ kind: "puls", rarity: "normal" });
  });
  it("combo doubles from 3 in a row", () => {
    expect(comboMultiplier(2)).toBe(1);
    expect(comboMultiplier(3)).toBe(2);
    expect(comboBpm(0)).toBe(72);
  });
  it("awards badges once", () => {
    const base = { lessonsTotal: 1, streakBest: 0, correctTotal: 0, categoriesTried: 0, categoriesAll: 7, booksDone: 0, perfectTotal: 0, savedTotal: 0, snacksTotal: 0, reviewRounds: 0, coursesDone: 0, level: 1, maxCombo: 0, hour: 7, justLearned: true };
    expect(newBadges(base, {})).toEqual(["first-lesson", "early-bird"]);
    expect(newBadges(base, { "first-lesson": 1, "early-bird": 1 })).toEqual([]);
  });
});

describe("lesson rules", () => {
  const story = (t = "eins zwei drei vier fünf sechs sieben acht neun zehn elf zwölf dreizehn vierzehn fünfzehn"): Card => ({ type: "story", text: t, art: "art/a.svg" });
  it("flags missing insight, interactions and recap", () => {
    const errs = lessonRuleErrors([story()]);
    expect(errs.join()).toMatch(/insight/);
    expect(errs.join()).toMatch(/interactive/);
    expect(errs.join()).toMatch(/recap/);
  });
  it("flags short stories", () => {
    expect(lessonRuleErrors([story("zu kurz")]).join()).toMatch(/15–50 words/);
  });
});
