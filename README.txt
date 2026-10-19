WALDAA CONNECT GLOBAL — VERSION 6 (NO-DEMO DATA BASELINE)
========================================================

WHAT VERSION 6 CHANGES
----------------------
- Removed seeded/example church, member, prayer, choir, community, finance, and notification records.
- Removed the demo login and role dropdown. Users must sign in with Firebase Authentication; role is read from trusted Firebase claims/profile.
- Local storage is limited to personal reader progress/bookmarks/notes and interface preferences. It is not used as a fake backend for church data.
- Removed fake local success for finance, church approval, prayer submissions, choir submissions, and community posts. Modules that are not connected to a trusted backend are explicitly unavailable/Coming Soon rather than pretending to save real data.
- Kept the Bible reader layouts (book-like and modern), book/chapter navigation, font sizing, bookmarks, reading progress, and personal notes.
- Removed placeholder paragraphs pretending to be Scripture. The full Bible translation is NOT bundled; connect a licensed/public-domain translation before displaying real text or promising full offline reading.
- Kept image compression and Cloudinary unsigned upload support for church logo/profile-image use. Unsigned assets may be public by URL; do not upload sensitive/private images without configuring appropriate access controls.
- Updated service-worker cache to v6.

IMPORTANT STATUS
----------------
This is a cleaned frontend/backend starter, NOT a fully production-ready deployed system. Some modules intentionally show Coming Soon until their real Firestore/server integration is implemented and tested. Do not enter real financial or private prayer data until security rules and backend are deployed and verified.

FIREBASE SETUP REQUIRED
-----------------------
1. In Firebase Console for project church-supper-app, enable Authentication > Email/Password.
2. Add the exact GitHub Pages hostname to Authentication > Settings > Authorized domains.
3. Deploy Firestore Rules and Cloud Functions from a trusted computer with Firebase CLI:
     npm install -g firebase-tools
     firebase login
     cd <project-folder>
     cd functions && npm install && cd ..
     firebase deploy --project church-supper-app --only firestore:rules,functions
4. Cloud Functions may require the Blaze billing plan. Check current Firebase pricing before upgrading. If you choose not to upgrade, backend-dependent functions must remain unavailable; do not bypass server authorization.
5. Create the first Developer account in Firebase Authentication, verify its email, then set the custom claim using a trusted Admin SDK environment. Example:
     cd functions
     npm install firebase-admin
     export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/to/service-account.json
     node setDeveloperClaim.example.js FIREBASE_AUTH_UID
   NEVER upload service-account JSON to GitHub or place it in index.html. Sign out and back in after the claim is set.
6. Test in a separate test account and Firebase Emulator/Rules Playground before using real member information.

GITHUB PAGES
------------
Keep index.html at the repository root. Keep firebase.json, firestore.rules, manifest.webmanifest, sw.js, icons and docs at the root. Keep the backend files inside functions/:
  functions/index.js
  functions/package.json
  functions/setDeveloperClaim.example.js
GitHub Pages hosts only the frontend. It does not deploy Cloud Functions.

CLOUDINARY
----------
- Cloud name: zkyyos4t
- Upload preset expected by frontend: Waldaa connect (Unsigned)
- Images are compressed in the browser toward 500 KB before upload.
- Do not expose the Cloudinary API Secret. Never commit secrets or service-account credentials.
- Unsigned upload presets are visible in client code and can be abused if unrestricted; restrict allowed formats/size/folder where supported, monitor usage, and treat uploaded images as public unless access controls prove otherwise.

DEVICE BINDING
--------------
Cloud Function registerCurrentDevice adds a browser-local device identifier check. This is a deterrent, not cryptographic proof of a physical phone; clearing browser storage can change the identifier. Keep verified email, Firebase authorization, security rules and a recovery process. Do not describe this as perfect device lock.

KNOWN ITEMS THAT STILL REQUIRE REAL INTEGRATION
-----------------------------------------------
- Full licensed Bible text and verified offline Bible package.
- Firestore-backed prayer requests, choir songs/schedules, community posts/comments and announcements.
- Finance ledger with server-enforced permissions, immutable audit trail, expenses/reporting, and actual payment provider verification/webhooks.
- Global approved-church directory query and data sync for each module.
- Real AI service through a protected server-side endpoint; never put a private AI key in frontend code.
- Push notifications, backups/retention, abuse moderation, privacy policy, accessibility review and production testing.

Do not remove these warnings until the corresponding service is implemented and tested. A clean UI is not proof of a deployed backend.
