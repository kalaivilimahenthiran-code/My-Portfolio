"use client";

import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function assertConfig() {
  const missing = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => key);
  if (missing.length > 0) {
    console.error(
      "Firebase config missing in .env.local:",
      missing.join(", "),
      "\nUse NEXT_PUBLIC_FIREBASE_* variables (see .env.example)."
    );
  }
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

/** Client-only Auth — avoids SSR initialization errors */
export const auth = typeof window !== "undefined" ? getAuth(app) : null;

/** Client-only Firestore — avoids SSR "client is offline" errors */
function initFirestore() {
  if (typeof window === "undefined") return null;
  assertConfig();
  try {
    return initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch {
    return getFirestore(app);
  }
}

export const db = initFirestore();
export const storage = typeof window !== "undefined" ? getStorage(app) : null;
export default app;
