 // Run only from a trusted computer with Firebase Admin credentials.
// Usage: node setDeveloperClaim.example.js FIREBASE_AUTH_UID

const { initializeApp, applicationDefault } =
  require('firebase-admin/app');

const { getAuth } = require('firebase-admin/auth');

initializeApp({
  credential: applicationDefault(),
  projectId: 'church-supper-app'
});

async function setDeveloperClaim() {
  const uid = process.argv[2];

  if (!uid) {
    throw new Error(
      'Pass the intended developer Firebase Auth UID.'
    );
  }

  const auth = getAuth();

  // Preserve existing custom claims.
  const user = await auth.getUser(uid);
  const existingClaims = user.customClaims || {};

  await auth.setCustomUserClaims(uid, {
    ...existingClaims,
    developer: true
  });

  console.log(
    'Developer claim set successfully. Sign out and sign in again.'
  );
}

setDeveloperClaim().catch((error) => {
  console.error('Failed to set Developer claim:', error.message);
  process.exitCode = 1;
});
