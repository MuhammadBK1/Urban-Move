/// <reference types="vite/client" />

/**
 * Environment variable type declarations
 * Provides TypeScript support for import.meta.env
 */

interface ImportMetaEnv {
  // Mapbox (Primary Map Provider)
  readonly VITE_MAPBOX_ACCESS_TOKEN: string;
  
  // Firebase (Optional - for real-time features)
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

