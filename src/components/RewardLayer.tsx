import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useFx, type Overlay } from "../store/fx";
import { LEVEL_TITLES } from "../lib/levels";
import { BADGES } from "../lib/rewards";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { Button, PulseDot, rewardBurst } from "./ui";
import { spring } from "../brand";
import { useStore } from "../store/useStore";

/** Global reward moments: level-up, streak milestone, badge unlocked, daily goal, flying "+10 Puls". */
export function RewardLayer() {
  const queue = useFx((s) => s.queue);
  const shift = useFx((s) => s.shift);
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    if (current.kind === "badge") {
      haptic("success"); play("reward");
      const t = setTimeout(shift, 2600);
      return () => clearTimeout(t);
    }
    haptic("heavy"); play("levelup"); rewardBurst("big");
  }, [current, shift]);

  return (
    <>
      <PulsFly />
      <AnimatePresence>
        {current?.kind === "badge" && <BadgeToast key={`b-${current.id}`} id={current.id} onDone={shift} />}
        {current && current.kind !== "badge" && <FullScreen key={`${current.kind}-${JSON.stringify(current)}`} o={current} onDone={shift} />}
      </AnimatePresence>
    </>
  );
}

function FullScreen({ o, onDone }: { o: Exclude<Overlay, { kind: "badge" }>; onDone: () => void }) {
  const streak = useStore((s) => s.streak.count);
  const content = {
    levelup: o.kind === "levelup" && { kicker: "Level-Up", big: `Level ${o.level}`, sub: LEVEL_TITLES[o.level - 1], emoji: "⚡" },
    milestone: o.kind === "milestone" && { kicker: "Streak-Meilenstein", big: `${o.days} Tage`, sub: o.days >= 30 ? "Das ist keine Phase mehr. Das bist du." : "Dein Puls schlägt jeden Tag. Weiter so!", emoji: "🔥" },
    goal: o.kind === "goal" && { kicker: "Tagesziel geschafft", big: "Ziel erreicht", sub: streak > 0 ? `Streak: ${streak} Tage` : "Stark. Morgen wieder?", emoji: "🎯" },
  }[o.kind];
  if (!content) return null;
  return (
    <motion.div className="absolute inset-0 z-[80] bg-brand flex flex-col items-center justify-center text-on-brand px-8 text-center"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onDone}>
      <motion.div initial={{ scale: 0.3, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ ...spring, stiffness: 260, damping: 14 }} className="text-[88px] leading-none mb-6">{content.emoji}</motion.div>
      <div className="kicker flex items-center gap-2 text-[#FF6B7F]"><PulseDot size={8} beat /> {content.kicker}</div>
      <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ ...spring, delay: 0.15 }} className="title text-[56px] mt-3">{content.big}</motion.div>
      <div className="mt-3 text-[19px] opacity-90">{content.sub}</div>
      <Button variant="puls" className="mt-12 w-full max-w-[300px]" onClick={onDone}>Weiter</Button>
    </motion.div>
  );
}

function BadgeToast({ id, onDone }: { id: string; onDone: () => void }) {
  const b = BADGES.find((x) => x.id === id);
  if (!b) return null;
  return (
    <motion.button onClick={onDone} className="absolute inset-x-4 z-[75] flex items-center gap-3 rounded-[22px] bg-brand text-on-brand p-3 shadow-lift text-left"
      style={{ top: "calc(max(env(safe-area-inset-top), 12px) + 6px)" }}
      initial={{ y: -120 }} animate={{ y: 0 }} exit={{ y: -140 }} transition={spring}>
      <motion.span initial={{ scale: 0 }} animate={{ scale: [0, 1.4, 1] }} transition={{ duration: 0.5, delay: 0.15 }} className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[28px]">{b.icon}</motion.span>
      <span className="flex-1">
        <span className="kicker text-[#F2B84B] block">Abzeichen freigeschaltet</span>
        <span className="font-display font-black text-[18px] block">{b.title}</span>
        <span className="text-[14px] opacity-80">{b.desc}</span>
      </span>
    </motion.button>
  );
}

/** "+10 Puls": a red dot with the amount flies up into the counter at the top right. */
function PulsFly() {
  const ping = useFx((s) => s.ping);
  const [items, setItems] = useState<{ id: number; amount: number }[]>([]);
  useEffect(() => {
    if (!ping) return;
    setItems((x) => [...x, ping]);
    const t = setTimeout(() => setItems((x) => x.filter((i) => i.id !== ping.id)), 1100);
    return () => clearTimeout(t);
  }, [ping]);
  return (
    <div className="pointer-events-none absolute inset-0 z-[72]">
      <AnimatePresence>
        {items.map((i) => (
          <motion.div key={i.id} className="absolute left-1/2 top-1/2 flex items-center gap-1.5 font-display font-black text-[22px] text-puls-text"
            initial={{ x: "-50%", y: 40, scale: 0.6, opacity: 0 }}
            animate={{ x: ["-50%", "-50%", "130px"], y: [40, -20, -380], scale: [0.6, 1.3, 0.4], opacity: [0, 1, 0] }}
            transition={{ duration: 1, times: [0, 0.35, 1], ease: "easeInOut" }}>
            <PulseDot size={14} /> +{i.amount} Puls
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
