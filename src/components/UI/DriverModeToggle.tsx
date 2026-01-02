/**
 * =====================================================
 * DRIVER MODE TOGGLE COMPONENT
 * =====================================================
 * 
 * Toggle for activating Driver Mode.
 * When enabled, broadcasts GPS location every 15 seconds.
 * =====================================================
 */

import React, { useEffect, useState, useRef } from 'react';
import { t, CONFIG } from '../../constants';
import { useApp } from '../../context/AppContext';
import { watchLocation } from '../../services/locationService';
import { updateVehicleLocation } from '../../firebase/operations';

// =====================================================
// PROPS
// =====================================================

interface DriverModeToggleProps {
  routeId?: string;
  vehicleId?: string;
}

// =====================================================
// COMPONENT
// =====================================================

export const DriverModeToggle: React.FC<DriverModeToggleProps> = ({
  routeId,
  vehicleId,
}) => {
  const { settings, updateSettings, updateUserState } = useApp();
  const lang = settings.language;

  const [uploadCount, setUploadCount] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const stopWatchingRef = useRef<(() => void) | null>(null);
  const uploadIntervalRef = useRef<number | null>(null);
  const lastLocationRef = useRef<{ lat: number; lng: number; heading: number; speed: number; accuracy: number } | null>(null);

  // Handle toggle
  const handleToggle = () => {
    const newValue = !settings.driverMode;
    updateSettings({ driverMode: newValue });
    updateUserState({ isDriver: newValue });
  };

  // Start/stop location tracking
  useEffect(() => {
    if (settings.driverMode && routeId && vehicleId) {
      // Start watching location
      stopWatchingRef.current = watchLocation(
        (location, heading, speed, accuracy) => {
          lastLocationRef.current = { lat: location.lat, lng: location.lng, heading, speed, accuracy };
          setCurrentSpeed(Math.round(speed));
          setError(null);
        },
        (err) => {
          setError(err.message);
        }
      );

      // Upload location every 15 seconds
      uploadIntervalRef.current = window.setInterval(async () => {
        if (lastLocationRef.current && !settings.demoMode) {
          try {
            await updateVehicleLocation(
              vehicleId,
              routeId,
              { lat: lastLocationRef.current.lat, lng: lastLocationRef.current.lng },
              lastLocationRef.current.heading,
              lastLocationRef.current.speed,
              lastLocationRef.current.accuracy
            );
            setUploadCount(prev => prev + 1);
          } catch (err) {
            console.error('Upload failed:', err);
          }
        }
      }, CONFIG.GPS_UPDATE_INTERVAL);

      return () => {
        stopWatchingRef.current?.();
        if (uploadIntervalRef.current) {
          clearInterval(uploadIntervalRef.current);
        }
      };
    } else {
      // Stop tracking
      stopWatchingRef.current?.();
      if (uploadIntervalRef.current) {
        clearInterval(uploadIntervalRef.current);
      }
    }
  }, [settings.driverMode, settings.demoMode, routeId, vehicleId]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚗</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{t('driverMode', lang)}</h3>
            <p className="text-sm text-gray-500">
              {settings.driverMode ? t('driverModeOn', lang) : t('driverModeOff', lang)}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={handleToggle}
          className={`
            relative w-14 h-8 rounded-full transition-colors duration-200
            ${settings.driverMode ? 'bg-primary' : 'bg-gray-300'}
          `}
        >
          <span
            className={`
              absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
              ${settings.driverMode ? 'translate-x-7' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Status when active */}
      {settings.driverMode && (
        <div className="mt-4 p-4 bg-primary/10 rounded-xl">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="font-bold text-green-600">
              {lang === 'ur' ? 'فعال' : 'Active'}
            </span>
          </div>

          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{uploadCount}</p>
              <p className="text-xs text-gray-500">
                {lang === 'ur' ? 'اپ لوڈز' : 'Uploads'}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{currentSpeed} km/h</p>
              <p className="text-xs text-gray-500">
                {lang === 'ur' ? 'رفتار' : 'Speed'}
              </p>
            </div>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500 text-center">{error}</p>
          )}
        </div>
      )}

      {/* Battery notice */}
      <p className="mt-4 text-xs text-gray-500 text-center">
        {lang === 'ur'
          ? '⚡ بیٹری کے لیے بہتر - ہر 15 سیکنڈ میں اپ ڈیٹ'
          : '⚡ Battery optimized - Updates every 15 seconds'}
      </p>
    </div>
  );
};

export default DriverModeToggle;

