# Waldaa Connect Firebase starter

This bundle includes the current single-file frontend, Firestore rules, and callable Functions for church application approval/rejection and member account provisioning.

## Important status
This is **not yet a fully production-complete app**: the frontend still has local-only implementations in prayer/song/community/finance/settings and needs those modules migrated to dedicated Firestore collections before real users rely on them. Do not accept real financial records until finance writes are server-validated and audit-logged. Do not deploy the rules until reviewed against your exact access needs.

## Deploy (trusted computer / Firebase CLI)
1. `npm install -g firebase-tools`
2. `firebase login`
3. `firebase use church-supper-app`
4. `cd functions && npm install && cd ..`
5. `firebase deploy --only functions,firestore:rules,hosting`

The Developer account must have the `developer: true` custom claim assigned by a trusted Admin SDK script. Never put service-account credentials in the browser or GitHub.
