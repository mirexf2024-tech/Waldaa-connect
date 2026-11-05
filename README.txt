WALDAA CONNECT GLOBAL — VERSION 4 (fixed package)
=================================================

FOLDER STRUCTURE (upload exactly like this to the GitHub repo root)
  index.html, sw.js, manifest.webmanifest, firebase.json, firestore.rules
  icon-192.png, icon-512.png, icon-maskable-192.png, icon-maskable-512.png,
  apple-touch-icon.png, favicon-32.png
  functions/index.js, functions/package.json
  tools/setDeveloperClaim.js          (run in Cloud Shell only; never needed by the website)
  .github/workflows/firebase-deploy.yml

WHAT WAS FIXED
  1. firebase.json / functions/ / tools/ placed with the correct names and paths.
  2. App icons added (192, 512, maskable, Apple touch, favicon); manifest and index.html link to them.
  3. sw.js v4: one missing file no longer breaks installation; Firebase SDK is cached for offline start.
  4. firestore.rules:
     - churches are no longer publicly readable (Developer + active members only)
     - finance ledger is append-only and validated (no update/delete, even by Pastor)
     - paymentRefs added: members submit references, only Finance verifies/rejects
     - members can delete their own prayer requests
  5. index.html: icon links and brand theme color; "demo" removed from the description.

STILL NOT DONE (be honest before going to production)
  - Prayer, choir, announcements, finance, reading progress, saved verses and notes still use
    browser localStorage in index.html. They must be migrated to Firestore module by module.
  - Full Bible text, Cloudinary uploads, push notifications and App Check are not included yet.

DEPLOY WITHOUT A LOCAL TERMINAL
  A) Firebase Console: upgrade project mifu-b6c97 to the Blaze plan (needed for Functions).
  B) Enable Authentication > Sign-in method > Email/Password.
     Add your GitHub Pages domain under Authentication > Settings > Authorized domains.
  C) Google Cloud Console > IAM > Service Accounts: create a key (JSON) with the roles
     Firebase Admin and Cloud Functions Admin. In GitHub: Settings > Secrets > Actions >
     New secret named FIREBASE_SERVICE_ACCOUNT, paste the whole JSON. Never commit this file.
  D) Commit this package to the repo. The workflow deploys rules + functions on every push to main
     (or run it manually from the Actions tab).
  E) GitHub Pages: Settings > Pages > Branch main / root.
  F) First Developer account: register in the app, verify the email, copy the UID from
     Firebase Console > Authentication. Open https://shell.cloud.google.com, then run:
        git clone <your-repo-url> && cd <repo>/functions && npm install firebase-admin
        node ../tools/setDeveloperClaim.js THE_UID
     Sign out and sign in again.
  G) Test with a second email: church application > verify email > Developer approves >
     Pastor adds a member. Test the rules in the Rules Playground before real finance data.


=====================================================================
VERSION 6 (project mifu-b6c97) — CHAT (Telegram-style) : NEW FILES
=====================================================================
  chat.js, chat.css, firebase-messaging-sw.js, firestore.indexes.json,
  functions/chat.js, functions/upload.js, functions/common.js, functions/.env
  Changed: sw.js (v5), firestore.rules (chats, messages, chatReads), firebase.json, index.html
  (only 2 tags added: chat.css in <head>, chat.js before </body>), functions/index.js (1 line at the end),
  .github/workflows/firebase-deploy.yml (also deploys indexes).

FEATURES
  Direct chats, groups, channels (only Pastor/Secretary post), replies, delete own message,
  photos, files, voice notes (Cloudinary), unread dot + badge, search (chat list + inside a chat),
  push notifications (FCM), 3 languages (follows the app language), dark/light.
  Offline: opened chats load from the cache; messages written offline are sent when online again.

SETUP (once)
  1. Cloudinary: copy Cloud name + API key into functions/.env (replace the YOUR_ placeholders).
     Store the API Secret ONLY as a secret. In Cloud Shell (https://shell.cloud.google.com):
        firebase login --no-localhost        (then follow the link)
        firebase functions:secrets:set CLOUDINARY_API_SECRET --project mifu-b6c97
     Service account of the GitHub workflow also needs roles: Secret Manager Admin,
     Service Account User, Cloud Datastore Index Admin (or simply "Editor" while testing).
  2. Push: Firebase Console > Project settings > Cloud Messaging > Web Push certificates >
     Generate key pair. Paste the public key into chat.js (CFG.VAPID_KEY).
  3. Commit everything. The workflow deploys rules, indexes and functions.
     The first deploy of a Firestore-trigger function can fail once while Google enables
     Eventarc/Pub/Sub: wait 3-5 minutes and re-run the workflow.
  4. Test with 2 accounts: Pastor creates a channel + a group; member sends text, photo, voice;
     check that a member can NOT write in a channel, and can NOT read another church's chats.
     Run the rules in the Firebase Emulator / Rules Playground before real use.

NOT INCLUDED (honest): voice/video calls, end-to-end encryption, message editing, forwarding,
  read receipts per message, member removal from groups. Old tokens are cleaned on failed push.
