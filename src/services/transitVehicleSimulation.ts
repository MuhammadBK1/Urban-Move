/**
 * =====================================================
 * TRANSIT VEHICLE SIMULATION SERVICE
 * =====================================================
 * 
 * Simulates live tracking for:
 * - Metro Bus vehicles
 * - Orange Line Metro trains
 * - Regular bus routes
 * 
 * Updates positions every 3-5 seconds
 * Labeled as "Live (Simulated)"
 * =====================================================
 */

import transitData from '../data/transitData';

// =====================================================
// TYPES
// =====================================================

export interface TransitVehicle {
  id: string;
  type: 'metro-bus' | 'orange-line' | 'bus';
  routeId: string;
  routeName: string;
  routeNameUrdu: string;
  currentPosition: [number, number]; // [lng, lat]
  stopIndex: number;
  progress: number; // 0 to 1 along current segment
  direction: 'forward' | 'backward';
  vehicleNumber?: string;
}

interface TransitRoute {
  id: string;
  stops: Array<{ lat: number; lng: number; id: string; name: string; nameUrdu: string }>;
}

// =====================================================
// SIMULATION STATE
// =====================================================

const vehicles: Map<string, TransitVehicle> = new Map();

// =====================================================
// INITIALIZE VEHICLES
// =====================================================

/**
 * Initialize simulated vehicles for all transit routes
 */
export const initializeTransitVehicles = (): TransitVehicle[] => {
  vehicles.clear();

  // Metro Bus vehicles (3 vehicles)
  transitData.metroBus.stations.forEach((station, index) => {
    if (index % 6 === 0) { // One vehicle every 6 stations
      const vehicle: TransitVehicle = {
        id: `mb-vehicle-${index}`,
        type: 'metro-bus',
        routeId: 'metro-bus',
        routeName: transitData.metroBus.name,
        routeNameUrdu: transitData.metroBus.nameUrdu,
        currentPosition: [station.lng, station.lat],
        stopIndex: index,
        progress: Math.random(),
        direction: 'forward',
        vehicleNumber: `MB-${String(index + 1).padStart(3, '0')}`,
      };
      vehicles.set(vehicle.id, vehicle);
    }
  });

  // Orange Line trains (2 trains)
  transitData.orangeLine.stations.forEach((station, index) => {
    if (index % 10 === 0) { // One train every 10 stations
      const vehicle: TransitVehicle = {
        id: `ol-train-${index}`,
        type: 'orange-line',
        routeId: 'orange-line',
        routeName: transitData.orangeLine.name,
        routeNameUrdu: transitData.orangeLine.nameUrdu,
        currentPosition: [station.lng, station.lat],
        stopIndex: index,
        progress: Math.random(),
        direction: 'forward',
        vehicleNumber: `OL-${String(index + 1).padStart(2, '0')}`,
      };
      vehicles.set(vehicle.id, vehicle);
    }
  });

  // Regular bus vehicles (2 vehicles per route)
  transitData.busRoutes.forEach((route) => {
    // Forward direction vehicle
    const forwardVehicle: TransitVehicle = {
      id: `bus-${route.id}-forward`,
      type: 'bus',
      routeId: route.id,
      routeName: route.name,
      routeNameUrdu: route.nameUrdu,
      currentPosition: [route.stops[0].lng, route.stops[0].lat],
      stopIndex: 0,
      progress: Math.random() * 0.3,
      direction: 'forward',
      vehicleNumber: `BUS-${route.number}-F`,
    };
    vehicles.set(forwardVehicle.id, forwardVehicle);

    // Backward direction vehicle (if route has enough stops)
    if (route.stops.length > 3) {
      const backwardVehicle: TransitVehicle = {
        id: `bus-${route.id}-backward`,
        type: 'bus',
        routeId: route.id,
        routeName: route.name,
        routeNameUrdu: route.nameUrdu,
        currentPosition: [route.stops[route.stops.length - 1].lng, route.stops[route.stops.length - 1].lat],
        stopIndex: route.stops.length - 1,
        progress: Math.random() * 0.3,
        direction: 'backward',
        vehicleNumber: `BUS-${route.number}-B`,
      };
      vehicles.set(backwardVehicle.id, backwardVehicle);
    }
  });

  return Array.from(vehicles.values());
};

