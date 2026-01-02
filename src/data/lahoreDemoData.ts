/**
 * =====================================================
 * LAHORE DEMO DATASET
 * =====================================================
 * 
 * Comprehensive hardcoded dataset for Urban Move demo/testing.
 * Includes:
 * - Orange Line Metro stations with coordinates
 * - Speedo bus routes with detailed stops
 * - Pre-generated demo routes (walk + bus + metro combinations)
 * 
 * This dataset requires no external APIs and is used for:
 * - Route ranking and scoring
 * - UI rendering and testing
 * - Demo mode functionality
 * =====================================================
 */

import { Coordinate } from '../types';
import { ScoredRoute } from '../services/routeScoringService';

// =====================================================
// ORANGE LINE METRO STATIONS
// =====================================================

export interface MetroStation {
  id: string;
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
}

export const ORANGE_LINE_STATIONS: MetroStation[] = [
  { id: "OL1", name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.483, lng: 74.252 },
  { id: "OL2", name: "Gaddafi Stadium", nameUrdu: "قذافی اسٹیڈیم", lat: 31.520, lng: 74.344 },
  { id: "OL3", name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.560, lng: 74.324 },
  { id: "OL4", name: "Dera Gujran", nameUrdu: "ڈیرہ گجراں", lat: 31.589, lng: 74.337 },
  { id: "OL5", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.470, lng: 74.240 },
  { id: "OL6", name: "Ichra", nameUrdu: "اچھرا", lat: 31.492, lng: 74.353 },
  { id: "OL7", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.515, lng: 74.351 },
  { id: "OL8", name: "GPO Chowk", nameUrdu: "جی پی او چوک", lat: 31.549, lng: 74.306 },
  { id: "OL9", name: "Anarkali", nameUrdu: "انارکلی", lat: 31.532, lng: 74.325 },
  { id: "OL10", name: "Punjab Secretariat", nameUrdu: "پنجاب سیکرٹریٹ", lat: 31.526, lng: 74.331 },
];

// =====================================================
// SPEEDO BUS ROUTES WITH STOPS
// =====================================================

export interface SpeedoStop {
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
}

export interface SpeedoRoute {
  routeId: string;
  name: string;
  nameUrdu: string;
  stops: SpeedoStop[];
  fare: number;
}

