// Import only data already generated server-side while serving actual HTML requests.
// Never use this as an endpoint receiving JavaScript analytics, pixels, or tracking links.
import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
const path=process.argv[2];if(!path)throw new Error('Usage: node tools/import-server-visits.mjs normalized-server-requests.json');
const rows=JSON.parse(await readFile(path,'utf8'));
if(!Array.isArray(rows))throw new Error('Expected an array of normalized request records.');
initializeApp({credential:applicationDefault()});const db=getFirestore();let imported=0;
for(const row of rows){
 if(row.method!=='GET'||row.path!=='/yael/'||row.status!==200||row.environment!=='production'||row.developerPreview===true)continue;
 const time=new Date(row.timestamp);if(!Number.isFinite(time.getTime()))throw new Error('Invalid request timestamp.');
 // Nothing from headers, cookies, IP addresses, user agents, query strings or identifiers is copied.
 const id=randomUUID();
 await db.collection('yaelVisits').doc(id).create({schemaVersion:1,kind:'server_request',sessionId:id,excluded:false,measurementVersion:'server-only-v1',startedAt:Timestamp.fromDate(time),lastSeenAt:Timestamp.fromDate(time),expiresAt:Timestamp.fromMillis(time.getTime()+30*86400000),initialMode:'unknown',currentMode:'unknown',activeSeconds:null,maxScrollPercent:null,lastActivityAtMs:null,heartsDiscovered:null,sectionsReached:[],dailyLettersOpened:[],events:[]});
 imported++;
}
console.log(`Imported ${imported} HTML requests. No unique-person or interaction inference was performed. Do not import the same source twice.`);
