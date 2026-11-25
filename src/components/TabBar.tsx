import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { IconHome, IconFeed, IconCompass, IconLibrary, IconUser } from "./Icons";
import { feedback } from "./ui";
import { spring } from "../brand";

const tabs = [
  { to: "/", label: "Heute", Icon: IconHome },
  { to: "/feed", label: "Feed", Icon: IconFeed },
  { to: "/entdecken", label: "Entdecken", Icon: IconCompass },
  { to: "/bibliothek", label: "Bibliothek", Icon: IconLibrary, id: "tab-library" },
  { to: "/profil", label: "Profil", Icon: IconUser },
];

export function TabBar({ dark }: { dark?: boolean }) {
  return (
    <nav className={`absolute inset-x-0 bottom-0 z-30 pb-safe pt-1.5 border-t ${dark ? "bg-[#08142A]/95 border-white/10 text-white" : "bg-surface-card/95 border-line text-ink"} backdrop-blur`}>
      <ul className="flex">
        {tabs.map(({ to, label, Icon, id }) => (
          <li key={to} className="flex-1">
            <NavLink to={to} end id={id} onClick={feedback} className="flex flex-col items-center gap-0.5 pt-1 no-select">
              {({ isActive }) => (
                <>
                  <Icon size={25} className={isActive ? "" : "opacity-55"} />
                  <span className={`text-[11px] font-bold ${isActive ? "" : "opacity-60"}`}>{label}</span>
                  <span className="h-1.5">{isActive && <motion.span layoutId="tabdot" transition={spring} className="block w-1.5 h-1.5 rounded-full bg-puls" />}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
