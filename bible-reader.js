/* Waldaa Connect — full-screen Bible reader (own page). Opens when a member taps "Bible". Data: bibleVersions/{vid}/chapters/{book}_{ch} */
(() => {
'use strict';
const T = {
 om: { close:'Cufi', prev:'‹ Duubatti', next:'Itti aanu ›', pick:'Kitaaba fi boqonnaa', ot:'Kakuu Moofaa', nt:'Kakuu Haaraa', saved:'♡ Koo', save:'♡ Kuusi', ok:'Kuufameera', copy:'Garagalchi', copied:'Garagalfameera', none:'Macaafni Qulqulluu amma hin dabalamne.', noch:'Boqonnaan kun amma hin dabalamne.', offline:'Barruu fiduun hin danda’amne. Interneetii ilaali.', nosaved:'Caqasni hin kuufamne.', chap:'Boqonnaa', rm:'Haqi' },
 en: { close:'Close', prev:'‹ Previous', next:'Next ›', pick:'Books & chapters', ot:'Old Testament', nt:'New Testament', saved:'♡ Saved', save:'♡ Save', ok:'Saved', copy:'Copy', copied:'Copied', none:'The Bible text has not been added yet.', noch:'This chapter has not been added yet.', offline:'Could not load the text. Check your connection.', nosaved:'No saved verses.', chap:'Chapter', rm:'Remove' },
 am: { close:'ዝጋ', prev:'‹ ቀዳሚ', next:'ቀጣይ ›', pick:'መጻሕፍት እና ምዕራፎች', ot:'ብሉይ ኪዳን', nt:'አዲስ ኪዳን', saved:'♡ የተቀመጡ', save:'♡ አስቀምጥ', ok:'ተቀምጧል', copy:'ቅዳ', copied:'ተቀድቷል', none:'መጽሐፍ ቅዱስ እስካሁን አልተጨመረም።', noch:'ይህ ምዕራፍ እስካሁን አልተጨመረም።', offline:'ጽሑፉን ማምጣት አልተቻለም። ግንኙነትዎን ያረጋግጡ።', nosaved:'የተቀመጠ ጥቅስ የለም።', chap:'ምዕራፍ', rm:'አስወግድ' }
};
const lang = () => (typeof state !== 'undefined' && state.preferences && state.preferences.language) || 'om';
const tr = k => (T[lang()] || T.om)[k];
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const db = () => firebase.firestore();
const bname = i => { const b = books[i]; return lang() === 'om' ? b[0] : b[1]; };
let S = { book: 0, ch: 1, vid: '', font: 21, theme: '' }, versions = [], unsub = null, root = null, mem = {}, sel = new Set(), tab = 'ot', picking = null, open_ = false;
try { Object.assign(S, JSON.parse(localStorage.getItem('wcg_reader') || '{}')); } catch (e) {}
const save = () => { try { localStorage.setItem('wcg_reader', JSON.stringify(S)); } catch (e) {} };
const ver = () => versions.find(v => v.id === S.vid) || versions.find(v => v.lang === lang()) || versions[0];

const CSS = `#wcr{position:fixed;inset:0;z-index:10050;display:flex;flex-direction:column;background:var(--rb);color:var(--rt);font-family:Georgia,'Noto Serif Ethiopic','Noto Serif',serif;--rb:#fbfaf7;--rt:#1c1c1c;--rm:#7a7468;--rl:#e4dfd3;--ra:#003B82;--rg:#b8860b}
#wcr.sepia{--rb:#f3e8d0;--rt:#3b2f1e;--rm:#7d6a4f;--rl:#dccba8;--ra:#6b3f12;--rg:#8a5a00}
#wcr.dark{--rb:#0d1520;--rt:#e6edf6;--rm:#8fa2bb;--rl:#1c2b40;--ra:#FCD116;--rg:#FCD116}
#wcr *{box-sizing:border-box}#wcr button,#wcr select{font:inherit;color:inherit}
#wcr .bar{display:flex;align-items:center;gap:6px;padding:8px 10px;padding-top:calc(8px + env(safe-area-inset-top,0));border-bottom:1px solid var(--rl);background:var(--rb);font-family:system-ui,sans-serif}
#wcr .bar b{flex:1;text-align:center;font-size:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#wcr .ib{border:1px solid var(--rl);background:transparent;border-radius:10px;min-width:40px;height:40px;cursor:pointer}
#wcr .page{flex:1;overflow:auto;padding:22px 20px 40px;-webkit-overflow-scrolling:touch}
#wcr article{max-width:680px;margin:0 auto;font-size:var(--fs,21px);line-height:1.85}
#wcr h2{font-size:1.15em;text-align:center;margin:4px 0 18px;color:var(--ra)}
#wcr .v{cursor:pointer;border-radius:4px;padding:1px 0}#wcr .v.sel{background:#fcd11660;box-decoration-break:clone}
#wcr sup{font:700 .6em system-ui,sans-serif;color:var(--rg);margin-right:3px}
#wcr .msg{text-align:center;color:var(--rm);padding:40px 10px;font-family:system-ui,sans-serif}
#wcr .nav{display:flex;gap:8px;padding:8px 10px;padding-bottom:calc(8px + env(safe-area-inset-bottom,0));border-top:1px solid var(--rl);background:var(--rb);font-family:system-ui,sans-serif}
#wcr .nav button{flex:1;padding:12px;border:1px solid var(--rl);border-radius:12px;background:transparent;cursor:pointer}
#wcr .nav .mid{flex:1.4;background:var(--ra);color:#fff;border-color:var(--ra)}#wcr.dark .nav .mid{color:#001A3A}
#wcr .act{display:flex;gap:8px;justify-content:center;padding:8px;background:var(--ra);color:#fff;font-family:system-ui,sans-serif}#wcr.dark .act{color:#001A3A}
#wcr .act button{border:0;background:#ffffff30;border-radius:10px;padding:8px 14px;cursor:pointer}
#wcr .sheet{position:absolute;inset:0;background:var(--rb);display:flex;flex-direction:column;font-family:system-ui,sans-serif}
#wcr .tabs{display:flex;gap:6px;padding:8px 10px}#wcr .tabs button{flex:1;padding:9px;border:1px solid var(--rl);border-radius:10px;background:transparent;cursor:pointer}#wcr .tabs .on{background:var(--ra);color:#fff}#wcr.dark .tabs .on{color:#001A3A}
#wcr .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px;padding:6px 10px 24px;overflow:auto}
#wcr .grid button{padding:12px 6px;border:1px solid var(--rl);border-radius:10px;background:transparent;cursor:pointer;text-align:center}#wcr .grid .on{border-color:var(--ra);box-shadow:inset 0 0 0 1px var(--ra)}
#wcr .grid.ch{grid-template-columns:repeat(auto-fill,minmax(56px,1fr))}
#wcr .sv{padding:12px 14px;border-bottom:1px solid var(--rl)}#wcr .sv small{color:var(--rm)}`;

function ensure() {
  if (root) return;
  const st = document.createElement('style'); st.textContent = CSS; document.head.append(st);
  root = document.createElement('div'); root.id = 'wcr'; root.hidden = true; document.body.append(root);
  root.addEventListener('click', onClick);
  let x0 = 0, y0 = 0;
  root.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  root.addEventListener('touchend', e => { if (picking) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 90 && Math.abs(dy) < 50) step(dx < 0 ? 1 : -1); }, { passive: true });
  window.addEventListener('popstate', () => { if (open_) hide(); });
  document.addEventListener('keydown', e => { if (!open_) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); });
  unsub = db().collection('bibleVersions').orderBy('name').onSnapshot(s => { versions = s.docs.map(d => ({ id: d.id, ...d.data() })); if (open_) draw(); }, () => {});
}
function theme() { return S.theme || ((typeof state !== 'undefined' && state.preferences && state.preferences.dark) ? 'dark' : 'light'); }
function open() {
  ensure(); sel.clear(); picking = null; open_ = true; root.hidden = false; document.body.style.overflow = 'hidden';
  try { history.pushState({ wcReader: 1 }, ''); } catch (e) {}
  draw();
}
function hide() { open_ = false; if (root) root.hidden = true; document.body.style.overflow = ''; }
function close() { if (history.state && history.state.wcReader) history.back(); else hide(); if (typeof currentView !== 'undefined' && currentView === 'bible') { try { go('home'); } catch (e) {} } }

