# Für Yael

Die bestehende React/Vite-Website wurde erweitert. Alle persönlichen Texte in `src/data/messages.js` sind bytegleich erhalten: zwölf Gründe, 56 Nachrichten und neun Briefabsätze. Alle ursprünglichen Abschnitte, Animationen und Insider bleiben vorhanden.

## Übernehmen und starten

Das ZIP entpacken. Den Inhalt des Ordners `yael` in den vorhandenen Projektordner kopieren und die gleichnamigen Dateien ersetzen. Vorher deine aktuelle Version sichern. `node_modules` und `dist` sind absichtlich nicht enthalten.

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

Die angezeigte Adresse mit `/yael/` öffnen. Für ein iPhone im gleichen WLAN stattdessen `npm run dev` starten und die LAN-Adresse des Macs mit `/yael/` öffnen.

```sh
npm run lint
npm run build
npm run preview -- --host 127.0.0.1
```

Vites vorhandenes `base: '/yael/'` bleibt unverändert. Im Upload war kein `.github`-Ordner vorhanden. Der beiliegende `deploy.yml` ergänzt den in der ursprünglichen README beschriebenen Pages-Workflow. Wenn dein Repository bereits einen funktionierenden Pages-Workflow besitzt, behalte diesen und füge keinen zweiten hinzu. GitHub Pages muss unter Settings → Pages auf GitHub Actions eingestellt sein. Hier wurde nichts auf GitHub gepusht oder veröffentlicht.

## Ergänzungen

- Countdown bis 14.10.2026, 00:00 Uhr Europe/Berlin. Neue Mini-Briefe vom 4. bis 13. Oktober, bisherige Briefe bleiben auswählbar. Danach bleibt die Seite zugänglich und das Archiv erscheint unten als aufklappbare Erinnerung.
- Unsichtbare Testfreischaltung: innerhalb von zehn Sekunden links oben, rechts oben, rechts unten, links unten und dieselbe Runde noch einmal. Die 48-Pixel-Ecken beobachten Pointer-Ereignisse, ohne andere Bedienelemente zu blockieren. Falsche Ecke oder Zeitüberschreitung setzt zurück. Die Freischaltung bleibt nur in sessionStorage; der normale Entdeckungsfortschritt wird davon nicht verändert.
- Kleine SVG-Karte, symbolische Anfangsentfernung 142 km. Die Strecke verkürzt sich bis zur Sequenz direkt vor dem Brief. Die Karte vergrößert sich; beide Herzen treffen sich vor den beiden neuen Sätzen. Normales Scrollen bleibt immer möglich, ohne Scrollsperre.
- Fünf kleine Herzen, lokaler Fortschritt, geheime Umarmungsnachricht nach dem fünften Fund. Bestehende Insider bleiben erhalten.
- Zwei versteckte 750-ms-Interaktionen: das kleine feste Datum oben im Intro und „Deal.“ im Reiseabschnitt. Bewegung über zehn Pixel bricht ab, damit Scrollen nicht aus Versehen auslöst.
- Briefpapier kommt nach dem Öffnen des Umschlags hervor, Kirons Signatur wird als SVG geschrieben. Der ursprüngliche Brieftext bleibt erhalten.
- Ergänzte konkrete Zukunftsmomente, „Öffnen, wenn …“-Darstellung der vorhandenen sieben Nachrichtenkategorien, einfache Geburtstags-Finale und kleine Überraschung beim Weiterscrollen.
- Wiederkehrende Besucher können nach dem ersten Öffnen des Briefs direkt zu „Unser Anfang“ springen. Das Intro wird nicht automatisch übersprungen. Reduzierte Bewegung zeigt eine lesbare statische Alternative.

## Neue Texte / Werte

Neue Mini-Briefe: `src/data/birthday.js`. Neue Überraschungen und Finale: `src/components/Discoveries.jsx`. Ergänzte Zukunftswünsche: `src/components/Future.jsx`.

Im gelieferten Intro gab es keine Zeitstatistik. Ergänzt sind 176 Tage × 3 Stunden = 528 Stunden = 31.680 Minuten = 1.900.800 Sekunden, mit animiertem Zähler. Das ist eine Darstellung deiner genannten täglichen Zeit, keine gemessene Programmierzeit. Die Kartenkilometer sind eine stilisierte Erzählung und keine Navigationsberechnung.

Die vorhandene Rosen/Lilien-Nachricht erwähnt weiterhin „liegt manches gerade vor dir“, da persönliche Texte nicht überschrieben wurden. Wenn du am Geburtstag nicht dort bist und nichts vor ihr liegt, kannst du diesen Satz in `Story.jsx` selbst anpassen.

## Prüfung

ESLint ohne Fehler oder Warnungen und Vite-Produktionsbuild bestanden. Separat geprüft: Berliner Mitternacht, Freischaltungen 4.–14. Oktober, keine früher angezeigten Zukunftsbriefe, vergangene Briefe, Eckensequenz, falsche Ecke und Zeitüberschreitung, Inhaltszahlen und unveränderter Originaltext. React-Serverrendering geprüft für Countdown, Geburtstag, spätere Besuche, Sessionfreischaltung und gespeicherte fünf Herzen.

Eine visuelle Browserprüfung war in der Ausführungsumgebung blockiert. iPhone Safari, schmale Layouts, die tatsächlich abgespielten Animationen, Touchgesten und Reload-Verhalten müssen noch im Browser geprüft werden. CSS verwendet svh, Safe Areas und eine Alternative für reduzierte Bewegung; dies ersetzt keinen Gerätetest.

Für den Gerätetest: Countdown ansehen, acht Ecken tippen, scrollen bis zum Brief, Brief öffnen, Herzen suchen, neu laden, Datum/Deal lange drücken und das Finale weiterscrollen. Auf einem neuen Tab oder nach Entfernen von `yael-developer` aus sessionStorage wird wieder die normale Datumssperre verwendet.

## Zusätzliche private Analytics

Siehe `ANALYTICS_SETUP.md`. Ein kleiner inline gestalteter Einwilligungsabschnitt startet die Messung ausschließlich nach „Ja ♡“. „Lieber nicht“ lässt das ganze Geschenk nutzbar. Die gespeicherte Entscheidung kann unter Datenschutz geändert werden. Das separate Dashboard unter `/yael/admin.html` verlangt Google/Firebase Authentication und den serverseitigen Admin-Claim. Firebase-Konfiguration, Regeln, Index, TTL und Kontaktangaben müssen vor Veröffentlichung eingerichtet werden. Alle Geburtstagserweiterungen bleiben erhalten.
