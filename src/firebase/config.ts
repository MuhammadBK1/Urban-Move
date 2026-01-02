/**
 * =====================================================
 * FIREBASE CONFIGURATION
 * =====================================================
 * 
 * Initializes Firebase for web application.
 * Uses environment variables for security.
 * 
 * Firestore: Routes, Vehicles, Check-ins (structured data)
 * Realtime DB: Live locations (low latency)
 * =====================================================
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getDatabase, Database } from 'firebase/database';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://demo-default-rtdb.firebaseio.com',
};

// Firebase instances
let app: FirebaseApp;
let db: Firestore;
let rtdb: Database;

/**
 * Initialize Firebase (prevents re-initialization)
 */
export const initializeFirebase = (): { app: FirebaseApp; db: Firestore; rtdb: Database } => {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized');
  } else {
    app = getApps()[0];
  }
  
  db = getFirestore(app);
  rtdb = getDatabase(app);
  
  return { app, db, rtdb };
};

/**
 * Get Firestore instance
 */
export const getFirestoreDb = (): Firestore => {
  if (!db) initializeFirebase();
  return db;
};

/**
 * Get Realtime Database instance
 */
export const getRealtimeDb = (): Database => {
  if (!rtdb) initializeFirebase();
  return rtdb;
};

/**
 * Check if Firebase is configured (not using demo values)
 */
export const isFirebaseConfigured = (): boolean => {
  return import.meta.env.VITE_FIREBASE_API_KEY !== undefined &&
         import.meta.env.VITE_FIREBASE_API_KEY !== 'demo-api-key';
};

// Export instances
export { app, db, rtdb };

