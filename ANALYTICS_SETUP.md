# Private Visits & Sessions – Einwilligung und Einrichtung

Das bestehende Geschenk bleibt vollständig erhalten. Neu ist ein kleiner, nicht blockierender Abschnitt mit gleichwertigen Antworten **„Ja ♡“** und **„Lieber nicht“**. Es gibt keinen schwebenden Banner und keinen Admin-Link im Geschenk. Die Erfassung startet ausschließlich nach Zustimmung, auf erlaubten Produktionshosts, mit vollständiger Firebase-Konfiguration und eingetragenem Datenschutzkontakt. Ohne eingetragene Kontaktangaben wird auch die Einwilligungsoberfläche noch nicht angezeigt. Die Firebase-Dienste sind hier noch nicht für dein reales Konto eingerichtet oder veröffentlicht.

## 1. Dashboard-Adresse

Mit der bestehenden GitHub-Pages-Basis `/yael/` lautet die separate Adresse:

**https://kirongerwens-dotcom.github.io/yael/admin.html**

Auf einem anderen Host entsprechend `https://DEIN_HOST/yael/admin.html`. `admin.html` ist ein eigener Vite-Buildeinstieg und funktioniert direkt beim Neuladen auf GitHub Pages. Kein zusätzlicher Router oder SPA-Rewrite erforderlich. Diese Adresse allein ist kein Zugriffsschutz.

## 2. Anmeldung

Öffne die Adresse und wähle **„Mit Google anmelden“**. Verwende ausschließlich das Google-Konto, das du als Administrator freigegeben hast. Die Anmeldung bleibt im Arbeitsspeicher; nach einem Neuladen ist eine erneute Anmeldung nötig. Ohne gültigen Claim verweigern sowohl die Oberfläche als auch Firestore das Lesen.

## 3. Firebase Authentication

Empfohlen: eigenes Firebase-Projekt für dieses Geschenk; Firestore in einer passenden EU-Region anlegen, etwa `eur3`. Projekt-Web-App registrieren. Unter Authentication → Sign-in method **Anonymous** (nur für Schreibrechte einer zugestimmten, kurzlebigen Sitzung) und **Google** (für dich) aktivieren. Unter Authentication → Settings → Authorized domains `kirongerwens-dotcom.github.io` und gegebenenfalls deine eigene Domain ergänzen. Für einen lokalen Test mit echtem separatem Testprojekt gegebenenfalls `localhost` autorisieren; der Besucherclient misst dort trotzdem nie. Keine Google-Analytics-Verknüpfung einschalten.

## 4. Dein Konto als einziger Administrator

Melde dich einmal mit deinem Google-Konto an. Ohne Freigabe zeigt das Dashboard deine Firebase UID; alternativ steht sie unter Authentication → Users. Auf einem vertrauenswürdigen lokalen Rechner:

```bash
npm install --prefix tools
node tools/grant-admin.mjs DEINE_FIREBASE_UID
```

Das Werkzeug verwendet Firebase Admin SDK / Application Default Credentials. Richte dafür außerhalb dieses Repositorys berechtigte Administrator-Credentials ein (z. B. Google-Cloud-ADC für dein Projekt). Eine gegebenenfalls verwendete Service-Account-Datei bleibt ausschließlich außerhalb des Repositorys; `GOOGLE_APPLICATION_CREDENTIALS` darf nur auf dem vertrauenswürdigen Rechner gesetzt werden. Niemals als `VITE_`-Variable, GitHub-Datei oder Frontend-Secret hinterlegen.

Das Werkzeug setzt den serverseitigen Custom Claim **`yaelAnalyticsAdmin: true`**, erhält bestehende Claims und akzeptiert nur ein bereits vorhandenes Google-Konto. Gewähre ihn nur deiner UID. Danach ab- und erneut anmelden. Die Security Rules vertrauen diesem serverseitigen Claim; ein im Browser gesetzter Wert reicht nicht. Vorhandene andere Freigaben im Projekt prüfen und gegebenenfalls den Analytics-Claim dort mit Admin SDK entfernen, wenn ausschließlich dein Konto Zugriff haben soll.

## 5. Firestore-Regeln, Index und Aufbewahrung

Für ein eigenes Geschenk-Projekt:

```bash
npx firebase-tools deploy --only firestore:rules,firestore:indexes --project DEINE_PROJEKT_ID
```

`firebase.json` verweist auf `firestore.rules` und `firestore.indexes.json`. Die Regeln erlauben:

