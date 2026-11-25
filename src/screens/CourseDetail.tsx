import { motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { courseBySlug, coverSvg, lessonOf } from "../content";
import { catBySlug } from "../brand";
import { useStore } from "../store/useStore";
import { Art } from "../components/Art";
import { Button, PulseDot, feedback } from "../components/ui";
import { IconBack, IconBookmark, IconCheck } from "../components/Icons";
import { courseProgress, formatLabel } from "../components/CourseTile";

export default function CourseDetail() {
  const { slug } = useParams();
  const nav = useNavigate();
  const loc = useLocation();
  const course = slug ? courseBySlug[slug] : undefined;
  const { progress, perfect, bookmarks, toggleBookmark } = useStore();
  const [sources, setSources] = useState(false);
  if (!course) return <div className="p-8 pt-safe">Kurs nicht gefunden.</div>;
  const p = courseProgress(course, progress);
  const cat = catBySlug[course.category];
  const marked = bookmarks.includes(course.slug);
  const back = () => (loc.key !== "default" && !(loc.state as { justFinished?: string } | null)?.justFinished ? nav(-1) : nav("/"));
  return (
    <div className="h-full scroll bg-ground pb-10">
      <div className="relative" style={{ background: cat.color }}>
        <div className="pt-safe px-4 flex justify-between relative z-10">
          <button aria-label="Zurück" onClick={() => { feedback(); back(); }} className="w-10 h-10 rounded-full bg-white/90 text-[#002144] flex items-center justify-center mt-2"><IconBack /></button>
          <motion.button aria-label="Merken" whileTap={{ scale: 0.9 }} onClick={() => { feedback(); toggleBookmark(course.slug); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center mt-2 ${marked ? "bg-puls text-white" : "bg-white/90 text-[#002144]"}`}><IconBookmark size={20} /></motion.button>
        </div>
        <div className="w-[62%] mx-auto -mt-4 pb-4"><Art svg={coverSvg(course.slug)} keep className="w-full aspect-square" /></div>
      </div>
      <div className="px-5 -mt-5 relative">
        <div className="rounded-card bg-surface-card shadow-lift p-5">
          <div className="kicker text-ink-muted flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />{cat.label} · {formatLabel(course)}</div>
          <h1 className="title text-[30px] mt-2">{course.title}</h1>
          <p className="text-ink-muted mt-1">{course.subtitle}{course.author ? ` · ${course.author}` : ""}</p>
          <p className="mt-4 text-[18px] leading-snug font-bold"><span className="text-puls-text">●</span> {course.hook}</p>
          <div className="flex gap-4 mt-4 text-[14px] font-bold text-ink-muted">
            <span>{p.total} Lektionen</span><span>~{course.estMinutes} Min</span><span>Level {course.level}</span>
          </div>
          <div className="flex gap-2 mt-5">
            <Button variant="puls" className="flex-1" onClick={() => p.next ? nav(`/lektion/${course.slug}/${p.next}`) : nav(`/lektion/${course.slug}/${course.units[0].lessons[0]}`)}>
              {p.done === 0 ? "Starten" : p.next ? "Weiterlernen" : "Nochmal ansehen"}
            </Button>
            <Button variant="soft" className="px-5 whitespace-nowrap" onClick={() => toggleBookmark(course.slug)}>{marked ? "✓ Gemerkt" : "Merken"}</Button>
          </div>
        </div>
      </div>
      {course.units.map((u, ui) => (
        <div key={u.id} className="px-5 mt-6">
          <div className="kicker text-ink-muted">Unit {ui + 1}</div>
          <h2 className="title text-[20px] mt-1">{u.title}</h2>
          <div className="mt-3 flex flex-col gap-2">
            {u.lessons.map((l) => {
              const done = (progress[course.slug] ?? []).includes(l);
              const current = l === p.next;
              const locked = !done && !current;
              return (
                <motion.button key={l} whileTap={{ scale: 0.98 }} disabled={locked} onClick={() => { feedback(); nav(`/lektion/${course.slug}/${l}`); }}
                  className={`flex items-center gap-3 rounded-[20px] bg-surface-card p-3 text-left ${locked ? "opacity-55" : "shadow-soft"}`}>
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-brand text-white" : current ? "bg-puls" : "bg-surface-alt"}`}>
                    {done ? <IconCheck size={20} /> : current ? <span className="w-3 h-3 rounded-full bg-white" /> : <span className="text-[14px]">🔒</span>}
                  </span>
                  <span className="flex-1 font-bold text-[16px] leading-tight">{lessonOf(course.slug, l)?.title}</span>
                  {perfect.includes(`${course.slug}/${l}`) && <span>👑</span>}
                  <span className="text-[13px] text-ink-muted">2 Min</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
      <div className="px-5 mt-8">
        <button className="kicker text-ink-muted flex items-center gap-2" onClick={() => setSources(!sources)}><PulseDot size={6} /> Quellen ({course.sources.length}) {sources ? "▴" : "▾"}</button>
        {sources && <ul className="mt-2 text-[14px] text-ink-muted list-disc pl-5 space-y-1">{course.sources.map((s) => <li key={s}>{s}</li>)}</ul>}
      </div>
    </div>
  );
}
