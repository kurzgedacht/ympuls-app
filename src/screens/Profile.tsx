import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { useStore, today, initialState, type State } from "../store/useStore";
import { fx } from "../store/fx";
import { levelInfo } from "../lib/levels";
import { lastNDays } from "../lib/dates";
import { BADGES, CHEST_CARDS } from "../lib/rewards";
import { reminderIcs } from "../lib/ics";
import { courses, coverSvg } from "../content";
import { categories, GOLD } from "../brand";
import { Art } from "../components/Art";
import { BottomSheet, Button, Card, Chip, LevelRing, PulseDot, SectionTitle, feedback } from "../components/ui";

const download = (name: string, text: string, type: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
};

export default function Profile() {
  const s = useStore();
  const info = levelInfo(s.xp);
  const week = lastNDays(today(), 7);
  const mins = week.map((d) => Math.round((s.days[d]?.sec ?? 0) / 60));
  const max = Math.max(s.settings.goal, ...mins);
  const album = [...courses].sort((a, b) => a.createdAt.localeCompare(b.createdAt) || a.slug.localeCompare(b.slug));
  const [time, setTime] = useState("18:30");
  const [confirmReset, setConfirmReset] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const exportBackup = () => {
    const { set: _a, setSettings: _b, ...rest } = useStore.getState() as unknown as Record<string, unknown>;
    const data = Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== "function"));
    download(`ympuls-backup-${today()}.json`, JSON.stringify({ app: "YMPULS.", version: 1, exportedAt: new Date().toISOString(), state: data }, null, 2), "application/json");
    fx.toast("Backup gespeichert");
  };
  const importBackup = async (file: File) => {
    try {
      const json = JSON.parse(await file.text());
      const st = json?.state;
      // Trust boundary: only accept a YMPULS. backup with the expected basic shape, keep unknown keys out.
      if (json?.app !== "YMPULS." || typeof st !== "object" || typeof st.xp !== "number" || typeof st.progress !== "object") throw new Error("shape");
      const clean = Object.fromEntries(Object.keys(initialState).filter((k) => k in st).map((k) => [k, st[k]])) as Partial<State>;
      s.set({ ...clean, onboarded: true });
      fx.toast("Backup geladen");
    } catch {
      fx.toast("Das ist kein gültiges YMPULS.-Backup");
    }
  };

  return (
    <div className="h-full scroll pb-28 pt-safe">
      <h1 className="title text-[32px] px-5 pt-3">Profil</h1>

      <Card className="mx-5 mt-4 p-5 flex items-center gap-4">
        <LevelRing xp={s.xp} size={72} />
        <div className="flex-1">
          <div className="kicker text-puls-text">Level {info.level}</div>
          <div className="title text-[24px]">{info.title}</div>
          <div className="text-[14px] text-ink-muted mt-1">{info.next > info.start ? `${info.next - s.xp} Puls bis Level ${info.level + 1}` : "Höchstes Level erreicht"}</div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-2 mx-5 mt-3">
        {[["Puls", s.xp], ["Lektionen", s.totals.lessons], ["Bester Streak", s.streak.best]].map(([l, v]) => (
          <Card key={l} className="p-3 text-center"><div className="title text-[24px]">{v}</div><div className="text-[12px] font-bold text-ink-muted">{l}</div></Card>
        ))}
      </div>

      <SectionTitle>Lernminuten (7 Tage)</SectionTitle>
      <Card className="mx-5 p-4">
        <div className="flex items-end gap-2 h-28 relative">
          <div className="absolute inset-x-0 border-t-2 border-dashed border-puls/40" style={{ bottom: `${(s.settings.goal / max) * 100}%` }} />
          {mins.map((m, i) => (
            <div key={week[i]} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
              <span className="text-[11px] font-bold text-ink-muted">{m || ""}</span>
              <motion.div initial={{ height: 0 }} animate={{ height: `${(m / max) * 80}%` }} className={`w-full rounded-t-lg ${m >= s.settings.goal ? "bg-puls" : "bg-brand dark:bg-brand-strong"}`} style={{ minHeight: 3 }} />
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-1">{week.map((d) => <span key={d} className="flex-1 text-center text-[11px] font-bold text-ink-muted">{"MDMDFSS"[(new Date(d).getUTCDay() + 6) % 7]}</span>)}</div>
        <div className="text-[13px] text-ink-muted mt-2">Gestrichelt: dein Tagesziel ({s.settings.goal} Min) · {s.totals.correct} Fragen richtig</div>
      </Card>

      <SectionTitle action={<span className="text-[14px] font-bold text-ink-muted">{s.collection.filter((c) => !c.startsWith("bonus-")).length} / {album.length}</span>}>Sammelalbum</SectionTitle>
      <div className="grid grid-cols-3 gap-2 px-5">
        {album.map((c, i) => {
          const owned = s.collection.includes(c.slug);
          return (
            <div key={c.slug} className={`rounded-[14px] p-1.5 ${owned ? "shadow-lift" : "bg-surface-alt"}`} style={owned ? { background: `linear-gradient(135deg, ${GOLD}, #fff6e0 50%, ${GOLD})` } : undefined}>
              <div className={`rounded-[10px] overflow-hidden aspect-square ${owned ? "" : "grayscale opacity-25"}`}><Art svg={coverSvg(c.slug)} keep className="w-full h-full" /></div>
              <div className={`text-[10px] font-bold mt-1 px-0.5 truncate ${owned ? "text-[#002144]" : "text-ink-muted"}`}>#{i + 1} {owned ? c.title : "???"}</div>
            </div>
          );
        })}
      </div>
      <div className="px-5 mt-4 kicker text-ink-muted">Truhen-Karten · {s.collection.filter((c) => c.startsWith("bonus-")).length} / {CHEST_CARDS.length}</div>
      <div className="flex gap-2 px-5 mt-2 overflow-x-auto scroll pb-1">
        {CHEST_CARDS.map((c) => {
          const owned = s.collection.includes(c.id);
          return (
            <div key={c.id} className={`shrink-0 w-24 rounded-[14px] p-2 text-center ${owned ? "bg-brand text-on-brand" : "bg-surface-alt text-ink-muted"}`}>
              <div className={`text-[28px] ${owned ? "" : "grayscale opacity-30"}`}>{c.icon}</div>
              <div className="text-[11px] font-bold leading-tight mt-1">{owned ? c.title : "Episch"}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle action={<span className="text-[14px] font-bold text-ink-muted">{Object.keys(s.badges).length} / {BADGES.length}</span>}>Abzeichen</SectionTitle>
      <div className="grid grid-cols-4 gap-2 px-5">
        {BADGES.map((b) => {
          const owned = !!s.badges[b.id];
          return (
            <button key={b.id} onClick={() => fx.toast(`${b.title}: ${b.desc}`)} className={`rounded-2xl p-2 aspect-square flex flex-col items-center justify-center text-center ${owned ? "bg-surface-card shadow-soft" : "bg-surface-alt"}`}>
              <span className={`text-[26px] ${owned ? "" : "grayscale opacity-30"}`}>{b.icon}</span>
              <span className={`text-[10px] font-bold leading-tight mt-1 ${owned ? "" : "text-ink-muted"}`}>{b.title}</span>
            </button>
          );
        })}
      </div>

      <SectionTitle>Lieblingskategorien</SectionTitle>
      <p className="px-5 -mt-2 mb-3 text-[14px] text-ink-muted">Davon zeigt dein Feed mehr.</p>
      <div className="flex flex-wrap gap-2 px-5">
        {categories.map((c) => (
          <Chip key={c.slug} color={c.color} active={s.settings.favorites.includes(c.slug)}
            onClick={() => s.setSettings({ favorites: s.settings.favorites.includes(c.slug) ? s.settings.favorites.filter((x) => x !== c.slug) : [...s.settings.favorites, c.slug] })}>{c.label}</Chip>
        ))}
      </div>

      <SectionTitle>Einstellungen</SectionTitle>
      <Card className="mx-5 divide-y divide-line">
        <Row label="Tagesziel">
          <Segment value={String(s.settings.goal)} options={["5", "10", "15"]} labels={["5", "10", "15 Min"]} onChange={(v) => s.setSettings({ goal: Number(v) as 5 | 10 | 15 })} />
        </Row>
        <Row label="Darstellung">
          <Segment value={s.settings.theme} options={["system", "light", "dark"]} labels={["System", "Hell", "Dunkel"]} onChange={(v) => s.setSettings({ theme: v as State["settings"]["theme"] })} />
        </Row>
        <Row label="Ton"><Toggle on={s.settings.sound} onChange={(v) => s.setSettings({ sound: v })} /></Row>
        <Row label="Haptik"><Toggle on={s.settings.haptics} onChange={(v) => s.setSettings({ haptics: v })} /></Row>
      </Card>

      <SectionTitle>Lernzeit-Erinnerung</SectionTitle>
      <Card className="mx-5 p-4">
        <p className="text-[15px] text-ink-muted">Eine tägliche Kalender-Serie mit Hinweis. Öffnet direkt im iOS-Kalender.</p>
        <div className="flex gap-2 mt-3 items-center">
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="h-12 rounded-full bg-surface-alt px-4 text-[17px] font-bold outline-none" aria-label="Uhrzeit" />
          <Button size="md" className="flex-1 h-12" onClick={() => download("ympuls-lernzeit.ics", reminderIcs(time), "text/calendar")}>📅 Als .ics laden</Button>
        </div>
      </Card>

      <SectionTitle>Daten</SectionTitle>
      <Card className="mx-5 p-4 flex flex-col gap-2">
        <Button variant="soft" size="md" onClick={exportBackup}>Backup exportieren</Button>
        <Button variant="soft" size="md" onClick={() => fileRef.current?.click()}>Backup importieren</Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) importBackup(f); e.target.value = ""; }} />
        {s.notes.length > 0 && <p className="text-[13px] text-ink-muted">{s.notes.length} notierte Fehler sind im Backup enthalten.</p>}
        <Button variant="ghost" size="md" className="!text-puls-text" onClick={() => setConfirmReset(true)}>Fortschritt zurücksetzen</Button>
      </Card>

      <div className="flex flex-col items-center mt-10 text-ink-muted text-[13px] gap-1"><PulseDot size={8} beat />YMPULS. · nur für dich, ohne Tracking</div>

      <BottomSheet open={confirmReset} onClose={() => setConfirmReset(false)}>
        <h3 className="title text-[24px]">Wirklich alles zurücksetzen?</h3>
        <p className="text-ink-muted mt-2">Puls, Streak, Fortschritt, Sammlung und Abzeichen werden gelöscht. Tipp: Vorher ein Backup exportieren.</p>
        <div className="grid grid-cols-2 gap-2 mt-5">
          <Button variant="soft" onClick={() => setConfirmReset(false)}>Abbrechen</Button>
          <Button variant="puls" onClick={() => { s.reset(); setConfirmReset(false); fx.toast("Zurückgesetzt"); }}>Löschen</Button>
        </div>
      </BottomSheet>
    </div>
  );
}

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-3 px-4 min-h-[56px]"><span className="font-bold">{label}</span>{children}</div>
);
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button role="switch" aria-checked={on} onClick={() => { feedback(); onChange(!on); }} className={`w-[52px] h-8 rounded-full p-1 transition-colors ${on ? "bg-puls" : "bg-surface-alt"}`}>
      <motion.span layout className={`block w-6 h-6 rounded-full bg-white shadow ${on ? "ml-auto" : ""}`} />
    </button>
  );
}
function Segment({ value, options, labels, onChange }: { value: string; options: string[]; labels: string[]; onChange: (v: string) => void }) {
  return (
    <div className="flex rounded-full bg-surface-alt p-1">
      {options.map((o, i) => (
        <button key={o} onClick={() => { feedback(); onChange(o); }} className={`h-8 px-3 rounded-full text-[14px] font-bold ${value === o ? "bg-brand text-on-brand" : ""}`}>{labels[i]}</button>
      ))}
    </div>
  );
}
