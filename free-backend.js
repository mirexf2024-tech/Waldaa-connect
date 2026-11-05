/* Waldaa Connect — FREE plan backend (no Cloud Functions). Rules in firestore.rules enforce every action. */
(() => {
'use strict';
const TS = () => firebase.firestore.FieldValue.serverTimestamp();
const db = () => firebase.firestore();
const ROLES = ['secretary', 'finance', 'choir', 'prayer', 'auditor', 'member'];
const T = {
 om: { join:'Afeeramtee? Account uumi', name:'Maqaa guutuu', email:'Imeelii', pw:'Jecha darbii (≥6)', go:'Uumi', cancel:'Dhiisi', ok:'Account uumameera. Imeelii kee mirkaneessi (linkii ergameera), achiis seeni.', invited:'Miseensi kun imeelii kanaan “Account uumi” cuqaasee, imeelii isaa mirkaneessee, achiis seenuu qaba.' },
 en: { join:'Invited? Create account', name:'Full name', email:'Email', pw:'Password (≥6)', go:'Create', cancel:'Cancel', ok:'Account created. Verify your email (link sent), then sign in.', invited:'This member must tap “Create account” with this email, verify it, then sign in.' },
 am: { join:'ተጋብዘዋል? መለያ ይክፈቱ', name:'ሙሉ ስም', email:'ኢሜይል', pw:'የይለፍ ቃል (≥6)', go:'ፍጠር', cancel:'ተው', ok:'መለያ ተፈጥሯል። ኢሜይልዎን ያረጋግጡ፣ ከዚያ ይግቡ።', invited:'ይህ አባል በዚህ ኢሜይል “መለያ ይክፈቱ” ብሎ ኢሜይሉን አረጋግጦ መግባት አለበት።' }
};
const tr = k => (T[document.documentElement.lang] || T.om)[k];
const note = m => (window.notify ? window.notify(m) : alert(m));

async function approveChurch(appId) {
  const d = db(), ref = d.collection('churchApplications').doc(appId), s = await ref.get();
  if (!s.exists || s.data().status !== 'pending') throw new Error('Application is not pending.');
  const a = s.data(), church = d.collection('churches').doc(), me = firebase.auth().currentUser.uid, b = d.batch();
  b.set(church, { name: a.name, city: a.city || '', country: a.country || '', language: ['om', 'am', 'en'].includes(a.language) ? a.language : 'en', status: 'approved', pastorUid: a.applicantUid, approvedAt: TS(), approvedBy: me, createdAt: a.createdAt || TS(), estimatedMembers: Number.isSafeInteger(a.estimatedMembers) ? a.estimatedMembers : 0 });
  b.update(ref, { status: 'approved', churchId: church.id, approvedAt: TS(), approvedBy: me });
  b.set(d.collection('auditLogs').doc(), { action: 'church_application_approved', actorUid: me, applicationId: appId, churchId: church.id, createdAt: TS() });
  await b.commit();
  return { data: { churchId: church.id } };
}
async function rejectChurch(appId, reason) {
  const d = db(), me = firebase.auth().currentUser.uid, b = d.batch();
  b.update(d.collection('churchApplications').doc(appId), { status: 'rejected', rejectionReason: String(reason || '').slice(0, 500), rejectedBy: me, rejectedAt: TS() });
  b.set(d.collection('auditLogs').doc(), { action: 'church_application_rejected', actorUid: me, applicationId: appId, createdAt: TS() });
  await b.commit();
  return { data: { ok: true } };
}
async function inviteMember(p) {
  const d = db(), uid = firebase.auth().currentUser.uid;
  const email = String(p.email || '').trim().toLowerCase(), role = String(p.role || 'member');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('A valid email is required.');
  if (!ROLES.includes(role)) throw new Error('This role cannot be assigned by a pastor.');
  const me = (await d.collection('users').doc(uid).get()).data();
  if (!me || me.role !== 'pastor' || !me.churchId) throw new Error('Only an active pastor can invite members.');
  const ref = d.collection('invites').doc(email), old = await ref.get().catch(() => null);
  if (old && old.exists) {
    if (old.data().status !== 'pending') throw new Error('This email was already registered.');
    await ref.update({ role, name: String(p.name || '').slice(0, 100), phone: String(p.phone || '').slice(0, 30) });
  } else {
    await ref.set({ churchId: me.churchId, role, name: String(p.name || '').slice(0, 100), phone: String(p.phone || '').slice(0, 30), status: 'pending', createdBy: uid, createdAt: TS() });
  }
  return { data: { resetLink: tr('invited') } };
}
async function claimAccess(user) { // first sign-in after approval/invite: create own profile, verified by Firestore rules
  await user.reload(); await user.getIdToken(true);
  if (!user.emailVerified) return false;
  const d = db(), uid = user.uid, b = d.batch();
  const put = (cid, base, extra) => {
    b.set(d.doc(`users/${uid}`), { ...base, ...extra, uid, churchId: cid, preferredLanguage: document.documentElement.lang || 'om', updatedAt: TS() });
    b.set(d.doc(`churches/${cid}/members/${uid}`), { ...base, ...extra, uid, createdAt: TS() });
    b.set(d.doc(`churches/${cid}/directory/${uid}`), { displayName: base.displayName, role: base.role, status: 'active', ...extra });
  };
  const q = await d.collection('churchApplications').where('applicantUid', '==', uid).where('status', '==', 'approved').limit(1).get();
  if (!q.empty) {
    const a = q.docs[0], x = a.data();
    put(x.churchId, { displayName: x.pastor || user.displayName || 'Pastor', email: user.email, role: 'pastor', status: 'active' }, { applicationId: a.id });
    await b.commit(); return true;
  }
  const id = (user.email || '').toLowerCase(), inv = await d.collection('invites').doc(id).get().catch(() => null);
  if (inv && inv.exists && inv.data().status === 'pending') {
    const i = inv.data();
    put(i.churchId, { displayName: i.name || user.displayName || id, email: user.email, role: i.role, status: 'active' }, { inviteId: id });
    b.update(inv.ref, { status: 'claimed', claimedBy: uid, claimedAt: TS() });
    await b.commit(); return true;
  }
  return false;
}
window.WCFree = { approveChurch, rejectChurch, inviteMember, claimAccess };

function joinUI() {
  const btn = document.createElement('button');
  btn.style.cssText = 'position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom,0));z-index:9990;border:0;border-radius:20px;padding:9px 14px;background:#FCD116;color:#001A3A;font-weight:700;cursor:pointer;box-shadow:0 4px 14px #0004';
  btn.textContent = tr('join'); document.body.append(btn);
  firebase.auth().onAuthStateChanged(u => { btn.hidden = !!u; });
  btn.onclick = () => {
    const m = document.createElement('div'); m.style.cssText = 'position:fixed;inset:0;z-index:10000;background:#0008;display:grid;place-items:center;padding:16px';
    const f = (id, ph, type) => `<input id="${id}" type="${type}" placeholder="${ph}" style="width:100%;padding:11px;margin:5px 0;border:1px solid #ccd;border-radius:10px;font:inherit">`;
    m.innerHTML = `<div style="background:#fff;color:#0b1f3a;border-radius:16px;padding:18px;width:100%;max-width:360px"><h3 style="margin:0 0 6px">${tr('join')}</h3>${f('wf-n', tr('name'), 'text')}${f('wf-e', tr('email'), 'email')}${f('wf-p', tr('pw'), 'password')}<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button id="wf-x" style="padding:9px 14px;border:0;border-radius:10px">${tr('cancel')}</button><button id="wf-ok" style="padding:9px 14px;border:0;border-radius:10px;background:#FCD116;font-weight:700">${tr('go')}</button></div></div>`;
    document.body.append(m);
    m.querySelector('#wf-x').onclick = () => m.remove();
    m.querySelector('#wf-ok').onclick = async () => {
      const name = m.querySelector('#wf-n').value.trim(), email = m.querySelector('#wf-e').value.trim(), pw = m.querySelector('#wf-p').value;
      try {
        const u = (await firebase.auth().createUserWithEmailAndPassword(email, pw)).user;
        await u.updateProfile({ displayName: name }); await u.sendEmailVerification();
        await firebase.auth().signOut(); m.remove(); note(tr('ok'));
      } catch (e) { note(e.message); }
    };
  };
}
const start = () => { if (!window.firebase || !firebase.apps.length) return setTimeout(start, 400); joinUI(); };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
