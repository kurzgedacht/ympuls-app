# CLAUDE.md – YMPULS. (persönliche Visual-Microlearning-App fürs iPhone)

Du baust und pflegst **YMPULS.** – Yannicks persönliche Lern-App nach dem Vorbild von *Imprint*
(Analyse: `docs/imprint-analyse.md`). Ziel: **Instagram-Ersatz**. Statt Reels scrollt Yannick durch 2-Minuten-Wissen,
das genauso viel Spaß macht und Belohnung gibt, aber ihn wirklich weiterbringt.
Nur für den privaten Gebrauch. Mechanik von Imprint übernehmen, aber **nichts** von Imprint kopieren
(kein Name, Logo, keine Texte, Bilder oder Farben).

## 0. Arbeitsweise (wichtig)
- Yannick möchte **so wenig wie möglich selbst tun**. Arbeite autonom: Entscheidungen selbst treffen, Abhängigkeiten
  installieren, Fehler selbst beheben, testen, committen. Frag nur, wenn es ohne ihn nicht geht (z. B. GitHub-Login).
- Arbeite in Phasen (Abschnitt 11). Nach jeder Phase müssen `npm run build`, `npm run test` und `npm run validate` grün sein, dann Git-Commit.
- UI-Texte und Inhalte auf **Deutsch** (du-Form, locker, präzise). Code, Variablennamen und Commits auf Englisch.
- Prüfe die UI immer als iPhone (Playwright **WebKit**, Gerät „iPhone 15 Pro“, 393×852, hell + dunkel), bevor du eine Phase als fertig meldest.
- Halte diese Datei aktuell. Detailentscheidungen notierst du in `docs/decisions.md`.

## 1. Produkt in einem Satz
Tippbare Bild-Geschichten in 2-Minuten-Lektionen und ein endloser Wissens-Feed im Reels-Format, dazu Mini-Spiele,
Quizze und ein Belohnungssystem rund um den roten **Puls-Punkt**. Themen: Finanzen, Persönlichkeitsentwicklung, Sport,
Ernährung, Technik, Karriere & Business sowie die wichtigsten Bücher und Konzepte dazu.

## 2. Plattform: nur iPhone (PWA, für iOS Safari optimiert)
- Web-App, die über Safari → Teilen → „Zum Home-Bildschirm“ installiert wird und dann wie eine native App läuft
  (Standalone, kein Browser-Rahmen). **Kein Desktop-Layout** bauen. Auf größeren Bildschirmen wird die App einfach zentriert
  (max-width 430px) gezeigt, nur damit man sie zur Not testen kann.
- Pflicht für iOS:
  - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
  - `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style=black-translucent`, `apple-mobile-web-app-title="YMPULS."`
  - `apple-touch-icon` 180×180 aus `brand/ympuls-appicon.svg` (ohne Transparenz, iOS rundet die Ecken selbst ab)
  - Startbildschirme (`apple-touch-startup-image`) für die gängigen iPhone-Größen (SE, 13/14, 15/16, Pro, Pro Max), hell und dunkel: Navy-Fläche mit zentriertem Signet. Mit Script generieren.
  - Safe Areas überall: `env(safe-area-inset-top|bottom)` (Dynamic Island, Home-Indikator).
  - Höhe über `100dvh`, nicht `100vh`.
  - `overscroll-behavior: none` (kein Gummiband-Effekt, kein Pull-to-Refresh), `touch-action: manipulation` (kein Doppeltipp-Zoom),
    `-webkit-tap-highlight-color: transparent`, auf Karten `user-select: none`.
  - Eingabefelder mit mindestens 16px Schrift (sonst zoomt iOS beim Fokussieren).
  - Theme-Farbe hell und dunkel per `media`-Attribut.
- **Haptik:** iOS Safari unterstützt `navigator.vibrate` **nicht**. Baue `src/lib/haptics.ts` mit dem bekannten iOS-18-Weg:
  eine versteckte `<input type="checkbox" switch>` mit `<label>`, deren Umschalten per Code die System-Haptik auslöst.
  Wo verfügbar zusätzlich `navigator.vibrate`. Wenn beides fehlt: still ignorieren. Teste den Weg im Standalone-Modus.
