import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "quick-parkinson",
  title: "Parkinsons Gesetz",
  subtitle: "Arbeit dehnt sich aus",
  category: "self",
  format: "quick",
  level: 1,
  estMinutes: 2,
  createdAt: "2026-11-25",
  cover: "hourglass",
  hook: "Eine Hausarbeit mit vier Wochen Zeit dauert vier Wochen. Mit vier Tagen dauert sie: vier Tage.",
  sources: ["C. Northcote Parkinson: Parkinson's Law. The Economist (19. November 1955)", "Buehler, Griffin & Ross (1994): Exploring the planning fallacy. Journal of Personality and Social Psychology 67(3)"],
  units: [{ id: "u1", title: "Quick Read", lessons: [{
    slug: "parkinson", title: "Parkinsons Gesetz",
    cards: [
      { type: "title", kicker: "Quick Read", heading: "Parkinsons Gesetz", art: { t: "hero", icon: "hourglass", label: "Zeit füllt sich", icons: ["calendar", "doc"] } },
      { type: "story", text: "Du hast vier Wochen für die Hausarbeit. Drei Wochen passiert *fast nichts*. In der letzten Woche schreibst du alles. Kennst du?", art: { t: "bars", bars: [{ label: "Woche 1", value: 5, display: "5 %" }, { label: "Woche 2", value: 5, display: "5 %" }, { label: "Woche 3", value: 10, display: "10 %" }, { label: "Woche 4", value: 80, display: "80 %" }], hi: 3, title: "Typischer Verlauf" } },
      { type: "story", text: "1955 schrieb der Historiker C. Northcote Parkinson sinngemäß: *Arbeit dehnt sich so weit aus*, wie Zeit dafür da ist. Ursprünglich als Satire über Behörden.", art: { t: "scene", items: [{ icon: "doc", x: 130, y: 200, s: 110 }, { icon: "hourglass", x: 290, y: 200, s: 130, a: true, step: 1 }], labels: [{ text: "Arbeit wächst mit", x: 200, y: 340, step: 2 }] } },
      { type: "story", text: "Dazu passt der *Planungsfehler*: Wir schätzen fast immer zu optimistisch, wie lange etwas dauert. In Studien brauchten Studierende deutlich länger als geplant.", art: { t: "compare", left: { icon: "calendar", label: "Geplant" }, right: { icon: "hourglass", label: "Tatsächlich" }, win: "right" } },
      { type: "estimate", question: "Studierende schätzten ihre Abschlussarbeit auf etwa 34 Tage. Wie lange brauchten sie im Schnitt wirklich?", unit: "Tage", min: 0, max: 100, step: 1, answer: 56, tolerance: 10, explanation: "Rund 56 Tage, also fast doppelt so lange (Buehler et al., 1994). Selbst ihre pessimistische Schätzung wurde meist überschritten." },
      { type: "quiz", kind: "mc", question: "Wie nutzt du Parkinsons Gesetz zu deinem Vorteil?", options: ["Möglichst viel Zeit einplanen", "Kürzere, selbst gesetzte Deadlines mit Puffer davor", "Gar keine Deadlines", "Alles am letzten Tag machen"], correct: 1, explanation: "Eine eigene, frühere Deadline nutzt den Druck, ohne dass es knapp wird. Der Puffer fängt den Planungsfehler ab." },
      { type: "insight", text: "Gib Aufgaben weniger Zeit, als du denkst. Und plane den Puffer bewusst dahinter.", art: { t: "ba", before: { icon: "calendar", label: "4 Wochen Zeit" }, after: { icon: "flag", label: "Eigene Deadline" } } },
      { type: "story", text: "Probier's aus: Nimm dir eine Aufgabe für heute und stell einen Timer auf *die Hälfte* der Zeit, die du eingeplant hättest. Wie weit kommst du?", art: { t: "number", value: "÷ 2", label: "Timer halbieren", icon: "clock" } },
      { type: "recap", bullets: ["Arbeit dehnt sich auf die verfügbare Zeit aus.", "Wir planen fast immer zu optimistisch.", "Eigene frühe Deadlines mit Puffer helfen."] },
    ],
  }] }],
  snacks: [{ id: "planungsfehler", kind: "quiz", card: { type: "estimate", question: "Studierende planten 34 Tage für ihre Abschlussarbeit. Wie viele brauchten sie im Schnitt?", unit: "Tage", min: 0, max: 100, step: 1, answer: 56, tolerance: 10, explanation: "Rund 56 Tage (Buehler et al., 1994). Wir unterschätzen Zeitbedarf fast immer." } }],
});
