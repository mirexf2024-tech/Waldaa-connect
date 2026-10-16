 <!DOCTYPE html>
<html lang="om">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#003b82">
<title>Waldaa Connect</title>

<style>
:root{
  --blue:#003b82;
  --navy:#001a3a;
  --gold:#fcd116;
  --bg:#f3f6fb;
  --white:#fff;
  --text:#17243a;
  --muted:#68778c;
  --line:#dce4ef;
  --green:#16834a;
  --red:#b42318;
}
*{box-sizing:border-box}
body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:Arial,Helvetica,sans-serif;
  line-height:1.5;
}
.app{
  max-width:480px;
  min-height:100vh;
  margin:auto;
  padding-bottom:25px;
}
header{
  background:linear-gradient(135deg,var(--navy),var(--blue));
  color:white;
  padding:18px 16px;
  border-radius:0 0 22px 22px;
}
.head{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:8px;
}
.brand{font-size:21px;font-weight:800}
button,select,input,textarea{font:inherit}
button{cursor:pointer}
button:disabled{opacity:.55;cursor:not-allowed}
.icon{
  border:1px solid #ffffff55;
  background:#ffffff15;
  color:white;
  border-radius:10px;
  padding:8px 11px;
}
.lang{
  display:flex;
  justify-content:flex-end;
  margin-top:10px;
}
.lang select{
  width:auto;
  padding:7px;
  border-radius:9px;
}
main{padding:15px}
.page{display:none}
.page.active{display:block}
.hero{
  background:linear-gradient(145deg,var(--navy),var(--blue));
  color:white;
  padding:22px 18px;
  border-radius:19px;
}
.eyebrow{
  font-size:11px;
  letter-spacing:2px;
  color:var(--gold);
  font-weight:bold;
}
h1{font-size:29px;line-height:1.2;margin:10px 0}
h2{font-size:22px;margin:5px 0 14px}
h3{font-size:17px;margin:0 0 10px}
.hero p{font-size:14px;color:#e3ecf8}
.verse{
  border-left:3px solid var(--gold);
  padding-left:10px;
  margin-top:18px;
  font-size:13px;
}
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:10px;
  margin-top:12px;
}
.card,.tile{
  background:var(--white);
  border:1px solid var(--line);
  border-radius:15px;
  padding:14px;
  margin-top:12px;
  box-shadow:0 4px 15px #001a3a08;
}
.tile .emoji{font-size:25px}
.tile b{display:block}
small,.muted{color:var(--muted);font-size:13px}
.field{margin-top:12px}
label{
  display:block;
  font-size:13px;
  font-weight:bold;
  margin-bottom:5px;
}
input,select,textarea{
  width:100%;
  padding:12px;
  border:1px solid var(--line);
  border-radius:10px;
  background:var(--white);
  color:var(--text);
}
.btn{
  border:0;
  border-radius:10px;
  padding:12px 14px;
  background:var(--blue);
  color:white;
  font-weight:bold;
}
.btn.full{width:100%;margin-top:10px}
.btn.gold{background:var(--gold);color:#17243a}
.btn.light{background:#e7eef9;color:var(--blue)}
.btn.good{background:#dff7e9;color:#126b3c}
.btn.bad{background:#fde8e7;color:#a02018}
.btn.small{padding:8px 10px;font-size:12px}
.note{
  background:#edf3fb;
  padding:10px;
  border-radius:10px;
  font-size:12px;
  margin-top:10px;
}
.list{
  display:flex;
  flex-direction:column;
  gap:9px;
  margin-top:12px;
}
.item{
  background:var(--white);
  border:1px solid var(--line);
  border-radius:12px;
  padding:12px;
}
.status{
  display:inline-block;
  padding:3px 9px;
  border-radius:20px;
  font-size:11px;
  font-weight:bold;
  background:#fff0c2;
  color:#795900;
}
.status.approved{background:#dff7e9;color:#126b3c}
.status.rejected{background:#fde8e7;color:#a02018}
.actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:9px}
.hidden{display:none!important}
hr{border:0;border-top:1px solid var(--line);margin:17px 0}
.footer{
  text-align:center;
  padding:18px;
  color:var(--muted);
  font-size:12px;
}
#toast{
  display:none;
  position:fixed;
  bottom:20px;
  left:50%;
  transform:translateX(-50%);
  width:90%;
  max-width:440px;
  background:#10233e;
  color:white;
  padding:12px;
  border-radius:10px;
  text-align:center;
  z-index:9999;
}
#recaptcha-container{margin-top:10px}
body.dark{
  --bg:#0d1624;
  --white:#172438;
  --text:#edf3fb;
  --muted:#aab8ca;
  --line:#2e4058;
}
body.dark .note{background:#22334b}
body.dark .btn.light{background:#263c59;color:#fff}
@media(min-width:520px){
  body{padding:18px 0}
  .app{
    border-radius:22px;
    overflow:hidden;
    box-shadow:0 10px 35px #001a3a18;
  }
}
</style>

<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js"></script>
</head>

<body>
<div class="app">

<header>
  <div class="head">
    <div class="brand">⛪ Waldaa Connect</div>
    <button class="icon" onclick="toggleDark()" aria-label="Dark mode">☾</button>
  </div>

  <div class="lang">
    <select id="language" onchange="changeLang(this.value)">
      <option value="om">Afaan Oromoo</option>
      <option value="en">English</option>
      <option value="am">አማርኛ</option>
    </select>
  </div>
</header>

<main>

<!-- WELCOME PAGE -->
<section id="welcome" class="page active">
  <div class="hero">
    <div class="eyebrow" data-t="tag">BAGA NAGAAN DHUFTAN</div>

    <h1 data-t="title">Waldaa kee,<br>hawaasa kee.</h1>

    <p data-t="intro">
      Barumsa Wangeelaa, faarfannaa fi tajaajila waldaa bakka tokkootti walitti fidu.
    </p>

    <button class="btn gold" onclick="show('register')" data-t="register">
      Akka miseensaatti galmaa'i
    </button>

    <div class="verse">
      “Waaqayyo ibsaa fi fayyina koo ti.”<br>
      <b>Faarfannaa 27:1</b>
    </div>
  </div>

  <div class="grid">
    <div class="tile">
      <div class="emoji">📖</div>
      <b data-t="bible">Wangeela</b>
      <small data-t="bibleSub">Dubbisi, baradhu</small>
    </div>

    <div class="tile">
      <div class="emoji">🎶</div>
      <b data-t="songs">Faarfannaa</b>
      <small data-t="songsSub">Sirboota choir</small>
    </div>

    <div class="tile">
      <div class="emoji">👥</div>
      <b data-t="members">Miseensota</b>
      <small data-t="membersSub">Galmee waldaa</small>
    </div>

    <div class="tile">
      <div class="emoji">💛</div>
      <b data-t="giving">Kennaa</b>
      <small data-t="givingSub">Kurnoo fi kennaa</small>
    </div>
  </div>

  <div class="card">
    <h3 data-t="purpose">Kaayyoo appii kanaa</h3>
    <p class="muted" data-t="purposeText">
      Tajaajila waldaa fi barumsa hafuuraa salphisuu.
    </p>
  </div>

  <button class="btn full" onclick="show('login')" data-t="login">Seensa</button>
  <button class="btn light full" onclick="show('register')" data-t="register">
    Akka miseensaatti galmaa'i
  </button>

  <div class="footer">Waldaa Connect © 2026</div>
</section>

<!-- REGISTRATION PAGE -->
<section id="register" class="page">
  <h2 data-t="newMember">Galmee miseensaa haaraa</h2>

  <div class="card">
    <p class="muted" data-t="registerInfo">
      Galmeen kee Admin/Pastor bira ga'a. Gaheen jalqabaa miseensa qofa.
    </p>

    <form id="registerForm" onsubmit="sendRegistrationOTP(event)">
      <div class="field">
        <label data-t="name">Maqaa guutuu</label>
        <input id="regName" required maxlength="100" autocomplete="name">
      </div>

      <div class="field">
        <label data-t="phone">Lakkoofsa bilbilaa</label>
        <input id="regPhone" type="tel" required maxlength="25"
               placeholder="0912345678" autocomplete="tel">
      </div>

      <div class="field">
        <label data-t="church">Waldaa</label>
        <select id="regChurch">
          <option>Waldaa Adamaa</option>
          <option>Waldaa Finfinnee</option>
        </select>
      </div>

      <div class="field">
        <label data-t="message">Ergaa dabalataa (dirqama miti)</label>
        <textarea id="regMessage" rows="3" maxlength="300"></textarea>
      </div>

      <button class="btn full" type="submit" id="sendRegOTP">
        📱 OTP bilbilatti ergi
      </button>
    </form>

    <div id="regOTPBox" class="hidden">
      <hr>
      <p class="muted">
        Koodii mirkaneessaa bilbila kee irratti argatte galchi.
      </p>

      <div class="field">
        <label>Koodii OTP</label>
        <input id="regOTP" inputmode="numeric"
               autocomplete="one-time-code" maxlength="6"
               placeholder="123456">
      </div>

      <button class="btn full" onclick="verifyRegistrationOTP()">
        Mirkaneessi fi galmee ergi
      </button>
    </div>

    <div class="note">
      Galmeen kee OTPn erga mirkanaa'ee booda Firestore irratti kuufama.
      Raggaasifamuu isaa Admin eeggata.
    </div>

    <button class="btn light full" onclick="show('welcome')" data-t="back">
      Duubatti
    </button>
  </div>
</section>

<!-- LOGIN PAGE -->
<section id="login" class="page">
  <h2 data-t="login">Seensa</h2>

  <div class="card">
    <p class="muted">
      Lakkoofsa bilbila keetiin OTP fudhadhu. Jecha iccitii asitti hin barbaachisu.
    </p>

    <div class="field">
      <label data-t="phone">Lakkoofsa bilbilaa</label>
      <input id="loginPhone" type="tel" placeholder="0912345678"
             autocomplete="tel">
    </div>

    <button class="btn full" onclick="sendLoginOTP()" id="sendLoginOTPBtn">
      📱 OTP ergi
    </button>

    <div id="loginOTPBox" class="hidden">
      <div class="field">
        <label>Koodii OTP</label>
        <input id="loginOTP" inputmode="numeric"
               autocomplete="one-time-code" maxlength="6"
               placeholder="123456">
      </div>

      <button class="btn full" onclick="verifyLoginOTP()">
        Mirkaneessi fi seeni
      </button>
    </div>

    <button class="btn light full" onclick="show('register')" data-t="register">
      Akka miseensaatti galmaa'i
    </button>

    <button class="btn light full" onclick="show('welcome')" data-t="back">
      Duubatti
    </button>
  </div>
</section>

<!-- MEMBER PAGE -->
<section id="memberHome" class="page">
  <h2 id="memberGreeting">Baga nagaan dhuftan</h2>

  <div class="card">
    <h3>📖 Wangeela</h3>
    <p class="muted">
      Kutaan Wangeelaa guutuun itti aansee ni dabalama.
    </p>
  </div>

  <div class="card">
    <h3>👤 Odeeffannoo miseensaa</h3>
    <p id="memberChurchText" class="muted"></p>
    <p>
      Haala galmee:
      <span id="memberStatus" class="status approved">Approved</span>
    </p>
  </div>

  <button class="btn light full" onclick="logout()">Ba'i</button>
</section>

<!-- PENDING PAGE -->
<section id="pendingPage" class="page">
  <div class="card">
    <h2>⏳ Eeyyama eeggachaa jirta</h2>
    <p>
      Galmeen kee ergameera. Admin/Pastor hanga raggaasisutti
      kutaa miseensotaa seenuu hin dandeessu.
    </p>
    <button class="btn full" onclick="logout()">Ba'i</button>
  </div>
</section>

<!-- ADMIN PAGE -->
<section id="adminPage" class="page">
  <h2>🛡️ To'annoo Admin</h2>

  <div class="note">
    Fuulli kun Admin mirkanaa'e qofaf banaa dha.
  </div>

  <div class="card">
    <h3>Galmeewwan miseensotaa</h3>
    <button class="btn full" onclick="loadRegistrations()">
      Haaromsi galmee
    </button>
    <div id="requestList" class="list"></div>
  </div>

  <button class="btn light full" onclick="logout()">Ba'i</button>
</section>

</main>
</div>

<div id="recaptcha-container"></div>
<div id="toast" role="status" aria-live="polite"></div>

<script>
"use strict";

/* 1. FIREBASE CONFIGURATION */

const firebaseConfig = {
  apiKey: "AIzaSyAR_1Bk6XJGfpR87p4CroA2paNTTNp85KQ",
  authDomain: "church-supper-app.firebaseapp.com",
  databaseURL: "https://church-supper-app-default-rtdb.firebaseio.com",
  projectId: "church-supper-app",
  storageBucket: "church-supper-app.firebasestorage.app",
  messagingSenderId: "842406866038",
  appId: "1:842406866038:web:7e4c612dc5e79ff5528357",
  measurementId: "G-FG0B82B740"
};

let auth = null;
let db = null;
let firebaseReady = false;
let recaptchaVerifier = null;
let confirmationResult = null;
let otpMode = "";
let currentUser = null;
let currentRegistration = null;

/* 2. TRANSLATIONS */

const words = {
  om: {
    tag: "BAGA NAGAAN DHUFTAN",
    title: "Waldaa kee,<br>hawaasa kee.",
    intro: "Barumsa Wangeelaa, faarfannaa fi tajaajila waldaa bakka tokkootti walitti fidu.",
    register: "Akka miseensaatti galmaa'i",
    bible: "Wangeela",
    bibleSub: "Dubbisi, baradhu",
    songs: "Faarfannaa",
    songsSub: "Sirboota choir",
    members: "Miseensota",
    membersSub: "Galmee waldaa",
    giving: "Kennaa",
    givingSub: "Kurnoo fi kennaa",
    purpose: "Kaayyoo appii kanaa",
    purposeText: "Tajaajila waldaa fi barumsa hafuuraa salphisuu.",
    login: "Seensa",
    newMember: "Galmee miseensaa haaraa",
    registerInfo: "Galmeen kee Admin/Pastor bira ga'a. Gaheen jalqabaa miseensa qofa.",
    name: "Maqaa guutuu",
    phone: "Lakkoofsa bilbilaa",
    church: "Waldaa",
    message: "Ergaa dabalataa (dirqama miti)",
    back: "Duubatti"
  },

  en: {
    tag: "WELCOME",
    title: "Your church,<br>your community.",
    intro: "Bringing Bible learning, choir songs and church services together in one place.",
    register: "Register as a member",
    bible: "Bible",
    bibleSub: "Read and learn",
    songs: "Choir songs",
    songsSub: "Choir music",
    members: "Members",
    membersSub: "Church directory",
    giving: "Giving",
    givingSub: "Tithes and offerings",
    purpose: "Purpose of this app",
    purposeText: "Supporting church services and spiritual learning.",
    login: "Login",
    newMember: "New member registration",
    registerInfo: "Your request goes to Admin/Pastor. New registrations are members only.",
    name: "Full name",
    phone: "Phone number",
    church: "Church",
    message: "Additional message (optional)",
    back: "Back"
  },

  am: {
    tag: "እንኳን በደህና መጡ",
    title: "ቤተ ክርስቲያንዎ፣<br>ማህበረሰብዎ።",
    intro: "የመጽሐፍ ቅዱስ ትምህርትን፣ መዝሙሮችን እና አገልግሎቶችን በአንድ ቦታ ያገናኛል።",
    register: "እንደ አባል ይመዝገቡ",
    bible: "መጽሐፍ ቅዱስ",
    bibleSub: "አንብብ እና ተማር",
    songs: "መዝሙሮች",
    songsSub: "የመዘምራን ቡድን",
    members: "አባላት",
    membersSub: "የቤተ ክርስቲያን መዝገብ",
    giving: "ስጦታ",
    givingSub: "አሥራት እና ስጦታ",
    purpose: "የመተግበሪያው ዓላማ",
    purposeText: "የቤተ ክርስቲያን አገልግሎትን መደገፍ።",
    login: "መግቢያ",
    newMember: "አዲስ የአባልነት ምዝገባ",
    registerInfo: "ጥያቄዎ ለአስተዳዳሪ/ፓስተር ይሄዳል።",
    name: "ሙሉ ስም",
    phone: "ስልክ ቁጥር",
    church: "የቤተ ክርስቲያን ስም",
    message: "ተጨማሪ መልእክት",
    back: "ተመለስ"
  }
};

/* 3. INITIALIZE FIREBASE */

try {
  if (typeof firebase !== "undefined") {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    auth = firebase.auth();
    db = firebase.firestore();
    firebaseReady = true;
  } else {
    console.error("Firebase SDK hin argamne.");
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

/* 4. GENERAL FUNCTIONS */

function show(id) {
  document.querySelectorAll(".page").forEach(function(page) {
    page.classList.remove("active");
  });

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  } else {
    console.error("Page hin argamne:", id);
  }

  window.scrollTo(0, 0);

  if (id === "adminPage") {
    loadRegistrations();
  }
}

function notify(message) {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = message;
  el.style.display = "block";

  clearTimeout(window.toastTimer);

  window.toastTimer = setTimeout(function() {
    el.style.display = "none";
  }, 4500);
}

function toggleDark() {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "wc_dark",
    document.body.classList.contains("dark") ? "1" : "0"
  );
}

function changeLang(lang) {
  if (!words[lang]) {
    lang = "om";
  }

  document.documentElement.lang = lang;

  document.querySelectorAll("[data-t]").forEach(function(el) {
    const key = el.dataset.t;

    if (words[lang][key] !== undefined) {
      el.innerHTML = words[lang][key];
    }
  });

  localStorage.setItem("wc_lang", lang);
}

function safe(value) {
  return String(value == null ? "" : value).replace(/[&<>"']/g, function(c) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[c];
  });
}

function ensureFirebase() {
  if (!firebaseReady || !auth || !db) {
    notify("Firebase hin qophoofne. Internet fi Firebase SDK ilaali.");
    return false;
  }

  return true;
}

/* 5. PHONE NUMBER FORMAT */

function normalizePhone(value) {
  let phone = String(value || "").trim().replace(/[\s()-]/g, "");

  if (phone.startsWith("00")) {
    phone = "+" + phone.slice(2);
  }

  if (/^09\d{8}$/.test(phone)) {
    phone = "+251" + phone.slice(1);
  } else if (/^07\d{8}$/.test(phone)) {
    phone = "+251" + phone.slice(1);
  } else if (/^251\d{9}$/.test(phone)) {
    phone = "+" + phone;
  } else if (/^9\d{8}$/.test(phone)) {
    phone = "+251" + phone;
  } else if (/^7\d{8}$/.test(phone)) {
    phone = "+251" + phone;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error(
      "Lakkoofsa bilbilaa sirrii galchi. Fakkeenya: 0912345678."
    );
  }

  return phone;
}

/* 6. FIREBASE ERROR MESSAGES */

function firebaseError(error) {
  const code = error && error.code ? error.code : "";

  const messages = {
    "auth/invalid-phone-number":
      "Lakkoofsi bilbilaa sirrii miti.",
    "auth/too-many-requests":
      "Yaalii baay'ee goote. Booda irra deebi'i.",
    "auth/quota-exceeded":
      "Daangaan SMS xumurame. Firebase ilaali.",
    "auth/captcha-check-failed":
      "reCAPTCHA hin milkoofne. Fuula irra deebi'i.",
    "auth/invalid-verification-code":
      "Koodiin OTP sirrii miti.",
    "auth/code-expired":
      "OTP yeroo isaa xumure. Koodii haaraa gaafadhu.",
    "auth/network-request-failed":
      "Internet kee ilaali.",
    "permission-denied":
      "Hayyamni Firestore hin jiru. Security Rules ilaali.",
    "unavailable":
      "Tajaajilli yeroo ammaa hin argamne. Irra deebi'i."
  };

  return messages[code] ||
    ("Dogoggorri uumame: " +
     (error && error.message ? error.message : code || "Unknown error"));
}

/* 7. RECAPTCHA AND OTP */

function getRecaptcha() {
  if (recaptchaVerifier) {
    return recaptchaVerifier;
  }

  recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    {
      size: "invisible",
      callback: function() {
        console.log("reCAPTCHA completed");
      },
      "expired-callback": function() {
        notify("reCAPTCHA yeroo isaa xumure. Irra deebi'i.");
      }
    }
  );

  return recaptchaVerifier;
}

async function requestOTP(phone) {
  if (!ensureFirebase()) return false;

  try {
    const verifier = getRecaptcha();

    await verifier.render();

    confirmationResult = await auth.signInWithPhoneNumber(
      phone,
      verifier
    );

    return true;

  } catch (error) {
    console.error("OTP error:", error);

    if (recaptchaVerifier) {
      try {
        recaptchaVerifier.clear();
      } catch (ignored) {}

      recaptchaVerifier = null;
    }

    notify(firebaseError(error));
    return false;
  }
}

/* 8. REGISTER */

async function sendRegistrationOTP(event) {
  event.preventDefault();

  if (!ensureFirebase()) return;

  const name = document.getElementById("regName").value.trim();
  const rawPhone = document.getElementById("regPhone").value;

  if (!name) {
    notify("Maqaa kee guuti.");
    return;
  }

  let phone;

  try {
    phone = normalizePhone(rawPhone);
  } catch (error) {
    notify(error.message);
    return;
  }

  const button = document.getElementById("sendRegOTP");
  button.disabled = true;

  const success = await requestOTP(phone);

  button.disabled = false;

  if (success) {
    otpMode = "register";

    document.getElementById("regOTPBox").classList.remove("hidden");

    notify("OTP ergameera. Bilbila kee ilaali.");
  }
}

async function verifyRegistrationOTP() {
  if (!confirmationResult || otpMode !== "register") {
    notify("Dura OTP gaafadhu.");
    return;
  }

  const name = document.getElementById("regName").value.trim();
  const rawPhone = document.getElementById("regPhone").value;
  const church = document.getElementById("regChurch").value;
  const message = document.getElementById("regMessage").value.trim();
  const code = document.getElementById("regOTP").value.trim();

  if (!name || !code) {
    notify("Maqaa fi koodii OTP guuti.");
    return;
  }

  try {
    const phone = normalizePhone(rawPhone);

    const result = await confirmationResult.confirm(code);
    const user = result.user;

    const ref = db.collection("registrations").doc(user.uid);
    const oldDoc = await ref.get();

    if (oldDoc.exists) {
      const oldData = oldDoc.data();

      if (oldData.status === "Approved") {
        notify("Galmeen kee duraan raggaasifameera.");
        await routeAuthenticatedUser(user);
        return;
      }

      if (oldData.status === "Pending") {
        notify("Galmeen kee duraan ergameera. Eeyyama Admin eeggadhu.");
        await routeAuthenticatedUser(user);
        return;
      }

      if (oldData.status === "Rejected") {
        notify("Galmeen kee duraan didameera. Waldaa kee qunnami.");
        return;
      }
    }

    await ref.set({
      uid: user.uid,
      name: name,
      phone: phone,
      church: church,
      message: message,
      role: "member",
      status: "Pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    currentUser = user;
    currentRegistration = {
      name: name,
      phone: phone,
      church: church,
      status: "Pending",
      role: "member"
    };

    document.getElementById("registerForm").reset();
    document.getElementById("regOTP").value = "";
    document.getElementById("regOTPBox").classList.add("hidden");

    confirmationResult = null;
    otpMode = "";

    notify("Galmeen kee ergameera. Eeyyama Admin eeggadhu.");
    show("pendingPage");

  } catch (error) {
    console.error("Registration error:", error);
    notify(firebaseError(error));
  }
}

/* 9. LOGIN */

async function sendLoginOTP() {
  if (!ensureFirebase()) return;

  let phone;

  try {
    phone = normalizePhone(
      document.getElementById("loginPhone").value
    );
  } catch (error) {
    notify(error.message);
    return;
  }

  const button = document.getElementById("sendLoginOTPBtn");
  button.disabled = true;

  const success = await requestOTP(phone);

  button.disabled = false;

  if (success) {
    otpMode = "login";

    document.getElementById("loginOTPBox").classList.remove("hidden");

    notify("OTP ergameera. Bilbila kee ilaali.");
  }
}

async function verifyLoginOTP() {
  if (!confirmationResult || otpMode !== "login") {
    notify("Dura OTP gaafadhu.");
    return;
  }

  const code = document.getElementById("loginOTP").value.trim();

  if (!code) {
    notify("Koodii OTP galchi.");
    return;
  }

  try {
    const result = await confirmationResult.confirm(code);

    confirmationResult = null;
    otpMode = "";

    document.getElementById("loginOTP").value = "";
    document.getElementById("loginOTPBox").classList.add("hidden");

    await routeAuthenticatedUser(result.user);

  } catch (error) {
    console.error("Login error:", error);
    notify(firebaseError(error));
  }
}

/* 10. CHECK ADMIN AND MEMBER STATUS */

async function routeAuthenticatedUser(user) {
  currentUser = user;

  try {
    const adminDoc = await db.collection("admins")
      .doc(user.uid)
      .get();

    if (adminDoc.exists && adminDoc.data().active === true) {
      show("adminPage");
      notify("Baga nagaan dhuftan, Admin.");
      return;
    }

    const registrationDoc = await db.collection("registrations")
      .doc(user.uid)
      .get();

    if (!registrationDoc.exists) {
      notify("Galmeen kee hin jiru. Akka miseensaatti galmaa'i.");
      show("register");
      return;
    }

    const data = registrationDoc.data();
    currentRegistration = data;

    if (data.status === "Approved" && data.role === "member") {
      document.getElementById("memberGreeting").textContent =
        "Baga nagaan dhuftan, " + (data.name || "Miseensa");

      document.getElementById("memberChurchText").textContent =
        "Waldaa: " + (data.church || "");

      document.getElementById("memberStatus").textContent = "Approved";

      show("memberHome");
      return;
    }

    if (data.status === "Pending") {
      show("pendingPage");
      notify("Eeyyama Admin eeggachaa jirta.");
      return;
    }

    if (data.status === "Rejected") {
      notify("Galmeen kee hin raggaane. Waldaa kee qunnami.");
      return;
    }

    notify("Haalli galmee kee sirrii miti. Admin qunnami.");

  } catch (error) {
    console.error("Account check error:", error);
    notify(firebaseError(error));
  }
}

/* 11. ADMIN REGISTRATION REVIEW */

async function loadRegistrations() {
  if (!currentUser || !ensureFirebase()) return;

  const box = document.getElementById("requestList");

  box.innerHTML =
    '<p class="muted">Galmeewwan fe’amaa jiru...</p>';

  try {
    const adminDoc = await db.collection("admins")
      .doc(currentUser.uid)
      .get();

    if (!adminDoc.exists || adminDoc.data().active !== true) {
      box.innerHTML =
        '<p class="muted">Hayyamni Admin hin jiru.</p>';

      notify("Fuula kana ilaaluuf mirga Admin barbaachisa.");
      show("welcome");
      return;
    }

    const snapshot = await db.collection("registrations")
      .orderBy("createdAt", "desc")
      .get();

    if (snapshot.empty) {
      box.innerHTML =
        '<p class="muted">Galmeen haaraan hin jiru.</p>';
      return;
    }

    box.innerHTML = snapshot.docs.map(function(doc) {
      const registration = doc.data();

      const statusClass =
        registration.status === "Approved" ? "approved" :
        registration.status === "Rejected" ? "rejected" : "";

      let controls = "";

      if (registration.status === "Pending") {
        controls =
          '<div class="actions">' +
            '<button class="btn good small" ' +
            'onclick="reviewRegistration(' +
            "'" + safe(doc.id) + "','Approved'" + ')">' +
            'Eeyyami</button>' +
            '<button class="btn bad small" ' +
            'onclick="reviewRegistration(' +
            "'" + safe(doc.id) + "','Rejected'" + ')">' +
            'Didi</button>' +
          '</div>';
      }

      return (
        '<div class="item">' +
          '<b>' + safe(registration.name || "") + '</b><br>' +
          '<small>' + safe(registration.phone || "") + '</small><br>' +
          '<small>' + safe(registration.church || "") + '</small><br>' +
          '<small>' +
            safe(registration.message || "Ergaa dabalataa hin qabu") +
          '</small>' +
          '<p><span class="status ' + statusClass + '">' +
            safe(registration.status || "Pending") +
          '</span></p>' +
          '<small>Gahee: Miseensa</small>' +
          controls +
        '</div>'
      );
    }).join("");

  } catch (error) {
    console.error("Load registrations error:", error);

    box.innerHTML =
      '<p class="muted">Galmee fe’uun hin milkoofne.</p>';

    notify(firebaseError(error));
  }
}

async function reviewRegistration(uid, status) {
  if (!currentUser) {
    notify("Dura seeni.");
    return;
  }

  if (status !== "Approved" && status !== "Rejected") {
    notify("Haalli galmee kun hin hayyamamu.");
    return;
  }

  try {
    const adminDoc = await db.collection("admins")
      .doc(currentUser.uid)
      .get();

    if (!adminDoc.exists || adminDoc.data().active !== true) {
      notify("Hayyamni Admin hin jiru.");
      return;
    }

    await db.collection("registrations")
      .doc(uid)
      .update({
        status: status,
        reviewedAt: firebase.firestore.FieldValue.serverTimestamp(),
        reviewedBy: currentUser.uid
      });

    notify(
      status === "Approved"
        ? "Galmeen miseensaa raggaasifame."
        : "Galmeen miseensaa didame."
    );

    await loadRegistrations();

  } catch (error) {
    console.error("Review error:", error);
    notify(firebaseError(error));
  }
}

/* 12. LOGOUT */

async function logout() {
  if (auth) {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  currentUser = null;
  currentRegistration = null;
  confirmationResult = null;
  otpMode = "";

  document.getElementById("loginOTP").value = "";
  document.getElementById("regOTP").value = "";

  document.getElementById("loginOTPBox").classList.add("hidden");
  document.getElementById("regOTPBox").classList.add("hidden");

  show("welcome");
  notify("Baateetta.");
}

/* 13. START APP */

(function init() {
  try {
    const savedLanguage = localStorage.getItem("wc_lang") || "om";

    document.getElementById("language").value = savedLanguage;
    changeLang(savedLanguage);

    if (localStorage.getItem("wc_dark") === "1") {
      document.body.classList.add("dark");
    }
  } catch (error) {
    console.error("App settings error:", error);
  }

  if (!firebaseReady) {
    console.error("Firebase SDK hin argamne.");
    return;
  }

  auth.onAuthStateChanged(function(user) {
    if (user) {
      currentUser = user;
      console.log("Firebase user session argame.");
    }
  });
})();
</script>

</body>
</html>
