/**
 * =====================================================
 * BUS SIMULATION SERVICE
 * =====================================================
 * 
 * Simple bus movement simulation along route coordinates
 * Updates position at regular intervals
 * =====================================================
 */

import { Coordinate } from '../types';

/**
 * Simulate bus movement along route coordinates
 * @param routeCoordinates - Array of coordinates representing the route path
 * @param setPosition - Callback function to update position (lat, lng)
 * @param intervalMs - Update interval in milliseconds (default: 2000ms)
 * @returns Cleanup function to stop the simulation
 */
export function simulateBusMovement(
  routeCoordinates: Coordinate[],
  setPosition: (position: Coordinate) => void,
  intervalMs: number = 2000
): () => void {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    console.warn('No route coordinates provided for simulation');
    return () => {};
  }

  let index = 0;

  const interval = setInterval(() => {
    if (index >= routeCoordinates.length) {
      clearInterval(interval);
      return;
    }
    
    setPosition(routeCoordinates[index]);
    index++;
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

/**
 * Simulate bus movement with loop (restarts at beginning when reaching end)
 * @param routeCoordinates - Array of coordinates representing the route path
 * @param setPosition - Callback function to update position (lat, lng)
 * @param intervalMs - Update interval in milliseconds (default: 2000ms)
 * @returns Cleanup function to stop the simulation
 */
export function simulateBusMovementLoop(
  routeCoordinates: Coordinate[],
  setPosition: (position: Coordinate) => void,
  intervalMs: number = 2000
): () => void {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    console.warn('No route coordinates provided for simulation');
    return () => {};
  }

  let index = 0;

  const interval = setInterval(() => {
    setPosition(routeCoordinates[index]);
    index++;
    
    // Loop back to start when reaching end
    if (index >= routeCoordinates.length) {
      index = 0;
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

/**
 * Simulate bus movement with round trip (forward then backward)
 * @param routeCoordinates - Array of coordinates representing the route path
 * @param setPosition - Callback function to update position (lat, lng)
 * @param intervalMs - Update interval in milliseconds (default: 2000ms)
 * @returns Cleanup function to stop the simulation
 */
export function simulateBusMovementRoundTrip(
  routeCoordinates: Coordinate[],
  setPosition: (position: Coordinate) => void,
  intervalMs: number = 2000
): () => void {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    console.warn('No route coordinates provided for simulation');
    return () => {};
  }

  let index = 0;
  let direction: 'forward' | 'backward' = 'forward';

  const interval = setInterval(() => {
    if (direction === 'forward') {
      setPosition(routeCoordinates[index]);
      index++;
      
      // Reverse direction at end
      if (index >= routeCoordinates.length) {
        index = routeCoordinates.length - 2; // Go back one step
        direction = 'backward';
      }
    } else {
      setPosition(routeCoordinates[index]);
      index--;
      
      // Reverse direction at start
      if (index < 0) {
        index = 1; // Go forward one step
        direction = 'forward';
      }
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

/**
 * Simulate smooth bus movement with interpolation between coordinates
 * @param routeCoordinates - Array of coordinates representing the route path
 * @param setPosition - Callback function to update position (lat, lng)
 * @param intervalMs - Update interval in milliseconds (default: 500ms for smoother movement)
 * @param stepsPerSegment - Number of interpolation steps between each coordinate (default: 10)
 * @returns Cleanup function to stop the simulation
 */
export function simulateBusMovementSmooth(
  routeCoordinates: Coordinate[],
  setPosition: (position: Coordinate) => void,
  intervalMs: number = 500,
  stepsPerSegment: number = 10
): () => void {
  if (!routeCoordinates || routeCoordinates.length === 0) {
    console.warn('No route coordinates provided for simulation');
    return () => {};
  }

  let segmentIndex = 0;
  let stepIndex = 0;

  const interval = setInterval(() => {
    if (segmentIndex >= routeCoordinates.length - 1) {
      clearInterval(interval);
      return;
    }

    const start = routeCoordinates[segmentIndex];
    const end = routeCoordinates[segmentIndex + 1];
    const progress = stepIndex / stepsPerSegment;

    // Interpolate position
    const lat = start.lat + (end.lat - start.lat) * progress;
    const lng = start.lng + (end.lng - start.lng) * progress;

    setPosition({ lat, lng });

    stepIndex++;
    if (stepIndex >= stepsPerSegment) {
      stepIndex = 0;
      segmentIndex++;
    }
  }, intervalMs);

  // Return cleanup function
  return () => {
    clearInterval(interval);
  };
}

