/**
 * Builds content/ from the typed sources in content-src/.
 * Each card's `art` is an illustration spec (see templates.ts) and becomes art/<lesson>-<n>.svg.
 * Hand-made SVGs are still possible: put `art: { file: "art/x.svg" }` and drop the file into content-src/assets/<slug>/.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync, existsSync, cpSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Card, Snack } from "../../src/content/schema";
import { renderArt, renderCover } from "./templates";
import { catBySlug } from "../../src/brand";

import type { SrcCard, SrcCourse } from "./define";

const ROOT = join(import.meta.dirname, "../..");
const out = (...p: string[]) => join(ROOT, "content", ...p);
// Write only when content changed and remove stale files afterwards: deleting whole folders
// makes iCloud-synced folders (Desktop) spawn "file 2.json" conflict copies.
const written = new Set<string>();
const write = (p: string, data: string | object) => {
  mkdirSync(join(p, ".."), { recursive: true });
  const text = typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n";
  written.add(p);
  if (!existsSync(p) || readFileSync(p, "utf8") !== text) writeFileSync(p, text);
};
const walk = (d: string): string[] => (existsSync(d) ? readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)])) : []);

function emitCard(card: SrcCard, dir: string, name: string, color: string, assets: string): Card {
  if (!("art" in card) || !card.art) return card as Card;
  const a = card.art;
  if ("file" in a) {
    cpSync(join(assets, a.file.replace(/^art\//, "")), join(dir, a.file));
    written.add(join(dir, a.file));
    return card as unknown as Card;
  }
  const file = `art/${name}.svg`;
  write(join(dir, file), renderArt(a, color));
  return { ...card, art: file } as Card;
}

async function main() {
  const only = process.argv[2];
  const srcDir = join(ROOT, "content-src/courses");
  const allSnacks: Snack[] = [];
  const snackDir = out("snacks");
  for (const f of readdirSync(srcDir).filter((f) => f.endsWith(".ts"))) {
    const course: SrcCourse = (await import(pathToFileURL(join(srcDir, f)).href)).default;
    const color = catBySlug[course.category].color;
    if (!only || only === course.slug) {
      const dir = out("courses", course.slug);
      const assets = join(ROOT, "content-src/assets", course.slug);
      const { cover, snacks: _s, units, ...meta } = course;
      write(join(dir, "cover.svg"), renderCover(cover, color));
      write(join(dir, "course.json"), { ...meta, units: units.map((u) => ({ id: u.id, title: u.title, lessons: u.lessons.map((l) => l.slug) })) });
      for (const u of units) for (const l of u.lessons) {
        const cards = l.cards.map((c, i) => emitCard(c, dir, `${l.slug}-${i + 1}`, color, assets));
        write(join(dir, "lessons", `${l.slug}.json`), { slug: l.slug, title: l.title, cards });
      }
    }
    for (const s of course.snacks ?? []) allSnacks.push({ ...s, category: s.category ?? course.category, courseRef: course.slug, card: s.card as Card });
  }
  const extra = join(ROOT, "content-src/snacks.ts");
  if (existsSync(extra)) allSnacks.push(...((await import(pathToFileURL(extra).href)).default as Snack[]));
  for (const s of allSnacks) {
    const card = emitCard(s.card as SrcCard, snackDir, s.id, catBySlug[s.category].color, join(ROOT, "content-src/assets/snacks"));
    write(join(snackDir, `${s.id}.json`), { ...s, card });
  }
  // Remove files this run no longer produces (only within the folders it owns).
  const owned = only ? [out("courses", only), snackDir] : [out("courses"), snackDir];
  let removed = 0;
  for (const f of owned.flatMap(walk)) if (!written.has(f) && /\.(json|svg)$/.test(f) && !f.includes("/daily/")) { rmSync(f); removed++; }
  if (removed) console.log(`removed ${removed} stale files`);
  console.log(`built ${readdirSync(srcDir).length} course sources, ${allSnacks.length} snacks`);
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