export const SPEEDO_ROUTES: SpeedoRoute[] = [
  {
    routeId: "S1",
    name: "Canal Road",
    nameUrdu: "نہر روڈ",
    fare: 30,
    stops: [
      { name: "Thokar", nameUrdu: "ٹھوکر", lat: 31.470, lng: 74.240 },
      { name: "Qaddafi Stadium", nameUrdu: "قذافی اسٹیڈیم", lat: 31.520, lng: 74.344 },
      { name: "Mall Road", nameUrdu: "مال روڈ", lat: 31.560, lng: 74.324 },
      { name: "GPO", nameUrdu: "جی پی او", lat: 31.549, lng: 74.306 },
    ],
  },
  {
    routeId: "S2",
    name: "Ferozepur Road",
    nameUrdu: "فیروزپور روڈ",
    fare: 30,
    stops: [
      { name: "Thokar", nameUrdu: "ٹھوکر", lat: 31.470, lng: 74.240 },
      { name: "Ichra", nameUrdu: "اچھرا", lat: 31.492, lng: 74.353 },
      { name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.515, lng: 74.351 },
      { name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.504, lng: 74.339 },
    ],
  },
  {
    routeId: "S3",
    name: "Multan Road",
    nameUrdu: "ملتان روڈ",
    fare: 35,
    stops: [
      { name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.483, lng: 74.252 },
      { name: "Gaddafi Stadium", nameUrdu: "قذافی اسٹیڈیم", lat: 31.520, lng: 74.344 },
      { name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.560, lng: 74.324 },
      { name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.567, lng: 74.313 },
    ],
  },
  {
    routeId: "S4",
    name: "Main Boulevard",
    nameUrdu: "مین بولیوارڈ",
    fare: 30,
    stops: [
      { name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.515, lng: 74.351 },
      { name: "GPO", nameUrdu: "جی پی او", lat: 31.549, lng: 74.306 },
      { name: "Anarkali", nameUrdu: "انارکلی", lat: 31.532, lng: 74.325 },
      { name: "Punjab Secretariat", nameUrdu: "پنجاب سیکرٹریٹ", lat: 31.526, lng: 74.331 },
    ],
  },
  {
    routeId: "S5",
    name: "Ravi Road",
    nameUrdu: "راوی روڈ",
    fare: 30,
    stops: [
      { name: "Dera Gujran", nameUrdu: "ڈیرہ گجراں", lat: 31.589, lng: 74.337 },
      { name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.560, lng: 74.324 },
      { name: "GPO", nameUrdu: "جی پی او", lat: 31.549, lng: 74.306 },
      { name: "Shahdara", nameUrdu: "شاہدرہ", lat: 31.604, lng: 74.279 },
    ],
  },
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get metro station by name
 */
export const getMetroStation = (name: string): MetroStation | undefined => {
  return ORANGE_LINE_STATIONS.find(
    s => s.name.toLowerCase() === name.toLowerCase() || 
         s.nameUrdu === name
  );
};

/**
 * Get Speedo route by ID
 */
export const getSpeedoRoute = (routeId: string): SpeedoRoute | undefined => {
  return SPEEDO_ROUTES.find(r => r.routeId === routeId);
};

/**
 * Find Speedo stop by name
 */
export const findSpeedoStop = (stopName: string): { route: SpeedoRoute; stop: SpeedoStop } | null => {
  for (const route of SPEEDO_ROUTES) {
    const stop = route.stops.find(
      s => s.name.toLowerCase() === stopName.toLowerCase() ||
           s.nameUrdu === stopName
    );
    if (stop) {
      return { route, stop };
    }
  }
  return null;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371; // Earth's radius in km
  const lat1Rad = (coord1.lat * Math.PI) / 180;
  const lat2Rad = (coord2.lat * Math.PI) / 180;
  const deltaLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const deltaLng = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) *
    Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// =====================================================
// DEMO ROUTE GENERATION
// =====================================================

/**
 * Generate demo routes combining walk + bus + metro
 */
export const generateDemoRoutes = (
  origin: Coordinate,
  destination: Coordinate
): ScoredRoute[] => {
  const routes: ScoredRoute[] = [];

  // Find nearest metro stations
  const originMetro = findNearestMetroStation(origin);
  const destMetro = findNearestMetroStation(destination);

  // Find nearest Speedo stops
  const originSpeedo = findNearestSpeedoStop(origin);
  const destSpeedo = findNearestSpeedoStop(destination);

  // Route 1: Direct Speedo (if available)
  if (originSpeedo && destSpeedo && originSpeedo.route.routeId === destSpeedo.route.routeId) {
    const route = createDirectSpeedoRoute(origin, destination, originSpeedo, destSpeedo);
    if (route) routes.push(route);
  }

  // Route 2: Speedo → Metro (if both available)
  if (originSpeedo && destMetro) {
    const route = createSpeedoMetroRoute(origin, destination, originSpeedo, destMetro);
    if (route) routes.push(route);
  }

  // Route 3: Metro → Speedo (if both available)
  if (originMetro && destSpeedo) {
    const route = createMetroSpeedoRoute(origin, destination, originMetro, destSpeedo);
    if (route) routes.push(route);
  }

  // Route 4: Direct Metro (if both available)
  if (originMetro && destMetro && originMetro.id !== destMetro.id) {
    const route = createDirectMetroRoute(origin, destination, originMetro, destMetro);
    if (route) routes.push(route);
  }

  // Route 5: Speedo → Metro → Speedo (if available)
  if (originSpeedo && destSpeedo && originSpeedo.route.routeId !== destSpeedo.route.routeId) {
    const route = createMultiTransferRoute(origin, destination, originSpeedo, destSpeedo);
    if (route) routes.push(route);
  }

  return routes;
};

/**
 * Find nearest metro station to a location
 */
const findNearestMetroStation = (location: Coordinate, maxDistance: number = 2): MetroStation | null => {
  let nearest: MetroStation | null = null;
  let minDistance = maxDistance;

  for (const station of ORANGE_LINE_STATIONS) {
    const distance = calculateDistance(location, { lat: station.lat, lng: station.lng });
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return nearest;
};

/**
 * Find nearest Speedo stop to a location
 */
const findNearestSpeedoStop = (location: Coordinate, maxDistance: number = 2): { route: SpeedoRoute; stop: SpeedoStop; distance: number } | null => {
  let nearest: { route: SpeedoRoute; stop: SpeedoStop; distance: number } | null = null;
  let minDistance = maxDistance;

  for (const route of SPEEDO_ROUTES) {
    for (const stop of route.stops) {
      const distance = calculateDistance(location, { lat: stop.lat, lng: stop.lng });
      if (distance < minDistance) {
        minDistance = distance;
        nearest = { route, stop, distance };
      }
    }
  }

  return nearest;
};

/**
 * Create direct Speedo route
 */
const createDirectSpeedoRoute = (
  _origin: Coordinate,
  destination: Coordinate,
  originSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number },
  destSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number }
): ScoredRoute | null => {
  const walkToStop = originSpeedo.distance * 1000; // meters
  const walkFromStop = calculateDistance(
    { lat: destSpeedo.stop.lat, lng: destSpeedo.stop.lng },
    destination
  ) * 1000;

  const speedoDistance = calculateDistance(
    { lat: originSpeedo.stop.lat, lng: originSpeedo.stop.lng },
    { lat: destSpeedo.stop.lat, lng: destSpeedo.stop.lng }
  ) * 1000;

  const totalDistance = (walkToStop + speedoDistance + walkFromStop) / 1000; // km
  const walkTime = Math.round((walkToStop + walkFromStop) / 80); // 80 m/min walking
  const speedoTime = Math.round(speedoDistance / 500); // 500 m/min Speedo
  const totalTime = walkTime + speedoTime;

  return {
    id: `demo-speedo-${originSpeedo.route.routeId}`,
    type: 'bus-only',
    title: `Speedo ${originSpeedo.route.routeId} Direct`,
    titleUrdu: `اسپیڈو ${originSpeedo.route.routeId} براہ راست`,
    description: `Walk to ${originSpeedo.stop.name}, take Speedo ${originSpeedo.route.routeId} to ${destSpeedo.stop.name}`,
    descriptionUrdu: `${originSpeedo.stop.nameUrdu} تک پیدل جائیں، اسپیڈو ${originSpeedo.route.routeId} لیں ${destSpeedo.stop.nameUrdu} تک`,
    steps: [
      {
        type: 'walk',
        from: 'Your Location',
        to: originSpeedo.stop.name,
        fromUrdu: 'آپ کا مقام',
        toUrdu: originSpeedo.stop.nameUrdu,
        distance: walkToStop / 1000,
        time: Math.round(walkToStop / 80),
        fare: 0,
      },
      {
        type: 'bus',
        from: originSpeedo.stop.name,
        to: destSpeedo.stop.name,
        fromUrdu: originSpeedo.stop.nameUrdu,
        toUrdu: destSpeedo.stop.nameUrdu,
        distance: speedoDistance / 1000,
        time: speedoTime,
        fare: originSpeedo.route.fare,
        routeId: originSpeedo.route.routeId,
        routeName: originSpeedo.route.name,
        routeNameUrdu: originSpeedo.route.nameUrdu,
      },
      {
        type: 'walk',
        from: destSpeedo.stop.name,
        to: 'Destination',
        fromUrdu: destSpeedo.stop.nameUrdu,
        toUrdu: 'منزل',
        distance: walkFromStop / 1000,
        time: Math.round(walkFromStop / 80),
        fare: 0,
      },
    ],
    totalDistance,
    estimatedTime: totalTime,
    totalFare: originSpeedo.route.fare,
    confidence: 'high',
    score: 0,
    ranking: 0,
    reasons: [],
    metrics: {
      etaMinutes: totalTime,
      transfers: 0,
      walkKm: (walkToStop + walkFromStop) / 1000,
      cost: originSpeedo.route.fare,
    },
  };
};