// =====================================================
// UPDATE VEHICLE POSITIONS
// =====================================================

/**
 * Update all vehicle positions along their routes
 */
export const updateTransitVehiclePositions = (): TransitVehicle[] => {
  vehicles.forEach((vehicle, vehicleId) => {
    let route: TransitRoute | null = null;

    // Get route based on vehicle type
    if (vehicle.type === 'metro-bus') {
      route = {
        id: 'metro-bus',
        stops: transitData.metroBus.stations,
      };
    } else if (vehicle.type === 'orange-line') {
      route = {
        id: 'orange-line',
        stops: transitData.orangeLine.stations,
      };
    } else if (vehicle.type === 'bus') {
      const busRoute = transitData.busRoutes.find(r => r.id === vehicle.routeId);
      if (busRoute) {
        route = {
          id: busRoute.id,
          stops: busRoute.stops,
        };
      }
    }

    if (!route || route.stops.length === 0) return;

    // Calculate movement speed (varies by vehicle type)
    let speed = 0.08; // Default speed
    if (vehicle.type === 'orange-line') {
      speed = 0.12; // Trains move faster
    } else if (vehicle.type === 'metro-bus') {
      speed = 0.10; // Metro bus moves medium speed
    } else {
      speed = 0.06 + Math.random() * 0.04; // Buses vary
    }

    // Update progress
    vehicle.progress += speed;

    // Check if reached next stop
    if (vehicle.progress >= 1) {
      vehicle.progress = 0;

      if (vehicle.direction === 'forward') {
        vehicle.stopIndex++;
        // Reverse direction at end
        if (vehicle.stopIndex >= route.stops.length - 1) {
          vehicle.stopIndex = route.stops.length - 1;
          vehicle.direction = 'backward';
        }
      } else {
        vehicle.stopIndex--;
        // Reverse direction at start
        if (vehicle.stopIndex <= 0) {
          vehicle.stopIndex = 0;
          vehicle.direction = 'forward';
        }
      }
    }

    // Calculate current position
    const currentStop = route.stops[vehicle.stopIndex];
    let nextStop: typeof currentStop;

    if (vehicle.direction === 'forward') {
      nextStop = route.stops[Math.min(vehicle.stopIndex + 1, route.stops.length - 1)];
    } else {
      nextStop = route.stops[Math.max(vehicle.stopIndex - 1, 0)];
    }

    // Interpolate position between stops
    const newLng = currentStop.lng + (nextStop.lng - currentStop.lng) * vehicle.progress;
    const newLat = currentStop.lat + (nextStop.lat - currentStop.lat) * vehicle.progress;

    vehicle.currentPosition = [newLng, newLat];
    vehicles.set(vehicleId, vehicle);
  });

  return Array.from(vehicles.values());
};

// =====================================================
// GET VEHICLES
// =====================================================

/**
 * Get all simulated vehicles
 */
export const getTransitVehicles = (): TransitVehicle[] => {
  return Array.from(vehicles.values());
};

/**
 * Get vehicles for a specific route
 */
export const getVehiclesForRoute = (routeId: string): TransitVehicle[] => {
  return Array.from(vehicles.values()).filter(v => v.routeId === routeId);
};

/**
 * Get vehicles by type
 */
export const getVehiclesByType = (type: 'metro-bus' | 'orange-line' | 'bus'): TransitVehicle[] => {
  return Array.from(vehicles.values()).filter(v => v.type === type);
};

// =====================================================
// CLEANUP
// =====================================================

/**
 * Clear all simulated vehicles
 */
export const clearTransitVehicles = (): void => {
  vehicles.clear();
};

