/**
 * Vite Configuration for Urban-Move Web App
 * 
 * Optimized for:
 * - Fast development with HMR
 * - Production builds for Netlify/Vercel
 * - Environment variable support
 */

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  // Debug: Log if MAPBOX token is found at config time
  if (env.VITE_MAPBOX_ACCESS_TOKEN) {
    console.log('✅ Vite Config: VITE_MAPBOX_ACCESS_TOKEN found');
    console.log('   Token length:', env.VITE_MAPBOX_ACCESS_TOKEN.length);
    console.log('   Token starts with:', env.VITE_MAPBOX_ACCESS_TOKEN.substring(0, 10));
  } else {
    console.warn('⚠️ Vite Config: VITE_MAPBOX_ACCESS_TOKEN not found');
    console.warn('   Current directory:', process.cwd());
    console.warn('   Mode:', mode);
  }
  
  return {
    plugins: [react()],
    
    // Development server configuration
    server: {
      port: 3000,
      open: true,
    },
    
    // Build optimization for low-bandwidth users
    build: {
      // Chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-firebase': ['firebase/app', 'firebase/firestore', 'firebase/database'],
            'vendor-maps': ['mapbox-gl'],
          },
        },
      },
      // Smaller chunks for slow connections
      chunkSizeWarningLimit: 500,
    },
    
    // Environment variables prefix
    envPrefix: 'VITE_',
  };
});

