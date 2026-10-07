# Persönliche Kapitel

Neue Inhalte liegen in `src/components/PersonalWorld.jsx`. Die 15 Archiveinträge,
9 Beobachtungen und das ausdrücklich stilisierte Entwicklungsprotokoll können in
`src/data/personal.js` geändert werden. Die SVG-Motive sind selbst gezeichnete,
symbolische Illustrationen, keine Fotos oder Rekonstruktionen eines echten Henna-Musters.

## Entdeckungen

- `missing_items: 1` unter der Hose öffnet den kleinen Rückgabe-Vermerk.
- Nach Finale und Post-Finale folgen Credits. Der unscheinbare Code-Kommentar
  öffnet PROJECT YAEL. Es ist kein Admin-Zugang und hat keine Verbindung zum Developer Preview.
- `v1.0` enthüllt den letzten Satz.
- Bereits vorhandene Herzen/Entdeckungen bleiben in `yael-discoveries` erhalten.

## Lokales Erinnern

`yael-experience-memory` enthält nur hasVisited und visitCount. Eine leise Begrüßung
erscheint beim zweiten und fünften Öffnen der freigeschalteten Erfahrung.
`yael-completed` und `yael-project-discovered` speichern Fortschritt als boolesche Werte.
Diese Daten werden nicht an Firebase übertragen. Es gibt keine neue Besucher-ID.
Wenn Browser-Speicher gesperrt ist, funktioniert die Erfahrung weiter.

## Optionale Klänge

Unter dem Intro kann „Klänge aus“ bewusst eingeschaltet werden. Erst durch diesen
Klick wird ein AudioContext erstellt. Keine Musik, kein Autoplay, keine fremden
Audiodateien. Leise synthetische Töne begleiten Brief, Herzen, Making-of und Finale.
Der Schalter kann die Klänge jederzeit ausschalten. Seine Entscheidung wird nicht
persistiert: beim nächsten Laden sind Klänge wieder aus.

## Unveränderte Systeme

Analytics, Consent, Firebase-Regeln, privates Admin-Dashboard, Intro und Counter
sind erhalten. Neue persönliche Archivaktionen senden keine neuen Analytics-Events.
Bestehende Ereignisse bleiben erhalten. Developer Preview: zehn Countdown-Taps in
sechs Sekunden; Analytics bleiben ausgeschlossen. Bestehende Zählerwerte 528 /
31.680 / 1.900.800 im Intro bleiben erhalten; die spätere 580+-Sequenz ist separat.

## Überprüft

Produktionsbuild, ESLint, bestehende 12 Tests, Runtime-Consent-/Preview-Checks.
Chromium: 320, 375, 390, 430, 1440 und 1920 Pixel; zusätzlich reduzierte Bewegung
bei 375 Pixel. Archiv, Beobachtungen, Making-of-Dialog und Credits interaktiv geprüft.
Kein horizontaler Überlauf in den neuen Kapiteln. Die früheren Intro-Entfernungen
bleiben geprüft. Ein echter iOS-Safari-Gerätetest ist vor Übergabe empfohlen und
wurde in dieser Linux-Umgebung nicht durchgeführt.

Deployment bleibt über die vorhandene GitHub-Pages-Konfiguration mit `/yael/`.
Die Firebase-Konfiguration bleibt wie in `ANALYTICS_SETUP.md`. Keine neuen Secrets,
Abhängigkeiten oder Environment-Variablen erforderlich.
