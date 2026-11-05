/* Waldaa Connect — chat (Firestore + Cloudinary, free plan). Self-booting: needs only chat.css/chat.js tags in index.html. */
(() => {
'use strict';
const CFG = { CLOUD_NAME: '', UPLOAD_PRESET: '', MAX_BYTES: 10 * 1024 * 1024 }; // Cloudinary: Cloud name + UNSIGNED upload preset (free plan, no server)
const L = {
 om: { chats:'Marii', newDirect:'Marii haaraa', newGroup:'Garee haaraa', newChannel:'Chaanaalii haaraa', search:'Barbaadi', typeMsg:'Ergaa barreessi…', send:'Ergi', reply:'Deebisi', del:'Haqi', deleted:'Ergaan kun haqameera', noChats:'Marii hin jiru', notif:'Beeksisa banuu', name:'Maqaa', create:'Uumi', cancel:'Dhiisi', tooBig:'Faayilli guddaadha (hanga 10MB)', failed:'Hin milkoofne', channelOnly:'Pastorii fi Barreessaan qofa barreessu', pick:'Miseensota filadhu' },
 en: { chats:'Chats', newDirect:'New chat', newGroup:'New group', newChannel:'New channel', search:'Search', typeMsg:'Type a message…', send:'Send', reply:'Reply', del:'Delete', deleted:'This message was deleted', noChats:'No chats yet', notif:'Enable notifications', name:'Name', create:'Create', cancel:'Cancel', tooBig:'File too large (max 10MB)', failed:'Failed', channelOnly:'Only pastor and secretary can post', pick:'Select members' },
 am: { chats:'ውይይቶች', newDirect:'አዲስ ውይይት', newGroup:'አዲስ ቡድን', newChannel:'አዲስ ቻናል', search:'ፈልግ', typeMsg:'መልእክት ጻፍ…', send:'ላክ', reply:'መልስ', del:'ሰርዝ', deleted:'መልእክቱ ተሰርዟል', noChats:'ውይይት የለም', notif:'ማሳወቂያ አብራ', name:'ስም', create:'ፍጠር', cancel:'ተው', tooBig:'ፋይሉ ትልቅ ነው (ቢበዛ 10MB)', failed:'አልተሳካም', channelOnly:'ፓስተር እና ጸሐፊ ብቻ ይጽፋሉ', pick:'ተሳታፊዎችን ምረጥ' }
};
const tr = k => (L[document.documentElement.lang] || L.om)[k] || L.en[k] || k;
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const okUrl = u => typeof u === 'string' && u.startsWith('https://res.cloudinary.com/');
const el = h => { const t = document.createElement('template'); t.innerHTML = h.trim(); return t.content.firstChild; };
const STAFF = ['pastor', 'secretary'];
let db, me, chats = [], reads = {}, dir = {}, active = null, replyTo = null, tq = '';
let root, fab, unsubs = [], unsubMsgs = null, recorder = null;

function toast(t) { const x = el(`<div class="wc-toast" role="status">${esc(t)}</div>`); document.body.append(x); setTimeout(() => x.remove(), 3000); }
const nm = (c, u) => c.names?.[u] || dir[u]?.displayName || '';
const cpath = () => `churches/${me.churchId}/chats/${active.id}`;
const title = c => c.type === 'direct' ? (nm(c, c.members.find(x => x !== me.uid)) || '—') : (c.name || '—');
const ms = t => (t && t.toMillis) ? t.toMillis() : 0;
const isUnread = c => c.lastMessage && c.lastMessage.senderUid !== me.uid && ms(c.lastAt) > ms(reads[c.id]);
const hhmm = t => t && t.toDate ? t.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

function boot() {
  if (!window.firebase || !firebase.apps.length) return setTimeout(boot, 400);
  db = firebase.firestore();
  try { db.enablePersistence({ synchronizeTabs: true }).catch(() => {}); } catch (e) {}
  firebase.auth().onAuthStateChanged(async u => {
    teardown(); if (!u) return;
    const s = await db.collection('users').doc(u.uid).get().catch(() => null);
    const p = s && s.exists ? s.data() : null;
    if (!p || p.status !== 'active' || !p.churchId) return; // Developer / pending users: no chat
    me = { uid: u.uid, name: p.displayName || '', role: p.role, churchId: p.churchId };
    mount(); watch();
  });
}
function teardown() { unsubs.forEach(f => f()); unsubs = []; if (unsubMsgs) unsubMsgs(); unsubMsgs = null; root?.remove(); fab?.remove(); chats = []; reads = {}; active = null; }

function mount() {
  fab = el(`<button class="wc-fab" aria-label="${esc(tr('chats'))}">💬<span class="wc-badge" hidden></span></button>`);
  root = el(`<section class="wc-chat" hidden aria-label="${esc(tr('chats'))}">
   <div class="wc-list"><div class="wc-h"><b>${esc(tr('chats'))}</b><button class="plus" aria-label="+">＋</button><button class="close" aria-label="×">✕</button></div>
    <input class="wc-q" type="search" placeholder="${esc(tr('search'))}"><ul class="wc-items"></ul></div>
   <div class="wc-thread" hidden><div class="wc-h"><button class="wc-back" aria-label="←">←</button><b class="tt"></b><button class="sq" aria-label="${esc(tr('search'))}">🔍</button></div>
    <input class="wc-q tq" type="search" hidden placeholder="${esc(tr('search'))}"><div class="wc-msgs"></div>
    <div class="wc-replybar" hidden><span></span><button class="rx" aria-label="×">✕</button></div><div class="wc-compose"></div></div></section>`);
  document.body.append(fab, root);
  fab.onclick = () => { root.hidden = false; fab.hidden = true; };
  root.querySelector('.close').onclick = () => { root.hidden = true; fab.hidden = false; };
  root.querySelector('.wc-list .wc-q').oninput = renderList;
  root.querySelector('.plus').onclick = () => { const o = ['direct']; if (STAFF.includes(me.role)) o.push('group', 'channel');
    const t = o.length === 1 ? 'direct' : (prompt(`1 = ${tr('newDirect')}\n2 = ${tr('newGroup')}\n3 = ${tr('newChannel')}`, '1') || '').trim();
    const type = o.length === 1 ? 'direct' : ({ '1':'direct', '2':'group', '3':'channel' }[t]); if (type) openNew(type); };
  root.querySelector('.wc-back').onclick = () => { root.classList.remove('th'); active = null; if (unsubMsgs) unsubMsgs(); renderList(); };
  root.querySelector('.sq').onclick = () => { const q = root.querySelector('.tq'); q.hidden = !q.hidden; tq = ''; q.value = ''; renderMsgs(); };
  root.querySelector('.tq').oninput = e => { tq = e.target.value.toLowerCase(); renderMsgs(); };
  root.querySelector('.rx').onclick = () => { replyTo = null; root.querySelector('.wc-replybar').hidden = true; };
  root.querySelector('.wc-items').onclick = e => { const li = e.target.closest('li[data-id]'); if (li) openChat(li.dataset.id); };
  root.querySelector('.wc-msgs').onclick = e => { const b = e.target.closest('button[data-a]'); if (!b) return; const m = msgs.find(x => x.id === b.dataset.id); if (!m) return;
    if (b.dataset.a === 'del') db.doc(`${cpath()}/messages/${m.id}`).update({ deleted: true }).catch(() => toast(tr('failed')));
    else { replyTo = m; const bar = root.querySelector('.wc-replybar'); bar.hidden = false; bar.firstChild.textContent = '↩ ' + (m.text || '').slice(0, 60); root.querySelector('textarea')?.focus(); } };
}

function watch() {
  const base = `churches/${me.churchId}`; let mine = [], chan = [];
  const merge = () => { const m = new Map(); [...mine, ...chan].forEach(c => m.set(c.id, c)); chats = [...m.values()].sort((a, b) => ms(b.lastAt) - ms(a.lastAt)); renderList(); badge(); };
  unsubs.push(db.collection(`${base}/chats`).where('members', 'array-contains', me.uid).orderBy('lastAt', 'desc').limit(100)
    .onSnapshot(x => { mine = x.docs.map(d => ({ id: d.id, ...d.data() })); merge(); }, e => console.warn('chats', e.message)));
  unsubs.push(db.collection(`${base}/chats`).where('type', '==', 'channel').limit(30)
    .onSnapshot(x => { chan = x.docs.map(d => ({ id: d.id, ...d.data() })); merge(); }, e => console.warn('channels', e.message)));
  unsubs.push(db.doc(`${base}/chatReads/${me.uid}`).onSnapshot(x => { reads = x.exists ? x.data() : {}; renderList(); badge(); }, () => {}));
  unsubs.push(db.collection(`${base}/directory`).limit(1000).onSnapshot(x => { dir = {}; x.docs.forEach(d => { dir[d.id] = d.data(); }); renderMsgs && active && renderMsgs(); }, () => {}));
}
function badge() { const n = chats.filter(isUnread).length; const b = fab?.querySelector('.wc-badge'); if (b) { b.hidden = !n; b.textContent = n; } }

function renderList() {
  if (!root) return;
  const q = root.querySelector('.wc-list .wc-q').value.toLowerCase();
  const rows = chats.filter(c => title(c).toLowerCase().includes(q));
  root.querySelector('.wc-items').innerHTML = rows.length ? rows.map(c => `<li data-id="${esc(c.id)}" class="${active?.id === c.id ? 'act' : ''}"><div class="wc-av">${esc(title(c).slice(0, 1).toUpperCase())}</div>
    <div class="wc-it"><b>${c.type === 'channel' ? '📢 ' : c.type === 'group' ? '👥 ' : ''}${esc(title(c))}</b><small>${esc(c.lastMessage?.text || '')}</small></div>${isUnread(c) ? '<span class="wc-dot"></span>' : ''}</li>`).join('')
    : `<li class="wc-note">${esc(tr('noChats'))}</li>`;
}

let msgs = [];
function openChat(id) {
  active = chats.find(c => c.id === id); if (!active) return;
  root.classList.add('th'); root.querySelector('.wc-thread').hidden = false; root.querySelector('.tt').textContent = title(active);
  replyTo = null; root.querySelector('.wc-replybar').hidden = true; tq = '';
  renderCompose(); renderList();
  if (unsubMsgs) unsubMsgs();
  unsubMsgs = db.collection(`${cpath()}/messages`).orderBy('createdAt', 'desc').limit(60).onSnapshot(s => {
    msgs = s.docs.map(d => ({ id: d.id, ...d.data() })).reverse(); renderMsgs(); markRead();
  }, e => console.warn('messages', e.message));
}
function markRead() { if (active) db.doc(`churches/${me.churchId}/chatReads/${me.uid}`).set({ [active.id]: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true }).catch(() => {}); }

function renderMsgs() {
  const box = root.querySelector('.wc-msgs'); const near = box.scrollHeight - box.scrollTop - box.clientHeight < 140;
  box.innerHTML = msgs.filter(m => !tq || (m.text || '').toLowerCase().includes(tq)).map(m => {
    const mine = m.senderUid === me.uid; let b = '';
    if (m.deleted) b = `<i>${esc(tr('deleted'))}</i>`;
    else {
      if (m.replyTo) b += `<div class="wc-rep"><b>${esc(nm(active, m.replyTo.senderUid))}</b> ${esc(m.replyTo.text)}</div>`;
      const a = m.attachment;
      if (a && okUrl(a.url)) b += a.kind === 'image' ? `<a href="${esc(a.url)}" target="_blank" rel="noopener"><img loading="lazy" src="${esc(a.url)}" alt=""></a>`
        : a.kind === 'audio' ? `<audio controls preload="none" src="${esc(a.url)}"></audio>` : `<a href="${esc(a.url)}" target="_blank" rel="noopener">📎 ${esc(a.name || 'file')}</a>`;
      if (m.text) b += `<p>${esc(m.text)}</p>`;
    }
    const tools = m.deleted ? '' : `<span class="wc-tools"><button data-a="reply" data-id="${esc(m.id)}" title="${esc(tr('reply'))}">↩</button>${mine ? `<button data-a="del" data-id="${esc(m.id)}" title="${esc(tr('del'))}">🗑</button>` : ''}</span>`;
    return `<div class="wc-m ${mine ? 'me' : ''}">${!mine && active.type !== 'direct' ? `<span class="by">${esc(nm(active, m.senderUid))}</span>` : ''}${b}<small>${hhmm(m.createdAt)}${tools}</small></div>`;
  }).join('');
  if (near) box.scrollTop = box.scrollHeight;
}

function renderCompose() {
  const c = root.querySelector('.wc-compose');
  if (active.type === 'channel' && !STAFF.includes(me.role)) { c.innerHTML = `<div class="wc-note">${esc(tr('channelOnly'))}</div>`; return; }
  c.innerHTML = `<div class="wc-bar"><button class="att" aria-label="📎">📎</button><input type="file" hidden><textarea rows="1" placeholder="${esc(tr('typeMsg'))}" maxlength="4000"></textarea><button class="mic" aria-label="🎤">🎤</button><button class="send" aria-label="${esc(tr('send'))}">➤</button></div>`;
  const ta = c.querySelector('textarea'), file = c.querySelector('input[type=file]');
  const go = () => { const t = ta.value; ta.value = ''; send(t); };
  c.querySelector('.send').onclick = go;
  ta.onkeydown = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); go(); } };
  c.querySelector('.att').onclick = () => file.click();
  file.onchange = async () => { const f = file.files[0]; file.value = ''; if (!f) return; await sendFile(f, f.type.startsWith('image/') ? 'image' : 'file'); };
  c.querySelector('.mic').onclick = e => toggleRec(e.currentTarget);
}

