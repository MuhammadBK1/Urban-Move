/**
 * =====================================================
 * ROUTE RANKING SERVICE
 * =====================================================
 * 
 * Clean, reusable route ranking logic for Urban Move.
 * 
 * Features:
 * - Configurable scoring weights (easily tunable)
 * - Routes sorted by lowest score (best route first)
 * - Exposes reasons why a route is best
 * - Type-safe and maintainable
 * 
 * Scoring Formula:
 * score = (etaMinutes * weightTime) + 
 *         (transfers * multiplierTransfers * weightTransfers) + 
 *         (walkKm * multiplierWalking * weightWalking) + 
 *         (cost * weightCost)
 * 
 * Lower score = Better route
 * =====================================================
 */

import { RouteSuggestion } from './routeFinderService';

// =====================================================
// TYPES
// =====================================================

export type RoutePreference = 'fastest' | 'least-walking' | 'cheapest' | 'least-transfers';

export interface ScoredRoute extends RouteSuggestion {
  score: number;
  ranking: number;
  reasons: string[];
  metrics: RouteMetrics;
}

export interface RouteMetrics {
  etaMinutes: number;
  transfers: number;
  walkKm: number;
  cost: number;
}

/**
 * Scoring configuration - easily tunable weights
 */
export interface ScoringConfig {
  /** Weight for ETA (travel time in minutes) */
  weightTime: number;
  /** Weight for number of transfers */
  weightTransfers: number;
  /** Weight for walking distance (in km) */
  weightWalking: number;
  /** Weight for cost (in PKR) */
  weightCost: number;
  /** Multiplier for transfers penalty (higher = more penalty per transfer) */
  multiplierTransfers: number;
  /** Multiplier for walking penalty (higher = more penalty per km walked) */
  multiplierWalking: number;
}

// =====================================================
// DEFAULT CONFIGURATION
// =====================================================

/**
 * Default scoring weights - can be easily tuned
 * 
 * Current formula: 
 * score = (etaMinutes * 0.4) + (transfers * 10 * 0.3) + (walkKm * 5 * 0.15) + (cost * 0.15)
 */
export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weightTime: 0.4,
  weightTransfers: 0.3,
  weightWalking: 0.15,
  weightCost: 0.15,
  multiplierTransfers: 10,
  multiplierWalking: 5,
};

// =====================================================
// ROUTE METRICS EXTRACTION
// =====================================================

/**
 * Extract metrics from a route
 */
export const extractRouteMetrics = (route: RouteSuggestion): RouteMetrics => {
  const etaMinutes = route.estimatedTime; // Already in minutes
  const transfers = Math.max(0, route.steps.filter(s => s.type !== 'walk').length - 1);
  const walkKm = route.steps
    .filter(s => s.type === 'walk')
    .reduce((sum, s) => sum + s.distance, 0); // Already in km
  const cost = route.totalFare; // Already in PKR

  return {
    etaMinutes,
    transfers,
    walkKm,
    cost,
  };
};

/**
 * Calculate route score using configurable weights
 * Lower score = Better route
 */
export const calculateRouteScore = (
  metrics: RouteMetrics,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): number => {
  const { etaMinutes, transfers, walkKm, cost } = metrics;
  const {
    weightTime,
    weightTransfers,
    weightWalking,
    weightCost,
    multiplierTransfers,
    multiplierWalking,
  } = config;

  return (
    etaMinutes * weightTime +
    transfers * multiplierTransfers * weightTransfers +
    walkKm * multiplierWalking * weightWalking +
    cost * weightCost
  );
};

// =====================================================
// REASON GENERATION
// =====================================================

/**
 * Generate reasons why a route is best compared to others
 */
