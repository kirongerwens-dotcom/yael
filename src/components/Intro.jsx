import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
const lines = [
  "14. Oktober 2026",
  "Heute wirst du 15.",
  "Eigentlich wollte ich dir einfach nur etwas schenken.",
  "Aber irgendwie war mir das zu wenig.",
  "Also habe ich dir etwas gebaut.",
  "Für Yael.",
];
function Frame({ index, progress, text, reduced }) {
  const opacity = useTransform(
    progress,
    [
      Math.max(0, (index - 0.25) / 6),
      index / 6,
      (index + 0.7) / 6,
      (index + 1) / 6,
    ],
    [index === 0 ? 1 : 0, 1, 1, 0],
  );
  const y = useTransform(progress, [index / 6, (index + 1) / 6], [0, -35]);
  return (
    <motion.div
      style={reduced ? {} : { opacity, y }}
      className={`intro-frame ${reduced ? "static-frame" : ""}`}
    >
      <p className="eyebrow">
        {index === 0
          ? "Ein Tag. Ein Mensch. Alles."
          : index === 5
            ? "Von Kiron. Für dich."
            : ""}
      </p>
      <h1>{text}</h1>
      {index === 0 && (
        <a className="scroll-hint" href="#beginn">
          Scroll langsam weiter <span>↓</span>
        </a>
      )}
      {index === 5 && <span className="fine-date">09.04.2026 — ∞</span>}
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
  return (
    <section
      ref={ref}
      className={`intro ${reduced ? "reduced-intro" : ""}`}
      aria-label="Dein Geburtstagsgeschenk"
    >
      <div className="intro-stage">
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
    </section>
  );
}
