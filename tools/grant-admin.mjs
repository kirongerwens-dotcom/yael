import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const uid=process.argv[2];
if(!uid)throw new Error('Usage: node tools/grant-admin.mjs FIREBASE_UID');
initializeApp({credential:applicationDefault()});
const auth=getAuth(), user=await auth.getUser(uid);
if(!user.providerData.some(provider=>provider.providerId==='google.com'))throw new Error('The admin must be an existing Google-authenticated account.');
await auth.setCustomUserClaims(uid,{...user.customClaims,yaelAnalyticsAdmin:true});
console.log('Analytics admin access granted. Sign out and sign in again.');
