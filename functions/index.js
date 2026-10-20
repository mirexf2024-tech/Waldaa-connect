const {onCall, HttpsError} = require('firebase-functions/v2/https');
const {initializeApp} = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth');
const {getFirestore, FieldValue} = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore();
function requireDeveloper(req) {
  if (!req.auth || req.auth.token.developer !== true) throw new HttpsError('permission-denied', 'Developer access required.');
}
async function requirePastorOrDeveloper(req) {
  if (!req.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  if (req.auth.token.developer === true) return {role:'developer', churchId:null};
  const snap = await db.collection('users').doc(req.auth.uid).get();
  const p = snap.data();
  if (!p || p.status !== 'active' || !['pastor','secretary'].includes(p.role)) throw new HttpsError('permission-denied', 'Pastor or secretary access required.');
  return p;
}
exports.approveChurchApplication = onCall(async (req) => {
  requireDeveloper(req);
  const applicationId = String(req.data?.applicationId || '');
  if (!applicationId) throw new HttpsError('invalid-argument', 'applicationId required.');
  const appRef = db.collection('churchApplications').doc(applicationId);
  const result = await db.runTransaction(async tx => {
    const appSnap = await tx.get(appRef);
    if (!appSnap.exists) throw new HttpsError('not-found', 'Application not found.');
    const a = appSnap.data();
    if (a.status !== 'pending') throw new HttpsError('failed-precondition', 'Application is not pending.');
    if (!a.applicantUid || !a.name) throw new HttpsError('failed-precondition', 'Application data incomplete.');
    const churchRef = db.collection('churches').doc();
    tx.set(churchRef, {name:a.name, city:a.city||'', country:a.country||'', pastor:a.pastor||'', email:a.email||'', language:a.language||'om', status:'approved', createdAt:FieldValue.serverTimestamp(), approvedAt:FieldValue.serverTimestamp(), approvedBy:req.auth.uid, schemaVersion:1});
    tx.set(db.collection('users').doc(a.applicantUid), {displayName:a.pastor||a.name, email:a.email||'', role:'pastor', churchId:churchRef.id, status:'active', createdAt:FieldValue.serverTimestamp(), createdBy:'church-approval'}, {merge:true});
    tx.update(appRef, {status:'approved', churchId:churchRef.id, approvedAt:FieldValue.serverTimestamp(), approvedBy:req.auth.uid});
    return {churchId:churchRef.id};
  });
  try { await getAuth().setCustomUserClaims((await appRef.get()).data().applicantUid, {churchApproved:true}); } catch(e) { console.error('Optional custom claim update failed', e); }
  return result;
});
exports.rejectChurchApplication = onCall(async (req) => {
  requireDeveloper(req);
  const id = String(req.data?.applicationId || '');
  if (!id) throw new HttpsError('invalid-argument', 'applicationId required.');
  const ref = db.collection('churchApplications').doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Application not found.');
  if (snap.data().status !== 'pending') throw new HttpsError('failed-precondition', 'Application is not pending.');
  await ref.update({status:'rejected', reason:String(req.data?.reason||'Not approved').slice(0,500), rejectedAt:FieldValue.serverTimestamp(), rejectedBy:req.auth.uid});
  return {ok:true};
});
exports.createChurchMember = onCall(async (req) => {
  const actor = await requirePastorOrDeveloper(req);
  const name = String(req.data?.name||'').trim();
  const email = String(req.data?.email||'').trim().toLowerCase();
  const phone = String(req.data?.phone||'').trim();
  const role = String(req.data?.role||'member');
  const allowed = ['member','finance','choir','prayer','secretary','auditor'];
  if (!name || !email || !email.includes('@') || !allowed.includes(role)) throw new HttpsError('invalid-argument','Valid name, email and role required.');
  const churchId = actor.role === 'developer' ? String(req.data?.churchId||'') : actor.churchId;
  if (!churchId) throw new HttpsError('invalid-argument','churchId required for developer-created member.');
  const churchSnap = await db.collection('churches').doc(churchId).get();
  if (!churchSnap.exists || churchSnap.data().status !== 'approved') throw new HttpsError('failed-precondition','Church must be approved first.');
  let user;
  try { user = await getAuth().getUserByEmail(email); }
  catch (e) {
    if (e.code !== 'auth/user-not-found') throw e;
    user = await getAuth().createUser({email, displayName:name, emailVerified:false, disabled:false});
  }
  await db.collection('users').doc(user.uid).set({displayName:name,email,phone,role,churchId,status:'active',updatedAt:FieldValue.serverTimestamp(),createdBy:req.auth.uid}, {merge:true});
  const memberRef = db.collection('churches').doc(churchId).collection('members').doc(user.uid);
  await memberRef.set({uid:user.uid,name,email,phone,role,status:'active',createdAt:FieldValue.serverTimestamp(),createdBy:req.auth.uid}, {merge:true});
  const resetLink = await getAuth().generatePasswordResetLink(email);
  return {uid:user.uid, memberId:memberRef.id, resetLink};
});
