WALDAA CONNECT GLOBAL — VERSION 10 (FREE PLAN: no Blaze, no Cloud Functions, no credit card)
Firebase project: mifu-b6c97   |   Hosting: GitHub Pages (free)

FOLDERS
  (root)  index.html, live-data.js, customize.js, bible-import.js, bible-reader.js, modules.js, customize.js, sw.js, manifest.webmanifest, icons, chat.js, chat.css, free-backend.js,
          firestore.rules, firestore.indexes.json, firebase.json, .firebaserc, .github/workflows
  paid-optional/  the old Cloud Functions + push notification files. NOT used. Keep only for a future paid plan.

HOW IT WORKS WITHOUT A SERVER
  * Firestore Security Rules are the only authority (they run on Google's side, free).
  * Church approval: Developer clicks Approve -> church document is created. The applicant verifies the e-mail,
    signs in, and the app creates their pastor profile (rules check the approved application).
  * Members: Pastor "invites" an e-mail + role. The person taps "Account uumi" (button on the login page) with THAT e-mail,
    verifies it, signs in, and joins the church. (Pastor can no longer create passwords for people.)
  * Developer: a document developers/<UID> created by you in Firebase Console (no terminal).
  * Chat: all in the browser (chats, groups, channels, replies, delete, photos, files, voice, search, unread).
  * Photos/files/voice: Cloudinary UNSIGNED upload preset (free, no secret).

SETUP — everything in the browser (about 20 minutes)
 1. GitHub: upload all files to the repo root (replace old ones). Settings > Pages > Branch main / root > Save.
 2. Firebase Console > project mifu-b6c97 (stay on the free Spark plan):
    a) Authentication > Get started > Sign-in method > Email/Password > Enable.
    b) Authentication > Settings > Authorized domains > add  YOURNAME.github.io
    c) Firestore Database > Create database > production mode > choose a location (cannot change later).
    d) Firestore > Rules tab > delete everything > paste firestore.rules > Publish.
    e) Firestore > Indexes > Composite > Add index: collection ID  chats ; fields  members = Arrays ,
       lastAt = Descending ; query scope Collection > Create. (Wait until status = Enabled.)
 3. Developer account:
    a) Authentication > Users > Add user: your e-mail + password. Copy its "User UID".
    b) Firestore > Start collection > Collection ID: developers > Document ID: paste the UID >
       add a field  enabled (boolean) = true > Save.
    c) Open the app and sign in with that account: you see the Developer console.
 4. Cloudinary (free): Settings > Upload > Upload presets > Add: Signing mode = UNSIGNED, set a folder,
    max file size 10 MB, allowed formats (jpg, png, webp, pdf, webm, m4a, mp3, mp4).
    Put your Cloud name and the preset name in chat.js:  CFG.CLOUD_NAME  and  CFG.UPLOAD_PRESET.
 5. Test with two e-mails:
    church application (verify e-mail) -> Developer Approve -> applicant signs in (becomes Pastor)
    -> Pastor invites member e-mail -> member taps "Account uumi", verifies, signs in -> chat each other.
    Also try to read another church's data and to post in a channel as a member: both must fail.

OPTIONAL: auto-deploy rules from GitHub (free): create a service account key (Google Cloud > IAM > Service Accounts,
  role "Firebase Rules Admin"), save the JSON as GitHub secret FIREBASE_SERVICE_ACCOUNT. Otherwise skip it.

FREE-PLAN LIMITS (Spark, as far as I know): 50,000 reads and 20,000 writes per day, 1 GB stored.
  Chat listeners count reads: fine for small/medium churches; watch the usage tab in Firebase Console.

WHAT YOU LOSE ON THE FREE PLAN (honest)
  * No push notifications when the app is closed (needs a server). Unread dots/badges work while the app is open.
  * No server-side audit of pastor actions; only Developer approvals are logged (auditLogs).
  * Cloudinary unsigned presets can be abused by anyone who learns the preset name: restrict it (size, formats, folder)
    and watch your Cloudinary usage.
  * Chat sender names are written by the clients (cosmetic spoofing possible); message ownership is enforced by rules.
  * Bible TEXT is added by the Developer from PDF (see VERSION 9). Until then the reader says it is not added yet.
  * The AI assistant (canned answers) was REMOVED. A real one needs a server/API.
  * Reading progress, saved verses and private notes are personal and stay on the device of each signed-in user.
  * Members cannot yet submit payment references from the UI (rules + data are ready; only pastor/finance record entries).
  * Likes and comments on announcements were removed (they need extra collections); announcements are posted by pastor/secretary.
  * The rules were written carefully but NOT run in an emulator here. Test them in Rules Playground first.


VERSION 8 — ALL DEMO DATA REMOVED
  Demo login, demo churches/members/prayers/songs/posts/donations, role switcher and "reset demo" are gone.
  Everything now comes from Firestore (live-data.js) and is protected by firestore.rules:
    prayers, choir songs, announcements, finance ledger (append-only), payment references (pending -> verified by
    pastor/finance, which appends the ledger entry), member directory/count, roles (pastor can change roles),
    notifications and home activity (derived from real announcements/prayers).
  A new account starts completely EMPTY. Add real data through the app.
  Rules changed in v8 (re-publish firestore.rules in Firebase Console!): any member can create prayer requests,
  pastor/finance can verify payment references, pastor can change member roles (not pastor/developer).
  Old browser demo data (key wcg_demo_v1) is deleted automatically on first load.


