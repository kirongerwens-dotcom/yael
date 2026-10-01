# Für Yael

Persönliches Geburtstagsgeschenk, React + Vite. Keine privaten Fotos, kein Backend und kein Ton. Die Texte und alle sichtbaren Bedienelemente sind deutsch.

## Lokal

Node.js 22 oder neuer installieren, dann im Projekt:

```sh
npm ci
npm run dev
```

Die angezeigte lokale Adresse mit `/yael/` öffnen.

```sh
npm run lint
npm run build
npm run preview
```

## GitHub Pages

1. Diese Projektdateien ins Repository `kirongerwens-dotcom/yael` übernehmen, vorhandene Änderungen vorher sichern.
2. Auf Branch `main` committen und pushen.
3. Auf GitHub unter **Settings → Pages → Build and deployment → Source** die Option **GitHub Actions** auswählen.
4. Unter **Actions** den Workflow „Website veröffentlichen“ prüfen. Nach erfolgreichem Lauf erscheint die Website unter `https://kirongerwens-dotcom.github.io/yael/`.

Vites `base` ist auf `/yael/` eingestellt. Der Workflow prüft Lint und Build, bevor er veröffentlicht. Eine eigene Domain ist nicht erforderlich.

## Aufbau

- `src/components/Intro.jsx`: scrollgesteuertes Intro, zugängliche Alternative bei reduzierter Bewegung.
- `src/components/Story.jsx`: Anfang, Entfernung, Treffen, digitale Tage, Augen und kleine Insider.
- `src/components/LoveReasons.jsx`: zwölf interaktive Gründe.
- `src/components/NeedMe.jsx`: sieben Kategorien, jeweils acht Texte, lokale Historie ohne Wiederholung innerhalb eines Durchgangs.
- `src/components/Future.jsx`: Reiseziele und gemeinsame Wünsche.
- `src/components/LoveLetter.jsx`: Brief und Abschluss, Datum in Europe/Berlin.
- `src/data/messages.js`: bearbeitbare Gründe, Nachrichten und Liebesbrief.
- `src/style.css`: Gestaltung, responsive Regeln und reduzierte Bewegung.

Die Seite ist vor dem Geburtstag vollständig zugänglich. Der Schlusshinweis ändert sich am 14.10.2026 und danach. Lokaler Speicher enthält nur entdeckte Elemente und Nachrichtenindizes. Die Seite bleibt ohne Speicher funktionsfähig. GitHub Pages ist öffentlich; `noindex` ist keine Zugangssperre.

## Prüfung dieser Version

Produktionsbuild und ESLint geprüft. Chromium-Prüfung bei 320, 375, 390, 768 und 1440 Pixel Breite: kein horizontaler Dokumentüberlauf und keine JavaScript-Laufzeitfehler. Zwölf Gründe, alle sieben Nachrichtenkategorien, Brief, Schlafen- und Roblox-Interaktion sowie der versteckte Mehrfachknopf geprüft. Reduzierte Bewegung geprüft. Ein Test auf echtem iPhone mit Safari steht noch aus.
