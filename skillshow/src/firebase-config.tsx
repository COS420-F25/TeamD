// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
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

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

export function initFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getAuthInstance() {
  if (!authInstance) {
    initFirebase();
    authInstance = getAuth(app as FirebaseApp);
  }
  return authInstance;
}

export function getDbInstance() {
  if (!dbInstance) {
    initFirebase();
    dbInstance = getFirestore(app as FirebaseApp);
    // Only try to connect emulator in a browser-like environment
    if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
      try {
        connectFirestoreEmulator(dbInstance, "localhost", 8080);
      } catch (error) {
        // Emulator might already be connected, ignore error
        console.warn("Firestore emulator connection issue:", error);
      }
    }
  }
  return dbInstance;
}

// Backwards-compatible exports (lazy initialization)
export const auth = getAuthInstance();
export const db = getDbInstance();
export { app };
