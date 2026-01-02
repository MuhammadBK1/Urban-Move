/**
 * =====================================================
 * TRIP PLANNER SERVICE
 * =====================================================
 * 
 * Plans trips using Speedo routes and Metro connections
 * Finds direct routes or routes with transfers
 * =====================================================
 */

import { speedoRoutes } from "../data/speedoRoutes";
import { metroStops } from "../data/metroStops";

export interface TripPlan {
  type: "DIRECT_BUS" | "BUS_METRO" | "METRO_BUS" | "NOT_FOUND";
  steps: string[];
  totalRoutes?: number;
  transferPoint?: string;
}

/**
 * Plan a trip from one location to another
 * @param from - Starting location
 * @param to - Destination location
 * @returns Trip plan with steps and route information
 */
export function planTrip(from: string, to: string): TripPlan {
  if (!from || !to) {
    return { type: "NOT_FOUND", steps: [] };
  }

  // Normalize input (trim and handle case)
  const fromNormalized = from.trim();
  const toNormalized = to.trim();

  // 1. Check for direct Speedo route
  const directBus = speedoRoutes.find(
    r => r.from.toLowerCase() === fromNormalized.toLowerCase() && 
         r.to.toLowerCase() === toNormalized.toLowerCase()
  );

  if (directBus) {
    return {
      type: "DIRECT_BUS",
      steps: [`Take Speedo Route ${directBus.routeNo} from ${directBus.from} to ${directBus.to}`],
      totalRoutes: 1
    };
  }

  // 2. Check for reverse direct route (to -> from)
  const reverseDirectBus = speedoRoutes.find(
    r => r.from.toLowerCase() === toNormalized.toLowerCase() && 
         r.to.toLowerCase() === fromNormalized.toLowerCase()
  );

  if (reverseDirectBus) {
    return {
      type: "DIRECT_BUS",
      steps: [`Take Speedo Route ${reverseDirectBus.routeNo} from ${reverseDirectBus.from} to ${reverseDirectBus.to} (reverse direction)`],
      totalRoutes: 1
    };
  }

  // 3. Check for BUS -> METRO transfer
  for (const stop of metroStops) {
    const busToMetro = speedoRoutes.find(
      r => r.from.toLowerCase() === fromNormalized.toLowerCase() && 
           r.to.toLowerCase() === stop.toLowerCase()
    );
    
    if (busToMetro) {
      // Check if destination is a metro stop
      const isMetroStop = metroStops.some(
        s => s.toLowerCase() === toNormalized.toLowerCase()
      );
      
      if (isMetroStop) {
        return {
          type: "BUS_METRO",
          steps: [
            `Take Speedo Route ${busToMetro.routeNo} from ${busToMetro.from} to ${stop}`,
            `Transfer to Metro at ${stop}`,
            `Travel by Metro to ${toNormalized}`
          ],
          totalRoutes: 2,
          transferPoint: stop
        };
      }
    }
  }

  // 4. Check for METRO -> BUS transfer
  for (const stop of metroStops) {
    const metroToBus = speedoRoutes.find(
      r => r.from.toLowerCase() === stop.toLowerCase() && 
           r.to.toLowerCase() === toNormalized.toLowerCase()
    );
    
    if (metroToBus) {
      // Check if origin is a metro stop
      const isMetroStop = metroStops.some(
        s => s.toLowerCase() === fromNormalized.toLowerCase()
      );
      
      if (isMetroStop) {
        return {
          type: "METRO_BUS",
          steps: [
            `Travel by Metro from ${fromNormalized} to ${stop}`,
            `Transfer to Speedo Route ${metroToBus.routeNo} at ${stop}`,
            `Take Speedo Route ${metroToBus.routeNo} to ${metroToBus.to}`
          ],
          totalRoutes: 2,
          transferPoint: stop
        };
      }
    }
  }

  // 5. Check for BUS -> METRO -> BUS (two transfers)
  for (const metroStop1 of metroStops) {
    const busToMetro = speedoRoutes.find(
      r => r.from.toLowerCase() === fromNormalized.toLowerCase() && 
           r.to.toLowerCase() === metroStop1.toLowerCase()
    );
    
    if (busToMetro) {
      for (const metroStop2 of metroStops) {
        if (metroStop1.toLowerCase() !== metroStop2.toLowerCase()) {
          const metroToBus = speedoRoutes.find(
            r => r.from.toLowerCase() === metroStop2.toLowerCase() && 
                 r.to.toLowerCase() === toNormalized.toLowerCase()
          );
          
          if (metroToBus) {
            return {
              type: "BUS_METRO",
              steps: [
                `Take Speedo Route ${busToMetro.routeNo} from ${busToMetro.from} to ${metroStop1}`,
                `Transfer to Metro at ${metroStop1}`,
                `Travel by Metro from ${metroStop1} to ${metroStop2}`,
                `Transfer to Speedo Route ${metroToBus.routeNo} at ${metroStop2}`,
                `Take Speedo Route ${metroToBus.routeNo} to ${metroToBus.to}`
              ],
              totalRoutes: 3,
              transferPoint: `${metroStop1} → ${metroStop2}`
            };
          }
        }
      }
    }
  }

  // No route found
  return {
    type: "NOT_FOUND",
    steps: [`No route found from ${fromNormalized} to ${toNormalized}`]
  };
}

/**
 * Find all possible routes between two locations
 * @param from - Starting location
 * @param to - Destination location
 * @returns Array of all possible trip plans
 */
export function findAllRoutes(from: string, to: string): TripPlan[] {
  const routes: TripPlan[] = [];
  
  if (!from || !to) {
    return routes;
  }

  const fromNormalized = from.trim();
  const toNormalized = to.trim();

  // Direct routes
  const directRoutes = speedoRoutes.filter(
    r => r.from.toLowerCase() === fromNormalized.toLowerCase() && 
         r.to.toLowerCase() === toNormalized.toLowerCase()
  );

  directRoutes.forEach(route => {
    routes.push({
      type: "DIRECT_BUS",
      steps: [`Take Speedo Route ${route.routeNo} from ${route.from} to ${route.to}`],
      totalRoutes: 1
    });
  });

  // BUS -> METRO routes
  for (const stop of metroStops) {
    const busToMetro = speedoRoutes.find(
      r => r.from.toLowerCase() === fromNormalized.toLowerCase() && 
           r.to.toLowerCase() === stop.toLowerCase()
    );
    
    if (busToMetro) {
      const isMetroStop = metroStops.some(
        s => s.toLowerCase() === toNormalized.toLowerCase()
      );
      
      if (isMetroStop) {
        routes.push({
          type: "BUS_METRO",
          steps: [
            `Take Speedo Route ${busToMetro.routeNo} from ${busToMetro.from} to ${stop}`,
            `Transfer to Metro at ${stop}`,
            `Travel by Metro to ${toNormalized}`
          ],
          totalRoutes: 2,
          transferPoint: stop
        });
      }
    }
  }

  return routes;
}

