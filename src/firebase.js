//src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCaxGPhbKfQUGkPKkzBu0NknYWj2ttjhv4',
//   authDomain: 'dialogit-app.firebaseapp.com',
//   projectId: 'dialogit-app',
//   storageBucket: 'dialogit-app.firebasestorage.app',
//   messagingSenderId: '1050056584281',
//   appId: '1:1050056584281:web:2876d065c75fe4618b5548',
// };

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut };
