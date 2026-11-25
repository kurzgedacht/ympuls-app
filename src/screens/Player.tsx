import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { artSvg, courseBase, courseBySlug, dailyLesson, isInteractive, lessonOf } from "../content";
import type { Card, Course } from "../content/schema";
import { useStore } from "../store/useStore";
import { fx } from "../store/fx";
import { comboBpm } from "../lib/rewards";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { renderCardPng, shareImage } from "../lib/share";
import { stepCount } from "../components/Art";
import { BottomSheet, Button, ProgressBar, feedback } from "../components/ui";
import { IconMore, IconX, IconShare, IconFlag } from "../components/Icons";
import { TitleCard, StoryCard, InsightCard, RecapCard } from "../components/cards/Passive";
import { InteractiveCard } from "../components/cards/Interactive";
import { LessonDone } from "../components/LessonDone";
import { spring } from "../brand";

export interface LessonCtx { cards: Card[]; title: string; base: string; idPrefix: string; category: Course["category"]; course: Course | null; lessonSlug: string }

function useLessonCtx(): LessonCtx | null {
  const { course, lesson, date } = useParams();
  return useMemo(() => {
    if (date) {
      const d = dailyLesson(date);
      return d ? { cards: d.cards, title: d.title, base: "/content/daily", idPrefix: `d/${date}`, category: d.category, course: null, lessonSlug: d.slug } : null;
    }
    const c = course ? courseBySlug[course] : undefined;
    const l = c && lesson ? lessonOf(c.slug, lesson) : undefined;
    return c && l ? { cards: l.cards, title: l.title, base: courseBase(c.slug), idPrefix: `c/${c.slug}/${l.slug}`, category: c.category, course: c, lessonSlug: l.slug } : null;
  }, [course, lesson, date]);
}

export default function Player() {
  const ctx = useLessonCtx();
  const nav = useNavigate();
  if (!ctx) return <div className="p-8 pt-safe">Lektion nicht gefunden. <button className="underline" onClick={() => nav("/")}>Zurück</button></div>;
  return <PlayerInner key={ctx.idPrefix} ctx={ctx} />;
}

