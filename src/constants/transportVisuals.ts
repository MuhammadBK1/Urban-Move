/**
 * =====================================================
 * TRANSPORT VISUAL LANGUAGE
 * =====================================================
 * 
 * Standardized visual cues for transport types:
 * - Colors
 * - Icons
 * - Line styles
 * =====================================================
 */

export const TRANSPORT_COLORS = {
  bus: '#2196F3', // Blue
  metro: '#FF6F00', // Orange
  'orange-line': '#FF6F00', // Orange
  'metro-bus': '#E53935', // Red
  walking: '#757575', // Gray
  transfer: '#FFC107', // Amber/Yellow
};

export const TRANSPORT_ICONS = {
  bus: '🚌',
  metro: '🚇',
  'orange-line': '🚇',
  'metro-bus': '🚌',
  walking: '🚶',
  transfer: '🔄',
};

export const LINE_STYLES = {
  bus: {
    color: TRANSPORT_COLORS.bus,
    width: 4,
    opacity: 0.8,
    dashArray: [],
  },
  metro: {
    color: TRANSPORT_COLORS.metro,
    width: 5,
    opacity: 0.9,
    dashArray: [],
  },
  walking: {
    color: TRANSPORT_COLORS.walking,
    width: 3,
    opacity: 0.6,
    dashArray: [5, 5],
  },
  transfer: {
    color: TRANSPORT_COLORS.transfer,
    width: 6,
    opacity: 1,
    dashArray: [10, 5],
  },
};

export const STATUS_COLORS = {
  'on-time': '#4CAF50', // Green
  delayed: '#FFC107', // Yellow
  missed: '#F44336', // Red
  far: '#9E9E9E', // Gray
};

