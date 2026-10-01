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
  const segment = 1 / lines.length;
  const start = index * segment;

  // Jeder Satz bekommt eine eigene Phase:
  // erscheinen -> in der Mitte stehen -> verschwinden -> kurze Pause
  const fadeInEnd = start + segment * 0.18;
  const holdEnd = start + segment * 0.62;
  const fadeOutEnd = start + segment * 0.82;

  const opacity = useTransform(
    progress,
    index === 0
      ? [
          0,
          start + segment * 0.58,
          start + segment * 0.78,
          start + segment * 0.82,
        ]
      : [start, fadeInEnd, holdEnd, fadeOutEnd],
    index === 0 ? [1, 1, 0, 0] : [0, 1, 1, 0],
  );

  const y = useTransform(
    progress,
    [start, fadeInEnd, holdEnd, fadeOutEnd],
    [28, 0, 0, -28],
  );

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
