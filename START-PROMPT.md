# Start-Prompt für Claude Code

## So startest du (3 Schritte, ~2 Minuten)
1. Den Ordner `ympuls-app` auf deinen Mac legen (z. B. `~/Projekte/ympuls-app`). Logo, Schriften und Farben liegen schon in `brand/`.
2. Terminal öffnen:
   ```
   cd ~/Projekte/ympuls-app
   claude --permission-mode acceptEdits
   ```
3. Den Prompt unten komplett einfügen und Enter drücken. Danach nur reagieren, wenn Claude Code fragt
   (z. B. GitHub-Login für die Veröffentlichung: `gh auth login`).

**Aufs iPhone holen** (wenn Claude Code fertig ist und dir die URL gibt): Safari → URL öffnen → Teilen → „Zum Home-Bildschirm“.
Zum Testen vorher geht auch `npm run dev`: Dann zeigt das Terminal eine Adresse, die du im selben WLAN am iPhone öffnest.

**Neue Inhalte später** (einfach in Claude Code eintippen):
- `/neuer-kurs Business Model Canvas für mein Trainingsangebot`
- `/buch "The Psychology of Money"`
- `/snacks 30`
- `/kurs-aus-quelle quellen/sportpsychologie-vl3` (vorher die Unterlagen in den Ordner `quellen/` legen)
- `/tageslektion`

---

## Prompt (kopieren)

```
Lies CLAUDE.md und docs/imprint-analyse.md vollständig. Das ist die verbindliche Spezifikation.
In brand/ liegen mein YMPULS.-Logo (Vektor), Signet, App-Icon, Schriften und die Farb-Tokens. Verwende genau diese.

Aufgabe: Baue die App „YMPULS.“ komplett, Phase 1 bis 8 aus CLAUDE.md Abschnitt 11, in einem Durchgang.
Zielgerät ist ausschließlich mein iPhone (installierte Web-App, Standalone).

Arbeitsweise:
- Arbeite autonom. Triff Detailentscheidungen selbst im Sinne der Spezifikation und notiere sie in docs/decisions.md.
- Leg zu Beginn eine Todo-Liste mit allen Phasen und Unterpunkten an und arbeite sie ab.
- Nach jeder Phase: npm run build, npm run test, npm run validate grün; Playwright-Screenshots mit WebKit im
  iPhone-15-Pro-Profil (hell und dunkel) ansehen, Layoutfehler beheben, dann git commit.
- Am meisten Sorgfalt in: Lektion-Player (7.4), Feed (7.2), Belohnungssystem (7.6) und Illustrationen (9).
  Die App soll sich anfühlen wie Instagram, nur dass man danach schlauer ist: flüssig, verspielt, viele kleine Erfolgsmomente.
- Lektionen müssen Spaß machen und leicht verständlich sein: Regeln aus Abschnitt 6 inklusive Selbstcheck strikt anwenden.
- In Phase 4 den Start-Katalog aus Abschnitt 10 mit dem Ablauf der Commands /neuer-kurs, /buch und /snacks erzeugen.
  Wenn das zu lange dauert, die dort beschriebene Minimalversion zuerst fertig und poliert machen, den Rest danach.
- Frag mich nur, wenn es ohne mich nicht weitergeht (z. B. GitHub-Login). Alles andere selbst lösen.

Am Ende: kurze Zusammenfassung (max. 10 Zeilen) mit der URL, wie ich die App aufs iPhone hole und welche Kurse drin sind.
```

---

## Falls etwas hakt (Mini-Prompts)
- **Bilder zu simpel:** `Die Illustrationen im Kurs <slug> wirken zu simpel. Überarbeite alle SVGs nach Stilguide Abschnitt 9: mehr Metapher-Szenen, klarere data-steps, Beschriftungen in Pills. Danach iPhone-Screenshots prüfen.`
- **Lektion langweilig:** `Die Lektion <slug> ist zu trocken. Überarbeite sie nach Abschnitt 6: stärkerer Hook, mehr Interaktion (Schätzfrage oder Swipe), ein echter Aha-Moment.`
- **Mehr Kick:** `Die Belohnungen fühlen sich zu schwach an. Verstärke Abschnitt 7.6: Haptik, Töne, Animationen bei Serie, Level-Up und Truhe. Teste auf dem iPhone (Standalone).`
- **Fortsetzen nach Abbruch:** `Lies CLAUDE.md und docs/decisions.md, prüfe git log und die Todo-Liste und mach an der nächsten offenen Phase weiter.`
