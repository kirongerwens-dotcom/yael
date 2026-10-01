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
  const count = lines.length;

  // Jede Szene besitzt exakt 1/6 der gesamten Intro-Strecke.
  const sceneStart = index / count;
  const sceneEnd = (index + 1) / count;
  const sceneLength = sceneEnd - sceneStart;

  const fadeIn = sceneStart + sceneLength * 0.16;
  const holdUntil = sceneStart + sceneLength * 0.64;
  const fadeOut = sceneStart + sceneLength * 0.82;

  // Wichtig:
  // Der komplette 0→1-Bereich ist definiert.
  // Dadurch kann kein anderer Frame außerhalb seiner Szene sichtbar bleiben.
  const isLast = index === count - 1;

  const opacity = useTransform(
    progress,
    index === 0
      ? [
          0,
          holdUntil,
          fadeOut,
          Math.min(1, sceneEnd),
          1,
        ]
      : isLast
        ? [
            0,
            sceneStart,
            fadeIn,
            1,
          ]
        : [
            0,
            sceneStart,
            fadeIn,
            holdUntil,
            fadeOut,
            sceneEnd,
            1,
          ],
    index === 0
      ? [1, 1, 0, 0, 0]
      : isLast
        ? [0, 0, 1, 1]
        : [0, 0, 1, 1, 0, 0, 0],
    { clamp: true },
  );

  const y = useTransform(
    progress,
    isLast
      ? [0, sceneStart, fadeIn, 1]
      : [
          0,
          sceneStart,
          fadeIn,
          holdUntil,
          fadeOut,
          sceneEnd,
          1,
        ],
    isLast
      ? [24, 24, 0, 0]
      : [24, 24, 0, 0, -24, -24, -24],
    { clamp: true },
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
        <div className="scroll-hint">
          Scroll langsam weiter <span>↓</span>
        </div>
      )}

      {index === 5 && (
        <span className="fine-date">09.04.2026 — ∞</span>
      )}
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