- Lesen nur mit dem serverseitigen Admin-Claim und einem nicht anonymen Konto.
- Erstellen/aktualisieren nur der eigenen `yaelVisits/{anonymousAuthUid}`-Aufzeichnung, mit der festgelegten Datenstruktur und `consented: true`.
- Löschen nur der eigenen laufenden Aufzeichnung beim Widerruf; dadurch erhält der Besucher keine Leserechte.
- Sofortige irreversible Markierung `excluded: true` beim Developer Preview. Normale Updates sind auch regelbasiert zeitlich begrenzt.

**Wenn du ein vorhandenes Firebase-Projekt mit weiteren Anwendungen nutzt:** Nicht die ganze Datei über deine bestehenden Regeln deployen. Die Analytics-Funktionen und ausschließlich den `match /yaelVisits/{visitId}`-Block in deine tatsächlichen Regeln übernehmen; alle anderen Regeln erhalten. Weite vorhandene Wildcards dürfen kein Lesen/Schreiben dieser Collection erlauben, denn Firestore-Regeln werden mit ODER kombiniert. Die mitgelieferte Datei ist die eigenständige Projektvorlage, keine Kopie unbekannter vorhandener Cloud-Regeln.

Index: `excluded ASC`, `consented ASC`, `startedAt DESC`. Bestehende fremde Indexdefinitionen ebenfalls erhalten. In Firestore → TTL die **Collection Group `yaelVisits` / Feld `expiresAt`** als TTL-Richtlinie aktivieren. Ohne diese Console-Einstellung löscht Firestore nicht automatisch. Laufzeit 30 Tage; TTL-Löschung erfolgt asynchron und kann verzögert sein. Auswertungen beziehen sich auf aktuell gespeicherte einwilligende Sessions, keine ewige Gesamtstatistik. Optional automatische Bereinigung anonymer Authentication-Konten aktivieren, soweit dein Firebase-Tarif/Identity Platform dies unterstützt.

## 6. Umgebungsvariablen und Veröffentlichung

`.env.example` enthält die Vorlage. Für einen lokalen Produktionsbuild in `.env.local`, für den GitHub-Actions-Build unter Repository Settings → Secrets and variables → Actions → **Variables**:

| Variable | Inhalt |
|---|---|
| `VITE_FIREBASE_API_KEY` | öffentliche Firebase-Web-Konfiguration |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth-Domain deiner Web-App |
| `VITE_FIREBASE_PROJECT_ID` | dein Firebase-Projekt |
| `VITE_FIREBASE_APP_ID` | Firebase-Web-App-ID |
| `VITE_ANALYTICS_PRODUCTION_HOSTS` | `kirongerwens-dotcom.github.io`, weitere Hosts kommagetrennt |
| `VITE_PRIVACY_CONTACT` | vollständiger Name des Verantwortlichen und erreichbare Kontaktangaben, öffentlich sichtbar |
| `VITE_ANALYTICS_ENABLED` | `true`; der beiliegende Workflow setzt dies bereits, Zustimmung bleibt zusätzlich nötig |
| `VITE_FIREBASE_USE_EMULATORS` | nur lokaler Test: `true`; im Produktionsbuild ignoriert |

Die Firebase-Web-Konfiguration ist öffentlich; sie verleiht keine Adminrechte. Service-Account-Schlüssel, Admin-Passwörter und private Credentials gehören hier niemals hinein. Der frühere Schalter `VITE_ANALYTICS_CLIENT_LEGAL_CLEARANCE` entfällt: tatsächliche Einwilligung ist jetzt das zusätzliche Startkriterium.

Danach Build/Pages-Workflow ausführen. Umgebungsvariablen werden beim Build eingebunden; eine Änderung erfordert einen neuen Build. Firebase-Regeln und Auth-Provider müssen getrennt eingerichtet werden. Hier wurde nichts zu GitHub oder Firebase veröffentlicht.

## 7. Speicherung der Einwilligung

Nur `localStorage['yael-analytics-consent']` wird für diese Entscheidung verwendet, als `{version:'2026-10-04', decision:'yes'|'no'}`. Kein Zeitstempel, Besucherprofil oder Analytics-Identifier wird darin gespeichert. Eine neue Consent-Version fragt erneut. Bei blockiertem Browser-Speicher gilt die Auswahl nur für die aktuelle Seite und die Oberfläche erklärt das.

Die Session erhält nach Zustimmung eine frische `crypto.randomUUID()`. Firebase Anonymous Auth verwendet eine neue kurzlebige Berechtigung im RAM. Auch Firestore nutzt keinen persistenten Browsercache. Keine Cookies, Werbe-SDKs oder geräteübergreifende Wiedererkennung. Vor Zustimmung/Ablehnung erfolgt weder Analytics-Login noch Analytics-Session-Erstellung; die Ablehnung selbst wird nicht an Firebase übermittelt. Bestehende funktionale Geschenk-Speicherungen wurden unverändert erhalten und dienen nicht der Wiedererkennung durch Analytics.

