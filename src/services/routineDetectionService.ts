/**
 * =====================================================
 * ROUTINE DETECTION SERVICE
 * =====================================================
 * 
 * Detects frequently used routes and suggests routine trips
 * =====================================================
 */

interface RouteUsage {
  from: string;
  to: string;
  count: number;
  lastUsed: number;
  times: number[]; // Timestamps of usage
}

const ROUTINE_STORAGE_KEY = 'urbanmove_route_usage';
const ROUTINE_THRESHOLD = 3; // Minimum uses to be considered routine
const TIME_WINDOW = 7 * 24 * 60 * 60 * 1000; // 7 days in ms

/**
 * Record route usage
 */
export const recordRouteUsage = (from: string, to: string) => {
  const existing = JSON.parse(localStorage.getItem(ROUTINE_STORAGE_KEY) || '[]') as RouteUsage[];
  const routeKey = `${from}→${to}`;
  
  let route = existing.find(r => `${r.from}→${r.to}` === routeKey);
  
  if (route) {
    route.count++;
    route.lastUsed = Date.now();
    route.times.push(Date.now());
    // Keep only last 30 uses
    if (route.times.length > 30) {
      route.times = route.times.slice(-30);
    }
  } else {
    route = {
      from,
      to,
      count: 1,
      lastUsed: Date.now(),
      times: [Date.now()],
    };
    existing.push(route);
  }
  
  localStorage.setItem(ROUTINE_STORAGE_KEY, JSON.stringify(existing));
};

/**
 * Get routine routes
 */
export const getRoutineRoutes = (): RouteUsage[] => {
  const existing = JSON.parse(localStorage.getItem(ROUTINE_STORAGE_KEY) || '[]') as RouteUsage[];
  const now = Date.now();
  
  return existing
    .filter(route => {
      // Filter by time window and threshold
      const recentUses = route.times.filter(time => now - time < TIME_WINDOW);
      return recentUses.length >= ROUTINE_THRESHOLD;
    })
    .sort((a, b) => {
      // Sort by frequency and recency
      const aRecent = a.times.filter(time => now - time < TIME_WINDOW).length;
      const bRecent = b.times.filter(time => now - time < TIME_WINDOW).length;
      if (bRecent !== aRecent) return bRecent - aRecent;
      return b.lastUsed - a.lastUsed;
    });
};

/**
 * Check if route is routine
 */
export const isRoutineRoute = (from: string, to: string): boolean => {
  const routines = getRoutineRoutes();
  return routines.some(r => r.from === from && r.to === to);
};

/**
 * Get suggested routine trip (e.g., "Going to work?")
 */
export const getSuggestedRoutine = (currentTime: number = Date.now()): RouteUsage | null => {
  const routines = getRoutineRoutes();
  if (routines.length === 0) return null;
  
  const hour = new Date(currentTime).getHours();
  
  // Suggest work route in morning (7-10 AM)
  if (hour >= 7 && hour < 10) {
    const workRoute = routines.find(r => 
      r.to.toLowerCase().includes('work') || 
      r.to.toLowerCase().includes('دفتر') ||
      r.to.toLowerCase().includes('office')
    );
    if (workRoute) return workRoute;
  }
  
  // Suggest home route in evening (5-8 PM)
  if (hour >= 17 && hour < 20) {
    const homeRoute = routines.find(r => 
      r.to.toLowerCase().includes('home') || 
      r.to.toLowerCase().includes('گھر')
    );
    if (homeRoute) return homeRoute;
  }
  
  // Otherwise return most frequent
  return routines[0];
};

