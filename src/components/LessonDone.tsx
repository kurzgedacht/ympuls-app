import { AnimatePresence, motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import type { LessonCtx } from "../screens/Player";
import { useStore, today } from "../store/useStore";
import { coverSvg, courses } from "../content";
import { addDays, weekKey } from "../lib/dates";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { Button, PulseDot, rewardBurst } from "./ui";
import { Art } from "./Art";
import { spring, GOLD } from "../brand";

type Completion = ReturnType<ReturnType<typeof useStore.getState>["completeLesson"]>;
const completions = new Map<string, Completion>(); // guards against double completion (StrictMode, re-mounts)
interface Stats { seconds: number; correct: number; total: number; insights: number; xpStart: number }

/** Completion sequence: reward + stats → streak → unit badge / collectible → back to the path. */
export function LessonDone({ ctx, stats, onExit, onHome }: { ctx: LessonCtx; stats: Stats; onExit: () => void; onHome: () => void }) {
  const [step, setStep] = useState(0);
  const perfect = stats.total > 0 && stats.correct === stats.total;
  const [result, setResult] = useState<Completion | null>(() => completions.get(ctx.idPrefix + stats.xpStart) ?? null);
  useEffect(() => {
    const key = ctx.idPrefix + stats.xpStart;
    if (!completions.has(key)) completions.set(key, useStore.getState().completeLesson(ctx.course?.slug ?? null, ctx.lessonSlug, perfect, ctx.category));
    setResult(completions.get(key)!);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const { unitDone, unlockedCard } = result ?? { unitDone: false, unlockedCard: false };
  const xp = useStore((s) => s.xp);
  const streak = useStore((s) => s.streak);
  const days = useStore((s) => s.days);
  const earned = xp - stats.xpStart;
  const steps = ["reward", "streak", ...(unitDone ? ["unit"] : []), ...(unlockedCard ? ["card"] : [])];
  const nextStep = () => (step < steps.length - 1 ? setStep(step + 1) : onExit());

  useEffect(() => {
    if (!result) return;
    const s = steps[step];
    if (s === "reward") { rewardBurst("small"); play("reward"); haptic("success"); }
    if (s === "streak") { play("beat"); haptic("heavy"); }
    if (s === "unit" || s === "card") { rewardBurst("big"); play("levelup"); haptic("success"); }
  }, [step, !!result]); // eslint-disable-line react-hooks/exhaustive-deps

  const wk = weekKey(today());
  const week = Array.from({ length: 7 }, (_, i) => addDays(wk, i));
  const active = (d: string) => { const x = days[d]; return !!x && (x.lessons > 0 || x.reviews > 0 || x.snacks >= 10); };
  const cardNo = ctx.course ? courses.slice().sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.slug.localeCompare(b.slug)).findIndex((c) => c.slug === ctx.course!.slug) + 1 : 0;

  return (
    <div className="h-full bg-ground pt-safe pb-safe px-5 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div key={step} className="flex-1 flex flex-col items-center justify-center text-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={spring}>
          {steps[step] === "reward" && (
            <>
              <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, stiffness: 260, damping: 12 }}
                className="relative w-32 h-32 rounded-[36px] bg-brand flex items-center justify-center shadow-lift">
                <svg width="64" height="64" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="absolute -top-2 -right-2"><PulseDot size={26} beat /></span>
                {perfect && <motion.span initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, ...spring }} className="absolute -top-9 text-[44px]">👑</motion.span>}
              </motion.div>
              <h1 className="title text-[36px] mt-8">{perfect ? "Perfekte Lektion!" : "Lektion geschafft!"}</h1>
              <p className="text-ink-muted mt-2 text-[17px]">{ctx.title}</p>
              <CountUp value={earned} />
              <div className="grid grid-cols-2 gap-3 w-full mt-6">
                <Stat label="Zeit" value={`${Math.floor(stats.seconds / 60)}:${String(stats.seconds % 60).padStart(2, "0")}`} i={0} />
                <Stat label="Richtig" value={`${stats.correct}/${stats.total}`} i={1} />
                <Stat label="Neue Kerngedanken" value={String(stats.insights)} i={2} />
                <Stat label={perfect ? "inkl. Perfekt-Bonus" : "Puls"} value={`+${earned}`} i={3} gold />
              </div>
            </>
          )}
          {steps[step] === "streak" && (
            <>
              <div className="relative w-44 h-44 flex items-center justify-center">
                <span className="absolute inset-6 rounded-full bg-puls ripple" />
                <motion.span className="absolute inset-6 rounded-full bg-puls beat" />
                <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ ...spring, stiffness: 300, damping: 12 }} className="relative title text-[64px] text-white">{streak.count}</motion.span>
              </div>
              <h1 className="title text-[34px] mt-6">{streak.count === 1 ? "Dein Puls schlägt!" : `${streak.count} Tage Streak`}</h1>
              <p className="text-ink-muted mt-2 text-[17px]">{streak.count === 1 ? "Tag 1. Morgen wird's Tag 2." : "Jeden Tag ein Schlag. Bleib dran."}</p>
              <div className="flex gap-2 mt-8">
                {week.map((d, i) => (
                  <div key={d} className="flex flex-col items-center gap-1.5">
                    <span className="text-[12px] font-bold text-ink-muted">{"MDMDFSS"[i]}</span>
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.06, ...spring }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${active(d) ? "bg-puls" : "bg-surface-alt"} ${d === today() ? "ring-4 ring-puls/30" : ""}`}>
                      {active(d) && <svg width="16" height="16" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" /></svg>}
                    </motion.span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[15px] text-ink-muted">🛡️ {streak.freezes} Streak-Schutz verfügbar</p>
            </>
          )}
          {steps[step] === "unit" && (
            <>
              <motion.div initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, stiffness: 200, damping: 12 }}
                className="w-36 h-36 rounded-full flex items-center justify-center text-[64px] shadow-lift" style={{ background: GOLD }}>🏅</motion.div>
              <div className="kicker text-puls-text mt-8">Unit abgeschlossen</div>
              <h1 className="title text-[32px] mt-2">{ctx.course?.units.find((u) => u.lessons.includes(ctx.lessonSlug))?.title}</h1>
              <p className="text-ink-muted mt-2">Neues Abzeichen auf deinem Pfad.</p>
            </>
          )}
          {steps[step] === "card" && ctx.course && (
            <>
              <div className="kicker text-puls-text">Neue Sammelkarte</div>
              <motion.div initial={{ rotateY: 180, scale: 0.6 }} animate={{ rotateY: 0, scale: 1 }} transition={{ duration: 0.9, ease: "easeOut" }}
                className="mt-4 w-56 rounded-[24px] p-3 shadow-lift" style={{ background: `linear-gradient(135deg, ${GOLD}, #fff6e0 50%, ${GOLD})` }}>
                <div className="rounded-[16px] overflow-hidden"><Art svg={coverSvg(ctx.course.slug)} keep className="w-full aspect-square" /></div>
                <div className="text-left px-1 pt-2 text-[#002144]">
                  <div className="kicker opacity-70">#{cardNo} / {courses.length}</div>
                  <div className="font-display font-black text-[17px] leading-tight">{ctx.course.title}</div>
                </div>
              </motion.div>
              <h1 className="title text-[30px] mt-6">Kurs komplett!</h1>
              <p className="text-ink-muted mt-2">Die Karte liegt jetzt in deinem Album.</p>
            </>
          )}
        </motion.div>
      </AnimatePresence>
      <Button variant={steps[step] === "reward" ? "puls" : "primary"} onClick={nextStep}>{step < steps.length - 1 ? "Weiter" : ctx.course ? "Zum Kurs" : "Fertig"}</Button>
      {step === steps.length - 1 && ctx.course && <Button variant="ghost" className="mt-1" onClick={onHome}>Zur Startseite</Button>}
    </div>
  );
}

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const txt = useTransform(mv, (v) => `+${Math.round(v)}`);
  useEffect(() => { const c = animate(mv, value, { duration: 1.2, delay: 0.3, ease: "easeOut" }); return c.stop; }, [mv, value]);
  return <div className="flex items-center gap-2 mt-5"><PulseDot size={16} beat /><motion.span className="title text-[48px] text-puls-text">{txt}</motion.span><span className="title text-[22px] text-puls-text">Puls</span></div>;
}
const Stat = ({ label, value, i, gold }: { label: string; value: string; i: number; gold?: boolean }) => (
  <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.5 + i * 0.1 }} className="rounded-[20px] bg-surface-card shadow-soft p-4 text-left">
    <div className="title text-[26px]" style={gold ? { color: "#B8860B" } : undefined}>{value}</div>
    <div className="text-[13px] font-bold text-ink-muted mt-1">{label}</div>
  </motion.div>
);