export const generateRouteReasons = (
  _route: RouteSuggestion,
  metrics: RouteMetrics,
  allRoutes: RouteSuggestion[]
): string[] => {
  if (allRoutes.length === 0) return [];

  const reasons: string[] = [];

  // Calculate min values across all routes
  const allMetrics = allRoutes.map(extractRouteMetrics);
  const minEta = Math.min(...allMetrics.map(m => m.etaMinutes));
  const minTransfers = Math.min(...allMetrics.map(m => m.transfers));
  const minWalkKm = Math.min(...allMetrics.map(m => m.walkKm));
  const minCost = Math.min(...allMetrics.map(m => m.cost));

  // Check if this route is best in any category
  if (metrics.etaMinutes === minEta) {
    reasons.push('Fastest option');
  }
  if (metrics.transfers === minTransfers) {
    reasons.push('Fewest transfers');
  }
  if (metrics.walkKm === minWalkKm) {
    reasons.push('Least walking');
  }
  if (metrics.cost === minCost) {
    reasons.push('Cheapest option');
  }

  // If no specific reason, add general "Best overall" if it's the top route
  if (reasons.length === 0) {
    reasons.push('Best overall score');
  }

  return reasons;
};

// =====================================================
// ROUTE SCORING
// =====================================================

/**
 * Score a single route
 */
export const scoreRoute = (
  route: RouteSuggestion,
  allRoutes: RouteSuggestion[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoredRoute => {
  const metrics = extractRouteMetrics(route);
  const score = calculateRouteScore(metrics, config);
  const reasons = generateRouteReasons(route, metrics, allRoutes);

  return {
    ...route,
    score,
    ranking: 0, // Will be set after sorting
    reasons,
    metrics,
  };
};

// =====================================================
// ROUTE RANKING
// =====================================================

/**
 * Score and rank all routes
 * 
 * @param routes - Array of routes to score and rank
 * @param config - Optional scoring configuration (uses default if not provided)
 * @returns Array of scored and ranked routes, sorted by lowest score (best first)
 */
export const scoreAndRankRoutes = (
  routes: RouteSuggestion[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoredRoute[] => {
  if (routes.length === 0) return [];

  // Score all routes
  const scoredRoutes = routes.map(route => scoreRoute(route, routes, config));

  // Sort by score (ascending - lower score is better)
  // Best route will always be at index 0
  scoredRoutes.sort((a, b) => {
    // Primary: score (lower is better)
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    // Secondary: ETA (faster is better)
    if (a.metrics.etaMinutes !== b.metrics.etaMinutes) {
      return a.metrics.etaMinutes - b.metrics.etaMinutes;
    }
    // Tertiary: transfers (fewer is better)
    if (a.metrics.transfers !== b.metrics.transfers) {
      return a.metrics.transfers - b.metrics.transfers;
    }
    // Quaternary: walking distance (less is better)
    return a.metrics.walkKm - b.metrics.walkKm;
  });

  // Assign rankings (1-based, best route = 1)
  scoredRoutes.forEach((route, index) => {
    route.ranking = index + 1;
  });

  // Ensure best route has proper reasons
  if (scoredRoutes.length > 0) {
    const bestRoute = scoredRoutes[0];
    if (bestRoute.reasons.length === 0) {
      bestRoute.reasons.push('Best overall route');
    }
  }

  return scoredRoutes;
};

/**
 * Get the best route from a list
 * 
 * @param routes - Array of routes to evaluate
 * @param config - Optional scoring configuration
 * @returns The best route (lowest score) or null if no routes
 */
export const getBestRoute = (
  routes: RouteSuggestion[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoredRoute | null => {
  const ranked = scoreAndRankRoutes(routes, config);
  return ranked.length > 0 ? ranked[0] : null;
};

/**
 * Get top N routes
 * 
 * @param routes - Array of routes to evaluate
 * @param topN - Number of top routes to return
 * @param config - Optional scoring configuration
 * @returns Top N routes sorted by score
 */
export const getTopRoutes = (
  routes: RouteSuggestion[],
  topN: number = 3,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG
): ScoredRoute[] => {
  const ranked = scoreAndRankRoutes(routes, config);
  return ranked.slice(0, topN);
};