/**
 * Create Speedo → Metro route
 */
const createSpeedoMetroRoute = (
  _origin: Coordinate,
  destination: Coordinate,
  originSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number },
  destMetro: MetroStation
): ScoredRoute | null => {
  // Find metro station near Speedo stop
  const transferMetro = findNearestMetroStation(
    { lat: originSpeedo.stop.lat, lng: originSpeedo.stop.lng },
    1
  );
  if (!transferMetro) return null;

  const walkToStop = originSpeedo.distance * 1000;
  const speedoDistance = calculateDistance(
    { lat: originSpeedo.stop.lat, lng: originSpeedo.stop.lng },
    { lat: transferMetro.lat, lng: transferMetro.lng }
  ) * 1000;
  const metroDistance = calculateDistance(
    { lat: transferMetro.lat, lng: transferMetro.lng },
    { lat: destMetro.lat, lng: destMetro.lng }
  ) * 1000;
  const walkFromMetro = calculateDistance(
    { lat: destMetro.lat, lng: destMetro.lng },
    destination
  ) * 1000;

  const totalDistance = (walkToStop + speedoDistance + metroDistance + walkFromMetro) / 1000;
  const walkTime = Math.round((walkToStop + walkFromMetro) / 80);
  const speedoTime = Math.round(speedoDistance / 500);
  const metroTime = Math.round(metroDistance / 1000); // 1000 m/min Metro
  const totalTime = walkTime + speedoTime + metroTime;

  return {
    id: `demo-speedo-metro-${originSpeedo.route.routeId}`,
    type: 'bus-metro',
    title: `Speedo ${originSpeedo.route.routeId} + Orange Line`,
    titleUrdu: `اسپیڈو ${originSpeedo.route.routeId} + اورنج لائن`,
    description: `Walk to ${originSpeedo.stop.name}, take Speedo ${originSpeedo.route.routeId} to ${transferMetro.name}, transfer to Orange Line to ${destMetro.name}`,
    descriptionUrdu: `${originSpeedo.stop.nameUrdu} تک پیدل جائیں، اسپیڈو ${originSpeedo.route.routeId} لیں ${transferMetro.nameUrdu} تک، اورنج لائن میں تبدیل کریں ${destMetro.nameUrdu} تک`,
    steps: [
      {
        type: 'walk',
        from: 'Your Location',
        to: originSpeedo.stop.name,
        fromUrdu: 'آپ کا مقام',
        toUrdu: originSpeedo.stop.nameUrdu,
        distance: walkToStop / 1000,
        time: Math.round(walkToStop / 80),
        fare: 0,
      },
      {
        type: 'bus',
        from: originSpeedo.stop.name,
        to: transferMetro.name,
        fromUrdu: originSpeedo.stop.nameUrdu,
        toUrdu: transferMetro.nameUrdu,
        distance: speedoDistance / 1000,
        time: speedoTime,
        fare: originSpeedo.route.fare,
        routeId: originSpeedo.route.routeId,
        routeName: originSpeedo.route.name,
        routeNameUrdu: originSpeedo.route.nameUrdu,
      },
      {
        type: 'metro',
        from: transferMetro.name,
        to: destMetro.name,
        fromUrdu: transferMetro.nameUrdu,
        toUrdu: destMetro.nameUrdu,
        distance: metroDistance / 1000,
        time: metroTime,
        fare: 50, // Metro fare
        routeId: 'OL',
        routeName: 'Orange Line',
        routeNameUrdu: 'اورنج لائن',
      },
      {
        type: 'walk',
        from: destMetro.name,
        to: 'Destination',
        fromUrdu: destMetro.nameUrdu,
        toUrdu: 'منزل',
        distance: walkFromMetro / 1000,
        time: Math.round(walkFromMetro / 80),
        fare: 0,
      },
    ],
    totalDistance,
    estimatedTime: totalTime,
    totalFare: originSpeedo.route.fare + 50,
    confidence: 'high',
    score: 0,
    ranking: 0,
    reasons: [],
    metrics: {
      etaMinutes: totalTime,
      transfers: 1,
      walkKm: (walkToStop + walkFromMetro) / 1000,
      cost: originSpeedo.route.fare + 50,
    },
  };
};

