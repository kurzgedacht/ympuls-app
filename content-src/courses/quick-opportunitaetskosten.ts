import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "quick-opportunitaetskosten",
  title: "Opportunitätskosten",
  subtitle: "Der Preis der verpassten Alternative",
  category: "finanzen",
  format: "quick",
  level: 1,
  estMinutes: 2,
  createdAt: "2026-11-25",
  cover: "scale",
  hook: "Alles, was du tust, kostet etwas, das du stattdessen hättest tun können. Auch dieser Abend auf dem Sofa.",
  sources: ["N. Gregory Mankiw: Principles of Economics – Opportunity Cost", "Frederick et al. (2009): Opportunity cost neglect. Journal of Consumer Research 36(4)"],
  units: [{ id: "u1", title: "Quick Read", lessons: [{
    slug: "opportunitaetskosten", title: "Opportunitätskosten",
    cards: [
      { type: "title", kicker: "Quick Read", heading: "Opportunitätskosten", art: { t: "hero", icon: "scale", label: "Was kostet es wirklich?", icons: ["coin", "clock"] } },
      { type: "story", text: "Ein Abo für 15 € im Monat. *Klingt wenig*. Aber was würdest du mit 180 € im Jahr sonst machen? Genau das ist der echte Preis.", art: { t: "compare", left: { icon: "phone", label: "Abo", value: "180 €" }, right: { icon: "bike", label: "Neue Laufräder?" } } },
      { type: "story", text: "Ökonomen nennen das *Opportunitätskosten*: der Wert der besten Alternative, auf die du verzichtest. Jede Entscheidung ist auch ein Nein zu etwas anderem.", art: { t: "flow", steps: [{ icon: "check", label: "Option A wählen" }, { icon: "cross", label: "Option B verlieren" }] } },
      { type: "story", text: "Das gilt auch für *Zeit*. Zwei Stunden Scrollen kosten zwei Stunden Training, Schlaf oder Arbeit am eigenen Business.", art: { t: "scale", left: { icon: "phone", label: "2 h Scrollen" }, right: { icon: "dumbbell", label: "2 h Training" }, heavy: "right" } },
      { type: "quiz", kind: "mc", question: "Du arbeitest im Nebenjob für 15 €/Stunde und überlegst, 3 Stunden für 30 € Ersparnis zum Schnäppchen zu fahren. Was sind die Opportunitätskosten der Fahrt?", options: ["0 €", "30 €", "45 € entgangener Lohn", "15 €"], correct: 2, explanation: "Drei Stunden, die du hättest arbeiten können, sind 45 € wert. Die Ersparnis von 30 € lohnt sich also eigentlich nicht." },
      { type: "swipe", question: "Mythos oder Fakt?", statements: [{ text: "Etwas Kostenloses hat keine Kosten.", true: false }, { text: "Zeit hat auch Opportunitätskosten.", true: true }, { text: "Menschen vergessen beim Kaufen oft die Alternative.", true: true }], explanation: "Studien zeigen: Wer bewusst an die Alternative erinnert wird, kauft seltener Unnötiges. Kostenlos ist selten gratis, du zahlst mit Zeit oder Aufmerksamkeit." },
      { type: "insight", text: "Frag nicht nur: Was kostet das? Frag: Worauf verzichte ich dafür?", art: { t: "venn", a: "Was ich wähle", b: "Was ich verliere", mid: "Echter Preis" } },
      { type: "story", text: "Probier's aus: Bevor du heute etwas kaufst, frag dich: *Was könnte ich stattdessen* mit dem Geld machen? Nur fragen, dann entscheiden.", art: { t: "zoom", icon: "cart", label: "Vor dem Kauf", detail: "Statt-dessen?" } },
      { type: "recap", bullets: ["Opportunitätskosten = Wert der besten Alternative.", "Gilt für Geld und für Zeit.", "Vor Entscheidungen bewusst die Alternative denken."] },
    ],
  }] }],
  snacks: [{ id: "abo-jahrespreis", kind: "fact", card: { type: "story", text: "Ein 15-Euro-Abo kostet *180 € im Jahr*. Rechne Monatspreise immer aufs Jahr hoch. Dann fragst du dich ehrlicher, ob es das wert ist.", art: { t: "number", value: "180 €", label: "Pro Jahr statt 15 €", icon: "calendar" } } }],
});
