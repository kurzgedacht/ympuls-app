---
description: Erzeugt Tageslektionen (Daily Reads) für die nächsten 7 Tage
---

Erzeuge 7 Tageslektionen in `content/daily/<yyyy-mm-dd>.json` ab morgen (Europe/Berlin), jeweils als Quick-Read-Lektion
(8–10 Karten, mindestens 1 interaktive Karte, mindestens 1 Kerngedanke) mit SVGs nach Stilguide.
Rotiere die Kategorien (Finanzen, Persönlichkeitsentwicklung, Sport, Ernährung, Technik, Business, Bücher & Konzepte),
keine Dopplungen mit bestehenden Kursen. Regeln aus CLAUDE.md Abschnitt 6 beachten.
Pro Tageslektion zusätzlich 1 Feed-Snack. Danach validate, Build, Commit `content: daily reads <von>–<bis>`.
