import { useEffect, useState } from 'react';
import { productionAnalyticsAllowed } from '../analytics/config';
import { startAnalytics, stopAnalytics, revokeAnalytics } from '../analytics/runtime';
const KEY='yael-analytics-consent', VERSION='2026-10-04';
function stored(){try{const value=JSON.parse(localStorage.getItem(KEY));return value?.version===VERSION&&['yes','no'].includes(value.decision)?value.decision:null;}catch{return null;}}
export default function Analytics({developer}){
 const [decision,setDecision]=useState(stored),[editing,setEditing]=useState(false),[notice,setNotice]=useState('');
 useEffect(()=>{
  if(developer||decision!=='yes'||!productionAnalyticsAllowed())return;
  let disposed=false;
  void startAnalytics().then(stop=>{if(disposed)stop();}).catch(()=>{});
  return()=>{disposed=true;stopAnalytics();};
 },[developer,decision]);
 useEffect(()=>{
  const sync=e=>{if(e.key===KEY){const next=stored();if(next!=='yes')void revokeAnalytics();setDecision(next);}};
  window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 async function choose(next){
  if(next==='no'){const deletion=revokeAnalytics();setNotice('Die Messung ist ausgeschaltet.');void deletion.then(ok=>{if(!ok)setNotice('Die Messung ist aus. Die laufende Aufzeichnung konnte wegen eines Verbindungsfehlers nicht gelöscht werden. Bitte kontaktiere mich über die Datenschutzangaben.');});}
  try{localStorage.setItem(KEY,JSON.stringify({version:VERSION,decision:next}));}catch{setNotice('Deine Entscheidung gilt hier. Der Browser konnte sie für den nächsten Besuch nicht speichern.');}
  setDecision(next);setEditing(false);
 }
 const contact=import.meta.env.VITE_PRIVACY_CONTACT;
 if(developer||!contact)return null;
 return <aside className={`analytics-choice ${decision&&!editing?'analytics-choice--quiet':''}`} aria-label="Datenschutz">
 {(!decision||editing)?<div className="analytics-choice-card"><p className="eyebrow">Eine kleine Frage ♡</p><h2>Darf diese Seite deinen Weg festhalten?</h2><p>Wenn du zustimmst, wird gemessen, welche Teile du ansiehst und öffnest – und ungefähr, wie lange du die Seite aktiv nutzt. So bleibt sichtbar, welche kleinen Momente du erkundet hast.</p><p className="tiny">Freiwillig. Ohne Zustimmung kannst du alles erleben. Keine Wiedererkennung zwischen Besuchen. Du kannst deine Entscheidung jederzeit unter „Datenschutz“ ändern.</p><div className="analytics-choice-buttons"><button onClick={()=>choose('yes')}>Ja ♡</button><button onClick={()=>choose('no')}>Lieber nicht</button></div></div>:<button className="privacy-link" onClick={()=>setEditing(true)}>Datenschutz · Entscheidung ändern</button>}
 <details className="analytics-information"><summary>Datenschutzinformationen</summary><p>Mit deiner Einwilligung werden anonyme Sitzungen, besuchte Abschnitte, Scrollfortschritt, geöffnete Briefe und Nachrichten, entdeckte Herzen, Kartenfortschritt und ungefähre aktive Zeiten in Firebase/Firestore gespeichert. Verborgene Tabs zählen nicht als Lesezeit. Keine Werbetracker, Gerätefingerprints oder präzisen Ortsdaten.</p><p>Die zufällige Sitzungskennung bleibt nur im Arbeitsspeicher. Gespeichert wird im Browser allein deine Ja-/Nein-Entscheidung. Zugriff auf die Aufzeichnungen hat nur der freigegebene Administrator. Aufbewahrung: höchstens 30 Tage zuzüglich der technischen Löschverzögerung von Firebase TTL.</p><p>Du kannst hier jederzeit „Lieber nicht“ wählen. Die Messung stoppt sofort und die laufende Aufzeichnung wird nach Möglichkeit gelöscht. Frühere anonyme Sitzungen lassen sich ohne Wiedererkennung nicht automatisch zuordnen. Widerruf ändert nicht die Rechtmäßigkeit der bisherigen Verarbeitung. Firebase/Google verarbeitet technische Verbindungsdaten für den Betrieb; die Anwendung speichert keine IP-Adressen.</p><p>Verantwortlicher, Kontakt und Auskunft/Löschanfragen: {contact} Rechtsgrundlage: Einwilligung (Art. 6 Abs. 1 lit. a DSGVO und § 25 TDDDG). Du kannst dich außerdem bei einer Datenschutzaufsichtsbehörde beschweren.</p></details>
 {notice&&<p className="tiny" role="status">{notice}</p>}
 </aside>;
}
