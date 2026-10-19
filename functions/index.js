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
function isCloudinaryImageUrl(value) {
  return typeof value === 'string' && value.length <= 1500 && /^https:\/\/res\.cloudinary\.com\/zkyyos4t\/image\/upload\//.test(value);
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
      estimatedMembers: Number.isSafeInteger(application.estimatedMembers) ? application.estimatedMembers : 0,
      ...(isCloudinaryImageUrl(application.logoUrl) ? { logoUrl: application.logoUrl } : {})
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
  const photoUrl = request.data?.photoUrl ? cleanString(request.data.photoUrl, 'photoUrl', 1500) : '';
  if (photoUrl && !isCloudinaryImageUrl(photoUrl)) throw new HttpsError('invalid-argument', 'Photo URL must be a Cloudinary image URL for this project.');
  if (!allowedChurchRoles.has(role)) throw new HttpsError('permission-denied', 'This role cannot be assigned by a pastor.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpsError('invalid-argument', 'A valid email is required.');
  const existing = await auth.getUserByEmail(email).catch(e => e.code === 'auth/user-not-found' ? null : Promise.reject(e));
  if (existing) throw new HttpsError('already-exists', 'This email already has an account. Ask the member to sign in and contact the church administrator to link the existing account.');

  const randomPassword = crypto.randomBytes(24).toString('base64url') + 'aA1!';
  const userRecord = await auth.createUser({ email, displayName: name, password: randomPassword, ...(phone ? { phoneNumber: phone } : {}) });
  const userRef = db.collection('users').doc(userRecord.uid);
  const memberRef = churchRef.collection('members').doc(userRecord.uid);
  const batch = db.batch();
  batch.create(userRef, { uid: userRecord.uid, displayName: name, email, phone: phone || null, role, churchId: pastor.churchId, status: 'active', preferredLanguage: 'om', ...(photoUrl ? { photoUrl } : {}), createdAt: FieldValue.serverTimestamp(), createdBy: pastorUid });
  batch.create(memberRef, { uid: userRecord.uid, displayName: name, email, phone: phone || null, role, status: 'active', ...(photoUrl ? { photoUrl } : {}), createdAt: FieldValue.serverTimestamp(), createdBy: pastorUid });
  batch.create(db.collection('auditLogs').doc(), { action: 'church_member_created', actorUid: pastorUid, targetUid: userRecord.uid, churchId: pastor.churchId, role, createdAt: FieldValue.serverTimestamp() });
  try { await batch.commit(); } catch (e) { await auth.deleteUser(userRecord.uid).catch(() => {}); throw e; }
  const resetLink = await auth.generatePasswordResetLink(email);
  return { ok: true, uid: userRecord.uid, resetLink };
});


// First-device binding is a useful account-sharing barrier, not cryptographic proof of a physical phone.
// Browser storage can be cleared or copied; combine this with verified email, Firebase Auth, Rules and recovery procedures.
exports.registerCurrentDevice = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign-in required.');
  const deviceId = cleanString(request.data?.deviceId, 'deviceId', 128);
  if (deviceId.length < 32) throw new HttpsError('invalid-argument', 'Invalid device identifier.');
  const uid = request.auth.uid;
  const userRef = db.collection('users').doc(uid);
  const deviceHash = crypto.createHash('sha256').update(deviceId).digest('hex');
  const label = typeof request.data?.deviceLabel === 'string' ? request.data.deviceLabel.slice(0, 160) : 'web';
  const result = await db.runTransaction(async (tx) => {
    const snap = await tx.get(userRef);
    if (!snap.exists) throw new HttpsError('failed-precondition', 'User profile is missing.');
    const user = snap.data();
    if (user.status !== 'active') throw new HttpsError('permission-denied', 'Account is not active.');
    const binding = user.deviceBinding;
    if (!binding) {
      tx.update(userRef, { deviceBinding: { deviceHash, label, registeredAt: FieldValue.serverTimestamp(), lastSeenAt: FieldValue.serverTimestamp() } });
      tx.create(db.collection('auditLogs').doc(), { action: 'device_registered', actorUid: uid, createdAt: FieldValue.serverTimestamp() });
      return { registered: true, firstDevice: true };
    }
    if (binding.deviceHash !== deviceHash) throw new HttpsError('permission-denied', 'This account is registered on another device. Contact the church administrator or Developer for account recovery.');
    tx.update(userRef, { 'deviceBinding.lastSeenAt': FieldValue.serverTimestamp(), 'deviceBinding.label': label });
    return { registered: true, firstDevice: false };
  });
  return result;
});

exports.resetMemberDeviceBinding = onCall({ region: REGION, enforceAppCheck: false }, async (request) => {
  requireDeveloper(request);
  const uid = cleanString(request.data?.uid, 'uid', 128);
  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  if (!snap.exists) throw new HttpsError('not-found', 'User profile not found.');
  await userRef.update({ deviceBinding: FieldValue.delete(), deviceBindingResetAt: FieldValue.serverTimestamp(), deviceBindingResetBy: request.auth.uid });
  await db.collection('auditLogs').add({ action: 'device_binding_reset', actorUid: request.auth.uid, targetUid: uid, createdAt: FieldValue.serverTimestamp() });
  return { ok: true };
});
