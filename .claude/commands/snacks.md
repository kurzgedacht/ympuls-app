---
description: Füllt den Feed mit neuen Wissens-Snacks auf
argument-hint: [Anzahl, Standard 20] [kategorie:…]
---

Erzeuge neue Feed-Snacks für YMPULS.: $ARGUMENTS (ohne Angabe: 20 Snacks, über alle Kategorien verteilt,
Lieblingskategorien aus den Standardeinstellungen etwas stärker gewichtet).

- Mischung: ca. 30 % Fakt mit Bild, 25 % „Mythos oder Fakt“ (swipe), 20 % Mini-Quiz oder Schätzfrage, 15 % Diagramm, 10 % Kurzanleitung oder Buch-Idee.
- Jeder Snack muss **ohne Vorwissen in 10–20 Sekunden** verständlich sein und einen kleinen Überraschungsmoment haben.
- Keine Dopplung mit vorhandenen Snacks (vorher `content/snacks/` durchsehen). Wenn es passt, `courseRef` auf einen bestehenden Kurs setzen.
- Bilder nach Stilguide (Abschnitt 9), bei Snacks mit 1–2 Schritten.
- Fakten mit Quelle recherchieren. Danach validate, 4 Stichproben-Screenshots im Feed, Build, Commit `content: add <n> snacks`.
