import { describe, expect, it } from "vitest";
import { reminderIcs } from "../src/lib/ics";

describe("ics reminder", () => {
  it("creates a daily Berlin-time series with alarm", () => {
    const ics = reminderIcs("07:55", new Date(2026, 10, 25));
    expect(ics).toContain("DTSTART;TZID=Europe/Berlin:20261125T075500");
    expect(ics).toContain("DTEND;TZID=Europe/Berlin:20261125T080500");
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
  });
  it("wraps the end time past midnight", () => {
    expect(reminderIcs("23:55", new Date(2026, 10, 25))).toContain("DTEND;TZID=Europe/Berlin:20261126T000500");
  });
});
