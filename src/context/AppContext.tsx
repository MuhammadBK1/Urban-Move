/**
 * =====================================================
 * APP CONTEXT PROVIDER
 * =====================================================
 * 
 * Global state management for Urban-Move web app.
 * Manages settings, user state, and location.
 * =====================================================
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { AppSettings, UserState, Coordinate } from '../types';
import { getCurrentLocation } from '../services/locationService';
import { DEFAULT_CENTER, CONFIG } from '../constants';

// =====================================================
// TYPES
// =====================================================

interface AppContextType {
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  
  // User state
  userState: UserState;
  updateUserState: (updates: Partial<UserState>) => void;
  
  // Location
  userLocation: Coordinate | null;
  locationPermissionGranted: boolean;
  refreshLocation: () => Promise<void>;
  
  // Check-in
  recordCheckIn: () => void;
  canUserCheckIn: boolean;
  
  // Loading
  isLoading: boolean;
}

const defaultSettings: AppSettings = {
  language: 'en',
  demoMode: false, // Production mode by default
  driverMode: false,
  highContrast: false,
  selectedRouteId: undefined,
};

const defaultUserState: UserState = {
  anonymousId: '',
  lastCheckIn: undefined,
  checkInCount: 0,
  isDriver: false,
  currentVehicleId: undefined,
};

// =====================================================
// CONTEXT
// =====================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// Storage keys
const STORAGE_KEYS = {
  settings: 'urbanmove_settings',
  userState: 'urbanmove_user_state',
};

// =====================================================
// PROVIDER
// =====================================================

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [userState, setUserState] = useState<UserState>(defaultUserState);
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // =====================================================
  // INITIALIZATION
  // =====================================================

  useEffect(() => {
    const loadSavedState = () => {
      try {
        // Load settings
        const savedSettings = localStorage.getItem(STORAGE_KEYS.settings);
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }

        // Load user state
        const savedUserState = localStorage.getItem(STORAGE_KEYS.userState);
        if (savedUserState) {
          setUserState({ ...defaultUserState, ...JSON.parse(savedUserState) });
        } else {
          // Generate anonymous ID
          const newUserState = {
            ...defaultUserState,
            anonymousId: `user_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`,
          };
          setUserState(newUserState);
          localStorage.setItem(STORAGE_KEYS.userState, JSON.stringify(newUserState));
        }
      } catch (error) {
        console.error('Error loading saved state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedState();
  }, []);

  // =====================================================
  // LOCATION
  // =====================================================

  const refreshLocation = useCallback(async (): Promise<void> => {
    try {
      const location = await getCurrentLocation();
      
      // Try to load last known location as fallback
      const lastLocation = localStorage.getItem('urbanmove_last_location');
      
      if (lastLocation) {
        try {
          // Could use parsed as fallback if needed in future
          JSON.parse(lastLocation);
        } catch (e) {
          // Ignore parse errors
        }
      }
      
      setUserLocation(location);
      setLocationPermissionGranted(true);
      
      // Save last known location
      localStorage.setItem('urbanmove_last_location', JSON.stringify(location));
    } catch (error: any) {
      console.warn('Location error:', error);
      
      // Try to use last known location
      const lastLocation = localStorage.getItem('urbanmove_last_location');
      if (lastLocation) {
        try {
          const parsed = JSON.parse(lastLocation);
          setUserLocation(parsed);
          setLocationPermissionGranted(false);
          toast('Using last known location. GPS unavailable.', {
            icon: '📍',
            duration: 3000,
          });
          return;
        } catch (e) {
          // Fall through to default
        }
      }
      
      // Use default location (Lahore)
      setUserLocation({ lat: DEFAULT_CENTER.lat, lng: DEFAULT_CENTER.lng });
      setLocationPermissionGranted(false);
      
      // Show toast notification if permission denied
      if (error?.code === 1 || error?.message?.includes('denied')) {
        toast('Location access denied. Showing Lahore.', {
          icon: '⚠️',
          duration: 4000,
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      refreshLocation();
    }
  }, [isLoading, refreshLocation]);

  // =====================================================
  // SETTINGS
  // =====================================================

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => {
      const newSettings = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const updateUserState = useCallback((updates: Partial<UserState>) => {
    setUserState(prev => {
      const newState = { ...prev, ...updates };
      localStorage.setItem(STORAGE_KEYS.userState, JSON.stringify(newState));
      return newState;
    });
  }, []);

  // =====================================================
  // CHECK-IN
  // =====================================================

  const canUserCheckIn = !userState.lastCheckIn || 
    (Date.now() - userState.lastCheckIn >= CONFIG.CHECKIN_COOLDOWN);

  const recordCheckIn = useCallback(() => {
    updateUserState({
      lastCheckIn: Date.now(),
      checkInCount: userState.checkInCount + 1,
    });
  }, [userState.checkInCount, updateUserState]);

  // =====================================================
  // CONTEXT VALUE
  // =====================================================

  const value: AppContextType = {
    settings,
    updateSettings,
    userState,
    updateUserState,
    userLocation,
    locationPermissionGranted,
    refreshLocation,
    recordCheckIn,
    canUserCheckIn,
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// =====================================================
// HOOK
// =====================================================

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