- **Sound:** kurze, selbst erzeugte Web-Audio-Töne (keine Audiodateien nötig). Setze `navigator.audioSession.type = "ambient"`,
  wo verfügbar, damit der Lautlos-Schalter respektiert wird. Sound ist im Profil abschaltbar (Standard: an).
- **Speicher:** Installierte Home-Screen-Apps haben ihren eigenen Speicher. Trotzdem gibt es ein Backup (Export und Import als JSON).
- Push-Benachrichtigungen brauchen einen Server, deshalb **nicht** bauen. Als Erinnerung gibt es stattdessen eine `.ics`-Kalenderserie zur Lernzeit (Abschnitt 7.7).

## 3. Tech-Stack (fix, nicht diskutieren)
- Vite, React 18, TypeScript (strict), Tailwind CSS, Framer Motion, React Router
- Zustand mit `persist` (localStorage) für Fortschritt, XP, Streak, gespeicherte Karten, Wiederholungsdaten und Einstellungen
- `vite-plugin-pwa` (offline, alle Inhalte vorab laden), Zod für das Inhaltsschema, Fuse.js für die Suche, canvas-confetti
- Tests: Vitest; UI-Screenshots: Playwright mit WebKit und iPhone-Profil
- Inhalte als statische Dateien in `content/` (JSON und SVG), eingebunden per `import.meta.glob`. Kein Backend, kein Login, kein Tracking.
- Veröffentlichung über GitHub Pages per GitHub Action (`gh` CLI)

## 4. Branding: YMPULS. (alles liegt fertig in `brand/`)
Die Marke stammt aus Yannicks YMPULS.-Designsystem. **Logos nicht neu zeichnen**, sondern die Dateien aus `brand/` verwenden:
- `ympuls-wordmark.svg` (Navy mit rotem Punkt), `ympuls-wordmark-inverse.svg` (weiß), `ympuls-wordmark-mono.svg`
- `ympuls-signet.svg` / `ympuls-signet-round.svg` („Y.“ weiß auf Navy, roter Punkt), `ympuls-appicon.svg` (quadratisch, für App-Icons)
- Schriften: `brand/fonts/` mit Archivo 800/900 (Überschriften) und Atkinson Hyperlegible 400/700 (Text), lokal per `@font-face`
- `brand/tokens.json`: alle Farbwerte für hell und dunkel → daraus `src/brand.ts` und die Tailwind-Farben erzeugen

Farben (hell / dunkel):
| Token | Hell | Dunkel | Einsatz |
|---|---|---|---|
| ground | #F5F6F8 | #08142A | App-Hintergrund |
| surface-card | #FFFFFF | #152A49 | Karten |
| surface-alt | #E7EBF1 | #10223E | abgesetzte Flächen |
| ink / ink-muted | #0F1A2B / #4B5668 | #F3F5F8 / #AEB8C8 | Text |
| brand (Navy) | #002144 | #1A3560 | Primärflächen, Primär-Buttons, Tab-Bar-Aktiv |
| brand-strong | #1D3E6B | #2F5590 | zweite Navy-Stufe |
| brand-soft (Eisblau) | #D6DEEA | #1C3254 | Entlastungsflächen, Bildhintergründe |
| puls (Rot) | #D11F3A | #D11F3A | **Der Punkt**: Akzent, Fortschritt, aktive Elemente, Belohnung |
| puls-text | #B8122F | #FF6B7F | roter Text |

Ergänzende Funktionsfarben (nur in der App, sparsam einsetzen): richtig `#1E9E6A`, Gold für XP und Belohnungen `#F2B84B`.
Falsche Antworten werden **nicht** in Puls-Rot gezeigt (Rot ist positiv besetzt), sondern mit ink-muted, einem ✕-Symbol und einer kurzen Wackel-Animation.

Marken-Idee für die App: **Der rote Punkt ist der Puls.** Er taucht als Fortschrittspunkt, Lade-Animation (Herzschlag),
Streak-Symbol und Belohnung auf. Gesammelte XP heißen in der UI **„Puls“** (z. B. „+10 Puls“).
Titel und Überschriften: Archivo 900, gern in Versalien für Kicker-Zeilen. Fließtext: Atkinson Hyperlegible.
Der Name wird immer **YMPULS.** geschrieben (Versalien, mit Punkt). Ton der App: **du**, wie ein guter Coach.
(Das YMPULS.-Handbuch verlangt *Sie*, das gilt aber nur für die Senioren-Zielgruppe, nicht für diese App.)

