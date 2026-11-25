# Entscheidungen (YMPULS.)

## Technik
- **HashRouter** statt BrowserRouter: GitHub Pages kennt keine SPA-Rewrites, Hash-URLs funktionieren offline und im Standalone-Modus ohne 404-Trick.
- **Farben aus `brand/tokens.json`** werden zur Laufzeit als CSS-Variablen gesetzt (`src/brand.ts`), Tailwind nutzt `rgb(var(--c-…))`. Kein Generierungsschritt nötig.
- **Dunkelmodus der Illustrationen:** SVGs nutzen fest Navy/Weiß/Eisblau. Im Dunkelmodus färbt CSS diese exakten Werte um (Navy → hell, Weiß → Kartenblau, Eisblau → #10223E). Deshalb ist `convertColors` in SVGO aus. Cover behalten ihre Farben (`.keep`).
- **Inhalte werden aus `content-src/` erzeugt** (`npm run art`): Kurse sind typisierte TS-Dateien, deren Karten statt eines Dateinamens eine Bild-Spezifikation tragen. Der Generator (`scripts/art/`) zeichnet daraus SVGs nach Stilguide §9 (Icon-Bibliothek + 17 Bildtypen mit `data-step`). `content/` (JSON + SVG) bleibt das Format, das App und `validate` lesen, und wird mit eingecheckt. Handgezeichnete SVGs gehen weiterhin (`art: { file }`).
- Alle SVGs werden per `import.meta.glob(?raw)` gebündelt: offline automatisch verfügbar, `data-step` animierbar.
- Startbildschirme: hell = Navy-Fläche mit Signet ohne Kachel, dunkel = #08142A mit Signet-Kachel. 8 iPhone-Größen × 2.
- Playwright-Viewport 393×852 (Standalone-Höhe, ohne Safari-Leisten).
- Haptik: verstecktes `<input type="checkbox" switch>` + Label-Klick (iOS 18), sonst `navigator.vibrate`.

## Produkt
- Poll-Karten haben zusätzlich `majority` (Index der häufigsten Antwort) und optional `note`, damit „Die meisten entscheiden sich für …“ aus dem Inhalt kommt.
- Snacks dürfen `sources` tragen.
- Karten-IDs: `c/<kurs>/<lektion>/<index>`, `d/<datum>/<index>`, `s/<snack>` (für Sammlung und Wiederholung).
- Tageslektion: Datei `content/daily/<datum>.json`, sonst rotierender Quick Read.
- Truhe: 55 % 10–20 Puls (normal), 13 % 50 Puls, 16 % doppelte Puls 15 Min, 10 % Streak-Schutz (selten), 6 % Truhen-Sammelkarte (episch, 6 Stück).
- Streak-Schutz: 1 pro Woche automatisch, höchstens 3 gespeichert.
- Combo: ab 3 richtigen in Folge doppelte Puls, ab 5 „Hochpuls“ (roter Rand). Anzeige 72 bpm + 18 je Treffer.
- Level-Titel: `src/lib/levels.ts`.

## Feinschliff (Phase 7)
- **Lighthouse-PWA-Score:** Lighthouse hat die PWA-Kategorie seit Version 12 (2024) entfernt. Stattdessen prüft `e2e/offline.spec.ts`
  die Installierbarkeit (Manifest standalone, Icons 192/512, Apple-Touch-Icon, Startbildschirme) und den Offline-Start nach dem ersten Besuch.
- Alle Inhalte (JSON + SVG) stecken im JS-Bundle (~1,4 MB, gzip ~0,3 MB) und werden vom Service Worker vorab geladen. Bewusst kein Code-Splitting: offline zählt mehr als die erste Ladezeit.
- Reduzierte Bewegung: `MotionConfig reducedMotion="user"`, CSS-Animationen auf 0 ms, Konfetti aus.
- Zustand v5: Selektoren dürfen keine neuen Objekte/Arrays zurückgeben (`?? []`), sonst Render-Endlosschleife. E2E-Tests prüfen deshalb auf Laufzeitfehler.
- Feed: Zeit zählt aufs Tagesziel erst ab 10 gesehenen Snacks am Tag (gepuffert), wie §7.2 verlangt. Puls gibt es nur für Antworten, nie fürs Scrollen.
- Wiederholung: gespeicherte Kerngedanken kommen automatisch in die Spaced Repetition („Weißt du es noch?“, Selbsteinschätzung).
