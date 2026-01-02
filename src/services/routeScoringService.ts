/**
 * =====================================================
 * SMART ROUTE SCORING SERVICE
 * =====================================================
 * 
 * Calculates and ranks routes based on multiple factors:
 * - Travel time
 * - Transfers
 * - Walking distance
 * - Fare
 * - Reliability
 * =====================================================
 */

import { RouteSuggestion } from './routeFinderService';

export type RoutePreference = 'fastest' | 'least-walking' | 'cheapest' | 'least-transfers';

export interface ScoredRoute extends RouteSuggestion {
  score: number;
  ranking: number;
  reasons: string[];
}

interface ScoringWeights {
  time: number;
  transfers: number;
  walking: number;
  fare: number;
  reliability: number;
}

const RELIABILITY_SCORES = {
  'metro-only': 1.0,
  'bus-metro': 0.8,
  'bus-only': 0.7,
  'feeder-only': 0.6,
};

const PREFERENCE_WEIGHTS: Record<RoutePreference, ScoringWeights> = {
  'fastest': {
    time: 0.4,
    transfers: 0.2,
    walking: 0.15,
    fare: 0.1,
    reliability: 0.15,
  },
  'least-walking': {
    time: 0.2,
    transfers: 0.15,
    walking: 0.4,
    fare: 0.1,
    reliability: 0.15,
  },
  'cheapest': {
    time: 0.2,
    transfers: 0.15,
    walking: 0.15,
    fare: 0.4,
    reliability: 0.1,
  },
  'least-transfers': {
    time: 0.25,
    transfers: 0.4,
    walking: 0.15,
    fare: 0.1,
    reliability: 0.1,
  },
};

/**
 * Normalize a value to 0-1 range
 */
const normalize = (value: number, min: number, max: number): number => {
  if (max === min) return 0.5;
  return Math.max(0, Math.min(1, (value - min) / (max - min)));
};

/**
 * Calculate route score based on preference
 */
export const scoreRoute = (
  route: RouteSuggestion,
  preference: RoutePreference,
  allRoutes: RouteSuggestion[]
): ScoredRoute => {
  const weights = PREFERENCE_WEIGHTS[preference];

  // Find min/max values across all routes for normalization
  const times = allRoutes.map(r => r.estimatedTime);
  const transfers = allRoutes.map(r => r.steps.filter(s => s.type !== 'walk').length - 1);
  const walkingDistances = allRoutes.map(r => 
    r.steps.filter(s => s.type === 'walk').reduce((sum, s) => sum + s.distance, 0)
  );
  const fares = allRoutes.map(r => r.totalFare);

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const minTransfers = Math.min(...transfers);
  const maxTransfers = Math.max(...transfers);
  const minWalking = Math.min(...walkingDistances);
  const maxWalking = Math.max(...walkingDistances);
  const minFare = Math.min(...fares);
  const maxFare = Math.max(...fares);

  // Calculate normalized scores (lower is better, so invert)
  const timeScore = 1 - normalize(route.estimatedTime, minTime, maxTime);
  const transferCount = route.steps.filter(s => s.type !== 'walk').length - 1;
  const transferScore = 1 - normalize(transferCount, minTransfers, maxTransfers);
  const walkingDistance = route.steps.filter(s => s.type === 'walk').reduce((sum, s) => sum + s.distance, 0);
  const walkingScore = 1 - normalize(walkingDistance, minWalking, maxWalking);
  const fareScore = 1 - normalize(route.totalFare, minFare, maxFare);
  const reliabilityScore = RELIABILITY_SCORES[route.type] || 0.5;

  // Calculate weighted score
  const score = 
    timeScore * weights.time +
    transferScore * weights.transfers +
    walkingScore * weights.walking +
    fareScore * weights.fare +
    reliabilityScore * weights.reliability;

  // Generate reasons
  const reasons: string[] = [];
  if (route.estimatedTime === minTime) {
    reasons.push('Fastest option');
  }
  if (transferCount === minTransfers) {
    reasons.push('Fewest transfers');
  }
  if (walkingDistance === minWalking) {
    reasons.push('Least walking');
  }
  if (route.totalFare === minFare) {
    reasons.push('Cheapest option');
  }
  if (reliabilityScore >= 0.9) {
    reasons.push('Most reliable');
  }

  return {
    ...route,
    score,
    ranking: 0, // Will be set after sorting
    reasons,
  };
};

/**
 * Score and rank all routes
 */
export const scoreAndRankRoutes = (
  routes: RouteSuggestion[],
  preference: RoutePreference = 'fastest'
): ScoredRoute[] => {
  if (routes.length === 0) return [];

  // Score all routes
  const scoredRoutes = routes.map(route => scoreRoute(route, preference, routes));

  // Sort by score (descending)
  scoredRoutes.sort((a, b) => b.score - a.score);

  // Assign rankings
  scoredRoutes.forEach((route, index) => {
    route.ranking = index + 1;
  });

  return scoredRoutes;
};

/**
 * Get best route
 */
export const getBestRoute = (
  routes: RouteSuggestion[],
  preference: RoutePreference = 'fastest'
): ScoredRoute | null => {
  const scored = scoreAndRankRoutes(routes, preference);
  return scored.length > 0 ? scored[0] : null;
};

