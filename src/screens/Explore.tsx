import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { courses, isNew } from "../content";
import { categories, catBySlug, type CategorySlug } from "../brand";
import { Chip, SectionTitle } from "../components/ui";
import { CourseTile } from "../components/CourseTile";
import { IconSearch } from "../components/Icons";
import type { Course } from "../content/schema";

const fuse = new Fuse(courses.map((c) => ({ ...c, cat: catBySlug[c.category].label })), { keys: ["title", "subtitle", "hook", "cat", "author"], threshold: 0.38, ignoreLocation: true });
const Grid = ({ list }: { list: Course[] }) => <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5">{list.map((c) => <CourseTile key={c.slug} course={c} />)}</div>;
const Row = ({ list }: { list: Course[] }) => <div className="flex gap-3 overflow-x-auto px-5 pb-2 scroll">{list.map((c) => <CourseTile key={c.slug} course={c} wide />)}</div>;

export default function Explore() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategorySlug | null>(null);
  const results = useMemo(() => {
    const base = q.trim() ? fuse.search(q.trim()).map((r) => courseOf(r.item.slug)) : courses;
    return cat ? base.filter((c) => c.category === cat) : base;
  }, [q, cat]);
  const filtering = !!q.trim() || !!cat;
  const sections: [string, Course[]][] = [
    ["Neu", courses.filter((c) => isNew(c))],
    ["In 2 Minuten", courses.filter((c) => c.format === "quick")],
    ["Bücher in 10 Minuten", courses.filter((c) => c.format === "book")],
    ["Für dein Business", courses.filter((c) => c.category === "business")],
  ];
  return (
    <div className="h-full scroll pb-28 pt-safe">
      <h1 className="title text-[32px] px-5 pt-3">Alle Kurse ({courses.length})</h1>
      <label className="mx-5 mt-4 h-12 rounded-full bg-surface-card shadow-soft flex items-center gap-2 px-4">
        <IconSearch size={20} className="text-ink-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Thema, Buch, Begriff …" className="flex-1 bg-transparent outline-none text-[16px]" type="search" enterKeyHint="search" />
      </label>
      <div className="flex gap-2 overflow-x-auto px-5 py-4 scroll">
        <Chip active={!cat} onClick={() => setCat(null)}>Alle</Chip>
        {categories.map((c) => <Chip key={c.slug} color={c.color} active={cat === c.slug} onClick={() => setCat(cat === c.slug ? null : c.slug)}>{c.label}</Chip>)}
      </div>
      {filtering ? (
        results.length ? <Grid list={results} /> : <p className="px-5 text-ink-muted mt-6">Nichts gefunden. Tipp für später: <b>/neuer-kurs {q || "Thema"}</b> in Claude Code.</p>
      ) : (
        <>
          {sections.filter(([, l]) => l.length).map(([t, l]) => <div key={t}><SectionTitle>{t}</SectionTitle><Row list={l} /></div>)}
          <SectionTitle>Alle</SectionTitle>
          <Grid list={courses} />
        </>
      )}
    </div>
  );
}
const courseOf = (slug: string) => courses.find((c) => c.slug === slug)!;
