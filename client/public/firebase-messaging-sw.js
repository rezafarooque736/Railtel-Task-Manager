importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js'
);

const firebaseConfig = {
  apiKey: 'AIzaSyASUalLfe3nc9UEvHM4dANjB5S1Z00Qvks',
  authDomain: 'taskmanager-fef2d.firebaseapp.com',
  projectId: 'taskmanager-fef2d',
  storageBucket: 'taskmanager-fef2d.appspot.com',
  messagingSenderId: '1088561910947',
  appId: '1:1088561910947:web:3c46a201a8d09fd8855b16',
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(payload => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: './logo192.jpg',
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});
