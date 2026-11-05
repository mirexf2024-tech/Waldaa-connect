const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const { activeUser } = require('./common');
const db = getFirestore();
const REGION = 'us-central1';
const opts = { region: REGION, enforceAppCheck: false };
const STAFF = ['pastor', 'secretary'];

exports.listDirectory = onCall(opts, async (request) => {
  const u = await activeUser(request);
  const snap = await db.collection(`churches/${u.churchId}/members`).where('status', '==', 'active').limit(1000).get();
  return { members: snap.docs.map(d => ({ uid: d.id, name: d.data().displayName || '', role: d.data().role || 'member' })) };
});

exports.createChat = onCall(opts, async (request) => {
  const u = await activeUser(request);
  const type = request.data?.type;
  if (!['direct', 'group', 'channel'].includes(type)) throw new HttpsError('invalid-argument', 'Invalid chat type.');
  const base = db.doc(`churches/${u.churchId}`);
  const list = Array.isArray(request.data?.memberUids) ? request.data.memberUids.filter(x => typeof x === 'string') : [];
  let chatId, members, name = null;
  if (type === 'direct') {
    const other = list[0];
    if (!other || other === u.uid) throw new HttpsError('invalid-argument', 'Pick one other member.');
    members = [u.uid, other].sort();
    chatId = 'dm_' + members.join('_');
  } else {
    if (!STAFF.includes(u.role)) throw new HttpsError('permission-denied', 'Only pastor or secretary can create groups and channels.');
    name = String(request.data?.name || '').trim().slice(0, 80);
    if (name.length < 2) throw new HttpsError('invalid-argument', 'Name required.');
    if (type === 'channel') {
      const all = await base.collection('members').where('status', '==', 'active').limit(1000).get();
      members = all.docs.map(d => d.id);
    } else {
      members = [...new Set([u.uid, ...list])].slice(0, 200);
    }
    chatId = db.collection('_ids').doc().id;
  }
  const snaps = await db.getAll(...members.map(id => base.collection('members').doc(id)));
  if (snaps.some(s => !s.exists || s.data().status !== 'active')) throw new HttpsError('failed-precondition', 'All participants must be active church members.');
  const ref = base.collection('chats').doc(chatId);
  if ((await ref.get()).exists) return { chatId };
  const names = {};
  snaps.forEach(s => { names[s.id] = s.data().displayName || ''; });
  await ref.set({ type, name, members, names, createdBy: u.uid, createdAt: FieldValue.serverTimestamp(), lastAt: FieldValue.serverTimestamp(), lastMessage: null });
  return { chatId };
});

exports.saveFcmToken = onCall(opts, async (request) => {
  const u = await activeUser(request);
  const token = request.data?.token;
  if (typeof token !== 'string' || token.length < 20 || token.length > 4096) throw new HttpsError('invalid-argument', 'Invalid token.');
  await db.collection('userTokens').doc(u.uid).set({ tokens: FieldValue.arrayUnion(token), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { ok: true };
});

exports.onChatMessageCreated = onDocumentCreated(
  { document: 'churches/{churchId}/chats/{chatId}/messages/{msgId}', region: REGION },
  async (event) => {
    const m = event.data?.data();
    if (!m) return;
    const { churchId, chatId } = event.params;
    const chatRef = db.doc(`churches/${churchId}/chats/${chatId}`);
    const chat = (await chatRef.get()).data();
    if (!chat) return;
    const icon = { image: '📷', audio: '🎤', file: '📎' }[m.attachment?.kind] || '';
    const preview = `${icon} ${m.text || ''}`.trim().slice(0, 120);
    await chatRef.update({ lastMessage: { text: preview, senderUid: m.senderUid }, lastAt: m.createdAt || FieldValue.serverTimestamp() });
    const targets = (chat.members || []).filter(id => id !== m.senderUid);
    if (!targets.length) return;
    const docs = await db.getAll(...targets.map(id => db.collection('userTokens').doc(id)));
    const pairs = docs.flatMap(d => (d.exists ? d.data().tokens || [] : []).map(t => ({ uid: d.id, t })));
    const title = chat.type === 'direct' ? (chat.names?.[m.senderUid] || 'Waldaa Connect') : `${chat.name} · ${chat.names?.[m.senderUid] || ''}`;
    for (let i = 0; i < pairs.length; i += 500) {
      const part = pairs.slice(i, i + 500);
      const res = await getMessaging().sendEachForMulticast({
        tokens: part.map(p => p.t),
        data: { title, body: preview, chatId, churchId },
        webpush: { headers: { Urgency: 'high' } }
      });
      await Promise.all(res.responses.map((r, k) => (!r.success && /not-registered|invalid-registration/.test(r.error?.code || ''))
        ? db.collection('userTokens').doc(part[k].uid).update({ tokens: FieldValue.arrayRemove(part[k].t) }).catch(() => null)
        : null));
    }
  }
);
