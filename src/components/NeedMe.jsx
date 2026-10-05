import { track } from "../analytics/runtime";
import { useState } from "react";
import { Heart } from "lucide-react";
import { messages } from "../data/messages";
import { Section, Reveal, Modal, readStore, writeStore } from "./Shared";
export default function NeedMe() {
  const [current, setCurrent] = useState(null);
  function open(category) {
    const history = readStore("yael-message-history", {});
    const list = messages[category];
    let used = Array.isArray(history[category]) ? history[category] : [];
    let available = list.map((_, i) => i).filter((i) => !used.includes(i));
    if (!available.length) {
      const previous = used.at(-1);
      used = [];
      available = list.map((_, i) => i).filter((i) => i !== previous);
    }
    const index = available[Math.floor(Math.random() * available.length)];
    writeStore("yael-message-history", {
      ...history,
      [category]: [...used, index],
    });
    track("open_when_opened",`${Object.keys(messages).indexOf(category)}:${index}`);
    setCurrent({ category, text: list[index] });
  }
  return (
    <Section
      id="brauchst"
      number="08"
      title="Für heute. Und jeden anderen Tag."
      className="need-section"
    >
      <Reveal>
        <h2>
          Wenn du
          <br />
          <em>mich brauchst.</em>
        </h2>
        <p className="subtle">
          Komm auch nach deinem Geburtstag wieder hierher.
          <br />
          Ich habe dir ein paar Worte dagelassen.
        </p>
      </Reveal>
      <div className="need-options">
        {Object.keys(messages).map((label, i) => (
          <button onClick={() => open(label)} key={label}>
            <span className="option-number">0{i + 1}</span>
            <span><small className="open-when">Öffnen, wenn …</small>{label}</span>
            <span className="option-dot" />
          </button>
        ))}
      </div>
      {current && (
        <Modal title={current.category} onClose={() => setCurrent(null)}>
          {current.category === "Ich brauche eine Umarmung." && (
            <div className="hug" aria-hidden="true">
              <i />
              <i />
            </div>
          )}
          <Heart className="message-heart" size={24} />
          <p className="modal-text">{current.text}</p>
          <p className="signature">— Kiron</p>
          <button
            className="text-button"
            onClick={() => open(current.category)}
          >
            Noch ein paar Worte
          </button>
        </Modal>
      )}
    </Section>
  );
}
