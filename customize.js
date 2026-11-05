/* Waldaa Connect — Developer customization (free plan). Config doc appConfig/main: public read, Developer-only write (see firestore.rules). */
(() => {
'use strict';
const DEF = { brand: 'WALDAA CONNECT', sub: 'GLOBAL CHURCH NETWORK', greeting: '', verseText: '', verseRef: '', primary: '#003B82', gold: '#FCD116', scale: 100, density: 'normal', radius: 20, hidden: {}, labels: {} };
let cfg = { ...DEF }; try { Object.assign(cfg, JSON.parse(localStorage.getItem('wcg_cfg') || '{}')); } catch (e) {}
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const VIEWS = ['bible', 'growth', 'prayer', 'choir', 'community', 'churches', 'management', 'finance', 'notifications'];
const ROLES = ['pastor', 'secretary', 'finance', 'choir', 'prayer', 'auditor', 'member'];
const LKEYS = ['home', 'bible', 'growth', 'prayer', 'choir', 'community', 'churches', 'management', 'finance', 'notifications', 'profile', 'settings'];
const old = window.WCCfg || {}, defVerse = old.verse || (() => ({ text: '', ref: '' }));
const lang = () => (typeof state !== 'undefined' && state.preferences && state.preferences.language) || 'om';
window.WCCfg = { ...old,
  brand: () => cfg.brand || DEF.brand, sub: () => cfg.sub || DEF.sub, greeting: () => cfg.greeting || '',
  verse: () => cfg.verseText ? { text: cfg.verseText, ref: cfg.verseRef || '' } : defVerse(),
  hidden: (v, r) => !!(cfg.hidden && cfg.hidden[r] && cfg.hidden[r].includes(v)),
  label: (l, k) => (cfg.labels && cfg.labels[l] && cfg.labels[l][k]) || '',
  after: () => look(), open };

function look() {
  const r = document.documentElement.style;
  r.setProperty('--blue', cfg.primary || DEF.primary); r.setProperty('--gold', cfg.gold || DEF.gold); r.setProperty('--radius', (cfg.radius || 20) + 'px');
  const root = document.getElementById('root'); if (root) root.style.zoom = (cfg.scale || 100) / 100;
  let s = document.getElementById('wcx-style'); if (!s) { s = document.createElement('style'); s.id = 'wcx-style'; document.head.append(s); }
  s.textContent = cfg.density === 'compact' ? '.grid{gap:10px!important}.card-pad{padding:13px!important}' : cfg.density === 'comfortable' ? '.grid{gap:24px!important}.card-pad{padding:28px!important}' : '';
  document.title = cfg.brand || DEF.brand;
}
function start() {
  if (!window.firebase || !firebase.apps.length) return setTimeout(start, 400);
  look();
  firebase.firestore().doc('appConfig/main').onSnapshot(s => {
    cfg = { ...DEF, ...(s.exists ? s.data() : {}) }; try { localStorage.setItem('wcg_cfg', JSON.stringify(cfg)); } catch (e) {}
    look(); try { render(); } catch (e) {}
  }, e => console.warn('appConfig', e.code));
}

function open() {
  if (typeof session === 'undefined' || !session || session.role !== 'developer') { notify('Developer qofti fayyadamuu danda’a.'); return; }
  if (!document.getElementById('wcx-css')) { const c = document.createElement('style'); c.id = 'wcx-css';
    c.textContent = '.wcx-ov{position:fixed;inset:0;z-index:10000;background:#000a;overflow:auto;padding:14px}.wcx-box{background:var(--surface,#fff);color:var(--ink,#17243a);max-width:720px;margin:0 auto;border-radius:18px;padding:18px}.wcx-box h3{margin:18px 0 8px}.wcx-box input[type=text],.wcx-box textarea,.wcx-box select{width:100%;padding:9px;border:1px solid #ccd;border-radius:10px;font:inherit;margin:3px 0 8px;background:#fff;color:#17243a}.wcx-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.wcx-tbl{width:100%;border-collapse:collapse;font-size:12px}.wcx-tbl td,.wcx-tbl th{border-bottom:1px solid #dde;padding:5px;text-align:center}.wcx-tbl td:first-child{text-align:left}.wcx-lbl{display:grid;grid-template-columns:110px 1fr;gap:8px;align-items:center}';
    document.head.append(c); }
  const labels = JSON.parse(JSON.stringify(cfg.labels || {})); let ll = lang();
  const box = document.createElement('div'); box.className = 'wcx-ov';
  const rl = (typeof roleLabels !== 'undefined' && roleLabels[lang()]) || {};
  const tl = (typeof translations !== 'undefined' && translations[ll]) || {};
  box.innerHTML = `<div class="wcx-box"><h2 style="margin:0">🎨 Customize app</h2>
   <h3>Maqaa fi barreeffama</h3>
   <label>App name<input type="text" name="brand" maxlength="40" value="${E(cfg.brand)}"></label>
   <label>Subtitle<input type="text" name="sub" maxlength="60" value="${E(cfg.sub)}"></label>
   <label>Simannaa fuula jalqabaa<textarea name="greeting" rows="2" maxlength="240">${E(cfg.greeting)}</textarea></label>
   <label>Caqasa fuula jalqabaa<textarea name="verseText" rows="2" maxlength="300">${E(cfg.verseText)}</textarea></label>
   <label>Wabii caqasaa<input type="text" name="verseRef" maxlength="60" value="${E(cfg.verseRef)}"></label>
   <h3>Bifa fi guddina</h3>
   <label>Kaalaara ijoo <input type="color" name="primary" value="${E(cfg.primary)}"></label> &nbsp; <label>Kaalaara warqee <input type="color" name="gold" value="${E(cfg.gold)}"></label>
   <label>Guddina fuulaa: <b id="wcx-sv">${cfg.scale}</b>% <input type="range" name="scale" min="85" max="125" step="5" value="${cfg.scale}" style="width:100%"></label>
   <label>Cufaatii (radius): <b id="wcx-rv">${cfg.radius}</b>px <input type="range" name="radius" min="6" max="30" value="${cfg.radius}" style="width:100%"></label>
   <label>Dhiphina kutaalee<select name="density"><option value="compact" ${cfg.density === 'compact' ? 'selected' : ''}>Xiqqaa (compact)</option><option value="normal" ${cfg.density === 'normal' ? 'selected' : ''}>Idilee</option><option value="comfortable" ${cfg.density === 'comfortable' ? 'selected' : ''}>Bal'aa</option></select></label>
   <h3>Fuulawwan mul'atan (role hundaaf)</h3>
   <div style="overflow:auto"><table class="wcx-tbl"><tr><th></th>${ROLES.map(r => `<th>${E(rl[r] || r)}</th>`).join('')}</tr>
   ${VIEWS.map(v => `<tr><td>${E(tl[v] || v)}</td>${ROLES.map(r => `<td><input type="checkbox" data-v="${v}" data-r="${r}" ${(cfg.hidden && cfg.hidden[r] || []).includes(v) ? '' : 'checked'}></td>`).join('')}</tr>`).join('')}</table></div>
   <p style="font-size:12px;opacity:.7">Fuula Jalqabaa, Piroofaayilii fi Settings yeroo hundaa ni mul'atu. Developer hunda arga.</p>
   <h3>Maqaa fuulawwanii</h3>
   <label>Afaan <select name="ll"><option value="om">Afaan Oromoo</option><option value="am">አማርኛ</option><option value="en">English</option></select></label>
   <div id="wcx-labels"></div>
   <div class="wcx-row"><button class="btn btn-primary" id="wcx-save">Kuusi</button><button class="btn btn-ghost" id="wcx-reset">Gara jalqabaatti deebisi</button><button class="btn btn-ghost" id="wcx-close">Cufi</button></div></div>`;
  document.body.append(box);
  const q = s => box.querySelector(s);
  const grab = () => { box.querySelectorAll('[data-lk]').forEach(i => { (labels[ll] = labels[ll] || {})[i.dataset.lk] = i.value.trim(); }); };
  const draw = () => { const t2 = (typeof translations !== 'undefined' && translations[ll]) || {};
    q('#wcx-labels').innerHTML = LKEYS.map(k => `<div class="wcx-lbl"><span>${k}</span><input type="text" data-lk="${k}" maxlength="40" placeholder="${E(t2[k] || k)}" value="${E((labels[ll] || {})[k] || '')}"></div>`).join(''); };
  q('[name=ll]').value = ll; draw();
  q('[name=ll]').onchange = e => { grab(); ll = e.target.value; draw(); };
  q('[name=scale]').oninput = e => { q('#wcx-sv').textContent = e.target.value; };
  q('[name=radius]').oninput = e => { q('#wcx-rv').textContent = e.target.value; };
  q('#wcx-close').onclick = () => box.remove();
  q('#wcx-reset').onclick = async () => { if (!confirm('Sirreeffama hunda haquu?')) return; try { await firebase.firestore().doc('appConfig/main').delete(); box.remove(); notify('Gara jalqabaatti deebi’e.'); } catch (e) { notify(e.message); } };
  q('#wcx-save').onclick = async () => {
    grab(); const g = n => q('[name=' + n + ']').value; const hidden = {};
    ROLES.forEach(r => { hidden[r] = VIEWS.filter(v => !q(`[data-v="${v}"][data-r="${r}"]`).checked); });
    const clean = {}; Object.keys(labels).forEach(l => { clean[l] = {}; Object.entries(labels[l]).forEach(([k, v]) => { if (v) clean[l][k] = v; }); });
    const data = { brand: g('brand').trim() || DEF.brand, sub: g('sub').trim() || DEF.sub, greeting: g('greeting').trim(), verseText: g('verseText').trim(), verseRef: g('verseRef').trim(),
      primary: g('primary'), gold: g('gold'), scale: Number(g('scale')), radius: Number(g('radius')), density: g('density'), hidden, labels: clean,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: session.id };
    try { await firebase.firestore().doc('appConfig/main').set(data); box.remove(); notify('Sirreeffamni kuufame; fayyadamtoota hundaaf ni jijjiirama.'); } catch (e) { notify(e.message); }
  };
}
start();
})();
