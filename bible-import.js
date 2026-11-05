/* Waldaa Connect — Bible text from PDF (Developer only). Data: bibleVersions/{vid}/chapters/{book}_{chapter}. Free plan, all in the browser. */
(() => {
'use strict';
const E = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const CACHE = {}, PENDING = {}; let versions = [], verId = '', unsub = null;
try { verId = localStorage.getItem('wcg_bibleVer') || ''; } catch (e) {}
const db = () => firebase.firestore();
const lang = () => (typeof state !== 'undefined' && state.preferences && state.preferences.language) || 'om';
const isDev = () => typeof session !== 'undefined' && session && session.role === 'developer';
const cur = () => versions.find(v => v.id === verId) || versions.find(v => v.lang === lang()) || versions[0];

// ---------- pure helpers (also used by tests) ----------
function splitVerses(txt) {
  txt = String(txt || '').replace(/\r/g, '').replace(/[ \t\u00a0]+/g, ' ').trim();
  const marks = []; let from = 0, k = 1;
  for (;;) {
    const re = new RegExp('(^|\\s)' + k + '(?=\\s*[^\\s\\d])', 'g'); re.lastIndex = from;
    const m = re.exec(txt); if (!m) break;
    marks.push({ n: k, start: m.index + m[1].length, end: m.index + m[0].length }); from = m.index + m[0].length; k++;
  }
  if (!marks.length) return txt ? [{ n: 1, t: txt.replace(/\s+/g, ' ') }] : [];
  return marks.map((m, i) => ({ n: m.n, t: txt.slice(m.end, marks[i + 1] ? marks[i + 1].start : txt.length).replace(/\s+/g, ' ').trim() })).filter(v => v.t);
}
function splitChapters(raw, total, words) {
  const lines = String(raw || '').replace(/\r/g, '').split('\n').map(l => l.trim());
  const W = (words || 'Boqonnaa|Chapter|ምዕራፍ').split('|').map(s => s.trim()).filter(Boolean).map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const wordRe = new RegExp('^(?:' + W + ')\\s*(\\d{1,3})\\s*[:.]?$', 'i'), numRe = /^(\d{1,3})\s*[:.]?$/;
  // use word headers only if at least two of them exist in sequence; otherwise lone numbers
  let seq = 0, want = 1; lines.forEach(l => { const m = W && wordRe.exec(l); if (m && Number(m[1]) === want) { seq++; want++; } });
  const re = seq >= 2 ? wordRe : numRe, out = []; let c = 1, curr = null;
  lines.forEach(l => {
    const m = re.exec(l);
    if (m && Number(m[1]) === c && (!total || c <= total)) { curr = { n: c, lines: [] }; out.push(curr); c++; return; }
    if (curr && l) curr.lines.push(l);
  });
  return out.map(x => ({ n: x.n, verses: splitVerses(x.lines.join('\n')) }));
}

// ---------- reader ----------
function html(book, ch) {
  const v = cur();
  if (!v) return `<p class="muted">Macaafni Qulqulluu amma hin dabalamne.${isDev() ? ' Developer: Fuula Developer keessaa “PDF dabali” fayyadami.' : ''}</p>`;
  const key = v.id + '_' + book + '_' + ch, c = CACHE[key];
  const sel = versions.length > 1 ? `<select id="wcb-ver" aria-label="Version" style="margin-bottom:8px">${versions.map(x => `<option value="${E(x.id)}" ${x.id === v.id ? 'selected' : ''}>${E(x.name)} · ${E(x.lang)}</option>`).join('')}</select>` : '';
  let body;
  if (c === undefined) { load(v.id, book, ch, key); body = '<p class="muted">…</p>'; }
  else if (c === null) body = '<p class="muted">Boqonnaan kun hin dabalamne.</p>';
  else body = c.verses.map(x => `<p><span class="verse-num">${x.n}</span>${E(x.t)}</p>`).join('');
  return sel + `<div class="small muted" style="margin-bottom:8px">${E(v.name)}</div>` + body;
}
async function load(vid, book, ch, key) {
  if (PENDING[key]) return; PENDING[key] = 1;
  try { const s = await db().doc(`bibleVersions/${vid}/chapters/${book}_${ch}`).get(); CACHE[key] = s.exists ? s.data() : null; } catch (e) { CACHE[key] = null; console.warn('bible', e.code); }
  delete PENDING[key]; try { render(); } catch (e) {}
}
document.addEventListener('change', e => { if (e.target && e.target.id === 'wcb-ver') { verId = e.target.value; try { localStorage.setItem('wcg_bibleVer', verId); } catch (x) {} try { render(); } catch (x) {} } });
function watch() {
  if (!window.firebase || !firebase.apps.length) return setTimeout(watch, 400);
  firebase.auth().onAuthStateChanged(u => {
    if (unsub) { unsub(); unsub = null; } versions = [];
    if (u) unsub = db().collection('bibleVersions').orderBy('name').onSnapshot(s => { versions = s.docs.map(d => ({ id: d.id, ...d.data() })); try { render(); } catch (e) {} }, e => console.warn('versions', e.code));
  });
}

// ---------- developer importer ----------
const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
const loadPdf = () => window.pdfjsLib ? Promise.resolve() : new Promise((ok, no) => { const s = document.createElement('script'); s.src = PDFJS; s.onload = () => { pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER; ok(); }; s.onerror = () => no(new Error('pdf.js could not load (internet?)')); document.head.append(s); });
async function pdfText(file, from, to, onp) {
  await loadPdf(); const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const a = Math.max(1, from || 1), b = Math.min(pdf.numPages, to || pdf.numPages); let out = '';
  for (let p = a; p <= b; p++) { const c = await (await pdf.getPage(p)).getTextContent(); out += c.items.map(i => i.str + (i.hasEOL ? '\n' : ' ')).join('') + '\n'; onp(p - a + 1, b - a + 1); }
  return out;
}
function open() {
  if (!isDev()) { notify('Developer qofti fayyadamuu danda’a.'); return; }
  if (typeof books === 'undefined') { notify('Kitaabotni hin jiran.'); return; }
  if (!document.getElementById('wcx-css')) { const c = document.createElement('style'); c.id = 'wcx-css'; c.textContent = '.wcx-ov{position:fixed;inset:0;z-index:10000;background:#000a;overflow:auto;padding:14px}.wcx-box{background:var(--surface,#fff);color:var(--ink,#17243a);max-width:720px;margin:0 auto;border-radius:18px;padding:18px}.wcx-box input[type=text],.wcx-box input[type=number],.wcx-box textarea,.wcx-box select{width:100%;padding:9px;border:1px solid #ccd;border-radius:10px;font:inherit;margin:3px 0 8px;background:#fff;color:#17243a}.wcx-row{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}.wcx-box h3{margin:16px 0 6px}'; document.head.append(c); }
  const box = document.createElement('div'); box.className = 'wcx-ov';
  box.innerHTML = `<div class="wcx-box"><h2 style="margin:0">📖 Macaafa Qulqulluu — PDF</h2>
  <p style="font-size:12px;opacity:.75">Kitaaba tokko tokkoon PDF olkaa’i (kan caasaa bareedaa qabu). Hayyama barruu kanaa qabaachuu qabda. PDF suuraa (scan) ykn font durii Amharic yoo ta’e barruun sirrii hin baha; achiin paste godhi.</p>
  <h3>1. Version</h3><select name="ver"><option value="">＋ Version haaraa</option>${versions.map(v => `<option value="${E(v.id)}">${E(v.name)} · ${E(v.lang)}</option>`).join('')}</select>
  <div id="wcb-new"><input type="text" name="vname" placeholder="Maqaa version (fkn. Macaafa Qulqulluu 1997)" maxlength="80"><select name="vlang"><option value="om">Afaan Oromoo</option><option value="am">አማርኛ</option><option value="en">English</option></select>
  <label style="font-size:13px"><input type="checkbox" name="rights"> Barruu kana maxxansuuf hayyama qaba (license/permission)</label></div>
  <h3>2. Kitaaba</h3><select name="book">${books.map((b, i) => `<option value="${i}">${E(b[0])} · ${E(b[1])} (${b[2]} boq.)</option>`).join('')}</select>
  <h3>3. PDF</h3><input type="file" name="pdf" accept="application/pdf"><div style="display:flex;gap:8px"><input type="number" name="p1" min="1" placeholder="Fuula jalqabaa"><input type="number" name="p2" min="1" placeholder="Fuula xumuraa"></div>
  <button class="btn btn-soft" id="wcb-ex">Barruu baasi</button> <span id="wcb-pg" style="font-size:12px"></span>
  <h3>4. Barruu (sirreessuu ni dandeessa)</h3><textarea name="raw" rows="7" placeholder="Barruun asitti mul’ata. Ykn asitti paste godhi."></textarea>
  <div style="display:flex;gap:8px"><input type="text" name="words" value="Boqonnaa|Chapter|ምዕራፍ" title="Jecha mataduree boqonnaa"><input type="number" name="one" min="1" placeholder="Boqonnaa tokko qofa? lakkoofsa"></div>
  <button class="btn btn-soft" id="wcb-split">Boqonnaa boqonnaan hiri</button>
  <div id="wcb-prev"></div>
  <div class="wcx-row"><button class="btn btn-primary" id="wcb-save" disabled>Kuusi (Firestore)</button><button class="btn btn-ghost" id="wcb-close">Cufi</button></div></div>`;
  document.body.append(box);
  const q = s => box.querySelector(s), g = n => q('[name=' + n + ']').value;
  let chapters = [];
  const showNew = () => { q('#wcb-new').style.display = g('ver') ? 'none' : ''; }; q('[name=ver]').onchange = showNew; showNew();
  q('#wcb-close').onclick = () => box.remove();
  q('#wcb-ex').onclick = async () => {
    const f = q('[name=pdf]').files[0]; if (!f) { notify('PDF filadhu.'); return; }
    try { const t = await pdfText(f, Number(g('p1')) || 1, Number(g('p2')) || 0, (a, b) => { q('#wcb-pg').textContent = a + '/' + b; });
      q('[name=raw]').value = t; if (t.replace(/\s/g, '').length < 40) notify('Barruun xiqqaadha: PDF suuraa ta’uu danda’a. Barruu paste godhi.'); else notify('Barruun baheera. Sirreessii “hiri” cuqaasi.'); } catch (e) { notify(e.message); }
  };
  q('#wcb-split').onclick = () => {
    const book = books[Number(g('book'))], one = Number(g('one'));
    chapters = one ? [{ n: one, verses: splitVerses(g('raw')) }] : splitChapters(g('raw'), book[2], g('words'));
    const warn = !one && chapters.length !== book[2] ? `<p style="color:#b83b4b">Boqonnaan argame ${chapters.length}; kitaabni ${book[2]} qaba. Sirreessi ykn “Jecha mataduree” jijjiiri.</p>` : '';
    q('#wcb-prev').innerHTML = warn + chapters.map(c => `<details><summary>Boqonnaa ${c.n} · ${c.verses.length} caqasa</summary><textarea data-ch="${c.n}" rows="6">${E(c.verses.map(v => v.n + ' ' + v.t).join('\n'))}</textarea></details>`).join('');
    q('#wcb-save').disabled = !chapters.length;
  };
  q('#wcb-save').onclick = async () => {
    try {
      let vid = g('ver');
      if (!vid) {
        const name = g('vname').trim(), l = g('vlang'); if (name.length < 2) { notify('Maqaa version barreessi.'); return; }
        if (!q('[name=rights]').checked) { notify('Hayyama barruu mirkaneessi.'); return; }
        vid = ('v-' + l + '-' + Date.now().toString(36)); await db().doc('bibleVersions/' + vid).set({ name, lang: l, rights: true, createdBy: session.id, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      }
      const bookIdx = Number(g('book')), items = [...box.querySelectorAll('textarea[data-ch]')].map(t => ({ n: Number(t.dataset.ch), verses: splitVerses(t.value) })).filter(c => c.verses.length);
      for (let i = 0; i < items.length; i += 400) {
        const b = db().batch();
        items.slice(i, i + 400).forEach(c => b.set(db().doc(`bibleVersions/${vid}/chapters/${bookIdx}_${c.n}`), { book: bookIdx, chapter: c.n, verses: c.verses, by: session.id, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }));
        await b.commit();
      }
      Object.keys(CACHE).forEach(k => delete CACHE[k]); verId = vid; try { localStorage.setItem('wcg_bibleVer', vid); } catch (e) {}
      notify(`${items.length} boqonnaa kuufame.`); q('#wcb-prev').innerHTML = ''; q('#wcb-save').disabled = true; try { render(); } catch (e) {}
    } catch (e) { notify(e.message); }
  };
}
window.WCBible = { html, open, _split: { splitVerses, splitChapters } };
watch();
})();