Kategorien mit Farben (für Chips, Kurs-Cover, Unit-Kopfzeilen):
| Kategorie | slug | Farbe |
|---|---|---|
| Finanzen | finanzen | #1E9E6A |
| Persönlichkeitsentwicklung | self | #7B5CD6 |
| Sport & Training | sport | #D11F3A |
| Ernährung | ernaehrung | #F2B84B |
| Technik | technik | #2F7FD8 |
| Karriere & Business | business | #002144 |
| Bücher & Konzepte | buecher | #B5651D |

## 5. Inhaltsstruktur und Schema (`src/content/schema.ts`, Zod)
```
content/
  courses/<course-slug>/course.json, lessons/<lesson-slug>.json, art/*.svg, cover.svg
  snacks/<snack-id>.json (+ art)      # Einzelkarten für den Feed (Abschnitt 7.2)
  daily/<yyyy-mm-dd>.json (+ daily/art/)
```
```ts
Course { slug, title, subtitle, category, format: "course"|"quick"|"book", author?, level: 1|2|3,
         estMinutes, units: Unit[], createdAt, sources: string[], hook: string }   // hook = 1 Satz, warum das spannend ist
Unit   { id, title, lessons: string[] }
Lesson { slug, title, cards: Card[] }     // 8–14 Karten, ca. 2 Minuten

Card =
 | { type:"title",    heading, kicker?, art }
 | { type:"story",    text, art, steps?: number }          // 15–50 Wörter, *kursiv* = Betonung
 | { type:"insight",  text, art }                          // Kernaussage ≤ 22 Wörter, wird automatisch gespeichert
 | { type:"quiz",     kind:"mc"|"tf"|"compare", question, art?, options: string[], correct: number, explanation }
 | { type:"estimate", question, unit, min, max, step, answer, tolerance, explanation }    // Schätz-Regler
 | { type:"order",    question, items: string[], explanation }           // in richtige Reihenfolge tippen (items = Lösung)
 | { type:"match",    question, pairs: [string,string][], explanation }  // Begriffe zuordnen (3–4 Paare)
 | { type:"swipe",    question, statements: {text, true: boolean}[], explanation }  // Mythos oder Fakt, nach links oder rechts wischen, 3–5 Aussagen
 | { type:"poll",     question, options: string[] }        // „Was würdest du tun?“, ohne richtig oder falsch, macht neugierig
 | { type:"recap",    bullets: string[] }                  // genau 3 Punkte, letzte Karte

Snack = { id, category, kind:"fact"|"myth"|"quiz"|"chart"|"quote-idea"|"howto", card: Card, courseRef? }
```
Pflichtregeln je Lektion: mindestens 1 `insight`, mindestens 2 interaktive Karten (quiz, estimate, order, match oder swipe),
davon mindestens 1, die kein Multiple Choice ist. Am Ende steht `recap`. `explanation` ist immer Pflicht.
Nie zwei Textkarten ohne Bildwechsel hintereinander. `npm run validate` prüft Schema, Dateiverweise, Wortgrenzen,
SVG-Gültigkeit und diese Regeln und meldet Fehler mit Pfad.

