import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { availableLetters, BIRTHDAY, berlinDate, nextCountdownTap } from '../data/birthday';
import { readStore, writeStore } from './Shared';
export function useBirthdayClock() {
 const [now, setNow] = useState(() => new Date());
 useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
 return { now, date: berlinDate(now) };
}
export function useCountdownPreview(onUnlock) {
 const state = useRef({ count: 0, started: 0 });
 return function tap(event) {
  if (event.button !== 0 || typeof onUnlock !== 'function') return;
  state.current = nextCountdownTap(state.current, performance.now());
  if (state.current.count === 10) {
   try { sessionStorage.setItem('yael-developer', '1'); } catch { /* Optional. */ }
   state.current = { count: 0, started: 0 }; onUnlock();
  }
 };
}
export function DailyLoveLetters({ date, archive = false }) {
 const letters = availableLetters(date);
 const [selected, setSelected] = useState(null);
 const active = letters.find(l => l.date === selected) || letters.at(-1);
 const [viewed, setViewed] = useState(() => readStore('yael-daily-viewed', []));
 useEffect(() => {
  if (!active) return;
  setViewed(previous => { const next = [...new Set([...previous, active.date])]; writeStore('yael-daily-viewed', next); return next; });
 }, [active]);
 if (!active) return null;
 const content = <div className="daily-letters">
  <p className="eyebrow">Ein paar Worte für dich</p>
  <nav aria-label="Kleine Briefe nach Datum" className="daily-tabs">{letters.map(l => <button key={l.date} aria-pressed={l.date === active.date} onClick={() => setSelected(l.date)}>{Number(l.date.slice(-2))}. Okt.{viewed.includes(l.date) ? '' : ' ·'}</button>)}</nav>
  <AnimatePresence mode="wait"><motion.article id="daily-letter-card" data-letter-date={active.date} key={active.date} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
   <p className="tiny">{active.date === date ? 'Heute · ' : ''}{Number(active.date.slice(-2))}. Oktober</p>
   <p className="daily-text">{active.text}</p><p className="signature">Dein Kiron</p>
  </motion.article></AnimatePresence>
 </div>;
 return archive ? <details id="daily-archive" className="daily-archive"><summary>Die Tage vor deinem Geburtstag</summary>{content}</details> : content;
}
export default function BirthdayGate({ now, date, onUnlock }) {
 const countdownTap = useCountdownPreview(onUnlock);
 const seconds = Math.max(0, Math.floor((new Date('2026-10-14T00:00:00+02:00') - now)/1000));
 const units = [[Math.floor(seconds/86400),'Tage'],[Math.floor(seconds/3600)%24,'Stunden'],[Math.floor(seconds/60)%60,'Minuten'],[seconds%60,'Sekunden']];
 return <main className="birthday-gate"><div className="gate-glow" aria-hidden="true"/><p className="eyebrow">Für Yael · 14. Oktober 2026</p><h1>Am 14. hast du das Warten hinter dir.</h1><p className="subtle">Dann siehst du, was dich hier erwartet.</p><div className="countdown" onClick={countdownTap} style={{userSelect:'none',WebkitUserSelect:'none',touchAction:'manipulation'}} role="timer" aria-label={`Noch ${units.map(([n,l])=>`${n} ${l}`).join(', ')}`}>{units.map(([n,label])=><div key={label}><strong>{String(n).padStart(2,'0')}</strong><span>{label}</span></div>)}</div><DailyLoveLetters date={date}/><span className="fine-date">09.04.2026 — ∞</span></main>;
}
export { BIRTHDAY };
