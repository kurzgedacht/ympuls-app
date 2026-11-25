import { AnimatePresence, motion, useMotionValue, useTransform, animate, type PanInfo } from "framer-motion";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Card } from "../../content/schema";
import { haptic } from "../../lib/haptics";
import { play } from "../../lib/sound";
import { Button, PulseDot, feedback } from "../ui";
import { Art } from "../Art";
import { spring, GOOD } from "../../brand";
import { rich } from "./rich";

type Interactive = Extract<Card, { type: "quiz" | "estimate" | "order" | "match" | "swipe" | "poll" }>;
export interface InteractiveProps {
  card: Interactive;
  svg?: string;
  /** Called once when the answer is checked; returns Puls gained. */
  onAnswer: (correct: boolean) => number;
  onNext?: () => void;
  nextLabel?: string;
  compact?: boolean; // feed layout
  dark?: boolean;
}

/** Deterministic shuffle so a card looks the same on re-render, but never in solution order. */
function shuffled<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 1103515245 + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.length > 1 && a.every((x, i) => x === arr[i])) a.push(a.shift()!);
  return a;
}

export function InteractiveCard(p: InteractiveProps) {
  const [result, setResult] = useState<null | { correct: boolean; gained: number }>(null);
  const check = (correct: boolean) => {
    if (result) return;
    if (p.card.type === "poll") { p.onAnswer(true); return setResult({ correct: true, gained: 0 }); }
    const gained = p.onAnswer(correct);
    if (correct) { haptic("success"); play("pling"); } else { haptic("error"); play("soft"); }
    setResult({ correct, gained });
  };
  const body = {
    quiz: <Quiz {...p} card={p.card as Q} done={!!result} onCheck={check} />,
    estimate: <Estimate {...p} card={p.card as E} done={!!result} onCheck={check} />,
    order: <Order {...p} card={p.card as O} done={!!result} onCheck={check} />,
    match: <Match {...p} card={p.card as M} done={!!result} onCheck={check} />,
    swipe: <Swipe {...p} card={p.card as S} done={!!result} onCheck={check} />,
    poll: <Poll {...p} card={p.card as P} done={!!result} onCheck={check} />,
  }[p.card.type];
  const explanation = p.card.type === "poll" ? "" : p.card.explanation;
  return (
    <div className="relative h-full flex flex-col">
      {body}
      <AnimatePresence>
        {result && p.card.type !== "poll" && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} transition={spring}
            className={`absolute inset-x-0 bottom-0 z-20 rounded-t-[28px] px-5 pt-5 pb-5 shadow-lift ${p.dark ? "bg-[#152A49] text-white" : "bg-surface-card"}`}>
            <div className="flex items-center gap-3">
              {result.correct ? (
                <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: GOOD }}>
                  <svg width="22" height="22" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </motion.span>
              ) : (
                <span className="w-10 h-10 rounded-full bg-surface-alt text-ink-muted flex items-center justify-center text-[20px] font-black shake">✕</span>
              )}
              <div className="flex-1">
                <div className="title text-[24px]" style={{ color: result.correct ? GOOD : undefined }}>{result.correct ? pick(["Richtig!", "Stark!", "Genau so!", "Sitzt!"]) : "Fast!"}</div>
              </div>
              {result.gained > 0 && (
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex items-center gap-1.5 font-display font-black text-puls-text">
                  <PulseDot size={10} /> +{result.gained} Puls
                </motion.div>
              )}
            </div>
            {explanation && <p className="mt-3 text-[17px] leading-snug">{explanation}</p>}
            {p.onNext && <Button variant={result.correct ? "primary" : "puls"} className="w-full mt-4 dark:bg-on-brand dark:text-[#002144]" onClick={p.onNext}>{p.nextLabel ?? "Weiter"}</Button>}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];

type Q = Extract<Card, { type: "quiz" }>; type E = Extract<Card, { type: "estimate" }>; type O = Extract<Card, { type: "order" }>;
type M = Extract<Card, { type: "match" }>; type S = Extract<Card, { type: "swipe" }>; type P = Extract<Card, { type: "poll" }>;
type Sub<C> = Omit<InteractiveProps, "card"> & { card: C; done: boolean; onCheck: (correct: boolean) => void };

