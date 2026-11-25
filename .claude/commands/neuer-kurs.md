---
description: Erstellt einen kompletten YMPULS.-Kurs (Lektionen, animierte SVGs, Feed-Snacks)
argument-hint: <Thema> [kurz|normal|tief] [kategorie:finanzen|self|sport|ernaehrung|technik|business|buecher]
---

Erstelle einen neuen Kurs für die YMPULS.-App. Eingabe: $ARGUMENTS

Halte dich strikt an CLAUDE.md: Abschnitt 5 (Schema), 6 (Spaß und Verständlichkeit), 9 (Illustrations-Stilguide).
Arbeite den Ablauf vollständig ohne Rückfragen ab:

1. **Umfang:** kurz = 1 Lektion (format "quick"), normal = 2 Units × 3 Lektionen, tief = 4 Units × 4 Lektionen. Ohne Angabe: normal.
   Kategorie selbst bestimmen, wenn keine angegeben ist.
2. **Recherche** per Websuche: 3–8 seriöse Quellen (Fachliteratur, Übersichtsarbeiten, Lehrbücher, offizielle Stellen).
   Quellen in `sources` eintragen. Nichts erfinden.
3. **Gliederung:** Units und Lektionen mit je 1 Satz Lernziel, dazu für jede Lektion der Hook und der Aha-Moment.
   Prüfen: Baut es logisch auf? Ist jede Lektion für sich spannend?
4. **Lektionen schreiben** (8–14 Karten) nach dem Spannungsbogen aus Abschnitt 6.5. Mindestens 2 interaktive Karten
   und abwechslungsreiche Typen (estimate, swipe, order, match, quiz). Beispiele aus Yannicks Welt (Sport, Studium, Business).
5. **Bilder** als SVG nach Stilguide, für jede Story- und Kerngedanken-Karte ein eigenes Bild mit 2–4 `data-step`-Gruppen.
   Bildtypen abwechseln. Dazu `cover.svg` in der Kategorie-Farbe mit dem roten Punkt als Akzent.
6. **3–5 Feed-Snacks** zum Kurs in `content/snacks/` (Fakt, Mythos oder Fakt, Mini-Quiz, Diagramm), jeder für sich verständlich, mit `courseRef`.
7. `npm run validate`, bis alles grün ist.
8. **iPhone-Screenshots** mit Playwright (WebKit, iPhone 15 Pro): eine Story-Karte mit allen Schritten, eine interaktive Karte,
   eine Kerngedanken-Karte und einen Snack ansehen, dann Bild- oder Layoutprobleme beheben.
9. **Selbstcheck** nach Abschnitt 6.10 (Hook, Klarheit, Bild, Interaktivität, Aha-Moment, jeweils 1–5) in `docs/content-log.md`.
   Alles unter 4 überarbeiten.
10. `npm run build`, Commit `content: add course <slug>`. Wenn die Veröffentlichung eingerichtet ist: pushen.
11. Antwort an Yannick in höchstens 5 Zeilen: Kurstitel, Anzahl Lektionen, Minuten, das spannendste Aha.

> Technik: Inhalte in `content-src/` schreiben (siehe CLAUDE.md §10, Beispiel `content-src/courses/ausdauer.ts`), dann `npm run art`, `npm run validate`. Bilder per Kontaktbogen prüfen (`npx tsx scripts/art/sheet.ts …`).