/**
 * Create Metro → Speedo route
 */
const createMetroSpeedoRoute = (
  origin: Coordinate,
  _destination: Coordinate,
  originMetro: MetroStation,
  destSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number }
): ScoredRoute | null => {
  const walkToMetro = calculateDistance(origin, { lat: originMetro.lat, lng: originMetro.lng }) * 1000;
  const metroDistance = calculateDistance(
    { lat: originMetro.lat, lng: originMetro.lng },
    { lat: destSpeedo.stop.lat, lng: destSpeedo.stop.lng }
  ) * 1000;
  const walkFromStop = destSpeedo.distance * 1000;

  const totalDistance = (walkToMetro + metroDistance + walkFromStop) / 1000;
  const walkTime = Math.round((walkToMetro + walkFromStop) / 80);
  const metroTime = Math.round(metroDistance / 1000);
  const totalTime = walkTime + metroTime;

  return {
    id: `demo-metro-speedo-${destSpeedo.route.routeId}`,
    type: 'bus-metro',
    title: `Orange Line + Speedo ${destSpeedo.route.routeId}`,
    titleUrdu: `اورنج لائن + اسپیڈو ${destSpeedo.route.routeId}`,
    description: `Walk to ${originMetro.name}, take Orange Line, then Speedo ${destSpeedo.route.routeId} to ${destSpeedo.stop.name}`,
    descriptionUrdu: `${originMetro.nameUrdu} تک پیدل جائیں، اورنج لائن لیں، پھر اسپیڈو ${destSpeedo.route.routeId} لیں ${destSpeedo.stop.nameUrdu} تک`,
    steps: [
      {
        type: 'walk',
        from: 'Your Location',
        to: originMetro.name,
        fromUrdu: 'آپ کا مقام',
        toUrdu: originMetro.nameUrdu,
        distance: walkToMetro / 1000,
        time: Math.round(walkToMetro / 80),
        fare: 0,
      },
      {
        type: 'metro',
        from: originMetro.name,
        to: destSpeedo.stop.name,
        fromUrdu: originMetro.nameUrdu,
        toUrdu: destSpeedo.stop.nameUrdu,
        distance: metroDistance / 1000,
        time: metroTime,
        fare: 50,
        routeId: 'OL',
        routeName: 'Orange Line',
        routeNameUrdu: 'اورنج لائن',
      },
      {
        type: 'walk',
        from: destSpeedo.stop.name,
        to: 'Destination',
        fromUrdu: destSpeedo.stop.nameUrdu,
        toUrdu: 'منزل',
        distance: walkFromStop / 1000,
        time: Math.round(walkFromStop / 80),
        fare: 0,
      },
    ],
    totalDistance,
    estimatedTime: totalTime,
    totalFare: 50 + destSpeedo.route.fare,
    confidence: 'high',
    score: 0,
    ranking: 0,
    reasons: [],
    metrics: {
      etaMinutes: totalTime,
      transfers: 0, // Metro to walk is not a transfer
      walkKm: (walkToMetro + walkFromStop) / 1000,
      cost: 50 + destSpeedo.route.fare,
    },
  };
};