const Question = ({ kicker, children }: { kicker: string; children: ReactNode }) => (
  <div className="px-5 pt-2">
    <div className="kicker text-puls-text flex items-center gap-2"><PulseDot size={7} /> {kicker}</div>
    <h2 className="title text-[26px] mt-2 leading-[1.08]">{children}</h2>
  </div>
);
const CheckBar = ({ disabled, onClick, label = "Prüfen" }: { disabled: boolean; onClick: () => void; label?: string }) => (
  <div className="px-5 pb-4 pt-3"><Button variant="puls" className="w-full" disabled={disabled} onClick={onClick}>{label}</Button></div>
);
const optClass = (sel: boolean, state?: "right" | "wrong" | "dim") =>
  `w-full min-h-[56px] rounded-[20px] px-5 py-3 text-left text-[17px] font-bold border-2 transition-colors ${
    state === "right" ? "border-transparent text-white" : state === "wrong" ? "bg-surface-alt border-line text-ink-muted shake" : sel ? "bg-brand text-on-brand border-brand" : "bg-surface-card border-line text-ink"
  } ${state === "dim" ? "opacity-50" : ""}`;

function Quiz({ card, svg, done, onCheck, compact }: Sub<Q>) {
  const [sel, setSel] = useState<number | null>(null);
  const kicker = card.kind === "tf" ? "Stimmt's?" : card.kind === "compare" ? "Vergleich" : "Quiz";
  const st = (i: number) => (!done ? undefined : i === card.correct ? "right" : i === sel ? "wrong" : "dim");
  return (
    <>
      <Question kicker={kicker}>{card.question}</Question>
      <div className="flex-1 min-h-0 flex flex-col justify-start gap-3 px-5 pt-6 overflow-y-auto no-select">
        {svg && !compact && <div className="flex-1 min-h-[120px] max-h-[260px] mx-auto aspect-square rounded-card bg-brand-soft p-2"><Art svg={svg} className="w-full h-full" /></div>}
        {card.kind === "compare" ? (
          <div className="grid grid-cols-2 gap-3">
            {card.options.map((o, i) => (
              <motion.button key={i} whileTap={{ scale: 0.96 }} disabled={done} onClick={() => { feedback(); setSel(i); }}
                className={`${optClass(sel === i, st(i))} !text-center min-h-[96px] text-[18px]`} style={st(i) === "right" ? { background: GOOD } : undefined}>{o}</motion.button>
            ))}
          </div>
        ) : (
          card.options.map((o, i) => (
            <motion.button key={i} whileTap={{ scale: 0.97 }} disabled={done} onClick={() => { feedback(); setSel(i); }} className={optClass(sel === i, st(i))} style={st(i) === "right" ? { background: GOOD } : undefined}>{o}</motion.button>
          ))
        )}
      </div>
      <CheckBar disabled={sel === null || done} onClick={() => onCheck(sel === card.correct)} />
    </>
  );
}

const fmt = (n: number) => n.toLocaleString("de-DE", { maximumFractionDigits: 2 });
function Estimate({ card, done, onCheck }: Sub<E>) {
  const mid = card.min + Math.round((card.max - card.min) / 2 / card.step) * card.step;
  const [v, setV] = useState(mid);
  const [touched, setTouched] = useState(false);
  const shown = useMotionValue(mid);
  const shownText = useTransform(shown, (x) => fmt(Math.round(x / card.step) * card.step));
  const pct = (x: number) => ((x - card.min) / (card.max - card.min)) * 100;
  const markerLeft = useTransform(shown, (x) => `${pct(x)}%`);
  useEffect(() => { if (!done) shown.set(v); }, [v, done, shown]);
  const off = card.answer === 0 ? Math.abs(v) : Math.round((Math.abs(v - card.answer) / Math.abs(card.answer)) * 100);
  const check = () => {
    onCheck(Math.abs(v - card.answer) <= card.tolerance);
    setTimeout(() => animate(shown, card.answer, { duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }), 250);
  };
  return (
    <>
      <Question kicker="Schätz mal">{card.question}</Question>
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center">
          <motion.span className={`title text-[64px] ${done ? "text-puls-text" : ""}`}>{shownText}</motion.span>
          <span className="title text-[24px] ml-2 text-ink-muted">{card.unit}</span>
        </div>
        {done && <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="text-center mt-1 font-bold text-ink-muted">
          Dein Tipp: {fmt(v)} {card.unit} · {off === 0 ? "Volltreffer!" : `Du lagst ${off} % daneben`}
        </motion.div>}
        <div className="relative mt-10 h-12">
          <input type="range" aria-label="Schätzwert" min={card.min} max={card.max} step={card.step} value={v} disabled={done}
            onChange={(e) => { setV(Number(e.target.value)); setTouched(true); haptic("light"); }} className="estimate-range absolute inset-0 w-full" />
          {done && <motion.div className="absolute top-0 -ml-[3px] w-1.5 h-12 rounded-full bg-puls pointer-events-none" style={{ left: markerLeft }} />}
          <div className="flex justify-between text-[14px] font-bold text-ink-muted mt-14"><span>{fmt(card.min)}</span><span>{fmt(card.max)}</span></div>
        </div>
      </div>
      <CheckBar disabled={!touched || done} onClick={check} />
    </>
  );
}

