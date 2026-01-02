/**
 * =====================================================
 * MAP VIEW COMPONENT - Mapbox GL JS Implementation
 * =====================================================
 * 
 * Full-featured map component for Urban-Move dashboard:
 * - Metro Bus & Orange Line stations
 * - Feeder routes with GeoJSON polylines
 * - Real-time vehicle simulation
 * - Interactive popups
 * - User location tracking
 * 
 * Migrated from Google Maps to Mapbox GL JS
 * @author Urban-Move Team
 * =====================================================
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import toast from 'react-hot-toast';
import { Coordinate } from '../../types';
import { useApp } from '../../context/AppContext';

// Import station and route data
import stationsData from '../../data/stations.json';
import feederRoutesData from '../../data/feederRoutes.json';

// Import transit vehicle simulation
import {
  initializeTransitVehicles,
  updateTransitVehiclePositions,
  clearTransitVehicles,
} from '../../services/transitVehicleSimulation';

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface Station {
  id: string;
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
}

interface TransitLine {
  name: string;
  nameUrdu: string;
  color: string;
  icon: string;
  stations: Station[];
}

interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

interface FeederRoute {
  id: string;
  name: string;
  nameUrdu: string;
  vehicleType: 'metro' | 'orange-line' | 'bus';
  color: string;
  fare: number;
  avgSpeed: number;
  frequency: string;
  connectsTo: string;
  waypoints: Waypoint[];
}

interface Vehicle {
  id: string;
  routeId: string;
  plateNumber: string;
  driverName: string;
  vehicleType: string;
  capacity: number;
  currentOccupancy: number;
  crowdedness: 'low' | 'moderate' | 'full';
}

interface SimulatedVehicle extends Vehicle {
  currentPosition: [number, number]; // [lng, lat] for Mapbox
  waypointIndex: number;
  progress: number;
  eta: number;
  marker?: mapboxgl.Marker;
}

// =====================================================
// CONSTANTS
// =====================================================

const LAHORE_CENTER: [number, number] = [74.3587, 31.5204]; // [lng, lat]
const DEFAULT_ZOOM = 12;
const VEHICLE_UPDATE_INTERVAL = 3000; // 3 seconds
const TRANSIT_UPDATE_INTERVAL = 4000; // 4 seconds (between 3-5)

const VEHICLE_ICONS: Record<string, string> = {
  metro: '🚌',
  'orange-line': '🚇',
  bus: '🚌',
};

const TRANSIT_VEHICLE_ICONS: Record<string, string> = {
  'metro-bus': '🚌',
  'orange-line': '🚇',
  'bus': '🚌',
};

const CROWDEDNESS_COLORS: Record<string, string> = {
  low: '#4CAF50',
  moderate: '#FF9800',
  full: '#F44336',
};

const CROWDEDNESS_LABELS = {
  low: { en: 'Available', ur: 'خالی' },
  moderate: { en: 'Moderate', ur: 'معتدل' },
  full: { en: 'Full', ur: 'بھرا' },
};

// Mapbox style options - using standard style URL
// Alternative styles: 'mapbox://styles/mapbox/light-v11', 'mapbox://styles/mapbox/dark-v11'
const MAPBOX_STYLE = 'mapbox://styles/mapbox/streets-v12';

// =====================================================
// COMPONENT PROPS
// =====================================================

interface MapViewProps {
  onRouteSelect?: (routeId: string) => void;
  onVehicleSelect?: (vehicleId: string) => void;
  showStations?: boolean;
  showFeederRoutes?: boolean;
  selectedRouteId?: string | null;
  className?: string;
  // Route finding props
  routeStart?: Coordinate | null;
  routeDestination?: Coordinate | null;
  // Filter visible routes
  visibleRouteIds?: string[];
  // Mapbox route option (for Uber-style routing)
  selectedRouteOption?: {
    id: string;
    geometry: GeoJSON.LineString;
    distance: number;
    duration: number;
  } | null;
  // Callback when route is selected
  onRouteOptionSelect?: (routeId: string) => void;
  // Multi-modal route for highlighting
  selectedMultiModalRoute?: {
    steps: Array<{
      type: 'walk' | 'speedo' | 'metro';
      from: Coordinate;
      to: Coordinate;
      fromName: string;
      toName: string;
    }>;
    transferPoints: Array<{
      location: Coordinate;
      name: string;
      type: 'speedo-stop' | 'metro-station';
    }>;
  } | null;
}

// =====================================================
// MAP VIEW COMPONENT
// =====================================================

export const MapView: React.FC<MapViewProps> = ({
  onRouteSelect,
  onVehicleSelect,
  showStations = true,
  showFeederRoutes = true,
  selectedRouteId = null,
  className = '',
  routeStart = null,
  routeDestination = null,
  visibleRouteIds,
  selectedRouteOption = null,
  onRouteOptionSelect: _onRouteOptionSelect = undefined,
  selectedMultiModalRoute = null,
}) => {
  // TEMPORARY DEBUG: Log environment variables at component level
  console.log('🔍 MapView Component - Environment Check:');
  console.log('VITE_MAPBOX_ACCESS_TOKEN:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
  console.log('Token exists:', !!import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
  console.log('Token type:', typeof import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
  console.log('Token length:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN?.length);
  console.log('All VITE_ env vars:', Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
  
  // Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const stationMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const vehicleMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const simulationIntervalRef = useRef<number | null>(null);
  const activePopupRef = useRef<mapboxgl.Popup | null>(null);
  const vehiclesDataRef = useRef<Map<string, SimulatedVehicle>>(new Map());
  // Transit vehicle refs (buses and metro)
  const transitVehicleMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const transitSimulationIntervalRef = useRef<number | null>(null);
  // Route finding refs
  const startMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const routeLayerRef = useRef<string | null>(null);

  // State
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Context
  const { settings, userLocation, locationPermissionGranted } = useApp();
  const lang = settings.language;

  // =====================================================
  // INITIALIZE MAPBOX
  // =====================================================

  useEffect(() => {
    // Check environment variable first
    
    const initMap = () => {
      if (!mapContainerRef.current) {
        console.warn('Map container ref is not available');
        return;
      }

      // Check if container has dimensions
      const container = mapContainerRef.current;
      if (container.offsetWidth === 0 || container.offsetHeight === 0) {
        console.warn('Map container has no dimensions, retrying...');
        setTimeout(initMap, 100);
        return;
      }

      // Try to get token from environment variable
      let accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
      
      // TEMPORARY FALLBACK: If env var is not available, use hardcoded token
      // TODO: Remove this fallback once env vars are working
      if (!accessToken || accessToken.trim() === '') {
        console.warn('⚠️ VITE_MAPBOX_ACCESS_TOKEN not found in env, using fallback token');
        accessToken = 'pk.eyJ1Ijoic2NybWFyc2hhbGwxIiwiYSI6ImNtanN0cTV6MDEwZm0zZXFzMGRkeG1yMmsifQ.sCfQPBG2QMA7HLLG4cMRTg';
      }
      
      // TEMPORARY DEBUG: Log the raw token value
      console.log('🔍 DEBUG - Raw token from import.meta.env:', import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
      console.log('🔍 DEBUG - Using token:', accessToken ? accessToken.substring(0, 20) + '...' : 'NONE');

      if (!accessToken || accessToken.trim() === '') {
        setMapError('Mapbox access token not configured. Add VITE_MAPBOX_ACCESS_TOKEN to your .env file. Make sure to restart the dev server after adding it.');
        console.error('❌ Mapbox access token is missing or empty');
        console.error('Token value:', accessToken);
        console.error('Token type:', typeof accessToken);
        console.error('💡 TIP: Restart the dev server (Ctrl+C then npm run dev) after updating .env file');
        return;
      }

      // Clean the token (remove any newlines or extra whitespace)
      const cleanToken = accessToken.trim().replace(/\s+/g, '');
      
      // Validate token format (should start with pk. or sk.)
      if (!cleanToken.startsWith('pk.') && !cleanToken.startsWith('sk.')) {
        setMapError('Invalid Mapbox token format. Token should start with "pk." or "sk."');
        console.error('Invalid token format:', cleanToken.substring(0, 20) + '...');
        return;
      }

      console.log('Using Mapbox token (first 20 chars):', cleanToken.substring(0, 20) + '...');

      // Set Mapbox access token
      mapboxgl.accessToken = cleanToken;

      try {
        // Create map instance
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: MAPBOX_STYLE,
          center: LAHORE_CENTER,
          zoom: DEFAULT_ZOOM,
          attributionControl: false,
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add attribution in bottom-right
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

        // Wait for map to load
        map.on('load', () => {
          mapRef.current = map;
          setMapLoaded(true);
          console.log('✅ Mapbox map initialized successfully');
          console.log('Map container dimensions:', {
            width: mapContainerRef.current?.offsetWidth,
            height: mapContainerRef.current?.offsetHeight
          });

          // Add sources and layers for routes
          addRouteSources(map);
        });

        map.on('error', (e: any) => {
          console.error('Mapbox error:', e);
          const errorMessage = e?.error?.message || e?.message || 'Unknown error';
          console.error('Error details:', errorMessage);
          console.error('Full error object:', JSON.stringify(e, null, 2));
          setMapError(`Failed to load map: ${errorMessage}. Please check your Mapbox token and ensure it has the correct scopes.`);
        });

        // Also listen for style loading errors
        map.on('style.load', () => {
          console.log('✅ Map style loaded');
        });

        map.on('style.error', (e: any) => {
          console.error('Map style error:', e);
          setMapError(`Failed to load map style: ${e?.error?.message || 'Unknown error'}. Please check your Mapbox token.`);
        });

      } catch (error: any) {
        console.error('❌ Failed to initialize Mapbox:', error);
        const errorMessage = error?.message || 'Unknown error';
        setMapError(`Failed to initialize Mapbox: ${errorMessage}. Please check your access token.`);
      }
    };

    initMap();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  // =====================================================
  // ADD ROUTE SOURCES AND LAYERS
  // =====================================================

  const addRouteSources = (map: mapboxgl.Map) => {
    // Add Metro Bus route source
    const metroBusCoords = stationsData.metroBus.stations.map(s => [s.lng, s.lat]);
    map.addSource('metro-bus-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { name: 'Metro Bus' },
        geometry: {
          type: 'LineString',
          coordinates: metroBusCoords,
        },
      },
    });

    // Add Metro Bus layer
    map.addLayer({
      id: 'metro-bus-line',
      type: 'line',
      source: 'metro-bus-route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': stationsData.metroBus.color,
        'line-width': 5,
        'line-opacity': 0.8,
      },
    });

    // Add Orange Line route source
    const orangeLineCoords = stationsData.orangeLine.stations.map(s => [s.lng, s.lat]);
    map.addSource('orange-line-route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: { name: 'Orange Line' },
        geometry: {
          type: 'LineString',
          coordinates: orangeLineCoords,
        },
      },
    });

    // Add Orange Line layer
    map.addLayer({
      id: 'orange-line',
      type: 'line',
      source: 'orange-line-route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': stationsData.orangeLine.color,
        'line-width': 5,
        'line-opacity': 0.8,
      },
    });

    // Add feeder routes (only if visibleRouteIds is not provided, or route is in the list)
    (feederRoutesData.routes as FeederRoute[]).forEach((route) => {
      // Filter routes: if visibleRouteIds is provided, only show those routes
      if (visibleRouteIds && !visibleRouteIds.includes(route.id)) {
        return; // Skip this route
      }
      
      const coordinates = route.waypoints.map(wp => [wp.lng, wp.lat]);

      map.addSource(`feeder-${route.id}`, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {
            id: route.id,
            name: route.name,
            nameUrdu: route.nameUrdu,
            color: route.color,
            vehicleType: route.vehicleType,
            fare: route.fare,
            frequency: route.frequency,
          },
          geometry: {
            type: 'LineString',
            coordinates,
          },
        },
      });

      map.addLayer({
        id: `feeder-line-${route.id}`,
        type: 'line',
        source: `feeder-${route.id}`,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': route.color,
          'line-width': 4,
          'line-opacity': 0.7,
          'line-dasharray': [2, 1],
        },
      });

      // Add click handler for feeder routes
      map.on('click', `feeder-line-${route.id}`, (e) => {
        onRouteSelect?.(route.id);
        showRoutePopup(route, e.lngLat);
      });

      // Change cursor on hover
      map.on('mouseenter', `feeder-line-${route.id}`, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', `feeder-line-${route.id}`, () => {
        map.getCanvas().style.cursor = '';
      });
    });
  };

  // =====================================================
  // UPDATE ROUTE VISIBILITY
  // =====================================================

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Update visibility of feeder route layers based on visibleRouteIds
    (feederRoutesData.routes as FeederRoute[]).forEach((route) => {
      const layerId = `feeder-line-${route.id}`;
      if (mapRef.current?.getLayer(layerId)) {
        const shouldShow = !visibleRouteIds || visibleRouteIds.includes(route.id);
        mapRef.current.setLayoutProperty(layerId, 'visibility', shouldShow ? 'visible' : 'none');
      }
    });
  }, [mapLoaded, visibleRouteIds]);

  // =====================================================
  // UPDATE USER MARKER
  // =====================================================

  const updateUserMarker = useCallback((location: { lat: number; lng: number }, accuracy?: number | boolean, shouldCenter: boolean = false) => {
    // Handle legacy calls where accuracy might be boolean (shouldCenter)
    let actualAccuracy: number | undefined = undefined;
    let actualShouldCenter = shouldCenter;
    
    if (typeof accuracy === 'boolean') {
      actualShouldCenter = accuracy;
    } else {
      actualAccuracy = accuracy;
    }
    if (!mapRef.current) return;

    const userPos: [number, number] = [location.lng, location.lat];

    // Remove existing marker and accuracy circle
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    
    // Remove accuracy circle if exists
    if (mapRef.current.getSource('user-accuracy')) {
      mapRef.current.removeLayer('user-accuracy-circle');
      mapRef.current.removeSource('user-accuracy');
    }

    // Add accuracy circle if accuracy provided
    if (actualAccuracy && actualAccuracy > 0) {
      const accuracyKm = actualAccuracy / 1000; // Convert meters to km
      const radius = accuracyKm * 111; // Approximate km to degrees
      
      // Create circle using GeoJSON
      const circle = {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: userPos,
        },
        properties: {
          radius,
        },
      };

      if (!mapRef.current.getSource('user-accuracy')) {
        mapRef.current.addSource('user-accuracy', {
          type: 'geojson',
          data: circle,
        });

        mapRef.current.addLayer({
          id: 'user-accuracy-circle',
          type: 'circle',
          source: 'user-accuracy',
          paint: {
            'circle-radius': {
              stops: [
                [0, 0],
                [20, radius * 100000], // Scale based on zoom
              ],
              base: 2,
            },
            'circle-color': '#4285F4',
            'circle-opacity': 0.1,
            'circle-stroke-color': '#4285F4',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 0.3,
          },
        });
      } else {
        (mapRef.current.getSource('user-accuracy') as mapboxgl.GeoJSONSource).setData(circle);
      }
    }

    // Create user marker element
    const el = document.createElement('div');
    el.className = 'user-location-marker';
    el.innerHTML = `
      <div style="
        width: 24px;
        height: 24px;
        background: #4285F4;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <div style="
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(66, 133, 244, 0.2);
          border-radius: 50%;
          top: -8px;
          left: -8px;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `;

    userMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat(userPos)
      .addTo(mapRef.current);

    // Center map on user location if requested
    if (actualShouldCenter && mapLoaded) {
      mapRef.current.flyTo({
        center: userPos,
        zoom: 15,
        duration: 1000,
      });
    }

    setLocationError(null);
  }, [mapLoaded]);

  // =====================================================
  // REQUEST USER LOCATION (fallback if not in context)
  // =====================================================

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Center map when location is first obtained
        const shouldCenter = !hasCenteredOnUser.current;
        updateUserMarker(location, position.coords.accuracy, shouldCenter);
        if (shouldCenter) {
          hasCenteredOnUser.current = true;
        }
      },
      (error) => {
        console.warn('Location error:', error.message);
        if (error.code === 1) {
          toast('Location access denied. Showing Lahore.', {
            icon: '⚠️',
            duration: 4000,
          });
        } else {
          toast.error('Unable to get your location. Showing Lahore.');
        }
        setLocationError(
          error.code === 1
            ? 'Location permission denied. Using Lahore as default.'
            : 'Unable to get your location. Using Lahore as default.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [updateUserMarker]);

  // =====================================================
  // USE LOCATION FROM CONTEXT
  // =====================================================

  const hasCenteredOnUser = useRef(false);

  useEffect(() => {
    if (!mapLoaded) return;

    if (userLocation && locationPermissionGranted) {
      // Use location from context and center map on first load
      const shouldCenter = !hasCenteredOnUser.current;
      updateUserMarker(userLocation, undefined, shouldCenter);
      if (shouldCenter) {
        hasCenteredOnUser.current = true;
      }
    } else if (!userLocation && !locationError) {
      // Request location if not available from context and no error yet
      requestUserLocation();
    }
  }, [userLocation, mapLoaded, locationError, locationPermissionGranted, updateUserMarker, requestUserLocation]);

  // =====================================================
  // RENDER STATIONS
  // =====================================================

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !showStations) return;

    // Clear existing station markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    stationMarkersRef.current.clear();

    // Render Metro Bus stations
    renderStationMarkers(stationsData.metroBus as TransitLine);

    // Render Orange Line stations
    renderStationMarkers(stationsData.orangeLine as TransitLine);

  }, [mapLoaded, showStations, lang]);

  const renderStationMarkers = (line: TransitLine) => {
    if (!mapRef.current) return;

    line.stations.forEach((station) => {
      // Create marker element
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.innerHTML = `
        <div style="
          width: 28px;
          height: 28px;
          background: white;
          border: 3px solid ${line.color};
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">${line.icon}</div>
      `;

      // Create popup
      const popupContent = createStationPopupContent(station, line);
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: true })
        .setHTML(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([station.lng, station.lat])
        .setPopup(popup)
        .addTo(mapRef.current!);

      stationMarkersRef.current.set(station.id, marker);
    });
  };

  // =====================================================
  // VEHICLE SIMULATION
  // =====================================================

  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !showFeederRoutes) return;

    // Initialize vehicles
    initializeVehicles();

    // Start simulation
    simulationIntervalRef.current = window.setInterval(() => {
      updateVehiclePositions();
    }, VEHICLE_UPDATE_INTERVAL);

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [mapLoaded, showFeederRoutes, lang, visibleRouteIds]);

  const initializeVehicles = () => {
    if (!mapRef.current) return;

    // Clear existing vehicle markers
    vehicleMarkersRef.current.forEach((marker) => marker.remove());
    vehicleMarkersRef.current.clear();
    vehiclesDataRef.current.clear();

    // Create simulated vehicles (only for visible routes)
    (feederRoutesData.vehicles as Vehicle[]).forEach((vehicle, index) => {
      // Filter by visible routes if provided
      if (visibleRouteIds && !visibleRouteIds.includes(vehicle.routeId)) {
        return; // Skip vehicles for non-visible routes
      }
      
      const route = (feederRoutesData.routes as FeederRoute[]).find(
        (r) => r.id === vehicle.routeId
      );
      if (!route) return;

      // Random starting position
      const startIndex = index % route.waypoints.length;
      const startPos = route.waypoints[startIndex];

      const simVehicle: SimulatedVehicle = {
        ...vehicle,
        currentPosition: [startPos.lng, startPos.lat],
        waypointIndex: startIndex,
        progress: 0,
        eta: calculateInitialETA(route, startIndex),
      };

      // Create marker element
      const el = createVehicleMarkerElement(vehicle, route);

      // Create marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(simVehicle.currentPosition)
        .addTo(mapRef.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onVehicleSelect?.(vehicle.id);
        showVehiclePopup(simVehicle, route);
      });

      simVehicle.marker = marker;
      vehicleMarkersRef.current.set(vehicle.id, marker);
      vehiclesDataRef.current.set(vehicle.id, simVehicle);
    });
  };

  const createVehicleMarkerElement = (vehicle: Vehicle, route: FeederRoute): HTMLDivElement => {
    const icon = VEHICLE_ICONS[vehicle.vehicleType] || '🚗';
    const borderColor = CROWDEDNESS_COLORS[vehicle.crowdedness];

    const el = document.createElement('div');
    el.className = 'vehicle-marker';
    el.style.cssText = `
      width: 40px;
      height: 40px;
      background: white;
      border: 4px solid ${borderColor};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    `;
    el.innerHTML = icon;
    el.title = `${vehicle.plateNumber} - ${route.name}`;

    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.15)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });

    return el;
  };

  const updateVehiclePositions = () => {
    vehiclesDataRef.current.forEach((vehicle, vehicleId) => {
      const route = (feederRoutesData.routes as FeederRoute[]).find(
        (r) => r.id === vehicle.routeId
      );
      if (!route) return;

      // Calculate movement
      const currentWaypoint = route.waypoints[vehicle.waypointIndex];
      const nextIndex = (vehicle.waypointIndex + 1) % route.waypoints.length;
      const nextWaypoint = route.waypoints[nextIndex];

      // Progress along segment
      vehicle.progress += 0.15 + Math.random() * 0.1;

      if (vehicle.progress >= 1) {
        vehicle.progress = 0;
        vehicle.waypointIndex = nextIndex;
      }

      // Interpolate position
      const newLng = currentWaypoint.lng + (nextWaypoint.lng - currentWaypoint.lng) * vehicle.progress;
      const newLat = currentWaypoint.lat + (nextWaypoint.lat - currentWaypoint.lat) * vehicle.progress;

      vehicle.currentPosition = [newLng, newLat];
      vehicle.eta = calculateETA(route, vehicle.waypointIndex, vehicle.progress);

      // Update marker position
      const marker = vehicleMarkersRef.current.get(vehicleId);
      if (marker) {
        marker.setLngLat(vehicle.currentPosition);
      }

      vehiclesDataRef.current.set(vehicleId, vehicle);
    });
  };

  // =====================================================
  // POPUP HELPERS
  // =====================================================

  const createStationPopupContent = (station: Station, line: TransitLine): string => {
    const name = lang === 'ur' ? station.nameUrdu : station.name;
    const lineName = lang === 'ur' ? line.nameUrdu : line.name;
    
    return `
      <div style="padding: 8px; min-width: 180px; font-family: system-ui, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 22px;">${line.icon}</span>
          <div>
            <strong style="font-size: 14px; color: #333;">${name}</strong>
            <div style="font-size: 11px; color: ${line.color}; font-weight: 500;">${lineName}</div>
          </div>
        </div>
        <div style="font-size: 11px; color: #666;">
          ${lang === 'ur' ? 'میٹرو اسٹیشن' : 'Metro Station'}
        </div>
      </div>
    `;
  };

  const showRoutePopup = (route: FeederRoute, lngLat: mapboxgl.LngLat) => {
    if (!mapRef.current) return;

    // Close existing popup
    if (activePopupRef.current) {
      activePopupRef.current.remove();
    }

    const name = lang === 'ur' ? route.nameUrdu : route.name;
    const icon = VEHICLE_ICONS[route.vehicleType];

    const content = `
      <div style="padding: 10px; min-width: 200px; font-family: system-ui, sans-serif;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 26px;">${icon}</span>
          <div>
            <strong style="font-size: 13px; color: #333;">${name}</strong>
            <div style="font-size: 11px; color: ${route.color}; font-weight: 500;">
              ${route.vehicleType.charAt(0).toUpperCase() + route.vehicleType.slice(1)}
            </div>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
          <div>
            <div style="color: #888;">${lang === 'ur' ? 'کرایہ' : 'Fare'}</div>
            <div style="color: #1B5E20; font-weight: bold;">Rs. ${route.fare}</div>
          </div>
          <div>
            <div style="color: #888;">${lang === 'ur' ? 'فریکوئنسی' : 'Frequency'}</div>
            <div style="font-weight: 500;">${route.frequency}</div>
          </div>
        </div>
      </div>
    `;

    activePopupRef.current = new mapboxgl.Popup({ closeButton: true })
      .setLngLat(lngLat)
      .setHTML(content)
      .addTo(mapRef.current);
  };

  const showVehiclePopup = (vehicle: SimulatedVehicle, route: FeederRoute) => {
    if (!mapRef.current) return;

    // Close existing popup
    if (activePopupRef.current) {
      activePopupRef.current.remove();
    }

    const routeName = lang === 'ur' ? route.nameUrdu : route.name;
    const icon = VEHICLE_ICONS[vehicle.vehicleType] || '🚗';
    const crowdLabel = CROWDEDNESS_LABELS[vehicle.crowdedness][lang === 'ur' ? 'ur' : 'en'];
    const crowdColor = CROWDEDNESS_COLORS[vehicle.crowdedness];

    const content = `
      <div style="padding: 10px; min-width: 220px; font-family: system-ui, sans-serif;">
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <span style="font-size: 28px;">${icon}</span>
          <div>
            <strong style="font-size: 14px; color: #333;">${vehicle.plateNumber}</strong>
            <div style="font-size: 11px; color: #666;">${vehicle.driverName}</div>
          </div>
        </div>
        
        <div style="background: #f5f5f5; padding: 8px; border-radius: 6px; margin-bottom: 8px;">
          <div style="font-size: 10px; color: #888; margin-bottom: 2px;">${lang === 'ur' ? 'راستہ' : 'Route'}</div>
          <div style="font-size: 12px; font-weight: 500; color: ${route.color};">${routeName}</div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; text-align: center;">
          <div>
            <div style="font-size: 18px; font-weight: bold; color: #1B5E20;">${vehicle.eta}</div>
            <div style="font-size: 9px; color: #888;">${lang === 'ur' ? 'منٹ' : 'min'}</div>
          </div>
          <div>
            <div style="font-size: 13px; font-weight: bold; color: #333;">${vehicle.currentOccupancy}/${vehicle.capacity}</div>
            <div style="font-size: 9px; color: #888;">${lang === 'ur' ? 'سیٹیں' : 'seats'}</div>
          </div>
          <div>
            <div style="font-size: 11px; font-weight: bold; color: ${crowdColor};">${crowdLabel}</div>
            <div style="font-size: 9px; color: #888;">${lang === 'ur' ? 'حالت' : 'status'}</div>
          </div>
        </div>
      </div>
    `;

    activePopupRef.current = new mapboxgl.Popup({ closeButton: true, offset: 25 })
      .setLngLat(vehicle.currentPosition)
      .setHTML(content)
      .addTo(mapRef.current);
  };

  // =====================================================
  // UTILITY FUNCTIONS
  // =====================================================

  const calculateInitialETA = (route: FeederRoute, waypointIndex: number): number => {
    const remainingWaypoints = route.waypoints.length - waypointIndex;
    const avgTimePerWaypoint = (route.waypoints.length * 2) / route.avgSpeed * 60;
    return Math.round(remainingWaypoints * avgTimePerWaypoint / route.waypoints.length);
  };

  const calculateETA = (route: FeederRoute, waypointIndex: number, progress: number): number => {
    const remainingWaypoints = route.waypoints.length - waypointIndex - progress;
    const avgTimePerWaypoint = (route.waypoints.length * 2) / route.avgSpeed * 60;
    return Math.max(1, Math.round(remainingWaypoints * avgTimePerWaypoint / route.waypoints.length));
  };

  const cleanup = () => {
    // Stop feeder vehicle simulation
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    // Stop transit vehicle simulation
    if (transitSimulationIntervalRef.current) {
      clearInterval(transitSimulationIntervalRef.current);
      transitSimulationIntervalRef.current = null;
    }

    // Remove markers
    stationMarkersRef.current.forEach((marker) => marker.remove());
    vehicleMarkersRef.current.forEach((marker) => marker.remove());
    userMarkerRef.current?.remove();

    // Remove transit vehicle markers
    transitVehicleMarkersRef.current.forEach((marker) => marker.remove());
    transitVehicleMarkersRef.current.clear();
    clearTransitVehicles();

    // Close popup
    activePopupRef.current?.remove();

    // Clean up route markers before destroying map
    startMarkerRef.current?.remove();
    destinationMarkerRef.current?.remove();
    const currentMap = mapRef.current;
    if (routeLayerRef.current && currentMap) {
      const layerId = routeLayerRef.current;
      try {
        if (currentMap.getLayer(layerId)) {
          currentMap.removeLayer(layerId);
        }
        const sourceId = 'route-source';
        if (currentMap.getSource(sourceId)) {
          currentMap.removeSource(sourceId);
        }
      } catch (e) {
        // Map may already be destroyed
        console.warn('Error cleaning up route layer:', e);
      }
    }

    // Destroy map
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    stationMarkersRef.current.clear();
    vehicleMarkersRef.current.clear();
    vehiclesDataRef.current.clear();
  };

  const centerOnUser = useCallback(() => {
    if (mapRef.current && userLocation) {
      // Use location from context
      mapRef.current.flyTo({
        center: [userLocation.lng, userLocation.lat],
        zoom: 15,
        duration: 1000,
      });
    } else if (mapRef.current && userMarkerRef.current) {
      // Fallback to marker position
      const lngLat = userMarkerRef.current.getLngLat();
      mapRef.current.flyTo({
        center: [lngLat.lng, lngLat.lat],
        zoom: 15,
        duration: 1000,
      });
    } else {
      // Request location if not available
      requestUserLocation();
    }
  }, [userLocation, requestUserLocation]);

  const fitAllRoutes = useCallback(() => {
    if (!mapRef.current) return;

    // Calculate bounds including all routes
    const bounds = new mapboxgl.LngLatBounds();

    (feederRoutesData.routes as FeederRoute[]).forEach((route) => {
      route.waypoints.forEach((wp) => {
        bounds.extend([wp.lng, wp.lat]);
      });
    });

    // Include stations
    stationsData.metroBus.stations.forEach((s) => {
      bounds.extend([s.lng, s.lat]);
    });
    stationsData.orangeLine.stations.forEach((s) => {
      bounds.extend([s.lng, s.lat]);
    });

    mapRef.current.fitBounds(bounds, {
      padding: 50,
      duration: 1000,
    });
  }, []);

  // =====================================================
  // TRANSIT VEHICLE SIMULATION (BUSES & METRO)
  // =====================================================

  // Initialize transit vehicles
  const initializeTransitVehiclesOnMap = useCallback(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Clear existing transit vehicle markers
    transitVehicleMarkersRef.current.forEach((marker) => marker.remove());
    transitVehicleMarkersRef.current.clear();

    // Initialize vehicles
    const vehicles = initializeTransitVehicles();

    // Create markers for each vehicle
    vehicles.forEach((vehicle) => {
      const icon = TRANSIT_VEHICLE_ICONS[vehicle.type] || '🚌';
      const vehicleTypeLabel = vehicle.type === 'metro-bus' 
        ? (lang === 'ur' ? 'میٹرو بس' : 'Metro Bus')
        : vehicle.type === 'orange-line'
        ? (lang === 'ur' ? 'اورنج لائن' : 'Orange Line')
        : (lang === 'ur' ? 'بس' : 'Bus');

      // Create marker element
      const el = document.createElement('div');
      el.className = 'transit-vehicle-marker';
      el.style.cssText = `
        width: 36px;
        height: 36px;
        background: white;
        border: 3px solid ${vehicle.type === 'orange-line' ? '#FF6F00' : vehicle.type === 'metro-bus' ? '#E53935' : '#2196F3'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: transform 0.2s;
        position: relative;
      `;
      el.innerHTML = icon;

      // Add "Live (Simulated)" badge
      const badge = document.createElement('div');
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #FF9800;
        color: white;
        font-size: 8px;
        font-weight: bold;
        padding: 2px 4px;
        border-radius: 4px;
        white-space: nowrap;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      `;
      badge.textContent = lang === 'ur' ? 'زندہ (نقل)' : 'Live (Sim)';
      el.appendChild(badge);

      el.title = `${vehicle.vehicleNumber || vehicle.id} - ${vehicle.routeName}`;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.15)';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup content
      const popupContent = `
        <div style="padding: 8px; min-width: 150px;">
          <div style="font-weight: 600; font-size: 14px; color: #333; margin-bottom: 4px;">
            ${vehicle.vehicleNumber || vehicle.id}
          </div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">
            ${vehicleTypeLabel}
          </div>
          <div style="font-size: 11px; color: #888; margin-bottom: 6px;">
            ${lang === 'ur' ? vehicle.routeNameUrdu : vehicle.routeName}
          </div>
          <div style="
            background: #FF9800;
            color: white;
            font-size: 10px;
            font-weight: bold;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-top: 4px;
          ">
            ${lang === 'ur' ? 'زندہ (نقل)' : 'Live (Simulated)'}
          </div>
        </div>
      `;

      // Create marker
      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(vehicle.currentPosition)
        .setPopup(
          new mapboxgl.Popup({ offset: 25, closeButton: true })
            .setHTML(popupContent)
        )
        .addTo(mapRef.current!);

      transitVehicleMarkersRef.current.set(vehicle.id, marker);
    });
  }, [mapLoaded, lang]);

  // Update transit vehicle positions
  const updateTransitVehiclePositionsOnMap = useCallback(() => {
    if (!mapRef.current) return;

    const vehicles = updateTransitVehiclePositions();

    vehicles.forEach((vehicle) => {
      const marker = transitVehicleMarkersRef.current.get(vehicle.id);
      if (marker) {
        marker.setLngLat(vehicle.currentPosition);
      }
    });
  }, []);

  // Effect to initialize and update transit vehicles
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    // Initialize transit vehicles
    initializeTransitVehiclesOnMap();

    // Start simulation
    transitSimulationIntervalRef.current = window.setInterval(() => {
      updateTransitVehiclePositionsOnMap();
    }, TRANSIT_UPDATE_INTERVAL);

    return () => {
      if (transitSimulationIntervalRef.current) {
        clearInterval(transitSimulationIntervalRef.current);
        transitSimulationIntervalRef.current = null;
      }
      // Clean up markers
      transitVehicleMarkersRef.current.forEach((marker) => marker.remove());
      transitVehicleMarkersRef.current.clear();
      clearTransitVehicles();
    };
  }, [mapLoaded, initializeTransitVehiclesOnMap, updateTransitVehiclePositionsOnMap]);

  // =====================================================
  // ROUTE FINDING - START/DESTINATION MARKERS & ROUTE
  // =====================================================

  // Create start marker
  const createStartMarker = useCallback((location: Coordinate) => {
    if (!mapRef.current) return;

    // Remove existing start marker
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.className = 'start-marker';
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: #4CAF50;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: white;
      ">S</div>
    `;

    startMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([location.lng, location.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px; font-weight: 600; color: #4CAF50;">
              ${lang === 'ur' ? 'شروع' : 'Start'}
            </div>
          `)
      )
      .addTo(mapRef.current);
  }, [lang]);

  // Create destination marker
  const createDestinationMarker = useCallback((location: Coordinate) => {
    if (!mapRef.current) return;

    // Remove existing destination marker
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
    }

    // Create marker element
    const el = document.createElement('div');
    el.className = 'destination-marker';
    el.innerHTML = `
      <div style="
        width: 32px;
        height: 32px;
        background: #F44336;
        border: 4px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-weight: bold;
        color: white;
      ">D</div>
    `;

    destinationMarkerRef.current = new mapboxgl.Marker({ element: el })
      .setLngLat([location.lng, location.lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div style="padding: 8px; font-weight: 600; color: #F44336;">
              ${lang === 'ur' ? 'منزل' : 'Destination'}
            </div>
          `)
      )
      .addTo(mapRef.current);
  }, [lang]);

  // Fetch and draw route using Mapbox Directions API
  // Note: Currently unused but kept for future use
  // @ts-ignore - Reserved for future use
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _drawRoute = useCallback(async (start: Coordinate, destination: Coordinate) => {
    if (!mapRef.current || !mapLoaded) return;

    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.warn('Mapbox token not available for Directions API');
      return;
    }

    try {
      // Remove existing route layer
      if (routeLayerRef.current) {
        const layerId = routeLayerRef.current;
        const sourceId = 'route-source';
        if (mapRef.current.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
          mapRef.current.removeSource(sourceId);
        }
        routeLayerRef.current = null;
      }

      // Build Directions API URL
      const startCoords = `${start.lng},${start.lat}`;
      const destCoords = `${destination.lng},${destination.lat}`;
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords};${destCoords}?geometries=geojson&access_token=${accessToken}`;

      // Fetch route
      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.warn('No route found');
        return;
      }

      const route = data.routes[0];
      const routeGeometry = route.geometry;

      // Add route source
      const sourceId = 'route-source';
      if (mapRef.current.getSource(sourceId)) {
        (mapRef.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: routeGeometry,
        });
      } else {
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: routeGeometry,
          },
        });
      }

      // Add route layer
      const layerId = 'route-layer';
      if (!mapRef.current.getLayer(layerId)) {
        mapRef.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#1F8A70',
            'line-width': 4,
            'line-opacity': 0.8,
          },
        });
      }

      routeLayerRef.current = layerId;

      // Fit map to route bounds
      const coordinates = routeGeometry.coordinates as [number, number][];
      const bounds = coordinates.reduce(
        (bounds, coord) => bounds.extend(coord as [number, number]),
        new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
      );

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
      });
    } catch (error) {
      console.error('Error fetching route:', error);
      toast('Failed to fetch route. Please try again.', {
        icon: '⚠️',
      });
    }
  }, [mapLoaded, lang]);

  // Clear route helper
  const clearRoute = useCallback(() => {
    if (!mapRef.current) return;
    if (routeLayerRef.current) {
      const layerId = routeLayerRef.current;
      const sourceId = 'route-source';
      if (mapRef.current.getLayer(layerId)) {
        mapRef.current.removeLayer(layerId);
      }
      if (mapRef.current.getSource(sourceId)) {
        mapRef.current.removeSource(sourceId);
      }
      routeLayerRef.current = null;
    }
  }, []);

  // Draw route from geometry (Uber-style)
  const drawRouteFromGeometry = useCallback((geometry: GeoJSON.LineString, color: string = '#1A73E8', width: number = 5) => {
    if (!mapRef.current || !mapLoaded) return;

    try {
      clearRoute();

      const sourceId = 'route-source';
      const layerId = 'route-layer';

      if (mapRef.current.getSource(sourceId)) {
        (mapRef.current.getSource(sourceId) as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry,
        });
      } else {
        mapRef.current.addSource(sourceId, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry,
          },
        });
      }

      if (!mapRef.current.getLayer(layerId)) {
        mapRef.current.addLayer({
          id: layerId,
          type: 'line',
          source: sourceId,
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': color,
            'line-width': width,
            'line-opacity': 0.9,
          },
        });
      } else {
        mapRef.current.setPaintProperty(layerId, 'line-color', color);
        mapRef.current.setPaintProperty(layerId, 'line-width', width);
      }

      routeLayerRef.current = layerId;

      // Fit map to route bounds with smooth animation
      const coordinates = geometry.coordinates as [number, number][];
      if (coordinates.length > 0) {
        const bounds = coordinates.reduce(
          (bounds, coord) => bounds.extend(coord as [number, number]),
          new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number])
        );

        mapRef.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 50, right: 50 },
          duration: 1500,
          easing: (t: number) => t * (2 - t),
        });
      }
    } catch (error) {
      console.error('Error drawing route:', error);
    }
  }, [mapLoaded, clearRoute]);

  // Effect to handle route start/destination changes (legacy)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    if (selectedRouteOption) return; // Don't draw legacy route if Uber-style route is selected

    // Clean up existing markers
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
      startMarkerRef.current = null;
    }
    if (destinationMarkerRef.current) {
      destinationMarkerRef.current.remove();
      destinationMarkerRef.current = null;
    }

    // Create markers if both are provided
    if (routeStart && routeDestination) {
      createStartMarker(routeStart);
      createDestinationMarker(routeDestination);
    }
  }, [routeStart, routeDestination, mapLoaded, createStartMarker, createDestinationMarker, selectedRouteOption]);

  // Effect to handle selected route option (Uber-style)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedRouteOption) return;

    // Draw selected route
    drawRouteFromGeometry(selectedRouteOption.geometry, '#1A73E8', 5);

    // Ensure markers are visible
    if (routeStart) {
      createStartMarker(routeStart);
    }
    if (routeDestination) {
      createDestinationMarker(routeDestination);
    }
  }, [selectedRouteOption, mapLoaded, routeStart, routeDestination, createStartMarker, createDestinationMarker, drawRouteFromGeometry]);

  // Transfer markers ref
  const transferMarkersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  // Effect to handle multi-modal route (highlight stations/stops)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !selectedMultiModalRoute) {
      // Cleanup if route is cleared
      transferMarkersRef.current.forEach(marker => marker.remove());
      transferMarkersRef.current.clear();
      return;
    }

    // Clear previous transfer markers
    transferMarkersRef.current.forEach(marker => marker.remove());
    transferMarkersRef.current.clear();

    // Highlight transfer points
    selectedMultiModalRoute.transferPoints.forEach((transfer, index) => {
      const el = document.createElement('div');
      el.className = 'transfer-marker';
      el.style.cssText = `
        width: 24px;
        height: 24px;
        background: ${transfer.type === 'metro-station' ? '#FF6F00' : '#9C27B0'};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([transfer.location.lng, transfer.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px;">
                <div style="font-weight: 600; color: ${transfer.type === 'metro-station' ? '#FF6F00' : '#9C27B0'};">
                  ${transfer.name}
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">
                  ${lang === 'ur' ? 'تبدیلی کا مقام' : 'Transfer Point'}
                </div>
              </div>
            `)
        )
        .addTo(mapRef.current!);

      transferMarkersRef.current.set(`transfer-${index}`, marker);
    });

    // Draw route segments
    selectedMultiModalRoute.steps.forEach((step, index) => {
      const color = step.type === 'walk' ? '#9E9E9E' : 
                    step.type === 'speedo' ? '#9C27B0' : 
                    '#FF6F00';
      const width = step.type === 'walk' ? 3 : 5;

      const sourceId = `route-segment-${index}`;
      const layerId = `route-segment-layer-${index}`;

      // Remove existing if any
      if (mapRef.current && mapRef.current.getLayer(layerId)) {
        mapRef.current.removeLayer(layerId);
      }
      if (mapRef.current && mapRef.current.getSource(sourceId)) {
        mapRef.current.removeSource(sourceId);
      }

      if (!mapRef.current) return;

      mapRef.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [
              [step.from.lng, step.from.lat],
              [step.to.lng, step.to.lat]
            ]
          }
        }
      });

      mapRef.current.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': color,
          'line-width': width,
          'line-opacity': 0.8,
          'line-dasharray': step.type === 'walk' ? [2, 2] : undefined,
        },
      });
    });

    // Fit bounds to show entire route
    if (selectedMultiModalRoute.steps.length > 0) {
      const allCoords: [number, number][] = [];
      selectedMultiModalRoute.steps.forEach(step => {
        allCoords.push([step.from.lng, step.from.lat]);
        allCoords.push([step.to.lng, step.to.lat]);
      });
      selectedMultiModalRoute.transferPoints.forEach(transfer => {
        allCoords.push([transfer.location.lng, transfer.location.lat]);
      });

      if (allCoords.length > 0) {
        const bounds = allCoords.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(allCoords[0], allCoords[0])
        );

        mapRef.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 50, right: 50 },
          duration: 1500,
        });
      }
    }

    // Cleanup function
    return () => {
      transferMarkersRef.current.forEach(marker => marker.remove());
      transferMarkersRef.current.clear();
      selectedMultiModalRoute.steps.forEach((_, index) => {
        const sourceId = `route-segment-${index}`;
        const layerId = `route-segment-layer-${index}`;
        if (mapRef.current?.getLayer(layerId)) {
          mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current?.getSource(sourceId)) {
          mapRef.current.removeSource(sourceId);
        }
      });
    };
  }, [selectedMultiModalRoute, mapLoaded, lang]);

  // =====================================================
  // HIGHLIGHT SELECTED ROUTE
  // =====================================================

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    (feederRoutesData.routes as FeederRoute[]).forEach((route) => {
      const layerId = `feeder-line-${route.id}`;
      if (mapRef.current?.getLayer(layerId)) {
        mapRef.current.setPaintProperty(
          layerId,
          'line-width',
          route.id === selectedRouteId ? 6 : 4
        );
        mapRef.current.setPaintProperty(
          layerId,
          'line-opacity',
          route.id === selectedRouteId ? 1 : 0.7
        );
      }
    });
  }, [selectedRouteId, mapLoaded]);

  // =====================================================
  // RENDER
  // =====================================================

  if (mapError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={{ minHeight: '400px' }}>
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {lang === 'ur' ? 'نقشہ لوڈ نہیں ہو سکا' : 'Map Could Not Load'}
          </h3>
          <p className="text-gray-600 mb-4">{mapError}</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left text-sm">
            <strong className="text-blue-800">Mapbox Setup Instructions:</strong>
            <ol className="list-decimal ml-4 mt-2 text-blue-700 space-y-1">
              <li>Go to <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="underline">Mapbox Access Tokens</a></li>
              <li>Create or copy your public access token</li>
              <li>Create <code className="bg-blue-100 px-1 rounded">.env</code> file in project root</li>
              <li>Add: <code className="bg-blue-100 px-1 rounded">VITE_MAPBOX_ACCESS_TOKEN=your_token</code></li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Map Container */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0" 
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }} 
      />

      {/* Loading State */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
          <div className="text-center">
            <div className="spinner mx-auto mb-4" />
            <p className="text-gray-600">
              {lang === 'ur' ? 'نقشہ لوڈ ہو رہا ہے...' : 'Loading map...'}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {lang === 'ur' ? 'براہ کرم انتظار کریں' : 'Please wait...'}
            </p>
          </div>
        </div>
      )}

      {/* Debug Info (only in development) */}
      {import.meta.env.DEV && mapLoaded && (
        <div className="absolute top-2 left-2 z-30 bg-black/70 text-white text-xs p-2 rounded max-w-xs">
          <div>Map loaded: ✅</div>
          <div>Container: {mapContainerRef.current?.offsetWidth}x{mapContainerRef.current?.offsetHeight}</div>
        </div>
      )}

      {/* Location Error Toast */}
      {locationError && mapLoaded && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 
                        bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 shadow-lg">
          <p className="text-sm text-amber-800">{locationError}</p>
        </div>
      )}

      {/* Map Controls */}
      {mapLoaded && (
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-2">
          {/* Center on User */}
          <button
            onClick={centerOnUser}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center 
                       text-2xl hover:bg-gray-50 active:scale-95 transition-all border border-gray-200"
            title={lang === 'ur' ? 'میرا مقام' : 'My Location'}
          >
            📍
          </button>
          
          {/* Fit All Routes */}
          <button
            onClick={fitAllRoutes}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center 
                       text-xl hover:bg-gray-50 active:scale-95 transition-all border border-gray-200"
            title={lang === 'ur' ? 'سب راستے دکھائیں' : 'Show All Routes'}
          >
            🗺️
          </button>
        </div>
      )}

      {/* Legend */}
      {mapLoaded && (
        <div className="absolute bottom-6 left-4 z-20 bg-white rounded-xl shadow-lg p-3 text-xs border border-gray-200">
          <div className="font-bold mb-2 text-gray-700">
            {lang === 'ur' ? 'لیجنڈ' : 'Legend'}
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stationsData.metroBus.color }} />
              <span>{lang === 'ur' ? 'میٹرو بس' : 'Metro Bus'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stationsData.orangeLine.color }} />
              <span>{lang === 'ur' ? 'اورنج لائن' : 'Orange Line'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Mapbox Attribution */}
      <style>{`
        .mapboxgl-ctrl-attrib {
          font-size: 10px !important;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default MapView;

