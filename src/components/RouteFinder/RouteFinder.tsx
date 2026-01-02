/**
 * =====================================================
 * ROUTE FINDER COMPONENT
 * =====================================================
 * 
 * Input form for finding routes between two locations
 * =====================================================
 */

import React, { useState } from 'react';
import { Coordinate } from '../../types';
import { parseLocation, findRoutes, RouteSuggestion } from '../../services/routeFinderService';
import { getAllStations } from '../../data';
import toast from 'react-hot-toast';

// =====================================================
// PROPS
// =====================================================

interface RouteFinderProps {
  onRoutesFound: (suggestions: RouteSuggestion[], start: Coordinate, destination: Coordinate) => void;
  onClear: () => void;
  lang: 'en' | 'ur';
  userLocation?: Coordinate | null;
}

// =====================================================
// COMPONENT
// =====================================================

export const RouteFinder: React.FC<RouteFinderProps> = ({
  onRoutesFound,
  onClear,
  lang,
  userLocation,
}) => {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [isFinding, setIsFinding] = useState(false);

  const allStations = getAllStations();

  const handleFindRoute = () => {
    if (!fromLocation.trim() || !toLocation.trim()) {
      toast('Please enter both current location and destination', {
        icon: '⚠️',
      });
      return;
    }

    setIsFinding(true);

    // Parse locations
    const from = parseLocation(fromLocation, allStations) || userLocation;
    const to = parseLocation(toLocation, allStations);

    if (!from) {
      toast('Could not find your current location. Please enter coordinates or station name.', {
        icon: '⚠️',
      });
      setIsFinding(false);
      return;
    }

    if (!to) {
      toast('Could not find destination. Please enter coordinates or station name.', {
        icon: '⚠️',
      });
      setIsFinding(false);
      return;
    }

    // Find routes
    const suggestions = findRoutes(from, to, lang);
    
    if (suggestions.length === 0) {
      toast('No routes found. Try different locations.', {
        icon: 'ℹ️',
      });
      setIsFinding(false);
      return;
    }

    onRoutesFound(suggestions, from, to);
    setIsFinding(false);
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setFromLocation(`${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`);
    } else {
      toast('Location not available. Please enter manually.', {
        icon: '⚠️',
      });
    }
  };

  const handleClear = () => {
    setFromLocation('');
    setToLocation('');
    onClear();
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-lg mb-4">
        {lang === 'ur' ? 'راستہ تلاش کریں' : 'Find Route'}
      </h3>

      <div className="space-y-3">
        {/* From Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'ur' ? 'موجودہ مقام' : 'Current Location'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-lg text-sm"
              placeholder={lang === 'ur' ? 'مقام یا اسٹیشن نام' : 'Location or station name'}
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleFindRoute()}
            />
            <button
              onClick={handleUseCurrentLocation}
              className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition-colors"
              title={lang === 'ur' ? 'موجودہ مقام استعمال کریں' : 'Use current location'}
            >
              📍
            </button>
          </div>
        </div>

        {/* To Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {lang === 'ur' ? 'منزل' : 'Destination'}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-lg text-sm"
            placeholder={lang === 'ur' ? 'منزل یا اسٹیشن نام' : 'Destination or station name'}
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleFindRoute()}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleFindRoute}
            disabled={isFinding}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isFinding 
              ? (lang === 'ur' ? 'تلاش ہو رہی ہے...' : 'Finding...')
              : (lang === 'ur' ? 'راستہ تلاش کریں' : 'Find Route')
            }
          </button>
          {(fromLocation || toLocation) && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {lang === 'ur' ? 'صاف' : 'Clear'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RouteFinder;