## 6. Spaß und Verständlichkeit (Qualitätsregeln für alle Lektionen)
Jede Lektion muss sich wie eine gute Story anfühlen, nicht wie ein Lehrbuch.
1. **Hook in Karte 1–2:** eine überraschende Zahl, ein Widerspruch, eine Frage oder Mini-Szene („Zwei Läufer, gleiches Training, einer wird schneller. Warum?“).
2. **Eine Idee pro Karte.** Kurze Sätze (höchstens 15 Wörter), Alltagssprache. Fachbegriffe nur mit sofortiger Übersetzung („Zinseszins, also Zinsen auf Zinsen“).
3. **Analogie vor Definition:** erst das Bild („Dein Körper ist wie ein Akku …“), dann der Begriff.
4. **Konkrete Beispiele aus Yannicks Welt:** Laufen und Rennrad, Krafttraining, Fußball und Torwart, Motorrad, Studium, Nebenjob, eigenes Business, Geld mit 19.
5. **Spannungsbogen:** Hook → Problem → Aha-Moment (Visual!) → Beispiel → Mitmach-Karte → Kerngedanke → „Probier's aus“ (1 konkrete Mini-Aktion für heute) → Recap.
6. **Humor erlaubt**, trocken und kurz, maximal 1–2 Mal pro Lektion. Keine Emojis im Fließtext. Ausnahme sind Belohnungs-Screens.
7. **Interaktiv statt passiv:** alle 3–4 Karten etwas zum Tippen, Schätzen, Wischen oder Zuordnen. Schätzfragen mit überraschender Lösung wirken am stärksten.
8. **Erklärung bei Fehlern:** freundlich, kurz, mit dem *Warum* („Fast! Die meisten tippen auf X, weil …“).
9. **Fachlich sauber:** evidenzbasiert, Quellen in `sources`. Keine erfundenen Zahlen. Bei Ernährung, Gesundheit und Geld keine Heilversprechen und keine Anlageempfehlungen für einzelne Produkte, nur Prinzipien.
10. **Selbstcheck vor dem Commit:** Bewerte jede Lektion von 1–5 in Hook, Klarheit, Bildqualität, Interaktivität und Aha-Moment.
    Alles unter 4 wird überarbeitet. Die Bewertung kommt in `docs/content-log.md`.

## 7. Screens und Mechanik

### 7.1 Navigation
Tab-Bar unten mit 5 Tabs (Icon, Label, Safe Area): **Heute · Feed · Entdecken · Bibliothek · Profil**.
Der aktive Tab bekommt einen kleinen roten Puls-Punkt unter dem Icon. Lektionen laufen bildschirmfüllend ohne Tab-Bar.

### 7.2 Feed (der Instagram-Ersatz)
- Vertikaler Vollbild-Feed wie Reels (CSS Scroll-Snap, eine Karte pro Bildschirm, Wischen nach oben).
- Inhalt: gemischte **Snacks** (Fakt, Mythos oder Fakt, Mini-Quiz, Diagramm, Buch-Idee, Kurzanleitung) aus allen Kategorien,
  dazu fällige Wiederholungen und alle 5 Karten ein „Teaser“ für eine passende Lektion („Mehr dazu in 2 Min →“).
- Sortierung: Lieblingskategorien stärker gewichten, nichts doppelt innerhalb von 14 Tagen, Interaktives und Passives abwechseln.
- **Doppeltipp = speichern**: roter Punkt pulsiert auf und fliegt zum Bibliotheks-Tab.
- Quiz-Snacks direkt im Feed beantworten, mit Puls-Belohnung.
- **Sanftes Session-Ende:** Nach 20 Snacks erscheint die Karte „Starke Session – 20 Ideen in 6 Minuten“ mit kleiner Statistik.
  Weiter geht es nur mit bewusstem Tipp. Gewollt anders als Instagram: Erfolgserlebnis statt Endlosschleife.
- Der Feed zählt aufs Tagesziel (Minuten) und auf den Streak, sobald mindestens 10 Snacks gesehen wurden.
- Pro Kurs werden automatisch 3–5 Snacks erzeugt (Teil von `/neuer-kurs`).

### 7.3 Heute (Startseite)
1. Kopf: Wortmarke klein, Begrüßung nach Tageszeit, **Streak-Pill** (pulsierender Punkt mit Zahl), **Puls-Pill** (XP), **Level-Ring**.
2. **Tagesziel-Ring** („4 von 10 Min“), wählbar 5, 10 oder 15 Min. Beim Erreichen läuft die Belohnungs-Animation (7.6).
3. **Tägliche Truhe:** einmal pro Tag nach der ersten Lektion. Antippen und aufmachen ergibt eine zufällige Belohnung
   (Bonus-Puls, doppelte Puls für 15 Min, Streak-Schutz oder seltene Sammelkarte). Das ist die Endorphin-Kick-Mechanik.
