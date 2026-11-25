import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { snacks, courseBySlug, courses, coverSvg, resolveCard, isInteractive, artSvg, lessonOrder } from "../content";
import type { Snack, Course } from "../content/schema";
import { useStore, today, dayOf } from "../store/useStore";
import { fx } from "../store/fx";
import { orderFeed } from "../lib/feed";
import { dueIds } from "../lib/srs";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { renderCardPng, shareImage } from "../lib/share";
import { catBySlug, spring } from "../brand";
import { Art } from "../components/Art";
import { InteractiveCard } from "../components/cards/Interactive";
import { rich } from "../components/cards/rich";
import { Button, PulseDot, feedback } from "../components/ui";
import { IconShare, IconBookmark } from "../components/Icons";
import { cardText } from "./Library";
import { courseProgress } from "../components/CourseTile";

type Item =
  | { kind: "snack"; key: string; snack: Snack }
  | { kind: "review"; key: string; id: string }
  | { kind: "teaser"; key: string; course: Course }
  | { kind: "end"; key: string; batch: number };

const BATCH = 20;
const KIND_LABEL: Record<Snack["kind"], string> = { fact: "Wusstest du?", myth: "Mythos oder Fakt", quiz: "Mini-Quiz", chart: "In Zahlen", "quote-idea": "Buch-Idee", howto: "Kurzanleitung" };

function buildBatch(order: Snack[], start: number, batch: number, reviews: string[], progress: Record<string, string[]>, favorites: string[]): Item[] {
  const items: Item[] = [];
  const slice = Array.from({ length: Math.min(BATCH, order.length) }, (_, i) => order[(start + i) % order.length]);
  let content = 0;
  slice.forEach((s, i) => {
    items.push({ kind: "snack", key: `${batch}-s-${s.id}`, snack: s });
    content++;
    if (batch === 0 && reviews[Math.floor(i / 6)] && i % 6 === 2) items.push({ kind: "review", key: `r-${reviews[Math.floor(i / 6)]}`, id: reviews[Math.floor(i / 6)] });
    if (content % 5 === 0) {
      const ref = s.courseRef && courseBySlug[s.courseRef];
      const alt = courses.filter((c) => favorites.includes(c.category) || !favorites.length).find((c) => courseProgress(c, progress).next && !items.some((x) => x.kind === "teaser" && x.course.slug === c.slug));
      const course = ref || alt;
      if (course) items.push({ kind: "teaser", key: `${batch}-t-${i}-${course.slug}`, course });
    }
  });
  items.push({ kind: "end", key: `end-${batch}`, batch });
  return items;
}

