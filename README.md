# YMPULS.

Persönliche Visual-Microlearning-App fürs iPhone: 2-Minuten-Lektionen in Bildern, ein Wissens-Feed im Reels-Format,
Quizze und ein Belohnungssystem rund um den roten Puls-Punkt. Instagram-Ersatz, nur dass man danach schlauer ist.

**App:** https://GITHUB_USER.github.io/ympuls-app/

## Aufs iPhone holen
1. **Safari** öffnen (nicht Chrome) und die URL oben aufrufen.
2. Unten auf **Teilen** tippen (Quadrat mit Pfeil).
3. **„Zum Home-Bildschirm“** wählen.
4. „Als Web-App öffnen“ aktiviert lassen, dann **Hinzufügen**.
5. YMPULS. über das neue Icon starten. Es läuft ohne Browser-Leisten und auch offline.

Tipp: Fortschritt liegt nur auf dem Gerät. Im Profil gibt es **Backup exportieren/importieren** und eine
**Lernzeit-Erinnerung als Kalender-Serie (.ics)**.

## Inhalte
6 Kurse (Geld-Grundlagen mit 19, Gewohnheiten, Ausdauer verstehen, Protein & Muskelaufbau, Wie KI-Sprachmodelle funktionieren,
Erste Kunden gewinnen), 3 Buch-Guides (Atomic Habits, The Psychology of Money, Deep Work), 5 Quick Reads
(Pareto, Sunk Cost, Parkinson, Opportunitätskosten, Dunning-Kruger) und 45 Feed-Snacks.

Neue Inhalte in Claude Code: `/neuer-kurs <Thema>`, `/buch "<Titel>"`, `/snacks 20`, `/kurs-aus-quelle quellen/<ordner>`, `/tageslektion`.

## Entwicklung
```
npm install
npm run dev        # lokal, auch im WLAN am iPhone (URL steht im Terminal)
npm run art        # content-src/ → content/ (JSON + SVG)
npm run validate   # Inhalte prüfen
npm run test       # Vitest
npm run e2e        # Playwright WebKit, iPhone 15 Pro, hell + dunkel → ./screenshots
npm run build
```
Push auf `main` veröffentlicht automatisch über GitHub Pages (`.github/workflows/deploy.yml`).
Details: `CLAUDE.md` (Spezifikation), `docs/decisions.md`, `docs/content-log.md`.