function PlayerInner({ ctx }: { ctx: LessonCtx }) {
  const nav = useNavigate();
  const loc = useLocation();
  const store = useStore();
  const { cards } = ctx;
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [revealed, setRevealed] = useState<Record<number, number>>({ 0: 0 });
  const [answered, setAnswered] = useState<Record<number, boolean>>({});
  const [newInsights, setNewInsights] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [menu, setMenu] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const start = useRef({ t: Date.now(), xp: store.xp });
  const down = useRef<{ x: number; y: number } | null>(null);
  const card = cards[idx];
  const svg = "art" in card ? artSvg(ctx.base, card.art) : "";
  const steps = card.type === "story" ? stepCount(svg) : 0;
  const cardId = `${ctx.idPrefix}/${idx}`;

  useEffect(() => {
    const t = setInterval(() => document.visibilityState === "visible" && !done && useStore.getState().addTime(10), 10_000);
    return () => clearInterval(t);
  }, [done]);

  // Insight cards save themselves the first time they are shown.
  useEffect(() => {
    if (card.type !== "insight" || useStore.getState().saved.some((s) => s.id === cardId)) return;
    useStore.getState().ensureSaved(cardId);
    setNewInsights((n) => [...n, idx]);
    play("save"); haptic("medium"); fx.saved();
  }, [card.type, cardId, idx]);

  const go = (to: number) => {
    setDir(to > idx ? 1 : -1);
    setRevealed((r) => ({ ...r, [to]: r[to] ?? 0 }));
    setIdx(to);
  };
  const next = () => {
    if (card.type === "story" && (revealed[idx] ?? 0) < steps) {
      setRevealed((r) => ({ ...r, [idx]: (r[idx] ?? 0) + 1 }));
      haptic("light");
      return;
    }
    if (isInteractive(card) && answered[idx] === undefined) return;
    if (card.type === "poll" && answered[idx] === undefined) return;
    if (idx === cards.length - 1) return finish();
    play("tap");
    go(idx + 1);
  };
  const prev = () => { if (idx > 0) { feedback(); go(idx - 1); } };
  const finish = () => {
    useStore.getState().addTime(Math.round((Date.now() - start.current.t) / 1000) % 10);
    setDone(true);
  };
  const exit = () => (loc.key !== "default" ? nav(-1) : nav("/"));

  const passive = card.type === "title" || card.type === "story" || card.type === "insight" || card.type === "recap";
  const onPointerDown = (e: React.PointerEvent) => { down.current = { x: e.clientX, y: e.clientY }; };
  const onPointerUp = (e: React.PointerEvent) => {
    const d = down.current;
    down.current = null;
    if (!d || !passive) return;
    const dx = e.clientX - d.x, dy = e.clientY - d.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) return dx < 0 ? next() : prev();
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) return;
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    if (e.clientX - r.left < r.width / 3) prev(); else next();
  };

  const interactiveCount = cards.filter((c) => isInteractive(c)).length;
  const correctCount = Object.entries(answered).filter(([i, v]) => v && isInteractive(cards[Number(i)])).length;

  if (done) {
    return (
      <LessonDone ctx={ctx} stats={{ seconds: Math.round((Date.now() - start.current.t) / 1000), correct: correctCount, total: interactiveCount, insights: newInsights.length, xpStart: start.current.xp }}
        onExit={() => nav(ctx.course ? `/kurs/${ctx.course.slug}` : "/", { replace: true, state: { justFinished: ctx.idPrefix } })}
        onHome={() => nav("/", { replace: true, state: { justFinished: ctx.idPrefix } })} />
    );
  }

  const combo = store.combo;
  const share = async () => {
    setMenu(false);
    const text = card.type === "story" || card.type === "insight" ? card.text : card.type === "title" ? card.heading : "question" in card ? card.question : card.type === "recap" ? card.bullets.join(" · ") : "";
    shareImage(await renderCardPng({ kicker: card.type === "insight" ? "Kerngedanke" : ctx.title, text, svg, source: ctx.course?.title ?? "Tageslektion" }));
  };

  return (
    <div className={`h-full flex flex-col bg-ground pt-safe ${combo >= 5 ? "hochpuls" : ""}`}>
      <div className="flex items-center gap-3 px-4 h-12 shrink-0">
        <button aria-label="Schließen" onClick={() => { feedback(); exit(); }} className="w-10 h-10 -ml-1 flex items-center justify-center"><IconX /></button>
        <ProgressBar value={(idx + ((revealed[idx] ?? 0) / Math.max(1, steps + 1))) / cards.length} className="flex-1" />
        <motion.div className="flex items-center gap-1 h-8 px-2.5 rounded-full bg-surface-card shadow-soft font-display font-black text-[14px] tabular-nums" key={combo} animate={{ scale: combo ? [1, 1.15, 1] : 1 }}>
          <span className={combo >= 5 ? "beat-fast inline-block" : combo > 0 ? "beat inline-block" : "inline-block"} style={{ color: "#D11F3A" }}>♥</span>
          {comboBpm(combo)}
        </motion.div>
        <button aria-label="Mehr" onClick={() => { feedback(); setMenu(true); }} className="w-10 h-10 -mr-1 flex items-center justify-center"><IconMore /></button>
      </div>
      {combo >= 3 && <div className="text-center kicker text-puls-text -mt-1 mb-1">{combo >= 5 ? "Hochpuls! " : ""}Doppelte Puls · {combo} in Folge</div>}

      <div className="relative flex-1 min-h-0 no-select" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div key={idx} custom={dir} className="absolute inset-0 pb-safe"
            initial={{ x: dir * 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: dir * -60, opacity: 0 }} transition={spring}>
            {card.type === "title" && <TitleCard card={card} svg={svg} sub={ctx.course ? ctx.course.title : "Tageslektion"} />}
            {card.type === "story" && <StoryCard card={card} svg={svg} revealed={revealed[idx] ?? steps} />}
            {card.type === "insight" && <InsightCard card={card} svg={svg} saved={store.saved.some((s) => s.id === cardId)} />}
            {card.type === "recap" && <RecapCard card={card} />}
            {!passive && (
              <InteractiveCard card={card} svg={svg}
                onAnswer={(correct) => {
                  if (answered[idx] !== undefined) return 0;
                  setAnswered((a) => ({ ...a, [idx]: correct }));
                  return card.type === "poll" ? 0 : useStore.getState().answer(cardId, correct);
                }}
                onNext={next} nextLabel={idx === cards.length - 1 ? "Abschließen" : "Weiter"} />
            )}
          </motion.div>
        </AnimatePresence>
        {card.type === "recap" && (
          <div className="absolute inset-x-5 bottom-0 pb-safe z-10"><Button variant="puls" className="w-full mb-2" onClick={(e) => { e.stopPropagation(); finish(); }} onPointerUp={(e) => e.stopPropagation()}>Lektion abschließen</Button></div>
        )}
      </div>

      {!store.tapHintSeen && passive && <TapHint onDone={() => store.set({ tapHintSeen: true })} />}

      <BottomSheet open={menu} onClose={() => setMenu(false)}>
        <div className="flex flex-col gap-2">
          <Button variant="soft" onClick={share}><IconShare size={20} /> Karte teilen</Button>
          <Button variant="soft" onClick={() => { setMenu(false); setNote(""); }}><IconFlag size={20} /> Fehler notieren</Button>
          <Button variant="ghost" onClick={() => setMenu(false)}>Abbrechen</Button>
        </div>
      </BottomSheet>
      <BottomSheet open={note !== null} onClose={() => setNote(null)}>
        <h3 className="title text-[22px]">Was stimmt hier nicht?</h3>
        <textarea autoFocus value={note ?? ""} onChange={(e) => setNote(e.target.value)} rows={4} placeholder="Tippfehler, falsche Zahl, unklar …"
          className="w-full mt-3 rounded-2xl bg-surface-alt p-3 text-[16px] outline-none" />
        <Button className="w-full mt-3" disabled={!note?.trim()} onClick={() => {
          store.set({ notes: [...store.notes, { id: cardId, text: note!.trim(), at: Date.now() }] });
          setNote(null); fx.toast("Notiert. Danke!");
        }}>Speichern</Button>
      </BottomSheet>
    </div>
  );
}

function TapHint({ onDone }: { onDone: () => void }) {
  return (
    <motion.button className="absolute inset-0 z-30 bg-[#002144]/85 text-white flex" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onDone}>
      <div className="w-1/3 h-full border-r-2 border-dashed border-white/60 flex flex-col items-center justify-center gap-2 px-2">
        <span className="text-[34px]">←</span><span className="font-display font-black text-[17px]">Zurück</span><span className="text-[14px] opacity-80">links tippen</span>
      </div>
      <div className="flex-1 h-full flex flex-col items-center justify-center gap-2">
        <span className="text-[34px]">→</span><span className="font-display font-black text-[17px]">Weiter</span><span className="text-[14px] opacity-80">rechts tippen oder wischen</span>
        <span className="mt-8 kicker bg-puls rounded-full px-4 py-2">Verstanden</span>
      </div>
    </motion.button>
  );
}

