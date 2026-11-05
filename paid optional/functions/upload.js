const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const crypto = require('node:crypto');
const { activeUser } = require('./common');
const CLOUDINARY_API_SECRET = defineSecret('CLOUDINARY_API_SECRET');
const TYPES = { image: 'image', audio: 'video', file: 'raw' }; // Cloudinary stores audio under "video"

exports.cloudinarySignature = onCall({ region: 'us-central1', enforceAppCheck: false, secrets: [CLOUDINARY_API_SECRET] }, async (request) => {
  const u = await activeUser(request);
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME, apiKey = process.env.CLOUDINARY_API_KEY;
  if (!cloudName || !apiKey || cloudName.startsWith('YOUR_')) throw new HttpsError('failed-precondition', 'Cloudinary is not configured.');
  const resourceType = TYPES[request.data?.kind];
  if (!resourceType) throw new HttpsError('invalid-argument', 'Invalid upload kind.');
  const folder = `waldaa/${u.churchId}/chat`;
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = crypto.createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET.value()}`).digest('hex');
  return { cloudName, apiKey, timestamp, folder, signature, resourceType };
});
