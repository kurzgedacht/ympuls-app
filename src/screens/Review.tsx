import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveCard, isInteractive, type CardRef } from "../content";
import { useStore, today } from "../store/useStore";
import { dueIds } from "../lib/srs";
import { rng } from "../lib/feed";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { spring } from "../brand";
import { InteractiveCard } from "../components/cards/Interactive";
import { Art } from "../components/Art";
import { Button, ProgressBar, PulseDot, feedback, rewardBurst } from "../components/ui";
import { IconX } from "../components/Icons";
import { cardArt, cardText } from "./Library";

/** Daily spaced-repetition round: up to 10 due questions and insights (CLAUDE.md §7.7). */
export default function Review() {
  const nav = useNavigate();
  const queue = useMemo(() => {
    const st = useStore.getState();
    const refs = dueIds(st.srs, today()).map(resolveCard).filter((r): r is CardRef => !!r && (isInteractive(r.card) || r.card.type === "insight"));
    const rand = rng(Date.now() % 9973);
    return refs.map((r) => ({ r, k: rand() })).sort((a, b) => a.k - b.k).map((x) => x.r);
  }, []);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<boolean[]>([]);
  const start = useRef({ xp: useStore.getState().xp, t: Date.now() });
  const finished = i >= queue.length;

  useEffect(() => {
    if (!finished || !queue.length) return;
    const st = useStore.getState();
    st.addTime(Math.round((Date.now() - start.current.t) / 1000));
    st.completeReview();
    rewardBurst("small"); play("reward"); haptic("success");
  }, [finished, queue.length]);

  const answer = (correct: boolean) => {
    setResult((r) => [...r, correct]);
    return useStore.getState().answer(queue[i].id, correct, { review: true });
  };
  const next = () => setI((v) => v + 1);
  const close = () => nav("/", { replace: true });

  if (!queue.length) {
    return (
      <div className="h-full pt-safe pb-safe px-5 flex flex-col items-center justify-center text-center">
        <span className="text-[64px]">🧠</span>
        <h1 className="title text-[30px] mt-4">Alles wiederholt</h1>
        <p className="text-ink-muted mt-2">Gerade ist nichts fällig. Neue Fragen landen nach jeder Lektion hier.</p>
        <Button className="w-full mt-8" onClick={close}>Zurück</Button>
      </div>
    );
  }
  if (finished) {
    const right = result.filter(Boolean).length;
    return (
      <div className="h-full pt-safe pb-safe px-5 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...spring, stiffness: 260, damping: 12 }} className="text-[72px]">🧠</motion.div>
          <h1 className="title text-[34px] mt-4">Runde geschafft!</h1>
          <p className="text-ink-muted mt-2 text-[17px]">{right} von {queue.length} gewusst</p>
          <div className="flex items-center gap-2 mt-5"><PulseDot size={14} beat /><span className="title text-[40px] text-puls-text">+{useStore.getState().xp - start.current.xp}</span><span className="title text-[20px] text-puls-text">Puls</span></div>
          <p className="text-[15px] text-ink-muted mt-6 max-w-[280px]">Was du gewusst hast, kommt später wieder. Was nicht, schon morgen.</p>
        </div>
        <Button variant="puls" onClick={close}>Fertig</Button>
      </div>
    );
  }
  const ref = queue[i];
  return (
    <div className="h-full flex flex-col pt-safe bg-ground">
      <div className="flex items-center gap-3 px-4 h-12 shrink-0">
        <button aria-label="Schließen" onClick={() => { feedback(); close(); }} className="w-10 h-10 -ml-1 flex items-center justify-center"><IconX /></button>
        <ProgressBar value={i / queue.length} className="flex-1" />
        <span className="font-display font-black text-[14px] tabular-nums">{i + 1}/{queue.length}</span>
      </div>
      <div className="px-5 kicker text-ink-muted text-[11px]">Wiederholung · {ref.source}</div>
      <div className="relative flex-1 min-h-0 pb-safe">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div key={ref.id} className="absolute inset-0" initial={{ x: 60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }} transition={spring}>
            {ref.card.type === "insight" ? <Recall r={ref} onAnswer={(k) => { answer(k); next(); }} /> : (
              <InteractiveCard card={ref.card as never} svg={cardArt(ref)} onAnswer={answer} onNext={next} nextLabel={i === queue.length - 1 ? "Abschließen" : "Weiter"} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** "Weißt du es noch?": the insight is hidden until revealed, then self-graded. */
function Recall({ r, onAnswer }: { r: CardRef; onAnswer: (knew: boolean) => void }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="h-full flex flex-col px-5 pt-2 pb-4">
      <div className="kicker text-puls-text flex items-center gap-2"><PulseDot size={7} /> Weißt du es noch?</div>
      <h2 className="title text-[26px] mt-2">Welcher Kerngedanke gehört zu diesem Bild?</h2>
      <div className="flex-1 min-h-0 flex items-center justify-center my-4">
        <div className="h-full max-h-[300px] aspect-square rounded-card bg-brand-soft p-3"><Art svg={cardArt(r)} className="w-full h-full" /></div>
      </div>
      <AnimatePresence mode="wait">
        {shown ? (
          <motion.div key="a" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={spring}>
            <div className="rounded-[20px] bg-brand text-on-brand p-4"><p className="title text-[21px] leading-tight">{cardText(r.card)}</p></div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              <Button variant="soft" onClick={() => onAnswer(false)}>Nochmal üben</Button>
              <Button variant="puls" onClick={() => { haptic("success"); play("pling"); onAnswer(true); }}>Wusste ich!</Button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="q" exit={{ opacity: 0 }}><Button className="w-full" onClick={() => setShown(true)}>Aufdecken</Button></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