/**
 * Create direct Metro route
 */
const createDirectMetroRoute = (
  origin: Coordinate,
  destination: Coordinate,
  originMetro: MetroStation,
  destMetro: MetroStation
): ScoredRoute | null => {
  const walkToMetro = calculateDistance(origin, { lat: originMetro.lat, lng: originMetro.lng }) * 1000;
  const metroDistance = calculateDistance(
    { lat: originMetro.lat, lng: originMetro.lng },
    { lat: destMetro.lat, lng: destMetro.lng }
  ) * 1000;
  const walkFromMetro = calculateDistance(
    { lat: destMetro.lat, lng: destMetro.lng },
    destination
  ) * 1000;

  const totalDistance = (walkToMetro + metroDistance + walkFromMetro) / 1000;
  const walkTime = Math.round((walkToMetro + walkFromMetro) / 80);
  const metroTime = Math.round(metroDistance / 1000);
  const totalTime = walkTime + metroTime;

  return {
    id: `demo-metro-${originMetro.id}-${destMetro.id}`,
    type: 'metro-only',
    title: 'Orange Line Direct',
    titleUrdu: 'اورنج لائن براہ راست',
    description: `Walk to ${originMetro.name}, take Orange Line to ${destMetro.name}`,
    descriptionUrdu: `${originMetro.nameUrdu} تک پیدل جائیں، اورنج لائن لیں ${destMetro.nameUrdu} تک`,
    steps: [
      {
        type: 'walk',
        from: 'Your Location',
        to: originMetro.name,
        fromUrdu: 'آپ کا مقام',
        toUrdu: originMetro.nameUrdu,
        distance: walkToMetro / 1000,
        time: Math.round(walkToMetro / 80),
        fare: 0,
      },
      {
        type: 'metro',
        from: originMetro.name,
        to: destMetro.name,
        fromUrdu: originMetro.nameUrdu,
        toUrdu: destMetro.nameUrdu,
        distance: metroDistance / 1000,
        time: metroTime,
        fare: 50,
        routeId: 'OL',
        routeName: 'Orange Line',
        routeNameUrdu: 'اورنج لائن',
      },
      {
        type: 'walk',
        from: destMetro.name,
        to: 'Destination',
        fromUrdu: destMetro.nameUrdu,
        toUrdu: 'منزل',
        distance: walkFromMetro / 1000,
        time: Math.round(walkFromMetro / 80),
        fare: 0,
      },
    ],
    totalDistance,
    estimatedTime: totalTime,
    totalFare: 50,
    confidence: 'high',
    score: 0,
    ranking: 0,
    reasons: [],
    metrics: {
      etaMinutes: totalTime,
      transfers: 0,
      walkKm: (walkToMetro + walkFromMetro) / 1000,
      cost: 50,
    },
  };
};

