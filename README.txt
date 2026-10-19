WALDAA CONNECT GLOBAL — VERSION 3
=================================

WHAT CHANGED
------------
- Expanded whole-page language translation pass for static interface text (Afaan Oromoo, English, Amharic).
- Added the Firebase web configuration previously supplied for project church-supper-app.
- Added Firebase Email/Password sign-in using the actual Firebase Authentication account.
- Church application form creates an Authentication account, sends email verification, and writes a pending churchApplications document to Firestore.
- Developer console listens to pending Firestore church applications.
- Church approval/rejection and Pastor-created member accounts call trusted Cloud Functions.
- Member records and user profiles are created by the backend; a Pastor does not need Firebase Console.
- Added Firestore Security Rules, Cloud Functions, and a developer-claim setup example.
- Updated service-worker cache version so the browser should fetch the new release.

IMPORTANT: CONNECTED CODE IS NOT THE SAME AS DEPLOYED BACKEND
-----------------------------------------------------------
The app now contains the Firebase config and SDK calls, but this chat cannot deploy changes into your Firebase project. Before using real accounts, you must deploy the included Firestore rules and Cloud Functions to project church-supper-app. Until that is done, calls may return permission-denied or functions/not-found.

DEPLOYMENT ORDER
----------------
1. Download/extract the ZIP and put index.html, manifest.webmanifest, sw.js, icons, firebase.json, firestore.rules, and functions/ in the project root.
2. In Firebase Console > Authentication > Sign-in method, enable Email/Password.
3. In Firebase Console > Authentication > Settings > Authorized domains, add the exact GitHub Pages hostname for this app.
4. Deploy Firestore rules and Cloud Functions from a trusted computer with Firebase CLI installed:
     npm install -g firebase-tools
     firebase login
     cd <project-folder>
     cd functions && npm install && cd ..
     firebase deploy --project church-supper-app --only firestore:rules,functions
5. Cloud Functions deployment may require the Firebase project to be on the Blaze billing plan and a billing account. Check Firebase's current pricing before enabling it.
6. Create the first Developer account in Authentication, verify its email, then use a trusted Admin SDK environment to set the custom claim. Example (trusted computer only):
     cd functions
     npm install firebase-admin
     export GOOGLE_APPLICATION_CREDENTIALS=/secure/path/to/service-account.json
     node setDeveloperClaim.example.js FIREBASE_AUTH_UID
   Do NOT upload the service-account JSON to GitHub or place it in index.html. Sign out and back in after setting the claim.
7. Test registration with a separate email: submit a church application, click the verification email, sign in as the Developer, approve the application, then sign in as the Pastor and register a member.
8. Test Firestore Rules in the Firebase Emulator or Rules Playground before storing sensitive prayer or finance information.

GITHUB PAGES
-------------
Keep index.html at the repository root. GitHub Pages serves the frontend; Cloud Functions still run in Firebase. GitHub Pages does not deploy the functions/ directory as backend code.

NOTES
-----
- The Firebase web apiKey is a public project identifier; Security Rules and backend authorization protect data. Never expose service-account credentials.
- Developer access is based on a trusted Firebase custom claim, not a role dropdown.
- Real church approval and member creation require deployed Cloud Functions.
- Church applicants must verify their email before the Developer can approve them.
- Member registration creates a Firebase Auth user and returns a password-reset link. Share that link privately with the intended member.
- Cloudinary upload preset `Waldaa connect` must exist in unsigned mode for image upload to work. Only the cloud name and unsigned preset are in the frontend; never add the Cloudinary API Secret. Unsigned images can be accessible by URL, so do not upload sensitive/private photos unless access controls are configured.
- Device binding uses a browser-local random identifier and is only a deterrent: clearing browser storage can create a new identifier. It is not secure physical-device attestation. `resetMemberDeviceBinding` is Developer-only and is deployed with Cloud Functions.
- Some spiritual/community/finance demo modules still use browser-local demo state. They are not all synced to Firestore yet.
- Static interface strings have been translated broadly; a few long descriptive paragraphs and user-generated content may remain in their original language and need continued review.
- The full Bible text and a real AI model are not included in this version.
