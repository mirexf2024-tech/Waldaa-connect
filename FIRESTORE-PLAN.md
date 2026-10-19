WALDAA CONNECT GLOBAL — FIRESTORE AND SECURITY NOTES
===================================================

Project configured in index.html: church-supper-app

Implemented frontend/backend paths
----------------------------------
- Firebase Authentication Email/Password sign-in.
- `churchApplications/{applicationId}`: signed-in applicant creates a pending request; applicant can read their own request; client cannot approve/edit/delete it.
- `churches/{churchId}`: created by `approveChurchApplication` Cloud Function after Developer custom-claim authorization and applicant email verification.
- `users/{uid}`: server-created account profile with `role`, `churchId`, and `status`.
- `churches/{churchId}/members/{uid}`: server-created membership with role and status.
- `auditLogs/{logId}`: server-only records for church approvals/rejections and member creation.
- `createChurchMember`: verifies Pastor role and approved church, prevents assignment of Developer/Pastor role, creates Firebase Auth account and Firestore records, stores an optional Cloudinary photo URL, and returns a password-reset link.
- Church applications may include an optional Cloudinary `logoUrl`; approval copies a validated URL to the church record.
- `registerCurrentDevice`: first-device binding using a random browser-local identifier hashed server-side; another identifier is blocked until Developer runs `resetMemberDeviceBinding`. This is a deterrent, not proof of physical-device identity; clearing browser storage can bypass local identifiers, so do not treat it as high-assurance device attestation.
- Cloudinary upload uses unsigned preset `Waldaa connect` and compresses selected images to approximately 500 KB before upload. Unsigned uploaded images may be publicly accessible by URL; do not upload private/sensitive images unless Cloudinary access controls are configured appropriately.

Deploy `firestore.rules` and `functions/` before testing real Firebase operations. Existing restrictive Firestore rules (for example, deny-all) will block the app until updated. Firebase Functions are deployed separately from GitHub Pages and may require Blaze billing.

Security boundaries
-------------------
- The web config is public by design; never put a service-account key in frontend code.
- Only a trusted Admin SDK sets the `developer: true` custom claim.
- Only Cloud Functions approve/reject church applications or create user profiles/memberships.
- User roles and churchId are never accepted as authoritative from a browser request.
- Device binding is an additional account-sharing barrier only, not a replacement for verified email, Firebase Auth, App Check, Security Rules, or recovery procedures.
- Finance/prayer rules use least privilege; test them using the Firebase Emulator before production.

Not fully migrated yet
----------------------
Prayer, choir, announcements, giving/finance, reading progress, saved verses, notes, and some dashboard activity still have demo/localStorage paths. Their Firestore repositories and full CRUD/security workflows are follow-up work; do not treat them as live synced features yet.
