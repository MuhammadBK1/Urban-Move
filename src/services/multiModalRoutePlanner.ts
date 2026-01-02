/**
 * =====================================================
 * MULTI-MODAL ROUTE PLANNER
 * =====================================================
 * 
 * Plans routes combining:
 * - Walking segments
 * - Speedo bus routes
 * - Metro lines
 * 
 * Prefers routes with fewer transfers
 * =====================================================
 */

import { Coordinate } from '../types';
import { speedoRoutes } from '../data/speedoRoutes';
import { metroStops, isMetroStop } from '../data/metroStops';
import { getAllStations } from '../data/transitData';
import { calculateDistance } from './mapService';

// =====================================================
// TYPES
// =====================================================

export interface MultiModalRoute {
  id: string;
  steps: RouteStep[];
  totalDistance: number; // meters
  totalTime: number; // minutes
  totalFare: number; // PKR
  transfers: number;
  transferPoints: TransferPoint[];
}

export interface RouteStep {
  type: 'walk' | 'speedo' | 'metro';
  from: Coordinate;
  to: Coordinate;
  fromName: string;
  toName: string;
  distance: number; // meters
  time: number; // minutes
  fare: number; // PKR
  routeNo?: number; // For Speedo routes
  routeName?: string; // For display
  instruction: string;
  instructionUrdu?: string;
}

export interface TransferPoint {
  location: Coordinate;
  name: string;
  type: 'speedo-stop' | 'metro-station';
  fromMode: 'walk' | 'speedo' | 'metro';
  toMode: 'speedo' | 'metro' | 'walk';
}

// =====================================================
// CONSTANTS
// =====================================================

const WALKING_SPEED = 80; // meters per minute (~5 km/h)
const SPEEDO_SPEED = 500; // meters per minute (~30 km/h)
const METRO_SPEED = 1000; // meters per minute (~60 km/h)

const WALKING_FARE = 0; // Free
const SPEEDO_FARE = 30; // PKR per trip
const METRO_FARE = 50; // PKR per trip

// const MAX_WALKING_DISTANCE = 2000; // 2km max walking segment (unused)

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Calculate walking time in minutes
 */
function calculateWalkingTime(distanceMeters: number): number {
  return Math.round(distanceMeters / WALKING_SPEED);
}

/**
 * Calculate transit time in minutes
 */
function calculateTransitTime(distanceMeters: number, mode: 'speedo' | 'metro'): number {
  const speed = mode === 'speedo' ? SPEEDO_SPEED : METRO_SPEED;
  return Math.round(distanceMeters / speed);
}

/**
 * Find nearest Speedo stop to a location
 */
function findNearestSpeedoStop(location: Coordinate, maxDistance: number = 2): { stop: string; distance: number; route: typeof speedoRoutes[0] } | null {
  let nearest: { stop: string; distance: number; route: typeof speedoRoutes[0] } | null = null;
  let minDistance = maxDistance * 1000; // Convert to meters

  for (const route of speedoRoutes) {
    // Check 'from' stop
    const fromStop = findStopCoordinates(route.from);
    if (fromStop) {
      const distance = calculateDistance(location, fromStop) * 1000; // Convert to meters
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { stop: route.from, distance, route };
      }
    }

    // Check 'to' stop
    const toStop = findStopCoordinates(route.to);
    if (toStop) {
      const distance = calculateDistance(location, toStop) * 1000;
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { stop: route.to, distance, route };
      }
    }
  }

  return nearest;
}

/**
 * Find stop coordinates by name
 */
