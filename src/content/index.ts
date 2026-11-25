import type { Card, Course, Daily, Lesson, Snack } from "./schema";
import { INTERACTIVE } from "./schema";
import { dayKey, daysBetween } from "../lib/dates";

const courseFiles = import.meta.glob<Course>("/content/courses/*/course.json", { eager: true, import: "default" });
const lessonFiles = import.meta.glob<Lesson>("/content/courses/*/lessons/*.json", { eager: true, import: "default" });
const snackFiles = import.meta.glob<Snack>("/content/snacks/*.json", { eager: true, import: "default" });
const dailyFiles = import.meta.glob<Daily>("/content/daily/*.json", { eager: true, import: "default" });
const svgFiles = import.meta.glob<string>("/content/**/*.svg", { eager: true, query: "?raw", import: "default" });

export const courses: Course[] = Object.values(courseFiles).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title));
export const courseBySlug: Record<string, Course> = Object.fromEntries(courses.map((c) => [c.slug, c]));
export const snacks: Snack[] = Object.values(snackFiles);
export const snackById: Record<string, Snack> = Object.fromEntries(snacks.map((s) => [s.id, s]));

export const lessonOf = (course: string, lesson: string): Lesson | undefined => lessonFiles[`/content/courses/${course}/lessons/${lesson}.json`];
export const lessonOrder = (c: Course) => c.units.flatMap((u) => u.lessons);
export const coverSvg = (course: string) => svgFiles[`/content/courses/${course}/cover.svg`] ?? "";
/** base = folder the card's art path is relative to, e.g. "/content/courses/x" */
export const artSvg = (base: string, art?: string) => (art ? svgFiles[`${base}/${art}`] ?? "" : "");
export const courseBase = (slug: string) => `/content/courses/${slug}`;
export const isNew = (c: Course, today = dayKey()) => daysBetween(c.createdAt, today) <= 14;

/** Today's daily read: a dated file if present, otherwise a rotating quick read. */
export function dailyFor(today = dayKey()): { kind: "daily"; date: string; lesson: Daily } | { kind: "course"; course: Course; lesson: string } | null {
  const d = dailyFiles[`/content/daily/${today}.json`];
  if (d) return { kind: "daily", date: today, lesson: d };
  const quick = courses.filter((c) => c.format === "quick");
  const pool = quick.length ? quick : courses;
  if (!pool.length) return null;
  const c = [...pool].sort((a, b) => a.slug.localeCompare(b.slug))[Math.abs(daysBetween("2026-01-01", today)) % pool.length];
  return { kind: "course", course: c, lesson: lessonOrder(c)[0] };
}
export const dailyLesson = (date: string) => dailyFiles[`/content/daily/${date}.json`];

export interface CardRef { id: string; card: Card; base: string; category: Course["category"]; source: string; link?: string }
/**
 * Card ids: "c/<course>/<lesson>/<index>", "d/<date>/<index>", "s/<snack>".
 * Used by saved cards and spaced repetition.
 */
export function resolveCard(id: string): CardRef | null {
  const [kind, a, b, c] = id.split("/");
  if (kind === "c") {
    const course = courseBySlug[a];
    const card = lessonOf(a, b)?.cards[Number(c)];
    return course && card ? { id, card, base: courseBase(a), category: course.category, source: course.title, link: `/kurs/${a}` } : null;
  }
  if (kind === "d") {
    const d = dailyLesson(a);
    const card = d?.cards[Number(b)];
    return d && card ? { id, card, base: "/content/daily", category: d.category, source: d.title } : null;
  }
  if (kind === "s") {
    const s = snackById[a];
    return s ? { id, card: s.card, base: "/content/snacks", category: s.category, source: s.courseRef ? courseBySlug[s.courseRef]?.title ?? "Snack" : "Snack", link: s.courseRef ? `/kurs/${s.courseRef}` : undefined } : null;
  }
  return null;
}
export const isInteractive = (c: Card) => INTERACTIVE.includes(c.type);
