import { describe, expect, it } from "vitest";
import { addDays, dayKey, daysBetween, emptyStreak, grantWeeklyFreeze, recordActivity, settleStreak, weekKey, weekday, greeting } from "../src/lib/dates";

describe("dates", () => {
  it("uses Europe/Berlin day boundaries", () => {
    expect(dayKey(new Date("2026-11-24T23:30:00Z"))).toBe("2026-11-25"); // 00:30 in Berlin
    expect(dayKey(new Date("2026-07-01T21:59:00Z"))).toBe("2026-07-01"); // 23:59 CEST
    expect(dayKey(new Date("2026-07-01T22:01:00Z"))).toBe("2026-07-02");
  });
  it("does day math across DST and month ends", () => {
    expect(daysBetween("2026-03-28", "2026-03-30")).toBe(2);
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-10-24", 2)).toBe("2026-10-26");
  });
  it("finds the Monday week key", () => {
    expect(weekday("2026-11-23")).toBe(0);
    expect(weekKey("2026-11-29")).toBe("2026-11-23");
  });
  it("greets by time of day", () => { expect(greeting(7)).toBe("Guten Morgen"); expect(greeting(20)).toBe("Guten Abend"); });
});

describe("streak", () => {
  it("counts consecutive days once per day", () => {
    let s = recordActivity(emptyStreak, "2026-11-01").streak;
    expect(s.count).toBe(1);
    const again = recordActivity(s, "2026-11-01");
    expect(again.grew).toBe(false);
    s = recordActivity(s, "2026-11-02").streak;
    expect(s).toMatchObject({ count: 2, best: 2, last: "2026-11-02" });
  });
  it("spends a freeze for a missed day", () => {
    const s = { ...emptyStreak, count: 5, best: 5, last: "2026-11-01", freezes: 1 };
    const r = recordActivity(s, "2026-11-03").streak;
    expect(r).toMatchObject({ count: 6, freezes: 0 });
  });
  it("resets without enough freezes", () => {
    const s = { ...emptyStreak, count: 5, best: 5, last: "2026-11-01", freezes: 1 };
    expect(settleStreak(s, "2026-11-04")).toMatchObject({ count: 0, last: null, best: 5 });
    expect(recordActivity(s, "2026-11-04").streak).toMatchObject({ count: 1, best: 5 });
  });
  it("settling is idempotent and keeps today alive", () => {
    const s = { ...emptyStreak, count: 3, best: 3, last: "2026-11-01", freezes: 2 };
    const a = settleStreak(s, "2026-11-03");
    expect(a).toMatchObject({ count: 3, freezes: 1, last: "2026-11-02" });
    expect(settleStreak(a, "2026-11-03")).toEqual(a);
  });
  it("grants one freeze per week, max 3", () => {
    let s = grantWeeklyFreeze(emptyStreak, "2026-11-23");
    expect(s.freezes).toBe(1);
    expect(grantWeeklyFreeze(s, "2026-11-29").freezes).toBe(1);
    s = grantWeeklyFreeze({ ...s, freezes: 3 }, "2026-11-30");
    expect(s.freezes).toBe(3);
  });
});