function findStopCoordinates(stopName: string): Coordinate | null {
  // Try metro stops first
  if (isMetroStop(stopName)) {
    const allStations = getAllStations();
    const station = allStations.find(s => 
      s.name.toLowerCase().includes(stopName.toLowerCase()) ||
      (s.nameUrdu && s.nameUrdu.toLowerCase().includes(stopName.toLowerCase()))
    );
    if (station) {
      return { lat: station.lat, lng: station.lng };
    }
  }

  // Try transit data stops
  const allStations = getAllStations();
  const station = allStations.find(s => 
    s.name.toLowerCase().includes(stopName.toLowerCase()) ||
    (s.nameUrdu && s.nameUrdu.toLowerCase().includes(stopName.toLowerCase()))
  );
  if (station) {
    return { lat: station.lat, lng: station.lng };
  }

  // Fallback: approximate coordinates for common stops
  const commonStops: Record<string, Coordinate> = {
    'railway station': { lat: 31.5820, lng: 74.3296 },
    'bhatti chowk': { lat: 31.5892, lng: 74.2967 },
    'gpo': { lat: 31.5494, lng: 74.3064 },
    'kalma chowk': { lat: 31.5044, lng: 74.3388 },
    'muslim town': { lat: 31.4900, lng: 74.2800 },
    'shahdara': { lat: 31.6044, lng: 74.2787 },
    'ali town': { lat: 31.5924, lng: 74.2634 },
    'samanabad mor': { lat: 31.4534, lng: 74.3089 },
    'babu sabu': { lat: 31.5200, lng: 74.3500 },
    'main market gulberg': { lat: 31.5146, lng: 74.3507 },
    'r.a. bazar': { lat: 31.5400, lng: 74.3200 },
    'chungi amar sidhu': { lat: 31.4452, lng: 74.2476 },
    'qartaba chowk': { lat: 31.5207, lng: 74.3498 },
    'depot chowk': { lat: 31.5000, lng: 74.3300 },
    'thokar niaz baig': { lat: 31.4765, lng: 74.3356 },
  };

  const key = stopName.toLowerCase();
  for (const [name, coords] of Object.entries(commonStops)) {
    if (key.includes(name) || name.includes(key)) {
      return coords;
    }
  }

  return null;
}

/**
 * Find Speedo routes between two stops
 */
function findSpeedoRoute(fromStop: string, toStop: string): typeof speedoRoutes[0] | null {
  return speedoRoutes.find(route => 
    route.from.toLowerCase() === fromStop.toLowerCase() &&
    route.to.toLowerCase() === toStop.toLowerCase()
  ) || null;
}

/**
 * Find all Speedo routes from a stop
 * Reserved for future use
 */
// function _findSpeedoRoutesFrom(stop: string): typeof speedoRoutes {
//   return speedoRoutes.filter(route => 
//     route.from.toLowerCase().includes(stop.toLowerCase())
//   );
// }

/**
 * Find all Speedo routes to a stop
 * Reserved for future use
 */
// function _findSpeedoRoutesTo(stop: string): typeof speedoRoutes {
//   return speedoRoutes.filter(route => 
//     route.to.toLowerCase().includes(stop.toLowerCase())
//   );
// }

// =====================================================
// ROUTE PLANNING
// =====================================================

/**
 * Plan multi-modal route from origin to destination
 */
export function planMultiModalRoute(
  origin: Coordinate,
  destination: Coordinate
): MultiModalRoute[] {
  const routes: MultiModalRoute[] = [];

  // 1. Direct Speedo route (if possible)
  const directRoute = findDirectSpeedoRoute(origin, destination);
  if (directRoute) {
    routes.push(directRoute);
  }

  // 2. Speedo → Metro routes
  const speedoMetroRoutes = findSpeedoMetroRoutes(origin, destination);
  routes.push(...speedoMetroRoutes);

  // 3. Metro → Speedo routes
  const metroSpeedoRoutes = findMetroSpeedoRoutes(origin, destination);
  routes.push(...metroSpeedoRoutes);

  // 4. Speedo → Metro → Speedo routes (2 transfers)
  const multiTransferRoutes = findMultiTransferRoutes(origin, destination);
  routes.push(...multiTransferRoutes);

  // Sort by transfers (fewer is better), then by time
  routes.sort((a, b) => {
    if (a.transfers !== b.transfers) {
      return a.transfers - b.transfers;
    }
    return a.totalTime - b.totalTime;
  });

  return routes;
}

/**
 * Find direct Speedo route
 */