function Order({ card, done, onCheck }: Sub<O>) {
  const pool = useMemo(() => shuffled(card.items, card.question), [card]);
  const [seq, setSeq] = useState<string[]>([]);
  const correct = seq.every((x, i) => x === card.items[i]);
  return (
    <>
      <Question kicker="Reihenfolge">{card.question}</Question>
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-4 no-select">
        <div className="flex flex-col gap-2">
          {card.items.map((_, i) => {
            const item = seq[i];
            const ok = done && item === card.items[i];
            return (
              <motion.button key={i} layout onClick={() => !done && item && (feedback(), setSeq(seq.filter((x) => x !== item)))}
                className={`h-[52px] rounded-2xl flex items-center gap-3 px-3 border-2 border-dashed text-left ${item ? "border-transparent bg-brand text-on-brand" : "border-line"}`}
                style={done ? { background: ok ? GOOD : undefined } : undefined}>
                <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-display font-black text-[14px] shrink-0">{i + 1}</span>
                <span className={`font-bold text-[16px] leading-tight ${done && !ok ? "text-ink-muted" : ""}`}>{item ?? ""}</span>
                {done && !ok && <span className="ml-auto text-[13px] text-ink-muted">→ {card.items[i]}</span>}
              </motion.button>
            );
          })}
        </div>
        {!done && <div className="flex flex-wrap gap-2 mt-5">
          {pool.filter((x) => !seq.includes(x)).map((x) => (
            <motion.button key={x} layout whileTap={{ scale: 0.95 }} onClick={() => { feedback(); setSeq([...seq, x]); }}
              className="min-h-[48px] px-4 py-2 rounded-full bg-surface-card border-2 border-line font-bold text-[16px] text-left">{x}</motion.button>
          ))}
        </div>}
      </div>
      <CheckBar disabled={seq.length < card.items.length || done} onClick={() => onCheck(correct)} />
    </>
  );
}

