# Waldaa Connect Global v6 — Firestore plan

## Core collections

- `users/{uid}` — server-managed account profile, role, status, churchId and optional device binding.
- `churchApplications/{applicationId}` — church applications created by authenticated applicants; moderated by Developer Cloud Functions.
- `churches/{churchId}` — approved church record, logo URL and settings; created/managed by trusted functions.
- `churches/{churchId}/members/{uid}` — membership and role within a specific church.
- `churches/{churchId}/announcements/{itemId}` — approved church announcements and events.
- `churches/{churchId}/prayers/{itemId}` — prayer requests with ownerUid and visibility; private prayers require strict query and rule design.
- `churches/{churchId}/choir/{itemId}` — choir songs, lyrics with rights clearance, groups and schedules.
- `churches/{churchId}/finance/{recordId}` — financial ledger records; server-enforced permissions and audit trail required.
- `auditLogs/{logId}` — server-only security and administrative audit events.

## Security principles

1. Never trust a role submitted from the browser. Use Firebase custom claims and/or server-managed `users/{uid}` and church membership records.
2. Church data must be tenant-isolated by `churchId`; do not allow one church's users to query another church's private data.
3. Developer moderation and member creation must use trusted Cloud Functions and Admin SDK.
4. Financial verification must not rely on a client-submitted transaction ID alone. Verify through an official provider integration/webhook or a trusted finance review workflow.
5. Private prayer requests and personal notes must be readable only by the owner and specifically authorized people.
6. Keep private API secrets and service-account keys out of the frontend and GitHub.
7. Test rules using Firebase Emulator/Rules Playground before real user data is stored.

## Current integration status

- Church application submit, Developer approval/rejection, Pastor member creation and first-browser device binding have Cloud Function code included; they require deployment and end-to-end testing.
- Prayer, choir, community, finance and notifications are intentionally not presented as saved real data in v6 until their full server integration is implemented.
- Bible reader preferences/bookmarks/reading progress/notes currently remain local to the browser; full Bible text and cloud sync are not included.