function findDirectSpeedoRoute(
  origin: Coordinate,
  destination: Coordinate
): MultiModalRoute | null {
  const originStop = findNearestSpeedoStop(origin, 2);
  const destStop = findNearestSpeedoStop(destination, 2);

  if (!originStop || !destStop) return null;

  const route = findSpeedoRoute(originStop.stop, destStop.stop);
  if (!route) return null;

  const steps: RouteStep[] = [];

  // Walk to origin stop
  if (originStop.distance > 50) { // Only add if > 50m
    steps.push({
      type: 'walk',
      from: origin,
      to: findStopCoordinates(originStop.stop)!,
      fromName: 'Your Location',
      toName: originStop.stop,
      distance: Math.round(originStop.distance),
      time: calculateWalkingTime(originStop.distance),
      fare: WALKING_FARE,
      instruction: `Walk to ${originStop.stop}`,
      instructionUrdu: `${originStop.stop} تک پیدل چلیں`,
    });
  }

  // Speedo route
  const routeDistance = calculateDistance(
    findStopCoordinates(originStop.stop)!,
    findStopCoordinates(destStop.stop)!
  ) * 1000;
  
  steps.push({
    type: 'speedo',
    from: findStopCoordinates(originStop.stop)!,
    to: findStopCoordinates(destStop.stop)!,
    fromName: originStop.stop,
    toName: destStop.stop,
    distance: Math.round(routeDistance),
    time: calculateTransitTime(routeDistance, 'speedo'),
    fare: SPEEDO_FARE,
    routeNo: route.routeNo,
    routeName: `Speedo Route ${route.routeNo}`,
    instruction: `Take Speedo Route ${route.routeNo} to ${destStop.stop}`,
    instructionUrdu: `Speedo روٹ ${route.routeNo} لیں ${destStop.stop} تک`,
  });

  // Walk to destination
  if (destStop.distance > 50) {
    steps.push({
      type: 'walk',
      from: findStopCoordinates(destStop.stop)!,
      to: destination,
      fromName: destStop.stop,
      toName: 'Destination',
      distance: Math.round(destStop.distance),
      time: calculateWalkingTime(destStop.distance),
      fare: WALKING_FARE,
      instruction: `Walk to destination`,
      instructionUrdu: `منزل تک پیدل چلیں`,
    });
  }

  const totalDistance = steps.reduce((sum, s) => sum + s.distance, 0);
  const totalTime = steps.reduce((sum, s) => sum + s.time, 0);
  const totalFare = steps.reduce((sum, s) => sum + s.fare, 0);

  return {
    id: `direct-speedo-${route.routeNo}`,
    steps,
    totalDistance,
    totalTime,
    totalFare,
    transfers: 0,
    transferPoints: [],
  };
}

/**
 * Find Speedo → Metro routes
 */
