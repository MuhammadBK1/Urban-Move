/**
 * =====================================================
 * METRO STOPS
 * =====================================================
 * 
 * List of Metro Bus and Orange Line Metro stops
 * Simplified list for search and quick reference
 * =====================================================
 */

export const metroStops = [
  "Bhatti Chowk",
  "GPO",
  "Kalma Chowk",
  "Muslim Town",
  "Shahdara",
  "Ali Town"
];

/**
 * Search metro stops by name
 * @param stopName - The stop name to search for (case-insensitive)
 * @returns Array of stops that match the search term
 */
export function searchMetroStops(stopName: string): string[] {
  if (!stopName || stopName.trim() === '') {
    return [];
  }
  
  const searchTerm = stopName.toLowerCase().trim();
  
  return metroStops.filter(stop =>
    stop.toLowerCase().includes(searchTerm)
  );
}

/**
 * Check if a stop exists in the metro stops list
 * @param stopName - The stop name to check
 * @returns true if the stop exists, false otherwise
 */
export function isMetroStop(stopName: string): boolean {
  if (!stopName) return false;
  
  return metroStops.some(stop =>
    stop.toLowerCase() === stopName.toLowerCase().trim()
  );
}

/**
 * Get all metro stops
 * @returns Array of all metro stop names
 */
export function getAllMetroStops(): string[] {
  return [...metroStops];
}

