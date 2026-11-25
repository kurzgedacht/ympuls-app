import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore, today } from "../store/useStore";
import { addDays, weekKey } from "../lib/dates";
import { BADGES } from "../lib/rewards";
import { resolveCard } from "../content";
import { catBySlug, type CategorySlug } from "../brand";
import { renderCardPng, shareImage } from "../lib/share";
import { Art } from "../components/Art";
import { Button, PulseDot, rewardBurst } from "../components/ui";
import { IconX } from "../components/Icons";
import { cardArt, cardText } from "./Library";

/** Monday story "Deine Woche": 5 cards about last week, shareable as image. */
export default function WeekRecap() {
  const nav = useNavigate();
  const s = useStore();
  const [i, setI] = useState(0);
  const start = addDays(weekKey(today()), -7);
  const days = Array.from({ length: 7 }, (_, k) => addDays(start, k));
  const data = useMemo(() => {
    const stats = days.map((d) => s.days[d]);
    const minutes = Math.round(stats.reduce((a, d) => a + (d?.sec ?? 0), 0) / 60);
    const cats: Record<string, number> = {};
    stats.forEach((d) => Object.entries(d?.cats ?? {}).forEach(([c, n]) => (cats[c] = (cats[c] ?? 0) + n)));
    const t0 = new Date(start).getTime(), t1 = t0 + 7 * 86_400_000;
    const weekSaved = s.saved.filter((x) => x.at >= t0 && x.at < t1 && x.id.startsWith("c/"));
    const insight = (weekSaved[0] ?? s.saved.find((x) => x.id.startsWith("c/"))) && resolveCard((weekSaved[0] ?? s.saved.find((x) => x.id.startsWith("c/")))!.id);
    const top = Object.entries(cats).sort((a, b) => b[1] - a[1])[0];
    const badges = Object.entries(s.badges).filter(([, t]) => t >= t0 && t < t1).map(([id]) => BADGES.find((b) => b.id === id)).filter(Boolean);
    return { minutes, perDay: stats.map((d) => Math.round((d?.sec ?? 0) / 60)), lessons: stats.reduce((a, d) => a + (d?.lessons ?? 0), 0), insight, top: top ? (top[0] as CategorySlug) : null, badges };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const done = () => { s.set({ recapWeek: weekKey(today()) }); nav("/", { replace: true }); };
  useEffect(() => { if (i === 4) rewardBurst("small"); }, [i]);
  const share = async () => shareImage(await renderCardPng({ kicker: "Meine Woche", text: `${data.minutes} Minuten gelernt, ${data.lessons} Lektionen, Streak ${s.streak.count} Tage.${data.top ? ` Stärkste Kategorie: ${catBySlug[data.top].label}.` : ""}`, source: "YMPULS. Wochenrückblick" }));
  const max = Math.max(1, ...data.perDay);
  const cards = [
    <Slide key="m" kicker="Deine Woche" big={`${data.minutes} Min`} sub={`${data.lessons} Lektionen gelernt`}>
      <div className="flex items-end gap-2 h-32 mt-8 w-full">
        {data.perDay.map((m, k) => (
          <div key={k} className="flex-1 flex flex-col items-center gap-1">
            <motion.div initial={{ height: 0 }} animate={{ height: `${(m / max) * 100}%` }} transition={{ delay: 0.2 + k * 0.06 }} className={`w-full rounded-t-lg ${m === max && m > 0 ? "bg-puls" : "bg-white/30"}`} style={{ minHeight: 4 }} />
            <span className="text-[12px] font-bold opacity-75">{"MDMDFSS"[k]}</span>
          </div>
        ))}
      </div>
    </Slide>,
    <Slide key="i" kicker="Kerngedanke der Woche" big="" sub="">
      {data.insight ? (
        <div className="w-full">
          {cardArt(data.insight) && <div className="w-2/3 mx-auto rounded-[20px] bg-brand-soft aspect-square p-2"><Art svg={cardArt(data.insight)} className="w-full h-full" /></div>}
          <p className="title text-[26px] leading-tight mt-6">{cardText(data.insight.card)}</p>
          <p className="opacity-70 mt-2">{data.insight.source}</p>
        </div>
      ) : <p className="title text-[26px]">Diese Woche noch kein Kerngedanke. Nächste Woche!</p>}
    </Slide>,
    <Slide key="c" kicker="Stärkste Kategorie" big={data.top ? catBySlug[data.top].label : "Noch offen"} sub={data.top ? "Hier warst du am fleißigsten." : "Starte eine Lektion, dann weißt du's."}>
      {data.top && <span className="w-24 h-24 rounded-full mt-8" style={{ background: catBySlug[data.top].color }} />}
    </Slide>,
    <Slide key="s" kicker="Serien-Rekord" big={`${s.streak.best} Tage`} sub={`Aktuell: ${s.streak.count} Tage · ${s.streak.freezes} Streak-Schutz`}>
      <div className="relative w-28 h-28 mt-8"><span className="absolute inset-0 rounded-full bg-puls ripple" /><span className="absolute inset-0 rounded-full bg-puls beat" /></div>
    </Slide>,
    <Slide key="b" kicker="Neue Abzeichen" big={data.badges.length ? `${data.badges.length} neu` : "Weiter so"} sub={data.badges.length ? "" : "Diese Woche keine neuen Abzeichen. Die nächste wartet schon."}>
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        {data.badges.map((b) => <div key={b!.id} className="rounded-2xl bg-white/10 px-4 py-3 text-center"><div className="text-[32px]">{b!.icon}</div><div className="font-bold text-[14px]">{b!.title}</div></div>)}
      </div>
      <div className="w-full mt-8 flex flex-col gap-2">
        <Button variant="white" onClick={share}>Als Bild teilen</Button>
        <Button variant="puls" onClick={done}>Fertig</Button>
      </div>
    </Slide>,
  ];
  return (
    <div className="h-full bg-brand text-on-brand pt-safe pb-safe flex flex-col no-select" onClick={(e) => {
      if ((e.target as HTMLElement).closest("button")) return;
      const x = e.clientX - (e.currentTarget as HTMLElement).getBoundingClientRect().left;
      setI((v) => (x < (e.currentTarget as HTMLElement).clientWidth / 3 ? Math.max(0, v - 1) : Math.min(cards.length - 1, v + 1)));
    }}>
      <div className="flex gap-1 px-4 pt-2">{cards.map((_, k) => <div key={k} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden"><div className={`h-full bg-white ${k <= i ? "w-full" : "w-0"} transition-all`} /></div>)}</div>
      <div className="flex justify-between items-center px-4 mt-2">
        <span className="kicker flex items-center gap-2"><PulseDot size={7} /> Wochenrückblick</span>
        <button aria-label="Schließen" onClick={done} className="w-10 h-10 flex items-center justify-center"><IconX /></button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={i} className="flex-1 flex" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>{cards[i]}</motion.div>
      </AnimatePresence>
    </div>
  );
}

function Slide({ kicker, big, sub, children }: { kicker: string; big: string; sub: string; children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
      <div className="kicker text-[#FF6B7F]">{kicker}</div>
      {big && <div className="title text-[52px] mt-3">{big}</div>}
      {sub && <p className="text-[18px] opacity-85 mt-2">{sub}</p>}
      {children}
    </div>
  );
}
