import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { courses, courseBySlug, dailyFor, lessonOf, coverSvg, artSvg, isNew } from "../content";
import { useStore, dayOf, today, weekRecapDue } from "../store/useStore";
import { greeting } from "../lib/dates";
import { dueIds } from "../lib/srs";
import { CHEST_CARDS, type ChestReward } from "../lib/rewards";
import { haptic } from "../lib/haptics";
import { play } from "../lib/sound";
import { catBySlug, spring } from "../brand";
import { BottomSheet, Button, Card, Chest, GoalRing, LevelRing, PathNode, Pill, PulseDot, SectionTitle, feedback, rewardBurst } from "../components/ui";
import { Art } from "../components/Art";
import { CourseTile, courseProgress } from "../components/CourseTile";
import wordmark from "../../brand/ympuls-wordmark.svg";
import wordmarkInverse from "../../brand/ympuls-wordmark-inverse.svg";

export default function Today() {
  const nav = useNavigate();
  const s = useStore();
  const d = dayOf(s);
  const [goalSheet, setGoalSheet] = useState(false);
  const minutes = Math.floor(d.sec / 60);
  const due = dueIds(s.srs, today()).length;
  const daily = dailyFor();
  const current = (s.lastCourse && courseBySlug[s.lastCourse]) || courses.find((c) => (s.progress[c.slug] ?? []).length && courseProgress(c, s.progress).next) || courses.find((c) => c.format === "course") || courses[0];
  const fresh = courses.filter((c) => c.slug !== current?.slug).sort((a, b) => Number(s.settings.favorites.includes(b.category)) - Number(s.settings.favorites.includes(a.category)) || Number(isNew(b)) - Number(isNew(a))).slice(0, 8);

  return (
    <div className="h-full scroll pb-28 pt-safe">
      <header className="px-5 pt-2 flex items-center gap-2">
        <img src={wordmark} alt="YMPULS." className="h-[18px] dark:hidden" />
        <img src={wordmarkInverse} alt="YMPULS." className="h-[18px] hidden dark:block" />
        <div className="flex-1" />
        <Pill onClick={() => nav("/profil")}><PulseDot size={10} beat={s.streak.count > 0} />{s.streak.count}</Pill>
        <Pill onClick={() => nav("/profil")}><span className="text-gold">◆</span>{s.xp}</Pill>
        <button onClick={() => nav("/profil")} aria-label="Level"><LevelRing xp={s.xp} /></button>
      </header>
      <h1 className="title text-[32px] px-5 mt-5">{greeting()}!</h1>
      {Date.now() < s.boostUntil && <div className="mx-5 mt-3 rounded-full bg-gold/20 px-4 py-2 font-bold text-[15px]">⚡ Doppelte Puls aktiv – noch {Math.ceil((s.boostUntil - Date.now()) / 60000)} Min</div>}

      <div className="px-5 mt-5">
        <Card className="p-4 flex items-center gap-4" whileTap={{ scale: 0.98 }} onClick={() => { feedback(); setGoalSheet(true); }}>
          <GoalRing value={d.sec / (s.settings.goal * 60)} size={84}>
            <span className="title text-[22px]">{minutes}</span>
            <span className="text-[11px] font-bold text-ink-muted -mt-0.5">von {s.settings.goal}</span>
          </GoalRing>
          <div>
            <div className="kicker text-ink-muted">Tagesziel</div>
            <div className="font-display font-black text-[18px] leading-tight mt-1">{minutes >= s.settings.goal ? "Geschafft! 🎯" : `${minutes} von ${s.settings.goal} Min`}</div>
            <div className="text-[13px] text-ink-muted mt-0.5">Antippen zum Ändern</div>
          </div>
        </Card>
      </div>

      <DailyChest />

      {weekRecapDue(s) && (
        <Card className="mx-5 mt-3 p-4 flex items-center gap-3 bg-brand text-on-brand" whileTap={{ scale: 0.98 }} onClick={() => { feedback(); nav("/woche"); }}>
          <span className="text-[30px]">📊</span>
          <div className="flex-1"><div className="font-display font-black text-[18px]">Deine Woche ist da</div><div className="text-[14px] opacity-80">5 Karten Rückblick · Teilen als Bild</div></div>
          <span className="text-[22px]">→</span>
        </Card>
      )}

      {due > 0 && (
        <Card className="mx-5 mt-3 p-4 flex items-center gap-3" whileTap={{ scale: 0.98 }} onClick={() => { feedback(); nav("/wiederholen"); }}>
          <span className="w-12 h-12 rounded-2xl bg-brand-soft flex items-center justify-center text-[24px]">🧠</span>
          <div className="flex-1"><div className="font-display font-black text-[18px]">Wiederholen</div><div className="text-[14px] text-ink-muted">{due} {due === 1 ? "Frage" : "Fragen"} fällig · ca. {Math.max(1, Math.round(due / 3))} Min</div></div>
          <span className="h-9 px-4 rounded-full bg-puls text-white font-bold flex items-center">Los</span>
        </Card>
      )}

      {current && <PathSection courseSlug={current.slug} />}

      {daily && (
        <>
          <SectionTitle>Tageslektion</SectionTitle>
          <DailyCover daily={daily} />
        </>
      )}

      <SectionTitle action={<button className="text-[15px] font-bold text-puls-text" onClick={() => nav("/entdecken")}>Alle</button>}>Neu für dich</SectionTitle>
      <div className="flex gap-3 overflow-x-auto px-5 pb-2 scroll">
        {fresh.map((c) => <CourseTile key={c.slug} course={c} wide />)}
        {!fresh.length && <p className="text-ink-muted">Bald kommen mehr Kurse dazu.</p>}
      </div>

      <BottomSheet open={goalSheet} onClose={() => setGoalSheet(false)}>
        <h3 className="title text-[24px]">Tagesziel</h3>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {([5, 10, 15] as const).map((g) => (
            <Button key={g} variant={s.settings.goal === g ? "primary" : "soft"} onClick={() => { s.setSettings({ goal: g }); setGoalSheet(false); }}>{g} Min</Button>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
}

function DailyCover({ daily }: { daily: NonNullable<ReturnType<typeof dailyFor>> }) {
  const nav = useNavigate();
  const title = daily.kind === "daily" ? daily.lesson.title : lessonOf(daily.course.slug, daily.lesson)?.title ?? daily.course.title;
  const cat = daily.kind === "daily" ? daily.lesson.category : daily.course.category;
  const first = daily.kind === "daily" ? daily.lesson.cards[0] : lessonOf(daily.course.slug, daily.lesson)?.cards[0];
  const svg = daily.kind === "daily" ? artSvg("/content/daily", first && "art" in first ? first.art : undefined) : coverSvg(daily.course.slug);
  const to = daily.kind === "daily" ? `/tages/${daily.date}` : `/lektion/${daily.course.slug}/${daily.lesson}`;
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={() => { feedback(); nav(to); }} className="relative mx-5 w-[calc(100%-40px)] min-h-[190px] rounded-card overflow-hidden shadow-lift text-left block" style={{ background: catBySlug[cat].color }}>
      <div className="absolute right-3 top-3 bottom-3 aspect-square rounded-[18px] overflow-hidden bg-brand-soft"><Art svg={svg} keep={daily.kind !== "daily"} className="w-full h-full" /></div>
      <div className="relative p-5 pr-[52%] text-white flex flex-col min-h-[190px]">
        <div className="kicker opacity-90 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white" /> Heute · 2 Min</div>
        <div className="title text-[22px] mt-2 leading-tight">{title}</div>
        <div className="mt-auto pt-4"><span className="inline-flex h-10 px-5 rounded-full bg-white text-[#002144] font-display font-extrabold items-center">Lesen →</span></div>
      </div>
    </motion.button>
  );
}

const NONE: string[] = []; // stable fallback: a fresh [] inside a selector re-renders forever
const ZIG = [0, 70, 100, 70, 0, -70, -100, -70];
function PathSection({ courseSlug }: { courseSlug: string }) {
  const nav = useNavigate();
  const loc = useLocation() as { state?: { justFinished?: string } };
  const course = courseBySlug[courseSlug];
  const progress = useStore((s) => s.progress[courseSlug]) ?? NONE;
  const perfect = useStore((s) => s.perfect);
  const [open, setOpen] = useState<string | null>(null);
  const cat = catBySlug[course.category];
  const { next, done, total } = courseProgress(course, { [courseSlug]: progress });
  const justUnlocked = loc.state?.justFinished?.startsWith(`c/${courseSlug}/`);
  let i = -1;
  return (
    <>
      <SectionTitle action={<button className="text-[15px] font-bold text-puls-text" onClick={() => nav(`/kurs/${courseSlug}`)}>Kurs</button>}>Weiterlernen</SectionTitle>
      <div className="px-5 -mt-1 mb-2 text-ink-muted text-[15px]">{course.title} · {done}/{total} Lektionen</div>
      {course.units.map((u, ui) => {
        const unitDone = u.lessons.every((l) => progress.includes(l));
        return (
          <div key={u.id} className="px-5">
            <div className="rounded-[18px] px-4 py-3 mt-3 flex items-center gap-3 text-white" style={{ background: cat.color }}>
              <div className="flex-1"><div className="kicker opacity-80">Unit {ui + 1}</div><div className="font-display font-black text-[17px] leading-tight">{u.title}</div></div>
              {unitDone && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} className="text-[26px]">🏅</motion.span>}
            </div>
            <div className="flex flex-col items-center py-3 gap-1">
              {u.lessons.map((l) => {
                i++;
                const state = progress.includes(l) ? "done" : l === next ? "current" : "locked";
                const title = lessonOf(courseSlug, l)?.title ?? l;
                return (
                  <div key={l} className={`relative ${open === l ? "z-30" : ""}`} style={{ transform: `translateX(${ZIG[i % ZIG.length]}px)` }}>
                    <motion.div initial={state === "current" && justUnlocked ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ ...spring, stiffness: 300, damping: 12, delay: 0.4 }}>
                      <PathNode label={title} state={state} crown={perfect.includes(`${courseSlug}/${l}`)} onClick={() => setOpen(open === l ? null : l)} />
                    </motion.div>
                    <AnimatePresence>
                      {open === l && (
                        <motion.div initial={{ opacity: 0, y: -6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={spring}
                          className="absolute z-20 top-[84px] w-[260px] rounded-[22px] bg-brand text-on-brand p-4 shadow-lift" style={{ left: `calc(50% - 130px - ${ZIG[i % ZIG.length]}px)` }}>
                          <span className="absolute -top-2 w-4 h-4 rotate-45 bg-brand" style={{ left: `calc(50% - 8px + ${ZIG[i % ZIG.length]}px)` }} />
                          <div className="font-display font-black text-[18px] leading-tight">{title}</div>
                          <div className="text-[14px] opacity-80 mt-1">~2 Min · {state === "done" ? "Erledigt" : state === "locked" ? "Noch gesperrt" : "Bereit"}</div>
                          <Button variant={state === "locked" ? "soft" : "puls"} size="md" className="w-full mt-3" disabled={state === "locked"} onClick={() => nav(`/lektion/${courseSlug}/${l}`)}>
                            {state === "done" ? "Nochmal" : state === "locked" ? "🔒 Erst die vorige" : "Los"}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

function DailyChest() {
  const s = useStore();
  const d = dayOf(s);
  const [reward, setReward] = useState<ChestReward | null>(null);
  const [opening, setOpening] = useState(false);
  const available = d.lessons > 0 && s.chestDay !== today();
  if (!available && !reward) {
    if (s.chestDay === today()) return null;
    return (
      <div className="mx-5 mt-3 rounded-card border-2 border-dashed border-line p-4 flex items-center gap-3 text-ink-muted">
        <span className="text-[28px] grayscale opacity-60">🎁</span>
        <span className="text-[15px] font-bold">Nach deiner ersten Lektion heute wartet die Tagestruhe.</span>
      </div>
    );
  }
  const open = () => {
    if (opening || reward) return;
    setOpening(true);
    haptic("heavy"); play("beat");
    setTimeout(() => {
      const r = useStore.getState().openChest();
      setReward(r);
      haptic("success"); play(r.rarity === "normal" ? "reward" : "levelup");
      rewardBurst(r.rarity === "normal" ? "small" : "big");
    }, 700);
  };
  const rarityColor = { normal: "bg-surface-alt text-ink", selten: "bg-[#2F7FD8] text-white", episch: "bg-gold text-[#002144]" };
  const text = reward && (reward.kind === "puls" ? `+${reward.amount} Puls` : reward.kind === "boost" ? `Doppelte Puls für ${reward.minutes} Min` : reward.kind === "freeze" ? "Streak-Schutz +1" : `Sammelkarte: ${CHEST_CARDS.find((c) => c.id === reward.id)?.title}`);
  return (
    <Card className="mx-5 mt-3 p-4 flex items-center gap-4 overflow-hidden" whileTap={{ scale: 0.98 }} onClick={open}>
      <Chest open={opening} />
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {reward ? (
            <motion.div key="r" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ...spring, stiffness: 300, damping: 14 }}>
              <span className={`kicker text-[10px] rounded-full px-2 py-1 ${rarityColor[reward.rarity]}`}>{reward.rarity}</span>
              <div className="font-display font-black text-[19px] leading-tight mt-2">{text}</div>
            </motion.div>
          ) : (
            <motion.div key="c" exit={{ opacity: 0 }}>
              <div className="kicker text-puls-text">Tagestruhe</div>
              <div className="font-display font-black text-[19px] leading-tight mt-1">Antippen und öffnen!</div>
              <div className="text-[13px] text-ink-muted">Normal · Selten · Episch</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

