import { defineCourse } from "../../scripts/art/define";

export default defineCourse({
  slug: "buch-psychology-of-money",
  title: "The Psychology of Money",
  subtitle: "Warum Verhalten wichtiger ist als Wissen",
  author: "Morgan Housel",
  category: "buecher",
  format: "book",
  level: 1,
  estMinutes: 7,
  createdAt: "2026-11-25",
  cover: "moneybag",
  hook: "Der größte Teil von Warren Buffetts Vermögen entstand nach seinem 65. Geburtstag. Das Geheimnis heißt Zeit.",
  sources: [
    "Morgan Housel: The Psychology of Money (2020), deutsch: Über die Psychologie des Geldes",
    "Malmendier & Nagel (2011): Depression Babies – Do macroeconomic experiences affect risk taking? Quarterly Journal of Economics",
    "Rezensionen und Vorträge von Morgan Housel (collaborativefund.com)",
  ],
  units: [
    {
      id: "u1",
      title: "Die Kernideen",
      lessons: [
        {
          slug: "niemand-ist-verrueckt",
          title: "Niemand ist verrückt",
          cards: [
            { type: "title", kicker: "Buch · Teil 1", heading: "Niemand ist verrückt", art: { t: "hero", icon: "brain", label: "Geld ist Gefühl", icons: ["coin", "people"] } },
            { type: "story", text: "Deine Oma bunkert Bargeld im Schrank. Dein Kumpel steckt alles in Krypto. Beide halten den anderen für *verrückt*. Housel sagt: Keiner ist es.", art: { t: "compare", left: { icon: "lock", label: "Oma: Bargeld" }, right: { icon: "rocket", label: "Kumpel: Krypto" }, vs: "?" } },
            { type: "story", text: "Jeder Mensch entscheidet über Geld auf Basis *seiner eigenen Erfahrungen*. Wer eine Krise erlebt hat, tickt anders als jemand, der nur Boom kennt.", art: { t: "timeline", items: [{ label: "Krise erlebt", sub: "Vorsichtig" }, { label: "Boom erlebt", sub: "Mutig" }] } },
            { type: "story", text: "Was die Forschung dazu sagt: Ökonomen fanden, dass Menschen, die *in jungen Jahren* schlechte Börsenjahre erlebten, später seltener Aktien kaufen. Erfahrung prägt Risiko.", art: { t: "zoom", icon: "doc", label: "Studie 2011", detail: "Prägung" } },
            { type: "quiz", kind: "mc", question: "Warum treffen Menschen so unterschiedliche Geldentscheidungen?", options: ["Weil manche dumm sind", "Weil ihre Erfahrungen sie unterschiedlich geprägt haben", "Weil nur Experten es richtig machen", "Weil Geld rein logisch ist"], correct: 1, explanation: "Housels Punkt: Was dir verrückt vorkommt, ergibt aus der Erfahrung des anderen oft Sinn. Geld ist mehr Psychologie als Mathe." },
            { type: "story", text: "Darum rät er: Sei lieber *vernünftig* als perfekt rational. Ein Plan, mit dem du nachts gut schläfst, schlägt den optimalen Plan, den du in Panik abbrichst.", art: { t: "scale", left: { icon: "chart", label: "Perfekt rational" }, right: { icon: "bed", label: "Gut schlafen" }, heavy: "right" } },
            { type: "swipe", question: "Mythos oder Fakt?", statements: [{ text: "Gute Geldentscheidungen hängen vor allem von Intelligenz ab.", true: false }, { text: "Persönliche Erfahrungen prägen das Risikoverhalten.", true: true }, { text: "Ein Plan, den du durchhältst, schlägt einen perfekten, den du abbrichst.", true: true }], explanation: "Verhalten schlägt Wissen. Wer cool bleibt, gewinnt oft gegen Schlaue, die in Panik verkaufen." },
            { type: "insight", text: "Beim Geld zählt Verhalten mehr als Intelligenz. Sei vernünftig statt perfekt.", art: { t: "ba", before: { icon: "brain", label: "Clever" }, after: { icon: "bed", label: "Gelassen" } } },
            { type: "recap", bullets: ["Jeder handelt aus seinen Erfahrungen heraus.", "Krisen in der Jugend prägen das Risikoverhalten.", "Vernünftig schlägt perfekt rational."] },
          ],
        },
        {
          slug: "zeit-ist-der-zauber",
          title: "Zeit ist der Zauber",
          cards: [
            { type: "title", kicker: "Buch · Teil 2", heading: "Zeit ist der Zauber", art: { t: "hero", icon: "hourglass", label: "Lange dabeibleiben", icons: ["snowball", "growth"] } },
            { type: "estimate", question: "Welcher Anteil von Warren Buffetts Vermögen entstand laut Housel nach seinem 65. Geburtstag?", unit: "%", min: 0, max: 100, step: 1, answer: 96, tolerance: 8, explanation: "Rund 96 %, nach Housels Rechnung zum Zeitpunkt des Buchs. Buffett ist ein guter Investor, aber vor allem ein sehr langer. Er fing als Kind an und hörte nie auf." },
            { type: "story", text: "Housels Pointe: Es gibt Investoren mit *höheren Renditen* als Buffett. Aber keiner war so lange so konstant dabei. Zeit macht den Unterschied.", art: { t: "curve", shape: "exp", x: "Alter", y: "Vermögen", mark: { at: 0.75, label: "Ab 65" } } },
            { type: "story", text: "Das Problem: Unser Gehirn denkt *linear*. Zinseszins ist aber exponentiell. Darum unterschätzen fast alle, was lange Zeiträume bewirken.", art: { t: "curve", shape: "exp", ref: "lin", x: "Jahre", y: "Wachstum", refLabel: "Gefühlt", label: "Echt" } },
            { type: "story", text: "Darum sein Rat: Nicht die *höchste* Rendite jagen, sondern eine gute, die du sehr lange durchhältst. Überleben ist wichtiger als glänzen.", art: { t: "compare", left: { icon: "rocket", label: "Kurz und hoch" }, right: { icon: "snowball", label: "Lang und stetig" }, win: "right" } },
            { type: "quiz", kind: "tf", question: "Stimmt's? Laut Housel ist die wichtigste Fähigkeit beim Investieren, Krisen zu überstehen.", options: ["Stimmt", "Stimmt nicht"], correct: 0, explanation: "Wer nie gezwungen ist, im Crash zu verkaufen, lässt den Zinseszins in Ruhe arbeiten. Überleben ist die Voraussetzung für alles andere." },
            { type: "insight", text: "Gute Renditen, sehr lange durchgehalten, schlagen spektakuläre Renditen, die abbrechen.", art: { t: "number", value: "Zeit", label: "Der stärkste Hebel", icon: "hourglass" } },
            { type: "story", text: "Und dann ist da noch *Genug*. Wer nie weiß, wann es reicht, setzt irgendwann *alles aufs Spiel*, was er schon hat. Nur für ein bisschen mehr.", art: { t: "scale", left: { icon: "house", label: "Was du hast" }, right: { icon: "moneybag", label: "Noch mehr" }, heavy: "left" } },
            { type: "recap", bullets: ["Buffetts Vermögen entstand großteils nach 65.", "Unser Gehirn unterschätzt Exponentielles.", "Lange durchhalten schlägt kurz glänzen."] },
          ],
        },
        {
          slug: "unsichtbarer-reichtum",
          title: "Reichtum, den man nicht sieht",
          cards: [
            { type: "title", kicker: "Buch · Teil 3", heading: "Reichtum, den man nicht sieht", art: { t: "hero", icon: "eye", label: "Reich vs. wohlhabend", icons: ["moto", "piggy"] } },
            { type: "story", text: "Jemand fährt ein teures Auto. Du denkst: *Der ist reich.* Aber alles, was du sicher weißt: Er hatte mal Geld und hat es ausgegeben.", art: { t: "scene", ground: true, items: [{ icon: "moto", x: 140, y: 260, s: 160 }, { icon: "question", x: 300, y: 140, s: 80, a: true, step: 1 }] } },
            { type: "story", text: "Housel unterscheidet *reich* und *wohlhabend*. Reich ist sichtbares Einkommen. Wohlstand ist das Geld, das du nicht ausgegeben hast. Und das sieht niemand.", art: { t: "compare", left: { icon: "cash", label: "Reich: sichtbar" }, right: { icon: "piggy", label: "Wohlhabend: unsichtbar" }, win: "right" } },
            { type: "story", text: "Sein zweiter Punkt: *Puffer*. Plane so, dass auch Pech dich nicht umhaut. Notgroschen, wenig Schulden, Spielraum. Wer überlebt, darf weiterspielen.", art: { t: "pyramid", layers: ["Puffer", "Geduld", "Rendite"] } },
            { type: "story", text: "Und der größte Wert von Geld? *Freiheit über deine Zeit*. Zu sagen: Ich mache heute, was ich will. Das schlägt fast jeden Luxus.", art: { t: "scene", items: [{ icon: "clock", x: 130, y: 190, s: 130 }, { icon: "key", x: 290, y: 190, s: 110, a: true, step: 1 }], labels: [{ text: "Zeit gehört dir", x: 200, y: 330, step: 2 }] } },
            { type: "match", question: "Welche Idee aus dem Buch passt?", pairs: [["Wohlstand", "Geld, das du nicht ausgibst"], ["Puffer", "Spielraum für Pech"], ["Genug", "Wissen, wann es reicht"]], explanation: "Drei Kernideen, die zusammenpassen: Spare, damit du Puffer hast, und definiere, was für dich genug ist. Das kauft dir Freiheit." },
            { type: "swipe", question: "Zeichen von Wohlstand oder nur von Ausgaben? Rechts für Wohlstand.", statements: [{ text: "Ein neues, teures Motorrad.", true: false }, { text: "Sechs Monatsausgaben auf dem Tagesgeldkonto.", true: true }, { text: "Ein Jahr Auszeit, ohne Schulden zu machen.", true: true }, { text: "Designerkleidung auf Raten.", true: false }], explanation: "Was man sieht, ist oft nur ausgegebenes Geld. Echter Wohlstand zeigt sich in Optionen: Puffer, Freiheit, keine Schulden." },
            { type: "insight", text: "Wahrer Wohlstand ist unsichtbar: Geld, das du nicht ausgibst, kauft dir Freiheit über deine Zeit.", art: { t: "ba", before: { icon: "moto", label: "Sichtbar reich" }, after: { icon: "key", label: "Frei über Zeit" } } },
            { type: "story", text: "So setzt du es um: Erstens, spar ohne konkreten Grund, *einfach für Freiheit*. Zweitens, bau einen Puffer für Pech. Drittens, schreib auf, was für dich genug wäre.", art: { t: "list", title: "So setzt du es um", items: [{ icon: "piggy", label: "1. Sparen für Freiheit" }, { icon: "lock", label: "2. Puffer aufbauen" }, { icon: "pen", label: "3. Genug definieren" }] } },
            { type: "recap", bullets: ["Reich ist sichtbar, Wohlstand ist unsichtbar.", "Puffer schützt vor Pech und Panik.", "Der größte Wert von Geld ist Freiheit über Zeit."] },
          ],
        },
      ],
    },
  ],
  snacks: [
    { id: "buffett-65", kind: "quote-idea", card: { type: "estimate", question: "Welcher Anteil von Buffetts Vermögen entstand nach seinem 65. Geburtstag? (laut Morgan Housel)", unit: "%", min: 0, max: 100, step: 1, answer: 96, tolerance: 8, explanation: "Rund 96 %. Nicht nur Können, sondern vor allem Zeit hat ihn so reich gemacht." } },
    { id: "reich-vs-wohlhabend", kind: "quote-idea", card: { type: "story", text: "Buch-Idee: *Reich* ist, was man sieht, etwa ein teures Auto. *Wohlhabend* ist das Geld, das du nicht ausgegeben hast. Das sieht niemand.", art: { t: "compare", left: { icon: "moto", label: "Reich" }, right: { icon: "piggy", label: "Wohlhabend" }, win: "right" } } },
  ],
});
