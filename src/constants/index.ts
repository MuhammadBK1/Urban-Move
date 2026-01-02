/**
 * =====================================================
 * URBAN-MOVE CONSTANTS & TRANSLATIONS
 * =====================================================
 * 
 * Centralized constants for the web application.
 * Bilingual support (English + Urdu).
 * =====================================================
 */

/**
 * Bilingual translations
 */
export const TRANSLATIONS = {
  // App
  appName: { en: 'Urban Move', ur: 'اربن موو' },
  tagline: { en: 'Track Your Ride', ur: 'اپنی سواری ٹریک کریں' },
  
  // Navigation
  home: { en: 'Home', ur: 'ہوم' },
  routes: { en: 'Routes', ur: 'راستے' },
  settings: { en: 'Settings', ur: 'سیٹنگز' },
  
  // Map & Location
  yourLocation: { en: 'Your Location', ur: 'آپ کا مقام' },
  nearbyRoutes: { en: 'Nearby Routes', ur: 'قریبی راستے' },
  loadingMap: { en: 'Loading map...', ur: 'نقشہ لوڈ ہو رہا ہے...' },
  locationDenied: { en: 'Location access denied', ur: 'مقام کی اجازت نہیں دی گئی' },
  enableLocation: { en: 'Please enable location to use the app', ur: 'ایپ استعمال کرنے کے لیے مقام فعال کریں' },
  
  // Vehicles
  vehiclesNearby: { en: 'Vehicles Nearby', ur: 'قریب گاڑیاں' },
  noVehicles: { en: 'No vehicles on this route', ur: 'اس راستے پر کوئی گاڑی نہیں' },
  
  // ETA
  eta: { en: 'ETA', ur: 'متوقع وقت' },
  minutes: { en: 'min', ur: 'منٹ' },
  arriving: { en: 'Arriving', ur: 'آ رہا ہے' },
  arrivingSoon: { en: 'Arriving soon', ur: 'جلد آ رہا ہے' },
  
  // Confidence
  highConfidence: { en: 'Live GPS', ur: 'لائیو جی پی ایس' },
  mediumConfidence: { en: 'Recent check-in', ur: 'حالیہ چیک ان' },
  lowConfidence: { en: 'Estimated', ur: 'تخمینی' },
  
  // Check-in
  vehicleArrived: { en: 'Vehicle Just Arrived', ur: 'گاڑی ابھی آئی' },
  checkInSuccess: { en: 'Thanks for helping!', ur: 'مدد کا شکریہ!' },
  checkInCooldown: { en: 'Please wait before next check-in', ur: 'اگلے چیک ان سے پہلے انتظار کریں' },
  
  // Driver Mode
  driverMode: { en: 'Driver Mode', ur: 'ڈرائیور موڈ' },
  driverModeOn: { en: 'Broadcasting your location', ur: 'آپ کا مقام نشر ہو رہا ہے' },
  driverModeOff: { en: 'Tap to start sharing location', ur: 'مقام شیئر کرنے کے لیے ٹیپ کریں' },
  
  // Demo Mode
  demoMode: { en: 'Demo Mode', ur: 'ڈیمو موڈ' },
  demoModeOn: { en: 'Using simulated data', ur: 'مصنوعی ڈیٹا استعمال ہو رہا ہے' },
  demoModeOff: { en: 'Using live data', ur: 'لائیو ڈیٹا استعمال ہو رہا ہے' },
  
  // Route Details
  routeDetails: { en: 'Route Details', ur: 'راستے کی تفصیل' },
  from: { en: 'From', ur: 'سے' },
  to: { en: 'To', ur: 'تک' },
  fare: { en: 'Fare', ur: 'کرایہ' },
  pkr: { en: 'PKR', ur: 'روپے' },
  
  // General
  loading: { en: 'Loading...', ur: 'لوڈ ہو رہا ہے...' },
  error: { en: 'Error', ur: 'غلطی' },
  retry: { en: 'Retry', ur: 'دوبارہ کوشش' },
  cancel: { en: 'Cancel', ur: 'منسوخ' },
  confirm: { en: 'Confirm', ur: 'تصدیق' },
  back: { en: 'Back', ur: 'واپس' },
  language: { en: 'Language', ur: 'زبان' },
} as const;

/**
 * Configuration values
 */
export const CONFIG = {
  // GPS settings
  GPS_UPDATE_INTERVAL: 15000,      // 15 seconds
  GPS_DISTANCE_FILTER: 10,         // 10 meters
  LOCATION_TIMEOUT: 10000,         // 10 seconds
  
  // Data freshness
  STALE_GPS_THRESHOLD: 60000,      // 1 minute
  OLD_DATA_THRESHOLD: 300000,      // 5 minutes
  
  // Check-in
  CHECKIN_COOLDOWN: 60000,         // 1 minute
  
  // Map
  DEFAULT_ZOOM: 15,
  ROUTE_POLYLINE_WIDTH: 4,
  
  // ETA speeds (km/h)
  AVERAGE_METRO_SPEED: 40,
  AVERAGE_ORANGE_LINE_SPEED: 50,
  AVERAGE_BUS_SPEED: 35,
  
  // Demo mode
  DEMO_UPDATE_INTERVAL: 3000,      // 3 seconds
  
  // Firebase collections
  COLLECTION_ROUTES: 'routes',
  COLLECTION_VEHICLES: 'vehicles',
  COLLECTION_LIVE_LOCATIONS: 'liveLocations',
  COLLECTION_CHECKINS: 'checkins',
};

/**
 * Default map center (Lahore, Pakistan)
 */
export const DEFAULT_CENTER = {
  lat: 31.5204,
  lng: 74.3587,
};

/**
 * Vehicle type configuration
 */
export const VEHICLE_CONFIG = {
  metro: { icon: '🚌', color: '#E53935', label: 'Metro Bus' },
  'orange-line': { icon: '🚇', color: '#FF6F00', label: 'Orange Line' },
  bus: { icon: '🚌', color: '#2196F3', label: 'Bus' },
} as const;

/**
 * Confidence level colors
 */
export const CONFIDENCE_COLORS = {
  high: '#2E7D32',    // Green
  medium: '#F9A825',  // Yellow
  low: '#C62828',     // Red
} as const;

/**
 * Translation helper function
 */
export const t = (
  key: keyof typeof TRANSLATIONS,
  lang: 'en' | 'ur'
): string => {
  return TRANSLATIONS[key]?.[lang] ?? key;
};