4. **Wiederholen-Karte**, wenn Fragen fällig sind („6 Fragen fällig · ca. 2 Min“).
5. **Weiterlernen:** aktueller Kurs als vertikaler Zickzack-Pfad. Unit-Kopfzeile in Kategorie-Farbe. Knoten: erledigt = Navy mit
   weißem Haken; aktuell = großer roter Punkt, der im Herzschlag-Rhythmus pulsiert; gesperrt = surface-alt mit Schloss.
   Antippen öffnet ein Popover mit Titel, „~2 Min“ und dem Button „Los“. Nach einem Unit-Abschluss gibt es ein Badge mit Animation.
6. **Tageslektion** als großes Cover, danach das Karussell „Neu für dich“.

### 7.4 Lektion-Player (wichtigster Screen, hier am meisten Sorgfalt)
- Oben: ✕, dünner Fortschrittsbalken in Navy mit rotem Punkt an der Spitze, rechts „⋯“ (Karte teilen, Fehler notieren).
- **Tippen:** rechte zwei Drittel = weiter, linkes Drittel = zurück, dazu Wischen. Beim ersten Start erklärt ein Overlay die Trennlinie.
- **Story-Karte:** Text oben (19px, Zeilenhöhe 1.45, *kursiv* in puls-text), darunter das Bild auf einer brand-soft-Karte (ca. 60 % der Höhe).
  **Schrittweiser Aufbau:** SVG-Gruppen `data-step="1..n"` erscheinen nacheinander (Einblenden plus leichtes Hochgleiten, 250 ms, Feder-Animation).
  Ein Tipp zeigt erst den nächsten Schritt; sind alle sichtbar, geht es zur nächsten Karte.
- **Interaktive Karten:** große Pill-Buttons, Auswahl in Navy, unten fest der Button „Prüfen“ (Puls-Rot, gesperrt bis zur Auswahl).
  - `estimate`: großer Regler mit Live-Zahl. Danach animiert der Zeiger zur Lösung und zeigt „Du lagst 12 % daneben“.
  - `order`: Elemente nacheinander antippen, bis sie richtig stehen. `match`: links und rechts antippen, Linie zeichnet sich, richtige Paare rasten ein.
  - `swipe`: Kartenstapel, nach rechts = Fakt, nach links = Mythos, mit Kipp-Animation.
  - `poll`: Antwort antippen, dann erscheint „Die meisten Menschen entscheiden sich für …“ (aus dem Inhalt).
  - Danach erscheint unten ein Feedback-Blatt. Richtig: grüner Haken, „+10 Puls“ fliegt in den Zähler, Haptik und Ton „pling“.
    Falsch: ✕, Wackeln, richtige Lösung und **Erklärung**. Danach „Weiter“. Jede beantwortete Frage landet in der Wiederholung.
- **Kerngedanken-Karte (insight):** Navy-Fläche, Bild oben, Satz in Weiß, Kicker „KERNGEDANKE“ mit rotem Punkt.
  Wird automatisch gespeichert, dann erscheint der Hinweis „Gespeichert“ und der Punkt springt kurz.
- **Lektion geschafft:** Belohnungs-Sequenz (7.6), dann die Statistik-Karte (Zeit, richtig x/y, neue Kerngedanken, Puls),
  dann der Streak-Screen und danach der Pfad, auf dem der nächste Knoten sichtbar freigeschaltet wird.

### 7.5 Entdecken, Bibliothek
- **Entdecken:** Titel „Alle Kurse (n)“, Kategorie-Chips, Suche, Abschnitte „Neu“, „In 2 Minuten“ (quick), „Bücher in 10 Minuten“ (book),
  „Für dein Business“ (business). Raster aus Covern mit „NEU“-Badge. Kursseite mit Hook, Units, Dauer, „Starten“ und „Merken“.
- **Bibliothek:** Tabs „Alle · Gemerkt · Fertig“ sowie **Sammlung** (gespeicherte Kerngedanken und Feed-Snacks als Raster,
  sortierbar nach Datum oder Kategorie, Teilen als PNG über das iOS-Teilen-Menü).

