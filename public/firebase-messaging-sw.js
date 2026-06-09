importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCu_nvgFZBDRX728rtwivbmssNj7GWAH7o",
  authDomain: "mrhd-13f93.firebaseapp.com",
  projectId: "mrhd-13f93",
  storageBucket: "mrhd-13f93.firebasestorage.app",
  messagingSenderId: "211962726807",
  appId: "1:211962726807:web:ee11f2272fe81e03295cd2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.notification.title || 'New Request';
  const notificationOptions = {
    body: payload.notification.body || 'You have a new request',
    icon: '/notification-icon.png',
    badge: '/notification-badge.png',
    tag: 'pantry-worker-notification',
    requireInteraction: true
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});