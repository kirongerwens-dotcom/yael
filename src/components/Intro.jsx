import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const scenes = [
  {
    text: "Seit dem 9. April.",
    eyebrow: "Für dich.",
    kind: "normal",
    hint: true,
  },
  {
    text: "176",
    sub: "Tage",
    kind: "number",
  },
  {
    text: "≈ 528",
    sub: "Stunden",
    kind: "number",
  },
  {
    text: "31.680",
    sub: "Minuten",
    kind: "number",
  },
  {
    text: "1.900.800",
    sub: "Sekunden",
    kind: "number",
  },
  {
    text: "Nächte. Tage.",
    sub: "Viel zu viele kleine Änderungen.",
    kind: "quiet",
  },
  {
    text: "Und in jeder einzelnen davon",
    sub: "habe ich an dich gedacht.",
    kind: "heart",
  },
  {
    text: "Jedes Wort auf dieser Seite",
    sub: "ist von ganzem Herzen geschrieben.",
    kind: "heart",
  },
  {
    text: "Für dich.",
    kind: "quiet",
  },
  {
    text: "14. Oktober 2026",
    eyebrow: "Ein Tag. Ein Mensch. Alles.",
    kind: "normal",
  },
  {
    text: "Heute wirst du 15.",
    kind: "normal",
  },
  {
    text: "Eigentlich wollte ich dir einfach nur etwas schenken.",
    kind: "normal",
  },
  {
    text: "Aber irgendwie war mir das zu wenig.",
    kind: "normal",
  },
  {
    text: "Also habe ich dir etwas gebaut.",
    kind: "normal",
  },
  {
    text: "Für Yael.",
    eyebrow: "Von Kiron. Für dich.",
    fine: "09.04.2026 — ∞",
    kind: "final",
  },
];

function Frame({ index, progress, scene, reduced }) {
  const count = scenes.length;
  const isFirst = index === 0;
  const isLast = index === count - 1;

  const sceneStart = index / count;
  const sceneEnd = (index + 1) / count;
  const sceneLength = sceneEnd - sceneStart;

  const fadeInEnd = sceneStart + sceneLength * 0.16;
  const holdEnd = sceneStart + sceneLength * 0.68;
  const fadeOutEnd = sceneStart + sceneLength * 0.88;

  const opacity = useTransform(
    progress,
    isFirst
      ? [0, holdEnd, fadeOutEnd, sceneEnd, 1]
      : isLast
        ? [0, sceneStart, fadeInEnd, 1]
        : [
            0,
            sceneStart,
            fadeInEnd,
            holdEnd,
            fadeOutEnd,
            sceneEnd,
            1,
          ],
    isFirst
      ? [1, 1, 0, 0, 0]
      : isLast
        ? [0, 0, 1, 1]
        : [0, 0, 1, 1, 0, 0, 0],
    { clamp: true },
  );

  const y = useTransform(
    progress,
    isLast
      ? [0, sceneStart, fadeInEnd, 1]
      : isFirst
        ? [0, holdEnd, fadeOutEnd, 1]
        : [
            0,
            sceneStart,
            fadeInEnd,
            holdEnd,
            fadeOutEnd,
            sceneEnd,
            1,
          ],
    isLast
      ? [24, 24, 0, 0]
      : isFirst
        ? [0, 0, -24, -24]
        : [24, 24, 0, 0, -24, -24, -24],
    { clamp: true },
  );

  const scale = useTransform(
    progress,
    [sceneStart, fadeInEnd, holdEnd, fadeOutEnd],
    scene.kind === "number"
      ? [0.94, 1, 1.025, 1.04]
      : [0.98, 1, 1, 1.01],
    { clamp: true },
  );

  return (
    <motion.div
      style={
        reduced
          ? {}
          : isLast
            ? { opacity, y, scale, zIndex: 10 }
            : { opacity, y, scale }
      }
      className={`intro-frame intro-frame-${scene.kind} ${
        reduced ? "static-frame" : ""
      }`}
    >
      {scene.eyebrow && <p className="eyebrow">{scene.eyebrow}</p>}

      <h1>{scene.text}</h1>

      {scene.sub && <p className="intro-sub">{scene.sub}</p>}

      {scene.hint && (
        <div className="scroll-hint">
          Scroll langsam weiter <span>↓</span>
        </div>
      )}

      {scene.fine && <span className="fine-date">{scene.fine}</span>}
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

        {scenes.map((scene, i) => (
          <Frame
            key={`${i}-${scene.text}`}
            scene={scene}
            index={i}
            progress={scrollYProgress}
            reduced={reduced}
          />
        ))}
      </div>
    </section>
  );
}
