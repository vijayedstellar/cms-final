import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAd91hh9Aastoe92pYtcS30g9o8UXRjY2M",
  authDomain: "cms-final-debb1.firebaseapp.com",
  projectId: "cms-final-debb1",
  storageBucket: "cms-final-debb1.firebasestorage.app",
  messagingSenderId: "119705273792",
  appId: "1:119705273792:web:7ab9c309e530961520b425"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;