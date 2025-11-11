// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBYuHvbSjgwL8v4QgGh3zdWZe9R5VMYUkI",
  authDomain: "trustnet-55f6f.firebaseapp.com",
  projectId: "trustnet-55f6f",
  storageBucket: "trustnet-55f6f.firebasestorage.app",
  messagingSenderId: "141592005361",
  appId: "1:141592005361:web:ffa104d8ab23cd94ff3750",
  measurementId: "G-XTDKCYE5VR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
