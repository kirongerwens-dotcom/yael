import { track, trackMapProgress } from "../analytics/runtime";
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useScroll, useReducedMotion } from 'framer-motion';
function Route({ progress }) {
 const left=useTransform(progress,[0,1],[75,300]), right=useTransform(progress,[0,1],[525,300]);
 const route=useTransform(progress,p=>`M${75+225*p} 90H${525-225*p}`);
 const opacity=useTransform(progress,[0.85,1],[1,0]);
 const merged=useTransform(progress,[0.85,1],[0,1]);
 return <svg viewBox="0 0 600 180" role="img" aria-label="Gütersloh und Krefeld, verbunden durch zwei Herzen"><path className="journey-guide" d="M0 35Q190 150 600 20 M0 130Q250 15 600 130 M130 0Q190 100 90 180 M450 0Q370 130 530 180"/><motion.path d={route} className="journey-route"/><motion.text x={left} y="103" textAnchor="middle" style={{opacity}}>♥</motion.text><motion.text x={right} y="103" textAnchor="middle" style={{opacity}}>♥</motion.text><motion.text x="300" y="103" textAnchor="middle" style={{opacity:merged}}>♥</motion.text><text className="city" x="75" y="158" textAnchor="middle">Gütersloh</text><text className="city" x="525" y="158" textAnchor="middle">Krefeld</text></svg>;
}
export function JourneyClimax() {
 const ref=useRef(null); const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']}); const reduced=useReducedMotion();
 const routeProgress=useTransform(scrollYProgress,[0,0.35],[0,1]); const mergedProgress=useMotionValue(1);
 const first=useTransform(scrollYProgress,[0.3,0.45,0.62,0.72],[0,1,1,0]); const second=useTransform(scrollYProgress,[0.65,0.78,1],[0,1,1]);
 return <section id="journey-climax" ref={ref} className={`journey-climax ${reduced?'journey-reduced':''}`} aria-label="Unser Weg zueinander"><div className="journey-stage"><p className="eyebrow">0 km</p><Route progress={reduced?mergedProgress:routeProgress}/><div className="journey-lines"><motion.h2 style={reduced?{}:{opacity:first}}>Und dann haben wir uns am Ende doch gefunden.</motion.h2><motion.h2 style={reduced?{}:{opacity:second}}>Und das war der schönste Tag in meinem Leben.</motion.h2></div></div></section>;
}
export default function DistanceJourney() {
 const progress=useMotionValue(0), visible=useMotionValue(1), width=useMotionValue(160), height=useMotionValue(76), topPosition=useMotionValue(8), rightPosition=useMotionValue(12);
 const distance=useTransform(progress,p=>`${Math.round(142*(1-p))} km`);
 useEffect(()=>{
  let raf=0;
  function update(){raf=0;const end=document.getElementById('journey-climax');const letter=document.getElementById('brief');if(!end||!letter)return;
   const top=end.getBoundingClientRect().top+window.scrollY;
   const nextProgress=Math.max(0,Math.min(1,window.scrollY/Math.max(1,top)));
   progress.set(nextProgress);
   trackMapProgress(nextProgress*100);
   if(nextProgress>=1)track("map_completed");
   const expand=Math.max(0,Math.min(1,(window.scrollY-top+window.innerHeight)/window.innerHeight));
   const initialWidth=window.innerWidth<600?126:160;
   width.set(initialWidth+(window.innerWidth-48-initialWidth)*expand);height.set(76+(window.innerHeight*0.8-76)*expand);topPosition.set(8+(window.innerHeight*0.1-8)*expand);rightPosition.set(12+12*expand);visible.set(expand<0.85?1:Math.max(0,(1-expand)/0.15));
  }
  const schedule=()=>{if(!raf)raf=requestAnimationFrame(update);};
  update();window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);
  const observer=new ResizeObserver(schedule);observer.observe(document.body);
  return()=>{cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
 },[progress,visible,width,height,topPosition,rightPosition]);
 return <motion.aside className="journey-mini" style={{opacity:visible,width,height,top:topPosition,right:rightPosition}} aria-label="Unser Weg"><Route progress={progress}/><motion.span>{distance}</motion.span></motion.aside>;
}
