// Run only from a trusted computer with Firebase Admin credentials.
// Example: node setDeveloperClaim.example.js FIREBASE_AUTH_UID
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
initializeApp({ credential: applicationDefault(), projectId: 'church-supper-app' });
const uid = process.argv[2];
if (!uid) throw new Error('Pass the intended developer Firebase Auth UID.');
getAuth().setCustomUserClaims(uid, { developer: true })
  .then(() => { console.log(`Developer claim set for UID ${uid}. Sign out and sign in again.`); process.exit(0); })
  .catch(error => { console.error(error); process.exit(1); });
