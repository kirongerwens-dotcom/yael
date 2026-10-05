// Fictitious dashboard data. Hard guards prevent writing to a production Firebase project.
import {initializeApp} from 'firebase-admin/app';
import {getAuth} from 'firebase-admin/auth';
import {getFirestore,Timestamp} from 'firebase-admin/firestore';
import {createSession} from '../src/analytics/session.js';
if(process.env.FIRESTORE_EMULATOR_HOST!=='127.0.0.1:8080'||process.env.FIREBASE_AUTH_EMULATOR_HOST!=='127.0.0.1:9099')throw new Error('Only the local demo emulators are permitted.');
const uid=process.argv[2];if(!uid)throw new Error('First sign in with mock Google in the local admin page, then pass the displayed Firebase UID.');
initializeApp({projectId:'demo-yael'});
const auth=getAuth(),user=await auth.getUser(uid);
if(!user.providerData.some(p=>p.providerId==='google.com'))throw new Error('Use the mock Google account from the emulator popup.');
await auth.setCustomUserClaims(uid,{...user.customClaims,yaelAnalyticsAdmin:true});
const db=getFirestore(),today=Date.now();
for(let i=0;i<7;i++){
 let time=today-i*86400000;
 const started=time,session=createSession({id:crypto.randomUUID(),now:()=>time,mode:'birthday',write:async()=>{}});
 session.section('beginn');time+=30000;session.section('liebe');session.event('love_reason_opened','1');time+=40000;
 session.section('brauchst');session.event('open_when_opened','0:2');session.progress(100);session.event('map_completed');
 time+=15000;session.section('brief');session.event('love_letter_opened');time+=90000;session.section('finale');session.event('finale_reached');
 for(let heart=1;heart<=i%6;heart++)session.event('heart_found',`heart-${heart}`);
 const row=session.snapshot();await db.collection('yaelVisits').doc(`demo-session-${i}`).set({...row,startedAt:Timestamp.fromMillis(started),lastSeenAt:Timestamp.fromMillis(time),expiresAt:Timestamp.fromMillis(today+30*86400000)});
}
console.log('7 demo sessions saved ONLY in demo-yael emulators. Sign out and sign in again to refresh the admin claim.');