function findSpeedoMetroRoutes(
  origin: Coordinate,
  destination: Coordinate
): MultiModalRoute[] {
  const routes: MultiModalRoute[] = [];

  // Find nearest Speedo stop to origin
  const originSpeedoStop = findNearestSpeedoStop(origin, 2);
  if (!originSpeedoStop) return routes;

  // Check if destination is near a metro stop
  const allStations = getAllStations();
  let nearestMetroDest: { station: typeof allStations[0]; distance: number } | null = null;
  let minMetroDist = Infinity;

  for (const station of allStations) {
    const dist = calculateDistance(destination, { lat: station.lat, lng: station.lng }) * 1000;
    if (dist < minMetroDist && dist < 2000) {
      minMetroDist = dist;
      nearestMetroDest = { station, distance: dist };
    }
  }

  if (!nearestMetroDest) return routes;

  // Find Speedo routes that go to a metro stop
  for (const metroStopName of metroStops) {
    const metroStopCoords = findStopCoordinates(metroStopName);
    if (!metroStopCoords) continue;

    const speedoRoute = findSpeedoRoute(originSpeedoStop.stop, metroStopName);
    if (!speedoRoute) continue;

    const steps: RouteStep[] = [];
    const transferPoints: TransferPoint[] = [];

    // Walk to Speedo stop
    if (originSpeedoStop.distance > 50) {
      steps.push({
        type: 'walk',
        from: origin,
        to: findStopCoordinates(originSpeedoStop.stop)!,
        fromName: 'Your Location',
        toName: originSpeedoStop.stop,
        distance: Math.round(originSpeedoStop.distance),
        time: calculateWalkingTime(originSpeedoStop.distance),
        fare: WALKING_FARE,
        instruction: `Walk to ${originSpeedoStop.stop}`,
        instructionUrdu: `${originSpeedoStop.stop} تک پیدل چلیں`,
      });
    }

    // Speedo to Metro
    const speedoDistance = calculateDistance(
      findStopCoordinates(originSpeedoStop.stop)!,
      metroStopCoords
    ) * 1000;

    steps.push({
      type: 'speedo',
      from: findStopCoordinates(originSpeedoStop.stop)!,
      to: metroStopCoords,
      fromName: originSpeedoStop.stop,
      toName: metroStopName,
      distance: Math.round(speedoDistance),
      time: calculateTransitTime(speedoDistance, 'speedo'),
      fare: SPEEDO_FARE,
      routeNo: speedoRoute.routeNo,
      routeName: `Speedo Route ${speedoRoute.routeNo}`,
      instruction: `Take Speedo Route ${speedoRoute.routeNo} to ${metroStopName}`,
      instructionUrdu: `Speedo روٹ ${speedoRoute.routeNo} لیں ${metroStopName} تک`,
    });

    // Transfer point
    transferPoints.push({
      location: metroStopCoords,
      name: metroStopName,
      type: 'metro-station',
      fromMode: 'speedo',
      toMode: 'metro',
    });

    // Metro to destination
    const metroDistance = calculateDistance(
      metroStopCoords,
      { lat: nearestMetroDest.station.lat, lng: nearestMetroDest.station.lng }
    ) * 1000;

    steps.push({
      type: 'metro',
      from: metroStopCoords,
      to: { lat: nearestMetroDest.station.lat, lng: nearestMetroDest.station.lng },
      fromName: metroStopName,
      toName: nearestMetroDest.station.name,
      distance: Math.round(metroDistance),
      time: calculateTransitTime(metroDistance, 'metro'),
      fare: METRO_FARE,
      routeName: 'Metro Line',
      instruction: `Take Metro from ${metroStopName} to ${nearestMetroDest.station.name}`,
      instructionUrdu: `${metroStopName} سے ${nearestMetroDest.station.name} تک میٹرو لیں`,
    });

    // Walk to destination
    if (nearestMetroDest.distance > 50) {
      steps.push({
        type: 'walk',
        from: { lat: nearestMetroDest.station.lat, lng: nearestMetroDest.station.lng },
        to: destination,
        fromName: nearestMetroDest.station.name,
        toName: 'Destination',
        distance: Math.round(nearestMetroDest.distance),
        time: calculateWalkingTime(nearestMetroDest.distance),
        fare: WALKING_FARE,
        instruction: `Walk to destination`,
        instructionUrdu: `منزل تک پیدل چلیں`,
      });
    }

    const totalDistance = steps.reduce((sum, s) => sum + s.distance, 0);
    const totalTime = steps.reduce((sum, s) => sum + s.time, 0);
    const totalFare = steps.reduce((sum, s) => sum + s.fare, 0);

    routes.push({
      id: `speedo-metro-${speedoRoute.routeNo}-${metroStopName}`,
      steps,
      totalDistance,
      totalTime,
      totalFare,
      transfers: 1,
      transferPoints,
    });
  }

  return routes;
}

/**
 * Find Metro → Speedo routes
 */
