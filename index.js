const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const crypto = require('node:crypto');

initializeApp();
const auth = getAuth();
const db = getFirestore();
const REGION = 'us-central1';
const allowedChurchRoles = new Set(['member', 'finance', 'choir', 'prayer', 'secretary', 'auditor']);

function requireDeveloper(request) {
  if (!request.auth || request.auth.token.developer !== true) {
    throw new HttpsError('permission-denied', 'Developer permission required.');
  }
}
function cleanString(value, field, max = 120) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) {
    throw new HttpsError('invalid-argument', `Invalid ${field}.`);
  }
  return value.trim();
}

exports.approveChurchApplication = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  requireDeveloper(request);
  const applicationId = cleanString(request.data?.applicationId, 'applicationId', 160);
  const appRef = db.collection('churchApplications').doc(applicationId);
  const initial = await appRef.get();
  if (!initial.exists) throw new HttpsError('not-found', 'Church application not found.');
  const applicantUid = initial.data().applicantUid;
  if (!applicantUid) throw new HttpsError('failed-precondition', 'Applicant UID is missing.');
  const applicant = await auth.getUser(applicantUid);
  if (!applicant.emailVerified) throw new HttpsError('failed-precondition', 'Applicant must verify their email before approval.');

  const churchRef = db.collection('churches').doc();
  const memberRef = churchRef.collection('members').doc(applicant.uid);
  const userRef = db.collection('users').doc(applicant.uid);
  const auditRef = db.collection('auditLogs').doc();
  const churchId = churchRef.id;
  await db.runTransaction(async (tx) => {
    const appSnap = await tx.get(appRef);
    if (!appSnap.exists) throw new HttpsError('not-found', 'Church application not found.');
    const application = appSnap.data();
    if (application.status !== 'pending') throw new HttpsError('failed-precondition', 'Application is not pending.');
    if (application.applicantUid !== applicant.uid) throw new HttpsError('failed-precondition', 'Applicant identity changed.');
    tx.create(churchRef, {
      name: cleanString(application.name, 'church name'),
      city: cleanString(application.city, 'city', 80),
      country: cleanString(application.country, 'country', 80),
      language: ['om', 'am', 'en'].includes(application.language) ? application.language : 'en',
      status: 'approved', pastorUid: applicant.uid,
      approvedAt: FieldValue.serverTimestamp(), approvedBy: request.auth.uid,
      createdAt: application.createdAt || FieldValue.serverTimestamp(),
      estimatedMembers: Number.isSafeInteger(application.estimatedMembers) ? application.estimatedMembers : 0
    });
    tx.create(memberRef, {
      uid: applicant.uid, displayName: application.pastor || applicant.displayName || 'Pastor',
      email: applicant.email || application.email, role: 'pastor', status: 'active',
      createdAt: FieldValue.serverTimestamp(), createdBy: request.auth.uid
    });
    tx.set(userRef, {
      uid: applicant.uid, displayName: application.pastor || applicant.displayName || 'Pastor',
      email: applicant.email || application.email, role: 'pastor', churchId, status: 'active',
      preferredLanguage: application.language || 'en', updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
    tx.update(appRef, { status: 'approved', churchId, approvedAt: FieldValue.serverTimestamp(), approvedBy: request.auth.uid });
    tx.create(auditRef, { action: 'church_application_approved', actorUid: request.auth.uid, applicationId, churchId, targetUid: applicant.uid, createdAt: FieldValue.serverTimestamp() });
  });
  return { ok: true, churchId };
});

exports.rejectChurchApplication = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  requireDeveloper(request);
  const applicationId = cleanString(request.data?.applicationId, 'applicationId', 160);
  const reason = cleanString(request.data?.reason || 'Application not approved', 'reason', 500);
  const ref = db.collection('churchApplications').doc(applicationId);
  const snap = await ref.get();
  if (!snap.exists) throw new HttpsError('not-found', 'Church application not found.');
  if (snap.data().status !== 'pending') throw new HttpsError('failed-precondition', 'Application is not pending.');
  await ref.update({ status: 'rejected', rejectionReason: reason, rejectedBy: request.auth.uid, rejectedAt: FieldValue.serverTimestamp() });
  await db.collection('auditLogs').add({ action: 'church_application_rejected', actorUid: request.auth.uid, applicationId, reason, createdAt: FieldValue.serverTimestamp() });
  return { ok: true };
});

exports.createChurchMember = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign-in required.');
  const pastorUid = request.auth.uid;
  const pastorSnap = await db.collection('users').doc(pastorUid).get();
  if (!pastorSnap.exists) throw new HttpsError('permission-denied', 'Pastor profile is missing.');
  const pastor = pastorSnap.data();
  if (pastor.status !== 'active' || pastor.role !== 'pastor' || !pastor.churchId) {
    throw new HttpsError('permission-denied', 'Only an active pastor can register church members.');
  }
  const churchRef = db.collection('churches').doc(pastor.churchId);
  const churchSnap = await churchRef.get();
  if (!churchSnap.exists || churchSnap.data().status !== 'approved') throw new HttpsError('failed-precondition', 'Church is not approved.');

  const name = cleanString(request.data?.name, 'name', 100);
  const email = cleanString(request.data?.email, 'email', 254).toLowerCase();
  const phone = typeof request.data?.phone === 'string' ? request.data.phone.trim() : '';
  const role = cleanString(request.data?.role || 'member', 'role', 30);
  if (!allowedChurchRoles.has(role)) throw new HttpsError('permission-denied', 'This role cannot be assigned by a pastor.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpsError('invalid-argument', 'A valid email is required.');
  const existing = await auth.getUserByEmail(email).catch(e => e.code === 'auth/user-not-found' ? null : Promise.reject(e));
  if (existing) throw new HttpsError('already-exists', 'This email already has an account. Ask the member to sign in and contact the church administrator to link the existing account.');

  const randomPassword = crypto.randomBytes(24).toString('base64url') + 'aA1!';
  const userRecord = await auth.createUser({ email, displayName: name, password: randomPassword, ...(phone ? { phoneNumber: phone } : {}) });
  const userRef = db.collection('users').doc(userRecord.uid);
  const memberRef = churchRef.collection('members').doc(userRecord.uid);
  const batch = db.batch();
  batch.create(userRef, { uid: userRecord.uid, displayName: name, email, phone: phone || null, role, churchId: pastor.churchId, status: 'active', preferredLanguage: 'om', createdAt: FieldValue.serverTimestamp(), createdBy: pastorUid });
  batch.create(memberRef, { uid: userRecord.uid, displayName: name, email, phone: phone || null, role, status: 'active', createdAt: FieldValue.serverTimestamp(), createdBy: pastorUid });
  batch.create(db.collection('auditLogs').doc(), { action: 'church_member_created', actorUid: pastorUid, targetUid: userRecord.uid, churchId: pastor.churchId, role, createdAt: FieldValue.serverTimestamp() });
  try { await batch.commit(); } catch (e) { await auth.deleteUser(userRecord.uid).catch(() => {}); throw e; }
  const resetLink = await auth.generatePasswordResetLink(email);
  return { ok: true, uid: userRecord.uid, resetLink };
});
