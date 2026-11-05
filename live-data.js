/* Waldaa Connect — LIVE data (Firestore, free plan). Replaces every demo record. Rules decide who can read/write. */
(() => {
'use strict';
const db = () => firebase.firestore();
const TS = () => firebase.firestore.FieldValue.serverTimestamp();
const L = { unsubs: [], data: {}, timer: null };
const fmt = t => (t && t.toDate) ? t.toDate().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Amma';
const tm = t => (t && t.toMillis) ? t.toMillis() : Date.now();
const base = () => db().collection('churches').doc(session.churchId);
const TYPE = { 'Kurnoo': 'tithe', 'Kennaa Jaalalaa': 'offering', 'Deeggarsa Hojii Addaa': 'donation' };
const VERIFIED = 'Mirkanaa’e';

function refresh() { clearTimeout(L.timer); L.timer = setTimeout(() => { derive(); try { render(); } catch (e) { console.warn(e); } }, 120); }
function watch(kind, queries, apply) {
  L.data[kind] = queries.map(() => []);
  queries.forEach((q, i) => L.unsubs.push(q.onSnapshot(s => {
    L.data[kind][i] = s.docs.map(d => ({ id: d.id, ...d.data() }));
    const m = new Map(); L.data[kind].flat().forEach(x => m.set(x.id, x)); apply([...m.values()]); refresh();
  }, e => console.warn(kind, e.code))));
}
function donations() {
  const fin = (L.fin || []).map(x => ({ id: 'f' + x.id, name: x.donorName || '—', type: x.label || x.type, amount: x.amount, date: x.date || fmt(x.createdAt), status: VERIFIED, churchId: session.churchId, _t: tm(x.createdAt) }));
  const ref = (L.refs || []).filter(x => x.status !== 'verified').map(x => ({ id: 'p' + x.id, name: x.donorName || '—', type: x.type, amount: x.amount, date: x.date || fmt(x.createdAt), status: x.status === 'rejected' ? 'Didameera' : 'Eegaa jira', churchId: session.churchId, _t: tm(x.createdAt) }));
  state.donations = [...fin, ...ref].sort((a, b) => b._t - a._t);
}
function derive() {
  state.notifications = state.posts.slice(0, 20).map(p => ({ id: p.id, title: p.title, text: p.body, time: p.date, read: (state.readNotifs || []).includes(p.id) }));
  state.activities = [...state.prayers.filter(p => p.visibility === 'community').slice(0, 4).map(p => ({ icon: '🙏', title: 'Gaaffii kadhannaa', text: p.title, time: p.date, _t: p._t })),
    ...state.posts.slice(0, 4).map(p => ({ icon: '⛪', title: p.title, text: (p.body || '').slice(0, 80), time: p.date, _t: p._t }))].sort((a, b) => b._t - a._t).slice(0, 6);
}
function start() {
  stop(); if (!window.firebase || !session || session.mode !== 'firebase') return;
  const role = session.role, uid = session.id, cid = session.churchId;
  if (role === 'developer') {
    watch('churches', [db().collection('churches')], l => { state.churches = l.map(c => ({ id: c.id, name: c.name, city: c.city, country: c.country, language: c.language, status: c.status || 'approved', pastor: c.pastorName || '', members: c.estimatedMembers || 0 })); });
    return;
  }
  if (!cid) return;
  const b = base();
  state.churches = typeof firebaseChurch !== 'undefined' && firebaseChurch ? [{ id: cid, name: firebaseChurch.name, city: firebaseChurch.city, country: firebaseChurch.country, language: firebaseChurch.language, status: 'approved', pastor: '', members: 0 }] : [];
  const pr = ['pastor', 'prayer'].includes(role) ? [b.collection('prayers')]
    : role === 'member' ? [b.collection('prayers').where('ownerUid', '==', uid), b.collection('prayers').where('visibility', '==', 'community')]
    : [b.collection('prayers').where('ownerUid', '==', uid)];
  watch('prayers', pr, l => { state.prayers = l.map(p => ({ id: p.id, title: p.title, body: p.body, category: p.category, visibility: p.visibility, status: p.status, by: p.by, ownerId: p.ownerUid, date: fmt(p.createdAt), _t: tm(p.createdAt) })).sort((a, b) => b._t - a._t); });
  if (['pastor', 'choir', 'member'].includes(role)) watch('songs', [b.collection('choir')], l => { state.songs = l.map(s => ({ id: s.id, title: s.title, group: s.group, leader: s.leader, status: s.status, lyrics: s.lyrics })); });
  watch('posts', [b.collection('announcements').orderBy('createdAt', 'desc').limit(50)], l => { state.posts = l.map(p => ({ id: p.id, title: p.title, body: p.body, by: p.by, category: p.category, date: fmt(p.createdAt), _t: tm(p.createdAt) })).sort((a, b) => b._t - a._t); });
  if (['pastor', 'finance', 'auditor'].includes(role)) {
    watch('fin', [b.collection('finance').orderBy('createdAt', 'desc').limit(200)], l => { L.fin = l; donations(); });
    watch('refs', [b.collection('paymentRefs').limit(200)], l => { L.refs = l; donations(); });
  }
  watch('dir', [b.collection('directory')], l => { state.memberCount = l.filter(x => x.status === 'active').length; });
}
function stop() { L.unsubs.forEach(f => f()); L.unsubs = []; L.data = {}; L.fin = []; L.refs = []; }

const need = () => { if (!session || session.mode !== 'firebase' || !session.churchId) throw new Error('Sign in with a church account first.'); };
async function addPrayer(d) { need(); await base().collection('prayers').add({ title: d.title, body: d.body, category: d.category, visibility: d.visibility, status: 'Kadhannaa itti fufa', by: session.name, ownerUid: session.id, createdAt: TS() }); }
async function addSong(d) { need(); await base().collection('choir').add({ title: d.title, group: d.group, leader: d.leader || session.name, lyrics: d.lyrics || '', status: 'approved', createdBy: session.id, createdAt: TS() }); }
async function addPost(d) { need(); await base().collection('announcements').add({ title: d.title, body: d.body, category: d.category || 'announcement', by: session.name, createdBy: session.id, createdAt: TS() }); }
async function addDonation(d) {
  need(); const label = d.type, type = TYPE[label] || 'donation', amount = Number(d.amount);
  if (!(amount > 0)) throw new Error('Amount must be greater than 0.');
  const row = { amount, type, label, donorName: d.name, date: d.date, createdAt: TS() };
  if (d.status === VERIFIED) await base().collection('finance').add({ ...row, createdBy: session.id, verified: true });
  else await base().collection('paymentRefs').add({ ...row, type: label, uid: session.id, status: 'pending' });
}
async function verifyDonation(id) {
  need(); if (id[0] !== 'p') return false;
  const rid = id.slice(1), r = (L.refs || []).find(x => x.id === rid); if (!r) return false;
  const b = db().batch(), bs = base();
  b.update(bs.collection('paymentRefs').doc(rid), { status: 'verified', verifiedBy: session.id, verifiedAt: TS() });
  b.set(bs.collection('finance').doc(), { amount: r.amount, type: TYPE[r.type] || 'donation', label: r.type, donorName: r.donorName || '', date: r.date || '', createdBy: session.id, verified: true, fromRef: rid, createdAt: TS() });
  await b.commit(); return true;
}
async function setRole(uid, role) {
  need(); const b = db().batch(), bs = base();
  b.update(bs.collection('members').doc(uid), { role }); b.update(bs.collection('directory').doc(uid), { role }); b.update(db().collection('users').doc(uid), { role });
  await b.commit();
}
window.WCLive = { start, stop, addPrayer, addSong, addPost, addDonation, verifyDonation, setRole };
})();
