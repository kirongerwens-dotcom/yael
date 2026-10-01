import { useState } from "react";
import { Section, Reveal } from "./Shared";
const dreams = [
  "mit dir ans Meer.",
  "mit dir nachts irgendwo sitzen und viel zu lange reden.",
  "mit dir reisen.",
  "mit dir Sonnenuntergänge anschauen.",
  "mit dir völlig unnötige Sachen kaufen.",
  "mit dir noch ganz viele erste Male erleben.",
  "mit dir Erinnerungen sammeln, über die wir Jahre später noch lachen.",
];
export default function Future() {
  const [place, setPlace] = useState(null);
  return (
    <>
      <Section
        id="ueberall"
        number="09"
        title="Noch so viel vor uns"
        className="future"
      >
        <Reveal>
          <p className="subtle">
            Ich habe dich gefragt, wohin du mit mir möchtest.
          </p>
          <h2>Deine Antwort:</h2>
        </Reveal>
        <div className="world" aria-label="Unsere möglichen Reiseziele">
          <div className="world-orbit orbit-one" />
          <div className="world-orbit orbit-two" />
          <div className="world-orbit orbit-three" />
          {["Spanien", "Venedig", "Abu Dhabi"].map((p, i) => (
            <button
              className={`destination destination-${i}`}
              onClick={() => setPlace(p)}
              key={p}
            >
              <i />
              {p}
            </button>
          ))}
          <span className="world-star star-one" />
          <span className="world-star star-two" />
          <span className="world-star star-three" />
          <span className="world-star star-four" />
        </div>
        <div className="destination-note" aria-live="polite">
          {place
            ? `${place}. Eines Tages zusammen?`
            : "Drei Orte. Und so viele Möglichkeiten."}
        </div>
        <Reveal>
          <p className="everywhere">Überall.</p>
          <p className="deal">Deal.</p>
        </Reveal>
      </Section>
      <Section id="mitdir" number="10" title="Ohne großen Plan" light>
        <Reveal>
          <h2>
            Mit dir
            <br />
            <em>möchte ich …</em>
          </h2>
        </Reveal>
        <div className="dreams">
          {dreams.map((d, i) => (
            <Reveal key={d} className="dream">
              <span>0{i + 1}</span>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="statement small">
            Eigentlich ist mir ziemlich egal, was wir machen. Solange du dabei
            bist.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