async function fetchCh(vid, b, c) {
  const key = vid + '_' + b + '_' + c; if (key in mem) return mem[key];
  const lk = 'wcg_bc_' + key;
  try {
    const s = await db().doc(`bibleVersions/${vid}/chapters/${b}_${c}`).get();
    const v = s.exists ? (s.data().verses || []) : null; mem[key] = v;
    if (v) { try { localStorage.setItem(lk, JSON.stringify(v)); const idx = JSON.parse(localStorage.getItem('wcg_bc_idx') || '[]').filter(k => k !== lk); idx.push(lk); while (idx.length > 40) localStorage.removeItem(idx.shift()); localStorage.setItem('wcg_bc_idx', JSON.stringify(idx)); } catch (e) {} }
    return v;
  } catch (e) {
    try { const raw = localStorage.getItem(lk); if (raw) return JSON.parse(raw); } catch (x) {}
    throw e;
  }
}
async function draw() {
  if (!open_) return;
  root.className = theme(); root.style.setProperty('--fs', S.font + 'px');
  const v = ver(), b = books[S.book];
  const vsel = versions.length > 1 ? `<select data-a="ver" aria-label="Version" class="ib" style="max-width:96px;padding:0 4px">${versions.map(x => `<option value="${E(x.id)}" ${v && x.id === v.id ? 'selected' : ''}>${E(x.name)}</option>`).join('')}</select>` : '';
  root.innerHTML = `<div class="bar"><button class="ib" data-a="close" aria-label="${E(tr('close'))}">✕</button><b data-a="pick">${E(bname(S.book))} ${S.ch} ▾</b>${vsel}<button class="ib" data-a="fs-" aria-label="A−">A−</button><button class="ib" data-a="fs+" aria-label="A+">A+</button><button class="ib" data-a="theme" aria-label="Theme">◐</button></div>
   <div class="page" id="wcr-page"><article><h2>${E(bname(S.book))} · ${E(tr('chap'))} ${S.ch}</h2><div id="wcr-body"><div class="msg">…</div></div></article></div>
   <div id="wcr-act"></div><div class="nav"><button data-a="prev">${E(tr('prev'))}</button><button class="mid" data-a="pick">${E(tr('pick'))}</button><button data-a="next">${E(tr('next'))}</button></div>`;
  const body = root.querySelector('#wcr-body');
  if (!v) { body.innerHTML = `<div class="msg">${E(tr('none'))}</div>`; return; }
  const my = S.book + '_' + S.ch;
  try {
    const verses = await fetchCh(v.id, S.book, S.ch); if (my !== S.book + '_' + S.ch || !open_) return;
    body.innerHTML = verses ? verses.map(x => `<span class="v" data-v="${x.n}"><sup>${x.n}</sup>${E(x.t)} </span>`).join('') : `<div class="msg">${E(tr('noch'))}</div>`;
    if (verses && S.ch < b[2]) fetchCh(v.id, S.book, S.ch + 1).catch(() => {});
  } catch (e) { body.innerHTML = `<div class="msg">${E(tr('offline'))}</div>`; }
  save();
}
function step(d) {
  let b = S.book, c = S.ch + d;
  if (c < 1) { if (b === 0) return; b--; c = books[b][2]; } else if (c > books[b][2]) { if (b === books.length - 1) return; b++; c = 1; }
  S.book = b; S.ch = c; sel.clear(); draw(); const p = root.querySelector('#wcr-page'); if (p) p.scrollTop = 0;
}
function actBar() {
  const a = root.querySelector('#wcr-act'); if (!a) return;
  a.innerHTML = sel.size ? `<div class="act"><button data-a="save">${E(tr('save'))} (${sel.size})</button><button data-a="copy">${E(tr('copy'))}</button></div>` : '';
}
function picker() {
  picking = true;
  const el = document.createElement('div'); el.className = 'sheet'; el.id = 'wcr-sheet';
  const list = () => {
    if (tab === 'saved') return (state.savedVerses.length ? state.savedVerses.map(v => `<div class="sv"><b>${E(v.ref)}</b><p>${E(v.text || '')}</p><small>${E(v.date || '')}</small> <button class="ib" data-a="rmv" data-id="${E(v.id)}" style="height:30px;min-width:0;padding:0 8px;float:right">${E(tr('rm'))}</button></div>`).join('') : `<div class="msg">${E(tr('nosaved'))}</div>`);
    return `<div class="grid">${books.map((b, i) => ({ b, i })).filter(x => x.b[3].toLowerCase() === tab).map(({ b, i }) => `<button data-a="book" data-i="${i}" class="${i === S.book ? 'on' : ''}"><b>${E(lang() === 'om' ? b[0] : b[1])}</b><br><small>${b[2]}</small></button>`).join('')}</div>`;
  };
  el.innerHTML = `<div class="bar"><button class="ib" data-a="unpick">✕</button><b>${E(tr('pick'))}</b></div><div class="tabs"><button data-a="tab" data-t="ot" class="${tab === 'ot' ? 'on' : ''}">${E(tr('ot'))}</button><button data-a="tab" data-t="nt" class="${tab === 'nt' ? 'on' : ''}">${E(tr('nt'))}</button><button data-a="tab" data-t="saved" class="${tab === 'saved' ? 'on' : ''}">${E(tr('saved'))}</button></div><div style="overflow:auto;flex:1">${list()}</div>`;
  const old = root.querySelector('#wcr-sheet'); if (old) old.remove(); root.append(el);
}
function chapters(i) {
  const el = root.querySelector('#wcr-sheet'); S.book = i;
  el.innerHTML = `<div class="bar"><button class="ib" data-a="pick">‹</button><b>${E(bname(i))}</b></div><div style="overflow:auto;flex:1"><div class="grid ch">${Array.from({ length: books[i][2] }, (_, n) => n + 1).map(n => `<button data-a="ch" data-n="${n}">${n}</button>`).join('')}</div></div>`;
}
function onClick(e) {
  const v = e.target.closest('.v'); if (v && !picking) { const n = Number(v.dataset.v); sel.has(n) ? sel.delete(n) : sel.add(n); v.classList.toggle('sel'); actBar(); return; }
  const t = e.target.closest('[data-a]'); if (!t) return; const a = t.dataset.a;
  if (a === 'close') close();
  else if (a === 'prev') step(-1); else if (a === 'next') step(1);
  else if (a === 'fs+') { S.font = Math.min(34, S.font + 2); draw(); } else if (a === 'fs-') { S.font = Math.max(15, S.font - 2); draw(); }
  else if (a === 'theme') { const o = ['light', 'sepia', 'dark']; S.theme = o[(o.indexOf(theme()) + 1) % 3]; save(); draw(); }
  else if (a === 'ver') { /* handled by change */ }
  else if (a === 'pick') { tab = tab === 'saved' ? 'saved' : (books[S.book][3] === 'NT' ? 'nt' : 'ot'); picker(); }
  else if (a === 'unpick') { picking = null; root.querySelector('#wcr-sheet')?.remove(); }
  else if (a === 'tab') { tab = t.dataset.t; picker(); }
  else if (a === 'book') chapters(Number(t.dataset.i));
  else if (a === 'ch') { S.ch = Number(t.dataset.n); picking = null; sel.clear(); root.querySelector('#wcr-sheet')?.remove(); draw(); }
  else if (a === 'rmv') { state.savedVerses = state.savedVerses.filter(x => String(x.id) !== t.dataset.id); persist(); picker(); }
  else if (a === 'save' || a === 'copy') {
    const v = ver(), nums = [...sel].sort((x, y) => x - y), txt = n => (root.querySelector(`.v[data-v="${n}"]`)?.textContent || '').replace(/^\d+/, '').trim();
    if (a === 'save') { nums.forEach((n, k) => { const ref = `${bname(S.book)} ${S.ch}:${n}`; if (!state.savedVerses.some(x => x.ref === ref)) state.savedVerses.push({ id: Date.now() + k, ref, text: txt(n), date: new Date().toLocaleDateString() }); }); persist(); if (window.notify) notify(tr('ok')); }
    else { const out = `${bname(S.book)} ${S.ch}:${nums.join(',')}\n` + nums.map(txt).join(' ') + (v ? `\n(${v.name})` : ''); (navigator.clipboard ? navigator.clipboard.writeText(out) : Promise.reject()).then(() => window.notify && notify(tr('copied'))).catch(() => {}); }
    sel.clear(); root.querySelectorAll('.v.sel').forEach(x => x.classList.remove('sel')); actBar();
  }
}
document.addEventListener('change', e => { if (e.target.matches('#wcr select[data-a="ver"]')) { S.vid = e.target.value; mem = {}; save(); draw(); } });
window.WCReader = { open, close };
})();
