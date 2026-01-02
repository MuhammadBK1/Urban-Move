/**
 * =====================================================
 * QUICK ACTIONS COMPONENT
 * =====================================================
 * 
 * One-tap quick actions:
 * - Go Home
 * - Go to Work
 * - Nearest Metro Station
 * - Recent Searches
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coordinate } from '../types';
import { useApp } from '../context/AppContext';
import { getAllStations } from '../data/transitData';
import { calculateDistance } from '../services/mapService';

interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: Coordinate;
  icon?: string;
}

const FAVORITES_STORAGE_KEY = 'urbanmove_favorites';
const USER_INFO_STORAGE_KEY = 'urbanmove_user_info';
const RECENT_SEARCHES_KEY = 'urbanmove_recent_searches';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const { settings, userLocation } = useApp();
  const lang = settings.language;

  const [homeLocation, setHomeLocation] = useState<Coordinate | null>(null);
  const [workLocation, setWorkLocation] = useState<Coordinate | null>(null);
  const [nearestMetro, setNearestMetro] = useState<{ name: string; coordinates: Coordinate } | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load home address from user info
    const userInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed.homeCoordinates) {
          setHomeLocation(parsed.homeCoordinates);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    }

    // Load favorites
    const favorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (favorites) {
      try {
        const parsed: FavoriteLocation[] = JSON.parse(favorites);
        const work = parsed.find(f => f.name.toLowerCase().includes('work') || f.name.toLowerCase().includes('دفتر'));
        if (work) {
          setWorkLocation(work.coordinates);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }

    // Find nearest metro station
    if (userLocation) {
      const allStations = getAllStations();
      const metroStations = allStations.filter((s): s is typeof allStations[0] & { type: 'metroBus' | 'orangeLine' } => 
        s.type === 'metroBus' || s.type === 'orangeLine'
      );
      
      let nearest: { name: string; lat: number; lng: number } | null = null;
      let minDistance = Infinity;

      for (const station of metroStations) {
        const distance = calculateDistance(userLocation, { lat: station.lat, lng: station.lng });
        if (distance < minDistance) {
          minDistance = distance;
          nearest = { name: station.name, lat: station.lat, lng: station.lng };
        }
      }

      if (nearest) {
        setNearestMetro({
          name: nearest.name,
          coordinates: { lat: nearest.lat, lng: nearest.lng },
        });
      }
    }

    // Load recent searches
    const recent = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (recent) {
      try {
        setRecentSearches(JSON.parse(recent).slice(0, 3)); // Last 3 searches
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, [userLocation]);

  const handleQuickAction = (destination: Coordinate, name: string) => {
    // Save to recent searches
    const recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
    if (!recent.includes(name)) {
      recent.unshift(name);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, 10)));
    }

    // Navigate to routes page with destination
    navigate('/best-route', { state: { destination, destinationName: name } });
  };

  const actions: Array<{
    icon: string;
    label: string;
    action: () => void;
  }> = [
    homeLocation ? {
      icon: '🏠',
      label: lang === 'ur' ? 'گھر' : 'Home',
      action: () => handleQuickAction(homeLocation, lang === 'ur' ? 'گھر' : 'Home'),
    } : null,
    workLocation ? {
      icon: '🏢',
      label: lang === 'ur' ? 'دفتر' : 'Work',
      action: () => handleQuickAction(workLocation, lang === 'ur' ? 'دفتر' : 'Work'),
    } : null,
    nearestMetro ? {
      icon: '🚇',
      label: lang === 'ur' ? `قریب ترین میٹرو: ${nearestMetro.name}` : `Nearest Metro: ${nearestMetro.name}`,
      action: () => handleQuickAction(nearestMetro.coordinates, nearestMetro.name),
    } : null,
  ].filter((action): action is { icon: string; label: string; action: () => void } => action !== null);

  if (actions.length === 0 && recentSearches.length === 0) {
    return null;
  }

  return (
    <div className="card mb-4">
      <h3 className="text-sm font-semibold mb-3" style={{ color: '#0F172A' }}>
        {lang === 'ur' ? 'فوری اقدامات' : 'Quick Actions'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg hover:shadow-sm transition-all text-sm font-medium"
            style={{ background: '#F0FDF4', color: '#0F9D58', border: '1px solid #BBF7D0' }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>
      {recentSearches.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-medium text-gray-500 mb-2">
            {lang === 'ur' ? 'حالیہ تلاشیں' : 'Recent Searches'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  // Find in favorites or search
                  const favorites = JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY) || '[]');
                  const favorite = favorites.find((f: FavoriteLocation) => f.name === search);
                  if (favorite) {
                    handleQuickAction(favorite.coordinates, search);
                  } else {
                    navigate('/best-route', { state: { destinationName: search } });
                  }
                }}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;

