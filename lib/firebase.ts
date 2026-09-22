import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ============================================================
 *  PASTE YOUR FIREBASE CONFIG HERE
 * ============================================================
 *
 * 1. Go to https://console.firebase.google.com
 * 2. Create a project (or open existing)
 * 3. Click the Web icon (</>) to add a web app
 * 4. Copy the firebaseConfig object and paste the values below
 * 5. Enable Authentication → Email/Password
 * 6. Create Firestore database
 * 7. Enable Storage
 *
 * Full guide: FIREBASE_SETUP.md
 * ============================================================
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Don't edit below this line unless you know what you're doing
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
