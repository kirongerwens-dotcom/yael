export const SECTION_IDS = ['intro','beginn','entfernung','treffen','tage','liebe','augen','kleinigkeiten','brauchst','ueberall','mitdir','journey-climax','brief','secret-surprise','daily-archive','finale','post-finale'];
const MILESTONES={love_letter_opened:'loveLetterOpened',love_letter_visible_open:'loveLetterOpened',map_completed:'mapCompleted',secret_unlocked:'secretUnlocked',secret_available:'secretUnlocked',finale_reached:'finaleReached',post_finale_reached:'postFinaleReached'};
export function createSession({id,now=Date.now,mode='countdown',write}) {
 const start=now();
 const state={schemaVersion:2,sessionId:id,measurementVersion:'consent-v1',consentVersion:'2026-10-04',consented:true,kind:'browser_session',excluded:false,clientStartedAtMs:start,lastActivityAtMs:start,activeSeconds:0,maxScrollPercent:0,initialMode:mode,currentMode:mode,sectionsReached:[],sectionActiveSeconds:Object.fromEntries(SECTION_IDS.map(id=>[id,0])),loveLetterActiveSeconds:0,loveLetterReached:false,loveLetterOpened:false,mapProgressPercent:0,mapCompleted:false,heartsDiscovered:0,heartIds:[],allHeartsFound:false,secretUnlocked:false,finaleReached:false,postFinaleReached:false,dailyLettersOpened:[],loveReasonsOpened:[],openWhenOpened:[],events:[]};
 let visible=true,stopped=false,previous=start,activeMs=0,letterMs=0,section='',letterOpen=false,revision=0,savedRevision=-1,inFlight=null;
 const times={},keys=new Set();
 function accrue(){const time=now(),delta=visible&&!stopped?Math.min(60000,Math.max(0,time-previous)):0;previous=time;activeMs+=delta;if(section){times[section]=(times[section]||0)+delta;state.sectionActiveSeconds[section]=Math.floor(times[section]/1000);}if(section==='brief'&&letterOpen)letterMs+=delta;state.activeSeconds=Math.floor(activeMs/1000);state.loveLetterActiveSeconds=Math.floor(letterMs/1000);if(delta)state.lastActivityAtMs=time;}
 function append(name,value){revision++;state.lastActivityAtMs=now();if(state.events.length<256)state.events.push({name,value,atMs:now()});}
 function event(name,value=''){
  if(stopped||!visible)return false;
  let valid=false,repeat=false;
  if(name==='section_reached'&&SECTION_IDS.includes(value)){valid=true;if(!state.sectionsReached.includes(value))state.sectionsReached.push(value);if(value==='brief')state.loveLetterReached=true;}
  else if(name==='daily_letter_opened'&&/^2026-10-(0[4-9]|1[0-3])$/.test(value)){valid=true;if(!state.dailyLettersOpened.includes(value))state.dailyLettersOpened.push(value);}
  else if(name==='heart_found'&&/^heart-[1-5]$/.test(value)){valid=true;if(!state.heartIds.includes(value))state.heartIds.push(value);state.heartsDiscovered=state.heartIds.length;state.allHeartsFound=state.heartsDiscovered===5;}
  else if(name==='love_reason_opened'&&/^(?:[1-9]|1[0-2])$/.test(value)){valid=true;if(!state.loveReasonsOpened.includes(value))state.loveReasonsOpened.push(value);}
  else if(name==='open_when_opened'&&/^[0-6]:[0-7]$/.test(value)){valid=true;if(!state.openWhenOpened.includes(value))state.openWhenOpened.push(value);}
  else if(name==='love_letter_closed'){valid=true;repeat=letterOpen;accrue();letterOpen=false;if(!repeat)return false;}
  else if(Object.hasOwn(MILESTONES,name)){valid=true;state[MILESTONES[name]]=true;if(name==='love_letter_opened'||name==='love_letter_visible_open'){accrue();letterOpen=true;}}
  else if(name==='session_started')valid=true;
  else if(name==='experience_unlocked'){valid=true;state.currentMode='birthday';}
  if(!valid)return false;const key=`${name}:${value}`;if(!repeat&&keys.has(key))return false;keys.add(key);accrue();append(name,value);return true;
 }
 event('session_started');
 return {event,
  section(next){if(stopped||next===section||next&&!SECTION_IDS.includes(next))return;accrue();if(section)append('section_left',section);section=next;if(next){event('section_reached',next);append('section_entered',next);}},
  letter(open){if(stopped)return;accrue();if(open&&!letterOpen)event('love_letter_visible_open');letterOpen=Boolean(open);},
  progress(percent){if(stopped||!visible)return;const next=Math.max(0,Math.min(100,Math.floor(percent)));if(next>state.mapProgressPercent){state.mapProgressPercent=next;revision++;}},
  activity(){if(stopped||!visible)return;state.lastActivityAtMs=now();revision++;},
  scroll(percent){if(stopped||!visible)return;const next=Math.min(100,Math.max(0,Math.round(percent)));if(next>state.maxScrollPercent){state.maxScrollPercent=next;revision++;}},
  visibility(next){accrue();visible=next;revision++;},
  async flush(){if(stopped)return;if(inFlight){await inFlight;return;}accrue();revision++;const snapshot=structuredClone(state),current=revision;inFlight=Promise.resolve().then(()=>write(snapshot));try{await inFlight;savedRevision=current;}finally{inFlight=null;}},
  async settled(){await inFlight;},snapshot(){accrue();return structuredClone(state);},exclude(){accrue();state.excluded=true;visible=false;revision++;},stop(){accrue();stopped=true;},get dirty(){return revision!==savedRevision;}
 };
}
