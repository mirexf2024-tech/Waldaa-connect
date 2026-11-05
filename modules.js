/* Waldaa Connect v10 — Calendar, Giving (+Developer support), Families/Newcomers, Sunday School, Pastoral care, Ads. Firestore + rules, free plan. */
(() => {
'use strict';
const S = {
 calendar:['Kaalaandarii','Calendar','የቀን መቁጠሪያ'], giving:['Kennaa fi Kurnoo','Giving','ስጦታ'], people:['Maatii fi Miseensota','Families','ቤተሰቦች'], school:['Barumsa Dilbataa','Sunday School','ሰንበት ት/ቤት'], care:['Eegumsa Hafuuraa','Pastoral Care','መንፈሳዊ እንክብካቤ'],
 add:['Dabali','Add','ጨምር'], save:['Kuusi','Save','አስቀምጥ'], cancel:['Dhiisi','Cancel','ተው'], del:['Haqi','Delete','ሰርዝ'], edit:['Gulaali','Edit','አርም'], none:['Ammaaf homaa hin jiru.','Nothing yet.','እስካሁን ምንም የለም።'], copy:['Garagalchi','Copy','ቅዳ'], copied:['Garagalfameera','Copied','ተቀድቷል'], failed:['Hin milkoofne','Failed','አልተሳካም'], saved:['Kuufameera','Saved','ተቀምጧል'], sure:['Dhuguma haquu barbaaddaa?','Delete this?','ይህን ይሰረዝ?'],
 newEv:['Taateewwan haaraa','New event','አዲስ ክስተት'], title:['Mata duree','Title','ርዕስ'], date:['Guyyaa','Date','ቀን'], time:['Sa’aatii','Time','ሰዓት'], place:['Bakka','Place','ቦታ'], notes:['Yaada','Notes','ማስታወሻ'], cat:['Gosa','Type','ዓይነት'], upc:['Taateewwan dhufan','Upcoming events','የሚመጡ ክስተቶች'], allDay:['Guyyaa kana','This day','ይህ ቀን'],
 c_service:['Tajaajila','Service','አገልግሎት'], c_youth:['Dargaggoota','Youth','ወጣቶች'], c_choir:['Faarfattoota','Choir','መዘምራን'], c_women:['Dubartoota','Women','እናቶች'], c_men:['Dhiirota','Men','አባቶች'], c_other:['Kan biroo','Other','ሌላ'],
 gIntro:['Kaffaltiin app kana keessatti hin raawwatamu. Lakkoofsa armaan gadii garagalchitii baankii ykn Telebirr kee irraa ergi.','Payments are not processed in this app. Copy a number below and send it from your bank or Telebirr app.','ክፍያ በዚህ መተግበሪያ አይፈጸምም። ከታች ያለውን ቁጥር ቅዳና ከባንክዎ ወይም ከቴሌብር ይላኩ።'], gChurch:['Herrega Waldaa','Church accounts','የቤተ ክርስቲያን ሂሳብ'], gDev:['Deeggarsa Developer','Developer support','የገንቢ ድጋፍ'], bank:['Baankii','Bank','ባንክ'], accNo:['Lakk. herregaa','Account no.','የሂሳብ ቁጥር'], holder:['Maqaa','Holder','ስም'], tele:['Telebirr','Telebirr','ቴሌብር'], accHint:['Sarara tokko = herrega tokko: Baankii | Lakkoofsa | Maqaa','One line = one account: Bank | Number | Holder','አንድ መስመር = አንድ ሂሳብ፡ ባንክ | ቁጥር | ስም'], teleHint:['Sarara tokko: Lakkoofsa | Maqaa','One line: Number | Name','አንድ መስመር፡ ቁጥር | ስም'], devNote:['Deeggarsi kun app kana kan qopheesse Developer’f.','This supports the developer who builds and maintains this app.','ይህ መተግበሪያውን ለሚያዘጋጀው ገንቢ ድጋፍ ነው።'],
 name:['Maqaa','Name','ስም'], phone:['Bilbila','Phone','ስልክ'], family:['Maatii','Family','ቤተሰብ'], status:['Haala','Status','ሁኔታ'], s_member:['Miseensa','Member','አባል'], s_newcomer:['Haaraa (dhufe)','Newcomer','አዲስ መጥቶ'], s_visitor:['Affeerraa','Visitor','እንግዳ'], servant:['Tajaajilaa','Servant / volunteer','አገልጋይ'], ministry:['Tajaajila','Ministry','አገልግሎት'], follow:['Hordoffii','Follow-up','ክትትል'], f_new:['Haaraa','New','አዲስ'], f_contacted:['Waliin dubbatame','Contacted','ተገናኝቷል'], f_visited:['Daawwatame','Visited','ተጎብኝቷል'], f_joined:['Seeneera','Joined','ተቀላቅሏል'], next:['Guyyaa itti aanu','Next date','ቀጣይ ቀን'], all:['Hunda','All','ሁሉም'], fam:['Maatiiwwan','Families','ቤተሰቦች'], serv:['Tajaajiltoota','Servants','አገልጋዮች'], newc:['Haaraa','Newcomers','አዲሶች'], search:['Barbaadi','Search','ፈልግ'], noFam:['Maatii hin qabu','No family','ቤተሰብ የለም'], overdue:['Yeroon darbeera','Overdue','ዘግይቷል'],
 cls:['Kutaalee','Classes','ክፍሎች'], newCls:['Kutaa haaraa','New class','አዲስ ክፍል'], kind:['Gosa','Kind','ዓይነት'], k_sundayschool:['Barumsa Dilbataa','Sunday School','ሰንበት ት/ቤት'], k_biblestudy:['Gareen Qayyabannaa','Bible study group','የመጽሐፍ ቅዱስ ጥናት'], teacher:['Barsiisaa','Teacher','መምህር'], day:['Guyyaa','Day','ቀን'], students:['Barattoota','Students','ተማሪዎች'], addStu:['Barataa dabali','Add student','ተማሪ ጨምር'], attend:['Argama','Attendance','መገኘት'], present:['Argame','Present','የተገኙ'], hist:['Seenaa','History','ታሪክ'], back:['‹ Duubatti','‹ Back','‹ ተመለስ'], rate:['Argama','Rate','መጠን'],
 newReq:['Gaaffii haaraa','New request','አዲስ ጥያቄ'], topic:['Mata duree','Topic','ርዕስ'], t_counseling:['Gorsa','Counseling','ምክር'], t_marriage:['Fuudhaa fi heeruma','Marriage','ጋብቻ'], t_family:['Maatii','Family','ቤተሰብ'], t_prayer:['Kadhannaa','Prayer','ጸሎት'], t_other:['Kan biroo','Other','ሌላ'], details:['Ibsa (dhoksaa dha)','Details (private)','ዝርዝር (ሚስጥራዊ)'], pref:['Guyyaa filatamu','Preferred date','የተመረጠ ቀን'], careNote:['Gaaffiin kee Pastor qofaaf mul’ata.','Only the pastor can see your request.','ጥያቄዎን ፓስተር ብቻ ያያል።'], r_requested:['Eegaa jira','Requested','ተጠይቋል'], r_scheduled:['Beellama qabameera','Scheduled','ቀጠሮ ተይዟል'], r_done:['Xumurameera','Done','ተጠናቋል'], r_declined:['Kuffisameera','Declined','ተቀባይነት አላገኘም'], r_cancelled:['Haqameera','Cancelled','ተሰርዟል'], schedule:['Beellama qabi','Schedule','ቀጠሮ ያዝ'], when:['Yeroo','When','መቼ'], reply:['Deebii','Reply','መልስ'], done:['Xumuri','Mark done','ተጠናቋል'], decline:['Kuffisi','Decline','አትቀበል'], cancelR:['Haqi','Cancel request','ጥያቄ ሰርዝ'],
 ad:['Beeksisa','Sponsored','ማስታወቂያ'], ads:['Beeksisa (galii)','Ads (income)','ማስታወቂያዎች'], adLink:['Linkii (https://…)','Link (https://…)','ሊንክ (https://…)'], adText:['Barruu','Text','ጽሑፍ'], active:['Hojii irra','Active','ንቁ'], open:['Banuu','Open','ክፈት'], supportEdit:['Deeggarsa Developer','Developer support','የገንቢ ድጋፍ'], accounts:['Baankii (sarara tokko tokko)','Bank accounts (one per line)','የባንክ ሂሳቦች'], teles:['Telebirr (sarara tokko tokko)','Telebirr (one per line)','ቴሌብር']
};
const IDX = { om:0, en:1, am:2 };
const lang = () => (typeof state !== 'undefined' && state.preferences && state.preferences.language) || 'om';
const tr = k => { const a = S[k]; return a ? a[IDX[lang()] ?? 0] : k; };
['om','en','am'].forEach((l, i) => { if (typeof translations !== 'undefined' && translations[l]) ['calendar','giving','people','school','care'].forEach(k => { translations[l][k] = S[k][i]; }); });
const e = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const db = () => firebase.firestore(), TS = () => firebase.firestore.FieldValue.serverTimestamp();
const base = () => db().collection('churches').doc(session.churchId);
const role = () => session && session.role, staff = () => ['pastor','secretary'].includes(role());
const canEv = () => ['pastor','secretary','choir'].includes(role());
const loc = () => ({ om:'om', en:'en', am:'am' }[lang()] || 'en');
const ymd = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const fmtD = s => { try { return new Date(s + 'T00:00').toLocaleDateString(loc(), { weekday:'short', day:'numeric', month:'short' }); } catch (x) { return s; } };
const CATS = ['service','youth','choir','women','men','other'], COL = { service:'#003B82', youth:'#16a34a', choir:'#9333ea', women:'#db2777', men:'#0ea5e9', other:'#64748b' };
const M = { ev:[], people:[], classes:[], care:[], ads:[], giving:null, support:null, students:[], sessions:[], cal:new Date(), sel:'', ppl:'all', cls:'', attDate:ymd(new Date()), att:new Set(), careF:'all', unsubs:[], sub:[], t:null };

function css() { if (document.getElementById('wm-css')) return; const s = document.createElement('style'); s.id = 'wm-css';
 s.textContent = `.wm-head{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:16px}.wm-head h2{margin:0}.wm-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.wm-dow{text-align:center;font-size:12px;opacity:.65}.wm-day{min-height:46px;border:1px solid rgba(128,128,128,.25);border-radius:10px;padding:3px;background:transparent;color:inherit;cursor:pointer;text-align:left;font:inherit;font-size:13px}.wm-day.today{border-color:#FCD116;box-shadow:0 0 0 1px #FCD116}.wm-day.sel{background:rgba(252,209,22,.25)}.wm-day.off{opacity:.3;cursor:default}.wm-dot{display:inline-block;width:7px;height:7px;border-radius:50%;margin:1px}.wm-row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid rgba(128,128,128,.2)}.wm-row:last-child{border-bottom:0}.wm-sub{font-size:13px;opacity:.7}.wm-pill{display:inline-block;padding:2px 9px;border-radius:12px;font-size:12px;background:rgba(128,128,128,.18)}.wm-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}.wm-tabs button{border:1px solid rgba(128,128,128,.35);background:transparent;color:inherit;border-radius:18px;padding:6px 13px;cursor:pointer;font:inherit}.wm-tabs button.on{background:#FCD116;color:#001A3A;border-color:#FCD116;font-weight:700}.wm-acc{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 12px;border:1px solid rgba(128,128,128,.3);border-radius:12px;margin-bottom:8px}.wm-num{font-weight:700;font-size:18px;letter-spacing:.03em;word-break:break-all}.wm-ad{border:1px dashed rgba(252,209,22,.9);border-radius:14px;padding:12px 14px;margin-bottom:14px;display:flex;gap:10px;align-items:center;justify-content:space-between;background:rgba(252,209,22,.08)}.wm-act{display:flex;gap:6px;flex-wrap:wrap}.wm-act button,.wm-mini{border:1px solid rgba(128,128,128,.35);background:transparent;color:inherit;border-radius:9px;padding:4px 9px;cursor:pointer;font:inherit;font-size:13px}.wm-late{color:#dc2626;font-weight:700}.wm-chk{display:flex;gap:8px;align-items:center;padding:7px 0}.wm-chk input{width:20px;height:20px}`;
 document.head.append(s); }
const toast = m => (window.notify ? window.notify(m) : alert(m));
const fail = x => toast((window.firebaseError ? firebaseError(x) : x.message) || tr('failed'));
const refresh = () => { clearTimeout(M.t); M.t = setTimeout(() => { try { render(); } catch (x) { console.warn(x); } }, 120); };
const sub = (q, fn, arr = M.unsubs) => arr.push(q.onSnapshot(s => { fn(s); refresh(); }, x => console.warn('wm', x.code)));
const list = s => s.docs.map(d => ({ id: d.id, ...d.data() }));
function stop() { M.unsubs.forEach(f => f()); M.unsubs = []; M.sub.forEach(f => f()); M.sub = []; M.ev = []; M.people = []; M.classes = []; M.care = []; M.ads = []; M.giving = null; M.support = null; M.students = []; M.sessions = []; M.cls = ''; }
function start() {
 stop(); if (!window.firebase || !session || session.mode !== 'firebase') return;
 sub(db().collection('ads').limit(50), s => { M.ads = list(s); });
 sub(db().collection('supportInfo').doc('giving'), s => { M.support = s.exists ? s.data() : null; });
 if (role() === 'developer' || !session.churchId) return;
 const b = base(), from = ymd(new Date(Date.now() - 62 * 864e5));
 sub(b.collection('events').where('date', '>=', from).limit(400), s => { M.ev = list(s).sort((a, c) => (a.date + (a.time || '')).localeCompare(c.date + (c.time || ''))); });
 sub(b.collection('settings').doc('giving'), s => { M.giving = s.exists ? s.data() : null; });
 sub(b.collection('classes').limit(100), s => { M.classes = list(s).sort((a, c) => (a.name || '').localeCompare(c.name || '')); });
 sub(role() === 'pastor' ? b.collection('care').limit(300) : b.collection('care').where('uid', '==', session.id).limit(100), s => { M.care = list(s).sort((a, c) => ((c.createdAt && c.createdAt.toMillis && c.createdAt.toMillis()) || 0) - ((a.createdAt && a.createdAt.toMillis && a.createdAt.toMillis()) || 0)); });
 if (staff()) sub(b.collection('people').limit(1000), s => { M.people = list(s).sort((a, c) => (a.name || '').localeCompare(c.name || '')); });
}
const head = (title, sub2, btn = '') => `<div class="wm-head"><div><div class="eyebrow">✦ ${e(tr('calendar') && '')}</div><h2>${e(title)}</h2>${sub2 ? `<p class="wm-sub">${e(sub2)}</p>` : ''}</div>${btn}</div>`;
const empty = () => `<p class="wm-sub">${e(tr('none'))}</p>`;
const field = (n, label, val = '', type = 'text', extra = '') => `<div class="field"><label>${e(label)}</label><input name="${n}" type="${type}" value="${e(val)}" ${extra}></div>`;
const area = (n, label, val = '', rows = 3) => `<div class="field"><label>${e(label)}</label><textarea name="${n}" rows="${rows}">${e(val)}</textarea></div>`;
const sel = (n, label, opts, val) => `<div class="field"><label>${e(label)}</label><select name="${n}">${opts.map(([v, l]) => `<option value="${e(v)}" ${v === val ? 'selected' : ''}>${e(l)}</option>`).join('')}</select></div>`;
const foot = id => `<div class="wm-act" style="justify-content:flex-end;margin-top:12px"><button type="button" class="wm-mini" data-action="close-modal">${e(tr('cancel'))}</button><button class="btn btn-primary" type="submit">${e(tr('save'))}</button></div>`;
const form = (id, body) => `<form data-wmf="${id}">${body}${foot(id)}</form>`;
const open = (title, body) => showModal(title, body);

/* ---------- CALENDAR ---------- */
function vCalendar() {
 const d = M.cal, y = d.getFullYear(), m = d.getMonth(), first = new Date(y, m, 1).getDay(), n = new Date(y, m + 1, 0).getDate(), today = ymd(new Date());
 const byDay = {}; M.ev.forEach(x => (byDay[x.date] = byDay[x.date] || []).push(x));
 let cells = ''; for (let i = 0; i < first; i++) cells += '<div></div>';
 for (let k = 1; k <= n; k++) { const ds = ymd(new Date(y, m, k)), evs = byDay[ds] || [];
  cells += `<button class="wm-day ${ds === today ? 'today' : ''} ${ds === M.sel ? 'sel' : ''}" data-wm="cal-day" data-d="${ds}"><b>${k}</b><div>${evs.slice(0, 4).map(x => `<span class="wm-dot" style="background:${COL[x.category] || COL.other}"></span>`).join('')}</div></button>`; }
 const dows = [0,1,2,3,4,5,6].map(i => `<div class="wm-dow">${e(new Date(2024, 0, 7 + i).toLocaleDateString(loc(), { weekday:'short' }))}</div>`).join('');
 const shown = M.sel ? (byDay[M.sel] || []) : M.ev.filter(x => x.date >= today).slice(0, 25);
 const card = x => `<div class="wm-row"><div><div><span class="wm-dot" style="background:${COL[x.category] || COL.other}"></span> <b>${e(x.title)}</b> <span class="wm-pill">${e(tr('c_' + x.category))}</span></div><div class="wm-sub">${e(fmtD(x.date))}${x.time ? ' · ' + e(x.time) : ''}${x.place ? ' · ' + e(x.place) : ''}</div>${x.notes ? `<div class="wm-sub">${e(x.notes)}</div>` : ''}</div>${canEv() && (staff() || x.category === 'choir') ? `<div class="wm-act"><button data-wm="ev-edit" data-id="${e(x.id)}">${e(tr('edit'))}</button><button data-wm="ev-del" data-id="${e(x.id)}">🗑</button></div>` : ''}</div>`;
 return head(tr('calendar'), '', canEv() ? `<button class="btn btn-primary" data-wm="ev-new">＋ ${e(tr('newEv'))}</button>` : '') +
 `<div class="card card-pad"><div class="wm-head" style="margin-bottom:8px"><button class="wm-mini" data-wm="cal-prev">‹</button><b>${e(d.toLocaleDateString(loc(), { month:'long', year:'numeric' }))}</b><button class="wm-mini" data-wm="cal-next">›</button></div><div class="wm-grid">${dows}${cells}</div></div>
 <div class="card card-pad" style="margin-top:14px"><div class="wm-head" style="margin-bottom:4px"><h3 class="card-title">${e(M.sel ? fmtD(M.sel) : tr('upc'))}</h3>${M.sel ? `<button class="wm-mini" data-wm="cal-all">${e(tr('upc'))}</button>` : ''}</div>${shown.length ? shown.map(card).join('') : empty()}</div>`;
}
function evForm(x = {}) {
 const cats = canEv() && !staff() ? ['choir'] : CATS;
 open(x.id ? tr('edit') : tr('newEv'), form('event', `<input type="hidden" name="id" value="${e(x.id || '')}">${field('title', tr('title'), x.title, 'text', 'required maxlength="120"')}${field('date', tr('date'), x.date || M.sel || ymd(new Date()), 'date', 'required')}${field('time', tr('time'), x.time, 'time')}${field('place', tr('place'), x.place, 'text', 'maxlength="120"')}${sel('category', tr('cat'), cats.map(c => [c, tr('c_' + c)]), x.category || cats[0])}${area('notes', tr('notes'), x.notes)}`));
}

/* ---------- GIVING ---------- */
const accRow = a => `<div class="wm-acc"><div><div class="wm-sub">${e(a.bank || '')}${a.holder ? ' · ' + e(a.holder) : ''}</div><div class="wm-num">${e(a.number)}</div></div><button class="btn btn-gold" data-wm="copy" data-v="${e(a.number)}">📋 ${e(tr('copy'))}</button></div>`;
const teleRow = a => `<div class="wm-acc"><div><div class="wm-sub">${e(tr('tele'))}${a.holder ? ' · ' + e(a.holder) : ''}</div><div class="wm-num">${e(a.number)}</div></div><button class="btn btn-gold" data-wm="copy" data-v="${e(a.number)}">📋 ${e(tr('copy'))}</button></div>`;
const block = (title, g, note, editBtn) => `<div class="card card-pad" style="margin-bottom:14px"><div class="wm-head" style="margin-bottom:6px"><h3 class="card-title">${e(title)}</h3>${editBtn || ''}</div>${note ? `<p class="wm-sub">${e(note)}</p>` : ''}${g && ((g.accounts || []).length || (g.telebirr || []).length) ? (g.accounts || []).map(accRow).join('') + (g.telebirr || []).map(teleRow).join('') + (g.note ? `<p class="wm-sub">${e(g.note)}</p>` : '') : empty()}</div>`;
function vGiving() {
 return head(tr('giving'), tr('gIntro')) +
  block(tr('gChurch'), M.giving, '', role() === 'pastor' ? `<button class="wm-mini" data-wm="giving-edit">${e(tr('edit'))}</button>` : '') +
  block(tr('gDev') + ' ❤️', M.support, tr('devNote'), '');
}
const accText = g => (g && g.accounts || []).map(a => [a.bank, a.number, a.holder].join(' | ')).join('\n');
const teleText = g => (g && g.telebirr || []).map(a => [a.number, a.holder].join(' | ')).join('\n');
const lines = t => String(t || '').split('\n').map(x => x.trim()).filter(Boolean).slice(0, 10);
const parseAcc = t => lines(t).map(l => { const p = l.split('|').map(x => x.trim()); return { bank: (p[0] || '').slice(0, 60), number: (p[1] || '').slice(0, 40), holder: (p[2] || '').slice(0, 80) }; }).filter(a => a.number);
const parseTele = t => lines(t).map(l => { const p = l.split('|').map(x => x.trim()); return { number: (p[0] || '').slice(0, 40), holder: (p[1] || '').slice(0, 80) }; }).filter(a => a.number);
function givingForm(kind) {
 const g = kind === 'support' ? M.support : M.giving;
 open(kind === 'support' ? tr('supportEdit') : tr('gChurch'), form(kind === 'support' ? 'support' : 'giving', `${area('accounts', tr('accounts') + ' — ' + tr('accHint'), accText(g), 4)}${area('telebirr', tr('teles') + ' — ' + tr('teleHint'), teleText(g), 3)}${area('note', tr('notes'), g && g.note, 2)}`));
}

/* ---------- PEOPLE (families / servants / newcomers) ---------- */
function vPeople() {
 if (!staff()) return `<div class="card empty-state"><div class="big">🔒</div><strong>Pastor / Secretary</strong></div>`;
 const tab = M.ppl, today = ymd(new Date());
 let rows = M.people;
 const line = p => `<div class="wm-row" data-q="${e((p.name + ' ' + (p.family || '') + ' ' + (p.phone || '')).toLowerCase())}"><div><b>${e(p.name)}</b> <span class="wm-pill">${e(tr('s_' + (p.status || 'member')))}</span>${p.servant ? ` <span class="wm-pill" style="background:#FCD116;color:#001A3A">🙌 ${e(p.ministry || tr('servant'))}</span>` : ''}<div class="wm-sub">${e(p.phone || '')}${p.family ? ' · ' + e(p.family) : ''}</div>${p.status !== 'member' ? `<div class="wm-sub">${e(tr('follow'))}: <b>${e(tr('f_' + (p.followStatus || 'new')))}</b>${p.nextFollowUp ? ` · <span class="${p.nextFollowUp < today && p.followStatus !== 'joined' ? 'wm-late' : ''}">${e(fmtD(p.nextFollowUp))}${p.nextFollowUp < today && p.followStatus !== 'joined' ? ' ⚠ ' + e(tr('overdue')) : ''}</span>` : ''}</div>` : ''}${p.followNote ? `<div class="wm-sub">${e(p.followNote)}</div>` : ''}</div><div class="wm-act">${p.status !== 'member' ? ['contacted','visited','joined'].map(s => `<button data-wm="ppl-follow" data-id="${e(p.id)}" data-s="${s}">${e(tr('f_' + s))}</button>`).join('') : ''}<button data-wm="ppl-edit" data-id="${e(p.id)}">${e(tr('edit'))}</button></div></div>`;
 let body;
 if (tab === 'fam') { const g = {}; rows.forEach(p => (g[p.family || ''] = g[p.family || ''] || []).push(p)); body = Object.keys(g).sort().map(k => `<h4 style="margin:14px 0 2px">👪 ${e(k || tr('noFam'))} <span class="wm-pill">${g[k].length}</span></h4>${g[k].map(line).join('')}`).join(''); }
 else if (tab === 'serv') { const g = {}; rows.filter(p => p.servant).forEach(p => (g[p.ministry || ''] = g[p.ministry || ''] || []).push(p)); body = Object.keys(g).sort().map(k => `<h4 style="margin:14px 0 2px">🙌 ${e(k || tr('servant'))} <span class="wm-pill">${g[k].length}</span></h4>${g[k].map(line).join('')}`).join(''); }
 else if (tab === 'new') { body = rows.filter(p => p.status !== 'member' && p.followStatus !== 'joined').sort((a, c) => (a.nextFollowUp || '9').localeCompare(c.nextFollowUp || '9')).map(line).join(''); }
 else body = rows.map(line).join('');
 const tabs = [['all', tr('all')], ['fam', tr('fam')], ['serv', tr('serv')], ['new', tr('newc')]];
 return head(tr('people'), '', `<button class="btn btn-primary" data-wm="ppl-new">＋ ${e(tr('add'))}</button>`) +
  `<div class="card card-pad"><div class="wm-tabs">${tabs.map(([k, l]) => `<button class="${tab === k ? 'on' : ''}" data-wm="ppl-tab" data-t="${k}">${e(l)}</button>`).join('')}</div><div class="field"><input type="search" data-wmi="pq" placeholder="${e(tr('search'))}"></div>${body || empty()}</div>`;
}
function pplForm(p = {}) {
 open(p.id ? tr('edit') : tr('add'), form('person', `<input type="hidden" name="id" value="${e(p.id || '')}">${field('name', tr('name'), p.name, 'text', 'required maxlength="100"')}${field('phone', tr('phone'), p.phone, 'tel', 'maxlength="30"')}${field('family', tr('family'), p.family, 'text', 'maxlength="80"')}${sel('status', tr('status'), [['member', tr('s_member')], ['newcomer', tr('s_newcomer')], ['visitor', tr('s_visitor')]], p.status || 'member')}<label class="wm-chk"><input type="checkbox" name="servant" ${p.servant ? 'checked' : ''}> ${e(tr('servant'))}</label>${field('ministry', tr('ministry'), p.ministry, 'text', 'maxlength="80"')}${sel('followStatus', tr('follow'), ['new', 'contacted', 'visited', 'joined'].map(s => [s, tr('f_' + s)]), p.followStatus || 'new')}${field('nextFollowUp', tr('next'), p.nextFollowUp, 'date')}${area('followNote', tr('notes'), p.followNote, 2)}`));
}

/* ---------- SCHOOL / BIBLE STUDY ---------- */
function loadClass(id) {
 M.sub.forEach(f => f()); M.sub = []; M.students = []; M.sessions = []; M.cls = id; M.att = new Set();
 if (id && staff()) { const c = base().collection('classes').doc(id);
  sub(c.collection('students').limit(300), s => { M.students = list(s).sort((a, b) => (a.name || '').localeCompare(b.name || '')); }, M.sub);
  sub(c.collection('sessions').orderBy('date', 'desc').limit(80), s => { M.sessions = list(s); const cur = M.sessions.find(x => x.id === M.attDate); if (cur && !M.att.size) M.att = new Set(cur.present || []); }, M.sub); }
 refresh();
}
function vSchool() {
 const c = M.classes.find(x => x.id === M.cls);
 if (!c) return head(tr('school'), '', staff() ? `<button class="btn btn-primary" data-wm="cls-new">＋ ${e(tr('newCls'))}</button>` : '') +
  `<div class="card card-pad">${M.classes.length ? M.classes.map(x => `<div class="wm-row"><div><b>${e(x.name)}</b> <span class="wm-pill">${e(tr('k_' + (x.kind || 'sundayschool')))}</span><div class="wm-sub">${e(tr('teacher'))}: ${e(x.teacher || '—')} · ${e(x.day || '')} ${e(x.time || '')} ${x.place ? '· ' + e(x.place) : ''}</div></div>${staff() ? `<button class="btn btn-primary" data-wm="cls-open" data-id="${e(x.id)}">${e(tr('open'))}</button>` : ''}</div>`).join('') : empty()}</div>`;
 const n = M.sessions.length, per = id => n ? Math.round(100 * M.sessions.filter(s => (s.present || []).includes(id)).length / n) : 0;
 return head(c.name, `${tr('k_' + (c.kind || 'sundayschool'))} · ${c.teacher || ''}`, `<div class="wm-act"><button class="wm-mini" data-wm="cls-back">${e(tr('back'))}</button><button class="wm-mini" data-wm="cls-del" data-id="${e(c.id)}">🗑</button></div>`) +
  `<div class="card card-pad" style="margin-bottom:14px"><h3 class="card-title">${e(tr('attend'))}</h3><div class="field"><label>${e(tr('date'))}</label><input type="date" value="${e(M.attDate)}" data-wmi="attdate"></div>${M.students.length ? M.students.map(s => `<label class="wm-chk"><input type="checkbox" data-wmi="att" data-id="${e(s.id)}" ${M.att.has(s.id) ? 'checked' : ''}> ${e(s.name)} <span class="wm-sub">${per(s.id)}%</span></label>`).join('') : empty()}<button class="btn btn-primary" style="margin-top:10px" data-wm="att-save">${e(tr('save'))}</button></div>
  <div class="card card-pad" style="margin-bottom:14px"><h3 class="card-title">${e(tr('students'))} (${M.students.length})</h3><form data-wmf="student" style="display:flex;gap:8px"><input name="name" required maxlength="100" placeholder="${e(tr('addStu'))}" style="flex:1"><button class="btn btn-primary">＋</button></form>${M.students.map(s => `<div class="wm-row"><span>${e(s.name)}</span><button class="wm-mini" data-wm="stu-del" data-id="${e(s.id)}">🗑</button></div>`).join('')}</div>
  <div class="card card-pad"><h3 class="card-title">${e(tr('hist'))}</h3>${n ? M.sessions.map(s => `<div class="wm-row"><span>${e(fmtD(s.id))}</span><span class="wm-pill">${(s.present || []).length}/${M.students.length}</span></div>`).join('') : empty()}</div>`;
}
function clsForm() { open(tr('newCls'), form('class', `${field('name', tr('name'), '', 'text', 'required maxlength="100"')}${sel('kind', tr('kind'), [['sundayschool', tr('k_sundayschool')], ['biblestudy', tr('k_biblestudy')]], 'sundayschool')}${field('teacher', tr('teacher'), '', 'text', 'maxlength="100"')}${field('day', tr('day'), '', 'text', 'maxlength="30"')}${field('time', tr('time'), '', 'time')}${field('place', tr('place'), '', 'text', 'maxlength="100"')}`)); }

/* ---------- PASTORAL CARE ---------- */
function vCare() {
 const pastor = role() === 'pastor', f = M.careF, rows = M.care.filter(x => f === 'all' || x.status === f);
 const tabs = pastor ? `<div class="wm-tabs">${['all', 'requested', 'scheduled', 'done'].map(k => `<button class="${f === k ? 'on' : ''}" data-wm="care-f" data-s="${k}">${e(k === 'all' ? tr('all') : tr('r_' + k))}</button>`).join('')}</div>` : '';
 const row = x => `<div class="wm-row"><div><b>${e(tr('t_' + (x.topic || 'other')))}</b> <span class="wm-pill">${e(tr('r_' + x.status))}</span>${pastor ? `<div class="wm-sub">👤 ${e(x.name || '')}</div>` : ''}<div class="wm-sub">${e(x.details || '')}</div>${x.preferred ? `<div class="wm-sub">${e(tr('pref'))}: ${e(fmtD(x.preferred))}</div>` : ''}${x.scheduledAt ? `<div class="wm-sub">📅 <b>${e(x.scheduledAt.replace('T', ' '))}</b></div>` : ''}${x.replyNote ? `<div class="wm-sub">💬 ${e(x.replyNote)}</div>` : ''}</div><div class="wm-act">${pastor && ['requested', 'scheduled'].includes(x.status) ? `<button data-wm="care-sched" data-id="${e(x.id)}">${e(tr('schedule'))}</button><button data-wm="care-set" data-id="${e(x.id)}" data-s="done">${e(tr('done'))}</button><button data-wm="care-set" data-id="${e(x.id)}" data-s="declined">${e(tr('decline'))}</button>` : ''}${!pastor && ['requested', 'scheduled'].includes(x.status) ? `<button data-wm="care-set" data-id="${e(x.id)}" data-s="cancelled">${e(tr('cancelR'))}</button>` : ''}</div></div>`;
 return head(tr('care'), tr('careNote'), pastor ? '' : `<button class="btn btn-primary" data-wm="care-new">＋ ${e(tr('newReq'))}</button>`) + `<div class="card card-pad">${tabs}${rows.length ? rows.map(row).join('') : empty()}</div>`;
}
function careForm() { open(tr('newReq'), form('care', `${sel('topic', tr('topic'), ['counseling', 'marriage', 'family', 'prayer', 'other'].map(k => [k, tr('t_' + k)]), 'counseling')}${area('details', tr('details'), '', 4)}${field('preferred', tr('pref'), '', 'date')}<p class="wm-sub">🔒 ${e(tr('careNote'))}</p>`)); }

/* ---------- ADS (extra income) + developer admin ---------- */
const okLink = u => /^https:\/\/[^\s]+$/i.test(u || '');
function adsHTML() {
 const a = M.ads.filter(x => x.active).sort((p, q) => ((q.createdAt && q.createdAt.toMillis && q.createdAt.toMillis()) || 0) - ((p.createdAt && p.createdAt.toMillis && p.createdAt.toMillis()) || 0)).slice(0, 3);
 return a.map(x => `<div class="wm-ad"><div><span class="wm-pill">${e(tr('ad'))}</span> <b>${e(x.title)}</b><div class="wm-sub">${e(x.text || '')}</div></div>${okLink(x.link) ? `<a class="btn btn-gold" href="${e(x.link)}" target="_blank" rel="noopener noreferrer sponsored">${e(tr('open'))}</a>` : ''}</div>`).join('');
}
function adsAdmin() {
 open(tr('ads'), `${M.ads.map(x => `<div class="wm-row"><div><b>${e(x.title)}</b> <span class="wm-pill">${x.active ? '✔ ' + e(tr('active')) : '—'}</span><div class="wm-sub">${e(x.text || '')}</div></div><div class="wm-act"><button data-wm="ad-toggle" data-id="${e(x.id)}">${x.active ? '⏸' : '▶'}</button><button data-wm="ad-del" data-id="${e(x.id)}">🗑</button></div></div>`).join('') || empty()}<hr>${form('ad', `${field('title', tr('title'), '', 'text', 'required maxlength="80"')}${area('text', tr('adText'), '', 2)}${field('link', tr('adLink'), '', 'url')}`)}`);
}
const devButtons = () => role() === 'developer' ? `<div class="card card-pad" style="margin-bottom:18px"><div class="row-between"><div><h3 class="card-title">💝 ${e(tr('supportEdit'))} / 📣 ${e(tr('ads'))}</h3><p class="small muted">Bank, Telebirr, beeksisa.</p></div><div class="wm-act"><button class="btn btn-primary" data-wm="support-edit">${e(tr('supportEdit'))}</button><button class="btn btn-gold" data-wm="ads-admin">${e(tr('ads'))}</button></div></div></div>` : '';

/* ---------- views + events ---------- */
const V = { calendar: vCalendar, giving: vGiving, people: vPeople, school: vSchool, care: vCare };
const view = k => { css(); try { return V[k] ? V[k]() : ''; } catch (x) { console.error(x); return `<div class="card card-pad">${e(x.message)}</div>`; } };
const need = () => { if (!session || session.mode !== 'firebase' || !session.churchId) throw new Error('Church account required.'); };
const by = () => ({ createdBy: session.id, createdAt: TS() });
const gd = (id, arr) => arr.find(x => x.id === id) || {};
document.addEventListener('click', async ev => {
 const b = ev.target.closest('[data-wm]'); if (!b) return; const a = b.dataset.wm, id = b.dataset.id;
 try {
  if (a === 'cal-prev') { M.cal = new Date(M.cal.getFullYear(), M.cal.getMonth() - 1, 1); render(); }
  else if (a === 'cal-next') { M.cal = new Date(M.cal.getFullYear(), M.cal.getMonth() + 1, 1); render(); }
  else if (a === 'cal-day') { M.sel = b.dataset.d === M.sel ? '' : b.dataset.d; render(); }
  else if (a === 'cal-all') { M.sel = ''; render(); }
  else if (a === 'ev-new') evForm();
  else if (a === 'ev-edit') evForm(gd(id, M.ev));
  else if (a === 'ev-del') { if (confirm(tr('sure'))) await base().collection('events').doc(id).delete(); }
  else if (a === 'copy') { try { await navigator.clipboard.writeText(b.dataset.v); } catch (x) { const t = document.createElement('textarea'); t.value = b.dataset.v; document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); } toast(tr('copied') + ': ' + b.dataset.v); }
  else if (a === 'giving-edit') givingForm('church');
  else if (a === 'support-edit') givingForm('support');
  else if (a === 'ads-admin') adsAdmin();
  else if (a === 'ad-toggle') { const x = gd(id, M.ads); await db().collection('ads').doc(id).update({ active: !x.active }); adsAdmin(); }
  else if (a === 'ad-del') { if (confirm(tr('sure'))) { await db().collection('ads').doc(id).delete(); adsAdmin(); } }
  else if (a === 'ppl-tab') { M.ppl = b.dataset.t; render(); }
  else if (a === 'ppl-new') pplForm();
  else if (a === 'ppl-edit') pplForm(gd(id, M.people));
  else if (a === 'ppl-follow') { await base().collection('people').doc(id).update({ followStatus: b.dataset.s, updatedAt: TS() }); }
  else if (a === 'cls-new') clsForm();
  else if (a === 'cls-open') { M.attDate = ymd(new Date()); loadClass(id); }
  else if (a === 'cls-back') loadClass('');
  else if (a === 'cls-del') { if (confirm(tr('sure'))) { await base().collection('classes').doc(id).delete(); loadClass(''); } }
  else if (a === 'stu-del') { if (confirm(tr('sure'))) await base().collection('classes').doc(M.cls).collection('students').doc(id).delete(); }
  else if (a === 'att-save') { await base().collection('classes').doc(M.cls).collection('sessions').doc(M.attDate).set({ date: M.attDate, present: [...M.att], by: session.id, updatedAt: TS() }); toast(tr('saved')); }
  else if (a === 'care-new') careForm();
  else if (a === 'care-f') { M.careF = b.dataset.s; render(); }
  else if (a === 'care-sched') { const x = gd(id, M.care); open(tr('schedule'), form('care-sched', `<input type="hidden" name="id" value="${e(id)}">${field('scheduledAt', tr('when'), x.scheduledAt, 'datetime-local', 'required')}${area('replyNote', tr('reply'), x.replyNote, 3)}`)); }
  else if (a === 'care-set') { await base().collection('care').doc(id).update({ status: b.dataset.s, updatedAt: TS() }); }
 } catch (x) { fail(x); }
});
document.addEventListener('input', ev => {
 const i = ev.target.closest('[data-wmi]'); if (!i) return;
 if (i.dataset.wmi === 'pq') { const q = i.value.toLowerCase(); document.querySelectorAll('.wm-row[data-q]').forEach(r => { r.style.display = r.dataset.q.includes(q) ? '' : 'none'; }); }
});
document.addEventListener('change', ev => {
 const i = ev.target.closest('[data-wmi]'); if (!i) return;
 if (i.dataset.wmi === 'att') { i.checked ? M.att.add(i.dataset.id) : M.att.delete(i.dataset.id); }
 else if (i.dataset.wmi === 'attdate') { M.attDate = i.value || ymd(new Date()); const cur = M.sessions.find(x => x.id === M.attDate); M.att = new Set(cur ? cur.present || [] : []); render(); }
});
document.addEventListener('submit', async ev => {
 const f = ev.target.closest('form[data-wmf]'); if (!f) return; ev.preventDefault(); const k = f.dataset.wmf, fd = new FormData(f), g = n => String(fd.get(n) || '').trim();
 try {
  if (k === 'event') { need(); const id = g('id'), cat = CATS.includes(g('category')) ? g('category') : 'other'; const d = { title: g('title'), date: g('date'), time: g('time'), place: g('place'), notes: g('notes'), category: cat };
   if (id) await base().collection('events').doc(id).update({ ...d, updatedAt: TS() }); else await base().collection('events').add({ ...d, ...by() }); }
  else if (k === 'giving') { need(); await base().collection('settings').doc('giving').set({ accounts: parseAcc(g('accounts')), telebirr: parseTele(g('telebirr')), note: g('note').slice(0, 300), updatedAt: TS(), updatedBy: session.id }); }
  else if (k === 'support') { await db().collection('supportInfo').doc('giving').set({ accounts: parseAcc(g('accounts')), telebirr: parseTele(g('telebirr')), note: g('note').slice(0, 300), updatedAt: TS(), updatedBy: session.id }); }
  else if (k === 'ad') { const link = g('link'); if (link && !okLink(link)) throw new Error('Link must start with https://'); await db().collection('ads').add({ title: g('title'), text: g('text').slice(0, 300), link, active: true, createdBy: session.id, createdAt: TS() }); closeModal(); adsAdmin(); return; }
  else if (k === 'person') { need(); const id = g('id'), d = { name: g('name'), phone: g('phone'), family: g('family'), status: g('status'), servant: fd.get('servant') === 'on', ministry: g('ministry'), followStatus: g('followStatus'), nextFollowUp: g('nextFollowUp'), followNote: g('followNote') };
   if (id) await base().collection('people').doc(id).update({ ...d, updatedAt: TS() }); else await base().collection('people').add({ ...d, ...by() }); }
  else if (k === 'class') { need(); await base().collection('classes').add({ name: g('name'), kind: g('kind'), teacher: g('teacher'), day: g('day'), time: g('time'), place: g('place'), ...by() }); }
  else if (k === 'student') { await base().collection('classes').doc(M.cls).collection('students').add({ name: g('name'), createdAt: TS() }); f.reset(); return; }
  else if (k === 'care') { need(); await base().collection('care').add({ uid: session.id, name: session.name || '', topic: g('topic'), details: g('details').slice(0, 2000), preferred: g('preferred'), status: 'requested', createdAt: TS() }); }
  else if (k === 'care-sched') { await base().collection('care').doc(g('id')).update({ status: 'scheduled', scheduledAt: g('scheduledAt'), replyNote: g('replyNote').slice(0, 1000), updatedAt: TS() }); }
  closeModal(); toast(tr('saved'));
 } catch (x) { fail(x); }
});

const wrap = (o, n, fn) => { const old = o[n]; o[n] = (...a) => { try { old && old.apply(o, a); } catch (x) { console.warn(x); } fn(); }; };
const hook = () => { if (window.WCLive && !window.WCLive.__wm) { window.WCLive.__wm = 1; wrap(window.WCLive, 'start', start); wrap(window.WCLive, 'stop', stop); } else if (!window.WCLive) setTimeout(hook, 200); };
hook();
window.WCMods = { view, adsHTML, devButtons, start, stop, _M: M };
})();
