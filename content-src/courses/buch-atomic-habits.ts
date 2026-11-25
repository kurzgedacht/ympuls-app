import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "buch-atomic-habits",
  title: "Atomic Habits",
  subtitle: "Kleine Gewohnheiten, große Wirkung",
  author: "James Clear",
  category: "buecher",
  format: "book",
  level: 1,
  estMinutes: 7,
  createdAt: "2026-11-25",
  cover: "stairs",
  hook: "Ein Prozent besser pro Tag klingt nach nichts. Über ein Jahr ist es ein anderes Leben.",
  sources: [
    "James Clear: Atomic Habits (2018), deutsch: Die 1%-Methode",
    "Lally et al. (2010): How are habits formed. European Journal of Social Psychology",
    "Wood & Rünger (2016): Psychology of Habit. Annual Review of Psychology 67",
    "Rezensionen und Interviews mit James Clear (jamesclear.com)",
  ],
  units: [
    {
      id: "u1",
      title: "Die Kernideen",
      lessons: [
        {
          slug: "ein-prozent",
          title: "Ein Prozent besser",
          cards: [
            { type: "title", kicker: "Buch · Teil 1", heading: "Ein Prozent besser", art: { t: "hero", icon: "stairs", label: "Atomic Habits", icons: ["growth", "calendar"] } },
            { type: "estimate", question: "Du wirst jeden Tag 1 % besser. Wie viel besser bist du nach einem Jahr? (Faktor)", unit: "×", min: 1, max: 60, step: 1, answer: 38, tolerance: 8, explanation: "1,01 hoch 365 ergibt rund 37,8. Umgekehrt: 1 % schlechter pro Tag lässt fast nichts übrig, etwa 0,03. Kleine Schritte summieren sich gewaltig." },
            { type: "story", text: "Die Kernidee des Buchs: Erfolg kommt selten aus *einem großen Moment*. Er kommt aus winzigen Gewohnheiten, die sich wie Zinsen aufaddieren.", art: { t: "curve", shape: "exp", ref: "lin", x: "Tage", y: "Fortschritt", refLabel: "Gefühlt", label: "Tatsächlich" } },
            { type: "story", text: "Das Gemeine: Am Anfang *siehst du nichts*. Wie Eis bei minus vier Grad. Du heizt auf minus drei, minus zwei. Nichts passiert. Bei null schmilzt es.", art: { t: "scene", items: [{ icon: "thermometer", x: 120, y: 200, s: 140 }, { icon: "drop", x: 280, y: 200, s: 110, a: true, step: 1 }], labels: [{ text: "Erst bei null", x: 200, y: 340, step: 2 }] } },
            { type: "story", text: "Clear nennt diese Phase das *Tal der Enttäuschung*: Du erwartest lineare Fortschritte, bekommst aber erst mal fast keine. Genau hier hören die meisten auf.", art: { t: "curve", shape: "exp", ref: "lin", x: "Zeit", y: "Ergebnis", mark: { at: 0.45, label: "Tal der Enttäuschung" } } },
            { type: "story", text: "Was die Forschung dazu sagt: Die 1-%-Rechnung ist ein *Bild*, keine Messung. Echter Fortschritt verläuft holpriger. Aber dass kleine, stabile Gewohnheiten viel bewirken, ist gut belegt.", art: { t: "zoom", icon: "book", label: "Faktencheck", detail: "Bild, kein Gesetz" } },
            { type: "quiz", kind: "mc", question: "Warum hören viele Menschen bei neuen Gewohnheiten zu früh auf?", options: ["Weil Gewohnheiten nicht wirken", "Weil Ergebnisse erst verzögert sichtbar werden", "Weil 1 % zu viel ist", "Weil sie zu schnell Erfolg haben"], correct: 1, explanation: "Ergebnisse hinken dem Einsatz hinterher. Wer das weiß, hält das Tal der Enttäuschung besser aus." },
            { type: "insight", text: "Ergebnisse sind die verzögerte Quittung deiner Gewohnheiten. Bleib im Tal, die Kurve kommt.", art: { t: "timeline", items: [{ label: "Start" }, { label: "Nichts passiert" }, { label: "Durchbruch" }], icon: "snowball" } },
            { type: "recap", bullets: ["1 % pro Tag ergibt über ein Jahr rund 38-fach.", "Erst kommt das Tal der Enttäuschung.", "Die Rechnung ist ein Bild, die Richtung stimmt."] },
          ],
        },
        {
          slug: "vier-gesetze",
          title: "Die vier Gesetze",
          cards: [
            { type: "title", kicker: "Buch · Teil 2", heading: "Die vier Gesetze", art: { t: "hero", icon: "gear", label: "Bauplan für Gewohnheiten", icons: ["eye", "star"] } },
            { type: "story", text: "Jede Gewohnheit läuft laut Clear in *vier Schritten*: Ein Auslöser, ein Verlangen, eine Handlung und eine Belohnung. Dann von vorn.", art: { t: "flow", loop: true, steps: [{ icon: "eye", label: "Auslöser" }, { icon: "magnet", label: "Verlangen" }, { icon: "runner", label: "Handlung" }, { icon: "star", label: "Belohnung" }] } },
            { type: "story", text: "Daraus macht er *vier Gesetze* für gute Gewohnheiten: Mach sie offensichtlich, attraktiv, einfach und befriedigend. Für schlechte drehst du alles um.", art: { t: "list", items: [{ icon: "eye", label: "Offensichtlich" }, { icon: "magnet", label: "Attraktiv" }, { icon: "bolt", label: "Einfach" }, { icon: "star", label: "Befriedigend" }] } },
            { type: "match", question: "Welche Maßnahme passt zu welchem Gesetz?", pairs: [["Offensichtlich", "Laufschuhe neben die Tür stellen"], ["Attraktiv", "Lieblings-Podcast nur beim Laufen hören"], ["Einfach", "Mit nur fünf Minuten starten"], ["Befriedigend", "Jeden Lauf im Kalender abhaken"]], explanation: "Jedes Gesetz hat einen eigenen Hebel. Kombinierst du alle vier, wird die Gewohnheit fast zum Selbstläufer." },
            { type: "story", text: "Ein cleverer Trick für Gesetz zwei heißt *Temptation Bundling*: Koppel etwas, das du tun solltest, an etwas, das du gern tust. Serie nur auf dem Ergometer.", art: { t: "venn", a: "Sollte ich", b: "Will ich", mid: "Bündeln" } },
            { type: "swipe", question: "Mach es schwerer? Rechts, wenn das eine schlechte Gewohnheit bremst.", statements: [{ text: "Süßigkeiten in den obersten Schrank.", true: true }, { text: "Netflix-App auf den Startbildschirm.", true: false }, { text: "Nach jeder Zigarette fünf Euro ins Sparschwein.", true: true }], explanation: "Das ist die Umkehrung: unsichtbar, unattraktiv, schwer und unbefriedigend machen. Genau so bremst du Gewohnheiten, die du loswerden willst." },
            { type: "insight", text: "Gute Gewohnheiten: sichtbar, attraktiv, leicht, belohnend. Schlechte: alles umdrehen.", art: { t: "scale", left: { icon: "star", label: "Gute leichter" }, right: { icon: "lock", label: "Schlechte schwerer" }, heavy: "left" } },
            { type: "quiz", kind: "mc", question: "Du willst mehr Wasser trinken. Welcher Schritt nutzt das Gesetz „offensichtlich“?", options: ["Eine Wasser-App kaufen", "Eine volle Flasche auf den Schreibtisch stellen", "Sich mehr Mühe geben", "Wasser nur am Wochenende"], correct: 1, explanation: "Sichtbar heißt: Der Auslöser springt dir ins Auge. Eine Flasche im Blickfeld erinnert dich besser als jeder Vorsatz." },
            { type: "recap", bullets: ["Gewohnheits-Schleife: Auslöser, Verlangen, Handlung, Belohnung.", "Vier Gesetze: offensichtlich, attraktiv, einfach, befriedigend.", "Für schlechte Gewohnheiten alles umkehren."] },
          ],
        },
        {
          slug: "identitaet",
          title: "Werde, wer du sein willst",
          cards: [
            { type: "title", kicker: "Buch · Teil 3", heading: "Werde, wer du sein willst", art: { t: "hero", icon: "mirror", label: "Identität zuerst", icons: ["person", "check"] } },
            { type: "story", text: "Zwei Menschen wollen aufhören zu rauchen. Einer sagt: *Ich versuche aufzuhören.* Der andere: *Ich bin kein Raucher.* Kleiner Unterschied, große Wirkung.", art: { t: "compare", left: { icon: "person", label: "Ich versuche" }, right: { icon: "person", label: "Ich bin" }, win: "right" } },
            { type: "story", text: "Clears zentrale Idee: Konzentriere dich nicht auf das *Ziel*, sondern auf die Person, die du werden willst. Jede Handlung ist eine Stimme für diese Identität.", art: { t: "stack", items: ["Ergebnis", "Prozess", "Identität"], label: "Von innen nach außen" } },
            { type: "story", text: "Und starte winzig: die *Zwei-Minuten-Regel*. Statt „30 Minuten lesen“ heißt es „eine Seite lesen“. Erst den Ablauf festigen, dann ausbauen.", art: { t: "number", value: "2 Min", label: "Starte lächerlich klein", icon: "clock" } },
            { type: "order", question: "Von der großen Absicht zur Zwei-Minuten-Version: Was ist am kleinsten? Sortier von groß nach klein.", items: ["Marathon laufen", "Fünf Kilometer laufen", "Zehn Minuten joggen", "Laufschuhe anziehen"], explanation: "Laufschuhe anziehen klingt albern. Aber wer jeden Tag die Schuhe anzieht, läuft meistens auch los." },
            { type: "quiz", kind: "tf", question: "Stimmt's? Laut Clear sollte man eine verpasste Gewohnheit nie zweimal hintereinander auslassen.", options: ["Stimmt", "Stimmt nicht"], correct: 0, explanation: "Einmal verpassen ist ein Unfall, zweimal ist der Anfang einer neuen Gewohnheit. Das passt gut zur Forschung von Lally: Einzelne Aussetzer schaden kaum." },
            { type: "insight", text: "Jede Handlung ist eine Stimme für die Person, die du sein willst. Sammle kleine Stimmen.", art: { t: "dots", total: 20, hi: 14, label: "Stimmen für dich" } },
            { type: "story", text: "So setzt du es um: Erstens, formuliere *eine Identität*, etwa „Ich bin Läufer“. Zweitens, finde ihre Zwei-Minuten-Version. Drittens, häng sie an eine feste Routine.", art: { t: "list", title: "So setzt du es um", items: [{ icon: "mirror", label: "1. Identität wählen" }, { icon: "clock", label: "2. Zwei Minuten" }, { icon: "calendar", label: "3. An Routine hängen" }] } },
            { type: "recap", bullets: ["Identität vor Ziel: Ich bin statt ich versuche.", "Zwei-Minuten-Regel: winzig starten.", "Nie zweimal hintereinander auslassen."] },
          ],
        },
      ],
    },
  ],
  snacks: [
    { id: "atomic-1-prozent", kind: "quote-idea", card: { type: "story", text: "Buch-Idee aus Atomic Habits: Jeden Tag *1 % besser* ergibt rechnerisch rund 38-mal besser nach einem Jahr. Ein Bild, kein Naturgesetz, aber die Richtung stimmt.", art: { t: "number", value: "× 38", label: "1 % täglich, 1 Jahr", icon: "stairs" } } },
    { id: "zwei-minuten-regel", kind: "howto", card: { type: "story", text: "Die Zwei-Minuten-Regel: Schrumpf jede neue Gewohnheit auf *zwei Minuten*. Eine Seite lesen. Schuhe anziehen. Erst der Ablauf, dann der Umfang.", art: { t: "number", value: "2 Min", label: "Winzig anfangen", icon: "clock" } } },
  ],
});
