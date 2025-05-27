// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDCjSr0Wdr4X2rK0c-_G9XrFEHZYWOySrM",
  authDomain: "foodie-8cff7.firebaseapp.com",
  projectId: "foodie-8cff7",
  storageBucket: "foodie-8cff7.firebasestorage.app",
  messagingSenderId: "1059748661323",
  appId: "1:1059748661323:web:285b4d5afe5fc74fb2e5ce"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth, db , storage };