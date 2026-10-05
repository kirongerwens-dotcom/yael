import { initializeApp, getApps } from 'firebase/app';
import { initializeAuth, inMemoryPersistence, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore/lite';
import { firebaseConfig } from './config';
let client;
export function getFirebaseClient() {
 if(client)return client;
 const app=getApps().find(a=>a.name==='yael-private-analytics') || initializeApp(firebaseConfig,'yael-private-analytics');
 // No anonymous login token, tracking ID, or Firestore cache is persisted on disk.
 const auth=initializeAuth(app,{persistence:inMemoryPersistence});
 const db=getFirestore(app);
 if(import.meta.env.DEV && import.meta.env.VITE_FIREBASE_USE_EMULATORS==='true'){
  if(firebaseConfig.projectId!=='demo-yael')throw new Error('Emulator mode requires demo-yael.');
  connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
  connectFirestoreEmulator(db,'127.0.0.1',8080);
 }
 client={app,auth,db};
 return client;
}