function findMetroSpeedoRoutes(
  origin: Coordinate,
  destination: Coordinate
): MultiModalRoute[] {
  const routes: MultiModalRoute[] = [];

  // Check if origin is near a metro stop
  const allStations = getAllStations();
  let nearestMetroOrigin: { station: typeof allStations[0]; distance: number } | null = null;
  let minMetroDist = Infinity;

  for (const station of allStations) {
    const dist = calculateDistance(origin, { lat: station.lat, lng: station.lng }) * 1000;
    if (dist < minMetroDist && dist < 2000) {
      minMetroDist = dist;
      nearestMetroOrigin = { station, distance: dist };
    }
  }

  if (!nearestMetroOrigin) return routes;

  // Find nearest Speedo stop to destination
  const destSpeedoStop = findNearestSpeedoStop(destination, 2);
  if (!destSpeedoStop) return routes;

  // Find Metro stops that connect to Speedo routes going to destination
  for (const metroStopName of metroStops) {
    const metroStopCoords = findStopCoordinates(metroStopName);
    if (!metroStopCoords) continue;

    const speedoRoute = findSpeedoRoute(metroStopName, destSpeedoStop.stop);
    if (!speedoRoute) continue;

    const steps: RouteStep[] = [];
    const transferPoints: TransferPoint[] = [];

    // Walk to Metro
    if (nearestMetroOrigin.distance > 50) {
      steps.push({
        type: 'walk',
        from: origin,
        to: { lat: nearestMetroOrigin.station.lat, lng: nearestMetroOrigin.station.lng },
        fromName: 'Your Location',
        toName: nearestMetroOrigin.station.name,
        distance: Math.round(nearestMetroOrigin.distance),
        time: calculateWalkingTime(nearestMetroOrigin.distance),
        fare: WALKING_FARE,
        instruction: `Walk to ${nearestMetroOrigin.station.name}`,
        instructionUrdu: `${nearestMetroOrigin.station.name} تک پیدل چلیں`,
      });
    }

    // Metro to transfer point
    const metroDistance = calculateDistance(
      { lat: nearestMetroOrigin.station.lat, lng: nearestMetroOrigin.station.lng },
      metroStopCoords
    ) * 1000;

    steps.push({
      type: 'metro',
      from: { lat: nearestMetroOrigin.station.lat, lng: nearestMetroOrigin.station.lng },
      to: metroStopCoords,
      fromName: nearestMetroOrigin.station.name,
      toName: metroStopName,
      distance: Math.round(metroDistance),
      time: calculateTransitTime(metroDistance, 'metro'),
      fare: METRO_FARE,
      routeName: 'Metro Line',
      instruction: `Take Metro from ${nearestMetroOrigin.station.name} to ${metroStopName}`,
      instructionUrdu: `${nearestMetroOrigin.station.name} سے ${metroStopName} تک میٹرو لیں`,
    });

    // Transfer point
    transferPoints.push({
      location: metroStopCoords,
      name: metroStopName,
      type: 'metro-station',
      fromMode: 'metro',
      toMode: 'speedo',
    });

    // Speedo to destination
    const speedoDistance = calculateDistance(
      metroStopCoords,
      findStopCoordinates(destSpeedoStop.stop)!
    ) * 1000;

    steps.push({
      type: 'speedo',
      from: metroStopCoords,
      to: findStopCoordinates(destSpeedoStop.stop)!,
      fromName: metroStopName,
      toName: destSpeedoStop.stop,
      distance: Math.round(speedoDistance),
      time: calculateTransitTime(speedoDistance, 'speedo'),
      fare: SPEEDO_FARE,
      routeNo: speedoRoute.routeNo,
      routeName: `Speedo Route ${speedoRoute.routeNo}`,
      instruction: `Take Speedo Route ${speedoRoute.routeNo} to ${destSpeedoStop.stop}`,
      instructionUrdu: `Speedo روٹ ${speedoRoute.routeNo} لیں ${destSpeedoStop.stop} تک`,
    });

    // Walk to destination
    if (destSpeedoStop.distance > 50) {
      steps.push({
        type: 'walk',
        from: findStopCoordinates(destSpeedoStop.stop)!,
        to: destination,
        fromName: destSpeedoStop.stop,
        toName: 'Destination',
        distance: Math.round(destSpeedoStop.distance),
        time: calculateWalkingTime(destSpeedoStop.distance),
        fare: WALKING_FARE,
        instruction: `Walk to destination`,
        instructionUrdu: `منزل تک پیدل چلیں`,
      });
    }

    const totalDistance = steps.reduce((sum, s) => sum + s.distance, 0);
    const totalTime = steps.reduce((sum, s) => sum + s.time, 0);
    const totalFare = steps.reduce((sum, s) => sum + s.fare, 0);

    routes.push({
      id: `metro-speedo-${metroStopName}-${speedoRoute.routeNo}`,
      steps,
      totalDistance,
      totalTime,
      totalFare,
      transfers: 1,
      transferPoints,
    });
  }

  return routes;
}

/**
 * Find routes with multiple transfers (Speedo → Metro → Speedo)
 */
function findMultiTransferRoutes(
  _origin: Coordinate,
  _destination: Coordinate
): MultiModalRoute[] {
  const routes: MultiModalRoute[] = [];

  // This is a simplified version - in production, you'd want more sophisticated logic
  // For now, return empty array as 2+ transfer routes are less preferred
  return routes;
}

