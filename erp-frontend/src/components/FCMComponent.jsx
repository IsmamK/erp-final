import React, { useState, useEffect } from 'react';
import { getMessaging, getToken } from 'firebase/messaging';
import { initializeApp } from 'firebase/app';

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC412-CpMOH5y1A0Q2aKnPHf6Mu2exCJjc",
  authDomain: "erp-push-notifications-501fc.firebaseapp.com",
  projectId: "erp-push-notifications-501fc",
  storageBucket: "erp-push-notifications-501fc.firebasestorage.app",
  messagingSenderId: "756173239511",
  appId: "1:756173239511:web:768c8ad677f2e0916e6c92",
  measurementId: "G-K7VGX865F9",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const FCMComponent = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    // Request permission to send notifications
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        
        // Get FCM Token
        getToken(messaging, {
          vapidKey: 'BEDQF_ku1OCrgB_TKyccL5hgiEeS_9QSFq2i3lyVxrQMmcpKdk5A0H8lqMmAoElNFhyFju7Fu3XQa_OFdVAvZ2Q', // Use your VAPID Key here
        }).then((token) => {
          if (token) {
            console.log('FCM Token:', token);
            setFcmToken(token);
          } else {
            console.error('No token available.');
          }
        }).catch((err) => {
          console.error('Error getting FCM token:', err);
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>FCM Token Here</h1>
      {fcmToken ? <p>Your FCM Token: {fcmToken}</p> : <p>Waiting for FCM Token...</p>}
    </div>
  );
};

export default FCMComponent;
