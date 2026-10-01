import { useState } from "react";
import Intro from "./components/Intro";
import {
  RelationshipStart,
  Distance,
  TwoMeetings,
  DigitalDays,
  Eyes,
  SmallThings,
} from "./components/Story";
import LoveReasons from "./components/LoveReasons";
import NeedMe from "./components/NeedMe";
import Future from "./components/Future";
import LoveLetter from "./components/LoveLetter";
export default function App() {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <a className="skip-link" href="#beginn">
        Zum Geschenk
      </a>
      <main>
        <Intro />
        <div className="chapter-nav">
          <button
            aria-expanded={menu}
            aria-controls="chapters"
            onClick={() => setMenu(!menu)}
          >
            Ein kleines Stück von uns <span>{menu ? "−" : "+"}</span>
          </button>
          {menu && (
            <nav id="chapters" aria-label="Kapitel">
              {[
                ["beginn", "Unser Anfang"],
                ["liebe", "Was ich an dir liebe"],
                ["brauchst", "Wenn du mich brauchst"],
                ["ueberall", "Überall"],
                ["brief", "Dein Brief"],
              ].map(([id, label]) => (
                <a href={`#${id}`} onClick={() => setMenu(false)} key={id}>
                  {label}
                </a>
              ))}
            </nav>
          )}
        </div>
        <RelationshipStart />
        <Distance />
        <TwoMeetings />
        <DigitalDays />
        <LoveReasons />
        <Eyes />
        <SmallThings />
        <NeedMe />
        <Future />
        <LoveLetter />
      </main>
    </>
  );
}
