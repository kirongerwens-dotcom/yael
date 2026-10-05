import { track } from "../analytics/runtime";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Section, Reveal, Modal, readStore, writeStore } from "./Shared";
import { reasons } from "../data/messages";
export default function LoveReasons() {
  const [selected, setSelected] = useState(null);
  const [found, setFound] = useState(() => readStore("yael-reasons", []));
  const reduced = useReducedMotion();
  function open(i) {
    track("love_reason_opened",String(i+1));
    setSelected(i);
    const next = [...new Set([...found, i])];
    setFound(next);
    writeStore("yael-reasons", next);
  }
  return (
    <Section
      id="liebe"
      number="05"
      title="Was ich an dir liebe"
      className="reasons"
    >
      <Reveal>
        <h2>
          Zwölf kleine Gründe.
          <br />
          <em>Für etwas viel Größeres.</em>
        </h2>
        <p className="subtle">
          Manche Dinge muss man berühren, um sie zu entdecken.
        </p>
      </Reveal>
      <div className="reason-grid">
        {reasons.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => open(i)}
            className={`reason-orb ${found.includes(i) ? "discovered" : ""}`}
            aria-label={`Liebesgrund ${i + 1} öffnen`}
            animate={reduced ? {} : { y: [0, -(5 + (i % 4)), 0] }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <span>{String(i + 1).padStart(2, "0")}</span>
            <span className="orb-glint" />
          </motion.button>
        ))}
      </div>
      <p className="reason-counter">
        {found.length} / 12 entdeckt <span>∞ gemeint</span>
      </p>
      {found.length === 12 && (
        <Reveal>
          <p className="statement small">
            Eigentlich könnte ich hier noch sehr lange weitermachen.
          </p>
          <p className="subtle">Vielleicht mache ich das auch.</p>
        </Reveal>
      )}
      {selected !== null && (
        <Modal
          title={`${String(selected + 1).padStart(2, "0")} / Was ich an dir liebe`}
          onClose={() => setSelected(null)}
        >
          <p className="modal-text">{reasons[selected]}</p>
          {selected === 11 && (
            <p className="subtle">
              Zwölf ist nur die Zahl der Knöpfe. Nicht die Zahl der Gründe.{" "}
              <span className="infinity">∞</span>
            </p>
          )}
          <button
            className="text-button"
            onClick={() => open((selected + 1) % 12)}
          >
            Noch einen entdecken
          </button>
        </Modal>
      )}
    </Section>
  );
}
