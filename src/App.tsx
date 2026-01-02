/**
 * =====================================================
 * URBAN-MOVE WEB APP
 * =====================================================
 * 
 * Main application component with routing setup.
 * Real-time public transit tracker for Pakistan.
 * =====================================================
 */

import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { 
  HomePage, 
  RouteDetailsPage, 
  MapPage, 
  BestRoutePage, 
  FavoritesPage, 
  UserInfoPage, 
  AppInfoPage,
  LoginPage
} from './pages';
import { BottomNavigation, ProtectedRoute, InstallPrompt } from './components';
import { initializeFirebase, isFirebaseConfigured } from './firebase/config';
import { useApp } from './context/AppContext';
import { registerServiceWorker, setupInstallPrompt } from './utils/pwaService';

// =====================================================
// APP COMPONENT
// =====================================================

const App: React.FC = () => {
  const { settings } = useApp();

  // Initialize Firebase on app start
  useEffect(() => {
    if (isFirebaseConfigured()) {
      try {
        initializeFirebase();
        console.log('🚀 Urban-Move Web started with Firebase');
      } catch (error) {
        console.error('Firebase init error:', error);
      }
    } else {
      console.log('🚀 Urban-Move Web started (using local data)');
    }
  }, []);

  // Register PWA service worker and setup install prompt
  useEffect(() => {
    registerServiceWorker();
    setupInstallPrompt();
  }, []);

  // Apply high contrast if enabled
  useEffect(() => {
    document.body.classList.toggle('high-contrast', settings.highContrast);
  }, [settings.highContrast]);

  return (
    <div className={`min-h-screen ${settings.language === 'ur' ? 'rtl' : 'ltr'}`}>
      <Toaster position="top-right" />
      <Routes>
        {/* Login Page (public) */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Redirect root to login or map based on auth */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected Main Pages */}
        <Route 
          path="/map" 
          element={
            <ProtectedRoute>
              <MapPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/best-route" 
          element={
            <ProtectedRoute>
              <BestRoutePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/favorites" 
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-info" 
          element={
            <ProtectedRoute>
              <UserInfoPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/app-info" 
          element={
            <ProtectedRoute>
              <AppInfoPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Legacy routes (for backward compatibility) */}
        <Route path="/home" element={<HomePage />} />
        <Route 
          path="/route/:routeId" 
          element={
            <ProtectedRoute>
              <RouteDetailsPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
      
      {/* Bottom Navigation (hidden on login and route details page) */}
      <BottomNavigation />
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default App;

