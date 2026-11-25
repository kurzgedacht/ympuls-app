import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "quick-sunk-cost",
  title: "Der Sunk-Cost-Fehler",
  subtitle: "Warum wir an Verlorenem festhalten",
  category: "self",
  format: "quick",
  level: 1,
  estMinutes: 2,
  createdAt: "2026-11-25",
  cover: "bomb",
  hook: "Du sitzt im schlechten Film, nur weil das Ticket 12 Euro gekostet hat. Dein Gehirn spielt dir einen Streich.",
  sources: ["Arkes & Blumer (1985): The psychology of sunk cost. Organizational Behavior and Human Decision Processes 35(1)", "Daniel Kahneman: Thinking, Fast and Slow (2011)", "Staw (1976): Knee-deep in the big muddy. Organizational Behavior and Human Performance"],
  units: [{ id: "u1", title: "Quick Read", lessons: [{
    slug: "sunk-cost", title: "Der Sunk-Cost-Fehler",
    cards: [
      { type: "title", kicker: "Quick Read", heading: "Der Sunk-Cost-Fehler", art: { t: "hero", icon: "bomb", label: "Weg ist weg", icons: ["coin", "clock"] } },
      { type: "poll", question: "Der Kinofilm ist nach 30 Minuten richtig schlecht. Das Ticket hat 12 € gekostet. Was tust du?", options: ["Bleiben, ist ja bezahlt", "Gehen und den Abend retten"], majority: 0, note: "Die meisten bleiben. Dabei ist das Geld *in beiden Fällen weg*. Die einzige Frage ist: Wie verbringst du die nächsten 90 Minuten?" },
      { type: "story", text: "Das ist der *Sunk-Cost-Fehler*, also der Fehler der versunkenen Kosten. Wir halten an etwas fest, weil wir schon investiert haben. Nicht, weil es sich lohnt.", art: { t: "scale", left: { icon: "coin", label: "Schon bezahlt" }, right: { icon: "clock", label: "Deine Zukunft" }, heavy: "left" } },
      { type: "story", text: "In einer klassischen Studie wählte *über die Hälfte* der Befragten einen teureren Skitrip, obwohl sie den günstigeren lieber mochten. Nur weil er mehr gekostet hatte.", art: { t: "compare", left: { icon: "mountain", label: "Teurer Trip" }, right: { icon: "mountain", label: "Schönerer Trip" }, win: "right" } },
      { type: "swipe", question: "Sunk-Cost-Falle? Rechts für ja.", statements: [{ text: "Ich studiere das Fach weiter, obwohl ich es hasse. Sind ja schon vier Semester.", true: true }, { text: "Ich höre mit dem Projekt auf, weil die Zahlen klar dagegen sprechen.", true: false }, { text: "Ich esse den Teller leer, obwohl ich satt bin. Hat ja Geld gekostet.", true: true }], explanation: "Die Frage ist nie: Was habe ich schon reingesteckt? Sondern: Lohnt sich der nächste Schritt, wenn ich heute neu entscheiden würde?" },
      { type: "quiz", kind: "mc", question: "Welche Frage schützt am besten vor dem Sunk-Cost-Fehler?", options: ["Wie viel habe ich schon investiert?", "Würde ich heute neu einsteigen, wenn ich bei null starten müsste?", "Was denken die anderen?", "Wie lange mache ich das schon?"], correct: 1, explanation: "Die Neu-Start-Frage blendet die Vergangenheit aus. Sie zwingt dich, nur auf Kosten und Nutzen ab jetzt zu schauen." },
      { type: "insight", text: "Was weg ist, ist weg. Entscheide nur nach dem, was ab jetzt kommt.", art: { t: "ba", before: { icon: "coin", label: "Was war" }, after: { icon: "arrowup", label: "Was kommt" } } },
      { type: "story", text: "Probier's aus: Denk an *eine Sache*, die du nur noch aus Gewohnheit oder Pflichtgefühl machst. Würdest du heute neu damit anfangen?", art: { t: "zoom", icon: "person", label: "Neu-Start-Frage", detail: "Heute neu?" } },
      { type: "recap", bullets: ["Versunkene Kosten sind weg, egal wie du entscheidest.", "Wir halten trotzdem gern daran fest.", "Frag: Würde ich heute neu einsteigen?"] },
    ],
  }] }],
  snacks: [{ id: "sunk-cost-kino", kind: "quiz", card: { type: "quiz", kind: "tf", question: "Stimmt's? Wenn der Film schlecht ist, solltest du bleiben, weil das Ticket bezahlt ist.", options: ["Stimmt", "Stimmt nicht"], correct: 1, explanation: "Das Geld ist so oder so weg. Entscheide nur, wie du die nächsten 90 Minuten nutzen willst. Das ist der Sunk-Cost-Fehler." } }],
});
