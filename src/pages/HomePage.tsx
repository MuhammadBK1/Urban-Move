/**
 * =====================================================
 * HOME PAGE - COMMUTER DASHBOARD
 * =====================================================
 * 
 * Main page with full-screen map showing:
 * - Metro Bus & Orange Line stations
 * - Feeder routes with live vehicle simulation
 * - Interactive route selection
 * =====================================================
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Route, LiveLocation, Coordinate } from '../types';
import { t, CONFIG, TRANSLATIONS } from '../constants';
import { useApp } from '../context/AppContext';
import { MapView, RouteCard, SettingsPanel } from '../components';
import { RouteFinder, RouteSuggestionCard } from '../components/RouteFinder';
import { RouteSuggestion } from '../services/routeFinderService';
import { 
  DEMO_ROUTES, 
  getDemoLocations, 
  initDemoVehicles, 
  updateDemoVehicles 
} from '../services/demoService';
import { fetchRoutes, subscribeToLiveLocations } from '../firebase/operations';
import { isFirebaseConfigured } from '../firebase/config';
import { calculateDistance } from '../services/mapService';

// Import feeder routes data for route list
import feederRoutesData from '../data/feederRoutes.json';
import stationsData from '../data/stations.json';

// =====================================================
// COMPONENT
// =====================================================

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings, isLoading, userLocation } = useApp();
  const lang = settings.language;

  // State
  const [routes, setRoutes] = useState<Route[]>([]);
  const [liveLocations, setLiveLocations] = useState<LiveLocation[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [routesLoading, setRoutesLoading] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [routeSuggestions, setRouteSuggestions] = useState<RouteSuggestion[]>([]);
  const [showRouteFinder, setShowRouteFinder] = useState(false);
  const [routeStart, setRouteStart] = useState<Coordinate | null>(null);
  const [routeDestination, setRouteDestination] = useState<Coordinate | null>(null);

  // =====================================================
  // LOAD ROUTES (from JSON data)
  // =====================================================

  useEffect(() => {
    const loadRoutes = async () => {
      setRoutesLoading(true);
      
      // Convert feeder routes to Route type
      const feederRoutes: Route[] = feederRoutesData.routes.map(route => ({
        id: route.id,
        name: route.name,
        nameUrdu: route.nameUrdu,
        startPoint: route.waypoints[0].name,
        endPoint: route.waypoints[route.waypoints.length - 1].name,
        waypoints: route.waypoints.map(wp => ({ lat: wp.lat, lng: wp.lng })),
        color: route.color,
        vehicleType: route.vehicleType as 'metro' | 'orange-line' | 'bus',
        averageSpeed: route.avgSpeed,
        fare: route.fare,
        isActive: true,
        createdAt: Date.now(),
      }));
      
      // Always use local feeder routes (real data)
      // Add Firebase routes if configured, otherwise use simulated routes
      if (!isFirebaseConfigured()) {
        // Use local data + simulated routes for vehicles
        setRoutes([...feederRoutes, ...DEMO_ROUTES]);
        initDemoVehicles();
        setRoutesLoading(false);
      } else {
        // Fetch from Firebase and merge with local
        try {
          const firebaseRoutes = await fetchRoutes();
          setRoutes([...feederRoutes, ...(firebaseRoutes.length > 0 ? firebaseRoutes : DEMO_ROUTES)]);
        } catch (error) {
          console.error('Error fetching routes:', error);
          setRoutes([...feederRoutes, ...DEMO_ROUTES]);
        }
        setRoutesLoading(false);
      }
    };

    loadRoutes();
  }, []);

  // =====================================================
  // LOAD LIVE LOCATIONS
  // =====================================================

  useEffect(() => {
    if (!selectedRouteId) {
      setLiveLocations([]);
      return;
    }

    if (!isFirebaseConfigured()) {
      // Firebase not configured - use simulated vehicle movement
      const updateLocations = () => {
        updateDemoVehicles();
        setLiveLocations(getDemoLocations(selectedRouteId));
      };

      updateLocations();
      const interval = setInterval(updateLocations, CONFIG.DEMO_UPDATE_INTERVAL);
      return () => clearInterval(interval);
    } else {
      // Subscribe to Firebase
      const unsubscribe = subscribeToLiveLocations(selectedRouteId, (locations) => {
        setLiveLocations(locations);
      });
      return unsubscribe;
    }
  }, [selectedRouteId]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRouteId(routeId);
    updateSettings({ selectedRouteId: routeId });
  }, [updateSettings]);

  const handleRouteDetails = useCallback((routeId: string) => {
    navigate(`/route/${routeId}`);
  }, [navigate]);

  const getVehicleCount = useCallback((routeId: string): number => {
    // Get count from feederRoutesData for demo
    const vehicles = feederRoutesData.vehicles.filter(v => v.routeId === routeId);
    return vehicles.length || liveLocations.filter(l => l.routeId === routeId).length;
  }, [liveLocations]);

  // Filter routes based on user location and search query
  const filteredRoutes = React.useMemo(() => {
    // If user is searching, show matching routes
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return routes.filter(route =>
        route.name.toLowerCase().includes(query) ||
        route.nameUrdu.toLowerCase().includes(query) ||
        route.startPoint.toLowerCase().includes(query) ||
        route.endPoint.toLowerCase().includes(query)
      );
    }

    // If no user location, don't show any routes
    if (!userLocation) {
      return [];
    }

    // Get all metro stations
    const allStations = [
      ...stationsData.metroBus.stations,
      ...stationsData.orangeLine.stations
    ];

    // Find routes near user location (within 5km of route waypoints or connected metro stations)
    return routes.filter(route => {
      // Check if user is near any waypoint of the route (within 5km)
      const nearRoute = route.waypoints.some(waypoint => {
        const distance = calculateDistance(userLocation, waypoint);
        return distance <= 5; // 5km radius
      });

      if (nearRoute) return true;

      // Check if user is near a metro station that this route connects to
      const connectedStation = allStations.find(station => {
        // Check if route connects to this station
        const routeData = feederRoutesData.routes.find(r => r.id === route.id);
        if (!routeData) return false;
        
        // Check if route's connectsTo matches this station
        if (routeData.connectsTo === station.id) {
          const distance = calculateDistance(userLocation, {
            lat: station.lat,
            lng: station.lng
          });
          return distance <= 2; // 2km radius for metro stations
        }
        return false;
      });

      return !!connectedStation;
    });
  }, [routes, searchQuery, userLocation]);

  // =====================================================
  // RENDER
  // =====================================================

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-primary">
        <div className="text-center text-white">
          <div className="spinner mx-auto mb-4 border-white border-t-transparent" />
          <p>{t('loading', lang)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-green-700">
          {TRANSLATIONS.appName[lang]}
        </h1>

        <input
          className="w-1/3 px-4 py-2 border rounded-lg"
          placeholder={lang === 'ur' ? 'منزل تلاش کریں...' : 'Search destination...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSidePanel(!showSidePanel)}
            className="md:hidden rounded-full bg-gray-100 p-2"
            aria-label={lang === 'ur' ? 'راستے دکھائیں' : 'Show routes'}
          >
            🗺️
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="rounded-full bg-gray-100 p-2"
            aria-label={lang === 'ur' ? 'ترتیبات' : 'Settings'}
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="grid grid-cols-12 h-full">
          {/* Map Section */}
          <div className="col-span-8 h-full">
            <MapView
              showStations={true}
              showFeederRoutes={true}
              selectedRouteId={selectedRouteId}
              onRouteSelect={handleRouteSelect}
              onVehicleSelect={(vehicleId) => {
                console.log('Vehicle selected:', vehicleId);
              }}
              routeStart={routeStart}
              routeDestination={routeDestination}
              visibleRouteIds={filteredRoutes.map(r => r.id)}
              className="w-full h-full"
            />
          </div>

          {/* Mobile Backdrop */}
          {showSidePanel && (
            <div 
              className="md:hidden fixed inset-0 bg-black/50 z-30"
              onClick={() => setShowSidePanel(false)}
            />
          )}

          {/* Routes List Side Panel */}
          <div className={`col-span-4 overflow-y-auto side-panel flex flex-col ${showSidePanel ? 'open' : ''}`}>
          <div style={{ 
            padding: '16px', 
            borderBottom: '1px solid #eee', 
            display: 'flex', 
            alignItems: 'start', 
            justifyContent: 'space-between' 
          }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                marginBottom: '4px', 
                fontSize: '18px', 
                fontWeight: 600,
                color: '#333'
              }}>
                {routeSuggestions.length > 0 
                  ? (lang === 'ur' ? 'راستے کی تجاویز' : 'Route Suggestions')
                  : showRouteFinder
                  ? (lang === 'ur' ? 'راستہ تلاش کریں' : 'Find Route')
                  : (lang === 'ur' ? 'فیڈر راستے' : 'Feeder Routes')
                }
              </h2>
              <p style={{ 
                margin: 0, 
                fontSize: '14px', 
                color: '#666' 
              }}>
                {routeSuggestions.length > 0
                  ? `${routeSuggestions.length} ${lang === 'ur' ? 'تجاویز' : 'suggestions'}`
                  : showRouteFinder
                  ? (lang === 'ur' ? 'اپنا راستہ تلاش کریں' : 'Find your route')
                  : (lang === 'ur' ? 'اپنا راستہ منتخب کریں' : 'Select your route')
                }
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (showRouteFinder) {
                    setShowRouteFinder(false);
                    setRouteSuggestions([]);
                  } else {
                    setShowRouteFinder(true);
                    setRouteSuggestions([]);
                  }
                }}
                className="px-3 py-1 text-xs bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                title={showRouteFinder 
                  ? (lang === 'ur' ? 'راستے کی فہرست' : 'Route List')
                  : (lang === 'ur' ? 'راستہ تلاش کریں' : 'Find Route')
                }
              >
                {showRouteFinder ? '📋' : '🔍'}
              </button>
              <button
                onClick={() => setShowSidePanel(false)}
                className="md:hidden"
                style={{
                  width: '32px',
                  height: '32px',
                  border: 'none',
                  background: 'transparent',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  color: '#666',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                aria-label={lang === 'ur' ? 'بند کریں' : 'Close'}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Route Finder or Route List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Route Finder */}
            {showRouteFinder && (
              <RouteFinder
                onRoutesFound={(suggestions, start, destination) => {
                  setRouteSuggestions(suggestions);
                  setRouteStart(start);
                  setRouteDestination(destination);
                  setShowRouteFinder(false);
                }}
                onClear={() => {
                  setRouteSuggestions([]);
                  setRouteStart(null);
                  setRouteDestination(null);
                  setShowRouteFinder(false);
                }}
                lang={lang}
                userLocation={userLocation}
              />
            )}

            {/* Route Suggestions */}
            {routeSuggestions.length > 0 && (
              <div className="space-y-3">
                {routeSuggestions.map((suggestion) => (
                  <RouteSuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    lang={lang}
                    onSelect={(suggestion) => {
                      // If suggestion has a feeder route, select it
                      const feederStep = suggestion.steps.find(s => s.routeId);
                      if (feederStep?.routeId) {
                        handleRouteSelect(feederStep.routeId);
                      }
                    }}
                  />
                ))}
              </div>
            )}

            {/* Regular Route List */}
            {!showRouteFinder && routeSuggestions.length === 0 && (
              <>
                {filteredRoutes.length === 0 && !routesLoading ? (
                  <div style={{ textAlign: 'center', padding: '48px 16px', color: '#666' }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🔍</span>
                    <p style={{ marginBottom: '8px', fontWeight: 500 }}>
                      {searchQuery.trim() 
                        ? (lang === 'ur' ? 'کوئی راستہ نہیں ملا' : 'No routes found')
                        : !userLocation
                        ? (lang === 'ur' ? 'مقام فعال کریں یا تلاش کریں' : 'Enable location or search for routes')
                        : (lang === 'ur' ? 'قریب کوئی راستے نہیں ملے' : 'No nearby routes found')
                      }
                    </p>
                    {!searchQuery.trim() && !userLocation && (
                      <p style={{ fontSize: '14px', color: '#999', marginTop: '8px' }}>
                        {lang === 'ur' 
                          ? 'اپنا مقام فعال کریں یا راستہ تلاش کریں' 
                          : 'Enable your location or use the search to find routes'}
                      </p>
                    )}
                  </div>
                ) : (
                  filteredRoutes.map(route => {
                // Calculate ETA (simplified - using average speed and route length)
                const estimatedTime = Math.round((route.waypoints.length * 2) / route.averageSpeed * 60);
                const routeType = route.vehicleType === 'metro' ? 'Metro Bus' : 
                                 route.vehicleType === 'orange-line' ? 'Orange Line' : 
                                 route.vehicleType === 'bus' ? 'Bus' : 'Public Transit';
                
                return (
                  <div
                    key={route.id}
                    className="card p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => handleRouteSelect(route.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">
                        {lang === 'ur' ? route.nameUrdu : route.name}
                      </h3>
                      <span className="bg-green-100 text-green-700 px-2 rounded text-xs font-medium">
                        {routeType}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-1">
                      Rs. {route.fare} · {estimatedTime} {lang === 'ur' ? 'منٹ' : 'mins'}
                    </p>

                    <button
                      className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRouteDetails(route.id);
                      }}
                    >
                      {lang === 'ur' ? 'سفر ٹریک کریں' : 'Track Ride'}
                    </button>
                  </div>
                );
              })
                )}
              </>
            )}
          </div>

          {/* Selected Route Details */}
          {selectedRouteId && routes.find(r => r.id === selectedRouteId) && (
            <div style={{ borderTop: '1px solid #eee', padding: '16px', background: '#f9f9f9' }}>
              <RouteCard
                route={routes.find(r => r.id === selectedRouteId)!}
                vehicleCount={getVehicleCount(selectedRouteId)}
                isSelected={true}
                onClick={() => handleRouteDetails(selectedRouteId)}
              />
            </div>
          )}
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </div>
  );
};

export default HomePage;
