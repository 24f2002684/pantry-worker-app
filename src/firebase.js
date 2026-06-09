import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCu_nvgFZBDRX728rtwivbmssNj7GWAH7o",
  authDomain: "mrhd-13f93.firebaseapp.com",
  projectId: "mrhd-13f93",
  storageBucket: "mrhd-13f93.firebasestorage.app",
  messagingSenderId: "211962726807",
  appId: "1:211962726807:web:ee11f2272fe81e03295cd2",
  measurementId: "G-4YX3JSGSFB"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: 'BAwRRh9iPIgBuMStHCH8tQmtIzhcKCjbvGNKy6fvprD9Hs7hxWIJKj5wn_IgPRVyKF8i3CklraF39m0aqleR8to'
      });
      console.log('FCM Token:', token);
      return token;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const listenForMessages = (callback) => {
  onMessage(messaging, (payload) => {
    console.log('Message received:', payload);
    callback(payload);
  });
};