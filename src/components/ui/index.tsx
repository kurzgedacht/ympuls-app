import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion";
import confetti from "canvas-confetti";
import { useEffect, useState, type ReactNode } from "react";
import { haptic } from "../../lib/haptics";
import { play } from "../../lib/sound";
import { levelInfo } from "../../lib/levels";
import { spring, GOLD } from "../../brand";
import { useFx } from "../../store/fx";

export const feedback = () => { haptic("light"); play("tap"); };
const cx = (...c: (string | false | undefined | null)[]) => c.filter(Boolean).join(" ");

type BtnProps = HTMLMotionProps<"button"> & { variant?: "primary" | "puls" | "soft" | "ghost" | "white"; size?: "md" | "lg"; children: ReactNode };
export function Button({ variant = "primary", size = "lg", className, onClick, disabled, children, ...rest }: BtnProps) {
  const v = {
    primary: "bg-brand text-on-brand",
    puls: "bg-puls text-on-puls",
    soft: "bg-surface-alt text-ink",
    ghost: "bg-transparent text-ink",
    white: "bg-white text-[#002144]",
  }[variant];
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      transition={spring}
      disabled={disabled}
      onClick={(e) => { if (!disabled) feedback(); onClick?.(e); }}
      className={cx("rounded-full font-display font-extrabold tracking-wide select-none disabled:opacity-40 flex items-center justify-center gap-2",
        size === "lg" ? "h-14 px-6 text-[17px]" : "h-10 px-4 text-[15px]", v, className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export const Card = ({ className, children, ...rest }: HTMLMotionProps<"div"> & { children: ReactNode }) => (
  <motion.div className={cx("rounded-card bg-surface-card shadow-soft", className)} {...rest}>{children}</motion.div>
);

export const Pill = ({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) => (
  <motion.button whileTap={{ scale: 0.94 }} onClick={onClick} className={cx("h-9 px-3 rounded-full bg-surface-card shadow-soft flex items-center gap-1.5 font-display font-black text-[15px] text-ink", className)}>
    {children}
  </motion.button>
);

export const Chip = ({ active, color, children, onClick }: { active?: boolean; color?: string; children: ReactNode; onClick?: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.94 }}
    onClick={() => { feedback(); onClick?.(); }}
    className={cx("h-9 px-4 rounded-full whitespace-nowrap text-[15px] font-bold flex items-center gap-2 shrink-0 border-2 transition-colors",
      active ? "bg-brand text-on-brand border-brand" : "bg-surface-card text-ink border-line")}
  >
    {color && <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />}
    {children}
  </motion.button>
);

export const PulseDot = ({ size = 10, beat, fast, className }: { size?: number; beat?: boolean; fast?: boolean; className?: string }) => (
  <span className={cx("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
    {beat && <span className="absolute inset-0 rounded-full bg-puls ripple" />}
    <span className={cx("absolute inset-0 rounded-full bg-puls", beat && (fast ? "beat-fast" : "beat"))} />
  </span>
);

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <div className={cx("relative h-1.5 rounded-full bg-surface-alt", className)}>
      <motion.div className="absolute inset-y-0 left-0 rounded-full bg-brand dark:bg-on-brand" animate={{ width: `${v * 100}%` }} transition={spring} />
      <motion.span className="absolute top-1/2 w-3.5 h-3.5 -mt-[7px] -ml-[7px] rounded-full bg-puls" animate={{ left: `${v * 100}%` }} transition={spring} />
    </div>
  );
}

export function BottomSheet({ open, onClose, children }: { open: boolean; onClose?: () => void; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="absolute inset-0 z-40 bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            className="absolute inset-x-0 bottom-0 z-50 rounded-t-[28px] bg-surface-card px-5 pt-5 pb-safe shadow-lift"
            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={spring}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export function Toast() {
  const toast = useFx((s) => s.toast);
  const [shown, setShown] = useState<typeof toast>(null);
  useEffect(() => {
    if (!toast) return;
    setShown(toast);
    const t = setTimeout(() => setShown(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);
  return (
    <AnimatePresence>
      {shown && (
        <motion.div key={shown.id} className="absolute left-1/2 z-[70] -translate-x-1/2 pointer-events-none" style={{ top: "max(env(safe-area-inset-top), 12px)" }}
          initial={{ y: -40, opacity: 0 }} animate={{ y: 8, opacity: 1 }} exit={{ y: -40, opacity: 0 }} transition={spring}>
          <div className="flex items-center gap-2 rounded-full bg-brand text-on-brand px-4 h-11 shadow-lift font-bold whitespace-nowrap">
            <PulseDot size={8} /> {shown.text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LevelRing({ xp, size = 40 }: { xp: number; size?: number }) {
  const { level, progress } = levelInfo(xp);
  const r = size / 2 - 3, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`Level ${level}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={4} className="stroke-surface-alt" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={4} strokeLinecap="round" className="stroke-puls"
          strokeDasharray={c} animate={{ strokeDashoffset: c * (1 - progress) }} transition={spring} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display font-black text-[14px]">{level}</span>
    </div>
  );
}

export function GoalRing({ value, size = 120, children }: { value: number; size?: number; children?: ReactNode }) {
  const r = size / 2 - 9, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={12} className="stroke-surface-alt" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={12} strokeLinecap="round" className="stroke-puls"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c * (1 - Math.min(1, value)) }} transition={{ ...spring, stiffness: 120 }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
}

export function PathNode({ state, crown, onClick, label }: { state: "done" | "current" | "locked"; crown?: boolean; onClick?: () => void; label: string }) {
  return (
    <motion.button aria-label={label} whileTap={{ scale: 0.92 }} onClick={() => { feedback(); onClick?.(); }} className="relative flex items-center justify-center w-[76px] h-[76px]">
      {state === "current" && <span className="absolute inset-2 rounded-full bg-puls ripple" />}
      <span className={cx("relative rounded-full flex items-center justify-center shadow-lift",
        state === "done" && "w-16 h-16 bg-brand", state === "current" && "w-[72px] h-[72px] bg-puls beat", state === "locked" && "w-16 h-16 bg-surface-alt")}>
        {state === "done" && <svg width="28" height="28" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        {state === "current" && <span className="w-5 h-5 rounded-full bg-white" />}
        {state === "locked" && <svg width="24" height="24" viewBox="0 0 24 24" className="text-ink-muted"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="currentColor" /><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" strokeWidth="2.4" /></svg>}
      </span>
      {crown && <span className="absolute -top-1 text-[22px]" aria-label="Perfekt">👑</span>}
    </motion.button>
  );
}

/** Confetti in navy, red and gold. */
export function rewardBurst(strength: "small" | "big" = "small") {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#002144", "#D11F3A", GOLD, "#FFFFFF"];
  if (strength === "small") return void confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 }, colors, disableForReducedMotion: true });
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function Chest({ open, onClick }: { open: boolean; onClick?: () => void }) {
  return (
    <motion.button aria-label="Truhe öffnen" onClick={onClick} whileTap={{ scale: 0.92 }}
      animate={open ? { y: 0 } : { rotate: [0, -4, 4, -3, 3, 0], transition: { repeat: Infinity, repeatDelay: 1.6, duration: 0.6 } }}
      className="relative w-24 h-20">
      <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible">
        <rect x="14" y="44" width="92" height="50" rx="10" fill="#002144" />
        <rect x="14" y="62" width="92" height="8" fill={GOLD} />
        <motion.g animate={open ? { rotate: -38, y: -14, x: -6 } : { rotate: 0 }} style={{ originX: "14px", originY: "44px" }} transition={spring}>
          <path d="M14 46 V34 a20 20 0 0 1 20 -20 H86 a20 20 0 0 1 20 20 V46Z" fill="#1D3E6B" stroke="#002144" strokeWidth="4" />
        </motion.g>
        <circle cx="60" cy="62" r="9" fill="#D11F3A" stroke="#fff" strokeWidth="3" />
        {open && <motion.circle cx="60" cy="40" r="6" fill={GOLD} initial={{ scale: 0 }} animate={{ scale: [0, 4, 0], opacity: [1, 0.6, 0] }} transition={{ duration: 0.8 }} />}
      </svg>
    </motion.button>
  );
}

export const SectionTitle = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="flex items-end justify-between px-5 mt-8 mb-3">
    <h2 className="title text-[22px]">{children}</h2>
    {action}
  </div>
);
