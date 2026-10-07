import { useCallback, useState } from "react";
import Analytics from "./components/Analytics";
import { excludeAnalytics } from "./analytics/runtime";
import Intro from "./components/Intro";
import ExperienceSound, { SoundControls } from "./components/ExperienceSound";
import { MemoryExchange, HennaMemory, TrainMemory, YaelArchive, IPayAttention, ProjectHours, FinalCredits, ReturnMemory } from "./components/PersonalWorld";
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
import BirthdayGate, { DailyLoveLetters, useBirthdayClock, BIRTHDAY } from './components/BirthdayGate';
import DistanceJourney, { JourneyClimax } from './components/DistanceJourney';
import { Discoveries, HiddenHeart, SecretSection, Finale } from './components/Discoveries';
import { readStore } from './components/Shared';
export default function App() {
  const {now,date}=useBirthdayClock();
  const [developer,setDeveloper]=useState(()=>{try{return sessionStorage.getItem('yael-developer')==='1';}catch{return false;}});
  const unlock=useCallback(()=>{excludeAnalytics();setDeveloper(true);},[]);
  const [returning]=useState(()=>readStore('yael-visited',false));
  const [menu, setMenu] = useState(false);

  return (
    <>
    <Analytics developer={developer}/>
    {!developer && date < BIRTHDAY ? <BirthdayGate now={now} date={date} onUnlock={unlock}/> : <Discoveries><ExperienceSound>
      <a className="skip-link" href="#beginn">
        Zum Geschenk
      </a>
      <main className={date===BIRTHDAY ? "birthday-mode" : ""}>
        <DistanceJourney/>
        {returning && <a className="return-link" href="#beginn">Wieder hier? Direkt zu uns ↓</a>}
        <Intro />
        <ReturnMemory/>
        <SoundControls/>
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
        <RelationshipStart /><div className="heart-location"><HiddenHeart id={1}/></div>
        <Distance />
        <TwoMeetings />
        <MemoryExchange/>
        <HennaMemory/>
        <TrainMemory/>
        <DigitalDays /><div className="heart-location"><HiddenHeart id={2}/></div>
        <LoveReasons />
        <IPayAttention/>
        <YaelArchive/>
        <Eyes />
        <SmallThings /><div className="heart-location"><HiddenHeart id={3}/></div>
        <NeedMe />
        <Future /><div className="heart-location"><HiddenHeart id={4}/></div>
        <ProjectHours/>
        <JourneyClimax />
        <LoveLetter /><div className="heart-location"><HiddenHeart id={5}/></div>
        <SecretSection />
        <DailyLoveLetters date={date} archive/>
        <Finale />
        <FinalCredits/>
      </main>
    </ExperienceSound></Discoveries>}
    </>
  );
}
