/**
 * =====================================================
 * ROUTE FINDER SERVICE
 * =====================================================
 * 
 * Finds optimal routes between two locations using:
 * - Metro Bus stations
 * - Orange Line stations
 * - Feeder routes
 * =====================================================
 */

import { Coordinate } from '../types';
import { getAllStations, feederRoutes } from '../data';
import { calculateDistance } from './mapService';
import stationsData from '../data/stations.json';
import { getBusRouteById, findNearestStop } from '../data/transitData';

// =====================================================
// TYPES
// =====================================================

export interface RouteSuggestion {
  id: string;
  type: 'bus-only' | 'metro-only' | 'bus-metro' | 'feeder-only';
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number; // in minutes
  totalFare: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface RouteStep {
  type: 'walk' | 'bus' | 'metro' | 'feeder';
  from: string;
  to: string;
  fromUrdu?: string;
  toUrdu?: string;
  distance: number;
  time: number;
  fare: number;
  routeId?: string;
  routeName?: string;
  routeNameUrdu?: string;
}

// =====================================================
// FIND NEAREST STATION
// =====================================================

/**
 * Find nearest station to a location
 */
export const findNearestStation = (
  location: Coordinate,
  stations: Array<{ lat: number; lng: number; id: string; name: string; nameUrdu: string }>
): { station: typeof stations[0]; distance: number } | null => {
  if (stations.length === 0) return null;

  let nearest = stations[0];
  let minDistance = calculateDistance(location, { lat: stations[0].lat, lng: stations[0].lng });

  for (const station of stations) {
    const distance = calculateDistance(location, { lat: station.lat, lng: station.lng });
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return { station: nearest, distance: minDistance };
};

// =====================================================
// FIND ROUTE SUGGESTIONS
// =====================================================

/**
 * Find route suggestions between two locations
 */
export const findRoutes = (
  from: Coordinate,
  to: Coordinate,
  _lang: 'en' | 'ur' = 'en'
): RouteSuggestion[] => {
  const suggestions: RouteSuggestion[] = [];
  const allStations = getAllStations();

  // Find nearest stations
  const fromStation = findNearestStation(from, allStations);
  const toStation = findNearestStation(to, allStations);

  if (!fromStation || !toStation) {
    return suggestions;
  }

  // Calculate walking distances
  const walkToStation = fromStation.distance;
  const walkFromStation = toStation.distance;
  const walkTimeToStation = Math.round(walkToStation * 12); // ~12 min/km walking
  const walkTimeFromStation = Math.round(walkFromStation * 12);

  // Determine which lines the stations are on
  const metroBusStationList = stationsData.metroBus.stations;
  const orangeLineStationList = stationsData.orangeLine.stations;
  
  const fromIsMetroBus = metroBusStationList.some((s) => s.id === fromStation.station.id);
  const fromIsOrangeLine = orangeLineStationList.some((s) => s.id === fromStation.station.id);
  const toIsMetroBus = metroBusStationList.some((s) => s.id === toStation.station.id);
  const toIsOrangeLine = orangeLineStationList.some((s) => s.id === toStation.station.id);

  // SUGGESTION 1: Metro Bus Only (if both on Metro Bus)
  if (fromIsMetroBus && toIsMetroBus) {
    const stationDistance = calculateDistance(
      { lat: fromStation.station.lat, lng: fromStation.station.lng },
      { lat: toStation.station.lat, lng: toStation.station.lng }
    );
    const metroTime = Math.round(stationDistance * 2); // ~2 min/km on metro
    const totalTime = walkTimeToStation + metroTime + walkTimeFromStation;

    suggestions.push({
      id: 'route-metro-bus-only',
      type: 'metro-only',
      title: 'Metro Bus Direct',
      titleUrdu: 'میٹرو بس براہ راست',
      description: `Walk to ${fromStation.station.name}, take Metro Bus to ${toStation.station.name}`,
      descriptionUrdu: `${fromStation.station.nameUrdu} تک پیدل جائیں، میٹرو بس سے ${toStation.station.nameUrdu} جائیں`,
      steps: [
        {
          type: 'walk',
          from: 'Your location',
          to: fromStation.station.name,
          fromUrdu: 'آپ کا مقام',
          toUrdu: fromStation.station.nameUrdu,
          distance: walkToStation,
          time: walkTimeToStation,
          fare: 0,
        },
        {
          type: 'metro',
          from: fromStation.station.name,
          to: toStation.station.name,
          fromUrdu: fromStation.station.nameUrdu,
          toUrdu: toStation.station.nameUrdu,
          distance: stationDistance,
          time: metroTime,
          fare: 30, // Metro Bus fare
        },
        {
          type: 'walk',
          from: toStation.station.name,
          to: 'Destination',
          fromUrdu: toStation.station.nameUrdu,
          toUrdu: 'منزل',
          distance: walkFromStation,
          time: walkTimeFromStation,
          fare: 0,
        },
      ],
      totalDistance: walkToStation + stationDistance + walkFromStation,
      estimatedTime: totalTime,
      totalFare: 30,
      confidence: 'high',
    });
  }

  // SUGGESTION 2: Orange Line Only (if both on Orange Line)
  if (fromIsOrangeLine && toIsOrangeLine) {
    const stationDistance = calculateDistance(
      { lat: fromStation.station.lat, lng: fromStation.station.lng },
      { lat: toStation.station.lat, lng: toStation.station.lng }
    );
    const metroTime = Math.round(stationDistance * 2);
    const totalTime = walkTimeToStation + metroTime + walkTimeFromStation;

    suggestions.push({
      id: 'route-orange-line-only',
      type: 'metro-only',
      title: 'Orange Line Direct',
      titleUrdu: 'اورنج لائن براہ راست',
      description: `Walk to ${fromStation.station.name}, take Orange Line to ${toStation.station.name}`,
      descriptionUrdu: `${fromStation.station.nameUrdu} تک پیدل جائیں، اورنج لائن سے ${toStation.station.nameUrdu} جائیں`,
      steps: [
        {
          type: 'walk',
          from: 'Your location',
          to: fromStation.station.name,
          fromUrdu: 'آپ کا مقام',
          toUrdu: fromStation.station.nameUrdu,
          distance: walkToStation,
          time: walkTimeToStation,
          fare: 0,
        },
        {
          type: 'metro',
          from: fromStation.station.name,
          to: toStation.station.name,
          fromUrdu: fromStation.station.nameUrdu,
          toUrdu: toStation.station.nameUrdu,
          distance: stationDistance,
          time: metroTime,
          fare: 40, // Orange Line fare
        },
        {
          type: 'walk',
          from: toStation.station.name,
          to: 'Destination',
          fromUrdu: toStation.station.nameUrdu,
          toUrdu: 'منزل',
          distance: walkFromStation,
          time: walkTimeFromStation,
          fare: 0,
        },
      ],
      totalDistance: walkToStation + stationDistance + walkFromStation,
      estimatedTime: totalTime,
      totalFare: 40,
      confidence: 'high',
    });
  }

  // SUGGESTION 3: Bus Route (if available)
  // Find bus routes that connect origin and destination
  const fromBusStop = findNearestStop(from, 2); // Within 2km
  const toBusStop = findNearestStop(to, 2);

  if (fromBusStop && toBusStop && fromBusStop.routeId && toBusStop.routeId && fromBusStop.routeId === toBusStop.routeId) {
    // Same bus route - direct connection
    const busRoute = getBusRouteById(fromBusStop.routeId);
    if (busRoute) {
      const fromIndex = busRoute.stops.findIndex(s => s.id === fromBusStop.id);
      const toIndex = busRoute.stops.findIndex(s => s.id === toBusStop.id);
      
      if (fromIndex !== -1 && toIndex !== -1 && toIndex > fromIndex) {
        // Calculate route distance
        let routeDistance = 0;
        for (let i = fromIndex; i < toIndex; i++) {
          routeDistance += calculateDistance(
            { lat: busRoute.stops[i].lat, lng: busRoute.stops[i].lng },
            { lat: busRoute.stops[i + 1].lat, lng: busRoute.stops[i + 1].lng }
          );
        }
        
        const walkToStart = fromBusStop.distance;
        const walkFromEnd = toBusStop.distance;
        const walkTimeToStart = Math.round(walkToStart * 12);
        const walkTimeFromEnd = Math.round(walkFromEnd * 12);
        const busTime = Math.round(routeDistance * 3); // ~3 min/km on bus
        const totalTime = walkTimeToStart + busTime + walkTimeFromEnd;

        suggestions.push({
          id: `route-bus-${busRoute.id}`,
          type: 'bus-only',
          title: `Bus Route ${busRoute.number}`,
          titleUrdu: `بس روٹ ${busRoute.number}`,
          description: `Walk to ${fromBusStop.name}, take Bus ${busRoute.number} to ${toBusStop.name}`,
          descriptionUrdu: `${fromBusStop.nameUrdu} تک پیدل جائیں، بس ${busRoute.number} سے ${toBusStop.nameUrdu} جائیں`,
          steps: [
            {
              type: 'walk',
              from: 'Your location',
              to: fromBusStop.name,
              fromUrdu: 'آپ کا مقام',
              toUrdu: fromBusStop.nameUrdu,
              distance: walkToStart,
              time: walkTimeToStart,
              fare: 0,
            },
            {
              type: 'bus',
              from: fromBusStop.name,
              to: toBusStop.name,
              fromUrdu: fromBusStop.nameUrdu,
              toUrdu: toBusStop.nameUrdu,
              distance: routeDistance,
              time: busTime,
              fare: busRoute.fare,
              routeId: busRoute.id,
              routeName: busRoute.name,
              routeNameUrdu: busRoute.nameUrdu,
            },
            {
              type: 'walk',
              from: toBusStop.name,
              to: 'Destination',
              fromUrdu: toBusStop.nameUrdu,
              toUrdu: 'منزل',
              distance: walkFromEnd,
              time: walkTimeFromEnd,
              fare: 0,
            },
          ],
          totalDistance: walkToStart + routeDistance + walkFromEnd,
          estimatedTime: totalTime,
          totalFare: busRoute.fare,
          confidence: 'high',
        });
      }
    }
  }

  // SUGGESTION 4: Feeder Route (if available)
  // Find feeder routes that connect to stations near origin or destination
  const nearbyFeederRoutes = feederRoutes.filter(route => {
    const routeStart = route.waypoints[0];
    const routeEnd = route.waypoints[route.waypoints.length - 1];
    
    const startToFrom = calculateDistance(from, { lat: routeStart.lat, lng: routeStart.lng });
    const endToTo = calculateDistance(to, { lat: routeEnd.lat, lng: routeEnd.lng });
    
    return startToFrom < 2 && endToTo < 2; // Within 2km
  });

  if (nearbyFeederRoutes.length > 0) {
    const feederRoute = nearbyFeederRoutes[0];
    const routeStart = feederRoute.waypoints[0];
    const routeEnd = feederRoute.waypoints[feederRoute.waypoints.length - 1];
    
    const walkToStart = calculateDistance(from, { lat: routeStart.lat, lng: routeStart.lng });
    const walkFromEnd = calculateDistance(to, { lat: routeEnd.lat, lng: routeEnd.lng });
    const routeDistance = calculateDistance(
      { lat: routeStart.lat, lng: routeStart.lng },
      { lat: routeEnd.lat, lng: routeEnd.lng }
    );
    
    const walkTimeToStart = Math.round(walkToStart * 12);
    const walkTimeFromEnd = Math.round(walkFromEnd * 12);
    const routeTime = Math.round(routeDistance / feederRoute.avgSpeed * 60);
    const totalTime = walkTimeToStart + routeTime + walkTimeFromEnd;

    suggestions.push({
      id: `route-feeder-${feederRoute.id}`,
      type: 'feeder-only',
      title: feederRoute.name,
      titleUrdu: feederRoute.nameUrdu,
      description: `Walk to ${routeStart.name}, take ${feederRoute.vehicleType} to ${routeEnd.name}`,
      descriptionUrdu: `${routeStart.name} تک پیدل جائیں، ${feederRoute.vehicleType} سے ${routeEnd.name} جائیں`,
      steps: [
        {
          type: 'walk',
          from: 'Your location',
          to: routeStart.name,
          fromUrdu: 'آپ کا مقام',
          toUrdu: routeStart.name,
          distance: walkToStart,
          time: walkTimeToStart,
          fare: 0,
        },
        {
          type: 'feeder',
          from: routeStart.name,
          to: routeEnd.name,
          fromUrdu: routeStart.name,
          toUrdu: routeEnd.name,
          distance: routeDistance,
          time: routeTime,
          fare: feederRoute.fare,
          routeId: feederRoute.id,
          routeName: feederRoute.name,
          routeNameUrdu: feederRoute.nameUrdu,
        },
        {
          type: 'walk',
          from: routeEnd.name,
          to: 'Destination',
          fromUrdu: routeEnd.name,
          toUrdu: 'منزل',
          distance: walkFromEnd,
          time: walkTimeFromEnd,
          fare: 0,
        },
      ],
      totalDistance: walkToStart + routeDistance + walkFromEnd,
      estimatedTime: totalTime,
      totalFare: feederRoute.fare,
      confidence: 'medium',
    });
  }

  // Sort by estimated time
  suggestions.sort((a, b) => a.estimatedTime - b.estimatedTime);

  return suggestions;
};

// =====================================================
// PARSE LOCATION INPUT
// =====================================================

/**
 * Parse location input (could be coordinates or station name)
 */
export const parseLocation = (
  input: string,
  allStations: Array<{ lat: number; lng: number; name: string; nameUrdu: string }>
): Coordinate | null => {
  // Try to parse as coordinates (lat,lng)
  const coordMatch = input.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
  if (coordMatch) {
    return {
      lat: parseFloat(coordMatch[1]),
      lng: parseFloat(coordMatch[2]),
    };
  }

  // Try to find by station name
  const station = allStations.find(
    s => s.name.toLowerCase().includes(input.toLowerCase()) ||
         s.nameUrdu.includes(input)
  );
  
  if (station) {
    return { lat: station.lat, lng: station.lng };
  }

  return null;
};