VERSION 9 — DEVELOPER CUSTOMIZATION
  Developer Console > "Customize app" lets the Developer change, for ALL users at once (live):
    * app name + subtitle, 3 brand colours (defaults are your brand: Navy #001A3A, Blue #003B82, Gold #FCD116)
    * text/page size (80%-140%), card roundness, sidebar width  (make things smaller or bigger)
    * which pages each role can see (can only hide pages the role already had; Home/Profile/Settings stay)
    * home page: verse of the day, welcome message, show/hide the 4 home cards
    * rename menu labels per language (Afaan Oromoo / English / Amharic)
    * "Durtii deebisi" returns everything to the defaults.
  Stored in Firestore document appConfig/main: everyone can READ it, only the Developer can WRITE it (rules).
  Hiding a page only hides it in the menu/app. Data security is still enforced by firestore.rules, not by hiding.
  Re-publish firestore.rules after updating (new appConfig block).
  NOT included: drag-and-drop layout, adding brand-new pages/widgets, changing the logo image.


VERSION 9 — DEVELOPER CUSTOMIZE + BIBLE FROM PDF  (re-publish firestore.rules!)
  Developer Console now has two cards:
  1) Customize app  (data: appConfig/main, public read, only Developer writes)
     app name + subtitle, home greeting, home verse + reference, main/gold colors, page size 85-125%,
     corner radius, density (compact/normal/comfortable), which pages each role can see (table),
     and page names per language (Afaan Oromoo / Amharic / English). "Reset" returns to the defaults.
     Home, Profile and Settings always stay visible; Developer always sees everything.
  2) Macaafa Qulqulluu — PDF  (data: bibleVersions/{id}/chapters/{book}_{chapter})
     a) create a Version (name + language + tick "I have the right to publish this text"), or pick an existing one
     b) choose the Book (66), choose the PDF, optional page range, press "Barruu baasi" (text is extracted in the browser)
     c) edit the text if needed, press "Boqonnaa boqonnaan hiri": chapters are detected from headings
        ("Boqonnaa 1 / Chapter 1 / ምዕራፍ 1" or lone numbers) and verses from verse numbers 1,2,3...
        Fill "Boqonnaa tokko qofa" to import ONE chapter only (chapter-by-chapter).
     d) open each chapter in the preview to correct it, then "Kuusi (Firestore)".
     Readers choose the version at the top of the Bible page; the language follows the app language.
  LIMITS (honest): scanned (image) PDFs have no text; old Amharic fonts can come out garbled: paste clean text instead.
     Verse splitting is automatic: always check the preview. pdf.js is loaded from cdnjs when you press the button.
     Free plan: each chapter is 1 write; a whole Bible is ~1,189 writes (daily free limit 20,000).


VERSION 10 — NEW MODULES  (re-publish firestore.rules! no new index needed)
  Sidebar > CHURCH now has: Calendar, Giving, Families, Sunday School, Pastoral care  (file: modules.js)
  * Calendar (events/): month grid + upcoming list. Pastor/Secretary create events (service, youth, choir, women, men, other);
    Choir leaders can create choir events. Everyone in the church can read.
  * Giving: church accounts (Pastor edits: settings/giving) + "Developer support" accounts (Developer edits in Developer Console:
    supportInfo/giving). Bank and Telebirr numbers have a COPY button. Payments are NOT processed in the app.
  * Families (people/): Pastor/Secretary only (private). Groups by family, servant/volunteer + ministry, newcomers/visitors with
    follow-up status (new, contacted, visited, joined), next follow-up date and an overdue warning.
  * Sunday School / Bible study (classes/): Pastor/Secretary create classes, add students, take attendance per date, see history and
    attendance rate. Other roles see only the class schedule (no student names).
  * Pastoral care (care/): any member sends a PRIVATE request (topic, details, preferred date). Only the Pastor sees all requests
    and schedules an appointment/replies; the member sees status and the Pastor's reply, and can cancel.
  * Ads (ads/) = extra income: Developer Console > "Ads". Developer adds sponsor banners (title, text, https link) shown on Home.
    No ad network is connected: you sell/arrange sponsors yourself. Pause or delete any time.
  * Bible reader: tapping "Bible" opens a full-screen reader (bible-reader.js).
  * Church registration fix: e-mail is saved in lower case (the phone keyboard capitalised the first letter and the rules rejected it),
    an existing account is signed in instead of failing, duplicate pending applications are detected, and a clear success window is shown.
    If it still fails, send me the exact red message you see.
  Limits (honest): giving is information only; no push/e-mail reminders for appointments or follow-ups (needs a paid server);
    Families data is private but typed by hand (not linked to login accounts); not tested in the Firebase emulator, test with 2-3 accounts.
