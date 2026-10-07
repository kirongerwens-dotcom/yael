import { track } from "../analytics/runtime";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Modal, readStore, writeStore, Reveal } from './Shared';
import { useExperienceSound } from "./ExperienceSound";
const DiscoveryContext = createContext(null);
export function Discoveries({ children }) {
 const [found, setFound] = useState(() => { const value=readStore('yael-discoveries', []); return Array.isArray(value) ? value.filter(x=> typeof x==='string') : []; });
 const discover = useCallback((id) => { setFound(previous => { const next=[...new Set([...previous,id])]; writeStore('yael-discoveries',next); return next; }); }, []);
 const hearts = found.filter(x => /^heart-[1-5]$/.test(x)).length;
 return <DiscoveryContext.Provider value={{found,discover,hearts}}>{children}<span className="heart-progress" aria-label={`${hearts} von fünf Herzen entdeckt`}>{hearts===5?'♥':'♡'} {hearts}/5</span></DiscoveryContext.Provider>;
}
export function HiddenHeart({ id }) {
 const play=useExperienceSound();
 const { found, discover } = useContext(DiscoveryContext);
 return <button className={`hidden-heart ${found.includes(`heart-${id}`)?'found':''}`} aria-label="Ein kleines Herz" onClick={()=>{if(!found.includes(`heart-${id}`)){track("heart_found",`heart-${id}`);play("heart");}discover(`heart-${id}`);}}><motion.span animate={found.includes(`heart-${id}`)?{scale:[1,1.6,1]}:{}}>♥</motion.span></button>;
}
export function LongPress({ id, children, message }) {
 const {discover}=useContext(DiscoveryContext); const timer=useRef(null), origin=useRef(null); const [open,setOpen]=useState(false);
 const cancel=()=>clearTimeout(timer.current);
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 return <><div className="long-press" onPointerDown={e=>{if(e.button!==0)return; origin.current=[e.clientX,e.clientY];timer.current=setTimeout(()=>{discover(id);setOpen(true);},750);}} onPointerMove={e=>{if(origin.current && Math.hypot(e.clientX-origin.current[0],e.clientY-origin.current[1])>10)cancel();}} onPointerUp={cancel} onPointerCancel={cancel} onPointerLeave={cancel}>{children}</div>{open&&<Modal title="Nur für dich" onClose={()=>setOpen(false)}><p className="modal-text">{message}</p></Modal>}</>;
}
export function SecretSection() {
 const {hearts}=useContext(DiscoveryContext);
 useEffect(()=>{if(hearts===5)track('secret_unlocked');},[hearts]);
 if(hearts!==5)return null;
 return <section id="secret-surprise" className="chapter secret-section"><Reveal><p className="eyebrow">Du hast alle fünf gefunden.</p><h2>Ein kleines Extra.</h2><p className="subtle">Wenn wir uns das nächste Mal sehen, schulde ich dir eine Umarmung für jedes dieser Herzen. Du darfst mich daran erinnern. Ich habe vor, mir dafür Zeit zu nehmen.</p></Reveal></section>;
}
export function Finale() {
 const play=useExperienceSound();
 const {found,discover,hearts}=useContext(DiscoveryContext); const [hint,setHint]=useState(false);
 const incomplete=hearts<5 || !['date-secret','future-secret','post-finale','cat','cow','sleep','roblox','forbidden'].every(id=>found.includes(id));
 return <><section id="finale" className="birthday-finale"><motion.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}} onViewportEnter={()=>{setHint(true);play("finale");}}><p className="eyebrow">Happy Birthday, Yael.</p><h2>Ich liebe dich.</h2><p className="signature">Kiron</p>{hint&&incomplete&&<motion.p className="tiny" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3}}>P.S. Du hast noch nicht alles gefunden.</motion.p>}</motion.div></section><section id="post-finale" className="post-finale"><motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} onViewportEnter={()=>discover('post-finale')} viewport={{once:true}}><p>Du dachtest doch nicht wirklich, dass das alles war.</p><p className="subtle">Eine letzte Umarmung für den Weg. Und jetzt schreib mir, ich möchte wissen, wie du gerade lächelst.</p><span className="last-heart">♥</span></motion.div></section></>;
}
export function useDiscovery() { return useContext(DiscoveryContext); }
