import { createSession, SECTION_IDS } from './session';
let runtime = null, generation = 0, preview = false, ending = Promise.resolve(), startup = Promise.resolve();
export function track(name,value=''){runtime?.record(name,value);}
export function trackMapProgress(percent){runtime?.progress(percent);}
export async function revokeAnalytics(){generation++;const previous=runtime;runtime=null;ending=previous?previous.revoke():startup.then(()=>true);return ending;}
export function stopAnalytics(){generation++;const previous=runtime;runtime=null;ending=previous?previous.stop():startup;}
export function excludeAnalytics() {
 preview=true;generation++;
 const previous=runtime;runtime=null;
 // The existing preview gesture calls this directly; analytics never reads browser storage.
 ending=previous?previous.exclude():startup;
}
export function startAnalytics() {
 const token=++generation, previousStartup=startup, previousEnding=ending;
 const task=(async()=>{
  await previousStartup;await previousEnding;
  if(preview||token!==generation||runtime)return ()=>{};
  return initializeSession(token);
 })();
 startup=task.then(()=>undefined,()=>undefined);
 return task;
}
async function initializeSession(token) {
 const [{getFirebaseClient}, authSdk, firestore] = await Promise.all([import('./firebaseClient'),import('firebase/auth'),import('firebase/firestore/lite')]);
 if(preview || token!==generation)return ()=>{};
 const {auth,db}=getFirebaseClient();
 const {user}=await authSdk.signInAnonymously(auth);
 if(preview || token!==generation){await authSdk.signOut(auth).catch(()=>{});return ()=>{};}
 const ref=firestore.doc(db,'yaelVisits',user.uid);
 let created=false, lastWrite=0, pendingTimer=null, failed=false, frame=0, closed=false;
 const session=createSession({id:crypto.randomUUID(),mode:document.querySelector('.birthday-gate')?'countdown':'birthday',write:async snapshot=>{
  if(closed || failed)return;
  const payload={...snapshot,lastSeenAt:firestore.serverTimestamp()};
  if(!created){payload.startedAt=firestore.serverTimestamp();payload.expiresAt=firestore.Timestamp.fromMillis(Date.now()+30*86400000);await firestore.setDoc(ref,payload);created=true;}
  else await firestore.updateDoc(ref,payload);
  lastWrite=Date.now();
 }});
 const visible=()=>document.visibilityState==='visible';
 session.visibility(visible());
 const cleanup=[];
 function listen(target,name,handler,options){target.addEventListener(name,handler,options);cleanup.push(()=>target.removeEventListener(name,handler,options));}
 async function flush(){
  if(closed||failed)return;
  try{await session.flush();}catch{failed=true;clearInterval(heartbeat);clearTimeout(pendingTimer);}
 }
 function schedule(){
  if(pendingTimer!==null||failed||closed)return;
  pendingTimer=setTimeout(()=>{pendingTimer=null;if(lastWrite && Date.now()-lastWrite<10000){schedule();return;}void flush();},Math.max(5000,10000-(Date.now()-lastWrite)));
 }
 function record(name,value){if(!closed && !preview && visible() && session.event(name,value))schedule();}
 let lastActivity=0;
 function activity(){if(Date.now()-lastActivity>=5000){session.activity();lastActivity=Date.now();}}
 function scroll(){activity();if(frame)return;frame=requestAnimationFrame(()=>{frame=0;measureSection();const max=document.documentElement.scrollHeight-window.innerHeight;session.scroll(max>0?window.scrollY/max*100:0);});}
 listen(window,'scroll',scroll,{passive:true});listen(window,'pointerdown',activity,{passive:true});listen(window,'keydown',activity);
 listen(document,'visibilitychange',()=>{session.visibility(visible());if(visible())measureSection();schedule();});
 listen(window,'pagehide',()=>{session.visibility(false);if(Date.now()-lastWrite>=10000)void flush();});
 listen(window,'pageshow',()=>session.visibility(visible()));
 const sectionObserver=new IntersectionObserver(entries=>{
  for(const entry of entries){
   if(!entry.isIntersecting || !visible())continue;
   const el=entry.target, id=el.id;
   if(id==='daily-letter-card'){if(!el.closest('details')||el.closest('details').open)record('daily_letter_opened',el.dataset.letterDate);continue;}
   if(SECTION_IDS.includes(id)){record('section_reached',id);if(id==='finale')record('finale_reached');if(id==='post-finale')record('post_finale_reached');if(id==='secret-surprise')record('secret_available');}
  }
 },{threshold:0.05});
 const observed=new WeakSet();
 function measureSection(){
  if(closed||!visible())return;
  let best='',area=0;
  document.querySelectorAll('section[id],details[id]').forEach(el=>{if(!SECTION_IDS.includes(el.id))return;const r=el.getBoundingClientRect();const overlap=Math.max(0,Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0));if(overlap>area){area=overlap;best=el.id;}});
  session.section(best);
  const journey=document.getElementById('journey-climax');
  if(journey){const top=journey.getBoundingClientRect().top+window.scrollY;session.progress(window.scrollY/Math.max(1,top)*100);if(window.scrollY>=top)record('map_completed');}
  session.letter(document.querySelector('#brief')?.dataset.letterOpen==='true');
 }
 function scan(){
  measureSection();
  if(!document.querySelector('.birthday-gate')&&session.snapshot().currentMode==='countdown')record('experience_unlocked');
  document.querySelectorAll('section[id], details[id], #daily-letter-card').forEach(el=>{
   if(!observed.has(el)){observed.add(el);sectionObserver.observe(el);}
  });
  const card=document.querySelector('#daily-letter-card');
  if(card && (!card.closest('details')||card.closest('details').open)){
   const rect=card.getBoundingClientRect();if(rect.bottom>0&&rect.top<window.innerHeight)record('daily_letter_opened',card.dataset.letterDate);
  }
 }
 const mutationObserver=new MutationObserver(scan);mutationObserver.observe(document.getElementById('root'),{childList:true,subtree:true,attributes:true,attributeFilter:['data-letter-date','data-letter-open','open']});
 const heartbeat=setInterval(()=>{if(visible()){measureSection();void flush();}},60000);
 function cleanupRuntime(){closed=true;session.stop();clearInterval(heartbeat);clearTimeout(pendingTimer);cancelAnimationFrame(frame);sectionObserver.disconnect();mutationObserver.disconnect();cleanup.forEach(fn=>fn());}
 const current={record,progress:percent=>session.progress(percent),stop(){cleanupRuntime();return authSdk.signOut(auth).catch(()=>{});},async exclude(){
  session.exclude();cleanupRuntime();
  // Wait for an initial/in-flight write so it cannot resurrect an excluded session.
  try{await session.settled();if(created)await firestore.updateDoc(ref,{excluded:true,lastSeenAt:firestore.serverTimestamp()});}catch{/* Offline exclusion cannot be guaranteed until the server receives it. */}
  await authSdk.signOut(auth).catch(()=>{});
 },async revoke(){
  // Stop synchronously, then wait for any write before deleting, preventing resurrection.
  cleanupRuntime();let deleted=true;
  try{await session.settled();if(created)await firestore.deleteDoc(ref);}catch{deleted=false;}
  await authSdk.signOut(auth).catch(()=>{});return deleted;
 }};
 runtime=current;scan();await flush();
 return ()=>{if(runtime===current){generation++;current.stop();runtime=null;}};
}
