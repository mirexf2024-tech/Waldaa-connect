WALDAA CONNECT GLOBAL — VERSION 8 (AUTH / CHURCH REGISTRATION FIX)
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


V8 LOGIN AND CHURCH REGISTRATION FIX
------------------------------------
- Prevents the Firebase auth-state observer from racing with church-account creation.
- When the email already exists, the registration form attempts sign-in with the supplied email/password instead of failing immediately. It checks for an existing pending application before creating a duplicate.
- Uses the authenticated Firebase user's email in the Firestore application document so it matches the email claim checked by the supplied Rules.
- A missing users/{uid} profile now returns the user to the welcome screen with an explicit message instead of leaving the app apparently loading. A church applicant must wait for approval; the approval backend creates the users profile.
- If the optional registerCurrentDevice callable is not deployed/unavailable, login can continue but device binding is not active; deploy Functions before treating device binding as enabled. Other device-binding errors still block login.

IMPORTANT: This frontend patch does not deploy Firebase services. If churchApplications writes fail, deploy the supplied firestore.rules. Church approval and member registration require the supplied Cloud Functions to be deployed; Functions deployment may require Blaze billing. The existing Firestore admins collection does not grant Developer access by itself: the intended Developer Firebase Auth UID must have the custom claim { developer: true } set through a trusted Firebase Admin SDK environment. Never set privileged roles directly from browser code and never upload service-account keys to GitHub.