## 8. Widerruf und Löschung

„**Datenschutz · Entscheidung ändern**“ öffnet den gleichen kleinen Abschnitt. Mit **„Lieber nicht“** stoppt die Sammlung synchron. Timer/Observer/Listener werden abgeschaltet, ein eventuell bereits laufender Schreibvorgang wird abgewartet und anschließend die laufende Aufzeichnung gelöscht, damit ein alter Schreibvorgang sie nicht wiederherstellt. Andere offene Tabs erhalten den Widerruf über das `storage`-Ereignis. Erst eine neue ausdrückliche Zustimmung erlaubt einen neuen Seitenlauf der Messung.

Bei einem Verbindungsfehler meldet die Oberfläche, dass die laufende Aufzeichnung noch nicht gelöscht werden konnte. Das ist keine heimliche weitere Sammlung. Frühere Seitenläufe sind wegen fehlender dauerhafter Kennung nicht automatisch zuordenbar. Für Auskunft/Löschung der früheren Aufzeichnungen: Kontakt über die sichtbaren Datenschutzangaben, anhand mitgeteilter Besuchszeit geeignete Datensätze prüfen und im Firebase Console löschen; gegebenenfalls sämtliche Aufzeichnungen dieses privaten Geschenks löschen. Keine nachträglichen Fingerprints oder neuen Identifikationsdaten erzeugen. Die TTL begrenzt zusätzlich die Aufbewahrung.

Ein Widerruf lässt die Rechtmäßigkeit der vorherigen Verarbeitung unberührt; er rechtfertigt aber nicht automatisch die weitere Speicherung zu widerrufenen Zwecken. Die Zuordnung/Löschanfragen müssen entsprechend geprüft werden. Rechtsgrundlagen, Firebase-Auftragsverarbeitung und gegebenenfalls Drittlandübermittlung sowie die konkrete Anwendbarkeit im persönlichen Kontext bleiben Verantwortlichkeiten des Betreibers. Bei Diensten an Minderjährige muss auch die Wirksamkeit der jeweiligen Einwilligung geprüft werden; eine Ja-Schaltfläche ersetzt diese Prüfung nicht. Vor Veröffentlichung die angezeigten Angaben mit deiner tatsächlichen Firebase-Konfiguration/Verarbeitung abgleichen.

Offizielle Grundlage der Gestaltung und Widerrufsbehandlung:

- https://www.datenschutzkonferenz-online.de/media/oh/20221130_OH_Telemedien_Version_1.1.pdf
- https://www.edpb.europa.eu/sites/default/files/files/file1/edpb_guidelines_202005_consent_en.pdf
- https://www.gesetze-im-internet.de/ttdsg/__25.html

## 9. Test ohne künstliche Produktionsbesuche

`npm run dev` auf localhost erzeugt **nie** Besuchsanalytics, auch bei gespeicherter Zustimmung. Die acht Ecken deaktivieren Analytics für den gesamten Seitenlauf; ein schon gestarteter Datensatz wird `excluded: true` und im Dashboard ausgefiltert. Ohne Netz kann auch diese Servermarkierung nicht garantiert werden: für deine eigenen Tests daher localhost/Development verwenden oder vor dem Produktionsbesuch die Zustimmung ablehnen. Ein bereits offline gestarteter Preview-Datensatz muss bei Bedarf manuell im Console entfernt werden.

Für ein gefülltes Dashboard ohne Produktionsdaten gibt es einen lokalen **`demo-yael`-Emulator**:

1. `npm install --prefix tools` (Firebase CLI und Admin SDK; Java für Emulator nötig).
2. Lokale `.env.local` mit `VITE_FIREBASE_PROJECT_ID=demo-yael`, `VITE_FIREBASE_API_KEY=demo-key`, `VITE_FIREBASE_AUTH_DOMAIN=demo-yael.firebaseapp.com`, `VITE_FIREBASE_APP_ID=demo-app`, `VITE_FIREBASE_USE_EMULATORS=true`. Niemals echte Projekt-Credentials für diesen Test benutzen.
3. Emulator starten: `tools/node_modules/.bin/firebase emulators:start --only auth,firestore --project demo-yael`.
4. Parallel `npm run dev`; `http://localhost:5173/yael/admin.html` öffnen. „Mit Google anmelden“ öffnet den lokalen Auth-Emulator mit einer fiktiven Google-Identität. Nach Anmeldung die angezeigte UID kopieren.
5. Nur gegen die lokalen Emulatoren:

