import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import type { Course } from "../content/schema";
import { coverSvg, isNew, lessonOrder } from "../content";
import { catBySlug } from "../brand";
import { useStore } from "../store/useStore";
import { Art } from "./Art";
import { feedback } from "./ui";

export const formatLabel = (c: Course) => (c.format === "book" ? "Buch-Guide" : c.format === "quick" ? "Quick Read" : "Kurs");
export const courseProgress = (c: Course, progress: Record<string, string[]>) => {
  const all = lessonOrder(c);
  const done = progress[c.slug] ?? [];
  return { done: all.filter((l) => done.includes(l)).length, total: all.length, next: all.find((l) => !done.includes(l)) ?? null };
};

export function CourseTile({ course, wide }: { course: Course; wide?: boolean }) {
  const nav = useNavigate();
  const progress = useStore((s) => s.progress);
  const p = courseProgress(course, progress);
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={() => { feedback(); nav(`/kurs/${course.slug}`); }} className={`text-left ${wide ? "w-[164px] shrink-0" : "w-full"}`}>
      <div className="relative rounded-[20px] overflow-hidden shadow-soft aspect-square">
        <Art svg={coverSvg(course.slug)} keep className="w-full h-full" />
        {isNew(course) && <span className="absolute top-2 left-2 kicker text-[10px] bg-puls text-white rounded-full px-2 py-1">Neu</span>}
        {p.done > 0 && (
          <div className="absolute inset-x-2 bottom-2 h-1.5 rounded-full bg-white/50 overflow-hidden"><div className="h-full bg-puls" style={{ width: `${(p.done / p.total) * 100}%` }} /></div>
        )}
      </div>
      <div className="kicker text-[10px] mt-2 text-ink-muted flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: catBySlug[course.category].color }} />{formatLabel(course)} · {course.estMinutes} Min</div>
      <div className="font-display font-black text-[16px] leading-tight mt-0.5 line-clamp-2">{course.title}</div>
    </motion.button>
  );
}