export default function Feed() {
  const s = useStore();
  const seed = useRef(Date.now() % 100000).current;
  const order = useMemo(() => {
    const byId = Object.fromEntries(snacks.map((x) => [x.id, x]));
    return orderFeed(snacks.map((x) => ({ id: x.id, category: x.category, interactive: isInteractive(x.card) })), { favorites: s.settings.favorites, seen: s.feedSeen, today: today(), seed }).map((x) => byId[x.id]);
  }, [seed]); // eslint-disable-line react-hooks/exhaustive-deps
  const reviews = useMemo(() => dueIds(s.srs, today(), 3).filter((id) => { const r = resolveCard(id); return r && isInteractive(r.card); }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [batches, setBatches] = useState(1);
  const items = useMemo(() => Array.from({ length: batches }, (_, b) => buildBatch(order, b * BATCH, b, reviews, s.progress, s.settings.favorites)).flat(), [batches, order]); // eslint-disable-line react-hooks/exhaustive-deps
  const session = useRef({ start: Date.now(), seen: new Set<string>(), correct: 0, saved: 0, pendingSec: 0 });
  const [, force] = useState(0);
  const [fly, setFly] = useState<{ id: number; x: number; y: number } | null>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // Time counts towards the daily goal once 10 snacks are seen today (CLAUDE.md §7.2).
  useEffect(() => {
    const t = setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const st = useStore.getState();
      if (dayOf(st).snacks >= 10) { st.addTime(10 + session.current.pendingSec); session.current.pendingSec = 0; } else session.current.pendingSec += 10;
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  // Mark snacks as seen after they are on screen for ~1 s.
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const timers = new Map<Element, number>();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      const id = (e.target as HTMLElement).dataset.snack;
      if (!id) return;
      if (e.isIntersecting) timers.set(e.target, window.setTimeout(() => {
        if (session.current.seen.has(id)) return;
        session.current.seen.add(id);
        useStore.getState().seeSnack(id);
        force((n) => n + 1);
      }, 900));
      else clearTimeout(timers.get(e.target));
    }), { root, threshold: 0.6 });
    root.querySelectorAll("[data-snack]").forEach((el) => io.observe(el));
    return () => { io.disconnect(); timers.forEach((t) => clearTimeout(t)); };
  }, [items]);

  const save = (id: string, x: number, y: number) => {
    const st = useStore.getState();
    if (!st.saved.some((v) => v.id === id)) { st.toggleSave(id); session.current.saved++; }
    haptic("medium"); play("save"); fx.saved();
    setFly({ id: Date.now(), x, y });
    force((n) => n + 1);
  };

  return (
    <div className="h-full bg-[#08142A] relative">
      <div ref={scroller} className="h-full overflow-y-scroll snap-y snap-mandatory overscroll-contain scroll" style={{ scrollbarWidth: "none" }}>
        {items.map((it) => (
          <section key={it.key} className="h-full snap-start snap-always pt-safe px-3 pb-[86px] flex flex-col" data-snack={it.kind === "snack" ? it.snack.id : undefined}>
            {it.kind === "snack" && <SnackCard snack={it.snack} saved={s.saved.some((v) => v.id === `s/${it.snack.id}`)} onSave={save} onCorrect={() => session.current.correct++} />}
            {it.kind === "review" && <ReviewCard id={it.id} />}
            {it.kind === "teaser" && <Teaser course={it.course} />}
            {it.kind === "end" && it.batch === batches - 1 && (
              <SessionEnd seen={session.current.seen.size} minutes={Math.max(1, Math.round((Date.now() - session.current.start) / 60000))} correct={session.current.correct} saved={session.current.saved}
                onMore={() => { setBatches((b) => b + 1); setTimeout(() => scroller.current?.scrollBy({ top: scroller.current.clientHeight, behavior: "smooth" }), 80); }} />
            )}
            {it.kind === "end" && it.batch !== batches - 1 && <div className="flex-1 flex items-center justify-center text-white/60 kicker">Weiter geht's ↓</div>}
          </section>
        ))}
      </div>
      <div className="absolute top-0 inset-x-0 pt-safe pointer-events-none flex justify-center">
        <div className="mt-1 kicker text-white/70 flex items-center gap-2"><PulseDot size={7} /> {dayOf(s).snacks} {dayOf(s).snacks === 1 ? "Snack" : "Snacks"} heute</div>
      </div>
      <AnimatePresence>{fly && <SaveFly key={fly.id} x={fly.x} y={fly.y} onDone={() => setFly(null)} />}</AnimatePresence>
    </div>
  );
}