### 7.6 Belohnungssystem (Endorphin-Kicks, das Herz des Instagram-Ersatzes)
Grundsatz: **Kleine, häufige, überraschende Belohnungen fürs Lernen**, nie fürs reine Scrollen.
- **Mikro-Feedback bei jeder Aktion:** jeder Tipp federt (Scale 0.96), Haptik bei Auswahl, Prüfen, Speichern und Belohnung, sanfte Töne.
- **Puls-Serie (Combo):** Richtige Antworten in Folge erhöhen eine Herzfrequenz-Anzeige („Puls 92 → 118 → 146 bpm“).
  Ab 3 richtigen gibt es doppelte Puls-Punkte, ab 5 eine „Hochpuls“-Animation (der Punkt schlägt schneller, Bildschirmrand glüht rot).
  Bei einem Fehler sinkt die Anzeige wieder, ohne Strafe.
- **„+10 Puls“** fliegt als kleiner roter Punkt in den Zähler oben (Zahl rollt hoch).
- **Level:** Puls-Punkte füllen Level-Stufen (100, 250, 450 … wachsend). Ein Level-Up ist ein Vollbild-Moment mit Konfetti in Navy, Rot und Gold,
  einem Titel („Level 7 · Durchstarter“) und kräftiger Haptik. Die Titel-Liste in `src/lib/levels.ts` (20 Stufen, motivierend, deutsch) legst du selbst fest.
