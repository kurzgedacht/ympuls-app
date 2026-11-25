import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "../store/useStore";
import { categories, spring, type CategorySlug } from "../brand";
import { Button, Chip, PulseDot } from "../components/ui";
import wordmarkInverse from "../../brand/ympuls-wordmark-inverse.svg";

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [favs, setFavs] = useState<CategorySlug[]>([]);
  const [goal, setGoal] = useState<5 | 10 | 15>(10);
  const { set, setSettings } = useStore();
  const finish = () => { setSettings({ favorites: favs, goal }); set({ onboarded: true }); };

  return (
    <div className={`h-full flex flex-col pt-safe pb-safe px-5 ${step === 0 ? "bg-brand text-on-brand" : "bg-ground"}`}>
      <div className="flex gap-1.5 justify-center mt-3">{[0, 1, 2].map((i) => <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-puls" : "w-1.5 bg-current opacity-30"}`} />)}</div>
      <AnimatePresence mode="wait">
        <motion.div key={step} className="flex-1 flex flex-col" initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -40, opacity: 0 }} transition={spring}>
          {step === 0 && (
            <div className="flex-1 flex flex-col justify-center">
              <img src={wordmarkInverse} alt="YMPULS." className="w-56 mb-10" />
              <h1 className="title text-[40px]">Scrollen,<br />aber schlauer.</h1>
              <p className="text-[19px] mt-4 opacity-90 leading-snug">2-Minuten-Wissen in Bildern. Finanzen, Training, Business, Bücher. Jeden Tag ein kleiner Puls fürs Gehirn.</p>
              <div className="flex items-center gap-2 mt-8 kicker"><PulseDot beat /> Der rote Punkt ist dein Puls</div>
            </div>
          )}
          {step === 1 && (
            <div className="flex-1 pt-10">
              <h1 className="title text-[32px]">Was interessiert dich am meisten?</h1>
              <p className="text-ink-muted mt-2 text-[17px]">Dein Feed zeigt davon mehr. Du kannst das später ändern.</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {categories.map((c) => (
                  <Chip key={c.slug} color={c.color} active={favs.includes(c.slug)} onClick={() => setFavs((f) => (f.includes(c.slug) ? f.filter((x) => x !== c.slug) : [...f, c.slug]))}>{c.label}</Chip>
                ))}
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="flex-1 pt-10">
              <h1 className="title text-[32px]">Wie viel Zeit am Tag?</h1>
              <p className="text-ink-muted mt-2 text-[17px]">Weniger als eine Instagram-Pause. Versprochen.</p>
              <div className="flex flex-col gap-3 mt-6">
                {([5, 10, 15] as const).map((g) => (
                  <motion.button key={g} whileTap={{ scale: 0.97 }} onClick={() => setGoal(g)}
                    className={`h-16 rounded-2xl px-5 flex items-center justify-between text-[18px] font-bold border-2 ${goal === g ? "bg-brand text-on-brand border-brand" : "bg-surface-card border-line"}`}>
                    <span>{g} Minuten</span><span className="text-[15px] opacity-75">{g === 5 ? "Locker" : g === 10 ? "Regelmäßig" : "Ehrgeizig"}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <Button variant="puls" onClick={() => (step < 2 ? setStep(step + 1) : finish())}>{step === 0 ? "Los geht's" : step === 1 ? (favs.length ? "Weiter" : "Überspringen") : "Starten"}</Button>
    </div>
  );
}