/**
 * Create multi-transfer route (Speedo → Metro → Speedo)
 */
const createMultiTransferRoute = (
  _origin: Coordinate,
  _destination: Coordinate,
  originSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number },
  destSpeedo: { route: SpeedoRoute; stop: SpeedoStop; distance: number }
): ScoredRoute | null => {
  // Find metro station between the two Speedo stops
  const transferMetro = findNearestMetroStation(
    { lat: (originSpeedo.stop.lat + destSpeedo.stop.lat) / 2, lng: (originSpeedo.stop.lng + destSpeedo.stop.lng) / 2 },
    1
  );
  if (!transferMetro) return null;

  const walkToStop = originSpeedo.distance * 1000;
  const speedo1Distance = calculateDistance(
    { lat: originSpeedo.stop.lat, lng: originSpeedo.stop.lng },
    { lat: transferMetro.lat, lng: transferMetro.lng }
  ) * 1000;
  const metroDistance = calculateDistance(
    { lat: transferMetro.lat, lng: transferMetro.lng },
    { lat: destSpeedo.stop.lat, lng: destSpeedo.stop.lng }
  ) * 1000;
  const walkFromStop = destSpeedo.distance * 1000;

  const totalDistance = (walkToStop + speedo1Distance + metroDistance + walkFromStop) / 1000;
  const walkTime = Math.round((walkToStop + walkFromStop) / 80);
  const speedo1Time = Math.round(speedo1Distance / 500);
  const metroTime = Math.round(metroDistance / 1000);
  const totalTime = walkTime + speedo1Time + metroTime;

  return {
    id: `demo-multi-${originSpeedo.route.routeId}-${destSpeedo.route.routeId}`,
    type: 'bus-metro',
    title: `Speedo ${originSpeedo.route.routeId} + Orange Line + Speedo ${destSpeedo.route.routeId}`,
    titleUrdu: `اسپیڈو ${originSpeedo.route.routeId} + اورنج لائن + اسپیڈو ${destSpeedo.route.routeId}`,
    description: `Walk to ${originSpeedo.stop.name}, take Speedo ${originSpeedo.route.routeId} to ${transferMetro.name}, transfer to Orange Line, then Speedo ${destSpeedo.route.routeId} to ${destSpeedo.stop.name}`,
    descriptionUrdu: `${originSpeedo.stop.nameUrdu} تک پیدل جائیں، اسپیڈو ${originSpeedo.route.routeId} لیں ${transferMetro.nameUrdu} تک، اورنج لائن میں تبدیل کریں، پھر اسپیڈو ${destSpeedo.route.routeId} لیں ${destSpeedo.stop.nameUrdu} تک`,
    steps: [
      {
        type: 'walk',
        from: 'Your Location',
        to: originSpeedo.stop.name,
        fromUrdu: 'آپ کا مقام',
        toUrdu: originSpeedo.stop.nameUrdu,
        distance: walkToStop / 1000,
        time: Math.round(walkToStop / 80),
        fare: 0,
      },
      {
        type: 'bus',
        from: originSpeedo.stop.name,
        to: transferMetro.name,
        fromUrdu: originSpeedo.stop.nameUrdu,
        toUrdu: transferMetro.nameUrdu,
        distance: speedo1Distance / 1000,
        time: speedo1Time,
        fare: originSpeedo.route.fare,
        routeId: originSpeedo.route.routeId,
        routeName: originSpeedo.route.name,
        routeNameUrdu: originSpeedo.route.nameUrdu,
      },
      {
        type: 'metro',
        from: transferMetro.name,
        to: destSpeedo.stop.name,
        fromUrdu: transferMetro.nameUrdu,
        toUrdu: destSpeedo.stop.nameUrdu,
        distance: metroDistance / 1000,
        time: metroTime,
        fare: 50,
        routeId: 'OL',
        routeName: 'Orange Line',
        routeNameUrdu: 'اورنج لائن',
      },
      {
        type: 'walk',
        from: destSpeedo.stop.name,
        to: 'Destination',
        fromUrdu: destSpeedo.stop.nameUrdu,
        toUrdu: 'منزل',
        distance: walkFromStop / 1000,
        time: Math.round(walkFromStop / 80),
        fare: 0,
      },
    ],
    totalDistance,
    estimatedTime: totalTime,
    totalFare: originSpeedo.route.fare + 50 + destSpeedo.route.fare,
    confidence: 'medium',
    score: 0,
    ranking: 0,
    reasons: [],
    metrics: {
      etaMinutes: totalTime,
      transfers: 2,
      walkKm: (walkToStop + walkFromStop) / 1000,
      cost: originSpeedo.route.fare + 50 + destSpeedo.route.fare,
    },
  };
};

