import { motion } from "framer-motion";
import type { Card } from "../../content/schema";
import { Art } from "../Art";
import { PulseDot } from "../ui";
import { rich } from "./rich";
import { spring } from "../../brand";

type Of<T extends Card["type"]> = Extract<Card, { type: T }>;

export function TitleCard({ card, svg, sub }: { card: Of<"title">; svg: string; sub?: string }) {
  return (
    <div className="h-full flex flex-col px-5 pt-2 pb-6">
      {card.kicker && <div className="kicker text-puls-text flex items-center gap-2"><PulseDot size={7} /> {card.kicker}</div>}
      <h1 className="title text-[38px] mt-2">{card.heading}</h1>
      {sub && <p className="text-ink-muted mt-2 text-[17px]">{sub}</p>}
      <div className="flex-1 min-h-0 flex items-center justify-center mt-4">
        <div className="h-full max-h-[380px] aspect-square rounded-card bg-brand-soft p-3"><Art svg={svg} className="w-full h-full" /></div>
      </div>
      <p className="text-center text-ink-muted text-[14px] font-bold">Tippe, um zu starten</p>
    </div>
  );
}

export function StoryCard({ card, svg, revealed }: { card: Of<"story">; svg: string; revealed: number }) {
  return (
    <div className="h-full flex flex-col px-5 pt-2 pb-6">
      <p className="story-text text-[19px] leading-[1.45] font-normal">{rich(card.text)}</p>
      <div className="flex-1 min-h-0 flex items-center justify-center mt-4">
        <div className="w-full max-h-full aspect-square rounded-card bg-brand-soft p-3" style={{ maxHeight: "60vh" }}>
          <Art svg={svg} revealed={revealed} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}

export function InsightCard({ card, svg, saved }: { card: Of<"insight">; svg: string; saved?: boolean }) {
  return (
    <div className="h-full px-5 pt-2 pb-6">
      <div className="h-full rounded-card bg-brand dark:bg-[#1A3560] text-on-brand p-5 flex flex-col shadow-lift">
        <div className="flex-1 min-h-0 flex justify-center">
          <div className="h-full max-h-[300px] aspect-square rounded-[20px] bg-brand-soft p-2"><Art svg={svg} className="w-full h-full" /></div>
        </div>
        <div className="kicker flex items-center gap-2 mt-5 text-[#FF6B7F]">
          <motion.span key={String(saved)} initial={{ scale: 1 }} animate={saved ? { scale: [1, 2, 1], y: [0, -8, 0] } : {}} transition={{ duration: 0.5 }}><PulseDot size={9} /></motion.span>
          Kerngedanke
          {saved && <motion.span initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={spring} className="ml-auto text-on-brand/80 normal-case tracking-normal font-bold text-[13px]">✓ Gespeichert</motion.span>}
        </div>
        <p className="title text-[27px] leading-[1.15] mt-3">{card.text}</p>
      </div>
    </div>
  );
}

export function RecapCard({ card }: { card: Of<"recap"> }) {
  return (
    <div className="h-full flex flex-col px-5 pt-2 pb-6">
      <div className="kicker text-puls-text flex items-center gap-2"><PulseDot size={7} /> Recap</div>
      <h2 className="title text-[32px] mt-2">Das nimmst du mit</h2>
      <div className="flex flex-col gap-3 mt-6">
        {card.bullets.map((b, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.1 + i * 0.12 }}
            className="rounded-[20px] bg-surface-card shadow-soft p-4 flex gap-3 items-start">
            <span className="mt-[7px]"><PulseDot size={10} /></span>
            <p className="text-[18px] leading-snug font-bold">{b}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
