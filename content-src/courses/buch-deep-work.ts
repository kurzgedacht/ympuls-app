import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "buch-deep-work",
  title: "Deep Work",
  subtitle: "Konzentriert arbeiten in einer abgelenkten Welt",
  author: "Cal Newport",
  category: "buecher",
  format: "book",
  level: 2,
  estMinutes: 7,
  createdAt: "2026-11-25",
  cover: "target",
  hook: "Jeder kurze Blick aufs Handy lässt einen Rest deiner Aufmerksamkeit zurück. Wer das versteht, arbeitet in drei Stunden mehr als andere in acht.",
  sources: [
    "Cal Newport: Deep Work (2016), deutsch: Konzentriert arbeiten",
    "Leroy (2009): Why is it so hard to do my work? The challenge of attention residue. Organizational Behavior and Human Decision Processes 109(2)",
    "Mark, González & Harris (2005): No task left behind? Examining the nature of fragmented work. CHI Proceedings",
    "Ericsson, Krampe & Tesch-Römer (1993): The role of deliberate practice. Psychological Review",
  ],
  units: [
    {
      id: "u1",
      title: "Die Kernideen",
      lessons: [
        {
          slug: "tief-vs-flach",
          title: "Tief gegen flach",
          cards: [
            { type: "title", kicker: "Buch · Teil 1", heading: "Tief gegen flach", art: { t: "hero", icon: "target", label: "Deep Work", icons: ["brain", "clock"] } },
            { type: "story", text: "Newport teilt Arbeit in zwei Arten. *Deep Work*: konzentriert, ohne Ablenkung, an der Grenze deines Könnens. *Shallow Work*: Mails, Orga, Kleinkram.", art: { t: "compare", left: { icon: "brain", label: "Deep Work" }, right: { icon: "mail", label: "Shallow Work" }, win: "left" } },
            { type: "story", text: "Flache Arbeit fühlt sich produktiv an. Du bist beschäftigt, hakst Dinge ab. Aber sie schafft *selten echten Wert* und ist leicht zu ersetzen.", art: { t: "scale", left: { icon: "brain", label: "Wert" }, right: { icon: "mail", label: "Beschäftigt" }, heavy: "left" } },
            { type: "story", text: "Seine Formel: *Ergebnis = Zeit × Intensität*. Zwei Stunden mit voller Konzentration können mehr bringen als ein ganzer Tag mit ständigem Hin- und Herspringen.", art: { t: "number", value: "Zeit × Fokus", label: "Echtes Ergebnis", icon: "target" } },
            { type: "swipe", question: "Deep oder Shallow? Rechts für Deep Work.", statements: [{ text: "Eine Hausarbeit-Gliederung ohne Handy schreiben.", true: true }, { text: "Gruppenchat checken und antworten.", true: false }, { text: "Einen Trainingsplan für einen Kunden entwickeln.", true: true }, { text: "Termine hin- und herschieben.", true: false }], explanation: "Deep Work fordert dein Können und schafft etwas Neues. Shallow Work ist nötig, aber jeder könnte sie machen." },
            { type: "quiz", kind: "mc", question: "Warum ist Deep Work laut Newport heute so wertvoll?", options: ["Weil es jeder kann", "Weil es selten und gleichzeitig immer wichtiger wird", "Weil es weniger anstrengend ist", "Weil Mails unwichtig sind"], correct: 1, explanation: "Ablenkung ist überall, Konzentration wird selten. Gleichzeitig zählen komplexe Fähigkeiten immer mehr. Das macht Fokus zum Wettbewerbsvorteil." },
            { type: "insight", text: "Konzentration wird seltener und wertvoller zugleich. Wer sie trainiert, hat einen echten Vorteil.", art: { t: "curve", shape: "exp", x: "Jahre", y: "Wert von Fokus", label: "Steigt" } },
            { type: "story", text: "Probier's aus: Zähl am Ende des Tages, wie viele Minuten du *wirklich am Stück* an einer schweren Sache gearbeitet hast. Die Zahl ist oft ernüchternd.", art: { t: "zoom", icon: "clock", label: "Ehrlich zählen", detail: "? Min" } },
            { type: "recap", bullets: ["Deep Work: konzentriert, wertvoll, selten.", "Shallow Work: beschäftigt, aber leicht ersetzbar.", "Ergebnis = Zeit × Intensität."] },
          ],
        },
        {
          slug: "aufmerksamkeitsreste",
          title: "Aufmerksamkeitsreste",
          cards: [
            { type: "title", kicker: "Buch · Teil 2", heading: "Aufmerksamkeitsreste", art: { t: "hero", icon: "phone", label: "Nur kurz checken?", icons: ["brain", "mail"] } },
            { type: "story", text: "Du lernst für die Klausur. *Nur kurz* aufs Handy schauen, zehn Sekunden. Dann zurück. Kein Ding, oder? Doch, leider.", art: { t: "scene", items: [{ icon: "book", x: 130, y: 200, s: 130 }, { icon: "phone", x: 290, y: 190, s: 100, a: true, step: 1 }], labels: [{ text: "Nur kurz", x: 290, y: 330, step: 1 }] } },
            { type: "story", text: "Die Forscherin Sophie Leroy zeigte: Nach einem Wechsel bleibt ein Teil deiner Aufmerksamkeit *bei der alten Aufgabe hängen*. Sie nennt es Aufmerksamkeitsrest.", art: { t: "flow", steps: [{ icon: "book", label: "Aufgabe A" }, { icon: "phone", label: "Kurz B" }, { icon: "brain", label: "Rest bleibt" }] } },
            { type: "story", text: "Das Ergebnis: Du sitzt wieder am Buch, aber *denkst halb* an die Nachricht. Deine Leistung sinkt, obwohl du dich bemühst.", art: { t: "dots", total: 20, hi: 7, label: "Kopf noch woanders" } },
            { type: "estimate", question: "In einer Studie zu Unterbrechungen: Wie viele Minuten dauerte es im Schnitt, bis Leute zur ursprünglichen Aufgabe zurückkehrten?", unit: "Min", min: 0, max: 60, step: 1, answer: 23, tolerance: 7, explanation: "Gloria Mark fand rund 23 Minuten, weil oft weitere Aufgaben dazwischenkommen. Die Zahl bezieht sich auf Büroarbeit, nicht auf jede Unterbrechung." },
            { type: "match", question: "Was passt zusammen?", pairs: [["Aufmerksamkeitsrest", "Gedanken hängen an der alten Aufgabe"], ["Deep Work", "Lange Phase ohne Wechsel"], ["Shallow Work", "Kleine Aufgaben, oft unterbrochen"]], explanation: "Jeder Wechsel kostet. Darum lohnt es sich, Kleinkram zu bündeln und tiefe Arbeit am Stück zu machen." },
            { type: "insight", text: "Jeder kurze Wechsel kostet mehr als die Sekunden, die er dauert. Bündle Kleinkram, schütze tiefe Phasen.", art: { t: "ba", before: { icon: "spread", label: "Ständig wechseln" }, after: { icon: "target", label: "Am Stück" } } },
            { type: "story", text: "Probier's aus: Leg dein Handy bei der nächsten Lernsession *in einen anderen Raum*. Stell einen Timer auf 45 Minuten. Erst dann wieder ran.", art: { t: "scene", items: [{ icon: "clock", x: 130, y: 200, s: 120 }, { icon: "lock", x: 280, y: 200, s: 110, a: true, step: 1 }], labels: [{ text: "45 Min Fokus", x: 200, y: 340, step: 2 }] } },
            { type: "recap", bullets: ["Nach Wechseln bleibt ein Aufmerksamkeitsrest.", "Zurückfinden kann lange dauern.", "Kleinkram bündeln, tiefe Phasen schützen."] },
          ],
        },
        {
          slug: "rituale",
          title: "Rituale für tiefe Arbeit",
          cards: [
            { type: "title", kicker: "Buch · Teil 3", heading: "Rituale für tiefe Arbeit", art: { t: "hero", icon: "calendar", label: "Fokus planen", icons: ["clock", "check"] } },
            { type: "story", text: "Newport beschreibt verschiedene Wege, Deep Work einzubauen. Der alltagstauglichste: *rhythmisch*. Jeden Tag zur gleichen Zeit ein fester Fokusblock.", art: { t: "timeline", items: [{ label: "Mo", sub: "8 bis 10" }, { label: "Di", sub: "8 bis 10" }, { label: "Mi", sub: "8 bis 10" }, { label: "Do", sub: "8 bis 10" }] } },
            { type: "story", text: "Ein zweiter Trick: *Langeweile aushalten*. Wer bei jeder Wartezeit zum Handy greift, trainiert sein Gehirn auf Ablenkung. Fokus ist wie ein Muskel.", art: { t: "compare", left: { icon: "phone", label: "Immer Handy" }, right: { icon: "brain", label: "Mal Leere" }, win: "right" } },
            { type: "story", text: "Und am Ende des Tages: ein *Feierabend-Ritual*. Offene Aufgaben notieren, Plan für morgen, dann bewusst abschalten. So hört der Kopf auf zu kreisen.", art: { t: "flow", steps: [{ icon: "doc", label: "Offenes notieren" }, { icon: "calendar", label: "Morgen planen" }, { icon: "moon", label: "Abschalten" }] } },
            { type: "order", question: "Bring ein gutes Feierabend-Ritual in Reihenfolge.", items: ["Mails ein letztes Mal checken", "Offene Aufgaben aufschreiben", "Plan für morgen festlegen", "Laptop zu, Feierabend"], explanation: "Erst alles einsammeln, dann planen, dann bewusst schließen. Dein Kopf vertraut darauf, dass nichts verloren geht." },
            { type: "quiz", kind: "tf", question: "Stimmt's? Konzentration ist eine feste Eigenschaft, die man nicht trainieren kann.", options: ["Stimmt", "Stimmt nicht"], correct: 1, explanation: "Newport behandelt Fokus wie eine Fähigkeit, die mit Übung wächst. Wer regelmäßig tief arbeitet, hält es mit der Zeit länger aus." },
            { type: "insight", text: "Fokus passiert nicht zufällig. Plane feste Blöcke, halte Langeweile aus und schließe den Tag bewusst ab.", art: { t: "stack", items: ["Fester Block", "Langeweile ok", "Feierabend-Ritual"], label: "Deep-Work-Routine" } },
            { type: "story", text: "So setzt du es um: Erstens, blocke morgen *90 Minuten* im Kalender für deine wichtigste Aufgabe. Zweitens, Handy raus. Drittens, abends offene Punkte aufschreiben.", art: { t: "list", title: "So setzt du es um", items: [{ icon: "calendar", label: "1. 90 Min blocken" }, { icon: "lock", label: "2. Handy raus" }, { icon: "doc", label: "3. Abends notieren" }] } },
            { type: "recap", bullets: ["Rhythmisch: täglich fester Fokusblock.", "Langeweile aushalten trainiert Fokus.", "Feierabend-Ritual beruhigt den Kopf."] },
          ],
        },
      ],
    },
  ],
  snacks: [
    { id: "aufmerksamkeitsrest", kind: "quote-idea", card: { type: "story", text: "Nach jedem Wechsel bleibt ein Teil deiner Aufmerksamkeit *bei der alten Aufgabe hängen*. Forscher nennen das Aufmerksamkeitsrest. Nur kurz aufs Handy ist nie nur kurz.", art: { t: "flow", steps: [{ icon: "book", label: "Lernen" }, { icon: "phone", label: "Kurz checken" }, { icon: "brain", label: "Kopf halb weg" }] } } },
    { id: "deep-work-formel", kind: "quiz", card: { type: "quiz", kind: "mc", question: "Cal Newports Formel für Ergebnisse lautet: Zeit mal …", options: ["Geld", "Intensität", "Glück"], correct: 1, explanation: "Ergebnis = Zeit × Intensität. Volle Konzentration vervielfacht, was du in derselben Zeit schaffst." } },
  ],
});
