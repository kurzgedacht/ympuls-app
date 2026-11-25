import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { courses, resolveCard, artSvg, type CardRef } from "../content";
import type { Card } from "../content/schema";
import { useStore } from "../store/useStore";
import { catBySlug, spring } from "../brand";
import { CourseTile, courseProgress } from "../components/CourseTile";
import { Art } from "../components/Art";
import { Button, PulseDot, feedback } from "../components/ui";
import { renderCardPng, shareImage } from "../lib/share";
import { useFx } from "../store/fx";

const TABS = ["Alle", "Gemerkt", "Fertig", "Sammlung"] as const;
type Tab = (typeof TABS)[number];

export const cardText = (c: Card) =>
  c.type === "story" || c.type === "insight" ? c.text : c.type === "title" ? c.heading : c.type === "recap" ? c.bullets.join(" · ") :
  c.type === "swipe" ? c.statements.map((s) => `${s.true ? "Fakt" : "Mythos"}: ${s.text}`).join(" ") : "question" in c ? c.question : "";
export const cardArt = (r: CardRef) => ("art" in r.card ? artSvg(r.base, r.card.art) : "");

export default function Library() {
  const [tab, setTab] = useState<Tab>("Alle");
  const { progress, bookmarks, collection, saved } = useStore();
  const savedPing = useFx((s) => s.savedPing);
  const list = {
    Alle: courses.filter((c) => (progress[c.slug] ?? []).length > 0 || bookmarks.includes(c.slug)),
    Gemerkt: courses.filter((c) => bookmarks.includes(c.slug)),
    Fertig: courses.filter((c) => collection.includes(c.slug) || (courseProgress(c, progress).next === null)),
    Sammlung: [],
  }[tab];
  return (
    <div className="h-full scroll pb-28 pt-safe">
      <h1 className="title text-[32px] px-5 pt-3">Bibliothek</h1>
      <div className="mx-5 mt-4 p-1 rounded-full bg-surface-alt grid grid-cols-4 relative">
        {TABS.map((t) => (
          <button key={t} onClick={() => { feedback(); setTab(t); }} className={`relative h-10 rounded-full text-[14px] font-bold z-10 ${tab === t ? "text-on-brand" : "text-ink"}`}>
            {tab === t && <motion.span layoutId="libtab" transition={spring} className="absolute inset-0 rounded-full bg-brand -z-10" />}
            {t}{t === "Sammlung" && saved.length > 0 && <motion.span key={savedPing} animate={{ scale: [1, 1.5, 1] }} className="ml-1 text-[11px] opacity-80">{saved.length}</motion.span>}
          </button>
        ))}
      </div>
      {tab === "Sammlung" ? <Collection /> : list.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-5 mt-5">{list.map((c) => <CourseTile key={c.slug} course={c} />)}</div>
      ) : (
        <Empty text={tab === "Gemerkt" ? "Merke dir Kurse auf der Kursseite." : tab === "Fertig" ? "Hier landen deine abgeschlossenen Kurse." : "Starte einen Kurs, dann erscheint er hier."} />
      )}
    </div>
  );
}

const Empty = ({ text }: { text: string }) => (
  <div className="mx-5 mt-8 rounded-card border-2 border-dashed border-line p-8 text-center text-ink-muted">
    <PulseDot size={14} className="mb-3" /><p className="font-bold">{text}</p>
  </div>
);

function Collection() {
  const saved = useStore((s) => s.saved);
  const [sort, setSort] = useState<"Datum" | "Kategorie">("Datum");
  const [open, setOpen] = useState<CardRef | null>(null);
  const items = useMemo(() => {
    const refs = saved.map((x) => ({ at: x.at, ref: resolveCard(x.id) })).filter((x): x is { at: number; ref: CardRef } => !!x.ref);
    return sort === "Datum" ? refs : [...refs].sort((a, b) => a.ref.category.localeCompare(b.ref.category) || b.at - a.at);
  }, [saved, sort]);
  if (!items.length) return <Empty text="Kerngedanken werden automatisch gespeichert. Im Feed speicherst du Snacks per Doppeltipp." />;
  return (
    <>
      <div className="flex gap-2 px-5 mt-4 items-center">
        <span className="text-[14px] text-ink-muted font-bold mr-1">{items.length} Karten · sortiert nach</span>
        {(["Datum", "Kategorie"] as const).map((s) => (
          <button key={s} onClick={() => setSort(s)} className={`h-8 px-3 rounded-full text-[14px] font-bold ${sort === s ? "bg-brand text-on-brand" : "bg-surface-card"}`}>{s}</button>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 px-5 mt-4">
        {items.map(({ ref }) => (
          <motion.button key={ref.id} layout whileTap={{ scale: 0.97 }} onClick={() => { feedback(); setOpen(ref); }} className="rounded-[20px] bg-brand text-on-brand p-2.5 text-left flex flex-col">
            {cardArt(ref) && <div className="rounded-[14px] bg-brand-soft aspect-square p-1"><Art svg={cardArt(ref)} className="w-full h-full" /></div>}
            <div className="kicker text-[9px] mt-2 flex items-center gap-1.5 opacity-90"><span className="w-1.5 h-1.5 rounded-full" style={{ background: catBySlug[ref.category].color }} />{ref.id.startsWith("s/") ? "Snack" : "Kerngedanke"}</div>
            <p className="font-display font-black text-[13px] leading-tight mt-1 line-clamp-4">{cardText(ref.card).replace(/\*/g, "")}</p>
          </motion.button>
        ))}
      </div>
      <SavedViewer card={open} onClose={() => setOpen(null)} />
    </>
  );
}

function SavedViewer({ card, onClose }: { card: CardRef | null; onClose: () => void }) {
  const nav = useNavigate();
  const toggleSave = useStore((s) => s.toggleSave);
  return (
    <AnimatePresence>
      {card && (
        <motion.div className="absolute inset-0 z-50 bg-[#08142A]/80 backdrop-blur flex flex-col justify-end pt-safe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="m-4 mb-[max(env(safe-area-inset-bottom),16px)] rounded-card bg-brand text-on-brand p-5" initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }} transition={spring} onClick={(e) => e.stopPropagation()}>
            {cardArt(card) && <div className="mx-auto w-[70%] rounded-[20px] bg-brand-soft aspect-square p-2"><Art svg={cardArt(card)} className="w-full h-full" /></div>}
            <div className="kicker mt-4 text-[#FF6B7F] flex items-center gap-2"><PulseDot size={8} /> {card.source}</div>
            <p className="title text-[22px] leading-tight mt-2">{cardText(card.card).replace(/\*/g, "")}</p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              <Button variant="white" size="md" onClick={async () => shareImage(await renderCardPng({ kicker: card.id.startsWith("s/") ? "Wissens-Snack" : "Kerngedanke", text: cardText(card.card), svg: cardArt(card), source: card.source }))}>Teilen</Button>
              {card.link ? <Button variant="puls" size="md" onClick={() => nav(card.link!)}>Zum Kurs</Button> : <Button variant="soft" size="md" onClick={onClose}>Schließen</Button>}
            </div>
            <button className="w-full mt-3 text-[14px] opacity-70 font-bold" onClick={() => { toggleSave(card.id); onClose(); }}>Aus Sammlung entfernen</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
