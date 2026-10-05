import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  MessageCircle,
  Camera,
  Phone,
  Cat,
  Moon,
  Gamepad2,
  Flower2,
} from "lucide-react";
import { Section, Reveal, Modal, readStore, writeStore } from "./Shared";
export function RelationshipStart() {
  return (
    <Section id="beginn" number="01" title="Ein Anfang" className="beginning">
      <Reveal>
        <h2 className="date-title">
          09<span>.</span>04<span>.</span>2026
        </h2>
        <p className="subtle">Ein Datum, das sich nach dir anfühlt.</p>
      </Reveal>
      <div className="fragments">
        {[
          "ein Chat.",
          "ein Anruf.",
          "noch ein Anruf.",
          "viel zu viele Snaps.",
          "irgendwann Vermissen.",
          "und plötzlich wir.",
        ].map((text, i) => (
          <Reveal key={text}>
            <p className={i === 5 ? "last-fragment" : ""}>{text}</p>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="statement">
          Seit diesem Tag bist du ein Teil von jedem meiner Tage.
        </p>
      </Reveal>
    </Section>
  );
}
export function Distance() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const reduced = useReducedMotion();
  return (
    <Section id="entfernung" number="02" title="Zwei Städte. Ein Wir." light>
      <Reveal>
        <h2>
          Du dort.
          <br />
          Ich hier.
          <br />
          <em>Wir trotzdem.</em>
        </h2>
      </Reveal>
      <div ref={ref} className="distance-map">
        <svg
          viewBox="0 0 600 260"
          aria-label="Eine Verbindung zwischen Gütersloh und Krefeld"
          role="img"
        >
          <path
            className="map-guide"
            d="M30 180Q250 0 570 80 M40 220Q310 80 550 220 M100 0Q80 160 210 260 M430 0Q360 190 500 260"
          />
          <motion.path
            className="connection"
            d="M120 185 C210 185 330 75 480 75"
            style={{ pathLength: reduced ? 1 : scrollYProgress }}
          />
          <circle cx="120" cy="185" r="7" />
          <circle cx="480" cy="75" r="7" />
          <text x="120" y="225" textAnchor="middle">
            Krefeld
          </text>
          <text x="480" y="48" textAnchor="middle">
            Gütersloh
          </text>
        </svg>
      </div>
      <Reveal>
        <p className="statement small">
          Manchmal liegen viele Kilometer zwischen zwei Menschen.
        </p>
        <p className="subtle">
          Und manchmal fühlt sich jemand trotzdem näher an als fast jeder
          andere.
        </p>
      </Reveal>
    </Section>
  );
}
export function TwoMeetings() {
  return (
    <Section id="treffen" number="03" title="Wenig ist relativ">
      <Reveal>
        <div className="giant-number">
          2
          <span>
            Treffen.
            <br />
            So viel dazwischen.
          </span>
        </div>
        <p className="statement">Bis heute haben wir uns zweimal gesehen.</p>
        <p className="subtle">Klingt nach wenig.</p>
      </Reveal>
      <div className="memory-pair">
        {["Das erste Mal.", "Und dann wieder du."].map((s, i) => (
          <Reveal key={s} className="memory">
            <span className="memory-light" />
            <span className="eyebrow">0{i + 1}</span>
            <h3>{s}</h3>
            <p>
              {i === 0
                ? "Dein bisheriges Lieblingsdate. Für mich ein Tag, zu dem ich in Gedanken immer wieder zurückkomme."
                : "Wieder kein Bildschirm zwischen uns. Und wieder viel zu schnell vorbei."}
            </p>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="statement small">
          Zwei meiner liebsten Tage dieses Jahres.
        </p>
        <p className="subtle">
          Und ich bin noch lange nicht fertig damit, Erinnerungen mit dir zu
          sammeln.
        </p>
      </Reveal>
    </Section>
  );
}
export function DigitalDays() {
  const items = [
    [MessageCircle, "guten morgen ❤️", "07:…"],
    [Camera, "ein Snap", "zwischendurch"],
    [Camera, "noch ein Snap", "immer noch zwischendurch"],
    [Camera, "ein komplett sinnloser Snap", "musste sein"],
    [Phone, "deine Stimme", "viel zu lange. zum Glück."],
    [Moon, "gute nacht ❤️", "eigentlich schon morgen"],
  ];
  return (
    <Section id="tage" number="04" title="Ein ganz normaler Tag" light>
      <Reveal>
        <h2>
          So wenig.
          <br />
          <em>So viel du.</em>
        </h2>
      </Reveal>
      <div className="digital-day">
        {items.map(([Icon, text, time], i) => (
          <Reveal className={`message-card message-${i % 2}`} key={text}>
            <Icon size={22} />
            <div>
              <p>{text}</p>
              <span>{time}</span>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <p className="statement small">
          Für andere wahrscheinlich nichts Besonderes.
        </p>
        <p className="subtle">
          Für mich sind das mittlerweile meine Tage mit dir.
        </p>
      </Reveal>
    </Section>
  );
}
export function Eyes() {
  return (
    <Section
      id="augen"
      number="06"
      title="Komisch eigentlich"
      className="eyes-section"
    >
      <div className="iris" aria-hidden="true">
        <div />
      </div>
      <Reveal>
        <h2>
          Du hast zuerst
          <br />
          meine Augen gesehen.
        </h2>
        <p className="subtle">
          Das Erste, was dir aufgefallen ist.
          <br />
          Das, was du an mir am schönsten findest.
        </p>
        <p className="statement small">
          Und heute könnte ich stundenlang in deine schauen.
        </p>
      </Reveal>
    </Section>
  );
}
import { useDiscovery } from "./Discoveries";
export function SmallThings() {
  const {discover}=useDiscovery();
  const [secret, setSecret] = useState(null);
  const [cats, setCats] = useState(() => readStore("yael-cats", 0));
  const [solving, setSolving] = useState(false);
  useEffect(() => {
    if (!solving) return;
    const timer = setTimeout(() => {
      setSecret("Lösung gefunden: Schlafen.");
      discover("sleep");
      setSolving(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [solving, discover]);
  function findCat() {
    discover("cat");
    const n = cats + 1;
    setCats(n);
    writeStore("yael-cats", n);
    setSecret(
      n >= 3
        ? "Okay, du hast Hetfield gefunden. Er wohnt jetzt offensichtlich hier."
        : "Da war doch gerade eine Katze. Vielleicht findest du sie nochmal.",
    );
  }
  return (
    <Section id="kleinigkeiten" number="07" title="Ein paar kleine Dinge" light>
      <Reveal>
        <h2>
          Du steckst
          <br />
          <em>in den Details.</em>
        </h2>
        <p className="subtle">Manches erinnert mich einfach an dich.</p>
      </Reveal>
      <div className="detail-universe">
        <button
          className="detail sushi"
          onClick={() =>
            setSecret("Sushi mit dir. Sehr gute Idee. Schon wieder.")
          }
        >
          Sushi für zwei <span>◒ ◒</span>
        </button>
        <button
          className="detail horse"
          onClick={() =>
            setSecret(
              "Wenn du über Jafar redest, könnte ich dir lange zuhören. Auch wenn ich noch nicht jedes Wort aus dem Reiten kenne.",
            )
          }
        >
          Noch eine Geschichte über Jafar?
        </button>
        <button
          className="detail flowers"
          onClick={() =>
            setSecret(
              "Rosen und Lilien. Manche Dinge funktionieren digital einfach nicht. Deshalb liegt manches gerade vor dir.",
            )
          }
        >
          <Flower2 /> Rosen & Lilien
        </button>
        <button
          className="detail pony"
          onClick={() =>
            setSecret(
              "Ein kleines bisschen Fluttershy steckt auch hier drin: leise, freundlich und mit viel Platz für Tiere.",
            )
          }
        >
          Ein leiser Flügelschlag.
        </button>
        <button
          className="detail sea"
          onClick={() =>
            setSecret(
              "Sommer. Meer. Sonne, die langsam untergeht. Und irgendwann wir mittendrin.",
            )
          }
        >
          Salz in der Luft.
        </button>
        <button
          className="cat-hunt icon-button"
          aria-label="Die kleine Katze entdecken"
          onClick={findCat}
        >
          <Cat size={26} />
        </button>
        <button
          className="tiny-cow"
          onClick={() =>
            (discover("cow"), setSecret(
              "Eine Mini-Kuh. Einfach so. Die Babyziege steht auf der Warteliste.",
            ))
          }
          aria-label="Eine kleine Mini-Kuh entdecken"
        >
          🐄
        </button>
      </div>
      <div className="secret-tools">
        <button disabled={solving} onClick={() => setSolving(true)}>
          <Moon size={17} />
          {solving ? "Suche eine Lösung …" : "Problem lösen"}
        </button>
        <button
          aria-label="Roblox ausprobieren"
          onClick={() =>
            (discover("roblox"), setSecret("Diese Funktion wurde aus Qualitätsgründen entfernt."))
          }
        >
          <Gamepad2 size={18} />
        </button>
      </div>
      {secret && (
        <Modal title="Ein kleines Detail" onClose={() => setSecret(null)}>
          <p className="modal-text">{secret}</p>
        </Modal>
      )}
    </Section>
  );
}