- **Perfekte Lektion** (alles richtig): goldene Krone am Pfad-Knoten und +25 Bonus.
- **Tägliche Truhe** (7.3) mit zufälliger, gewichteter Belohnung. Die Seltenheit wird angezeigt (normal, selten, episch).
- **Sammelkarten:** Jeder fertige Kurs schaltet eine gestaltete Sammelkarte frei (Kurs-Cover plus Kerngedanke, nummeriert „#12 / 40“).
  Album im Profil, leere Plätze sind ausgegraut sichtbar (Sammeltrieb).
- **Abzeichen (Achievements):** z. B. „Erste Lektion“, „7-Tage-Streak“, „Frühaufsteher (vor 8 Uhr gelernt)“, „100 Fragen richtig“,
  „Alle Kategorien probiert“, „Bücherwurm (5 Buch-Guides)“. Freischalten mit Toast und Animation.
- **Streak:** pulsierender roter Punkt mit Zahl. Meilensteine bei 3, 7, 14, 30, 50 und 100 Tagen mit eigenem Vollbild.
  Pro Woche gibt es 1 Streak-Schutz automatisch, weitere aus der Truhe.
- **Wochenrückblick:** jeden Montag eine automatische Story aus 5 Karten („Deine Woche“: Minuten, Kerngedanke der Woche,
  stärkste Kategorie, Serien-Rekord, neue Abzeichen), mit Teilen als Bild.
- Alle Animationen respektieren `prefers-reduced-motion`. Ton und Haptik sind im Profil einzeln abschaltbar.

### 7.7 Wiederholen (Spaced Repetition), Profil
- Wiederholung nach vereinfachtem SM-2: Abstände 1, 3, 7, 16 und 35 Tage, bei Fehler zurück auf 1 Tag. Täglich höchstens 10 Fragen,
  gemischt aus allen Fragetypen und Kerngedanken („Weißt du es noch?“ mit Aufdecken), +5 Puls pro richtige Antwort, zählt für den Streak.
- **Profil:** Level und Titel, Statistik (Lernminuten der letzten 7 Tage als Balken, Lektionen, Bestwert Streak), Sammelalbum, Abzeichen,
  Lieblingskategorien (steuern den Feed), Tagesziel, **Lernzeit-Erinnerung als `.ics` herunterladen** (tägliche Kalenderserie,
  öffnet direkt im iOS-Kalender), Ton und Haptik an/aus, Hell/Dunkel/System, Backup exportieren und importieren, Fortschritt zurücksetzen.

### 7.8 Streak-Logik
+1, wenn an einem Kalendertag (Europe/Berlin) mindestens 1 Lektion, 1 Wiederholungsrunde oder 10 Feed-Snacks abgeschlossen wurden.
Ein verpasster Tag verbraucht einen Streak-Schutz, falls vorhanden, sonst geht der Streak auf 0.
Die gesamte Datumslogik liegt in `src/lib/dates.ts`, mit Tests.

### 7.9 Bewusst NICHT bauen
Onboarding-Fragebogen (stattdessen 3 kurze Startbildschirme: Willkommen, Lieblingskategorien wählen, Tagesziel wählen),
Paywall, Account, Werbung, Tracking, Push-Server, Desktop-Layout.

## 8. Design-System
- Mobil, 393px als Referenzbreite. Abstände im 4px-Raster, Bildschirmrand 20px.
- Radien: Karten 24px, Buttons komplett rund. Schatten weich und flach. Viel Weißraum, ruhige Flächen, Rot nur als Akzent (Verhältnis 60:30:10 wie im Markenhandbuch).
- Typografie: Archivo 900 für Titel (30–34px, Zeilenhöhe 1.0), Kicker in Archivo 800 als Versalien mit 1.5px Zeichenabstand und 12px Größe; Atkinson Hyperlegible 17–19px für Text.
- Bewegung: Framer Motion, Standard-Feder `{type:"spring", stiffness:420, damping:30}`. Seitenwechsel als iOS-artiges Schieben.
- Dunkelmodus über die dunklen Tokens. Bilder bleiben auf ihrer Eisblau-Karte (im Dunkelmodus #1C3254 mit hellen Konturen).
- Komponenten in `src/components/ui/`: Button, Pill, Chip, Card, ProgressBar, BottomSheet, Toast, PulseDot, PathNode, RewardBurst, LevelRing, Chest.

## 9. Illustrations-Stilguide (für alle erzeugten SVGs, entscheidet über den Imprint-Look)
- `viewBox="0 0 400 400"`, keine externen Dateien, keine Rasterbilder. Text in SVGs mit `font-family="Archivo, Arial Black, sans-serif"` (Beschriftungen) oder Atkinson.
- **Flacher, editorialer Stil in Markenfarben:** Navy (#002144) für Konturen und Hauptformen, Puls-Rot (#D11F3A) als Akzent
  (genau 1 Hingucker pro Bild), Eisblau (#D6DEEA) und Weiß für Flächen, dazu pro Bild **höchstens eine** Kategorie-Farbe.
  Konturen 3–4px mit runden Enden, große einfache Formen, leichter Papierkorn-Effekt erlaubt (SVG-Filter, dezent).
- **Beschriftungen** in Versalien, 13–15px, 1px Zeichenabstand, in weißen Pills mit Navy-Rand, höchstens 5 Wörter pro Beschriftung.
- Bildtypen je nach Inhalt wählen und **abwechseln**: Kurve oder Diagramm (Achsen und eine rote Akzentkurve), Vergleich links/rechts,
  Ablauf mit Pfeilen, Metapher-Szene (Figuren als einfache Silhouetten), Waage, Pyramide oder Schichten, Venn-Diagramm, Zeitstrahl,
  Vorher/Nachher, „Zoom“-Lupe auf ein Detail.
- **Schrittweise Animation:** Elemente in `<g data-step="1">…</g>` usw. (2–4 Schritte) erzählen die Erklärung nach.
  Die Grundszene ohne `data-step` ist sofort sichtbar.
- Keine echten Personen, keine Marken- oder Firmenlogos, keine bekannten Figuren, keine Buchcover. Bei Buch-Guides eine eigene,
  symbolische Szene zur Kernidee.
- Muss bei 350px Breite gut lesbar sein. Im Build per SVGO optimieren.

## 10. Inhalte erstellen (Yannick tippt nur einen Befehl)
Befehle in `.claude/commands/`: `/neuer-kurs`, `/kurs-aus-quelle`, `/buch`, `/snacks`, `/tageslektion` (siehe dort).
Jeder Befehl recherchiert, schreibt, zeichnet, prüft (validate, Screenshots, Selbstcheck nach Abschnitt 6.10), erzeugt Snacks,
committet und veröffentlicht, falls das schon eingerichtet ist.

**Start-Katalog** (in Phase 4 erzeugen; Umfang „normal“ = 2 Units × 3 Lektionen, wenn nicht anders angegeben):
- **Finanzen:** Geld-Grundlagen mit 19 (Budget, Notgroschen, Zinseszins) · ETFs & Börse einfach erklärt · Selbstständig & Steuern-Basics (Kleinunternehmer, Rücklagen)
- **Persönlichkeitsentwicklung:** Gewohnheiten, die bleiben · Fokus & Deep Work · Selbstvertrauen & Komfortzone in kleinen Schritten
- **Sport & Training:** Ausdauer verstehen (VO2max, Zonen, HRV) · Krafttraining-Grundlagen (Progression, Volumen) · Regeneration & Schlaf
- **Ernährung:** Energie & Makros verstehen · Protein & Muskelaufbau · Essen rund ums Training
- **Technik:** Wie KI-Sprachmodelle funktionieren · Wie Wearables messen (GPS, Puls, Schlaf) · Internet & WLAN verstehen
- **Karriere & Business:** Geschäftsmodell bauen (Business Model Canvas) · Erste Kunden gewinnen (auch als Introvertierter) · Preise richtig festlegen · Lean Startup in der Praxis
- **Bücher & Konzepte** (je „book“, 1 Unit × 3 Lektionen): Atomic Habits · The Psychology of Money · Deep Work · Thinking, Fast and Slow · The Lean Startup · $100M Offers · Can't Hurt Me · Zero to One
- Dazu 10 Quick Reads (z. B. Pareto-Prinzip, Sunk-Cost-Fehler, Compound Effect, Parkinsons Gesetz, Opportunitätskosten, Dunning-Kruger, 80/20 beim Training, Kalorien-Mythen) und **mindestens 60 Feed-Snacks**.

Wenn die Zeit knapp wird: erst 1 Kurs pro Kategorie, 3 Bücher, 5 Quick Reads und 40 Snacks fertig und poliert, den Rest danach.

## 11. Bauphasen (der Reihe nach, jede endet mit grünem Build und Commit)
1. **Grundgerüst und iOS-Basis:** Vite/React/TS/Tailwind/Router/Zustand/PWA, Marke aus `brand/` (Tokens, Schriften, Logos),
   App-Icons und Startbildschirme generieren, iOS-Meta-Tags, Safe Areas, Tab-Bar, leere Screens, Haptik- und Sound-Bibliothek, Vitest und Playwright (WebKit, iPhone).
2. **Inhalts-Pipeline:** Zod-Schema, Loader, `npm run validate`, 1 handgebauter Beispielkurs (2 Lektionen) mit allen Kartentypen und animierten SVGs.
3. **Lektion-Player** komplett: alle Kartentypen, Tippen, Schritte, Feedback, automatisches Speichern, Abschluss-Sequenz. Tests für die Store-Logik.
4. **Startseite mit Pfad, Entdecken, Kursseite, Bibliothek und Sammlung**, danach den **Start-Katalog** erzeugen (Abschnitt 10).
5. **Feed** (7.2) und **Belohnungssystem** (7.6): Serie, Level, Truhe, Abzeichen, Sammelkarten, Streak-Meilensteine, Wochenrückblick.
6. **Wiederholung, Tagesziel, Streak, Profil, Backup, `.ics`-Erinnerung, Dunkelmodus.**
7. **Feinschliff:** Animationen, reduzierte Bewegung, Offline-Test, Lighthouse-PWA ≥ 90, Teilen als PNG, Startbildschirme prüfen.
8. **Veröffentlichung:** GitHub-Repo, Pages-Action, URL in die README. README-Anleitung „Aufs iPhone holen“:
   Safari öffnen → URL → Teilen → „Zum Home-Bildschirm“ → „Als Web-App öffnen“ aktiviert lassen.
   (Hinweis: GitHub Pages aus einem privaten Repo braucht GitHub Pro. Sonst ein öffentliches Repo, die Inhalte sind unkritisch.)

## 12. Befehle
```
npm run dev        # lokal (mit --host, damit Yannick im selben WLAN am iPhone testen kann; URL ausgeben)
npm run build      # Produktions-Build inkl. validate und svgo
npm run validate   # Inhalte prüfen
npm run test       # Vitest
npm run e2e        # Playwright-Screenshots (WebKit, iPhone) nach ./screenshots
npm run preview
```

## 13. Fertig, wenn (jede Phase)
- Keine TypeScript- oder Lint-Fehler, Tests grün, validate grün.
- iPhone-Screenshots der betroffenen Screens (hell und dunkel) angesehen: kein Überlauf, Safe Areas passen, nichts unter der Dynamic Island oder dem Home-Indikator.
- Commit mit klarer Nachricht. Kurze Zusammenfassung an Yannick: was neu ist und wie er es sieht (1 Befehl oder URL).
