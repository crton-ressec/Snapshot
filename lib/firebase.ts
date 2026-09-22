import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * ============================================================
 *  🔥 PASTE YOUR FIREBASE CONFIG BELOW
 * ============================================================
 *
 * HOW TO GET THESE VALUES:
 * 1. Go to https://console.firebase.google.com
 * 2. Create a new project (or open one)
 * 3. Click the Web icon </>  → Register app
 * 4. Copy the config object and replace the values below
 * 5. In Firebase Console also do:
 *    - Authentication → Sign-in method → Enable Email/Password
 *    - Firestore Database → Create database
 *    - Storage → Get started
 *
 * Full step-by-step: see FIREBASE_SETUP.md
 * ============================================================
 */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",                    // e.g. "AIzaSyC..."
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",              // e.g. "snapshot-12345"
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",       // e.g. "123456789012"
  appId: "YOUR_APP_ID",                      // e.g. "1:123456789012:web:abcdef"
};

// ========== DO NOT EDIT BELOW THIS LINE ==========

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
