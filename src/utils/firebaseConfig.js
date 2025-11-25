// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD__VtHRqF6mYfPxpbwteUoKaDaouac9d0",
  authDomain: "app-720c6.firebaseapp.com",
  projectId: "app-720c6",
  storageBucket: "app-720c6.firebasestorage.app",
  messagingSenderId: "438537448253",
  appId: "1:438537448253:web:b335cf1b90c6ba70797354",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
