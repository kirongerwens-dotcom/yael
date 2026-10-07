import { createContext, useContext, useEffect, useRef, useState } from 'react';
const Context = createContext(()=>{});
const Controls = createContext({on:false,toggle:()=>{}});
export function SoundControls(){const {on,toggle}=useContext(Controls);return <div className="sound-control"><button onClick={toggle} aria-pressed={on} aria-label={on?"Optionale Klänge ausschalten":"Optionale Klänge einschalten"}>Klänge {on?"an":"aus"}</button><span>Nur kleine Töne. Keine Musik.</span></div>;}
export const useExperienceSound = () => useContext(Context);
export default function ExperienceSound({children}) {
 const context=useRef(null), enabled=useRef(false);
 const [on,setOn]=useState(false);
 useEffect(()=>()=>{context.current?.close().catch(()=>{});},[]);
 function play(kind='heart') {
  const audio=context.current;
  if(!enabled.current || !audio || audio.state!=='running' || document.hidden)return;
  const notes=kind==='letter'?[261.63,329.63]:kind==='project'?[392,523.25]:kind==='finale'?[261.63,392]:[523.25];
  notes.forEach((frequency,i)=>{const start=audio.currentTime+i*.12;const oscillator=audio.createOscillator(),gain=audio.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(.025,start+.025);gain.gain.exponentialRampToValueAtTime(.0001,start+.55);oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(start);oscillator.stop(start+.6);});
 }
 async function toggle(){
  if(enabled.current){enabled.current=false;setOn(false);await context.current?.suspend();return;}
  try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;context.current??=new Audio();await context.current.resume();enabled.current=true;setOn(true);}catch{enabled.current=false;setOn(false);}
 }
 return <Context.Provider value={play}><Controls.Provider value={{on,toggle}}>{children}</Controls.Provider></Context.Provider>;
}
