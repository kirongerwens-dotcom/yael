import {readFile} from 'node:fs/promises';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,setDoc,getDoc,getDocs,collection,updateDoc,deleteDoc,serverTimestamp,Timestamp,query,where,orderBy,getCountFromServer} from 'firebase/firestore';
import {setLogLevel} from 'firebase/app';
import {createSession} from '../src/analytics/session.js';
import assert from 'node:assert/strict';
setLogLevel('silent');
const env=await initializeTestEnvironment({projectId:'demo-yael',firestore:{host:'127.0.0.1',port:8080,rules:await readFile(new URL('../firestore.rules',import.meta.url),'utf8')}});
try{
 await env.clearFirestore();
 const owner=env.authenticatedContext('visit-one',{firebase:{sign_in_provider:'anonymous'}}).firestore();
 const other=env.authenticatedContext('visit-two',{firebase:{sign_in_provider:'anonymous'}}).firestore();
 const pub=env.unauthenticatedContext().firestore();
 const regular=env.authenticatedContext('normal-user',{firebase:{sign_in_provider:'google.com'}}).firestore();
 const admin=env.authenticatedContext('owner-admin',{yaelAnalyticsAdmin:true,firebase:{sign_in_provider:'google.com'}}).firestore();
 const fakeAdmin=env.authenticatedContext('anonymous-admin',{yaelAnalyticsAdmin:true,firebase:{sign_in_provider:'anonymous'}}).firestore();
 const base=createSession({id:crypto.randomUUID(),write:async()=>{}}).snapshot();
 const payload={...base,startedAt:serverTimestamp(),lastSeenAt:serverTimestamp(),expiresAt:Timestamp.fromMillis(Date.now()+30*86400000)};
 await assertSucceeds(setDoc(doc(owner,'yaelVisits','visit-one'),payload));
 for(const db of [pub,owner,other,regular,fakeAdmin]){await assertFails(getDoc(doc(db,'yaelVisits','visit-one')));await assertFails(getDocs(collection(db,'yaelVisits')));}
 await assertSucceeds(getDoc(doc(admin,'yaelVisits','visit-one')));
 await env.withSecurityRulesDisabled(async context=>{await updateDoc(doc(context.firestore(),'yaelVisits','visit-one'),{lastSeenAt:Timestamp.fromMillis(Date.now()-60000)});});
 await assertSucceeds(updateDoc(doc(owner,'yaelVisits','visit-one'),{activeSeconds:60,sectionActiveSeconds:{...base.sectionActiveSeconds,liebe:60},lastSeenAt:serverTimestamp()}));
 await assertFails(updateDoc(doc(owner,'yaelVisits','visit-one'),{activeSeconds:61,lastSeenAt:serverTimestamp()}));
 await assertFails(setDoc(doc(other,'yaelVisits','visit-one'),payload));
 await assertFails(setDoc(doc(pub,'yaelVisits','public'),payload));
 await assertFails(setDoc(doc(owner,'unrelated','visit-one'),payload));
 await assertFails(updateDoc(doc(owner,'yaelVisits','visit-one'),{sessionId:crypto.randomUUID(),lastSeenAt:serverTimestamp(),excluded:true}));
 await assertFails(updateDoc(doc(owner,'yaelVisits','visit-one'),{ipAddress:'should not exist',lastSeenAt:serverTimestamp(),excluded:true}));
 await assertSucceeds(updateDoc(doc(owner,'yaelVisits','visit-one'),{excluded:true,lastSeenAt:serverTimestamp()}));
 await assertFails(updateDoc(doc(owner,'yaelVisits','visit-one'),{excluded:false,lastSeenAt:serverTimestamp()}));
 await assertFails(deleteDoc(doc(other,'yaelVisits','visit-one')));
 await assertSucceeds(deleteDoc(doc(owner,'yaelVisits','visit-one')));
 await assertFails(setDoc(doc(other,'yaelVisits','visit-two'),{...payload,consented:false}));
 const q=query(collection(admin,'yaelVisits'),where('excluded','==',false),where('consented','==',true),orderBy('startedAt','desc'));
 const count=await assertSucceeds(getCountFromServer(q));assert.equal(count.data().count,0);
 console.log('PASS Firestore: valid own creation and throttled heartbeat; public/anonymous/other/non-admin reads denied; real admin allowed; spoofed anonymous admin denied; other-session/extra-field/identity mutations denied; preview exclusion accepted immediately and excluded from dashboard; unexclusion/other-session deletion/creation without consent denied; owner revocation deletion allowed.');
}finally{await env.cleanup();}
