import { z } from "zod";

export const CATEGORY_SLUGS = ["finanzen", "self", "sport", "ernaehrung", "technik", "business", "buecher"] as const;
const art = z.string().regex(/^art\/[a-z0-9-]+\.svg$/, "art must look like art/<name>.svg");
const s = z.string().min(1);

export const CardSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("title"), heading: s, kicker: s.optional(), art }),
  z.object({ type: z.literal("story"), text: s, art, steps: z.number().int().min(0).max(6).optional() }),
  z.object({ type: z.literal("insight"), text: s, art }),
  z.object({
    type: z.literal("quiz"), kind: z.enum(["mc", "tf", "compare"]), question: s, art: art.optional(),
    options: z.array(s).min(2).max(4), correct: z.number().int().min(0), explanation: s,
  }),
  z.object({
    type: z.literal("estimate"), question: s, unit: z.string(), min: z.number(), max: z.number(), step: z.number().positive(),
    answer: z.number(), tolerance: z.number().min(0), explanation: s,
  }),
  z.object({ type: z.literal("order"), question: s, items: z.array(s).min(3).max(5), explanation: s }),
  z.object({ type: z.literal("match"), question: s, pairs: z.array(z.tuple([s, s])).min(3).max(4), explanation: s }),
  z.object({
    type: z.literal("swipe"), question: s, statements: z.array(z.object({ text: s, true: z.boolean() })).min(3).max(5), explanation: s,
  }),
  z.object({ type: z.literal("poll"), question: s, options: z.array(s).min(2).max(4), majority: z.number().int().min(0), note: s.optional() }),
  z.object({ type: z.literal("recap"), bullets: z.array(s).length(3) }),
]);
export type Card = z.infer<typeof CardSchema>;
export type CardType = Card["type"];
export const INTERACTIVE: CardType[] = ["quiz", "estimate", "order", "match", "swipe"];

export const LessonSchema = z.object({ slug: s, title: s, cards: z.array(CardSchema).min(8).max(14) });
export type Lesson = z.infer<typeof LessonSchema>;

export const CourseSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/), title: s, subtitle: s, category: z.enum(CATEGORY_SLUGS),
  format: z.enum(["course", "quick", "book"]), author: s.optional(), level: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  estMinutes: z.number().positive(), units: z.array(z.object({ id: s, title: s, lessons: z.array(s).min(1) })).min(1),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), sources: z.array(s).min(1), hook: s,
});
export type Course = z.infer<typeof CourseSchema>;

export const SnackSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/), category: z.enum(CATEGORY_SLUGS),
  kind: z.enum(["fact", "myth", "quiz", "chart", "quote-idea", "howto"]), card: CardSchema, courseRef: s.optional(),
  sources: z.array(s).optional(),
});
export type Snack = z.infer<typeof SnackSchema>;

export const DailySchema = LessonSchema.extend({ category: z.enum(CATEGORY_SLUGS) });
export type Daily = z.infer<typeof DailySchema>;

const words = (t: string) => t.replace(/\*/g, "").trim().split(/\s+/).filter(Boolean).length;
const hasArt = (c: Card) => "art" in c && !!c.art;

/** Content rules from CLAUDE.md §5 that Zod alone can't express. Returns human-readable problems. */
export function lessonRuleErrors(cards: Card[], opts: { daily?: boolean } = {}): string[] {
  const errs: string[] = [];
  cards.forEach((c, i) => {
    const at = `card ${i + 1} (${c.type})`;
    if (c.type === "story" && (words(c.text) < 15 || words(c.text) > 50)) errs.push(`${at}: story needs 15–50 words, has ${words(c.text)}`);
    if (c.type === "insight" && words(c.text) > 22) errs.push(`${at}: insight max 22 words, has ${words(c.text)}`);
    if (c.type === "quiz" && c.correct >= c.options.length) errs.push(`${at}: correct index out of range`);
    if (c.type === "quiz" && c.kind === "tf" && c.options.length !== 2) errs.push(`${at}: tf needs exactly 2 options`);
    if (c.type === "poll" && c.majority >= c.options.length) errs.push(`${at}: majority index out of range`);
    if (c.type === "estimate") {
      if (!(c.min < c.max) || c.answer < c.min || c.answer > c.max) errs.push(`${at}: answer must lie in [min,max]`);
      if (Math.abs(((c.max - c.min) / c.step) % 1) > 1e-9 && Math.abs((((c.max - c.min) / c.step) % 1) - 1) > 1e-9) errs.push(`${at}: (max-min) must be a multiple of step`);
    }
    if (c.type === "match" && new Set(c.pairs.flat()).size !== c.pairs.length * 2) errs.push(`${at}: match entries must be unique`);
    if (c.type === "order" && new Set(c.items).size !== c.items.length) errs.push(`${at}: order items must be unique`);
    const prev = cards[i - 1];
    const isText = (x: Card) => x.type === "story" || x.type === "insight";
    if (prev && isText(c) && isText(prev) && hasArt(c) && hasArt(prev) && (c as { art: string }).art === (prev as { art: string }).art)
      errs.push(`${at}: two text cards in a row share the same image`);
  });
  if (!cards.some((c) => c.type === "insight")) errs.push("lesson needs at least 1 insight card");
  const inter = cards.filter((c) => INTERACTIVE.includes(c.type));
  const min = opts.daily ? 1 : 2;
  if (inter.length < min) errs.push(`lesson needs at least ${min} interactive cards, has ${inter.length}`);
  if (!opts.daily && !inter.some((c) => !(c.type === "quiz" && c.kind === "mc"))) errs.push("lesson needs an interactive card that is not multiple choice");
  if (cards[cards.length - 1]?.type !== "recap") errs.push("last card must be recap");
  return errs;
}
