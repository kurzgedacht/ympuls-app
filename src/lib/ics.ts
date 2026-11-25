/** Daily learning reminder as an iCalendar series (opens in iOS Calendar). */
export function reminderIcs(time: string, now = new Date()): string {
  const [h, m] = time.split(":").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
  const start = fmt(s);
  const end = fmt(new Date(s.getTime() + 10 * 60_000));
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//YMPULS.//Lernzeit//DE", "CALSCALE:GREGORIAN",
    "BEGIN:VTIMEZONE", "TZID:Europe/Berlin",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0200", "TZNAME:CEST", "DTSTART:19700329T020000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0200", "TZOFFSETTO:+0100", "TZNAME:CET", "DTSTART:19701025T030000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT", `UID:ympuls-lernzeit-${stamp}@ympuls.app`, `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Europe/Berlin:${start}`, `DTEND;TZID=Europe/Berlin:${end}`, "RRULE:FREQ=DAILY",
    "SUMMARY:YMPULS. – 10 Minuten Lernzeit", "DESCRIPTION:Dein täglicher Puls fürs Gehirn. Öffne YMPULS. auf dem Home-Bildschirm.",
    "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Zeit für YMPULS.", "TRIGGER:PT0M", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
}
