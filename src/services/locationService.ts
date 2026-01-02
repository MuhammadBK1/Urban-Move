/**
 * =====================================================
 * BROWSER GEOLOCATION SERVICE
 * =====================================================
 * 
 * Handles browser-based location tracking.
 * Used for both commuter location and Driver Mode.
 * =====================================================
 */

import { Coordinate } from '../types';
import { CONFIG } from '../constants';

/**
 * Get user's current location once
 */
export const getCurrentLocation = (): Promise<Coordinate> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: CONFIG.LOCATION_TIMEOUT,
        maximumAge: 0,
        // Request high accuracy
      }
    );
  });
};

/**
 * Watch user's location continuously
 * Returns a cleanup function to stop watching
 */
export const watchLocation = (
  onUpdate: (location: Coordinate, heading: number, speed: number, accuracy: number) => void,
  onError: (error: GeolocationPositionError) => void
): (() => void) => {
  if (!navigator.geolocation) {
    onError({
      code: 2,
      message: 'Geolocation not supported',
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    });
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      onUpdate(
        {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
        position.coords.heading || 0,
        (position.coords.speed || 0) * 3.6, // m/s to km/h
        position.coords.accuracy
      );
    },
    onError,
    {
      enableHighAccuracy: true,
      timeout: CONFIG.LOCATION_TIMEOUT,
      maximumAge: CONFIG.GPS_UPDATE_INTERVAL,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
};

/**
 * Check if geolocation is available
 */
export const isGeolocationAvailable = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Check location permission status
 */
export const checkLocationPermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  try {
    const result = await navigator.permissions.query({ name: 'geolocation' });
    return result.state;
  } catch {
    // Permissions API not supported, assume prompt
    return 'prompt';
  }
};

