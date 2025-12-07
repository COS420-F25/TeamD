// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBK75si9ZFOL-Mz1UxLCEVWF3VAXPiIfbc",
  authDomain: "skillshow-9e279.firebaseapp.com",
  projectId: "skillshow-9e279",
  storageBucket: "skillshow-9e279.firebasestorage.app",
  messagingSenderId: "65206097309",
  appId: "1:65206097309:web:1118ad830dffd1fd7d0b74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
const db = getFirestore(app);

if (typeof window !== "undefined" && window.location.hostname === "localhost") {
  try {
    connectFirestoreEmulator(db, "localhost", 8080);
  } catch (error) {
    // Emulator might already be connected, ignore error
  }
}

export {app, db}
