/**
 * =====================================================
 * BEST ROUTE PAGE
 * =====================================================
 * 
 * Calculate and display best route from current location:
 * - Input destination or select from favorites
 * - Step-by-step instructions
 * - Estimated time and cost
 * - Google Maps / Moovit style route cards
 * =====================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coordinate } from '../types';
import { useApp } from '../context/AppContext';
import { RouteSuggestionCard } from '../components/RouteFinder';
import { BottomSheet, AppHeader, QuickActions } from '../components';
import { MapView } from '../components/Map/MapView';
import { RouteSuggestion, findRoutes, parseLocation } from '../services/routeFinderService';
import { scoreAndRankRoutes, RoutePreference, ScoredRoute } from '../services/routeScoringService';
import { recordRouteUsage, getSuggestedRoutine } from '../services/routineDetectionService';
import { getAllStations } from '../data/transitData';
import { fetchDirections, rankRoutes, formatDuration, formatDistance, RouteOption } from '../services/mapboxDirectionsService';
import { planMultiModalRoute, MultiModalRoute } from '../services/multiModalRoutePlanner';
import toast from 'react-hot-toast';

interface FavoriteLocation {
  id: string;
  name: string;
  coordinates: Coordinate;
  icon?: string;
}

const FAVORITES_STORAGE_KEY = 'urbanmove_favorites';

export const BestRoutePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, userLocation } = useApp();
  const lang = settings.language;

  const locationState = useLocation();
  const [routeSuggestions, setRouteSuggestions] = useState<ScoredRoute[]>([]);
  const [mapboxRoutes, setMapboxRoutes] = useState<RouteOption[]>([]);
  const [routeStart, setRouteStart] = useState<Coordinate | null>(userLocation);
  const [routeDestination, setRouteDestination] = useState<Coordinate | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [destinationInput, setDestinationInput] = useState('');
  const [preference, setPreference] = useState<RoutePreference>('fastest');
  const [selectedRoute, setSelectedRoute] = useState<ScoredRoute | null>(null);
  const [selectedMapboxRoute, setSelectedMapboxRoute] = useState<RouteOption | null>(null);
  const [multiModalRoutes, setMultiModalRoutes] = useState<MultiModalRoute[]>([]);
  const [selectedMultiModalRoute, setSelectedMultiModalRoute] = useState<MultiModalRoute | null>(null);
  const [showRouteSheet, setShowRouteSheet] = useState(false);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Load favorites
  useEffect(() => {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  // Update route start when user location changes
  useEffect(() => {
    if (userLocation) {
      setRouteStart(userLocation);
    }
  }, [userLocation]);

  // Handle destination from navigation state (quick actions)
  useEffect(() => {
    if (locationState.state?.destination) {
      setRouteDestination(locationState.state.destination);
      if (locationState.state.destinationName) {
        setDestinationInput(locationState.state.destinationName);
      }
    }
  }, [locationState]);

  const handleFindRoute = async () => {
    if (!routeStart) {
      toast.error(lang === 'ur' ? 'مقام دستیاب نہیں' : 'Location not available');
      return;
    }

    if (!destinationInput.trim()) {
      toast.error(lang === 'ur' ? 'براہ کرم منزل درج کریں' : 'Please enter destination');
      return;
    }

    setIsLoadingRoutes(true);

    // Parse destination from input
    const allStations = getAllStations();
    const parsedDestination = parseLocation(destinationInput, allStations);

    if (!parsedDestination) {
      toast.error(lang === 'ur' ? 'منزل درست نہیں' : 'Invalid destination');
      setIsLoadingRoutes(false);
      return;
    }

    setRouteDestination(parsedDestination);

    try {
      // Fetch Mapbox Directions (driving routes)
      const directionsResponse = await fetchDirections(routeStart, parsedDestination, 'driving', true);
      
      if (directionsResponse && directionsResponse.routes.length > 0) {
        const ranked = rankRoutes(directionsResponse.routes);
        setMapboxRoutes(ranked);
        setSelectedMapboxRoute(ranked[0]); // Best route
        setShowMap(true);
      }

      // Find multi-modal public transport routes
      const multiModal = planMultiModalRoute(routeStart, parsedDestination);
      setMultiModalRoutes(multiModal);
      if (multiModal.length > 0) {
        setSelectedMultiModalRoute(multiModal[0]); // Best route (fewest transfers)
      }

      // Also find transit routes (legacy)
      const suggestions = findRoutes(routeStart, parsedDestination, lang);
      const scoredRoutes = scoreAndRankRoutes(suggestions, preference);
      setRouteSuggestions(scoredRoutes);

      // Record route usage for routine detection
      if (destinationInput.trim()) {
        recordRouteUsage(
          lang === 'ur' ? 'موجودہ مقام' : 'Current Location',
          destinationInput
        );
      }

      const totalRoutes = (directionsResponse?.routes.length || 0) + scoredRoutes.length;
      if (totalRoutes === 0) {
        toast.error(lang === 'ur' ? 'کوئی راستہ نہیں ملا' : 'No routes found');
      } else {
        toast.success(`${totalRoutes} ${lang === 'ur' ? 'راستے ملے' : 'routes found'}`);
      }
    } catch (error) {
      console.error('Error finding routes:', error);
      toast.error(lang === 'ur' ? 'راستہ تلاش کرنے میں خرابی' : 'Error finding routes');
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleSelectFavorite = (favorite: FavoriteLocation) => {
    setRouteDestination(favorite.coordinates);
    setDestinationInput(favorite.name);
    setShowFavorites(false);
  };

  const handleSelectSuggestion = (suggestion: RouteSuggestion) => {
    // Navigate to route details or show on map
    if (suggestion.steps[0]?.routeId) {
      navigate(`/route/${suggestion.steps[0].routeId}`);
    }
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: '#F8FAFC' }}>
      <AppHeader 
        title={lang === 'ur' ? 'راستے' : 'Routes'}
        showSearch={false}
      />
      
      {/* Map View (Uber-style) - Auto-shown when route is selected */}
      {showMap && routeStart && routeDestination && (
        <div className="relative w-full h-96 mb-4" data-map-container>
          <MapView
            routeStart={routeStart}
            routeDestination={routeDestination}
            selectedRouteOption={selectedMapboxRoute || undefined}
            selectedMultiModalRoute={selectedMultiModalRoute || undefined}
            showStations={false}
            showFeederRoutes={false}
            className="w-full h-full"
          />
          <button
            onClick={() => setShowMap(false)}
            className="absolute top-4 right-4 z-10 bg-white shadow-lg rounded-full p-2 hover:shadow-xl transition-shadow"
            title={lang === 'ur' ? 'نقشہ چھپائیں' : 'Hide Map'}
          >
            ✕
          </button>
          
          {/* Route Info Overlay (Uber-style) */}
          {(selectedMapboxRoute || selectedRoute || selectedMultiModalRoute) && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {selectedMapboxRoute ? '🚗' : selectedMultiModalRoute ? '🚌' : '🚌'}
                    </span>
                    <div>
                      <div className="text-lg font-bold" style={{ color: selectedMapboxRoute ? '#1A73E8' : '#0F9D58' }}>
                        {selectedMapboxRoute 
                          ? formatDuration(selectedMapboxRoute.duration)
                          : selectedMultiModalRoute
                            ? `${selectedMultiModalRoute.totalTime} min`
                            : selectedRoute 
                              ? `${selectedRoute.estimatedTime} min`
                              : ''
                        }
                      </div>
                      <div className="text-xs text-gray-500">
                        {selectedMapboxRoute 
                          ? formatDistance(selectedMapboxRoute.distance)
                          : selectedMultiModalRoute
                            ? `${(selectedMultiModalRoute.totalDistance / 1000).toFixed(1)} km`
                            : selectedRoute
                              ? `${(selectedRoute.totalDistance || 0).toFixed(1)} km`
                              : ''
                        }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600 pt-2 border-t border-gray-100">
                  <span>
                    {selectedMapboxRoute 
                      ? `${selectedMapboxRoute.transfers || 0} ${lang === 'ur' ? 'تبدیلی' : 'transfers'}`
                      : selectedMultiModalRoute
                        ? `${selectedMultiModalRoute.transfers} ${lang === 'ur' ? 'تبدیلی' : 'transfers'}`
                        : selectedRoute
                          ? `${Math.max(0, selectedRoute.steps.filter(s => s.type !== 'walk').length - 1)} ${lang === 'ur' ? 'تبدیلی' : 'transfers'}`
                          : ''
                    }
                  </span>
                  {selectedMapboxRoute && (
                    <span>• {lang === 'ur' ? 'ڈرائیونگ' : 'Driving'}</span>
                  )}
                  {(selectedRoute || selectedMultiModalRoute) && (
                    <span>• {lang === 'ur' ? 'عوامی نقل و حمل' : 'Public Transit'}</span>
                  )}
                </div>
                {selectedMultiModalRoute && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs font-semibold text-gray-700 mb-2">
                      {lang === 'ur' ? 'راستے کے مراحل' : 'Route Steps'}
                    </div>
                    <div className="space-y-1">
                      {selectedMultiModalRoute.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                          <span>
                            {step.type === 'walk' ? '🚶' : step.type === 'speedo' ? '🚌' : '🚇'}
                          </span>
                          <span className="flex-1">{step.instruction}</span>
                          <span className="text-gray-400">{step.time} min</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Routine Suggestion */}
        {(() => {
          const routine = getSuggestedRoutine();
          if (routine) {
            return (
              <div className="card p-4 mb-4 bg-blue-50 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-900">
                      {lang === 'ur' ? 'روٹین سفر؟' : 'Routine Trip?'}
                    </p>
                    <p className="text-sm text-blue-700">
                      {lang === 'ur' 
                        ? `${routine.to} جانا چاہتے ہیں؟`
                        : `Going to ${routine.to}?`
                      }
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setDestinationInput(routine.to);
                      // Trigger route finding
                      setTimeout(() => {
                        const allStations = getAllStations();
                        const parsedDestination = parseLocation(routine.to, allStations);
                        if (parsedDestination) {
                          setRouteDestination(parsedDestination);
                          const suggestions = findRoutes(routeStart || userLocation!, parsedDestination, lang);
                          const scoredRoutes = scoreAndRankRoutes(suggestions, preference);
                          setRouteSuggestions(scoredRoutes);
                          if (scoredRoutes.length > 0) {
                            setSelectedRoute(scoredRoutes[0]);
                            setShowRouteSheet(true);
                          }
                        }
                      }, 100);
                    }}
                    className="btn-secondary text-sm"
                  >
                    {lang === 'ur' ? 'استعمال کریں' : 'Use'}
                  </button>
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Quick Actions */}
        <QuickActions />

        {/* Route Preference Selector */}
        <div className="card p-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {lang === 'ur' ? 'ترجیح' : 'Preference'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['fastest', 'least-walking', 'cheapest', 'least-transfers'] as RoutePreference[]).map((pref) => (
              <button
                key={pref}
                onClick={() => {
                  setPreference(pref);
                  if (routeSuggestions.length > 0) {
                    const rescored = scoreAndRankRoutes(
                      routeSuggestions.map(r => ({ ...r, score: 0, ranking: 0, reasons: [] })),
                      pref
                    );
                    setRouteSuggestions(rescored);
                    setSelectedRoute(rescored[0]);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  preference === pref
                    ? 'bg-[#0F9D58] text-white shadow-md'
                    : 'bg-gray-100 text-[#1F2937] hover:bg-gray-200'
                }`}
              >
                {lang === 'ur' 
                  ? (pref === 'fastest' ? 'تیز ترین' : pref === 'least-walking' ? 'کم پیدل' : pref === 'cheapest' ? 'سستا' : 'کم تبدیلی')
                  : (pref === 'fastest' ? 'Fastest' : pref === 'least-walking' ? 'Least Walking' : pref === 'cheapest' ? 'Cheapest' : 'Least Transfers')
                }
              </button>
            ))}
          </div>
        </div>

        {/* Route Input Card */}
        <div className="card p-6 mb-4">
          <div className="space-y-4">
            {/* From (Current Location) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ur' ? 'سے' : 'From'}
              </label>
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <span style={{ color: '#0F9D58' }}>📍</span>
                <span className="flex-1" style={{ color: '#334155' }}>
                  {userLocation 
                    ? (lang === 'ur' ? 'آپ کا موجودہ مقام' : 'Your Current Location')
                    : (lang === 'ur' ? 'مقام دستیاب نہیں' : 'Location not available')
                  }
                </span>
              </div>
            </div>

            {/* To (Destination) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {lang === 'ur' ? 'تک' : 'To'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destinationInput}
                  onChange={(e) => setDestinationInput(e.target.value)}
                  onFocus={() => setShowFavorites(true)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder={lang === 'ur' ? 'منزل درج کریں یا پسندیدہ منتخب کریں' : 'Enter destination or select favorite'}
                />
                {favorites.length > 0 && (
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ⭐
                  </button>
                )}
              </div>

              {/* Favorites Dropdown */}
              {showFavorites && favorites.length > 0 && (
                <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {favorites.map((favorite) => (
                    <button
                      key={favorite.id}
                      onClick={() => handleSelectFavorite(favorite)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-xl">{favorite.icon || '📍'}</span>
                      <span className="flex-1 font-medium">{favorite.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Find Route Button */}
            <button
              onClick={handleFindRoute}
              disabled={!routeStart || !destinationInput.trim() || isLoadingRoutes}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingRoutes 
                ? (lang === 'ur' ? 'تلاش کر رہے ہیں...' : 'Searching...')
                : (lang === 'ur' ? 'راستہ تلاش کریں' : 'Find Route')
              }
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoadingRoutes && (
          <div className="card p-12 text-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">
              {lang === 'ur' ? 'راستے تلاش کر رہے ہیں...' : 'Finding routes...'}
            </p>
          </div>
        )}

        {/* Multi-Modal Public Transport Routes */}
        {multiModalRoutes.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {lang === 'ur' ? 'عوامی نقل و حمل راستے' : 'Public Transport Routes'}
            </h2>
            
            {multiModalRoutes.map((route, index) => {
              const isSelected = selectedMultiModalRoute?.id === route.id;
              return (
                <div
                  key={route.id}
                  className={`card p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-green-500 shadow-lg scale-[1.02]'
                      : 'hover:shadow-md opacity-60'
                  }`}
                  onClick={() => {
                    setSelectedMultiModalRoute(route);
                    setShowMap(true);
                    setTimeout(() => {
                      const mapElement = document.querySelector('[data-map-container]');
                      if (mapElement) {
                        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {index === 0 && route.transfers === 0 && (
                          <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ background: '#0F9D58' }}>
                            {lang === 'ur' ? 'بہترین' : 'BEST'}
                          </span>
                        )}
                        <span className={`text-sm font-semibold ${isSelected ? 'text-green-600' : 'text-green-500'}`}>
                          {route.totalTime} {lang === 'ur' ? 'منٹ' : 'min'}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-green-600 font-medium">✓ {lang === 'ur' ? 'منتخب' : 'Selected'}</span>
                        )}
                      </div>
                      <div className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                        {(route.totalDistance / 1000).toFixed(1)} km • Rs. {route.totalFare} • {route.transfers} {lang === 'ur' ? 'تبدیلی' : 'transfers'}
                      </div>
                    </div>
                    <div className="text-2xl">🚌</div>
                  </div>
                  
                  {/* Route Steps */}
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 flex-wrap">
                      {route.steps.map((step, stepIndex) => (
                        <React.Fragment key={stepIndex}>
                          <span className={`text-xs px-2 py-1 rounded ${
                            step.type === 'walk' ? 'bg-gray-100 text-gray-700' :
                            step.type === 'speedo' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {step.type === 'walk' ? '🚶' : step.type === 'speedo' ? '🚌' : '🚇'} {step.type}
                          </span>
                          {stepIndex < route.steps.length - 1 && (
                            <span className="text-gray-400">→</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mapbox Route Options (Uber-style) */}
        {mapboxRoutes.length > 0 && (
          <div className="space-y-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {lang === 'ur' ? 'ڈرائیونگ راستے' : 'Driving Routes'}
            </h2>
            
            {mapboxRoutes.map((route, index) => {
              const isSelected = selectedMapboxRoute?.id === route.id;
              return (
                <div
                  key={route.id}
                  className={`card p-4 transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-2 border-blue-500 shadow-lg scale-[1.02]' 
                      : 'hover:shadow-md opacity-60'
                  }`}
                  onClick={() => {
                    setSelectedMapboxRoute(route);
                    setShowMap(true);
                    // Scroll to map smoothly
                    setTimeout(() => {
                      const mapElement = document.querySelector('[data-map-container]');
                      if (mapElement) {
                        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {index === 0 && (
                          <span className="text-xs font-bold text-white px-2 py-1 rounded" style={{ background: '#1A73E8' }}>
                            {lang === 'ur' ? 'بہترین' : 'BEST'}
                          </span>
                        )}
                        <span className={`text-sm font-semibold ${isSelected ? 'text-blue-600' : 'text-blue-500'}`}>
                          {formatDuration(route.duration)}
                        </span>
                        {isSelected && (
                          <span className="text-xs text-blue-600 font-medium">✓ {lang === 'ur' ? 'منتخب' : 'Selected'}</span>
                        )}
                      </div>
                      <div className={`text-sm ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                        {formatDistance(route.distance)} • {route.transfers || 0} {lang === 'ur' ? 'تبدیلی' : 'transfers'}
                      </div>
                    </div>
                    <div className={`text-2xl transition-transform ${isSelected ? 'scale-110' : ''}`}>🚗</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transit Route Suggestions */}
        {routeSuggestions.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {lang === 'ur' ? 'عوامی نقل و حمل راستے' : 'Public Transit Routes'}
            </h2>
            
            {/* Best Route (Highlighted) */}
            {routeSuggestions[0] && (
              <div className="relative">
                <div className="absolute -top-2 -left-2 text-white px-3 py-1 rounded-full text-xs font-bold z-10 shadow-md" style={{ background: '#0F9D58' }}>
                  {lang === 'ur' ? 'بہترین' : 'BEST'}
                </div>
                <div
                  className={`card p-5 border-2 transition-all cursor-pointer ${
                    selectedRoute?.id === routeSuggestions[0].id
                      ? 'shadow-lg scale-[1.02]'
                      : 'hover:shadow-lg'
                  }`}
                  style={{ 
                    borderColor: '#0F9D58',
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%)',
                    opacity: selectedRoute && selectedRoute.id !== routeSuggestions[0].id ? 0.6 : 1
                  }}
                  onClick={() => {
                    setSelectedRoute(routeSuggestions[0]);
                    setShowRouteSheet(true);
                    setShowMap(true);
                    setTimeout(() => {
                      const mapElement = document.querySelector('[data-map-container]');
                      if (mapElement) {
                        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                  <RouteSuggestionCard
                    suggestion={routeSuggestions[0]}
                    lang={lang}
                    onSelect={() => {
                      setSelectedRoute(routeSuggestions[0]);
                      setShowRouteSheet(true);
                      setShowMap(true);
                    }}
                  />
                  {routeSuggestions[0].reasons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {routeSuggestions[0].reasons.map((reason, idx) => (
                        <span key={idx} className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Alternative Routes */}
            {routeSuggestions.slice(1).map((suggestion) => {
              const isSelected = selectedRoute?.id === suggestion.id;
              return (
                <div
                  key={suggestion.id}
                  className={`card p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-2 border-green-500 shadow-lg scale-[1.02]'
                      : 'hover:shadow-md opacity-60'
                  }`}
                  onClick={() => {
                    setSelectedRoute(suggestion);
                    setShowRouteSheet(true);
                    setShowMap(true);
                    setTimeout(() => {
                      const mapElement = document.querySelector('[data-map-container]');
                      if (mapElement) {
                        mapElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }, 100);
                  }}
                >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {lang === 'ur' ? `متبادل ${suggestion.ranking}` : `Alternative ${suggestion.ranking}`}
                  </span>
                  <span className="text-xs text-gray-400">
                    {suggestion.estimatedTime} {lang === 'ur' ? 'منٹ' : 'mins'} • Rs. {suggestion.totalFare}
                  </span>
                </div>
                <RouteSuggestionCard
                  suggestion={suggestion}
                  lang={lang}
                  onSelect={() => {
                    setSelectedRoute(suggestion);
                    setShowRouteSheet(true);
                  }}
                />
              </div>
            );
            })}
          </div>
        )}

        {/* Empty State */}
        {routeSuggestions.length === 0 && !isLoadingRoutes && routeStart && (
          <div className="card p-12 text-center">
            <span className="text-5xl mb-4 block">🗺️</span>
            <p className="text-gray-600">
              {lang === 'ur' ? 'منزل درج کریں اور راستہ تلاش کریں' : 'Enter destination and find routes'}
            </p>
          </div>
        )}
      </div>

      {/* Route Details Bottom Sheet */}
      <BottomSheet
        isOpen={showRouteSheet}
        onClose={() => setShowRouteSheet(false)}
        title={selectedRoute ? (lang === 'ur' ? 'راستے کی تفصیلات' : 'Route Details') : ''}
      >
        {selectedRoute && (
          <div className="p-4 space-y-4">
            <div className="p-5 rounded-lg" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">
                  {lang === 'ur' ? selectedRoute.titleUrdu : selectedRoute.title}
                </h3>
                <span className="text-sm font-bold text-green-700">
                  {selectedRoute.estimatedTime} {lang === 'ur' ? 'منٹ' : 'mins'}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {lang === 'ur' ? selectedRoute.descriptionUrdu : selectedRoute.description}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600">
                  Rs. {selectedRoute.totalFare}
                </span>
                <span className="text-gray-600">
                  {selectedRoute.steps.filter(s => s.type !== 'walk').length - 1} {lang === 'ur' ? 'تبدیلی' : 'transfers'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">
                {lang === 'ur' ? 'مراحل' : 'Steps'}
              </h4>
              {selectedRoute.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <span className="text-2xl">{step.type === 'walk' ? '🚶' : step.type === 'metro' ? '🚇' : '🚌'}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {lang === 'ur' ? (step.fromUrdu || step.from) : step.from} → {lang === 'ur' ? (step.toUrdu || step.to) : step.to}
                    </p>
                    <p className="text-sm text-gray-600">
                      {step.time} {lang === 'ur' ? 'منٹ' : 'mins'} • {step.distance.toFixed(1)} km
                      {step.fare > 0 && ` • Rs. ${step.fare}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                handleSelectSuggestion(selectedRoute);
                setShowRouteSheet(false);
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {lang === 'ur' ? 'یہ راستہ استعمال کریں' : 'Use This Route'}
            </button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};

export default BestRoutePage;