```bash
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099 node tools/seed-demo.mjs DEINE_EMULATOR_UID
```

6. Im Dashboard ab-/anmelden. Das Werkzeug setzt nur im Emulator den Admin-Claim und legt sieben fiktive Demo-Sessions an. Es verweigert Ausführung ohne die exakten lokalen Emulator-Adressen; das Projekt ist fest `demo-yael`.

Für die automatisierten Akkumulator- und Übersichtsprüfungen: `npm run test:analytics`. Für die Security Rules:

```bash
tools/node_modules/.bin/firebase emulators:exec --only firestore --project demo-yael 'node tools/rules-check.mjs'
```

Tests: normale/unautorisierte/anonymous Zugriffe verweigert, Admin-Lesen erlaubt, fremde Änderungen/Löschung und Zusatzfelder verweigert, keine Erstellung ohne Zustimmung, Preview-Ausfilterung, eigener Widerruf. Countdown/Freischaltung weiterhin separat prüfen. Echte Browser-/iPhone-Safari- und reale Firebase-Anmeldung müssen nach Konfiguration noch geprüft werden; der Produktionsbuild ersetzt diese Prüfung nicht.

## 10. Rohdaten im Firebase Console

Firebase Console → dein Projekt → Firestore Database → Data → **`yaelVisits`**. Jedes Dokument entspricht einer einwilligenden Sitzung; der Dokumentname ist die nur für diesen Seitenlauf verwendete Auth-UID, `sessionId` die zufällige Sitzungskennung. `events` enthält echte Client-Zeitstempel; `startedAt`/`lastSeenAt` sind Server-Zeiten. `excluded: true` gehört nicht in reale Statistiken. Console-Zugriff benötigt deine Google-Cloud/Firebase-Projektberechtigung und wird separat von den Frontend-Security-Rules autorisiert.

## Messgrenzen

Heartbeat ca. alle 60 Sekunden bei sichtbarem Tab, wichtige Ereignisse gebündelt nach mindestens ca. 10 Sekunden, Scrollen nur im Speicher. Ausblenden wird bestmöglich zeitnah gespeichert. Unload/Netzabbrüche bleiben unzuverlässig; die letzten Sekunden können fehlen. Sichtbarer Tab ist keine nachgewiesene Aufmerksamkeit. Zeit wird jeweils dem überwiegend sichtbaren Abschnitt zugeordnet, Brieflesezeit nur bei geöffnetem Brief im überwiegend sichtbaren Briefabschnitt. Ereignisse werden auf 256 begrenzt; Zusammenfassungen laufen weiter. Tagesbriefe zählen, wenn der tatsächlich geöffnete Brief sichtbar ist. Ein vor Zustimmung geöffneter Inhalt wird nicht mit einer erfundenen früheren Öffnungszeit protokolliert. Messages, Open When und NeedMe gehören im vorhandenen Projekt zum gleichen Abschnitt `brauchst`; es wurde dafür kein neuer Geschenkabschnitt erfunden. Kategorien/Nachrichten werden nur als Indizes gespeichert, keine Nachrichtentexte.

Server-Request-Importe aus der früheren Option werden im einwilligungsbasierten Dashboard nicht als consenting Visits gezählt. Sicherheitsregeln ersetzen keine serverseitige Abuse-/Quota-Steuerung: beliebige öffentliche Clients können Anonymous Auth verwenden und eigene schema-konforme Fake-Sessions erzeugen. Bei Missbrauch sind serverseitige Validierung/Rate-Limits erforderlich, ohne dafür Fingerprinting einzubauen.

## Ausgeführte Prüfung

ESLint ohne Fehler/Warnungen, neun Node-Tests und Produktionsbuild bestanden. Zusätzlich wurden echte Firestore-Regeln im Emulator inklusive Erstellung, gedrosseltem Heartbeat, Admin-/Nicht-Admin-Lesen, Preview-Ausfilterung und Widerrufslöschung getestet. Auth-/Firestore-Demo-Seed mit sieben Sessions und Admin-Claim geprüft. Kontrollierte Laufzeittests prüfen Widerruf während Auth-Start und laufendem Schreibvorgang, erneute Zustimmung, sofortiges Abschalten der Listener und dauerhaft ausgeschlossene Preview. React-Rendering bestätigt die Auswahl im Countdown/am Geburtstag und alle großen Geschenkabschnitte auch nach Ablehnung. Die ursprünglichen persönlichen Texte sind bytegleich erhalten. Visuelle Prüfung und echte Produktionsanmeldung sind noch nicht durchgeführt.
