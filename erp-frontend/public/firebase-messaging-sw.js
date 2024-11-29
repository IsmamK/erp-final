// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyC412-CpMOH5y1A0Q2aKnPHf6Mu2exCJjc",
  authDomain: "erp-push-notifications-501fc.firebaseapp.com",
  projectId: "erp-push-notifications-501fc",
  storageBucket: "erp-push-notifications-501fc.firebasestorage.app",
  messagingSenderId: "756173239511",
  appId: "1:756173239511:web:768c8ad677f2e0916e6c92",
  measurementId: "G-K7VGX865F9",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
