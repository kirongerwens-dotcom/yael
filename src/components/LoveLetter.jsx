import { motion, useReducedMotion } from "framer-motion";
import { useDiscovery } from "./Discoveries";
import { track } from "../analytics/runtime";
import { useState } from "react";
import { Mail, Heart } from "lucide-react";
import { Section, Reveal, readStore, writeStore } from "./Shared";
import { letter } from "../data/messages";
export default function LoveLetter() {
  const {discover}=useDiscovery();
  const reduced=useReducedMotion();
  const [open, setOpen] = useState(false);
  const [presses, setPresses] = useState(0);
  const [returning] = useState(() => readStore("yael-visited", false));
  const now = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Berlin",
  }).format(new Date());
  const birthday = now === "2026-10-14";
  const after = now > "2026-10-14";
  function openLetter() {
    track(open?"love_letter_closed":"love_letter_opened");
    setOpen(!open);
    writeStore("yael-visited", true);
  }
  const replies = [
    "Hier auf keinen Fall drücken.",
    "Ich wusste, dass du drückst.",
    "Ernsthaft?",
    "Yael.",
    "Okay. Ich liebe dich auch.",
  ];
  return (
    <Section
      id="brief"
      data-letter-open={open}
      number="11"
      title="Nur noch etwas"
      className="letter-section"
    >
      <Reveal>
        <h2>Bevor du gehst …</h2>
        <p className="subtle">Ein paar Worte, die bleiben.</p>
      </Reveal>
      <button
        className={`envelope ${open ? "is-open" : ""}`}
        onClick={openLetter}
        aria-expanded={open}
        aria-controls="liebesbrief"
      >
        <span className="envelope-fold" />
        <Mail size={28} />
        <span>Für Yael.</span>
        <span className="envelope-seal">K</span>
        <span className="envelope-label">
          {open ? "Brief wieder schließen" : "Deinen Brief öffnen"}
        </span>
      </button>
      {open && (
        <motion.article id="liebesbrief" className="letter-paper" initial={reduced?false:{opacity:0,y:60,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.9,delay:0.3}}>
          {letter.map((p, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "letter-greeting"
                  : i === letter.length - 1
                    ? "letter-signature"
                    : ""
              }
            >
              {p}
            </p>
          ))}
        <svg className="written-signature" viewBox="0 0 240 70" role="img" aria-label="Kiron"><motion.path d="M20 55L35 10M28 35L65 12M28 35Q48 40 61 58M74 35L69 56M78 22L79 23M85 55L94 33Q108 28 107 38M113 43Q114 27 128 32Q145 36 134 52Q117 65 113 43M143 56L154 33L149 51Q170 20 177 37L173 55Q190 66 212 47" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" initial={{pathLength:reduced?1:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:2}}/></svg>
        </motion.article>
      )}
      <div className="ending">
        <Reveal>
          <p>
            Du hast mir einmal gesagt, dass es eine Sache gibt, die ich niemals
            vergessen soll.
          </p>
        </Reveal>
        <Reveal>
          <h3>Dich.</h3>
        </Reveal>
        <Reveal>
          <p>Keine Sorge.</p>
        </Reveal>
        <Reveal>
          <h2>Ich liebe dich.</h2>
          <p className="fine-date">09.04.2026</p>
          <span className="infinity">∞</span>
        </Reveal>
      </div>
      <div className="afterword">
        <Heart size={18} />
        <p>
          {birthday
            ? "Heute ist dein Tag. Alles Liebe zum Geburtstag, Yael."
            : after
              ? "Diese Seite war eigentlich dein Geburtstagsgeschenk. Aber sie gehört dir immer noch."
              : "Für deinen 14. Oktober. Und alle Tage danach."}
        </p>
        {returning && <p className="tiny">Schön, dass du wieder da bist.</p>}
        <button
          className="forbidden"
          onClick={() => {setPresses(Math.min(4, presses + 1)); if(presses>=3)discover("forbidden");}}
        >
          {replies[presses]}
        </button>
        <a className="text-button" href="#brauchst">
          Zurück zu „Wenn du mich brauchst“
        </a>
        <p className="footer-note">Für dich. Von mir. Kiron.</p>
      </div>
    </Section>
  );
}
