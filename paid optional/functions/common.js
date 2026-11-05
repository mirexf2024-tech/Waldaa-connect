const { HttpsError } = require('firebase-functions/v2/https');
const { getFirestore } = require('firebase-admin/firestore');
const db = getFirestore();
async function activeUser(request) {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in required.');
  const snap = await db.collection('users').doc(request.auth.uid).get();
  const u = snap.data();
  if (!u || u.status !== 'active' || !u.churchId) throw new HttpsError('permission-denied', 'Active church member required.');
  return { uid: request.auth.uid, ...u };
}
module.exports = { activeUser };
