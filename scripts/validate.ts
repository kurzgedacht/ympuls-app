/** npm run validate – checks every file in content/ against the schema and the content rules (CLAUDE.md §5). */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { optimize } from "svgo";
import { CourseSchema, LessonSchema, SnackSchema, DailySchema, lessonRuleErrors, type Card } from "../src/content/schema";

const ROOT = join(import.meta.dirname, "..");
const C = join(ROOT, "content");
const errors: string[] = [];
const err = (file: string, msg: string) => errors.push(`${relative(ROOT, file)}: ${msg}`);
const ls = (d: string) => (existsSync(d) ? readdirSync(d) : []);
const json = (f: string) => { try { return JSON.parse(readFileSync(f, "utf8")); } catch (e) { err(f, `invalid JSON – ${(e as Error).message}`); return null; } };

function checkSvg(f: string) {
  if (!existsSync(f)) return err(f, "referenced SVG is missing");
  const src = readFileSync(f, "utf8");
  if (!/^<svg[\s>]/.test(src.trim())) return err(f, "not an <svg> document");
  if (!src.includes('viewBox="0 0 400 400"')) err(f, 'needs viewBox="0 0 400 400"');
  if (/<image|href="http/.test(src)) err(f, "no raster images or external references allowed");
  try { optimize(src); } catch (e) { err(f, `invalid SVG – ${(e as Error).message.split("\n")[0]}`); }
}
function checkCards(f: string, dir: string, cards: Card[], daily = false) {
  for (const msg of lessonRuleErrors(cards, { daily })) err(f, msg);
  for (const c of cards) if ("art" in c && c.art) checkSvg(join(dir, c.art));
}
function zodErr(f: string, e: { issues: { path: PropertyKey[]; message: string }[] }) {
  for (const i of e.issues) err(f, `${i.path.join(".")}: ${i.message}`);
}

const courseSlugs = new Set<string>();
for (const slug of ls(join(C, "courses"))) {
  const dir = join(C, "courses", slug);
  if (!statSync(dir).isDirectory()) continue;
  const cf = join(dir, "course.json");
  const parsed = CourseSchema.safeParse(json(cf));
  if (!parsed.success) { zodErr(cf, parsed.error); continue; }
  const course = parsed.data;
  courseSlugs.add(course.slug);
  if (course.slug !== slug) err(cf, `slug "${course.slug}" must match folder "${slug}"`);
  checkSvg(join(dir, "cover.svg"));
  const listed = course.units.flatMap((u) => u.lessons);
  if (new Set(listed).size !== listed.length) err(cf, "lesson listed twice");
  for (const l of listed) {
    const lf = join(dir, "lessons", `${l}.json`);
    if (!existsSync(lf)) { err(cf, `lesson "${l}" has no file`); continue; }
    const lp = LessonSchema.safeParse(json(lf));
    if (!lp.success) { zodErr(lf, lp.error); continue; }
    if (lp.data.slug !== l) err(lf, "slug must match file name");
    checkCards(lf, dir, lp.data.cards);
  }
  for (const f of ls(join(dir, "lessons"))) if (!listed.includes(f.replace(/\.json$/, ""))) err(join(dir, "lessons", f), "lesson file not listed in course.json");
}

const ids = new Set<string>();
for (const f of ls(join(C, "snacks")).filter((f) => f.endsWith(".json"))) {
  const p = join(C, "snacks", f);
  const sp = SnackSchema.safeParse(json(p));
  if (!sp.success) { zodErr(p, sp.error); continue; }
  const s = sp.data;
  if (ids.has(s.id)) err(p, `duplicate snack id ${s.id}`);
  ids.add(s.id);
  if (s.courseRef && !courseSlugs.has(s.courseRef)) err(p, `courseRef "${s.courseRef}" does not exist`);
  if ("art" in s.card && s.card.art) checkSvg(join(C, "snacks", s.card.art));
  if (s.card.type === "recap" || s.card.type === "title") err(p, "snack card cannot be recap/title");
}

for (const f of ls(join(C, "daily")).filter((f) => f.endsWith(".json"))) {
  const p = join(C, "daily", f);
  if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(f)) err(p, "file name must be yyyy-mm-dd.json");
  const dp = DailySchema.safeParse(json(p));
  if (!dp.success) { zodErr(p, dp.error); continue; }
  checkCards(p, join(C, "daily"), dp.data.cards, true);
}

if (errors.length) {
  console.error(`✕ validate: ${errors.length} problem(s)\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✓ validate: ${courseSlugs.size} courses, ${ids.size} snacks OK`);
