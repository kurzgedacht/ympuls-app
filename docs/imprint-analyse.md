# Imprint – Produktanalyse (Referenz für den Nachbau)

Stand: November 2026. Quellen: App-Store- und Play-Store-Screenshots (selbst gesichtet), Store-Beschreibung,
die dokumentierten 114 In-App-Screens bei screensdesign.com, Reviews (Headway-Blog, Trustpilot, App Store).
Imprint ist von Polywise, Inc. (NY), seit 2019, iOS/iPad/Android/Mac/Vision Pro, nur Englisch.

> Hinweis: Wir übernehmen **Mechanik und UX-Muster**, nicht Name, Logo, Illustrationen, Texte oder Farben von Imprint.

---

## 1. Kernidee in einem Satz
„Replace scrolling with microlearning“: Wissen (Psychologie, Philosophie, Finanzen, Geschichte, Gesundheit,
Buchzusammenfassungen) als **illustrierte Tap-Story-Karten** in ~2-Minuten-Kapiteln, mit eingestreuten Mini-Quizzes,
XP, Streaks und gespeicherten „Key Insight“-Karten. Duolingo-Mechanik + Instagram-Story-Format + Sachbuchinhalt.

## 2. Content-Hierarchie
```
Kategorie (Psychology, Philosophy, Money & Career, Health, History, Science …)
└─ Kurs ("Interpersonal Dynamics", "Essential Philosophy", Buch-Guide "Atomic Habits")   ~120+ Kurse
   └─ Unit ("Unit 1 – Relationships Worth Having")      farbiger Header-Pill im Pfad
      └─ Lektion/Kapitel ("Lesson 1: The Key Ideas")      ~2 Minuten, 8–15 Karten
         └─ Karte (Text + Visual | Quiz | Key Insight)
```
Drei Formate: **Courses** (mehrere Units), **Quick Reads** (eine Lektion zu einem Konzept), **Visual Guides to Books**.
Zusätzlich „**Daily Read**“ auf dem Home-Screen (täglich wechselnde Kurzlektion).

## 3. Kartentypen (das Herzstück)
| Typ | Aufbau (aus Screenshots) |
|---|---|
| **Titelkarte** | „Lesson 1: The Key Ideas“, großes Illustrations-Motiv |
| **Story-Karte** | oben: Zurück-Chevron/X + Fortschrittsbalken (türkis, schmal). Darunter 2–4 Zeilen Text (≈40–60 Wörter, einzelne Wörter *kursiv* betont). Darunter großes Visual (≈ 60 % der Höhe). Visual baut sich **schrittweise** auf: Labels-Pills („RELAXATION“, „LOWER HEART RATE …“), Pfeile, Icons erscheinen nacheinander (animiert). |
| **Diagramm-Karte** | Flat-Chart (z. B. Adenosin-Kurve WACH/SCHLAF/WACH), dicke schwarze Achsen, eine Akzentkurve, Kapitälchen-Labels |
| **Konzeptbild** | Höhlengleichnis: Szene mit beschrifteten Ebenen („Reality“ / „Shadows of Reality“), Text-Frage darunter |
| **Quiz – Vergleich** | Frage + Visual, große Buttons „More“ / „Less“ (lila Pill), darunter schwarzer „Check Answer“-Button (disabled bis Auswahl) |
| **Quiz – Multiple Choice** | 2–4 Optionen, „Check Answer“ |
| **Quiz – Wahr/Falsch** | True/False, optional mit Vergleichskarte |
| **Quiz-Feedback** | richtig: grüner Banner + „+10 XP“ + Continue. falsch: rot, **richtige Antwort wird angezeigt**, keine Erklärung (Schwäche!) |
| **Key Insight** | Karte im Rahmen (Akzentfarbe), Visual + 1 Kernsatz in Weiß auf Schwarz, Label „Key Insight“; wird **automatisch gespeichert** → Toast „Card Saved“ |
| **Lesson Complete** | Badge-Icon (lila Quadrat oder grüne Raute mit Haken), „Lesson Complete!“, XP-Zahl groß in Grün (z. B. 24 / 80 XP), Kennzahlen-Karte, schwarzer Continue-Button |

**Navigation in der Lektion:** Tap rechts = weiter, Tap links = zurück (Tutorial zeigt Bildschirm mit vertikaler Trennlinie).
Pro Karte Aktionen: Like, Teilen (als Bild), Kommentar/Feedback („Tippfehler melden“, „Frage stellen“).

