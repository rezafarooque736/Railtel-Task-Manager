import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5000/';

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: 'AIzaSyASUalLfe3nc9UEvHM4dANjB5S1Z00Qvks',
  authDomain: 'taskmanager-fef2d.firebaseapp.com',
  projectId: 'taskmanager-fef2d',
  storageBucket: 'taskmanager-fef2d.appspot.com',
  messagingSenderId: '1088561910947',
  appId: '1:1088561910947:web:3c46a201a8d09fd8855b16',
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
