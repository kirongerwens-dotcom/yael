import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { LongPress } from "./Discoveries";
import { writeStore } from "./Shared";
const lines = [
  "14. Oktober 2026",
  "Heute wirst du 15.",
  "Eigentlich wollte ich dir einfach nur etwas schenken.",
  "Aber irgendwie war mir das zu wenig.",
  "Also habe ich dir etwas gebaut.",
  "Ich kann dir heute zwar nichts Materielles geben, weil ich nicht bei dir sein kann. Aber eine Sache musste ich dir ja pünktlich schenken.",
  "investment",
  "Und ich würde jede einzelne Sekunde nochmal investieren.",
  "Für Yael.",
];
function Investment({ progress, reduced }) {
 const value=useTransform(progress,[6/lines.length,6.6/lines.length],[0,1]);
 const [fraction,setFraction]=useState(reduced?1:0);
 useEffect(()=>value.on('change',setFraction),[value]);
 return <div className="investment"><p className="eyebrow">176 Tage · jeden Tag drei Stunden</p>{[[528,'Stunden'],[31680,'Minuten'],[1900800,'Sekunden']].map(([n,label])=><p key={label}><strong>{Math.round(n*(reduced?1:fraction)).toLocaleString('de-DE')}</strong> <span>{label}</span></p>)}</div>;
}
function Frame({ index, progress, text, reduced }) {
  const opacity = useTransform(
    progress,
    [
      Math.max(0, (index - 0.25) / lines.length),
      index / lines.length,
      (index + 0.7) / lines.length,
      (index + 1) / lines.length,
    ],
    [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const y = useTransform(progress, [index / lines.length, (index + 1) / lines.length], [0, -35]);
  const pointerEvents=useTransform(opacity,value=>value>0.5?"auto":"none");
  const dateDisplay = useTransform(progress, value => value < 1 / lines.length ? "block" : "none");
  return (
    <motion.div
      style={reduced ? {} : { opacity, y, pointerEvents }}
      className={`intro-frame ${index === 0 ? "intro-opening-frame" : text === "investment" ? "intro-investment-frame" : ""} ${reduced ? "static-frame" : ""}`}
    >
      <p className="eyebrow">
        {index === 0
          ? "Ein Tag. Ein Mensch. Alles."
          : index === lines.length - 1
            ? "Von Kiron. Für dich."
            : ""}
      </p>
      {text === "investment" ? <Investment progress={progress} reduced={reduced}/> : index === 0 ? <motion.h1 style={reduced ? {} : { display: dateDisplay }}><LongPress id="date-secret" message="Seit dem 9. April ist jeder Neunte ein kleines bisschen unser Tag."><span>{text}</span></LongPress></motion.h1> : <h1>{text}</h1>}
      {index === 0 && (
        <motion.a className="scroll-hint" href="#beginn" style={reduced ? {} : { display: dateDisplay }}>
          <span className="intro-scroll-text">Scroll langsam weiter</span> <span className="intro-scroll-arrow">↓</span>
        </motion.a>
      )}
      {index === lines.length - 1 && <span className="fine-date">09.04.2026 — ∞</span>}
    </motion.div>
  );
}
export default function Intro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const reduced = useReducedMotion();
  const [timeLayoutActive, setTimeLayoutActive] = useState(false);
  useEffect(() => {
    const update = value => setTimeLayoutActive(value >= 5.75 / lines.length && value <= 7 / lines.length);
    update(scrollYProgress.get());
    return scrollYProgress.on('change', update);
  }, [scrollYProgress]);
  return (
    <section
      id="intro"
      ref={ref}
      className={`intro ${reduced ? "reduced-intro" : ""}`}
      aria-label="Dein Geburtstagsgeschenk"
    >
      <div className={`intro-stage ${timeLayoutActive && !reduced ? "intro-time-active" : ""}`}>
        <div className="intro-light" />
        <div className="dust" aria-hidden="true" />
        {lines.map((text, i) => (
          <Frame
            key={text}
            text={text}
            index={i}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </div>
      <motion.div onViewportEnter={()=>writeStore("yael-intro-seen",true)} className="intro-end"/>
    </section>
  );
}
