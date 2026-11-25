import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "quick-pareto",
  title: "Das Pareto-Prinzip",
  subtitle: "80/20: Wenig Ursache, viel Wirkung",
  category: "business",
  format: "quick",
  level: 1,
  estMinutes: 2,
  createdAt: "2026-11-25",
  cover: "spread",
  hook: "Ein kleiner Teil deiner Arbeit bringt den Großteil deiner Ergebnisse. Die Frage ist nur: welcher?",
  sources: ["Vilfredo Pareto: Cours d'économie politique (1896)", "Joseph M. Juran: Quality Control Handbook (1951) – the vital few", "Richard Koch: The 80/20 Principle (1997)"],
  units: [{ id: "u1", title: "Quick Read", lessons: [{
    slug: "pareto", title: "Das Pareto-Prinzip",
    cards: [
      { type: "title", kicker: "Quick Read", heading: "Das Pareto-Prinzip", art: { t: "hero", icon: "spread", label: "80/20", icons: ["target", "chart"] } },
      { type: "story", text: "Um 1900 bemerkte der Ökonom Vilfredo Pareto: In Italien gehörte rund *80 % des Landes* etwa 20 % der Menschen. Später fand man ähnliche Muster überall.", art: { t: "dots", total: 20, hi: 4, label: "20 % besitzen 80 %" } },
      { type: "story", text: "Daraus wurde eine Faustregel: *Wenige Ursachen* erzeugen den Großteil der Wirkung. Ein paar Kunden bringen den meisten Umsatz. Ein paar Übungen den meisten Fortschritt.", art: { t: "bars", bars: [{ label: "20 % Einsatz", value: 80, display: "80 %" }, { label: "80 % Einsatz", value: 20, display: "20 %" }], hi: 0, title: "Wirkung" } },
      { type: "story", text: "Wichtig: *80/20 ist keine exakte Zahl*. Mal ist es 90/10, mal 70/30. Die Botschaft ist die Schieflage: Nicht alles ist gleich wichtig.", art: { t: "zoom", icon: "chart", label: "Faustregel", detail: "≈ 80/20" } },
      { type: "swipe", question: "Typisch 80/20? Rechts für ja.", statements: [{ text: "Wenige Stammkunden bringen den Großteil des Umsatzes.", true: true }, { text: "Jede Aufgabe auf der To-do-Liste ist gleich wichtig.", true: false }, { text: "Ein paar Grundübungen bringen den meisten Kraftzuwachs.", true: true }], explanation: "Im Training sind es oft Kniebeuge, Kreuzheben, Drücken und Ziehen. Im Business die besten Kunden. Gleich wichtig ist fast nie etwas." },
      { type: "quiz", kind: "mc", question: "Was ist die wichtigste Lehre des Pareto-Prinzips?", options: ["Immer genau 80 % arbeiten", "Die wenigen wirksamsten Dinge finden und priorisieren", "20 % der Arbeit weglassen", "Nur Reiche profitieren"], correct: 1, explanation: "Es geht ums Priorisieren. Wer das Wichtigste zuerst macht, holt aus derselben Zeit viel mehr raus." },
      { type: "insight", text: "Nicht alles zählt gleich. Finde die wenigen Dinge, die den Großteil bewirken, und mach sie zuerst.", art: { t: "scale", left: { icon: "target", label: "Die wenigen" }, right: { icon: "spread", label: "Der Rest" }, heavy: "left" } },
      { type: "story", text: "Probier's aus: Schau auf deine To-do-Liste. Welche *eine oder zwei Aufgaben* bringen am meisten? Mach die morgen als Erstes.", art: { t: "list", title: "Morgen zuerst", items: [{ icon: "star", label: "Wichtigste Aufgabe" }, { icon: "star", label: "Zweitwichtigste" }, { icon: "doc", label: "Rest später" }] } },
      { type: "recap", bullets: ["Wenige Ursachen erzeugen viel Wirkung.", "80/20 ist eine Faustregel, keine exakte Zahl.", "Priorisieren: das Wichtigste zuerst."] },
    ],
  }] }],
  snacks: [{ id: "pareto-snack", kind: "fact", card: { type: "story", text: "Das Pareto-Prinzip: Oft bringen *20 % der Ursachen* rund 80 % der Wirkung. Keine exakte Zahl, aber eine starke Faustregel fürs Priorisieren.", art: { t: "dots", total: 20, hi: 4, label: "Die wichtigen 20 %" } } }],
});
