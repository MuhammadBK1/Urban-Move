/**
 * =====================================================
 * SPEEDO BUS ROUTES
 * =====================================================
 * 
 * Speedo bus service routes in Lahore
 * Simple structure for search functionality
 * =====================================================
 */

export const speedoRoutes = [
  { routeNo: 1, from: "Thokar", to: "Mall Road" }, // Canal Road (S1)
  { routeNo: 2, from: "Railway Station", to: "Bhatti Chowk" },
  { routeNo: 2, from: "Samanabad Mor", to: "Bhatti Chowk" },
  { routeNo: 3, from: "Railway Station", to: "Shahdara Lari Adda" },
  { routeNo: 4, from: "R.A. Bazar", to: "Chungi Amar Sidhu" },
  { routeNo: 5, from: "Shad Bagh Underpass", to: "Bhatti Chowk" },
  { routeNo: 6, from: "Babu Sabu", to: "Raj Garh Chowk" },
  { routeNo: 7, from: "Bagrian", to: "Chungi Amar Sidhu" },
  { routeNo: 8, from: "Doctor Hospital", to: "Canal" },
  { routeNo: 9, from: "Railway Station", to: "Sham Nagar" },
  { routeNo: 10, from: "Multan Chungi", to: "Qartaba Chowk" },
  { routeNo: 11, from: "Babu Sabu", to: "Main Market Gulberg" },
  { routeNo: 12, from: "R.A. Bazar", to: "Civil Secretariat" },
  { routeNo: 13, from: "Bagrian", to: "Kalma Chowk" },
  { routeNo: 14, from: "R.A. Bazar", to: "Chungi Amar Sidhu" },
  { routeNo: 15, from: "Qartaba Chowk", to: "Babu Sabu" },
  { routeNo: 16, from: "Railway Station", to: "Bhatti Chowk" },
  { routeNo: 17, from: "Canal", to: "Railway Station" },
  { routeNo: 18, from: "Bhatti Chowk", to: "Shimla Pahari" },
  { routeNo: 19, from: "Main Market", to: "Bhatti Chowk" },
  { routeNo: 20, from: "Jain Mandar", to: "Chowk Yateem Khana" },
  { routeNo: 21, from: "Depot Chowk", to: "Thokar Niaz Baig" },
  { routeNo: 22, from: "Depot Chowk", to: "Thokar Niaz Baig" },
  { routeNo: 23, from: "Valencia", to: "Thokar Niaz Baig" },
  { routeNo: 24, from: "Multan Chungi", to: "Ghazi Chowk" },
  { routeNo: 25, from: "R.A. Bazar", to: "Railway Station" },
  { routeNo: 26, from: "R.A. Bazar", to: "Daroghawala" },
  { routeNo: 27, from: "Bata Pur", to: "Daroghawala" },
  { routeNo: 28, from: "Quaid-e-Azam Interchange", to: "Airport" },
  { routeNo: 29, from: "Niazi Interchange", to: "Salamat Pura" },
  { routeNo: 30, from: "Daroghawala", to: "Airport" },
  { routeNo: 31, from: "Daroghawala", to: "Lari Adda" },
  { routeNo: 32, from: "Shimla Pahari", to: "Ek Moriya" },
  { routeNo: 33, from: "Cooper Store", to: "Mughalpura" },
  { routeNo: 34, from: "Singhpura", to: "Mughalpura" }
];

/**
 * Search Speedo routes by stop name
 * @param stopName - The stop name to search for (case-insensitive)
 * @returns Array of routes that include the stop in 'from' or 'to'
 */
export function searchByStop(stopName: string) {
  if (!stopName || stopName.trim() === '') {
    return [];
  }
  
  const searchTerm = stopName.toLowerCase().trim();
  
  return speedoRoutes.filter(route =>
    route.from.toLowerCase().includes(searchTerm) ||
    route.to.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get route by route number
 * @param routeNo - The route number (1-34)
 * @returns The route object or undefined if not found
 */
export function getRouteByNumber(routeNo: number) {
  return speedoRoutes.find(route => route.routeNo === routeNo);
}

/**
 * Get all routes from a specific stop
 * @param stopName - The stop name
 * @returns Array of routes starting from this stop
 */
export function getRoutesFrom(stopName: string) {
  const searchTerm = stopName.toLowerCase().trim();
  return speedoRoutes.filter(route =>
    route.from.toLowerCase().includes(searchTerm)
  );
}

/**
 * Get all routes to a specific stop
 * @param stopName - The stop name
 * @returns Array of routes ending at this stop
 */
export function getRoutesTo(stopName: string) {
  const searchTerm = stopName.toLowerCase().trim();
  return speedoRoutes.filter(route =>
    route.to.toLowerCase().includes(searchTerm)
  );
}