function SaveFly({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  const target = document.getElementById("tab-library")?.getBoundingClientRect();
  const root = document.getElementById("root")!.getBoundingClientRect();
  const tx = (target ? target.left + target.width / 2 : root.width * 0.7) - root.left;
  const ty = (target ? target.top + 14 : root.height - 40) - root.top;
  return (
    <motion.div className="absolute z-50 pointer-events-none rounded-full bg-puls" style={{ width: 28, height: 28, left: -14, top: -14 }}
      initial={{ x: x - root.left, y: y - root.top, scale: 0 }} animate={{ x: [x - root.left, x - root.left, tx], y: [y - root.top, y - root.top - 40, ty], scale: [0, 2.6, 0.5] }}
      transition={{ duration: 0.9, times: [0, 0.3, 1], ease: "easeInOut" }} onAnimationComplete={onDone} />
  );
}

function SnackCard({ snack, saved, onSave, onCorrect }: { snack: Snack; saved: boolean; onSave: (id: string, x: number, y: number) => void; onCorrect: () => void }) {
  const id = `s/${snack.id}`;
  const cat = catBySlug[snack.category];
  const svg = "art" in snack.card ? artSvg("/content/snacks", snack.card.art) : "";
  const lastTap = useRef(0);
  const interactive = snack.card.type !== "story" && snack.card.type !== "insight";
  const onTap = (e: React.MouseEvent) => {
    if (interactive) return;
    const now = Date.now();
    if (now - lastTap.current < 320) { onSave(id, e.clientX, e.clientY); lastTap.current = 0; } else lastTap.current = now;
  };
  const share = async () => shareImage(await renderCardPng({ kicker: KIND_LABEL[snack.kind], text: cardText(snack.card), svg, source: snack.courseRef ? courseBySlug[snack.courseRef]?.title : "YMPULS. Feed" }));
  return (
    <div className="relative flex-1 min-h-0 mt-6 rounded-[28px] bg-ground overflow-hidden flex flex-col no-select" onClick={onTap}>
      <div className="flex items-center gap-2 px-5 pt-4 pb-2 min-h-[56px]">
        <span className="kicker text-[11px] rounded-full px-2.5 py-1 text-white whitespace-nowrap" style={{ background: cat.color === "#F2B84B" ? "#B5651D" : cat.color }}>{cat.label}</span>
        <span className="kicker text-[11px] text-ink-muted flex-1 truncate">{KIND_LABEL[snack.kind]}</span>
        {!interactive && <>
          <motion.button aria-label="Speichern" whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); onSave(id, e.clientX, e.clientY); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center ${saved ? "bg-puls text-white" : "bg-surface-alt text-ink"}`}>
            <motion.span key={String(saved)} animate={saved ? { scale: [1, 1.5, 1] } : {}}><IconBookmark size={19} /></motion.span>
          </motion.button>
          <motion.button aria-label="Teilen" whileTap={{ scale: 0.85 }} onClick={(e) => { e.stopPropagation(); feedback(); share(); }} className="w-10 h-10 rounded-full bg-surface-alt text-ink flex items-center justify-center"><IconShare size={19} /></motion.button>
        </>}
      </div>
      {interactive ? (
        <div className="flex-1 min-h-0">
          <InteractiveCard card={snack.card as never} svg={svg} compact onAnswer={(c) => { if (c) onCorrect(); return useStore.getState().answer(id, c); }} />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col px-5 pb-5">
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <div className="h-full max-h-[320px] aspect-square rounded-card bg-brand-soft p-3"><Art svg={svg} className="w-full h-full" /></div>
          </div>
          <p className="story-text font-bold text-[20px] leading-[1.38] mt-4">{rich("text" in snack.card ? snack.card.text : "")}</p>
          <p className="text-[13px] text-ink-muted mt-3">Doppeltippen zum Speichern</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ id }: { id: string }) {
  const ref = resolveCard(id);
  if (!ref || !isInteractive(ref.card)) return null;
  return (
    <div className="relative flex-1 min-h-0 mt-6 rounded-[28px] bg-ground overflow-hidden flex flex-col no-select">
      <div className="px-5 pt-4 pb-2 kicker text-[11px] text-puls-text flex items-center gap-2">🧠 Wiederholung · {ref.source}</div>
      <div className="flex-1 min-h-0"><InteractiveCard card={ref.card as never} compact onAnswer={(c) => useStore.getState().answer(id, c, { review: true })} /></div>
    </div>
  );
}

function Teaser({ course }: { course: Course }) {
  const nav = useNavigate();
  const progress = useStore((s) => s.progress);
  const next = courseProgress(course, progress).next ?? lessonOrder(course)[0];
  return (
    <div className="flex-1 mt-6 rounded-[28px] overflow-hidden flex flex-col" style={{ background: catBySlug[course.category].color }}>
      <div className="flex-1 flex items-center justify-center p-6"><Art svg={coverSvg(course.slug)} keep className="w-[75%] aspect-square rounded-[24px] overflow-hidden" /></div>
      <div className="bg-[#08142A]/90 text-white p-5">
        <div className="kicker text-[#FF6B7F]">Mehr dazu</div>
        <div className="title text-[26px] mt-1">{course.title}</div>
        <p className="text-[16px] opacity-85 mt-2 leading-snug">{course.hook}</p>
        <Button variant="puls" className="w-full mt-4" onClick={() => nav(`/lektion/${course.slug}/${next}`)}>Mehr dazu in 2 Min →</Button>
      </div>
    </div>
  );
}

function SessionEnd({ seen, minutes, correct, saved, onMore }: { seen: number; minutes: number; correct: number; saved: number; onMore: () => void }) {
  const nav = useNavigate();
  return (
    <div className="flex-1 mt-6 rounded-[28px] bg-brand text-on-brand flex flex-col items-center justify-center text-center p-6">
      <motion.div initial={{ scale: 0.5 }} whileInView={{ scale: 1 }} transition={{ ...spring, stiffness: 260, damping: 12 }} className="relative w-24 h-24 flex items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-puls ripple" /><span className="absolute inset-0 rounded-full bg-puls beat" /><span className="relative text-[40px]">💪</span>
      </motion.div>
      <h2 className="title text-[32px] mt-6">Starke Session</h2>
      <p className="text-[19px] mt-2 opacity-90">{seen} Ideen in {minutes} {minutes === 1 ? "Minute" : "Minuten"}</p>
      <div className="grid grid-cols-3 gap-2 w-full mt-6">
        {[["Gesehen", seen], ["Richtig", correct], ["Gespeichert", saved]].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-white/10 py-3"><div className="title text-[26px]">{v}</div><div className="text-[12px] opacity-75 font-bold">{l}</div></div>
        ))}
      </div>
      <p className="text-[15px] opacity-75 mt-6">Hier wäre Instagram jetzt endlos. Du entscheidest.</p>
      <Button variant="puls" className="w-full mt-4" onClick={() => nav("/")}>Fertig für jetzt</Button>
      <Button variant="ghost" className="w-full mt-1 !text-on-brand" onClick={onMore}>Noch 20 Snacks</Button>
    </div>
  );
}
