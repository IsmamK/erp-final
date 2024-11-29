// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration object from Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyC412-CpMOH5y1A0Q2aKnPHf6Mu2exCJjc",
  authDomain: "erp-push-notifications-501fc.firebaseapp.com",
  projectId: "erp-push-notifications-501fc",
  storageBucket: "erp-push-notifications-501fc.firebasestorage.app",
  messagingSenderId: "756173239511",
  appId: "1:756173239511:web:768c8ad677f2e0916e6c92",
  measurementId: "G-K7VGX865F9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token and send it to the backend
export const requestPermission = async (driverId) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BEDQF_ku1OCrgB_TKyccL5hgiEeS_9QSFq2i3lyVxrQMmcpKdk5A0H8lqMmAoElNFhyFju7Fu3XQa_OFdVAvZ2Q"
    });

    if (token) {
      console.log("FCM Token:", token);
      // Send the token to your backend server
      sendTokenToServer(driverId, token);
    } else {
      console.log("No registration token available");
    }
  } catch (err) {
    console.error("Error getting token", err);
  }
};

// Send the FCM token to the server
const sendTokenToServer = (driverId, token) => {
  fetch('http://localhost:8000/driver/set-fcm-token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      driver_id: driverId,  // Dynamic driver ID
      fcm_token: token
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('FCM token saved successfully:', data);
    })
    .catch(error => {
      console.error('Error saving token:', error);
    });
};

// Listen for incoming messages and show them as browser notifications
export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log('Message received: ', payload);
    new Notification(payload.notification.title, {
      body: payload.notification.body,
    });
  });
};
