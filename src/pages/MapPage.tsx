/**
 * =====================================================
 * MAP PAGE
 * =====================================================
 * 
 * Full-screen Mapbox map with:
 * - User's current location
 * - Metro lines and bus routes
 * - Animated vehicle markers
 * - Floating search and control buttons
 * =====================================================
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapView } from '../components/Map/MapView';
import { useApp } from '../context/AppContext';

export const MapPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, userLocation } = useApp();
  const lang = settings.language;

  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
    navigate(`/route/${routeId}`);
  }, [navigate]);

  const handleSearchClick = () => {
    navigate('/best-route');
  };

  return (
    <div className="relative w-full h-screen pb-16">
      {/* Full-screen Map */}
      <MapView
        showStations={true}
        showFeederRoutes={true}
        selectedRouteId={selectedRouteId}
        onRouteSelect={handleRouteSelect}
        onVehicleSelect={(vehicleId) => {
          console.log('Vehicle selected:', vehicleId);
        }}
        className="w-full h-full"
      />

      {/* Floating Search Button */}
      <button
        onClick={handleSearchClick}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-white shadow-lg rounded-full px-6 py-3 flex items-center gap-2 hover:shadow-xl transition-shadow"
        style={{ minWidth: '280px' }}
      >
        <span className="text-gray-400">🔍</span>
        <span className="text-gray-600 flex-1 text-left">
          {lang === 'ur' ? 'منزل تلاش کریں...' : 'Search destination...'}
        </span>
      </button>

      {/* Floating Control Buttons */}
      <div className="absolute bottom-24 right-4 z-10 flex flex-col gap-2">
        {/* My Location Button */}
        <button
          onClick={() => {
            if (userLocation) {
              // Center map on user location
              // This will be handled by MapView's user location tracking
            }
          }}
          className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow"
          title={lang === 'ur' ? 'میرا مقام' : 'My Location'}
        >
          <span className="text-xl">📍</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => navigate('/app-info')}
          className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-shadow"
          title={lang === 'ur' ? 'ترتیبات' : 'Settings'}
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>
    </div>
  );
};

export default MapPage;

