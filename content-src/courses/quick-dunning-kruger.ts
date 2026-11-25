import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "quick-dunning-kruger",
  title: "Der Dunning-Kruger-Effekt",
  subtitle: "Wenn wenig Wissen sich wie viel anfühlt",
  category: "self",
  format: "quick",
  level: 1,
  estMinutes: 2,
  createdAt: "2026-11-25",
  cover: "mountain",
  hook: "Die schwächsten Teilnehmer schätzten sich in einer Studie besser ein als die Mehrheit. Aber die berühmte Kurve dazu ist ein Mythos.",
  sources: ["Kruger & Dunning (1999): Unskilled and unaware of it. Journal of Personality and Social Psychology 77(6)", "Nuhfer et al. (2016): Random number simulations reveal how random noise affects the measurements of self-assessed competency. Numeracy 9(1)", "Gignac & Zajenkowski (2020): The Dunning-Kruger effect is (mostly) a statistical artefact. Intelligence 80"],
  units: [{ id: "u1", title: "Quick Read", lessons: [{
    slug: "dunning-kruger", title: "Der Dunning-Kruger-Effekt",
    cards: [
      { type: "title", kicker: "Quick Read", heading: "Der Dunning-Kruger-Effekt", art: { t: "hero", icon: "mountain", label: "Wie gut bin ich?", icons: ["brain", "question"] } },
      { type: "estimate", question: "In der Originalstudie lagen die schwächsten Teilnehmer etwa beim 12. Perzentil. Wo schätzten sie sich selbst ein?", unit: "Perzentil", min: 0, max: 100, step: 1, answer: 62, tolerance: 10, explanation: "Etwa beim 62. Perzentil, also besser als die Mehrheit. Das war die Kernbeobachtung von Kruger und Dunning 1999." },
      { type: "story", text: "Die Erklärung der Forscher: Wer wenig weiß, dem fehlt *genau das Wissen*, um die eigenen Fehler zu erkennen. Ein doppeltes Problem.", art: { t: "zoom", icon: "brain", label: "Blinder Fleck", detail: "Fehler?" } },
      { type: "story", text: "Im Netz kursiert dazu eine Kurve mit *Mount Stupid* und Tal der Verzweiflung. Die stammt aber *nicht aus der Studie*. Sie ist ein Meme.", art: { t: "curve", shape: "peak", x: "Wissen", y: "Selbstvertrauen", label: "Meme, keine Daten" } },
      { type: "story", text: "Was die Forschung heute sagt: Ein Teil des Effekts ist ein *Statistik-Artefakt*. Auch mit Zufallszahlen entsteht ein ähnliches Muster. Der Kern bleibt: Selbsteinschätzung ist ungenau.", art: { t: "scale", left: { icon: "chart", label: "Echter Effekt" }, right: { icon: "dice", label: "Statistik-Rauschen" }, heavy: "right" } },
      { type: "swipe", question: "Mythos oder Fakt?", statements: [{ text: "Die Mount-Stupid-Kurve stammt aus der Originalstudie.", true: false }, { text: "Schwache Teilnehmer überschätzten sich in der Studie deutlich.", true: true }, { text: "Experten unterschätzen sich manchmal leicht.", true: true }], explanation: "In der Studie lagen die Besten mit ihrer Einschätzung leicht zu tief. Die berühmte Kurve wurde später dazuerfunden." },
      { type: "quiz", kind: "mc", question: "Was hilft am besten gegen Selbstüberschätzung?", options: ["Mehr Selbstvertrauen", "Ehrliches Feedback und messbare Tests", "Nur mit Anfängern vergleichen", "Nichts Neues lernen"], correct: 1, explanation: "Objektive Rückmeldung, etwa Zeiten im Training, Klausurnoten oder Kundenreaktionen, korrigiert das Bauchgefühl." },
      { type: "insight", text: "Dein Gefühl für dein Können ist unzuverlässig. Miss es lieber, als es zu schätzen.", art: { t: "ba", before: { icon: "cloud", label: "Bauchgefühl" }, after: { icon: "chart", label: "Messen" } } },
      { type: "story", text: "Probier's aus: Schätz vor deinem nächsten Lauf oder Test *dein Ergebnis*. Schreib es auf. Vergleich hinterher. Wie gut liegst du?", art: { t: "compare", left: { icon: "pen", label: "Geschätzt" }, right: { icon: "watch", label: "Gemessen" }, vs: "?" } },
      { type: "recap", bullets: ["Schwache überschätzten sich in der Studie stark.", "Die Mount-Stupid-Kurve ist ein Meme.", "Teile des Effekts sind Statistik, Messen hilft."] },
    ],
  }] }],
  snacks: [{ id: "mount-stupid-myth", kind: "myth", card: { type: "swipe", question: "Mythos oder Fakt?", statements: [{ text: "Die berühmte Mount-Stupid-Kurve stammt von Dunning und Kruger.", true: false }, { text: "Selbsteinschätzungen sind oft ungenau.", true: true }, { text: "Ein Teil des Effekts lässt sich statistisch erklären.", true: true }], explanation: "Die Kurve ist ein Internet-Meme. Die Studie zeigte Balken nach Leistungsgruppen, keine Bergkurve." } }],
});
