import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useStore } from "./store/useStore";
import { setHapticsEnabled } from "./lib/haptics";
import { setSoundEnabled } from "./lib/sound";
import { TabBar } from "./components/TabBar";
import { RewardLayer } from "./components/RewardLayer";
import { Toast } from "./components/ui";
import Today from "./screens/Today";
import Feed from "./screens/Feed";
import Explore from "./screens/Explore";
import Library from "./screens/Library";
import Profile from "./screens/Profile";
import CourseDetail from "./screens/CourseDetail";
import Player from "./screens/Player";
import Review from "./screens/Review";
import WeekRecap from "./screens/WeekRecap";
import Onboarding from "./screens/Onboarding";

const TABS = ["/", "/feed", "/entdecken", "/bibliothek", "/profil"];

function useTheme() {
  const theme = useStore((s) => s.settings.theme);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const dark = theme === "dark" || (theme === "system" && mq.matches);
      document.documentElement.classList.toggle("dark", dark);
      document.querySelectorAll('meta[name="theme-color"]').forEach((m) => m.setAttribute("content", dark ? "#08142A" : "#F5F6F8"));
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [theme]);
}

export default function App() {
  const loc = useLocation();
  const { onboarded, settings, startOfDay } = useStore();
  useTheme();
  useEffect(() => { setSoundEnabled(settings.sound); setHapticsEnabled(settings.haptics); }, [settings.sound, settings.haptics]);
  useEffect(() => {
    startOfDay();
    const onVis = () => document.visibilityState === "visible" && startOfDay();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [startOfDay]);

  if (!onboarded) return <><Onboarding /><Toast /></>;
  const isTab = TABS.includes(loc.pathname);
  return (
    <div className="relative h-full">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div key={isTab ? "tabs" : loc.pathname} className="absolute inset-0"
          initial={isTab ? { opacity: 0 } : { x: "100%" }} animate={{ x: 0, opacity: 1 }} exit={isTab ? { opacity: 0 } : { x: "100%" }}
          transition={{ type: "spring", stiffness: 420, damping: 40 }}>
          <Routes location={loc}>
            <Route path="/" element={<Today />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/entdecken" element={<Explore />} />
            <Route path="/bibliothek" element={<Library />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/kurs/:slug" element={<CourseDetail />} />
            <Route path="/lektion/:course/:lesson" element={<Player />} />
            <Route path="/tages/:date" element={<Player />} />
            <Route path="/wiederholen" element={<Review />} />
            <Route path="/woche" element={<WeekRecap />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
      {isTab && <TabBar dark={loc.pathname === "/feed"} />}
      <RewardLayer />
      <Toast />
    </div>
  );
}
