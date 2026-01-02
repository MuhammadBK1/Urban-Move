/**
 * =====================================================
 * DEMO MODE SERVICE
 * =====================================================
 * 
 * Provides simulated data for offline/demo use.
 * Simulates vehicle movement along routes.
 * =====================================================
 */

import { Route, Vehicle, LiveLocation, Coordinate } from '../types';
import { ScoredRoute } from './routeScoringService';
import { generateDemoRoutes } from '../data/lahoreDemoData';

// =====================================================
// MOCK DATA
// =====================================================

export const DEMO_ROUTES: Route[] = [];

export const DEMO_VEHICLES: Vehicle[] = [];

// =====================================================
// SIMULATION ENGINE
// =====================================================

// Vehicle progress along routes (0 to 1)
const vehicleProgress: Map<string, number> = new Map();

/**
 * Interpolate position along waypoints
 */
const interpolatePosition = (waypoints: Coordinate[], progress: number): Coordinate => {
  const totalSegments = waypoints.length - 1;
  const segmentProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const segmentFraction = segmentProgress - segmentIndex;

  const start = waypoints[segmentIndex];
  const end = waypoints[segmentIndex + 1];

  return {
    lat: start.lat + (end.lat - start.lat) * segmentFraction,
    lng: start.lng + (end.lng - start.lng) * segmentFraction,
  };
};

/**
 * Initialize demo vehicle positions
 */
export const initDemoVehicles = (): void => {
  vehicleProgress.clear();
  DEMO_VEHICLES.forEach((vehicle, index) => {
    // Spread vehicles along routes
    const initialProgress = (index + 1) / (DEMO_VEHICLES.length + 2);
    vehicleProgress.set(vehicle.id, initialProgress);
  });
};

/**
 * Update demo vehicle positions (call every few seconds)
 */
export const updateDemoVehicles = (): void => {
  DEMO_VEHICLES.forEach(vehicle => {
    let progress = vehicleProgress.get(vehicle.id) || 0;
    progress += 0.02; // Move 2% per update
    if (progress > 1) progress = 0;
    vehicleProgress.set(vehicle.id, progress);
  });
};

/**
 * Get current demo locations for a route
 */
export const getDemoLocations = (routeId: string): LiveLocation[] => {
  const route = DEMO_ROUTES.find(r => r.id === routeId);
  if (!route) return [];

  const vehicles = DEMO_VEHICLES.filter(v => v.routeId === routeId);

  return vehicles.map(vehicle => {
    const progress = vehicleProgress.get(vehicle.id) || 0;
    const position = interpolatePosition(route.waypoints, progress);

    return {
      vehicleId: vehicle.id,
      routeId: route.id,
      location: position,
      heading: Math.random() * 360,
      speed: 15 + Math.random() * 15,
      timestamp: Date.now(),
      source: 'gps' as const,
      accuracy: 10,
    };
  });
};

/**
 * Get all demo routes
 */
export const getDemoRoutes = (): Route[] => DEMO_ROUTES;

/**
 * Get demo vehicles for a route
 */
export const getDemoVehicles = (routeId: string): Vehicle[] => {
  return DEMO_VEHICLES.filter(v => v.routeId === routeId);
};

// =====================================================
// DEMO ROUTE SUGGESTIONS
// =====================================================

/**
 * Demo route suggestions for testing route ranking and display
 */
export const DEMO_ROUTE_SUGGESTIONS: ScoredRoute[] = [
  {
    id: "R1",
    type: "bus-metro",
    title: "Speedo S1 + Orange Line",
    titleUrdu: "اسپیڈو S1 + اورنج لائن",
    description: "Walk to Thokar, take Speedo S1 to Qaddafi Stadium, transfer to Orange Line",
    descriptionUrdu: "ٹھوکر تک پیدل جائیں، اسپیڈو S1 لیں قذافی اسٹیڈیم تک، اورنج لائن میں تبدیل کریں",
    steps: [
      {
        type: "walk",
        from: "Your Location",
        to: "Thokar",
        fromUrdu: "آپ کا مقام",
        toUrdu: "ٹھوکر",
        distance: 0.6, // km
        time: 8, // minutes
        fare: 0,
      },
      {
        type: "bus",
        from: "Thokar",
        to: "Qaddafi Stadium",
        fromUrdu: "ٹھوکر",
        toUrdu: "قذافی اسٹیڈیم",
        distance: 5.2, // km
        time: 12, // minutes
        fare: 30,
        routeId: "S1",
        routeName: "Speedo S1",
        routeNameUrdu: "اسپیڈو S1",
      },
      {
        type: "metro",
        from: "Qaddafi Stadium",
        to: "Destination",
        fromUrdu: "قذافی اسٹیڈیم",
        toUrdu: "منزل",
        distance: 3.5, // km
        time: 12, // minutes
        fare: 30, // Total: 30 (Speedo) + 30 (Metro) = 60
        routeId: "OL2",
        routeName: "Orange Line",
        routeNameUrdu: "اورنج لائن",
      },
    ],
    totalDistance: 9.3, // km
    estimatedTime: 32, // minutes
    totalFare: 60, // PKR
    confidence: "high",
    score: 0, // Will be calculated by scoring service
    ranking: 1,
    reasons: ["Fastest option", "Fewest transfers"],
    metrics: {
      etaMinutes: 32,
      transfers: 1,
      walkKm: 0.6,
      cost: 60,
    },
  },
  {
    id: "R2",
    type: "bus-only",
    title: "Speedo S1 Direct",
    titleUrdu: "اسپیڈو S1 براہ راست",
    description: "Walk to Thokar, take Speedo S1 directly to destination",
    descriptionUrdu: "ٹھوکر تک پیدل جائیں، اسپیڈو S1 براہ راست منزل تک",
    steps: [
      {
        type: "walk",
        from: "Your Location",
        to: "Thokar",
        fromUrdu: "آپ کا مقام",
        toUrdu: "ٹھوکر",
        distance: 1.2, // km
        time: 15, // minutes
        fare: 0,
      },
      {
        type: "bus",
        from: "Thokar",
        to: "Destination",
        fromUrdu: "ٹھوکر",
        toUrdu: "منزل",
        distance: 8.5, // km
        time: 30, // minutes
        fare: 40, // Total: 40
        routeId: "S1",
        routeName: "Speedo S1",
        routeNameUrdu: "اسپیڈو S1",
      },
    ],
    totalDistance: 9.7, // km
    estimatedTime: 45, // minutes
    totalFare: 40, // PKR
    confidence: "high",
    score: 0, // Will be calculated by scoring service
    ranking: 2,
    reasons: ["Cheapest option", "No transfers"],
    metrics: {
      etaMinutes: 45,
      transfers: 0,
      walkKm: 1.2,
      cost: 40,
    },
  },
];

/**
 * Get demo route suggestions
 * @returns Array of demo route suggestions
 */
export const getDemoRouteSuggestions = (): ScoredRoute[] => {
  return DEMO_ROUTE_SUGGESTIONS;
};

/**
 * Generate demo routes for given origin and destination
 * Uses Lahore demo dataset to create realistic route combinations
 * 
 * @param origin - Starting location
 * @param destination - Ending location
 * @returns Array of generated demo routes (walk + bus + metro combinations)
 */
export const generateDemoRoutesForLocation = (
  origin: Coordinate,
  destination: Coordinate
): ScoredRoute[] => {
  return generateDemoRoutes(origin, destination);
};

