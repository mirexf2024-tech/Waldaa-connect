/* Push notifications for Waldaa Connect chat (data-only messages; no duplicate notifications) */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js',
              'https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
  apiKey: 'AIzaSyByeCktDllnmYcjcuRpNMrRrcwnFqhLz7w',
  authDomain: 'mifu-b6c97.firebaseapp.com',
  projectId: 'mifu-b6c97',
  storageBucket: 'mifu-b6c97.firebasestorage.app',
  messagingSenderId: '6668754143',
  appId: '1:6668754143:web:4a2ecc0c1e0f6354cedd6a'
});
const messaging = firebase.messaging();
const APP_URL = new URL('./', self.location.href).href;
messaging.onBackgroundMessage(payload => {
  const d = payload.data || {};
  return self.registration.showNotification(d.title || 'Waldaa Connect', {
    body: d.body || '', icon: APP_URL + 'icon-192.png', badge: APP_URL + 'favicon-32.png',
    tag: d.chatId || 'waldaa-chat', data: d
  });
});
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    const open = list.find(c => c.url.startsWith(APP_URL));
    return open ? open.focus() : self.clients.openWindow(APP_URL);
  }));
});
