import { beforeEach, describe, expect, it } from "vitest";
import { useStore, initialState, today, dayOf } from "../src/store/useStore";
import { useFx } from "../src/store/fx";

const s = () => useStore.getState();
beforeEach(() => {
  useStore.setState({ ...initialState, onboarded: true });
  useFx.setState({ queue: [], ping: null });
});

describe("store", () => {
  it("answers feed spaced repetition, combo and Puls", () => {
    expect(s().answer("c/x/y/1", true)).toBe(10);
    expect(s().srs["c/x/y/1"].box).toBe(0);
    s().answer("c/x/y/2", true);
    expect(s().answer("c/x/y/3", true)).toBe(20); // 3 in a row → double
    expect(s().combo).toBe(3);
    expect(s().answer("c/x/y/4", false)).toBe(0);
    expect(s().combo).toBe(0);
    expect(s().totals).toMatchObject({ answered: 4, correct: 3, maxCombo: 3 });
  });
  it("review answers give 5 Puls without combo bonus", () => {
    useStore.setState({ combo: 5 });
    expect(s().answer("q", true, { review: true })).toBe(5);
  });
  it("levels up with an overlay", () => {
    useStore.setState({ xp: 95 });
    s().gain(10, { noCombo: true });
    expect(useFx.getState().queue).toContainEqual({ kind: "levelup", level: 2 });
  });
  it("completes lessons: progress, streak, perfect bonus", () => {
    const r = s().completeLesson("geld-grundlagen", "wohin-geht-dein-geld", true, "finanzen");
    expect(r.bonus).toBe(25);
    expect(s().progress["geld-grundlagen"]).toEqual(["wohin-geht-dein-geld"]);
    expect(s().perfect).toContain("geld-grundlagen/wohin-geht-dein-geld");
    expect(s().streak.count).toBe(1);
    expect(dayOf(s()).lessons).toBe(1);
    expect(s().badges["first-lesson"]).toBeTruthy();
  });
  it("unlocks the collectible card when the whole course is done", () => {
    const lessons = ["wohin-geht-dein-geld", "erst-dich-bezahlen", "notgroschen", "zinseszins", "inflation"];
    useStore.setState({ progress: { "geld-grundlagen": lessons } });
    const r = s().completeLesson("geld-grundlagen", "zeit-schlaegt-timing", false);
    expect(r.unlockedCard).toBe(true);
    expect(r.unitDone).toBe(true);
    expect(s().collection).toContain("geld-grundlagen");
  });
  it("10 feed snacks count for the streak, each snack once a day", () => {
    for (let i = 0; i < 9; i++) s().seeSnack(`s${i}`);
    s().seeSnack("s0");
    expect(s().streak.count).toBe(0);
    s().seeSnack("s9");
    expect(dayOf(s()).snacks).toBe(10);
    expect(s().streak.count).toBe(1);
  });
  it("saves insights once and toggles", () => {
    s().ensureSaved("a"); s().ensureSaved("a");
    expect(s().saved).toHaveLength(1);
    expect(s().toggleSave("a")).toBe(false);
    expect(s().saved).toHaveLength(0);
  });
  it("opens the chest once per day", () => {
    s().openChest();
    expect(s().chestDay).toBe(today());
  });
  it("fires the daily goal once", () => {
    useStore.setState({ settings: { ...initialState.settings, goal: 5 } });
    for (let i = 0; i < 3; i++) s().addTime(120);
    expect(useFx.getState().queue.filter((o) => o.kind === "goal")).toHaveLength(1);
  });
});