function Match({ card, done, onCheck }: Sub<M>) {
  const rights = useMemo(() => shuffled(card.pairs.map((p) => p[1]), card.question), [card]);
  const [left, setLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<number[]>([]); // left indices
  const [wrong, setWrong] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);
  useLayoutEffect(() => {
    const b = box.current?.getBoundingClientRect();
    if (!b) return;
    setLines(matched.map((li) => {
      const l = refs.current[`l${li}`]?.getBoundingClientRect(), r = refs.current[`r${card.pairs[li][1]}`]?.getBoundingClientRect();
      return l && r ? { x1: l.right - b.left, y1: l.top + l.height / 2 - b.top, x2: r.left - b.left, y2: r.top + r.height / 2 - b.top } : { x1: 0, y1: 0, x2: 0, y2: 0 };
    }));
  }, [matched, card.pairs]);
  const tapRight = (txt: string) => {
    if (left === null || done) return;
    if (card.pairs[left][1] === txt) {
      haptic("medium"); play("tap");
      const m = [...matched, left];
      setMatched(m); setLeft(null);
      if (m.length === card.pairs.length) setTimeout(() => onCheck(mistakes === 0), 350);
    } else {
      haptic("error"); setMistakes((x) => x + 1); setWrong(txt); setTimeout(() => setWrong(null), 450);
    }
  };
  const base = "min-h-[64px] rounded-2xl px-3 py-2 text-[15px] font-bold leading-tight border-2 text-left transition-colors";
  return (
    <>
      <Question kicker="Zuordnen">{card.question}</Question>
      <div ref={box} className="relative flex-1 min-h-0 overflow-y-auto px-4 pt-4 no-select">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {lines.map((l, i) => <motion.line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#D11F3A" strokeWidth={3} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />)}
        </svg>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <div className="flex flex-col gap-3">
            {card.pairs.map(([l], i) => (
              <motion.button key={l} ref={(el) => { refs.current[`l${i}`] = el; }} whileTap={{ scale: 0.96 }} disabled={matched.includes(i)}
                onClick={() => { feedback(); setLeft(i); }}
                className={`${base} ${matched.includes(i) ? "bg-brand-soft border-transparent text-ink" : left === i ? "bg-brand text-on-brand border-brand" : "bg-surface-card border-line"}`}>{l}</motion.button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            {rights.map((r) => {
              const isMatched = matched.some((li) => card.pairs[li][1] === r);
              return (
                <motion.button key={r} ref={(el) => { refs.current[`r${r}`] = el; }} whileTap={{ scale: 0.96 }} disabled={isMatched} onClick={() => tapRight(r)}
                  className={`${base} font-normal ${isMatched ? "bg-brand-soft border-transparent" : "bg-surface-card border-line"} ${wrong === r ? "shake !border-ink-muted" : ""}`}>{r}</motion.button>
              );
            })}
          </div>
        </div>
        {!done && <p className="text-center text-ink-muted text-[14px] mt-4">{left === null ? "Tippe links einen Begriff an" : "Und jetzt die passende Erklärung rechts"}</p>}
      </div>
      <div className="h-4" />
    </>
  );
}

function Swipe({ card, done, onCheck }: Sub<S>) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [flash, setFlash] = useState<null | boolean>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const factO = useTransform(x, [20, 100], [0, 1]);
  const mythO = useTransform(x, [-100, -20], [1, 0]);
  const decide = (saysTrue: boolean) => {
    if (done || i >= card.statements.length) return;
    const right = card.statements[i].true === saysTrue;
    haptic(right ? "medium" : "error"); play(right ? "tap" : "soft");
    setFlash(right);
    const next = [...answers, right];
    setAnswers(next);
    animate(x, saysTrue ? 420 : -420, { duration: 0.25 }).then(() => {
      x.set(0); setFlash(null); setI(i + 1);
      if (next.length === card.statements.length) onCheck(next.every(Boolean));
    });
  };
  const onEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) decide(info.offset.x > 0);
    else animate(x, 0, spring);
  };
  return (
    <>
      <Question kicker={`${Math.min(i + 1, card.statements.length)} / ${card.statements.length} · Mythos oder Fakt?`}>{card.question}</Question>
      <div className="flex-1 relative mx-5 my-4 no-select">
        {card.statements.map((s, k) => k >= i && k < i + 3 && (
          <motion.div key={k} drag={k === i && !done ? "x" : false} dragSnapToOrigin={false} onDragEnd={k === i ? onEnd : undefined}
            style={k === i ? { x, rotate, zIndex: 10 } : { zIndex: 10 - (k - i), scale: 1 - (k - i) * 0.05, y: (k - i) * 14 }}
            className="absolute inset-0 rounded-card bg-surface-card shadow-lift border-2 border-line flex items-center justify-center p-7 touch-none">
            <p className="title text-[26px] text-center leading-tight">{s.text}</p>
            {k === i && <>
              <motion.span style={{ opacity: factO, background: GOOD }} className="absolute top-5 left-5 kicker px-3 py-1.5 rounded-full text-white">Fakt</motion.span>
              <motion.span style={{ opacity: mythO }} className="absolute top-5 right-5 kicker px-3 py-1.5 rounded-full bg-brand text-on-brand">Mythos</motion.span>
              {flash !== null && <span className={`absolute bottom-5 text-[40px] font-black ${flash ? "" : "text-ink-muted"}`} style={flash ? { color: GOOD } : undefined}>{flash ? "✓" : "✕"}</span>}
            </>}
          </motion.div>
        ))}
        {i >= card.statements.length && (
          <div className="absolute inset-0 flex flex-col gap-2 justify-start pt-2 overflow-y-auto">
            {card.statements.map((s, k) => (
              <div key={k} className="rounded-2xl bg-surface-card px-4 py-3 flex gap-3 items-start">
                <span className="font-black" style={{ color: answers[k] ? GOOD : undefined }}>{answers[k] ? "✓" : "✕"}</span>
                <span className="flex-1 text-[15px]"><b>{s.true ? "Fakt" : "Mythos"}:</b> {s.text}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 pb-4">
        <Button variant="soft" disabled={done || i >= card.statements.length} onClick={() => decide(false)}>← Mythos</Button>
        <Button variant="primary" disabled={done || i >= card.statements.length} onClick={() => decide(true)}>Fakt →</Button>
      </div>
    </>
  );
}

function Poll({ card, done, onCheck, onNext, nextLabel }: Sub<P>) {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <>
      <Question kicker="Was würdest du tun?">{card.question}</Question>
      <div className="flex-1 flex flex-col justify-start gap-3 px-5 pt-6">
        {card.options.map((o, i) => (
          <motion.button key={i} whileTap={{ scale: 0.97 }} disabled={done} onClick={() => { feedback(); setSel(i); onCheck(true); }}
            className={`${optClass(sel === i)} relative overflow-hidden`}>
            {o}
            {done && i === card.majority && <span className="kicker ml-2 text-puls-text">· die meisten</span>}
          </motion.button>
        ))}
        <AnimatePresence>
          {done && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[20px] bg-brand-soft p-4 mt-1">
              <p className="font-bold">Die meisten Menschen entscheiden sich für „{card.options[card.majority]}“.</p>
              {card.note && <p className="mt-1 text-[16px] story-text">{rich(card.note)}</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {done && onNext ? <CheckBar disabled={false} label={nextLabel ?? "Weiter"} onClick={onNext} /> : <div className="h-[88px]" />}
    </>
  );
}