## 4. Screens & Navigation
Bottom-Tab-Bar mit 4 Tabs: **Home · Explore · Library · Profil**.

- **Home:** Streak-Tracker (Wochentage mit Flammen), „Weiterlernen“ = aktueller Kurs als **vertikaler Zickzack-Pfad**
  (Duolingo-artig): Unit-Header-Pill, Knoten als Rauten/Quadrate (erledigt = grün mit Haken, aktuell = lila Stern,
  gesperrt = grau mit Schloss), Popover „Start lesson“ mit lila Button. Kopfzeile: Kurstitel, XP-Zähler („200 XP“),
  Sterne-Zähler, „…“-Menü (speichern, teilen, download). Darunter: Daily Read-Karte, Empfehlungs-Karussell.
- **Explore:** „Explore All 120+ Courses“, farbige Kategorie-Chips (Psychology lila, Philosophy orange,
  Money & Career flieder, More blau), Sektion „New“ als 2-spaltiges Cover-Grid mit „NEW“-Badge, Suche mit Filter-Chips.
- **Library:** Tabs „All / To Read / Complete“, Kurs-Grid, Downloads; **Saved Cards**: Grid der gespeicherten
  Key-Insight-Karten, Sortierung „nach Titel / nach Thema“.
- **Profil:** Streaks & Goals-Modal, Account, Referral („7-Tage-Pass verschenken“).

## 5. Gamification & Retention
- **XP:** +10 pro richtiger Quizantwort, XP-Summe pro Lektion auf Lesson Complete.
- **Streak:** Aktivierung nach erster Lektion (Flamme), Wochenansicht, **Streak-Ziel** wählbar (z. B. 7 Tage),
  „You're on a 2-day streak!“ Screen mit Flammen pro Tag.
- **Tagesziel:** in Minuten (Onboarding: drei Stufen, z. B. „Quick“), Anzeige „2 von 10 Minuten“; Alternativ „Read 2 chapters“.
- **Unit-Badges** bei Abschluss.
- **Daily Quiz:** Wiederholungsfragen zu Gelerntem (Store-Text „challenging daily quizzes“). Echte Spaced Repetition ist laut Reviews schwach/unklar.
- **Push-Reminder** zur gewählten Lernzeit (Morgen/Mittag/Abend), Kalender-Sync für Lernsession.

## 6. Onboarding (25–36 Schritte, Ziel: Commitment vor der Paywall)
Splash → Welcome → Tracking-Erlaubnis → Feature-Karten → Quelle („Wie hast du uns gefunden“) → Geschlecht → Alter →
Interessen → je Interesse Unterthemen → Lernziel → Methodik-Erklärung (3 Säulen) → Testimonial → Tagesziel →
Bestätigung mit Pfad-Animation → Notification-Erlaubnis → Referral → Lernzeit → „Plan wird personalisiert“ (Ladebalken) →
**Paywall** (7-Tage-Trial, Jahres-/Monatsabo, „Save 48 %“) → Account → erste Lektion mit Tap-Tutorial.

## 7. Design-Sprache
- Flache, editoriale Vektor-Illustrationen, wenige Farben pro Bild, dicke Konturen, Kapitälchen-Labels in Pill-Rahmen,
  Papier-/Pastell-Hintergründe (Rosa, Flieder, Creme), Grain/Druck-Look.
- UI: weißer Hintergrund, sehr runde Buttons (Pill), Primär-Aktion schwarz, Auswahl lila, Erfolg grün, Fortschritt türkis.
- Geometrische Sans (ähnlich Gilroy/Circular), große Titel, viel Weißraum.
- 3D-artige „Münzen“ (Haken/Stern) als Belohnungs-Objekte.

## 8. Stärken / Schwächen (für unsere Version relevant)
**Stärken:** extrem niedrige Einstiegshürde (2 Min), Visuals tragen die Erklärung, saubere Gamification, Key-Insight-Sammlung.
**Schwächen laut Nutzern:** oberflächlich („wie TikTok, man lernt wenig“), Quiz-Feedback ohne Erklärung,
keine echte Wiederholung, aggressive Paywall/Trial, fester Katalog, nur Englisch.

**→ Unsere Verbesserungen:** eigene Themen auf Abruf (Claude erstellt Kurse), Deutsch, Erklärung bei falscher Antwort,
echte Spaced Repetition für Quizfragen + Key Insights, Tiefe wählbar, kein Paywall-/Tracking-Ballast.