async function send(text, attachment) {
  text = (text || '').trim(); if (!text && !attachment || !active) return;
  const now = firebase.firestore.FieldValue.serverTimestamp();
  const d = { senderUid: me.uid, text, createdAt: now };
  if (replyTo) d.replyTo = { id: replyTo.id, text: (replyTo.text || '').slice(0, 100), senderUid: replyTo.senderUid };
  if (attachment) d.attachment = attachment;
  replyTo = null; root.querySelector('.wc-replybar').hidden = true;
  const icon = { image: '📷', audio: '🎤', file: '📎' }[attachment?.kind] || '';
  const b = db.batch();
  b.set(db.collection(`${cpath()}/messages`).doc(), d);
  b.update(db.doc(cpath()), { lastMessage: { text: `${icon} ${text}`.trim().slice(0, 120), senderUid: me.uid }, lastAt: now });
  await b.commit().catch(() => toast(tr('failed'))); // queued automatically while offline
}
async function sendFile(f, kind) {
  if (f.size > CFG.MAX_BYTES) return toast(tr('tooBig'));
  if (!CFG.CLOUD_NAME || !CFG.UPLOAD_PRESET) return toast('Cloudinary: set CLOUD_NAME + UPLOAD_PRESET in chat.js');
  try {
    const rt = { image: 'image', audio: 'video', file: 'raw' }[kind];
    const fd = new FormData(); fd.append('file', f); fd.append('upload_preset', CFG.UPLOAD_PRESET); fd.append('folder', `waldaa/${me.churchId}/chat`);
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CFG.CLOUD_NAME}/${rt}/upload`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error('upload'); const j = await r.json();
    await send('', { kind, url: j.secure_url, name: (f.name || 'voice').slice(0, 100) });
  } catch (e) { toast(tr('failed')); }
}
async function toggleRec(btn) {
  if (recorder) { recorder.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const parts = [];
    recorder = new MediaRecorder(stream); btn.classList.add('rec'); btn.textContent = '⏹';
    recorder.ondataavailable = e => parts.push(e.data);
    recorder.onstop = async () => { stream.getTracks().forEach(t => t.stop()); const type = recorder.mimeType || 'audio/webm'; recorder = null; btn.classList.remove('rec'); btn.textContent = '🎤';
      await sendFile(new File([new Blob(parts, { type })], 'voice.' + (type.includes('mp4') ? 'm4a' : 'webm'), { type }), 'audio'); };
    recorder.start();
  } catch (e) { recorder = null; toast(tr('failed')); }
}

async function openNew(type) {
  const people = Object.entries(dir).filter(([id, m]) => id !== me.uid && m.status === 'active').map(([id, m]) => ({ uid: id, name: m.displayName || '', role: m.role || 'member' }));
  const kind = type === 'direct' ? 'radio' : 'checkbox';
  const box = el(`<div class="wc-modal"><div class="wc-card"><h3>${esc(tr(type === 'direct' ? 'newDirect' : type === 'group' ? 'newGroup' : 'newChannel'))}</h3>
   ${type !== 'direct' ? `<input class="wc-name" type="text" maxlength="80" placeholder="${esc(tr('name'))}">` : ''}
   ${type !== 'channel' ? `<p>${esc(tr('pick'))}</p><div class="wc-dir">${people.map(m => `<label><input type="${kind}" name="m" value="${esc(m.uid)}"> ${esc(m.name)} <small>${esc(m.role)}</small></label>`).join('')}</div>` : ''}
   <div class="wc-row"><button class="x">${esc(tr('cancel'))}</button><button class="wc-ok">${esc(tr('create'))}</button></div></div></div>`);
  document.body.append(box);
  box.querySelector('.x').onclick = () => box.remove();
  box.querySelector('.wc-ok').onclick = async () => {
    const uids = [...box.querySelectorAll('input[name=m]:checked')].map(i => i.value);
    const name = (box.querySelector('.wc-name')?.value || '').trim();
    const label = u => dir[u]?.displayName || '';
    let id, data;
    if (type === 'direct') { if (uids.length !== 1) return; const members = [me.uid, uids[0]].sort(); id = 'dm_' + members.join('_'); data = { type, name: null, members, names: { [me.uid]: label(me.uid) || me.name, [uids[0]]: label(uids[0]) } }; }
    else { if (name.length < 2) return; const members = type === 'channel' ? [me.uid] : [...new Set([me.uid, ...uids])].slice(0, 200);
      id = db.collection('_ids').doc().id; data = { type, name: name.slice(0, 80), members, names: Object.fromEntries(members.map(u => [u, label(u)])) }; }
    try {
      if (!chats.some(c => c.id === id)) { const now = firebase.firestore.FieldValue.serverTimestamp();
        await db.doc(`churches/${me.churchId}/chats/${id}`).set({ ...data, createdBy: me.uid, createdAt: now, lastAt: now, lastMessage: null }); }
      box.remove();
      const wait = setInterval(() => { if (chats.some(c => c.id === id)) { clearInterval(wait); openChat(id); } }, 250); setTimeout(() => clearInterval(wait), 6000);
    } catch (e) { toast(tr('failed')); }
  };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
