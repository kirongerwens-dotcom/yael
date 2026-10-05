export const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
 authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
 projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
 appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export function configured() {return Object.values(firebaseConfig).every(Boolean);}
// Only the consent component calls startAnalytics; production restrictions are additional guards.
export function productionAnalyticsAllowed() {
 if(!import.meta.env.PROD || import.meta.env.VITE_ANALYTICS_ENABLED!=='true' || !configured() || !import.meta.env.VITE_PRIVACY_CONTACT)return false;
 const hosts=(import.meta.env.VITE_ANALYTICS_PRODUCTION_HOSTS||'').split(',').map(x=>x.trim()).filter(Boolean);
 return hosts.includes(window.location.hostname) && !['localhost','127.0.0.1','::1','[::1]'].includes(window.location.hostname);
}
