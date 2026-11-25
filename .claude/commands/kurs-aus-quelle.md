---
description: Macht aus eigenen Unterlagen (PDF-Folien, Skripte, Notizen) einen YMPULS.-Kurs
argument-hint: <Pfad in quellen/> [kurz|normal|tief]
---

Erstelle einen YMPULS.-Kurs aus den Unterlagen unter: $ARGUMENTS

- Lies alle Dateien im angegebenen Pfad vollständig, bei PDFs inklusive Folientext. Das Material ist die Hauptquelle.
  Ergänze nur, wo es fürs Verständnis nötig ist, und kennzeichne das in `sources`.
- Kategorie passend wählen (z. B. self, sport, business). Den Titel aus dem Material ableiten.
- Interaktive Karten so bauen, dass sie prüfungsrelevantes Verständnis abfragen: Definitionen anwenden, Modelle unterscheiden
  (match), Abläufe ordnen (order), Studienergebnisse einschätzen (estimate).
- Auch Uni-Stoff muss Spaß machen: Regeln aus Abschnitt 6 gelten voll.
- Danach genau wie `/neuer-kurs` ab Schritt 3 weiter (Gliederung, Lektionen, Bilder, Snacks, validate, Screenshots, Selbstcheck, Build, Commit).

> Technik: Inhalte in `content-src/` schreiben (siehe CLAUDE.md §10, Beispiel `content-src/courses/ausdauer.ts`), dann `npm run art`, `npm run validate`. Bilder per Kontaktbogen prüfen (`npx tsx scripts/art/sheet.ts …`).
