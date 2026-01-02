/**
 * =====================================================
 * LAHORE TRANSIT DATABASE
 * =====================================================
 * 
 * Comprehensive transit data for Lahore including:
 * - Orange Line Metro stations
 * - Metro Bus (BRT) stations
 * - Regular bus routes and stops
 * - Coordinates for all stops
 * 
 * Used for route suggestions and transit planning
 * =====================================================
 */

export const transitData = {
  // =====================================================
  // ORANGE LINE METRO STATIONS
  // =====================================================
  orangeLine: {
    name: "Orange Line Metro",
    nameUrdu: "اورنج لائن میٹرو",
    color: "#FF6F00",
    icon: "🚇",
    stations: [
      { id: "ol-1", name: "Dera Gujran", nameUrdu: "ڈیرہ گجراں", lat: 31.6151, lng: 74.2542 },
      { id: "ol-2", name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.5924, lng: 74.2634 },
      { id: "ol-3", name: "Mahmood Booti", nameUrdu: "محمود بوٹی", lat: 31.5823, lng: 74.2712 },
      { id: "ol-4", name: "Salamatpura", nameUrdu: "سلامت پورہ", lat: 31.5745, lng: 74.2798 },
      { id: "ol-5", name: "Pakistan Mint", nameUrdu: "پاکستان منٹ", lat: 31.5658, lng: 74.2886 },
      { id: "ol-6", name: "Laxmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.5573, lng: 74.2978 },
      { id: "ol-7", name: "GPO Chowk", nameUrdu: "جی پی او چوک", lat: 31.5494, lng: 74.3064 },
      { id: "ol-8", name: "Lake Road", nameUrdu: "جھیل روڈ", lat: 31.5402, lng: 74.3158 },
      { id: "ol-9", name: "Anarkali", nameUrdu: "انارکلی", lat: 31.5324, lng: 74.3245 },
      { id: "ol-10", name: "Punjab Secretariat", nameUrdu: "پنجاب سیکرٹریٹ", lat: 31.5256, lng: 74.3312 },
      { id: "ol-11", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.5146, lng: 74.3507 },
      { id: "ol-12", name: "Naseerabad", nameUrdu: "نصیر آباد", lat: 31.5024, lng: 74.3624 },
      { id: "ol-13", name: "Ichra", nameUrdu: "اچھرا", lat: 31.4923, lng: 74.3534 },
      { id: "ol-14", name: "Canal View", nameUrdu: "کینال ویو", lat: 31.4845, lng: 74.3445 },
      { id: "ol-15", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 },
      { id: "ol-16", name: "Sabzazar", nameUrdu: "سبزہ زار", lat: 31.4689, lng: 74.3267 },
      { id: "ol-17", name: "Shalimar", nameUrdu: "شالیمار", lat: 31.4612, lng: 74.3178 },
      { id: "ol-18", name: "Samanabad", nameUrdu: "سمن آباد", lat: 31.4534, lng: 74.3089 },
      { id: "ol-19", name: "Chauburji", nameUrdu: "چوبرجی", lat: 31.5298, lng: 74.3456 },
      { id: "ol-20", name: "Ali Town Terminal", nameUrdu: "علی ٹاؤن ٹرمینل", lat: 31.4423, lng: 74.2867 }
    ]
  },

  // =====================================================
  // METRO BUS (BRT) STATIONS
  // =====================================================
  metroBus: {
    name: "Metro Bus (BRT)",
    nameUrdu: "میٹرو بس",
    color: "#E53935",
    icon: "🚌",
    stations: [
      { id: "mb-1", name: "Gajjumata", nameUrdu: "گجومتہ", lat: 31.4181, lng: 74.2164 },
      { id: "mb-2", name: "Ittefaq Hospital", nameUrdu: "اتفاق ہسپتال", lat: 31.4334, lng: 74.2343 },
      { id: "mb-3", name: "Chungi Amar Sadhu", nameUrdu: "چونگی امر سادھو", lat: 31.4452, lng: 74.2476 },
      { id: "mb-4", name: "Cantt Station", nameUrdu: "کینٹ اسٹیشن", lat: 31.4558, lng: 74.2564 },
      { id: "mb-5", name: "Ghazi Chowk", nameUrdu: "غازی چوک", lat: 31.4679, lng: 74.2698 },
      { id: "mb-6", name: "Model Town", nameUrdu: "ماڈل ٹاؤن", lat: 31.4835, lng: 74.3253 },
      { id: "mb-7", name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.5044, lng: 74.3388 },
      { id: "mb-8", name: "MAO College", nameUrdu: "ایم اے او کالج", lat: 31.5128, lng: 74.3447 },
      { id: "mb-9", name: "Qartaba Chowk", nameUrdu: "قرطبہ چوک", lat: 31.5207, lng: 74.3498 },
      { id: "mb-10", name: "Panorama Center", nameUrdu: "پینوراما سینٹر", lat: 31.5285, lng: 74.3542 },
      { id: "mb-11", name: "GPO", nameUrdu: "جی پی او", lat: 31.5494, lng: 74.3227 },
      { id: "mb-12", name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.5573, lng: 74.3194 },
      { id: "mb-13", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
      { id: "mb-14", name: "Niazi Chowk", nameUrdu: "نیازی چوک", lat: 31.5745, lng: 74.3086 },
      { id: "mb-15", name: "Azadi Chowk", nameUrdu: "آزادی چوک", lat: 31.5823, lng: 74.3024 },
      { id: "mb-16", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 },
      { id: "mb-17", name: "Baghbanpura", nameUrdu: "باغبانپورہ", lat: 31.5958, lng: 74.2912 },
      { id: "mb-18", name: "Shalimar Garden", nameUrdu: "شالیمار باغ", lat: 31.5997, lng: 74.2875 },
      { id: "mb-19", name: "Shahdara", nameUrdu: "شاہدرہ", lat: 31.6044, lng: 74.2787 }
    ]
  },

  // =====================================================
  // REGULAR BUS ROUTES
  // =====================================================
  busRoutes: [
    {
      id: "bus-1",
      name: "Route 1: Johar Town - Railway Station",
      nameUrdu: "روٹ 1: جوہر ٹاؤن - ریلوے اسٹیشن",
      number: "1",
      fare: 25,
      frequency: "10-15 mins",
      color: "#2196F3",
      stops: [
        { id: "b1-s1", name: "Johar Town", nameUrdu: "جوہر ٹاؤن", lat: 31.4689, lng: 74.3267 },
        { id: "b1-s2", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 },
        { id: "b1-s3", name: "Canal View", nameUrdu: "کینال ویو", lat: 31.4845, lng: 74.3445 },
        { id: "b1-s4", name: "Ichra", nameUrdu: "اچھرا", lat: 31.4923, lng: 74.3534 },
        { id: "b1-s5", name: "Naseerabad", nameUrdu: "نصیر آباد", lat: 31.5024, lng: 74.3624 },
        { id: "b1-s6", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.5146, lng: 74.3507 },
        { id: "b1-s7", name: "Punjab Secretariat", nameUrdu: "پنجاب سیکرٹریٹ", lat: 31.5256, lng: 74.3312 },
        { id: "b1-s8", name: "Anarkali", nameUrdu: "انارکلی", lat: 31.5324, lng: 74.3245 },
        { id: "b1-s9", name: "GPO", nameUrdu: "جی پی او", lat: 31.5494, lng: 74.3227 },
        { id: "b1-s10", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 }
      ]
    },
    {
      id: "bus-2",
      name: "Route 2: Model Town - Shahdara",
      nameUrdu: "روٹ 2: ماڈل ٹاؤن - شاہدرہ",
      number: "2",
      fare: 30,
      frequency: "12-18 mins",
      color: "#4CAF50",
      stops: [
        { id: "b2-s1", name: "Model Town", nameUrdu: "ماڈل ٹاؤن", lat: 31.4835, lng: 74.3253 },
        { id: "b2-s2", name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.5044, lng: 74.3388 },
        { id: "b2-s3", name: "MAO College", nameUrdu: "ایم اے او کالج", lat: 31.5128, lng: 74.3447 },
        { id: "b2-s4", name: "Qartaba Chowk", nameUrdu: "قرطبہ چوک", lat: 31.5207, lng: 74.3498 },
        { id: "b2-s5", name: "Panorama Center", nameUrdu: "پینوراما سینٹر", lat: 31.5285, lng: 74.3542 },
        { id: "b2-s6", name: "GPO", nameUrdu: "جی پی او", lat: 31.5494, lng: 74.3227 },
        { id: "b2-s7", name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.5573, lng: 74.3194 },
        { id: "b2-s8", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
        { id: "b2-s9", name: "Niazi Chowk", nameUrdu: "نیازی چوک", lat: 31.5745, lng: 74.3086 },
        { id: "b2-s10", name: "Azadi Chowk", nameUrdu: "آزادی چوک", lat: 31.5823, lng: 74.3024 },
        { id: "b2-s11", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 },
        { id: "b2-s12", name: "Baghbanpura", nameUrdu: "باغبانپورہ", lat: 31.5958, lng: 74.2912 },
        { id: "b2-s13", name: "Shalimar Garden", nameUrdu: "شالیمار باغ", lat: 31.5997, lng: 74.2875 },
        { id: "b2-s14", name: "Shahdara", nameUrdu: "شاہدرہ", lat: 31.6044, lng: 74.2787 }
      ]
    },
    {
      id: "bus-3",
      name: "Route 3: DHA Phase 5 - Allama Iqbal Town",
      nameUrdu: "روٹ 3: ڈی ایچ اے فیز 5 - علامہ اقبال ٹاؤن",
      number: "3",
      fare: 35,
      frequency: "15-20 mins",
      color: "#9C27B0",
      stops: [
        { id: "b3-s1", name: "DHA Phase 5", nameUrdu: "ڈی ایچ اے فیز 5", lat: 31.4423, lng: 74.2867 },
        { id: "b3-s2", name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.5924, lng: 74.2634 },
        { id: "b3-s3", name: "Sabzazar", nameUrdu: "سبزہ زار", lat: 31.4689, lng: 74.3267 },
        { id: "b3-s4", name: "Shalimar", nameUrdu: "شالیمار", lat: 31.4612, lng: 74.3178 },
        { id: "b3-s5", name: "Samanabad", nameUrdu: "سمن آباد", lat: 31.4534, lng: 74.3089 },
        { id: "b3-s6", name: "Cantt Station", nameUrdu: "کینٹ اسٹیشن", lat: 31.4558, lng: 74.2564 },
        { id: "b3-s7", name: "Ghazi Chowk", nameUrdu: "غازی چوک", lat: 31.4679, lng: 74.2698 },
        { id: "b3-s8", name: "Allama Iqbal Town", nameUrdu: "علامہ اقبال ٹاؤن", lat: 31.4756, lng: 74.2805 }
      ]
    },
    {
      id: "bus-4",
      name: "Route 4: Ferozepur Road - Airport",
      nameUrdu: "روٹ 4: فیروزپور روڈ - ہوائی اڈا",
      number: "4",
      fare: 40,
      frequency: "20-25 mins",
      color: "#FF9800",
      stops: [
        { id: "b4-s1", name: "Ferozepur Road", nameUrdu: "فیروزپور روڈ", lat: 31.4181, lng: 74.2164 },
        { id: "b4-s2", name: "Ittefaq Hospital", nameUrdu: "اتفاق ہسپتال", lat: 31.4334, lng: 74.2343 },
        { id: "b4-s3", name: "Chungi Amar Sadhu", nameUrdu: "چونگی امر سادھو", lat: 31.4452, lng: 74.2476 },
        { id: "b4-s4", name: "Cantt Station", nameUrdu: "کینٹ اسٹیشن", lat: 31.4558, lng: 74.2564 },
        { id: "b4-s5", name: "Model Town", nameUrdu: "ماڈل ٹاؤن", lat: 31.4835, lng: 74.3253 },
        { id: "b4-s6", name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.5044, lng: 74.3388 },
        { id: "b4-s7", name: "Airport", nameUrdu: "ہوائی اڈا", lat: 31.5207, lng: 74.3800 }
      ]
    },
    {
      id: "bus-5",
      name: "Route 5: Wapda Town - Data Darbar",
      nameUrdu: "روٹ 5: واپڈا ٹاؤن - دربار صاحب",
      number: "5",
      fare: 20,
      frequency: "8-12 mins",
      color: "#F44336",
      stops: [
        { id: "b5-s1", name: "Wapda Town", nameUrdu: "واپڈا ٹاؤن", lat: 31.4423, lng: 74.2867 },
        { id: "b5-s2", name: "Johar Town", nameUrdu: "جوہر ٹاؤن", lat: 31.4689, lng: 74.3267 },
        { id: "b5-s3", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 },
        { id: "b5-s4", name: "Canal View", nameUrdu: "کینال ویو", lat: 31.4845, lng: 74.3445 },
        { id: "b5-s5", name: "Ichra", nameUrdu: "اچھرا", lat: 31.4923, lng: 74.3534 },
        { id: "b5-s6", name: "Naseerabad", nameUrdu: "نصیر آباد", lat: 31.5024, lng: 74.3624 },
        { id: "b5-s7", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.5146, lng: 74.3507 },
        { id: "b5-s8", name: "Anarkali", nameUrdu: "انارکلی", lat: 31.5324, lng: 74.3245 },
        { id: "b5-s9", name: "Data Darbar", nameUrdu: "دربار صاحب", lat: 31.5456, lng: 74.3100 }
      ]
    },
    {
      id: "bus-6",
      name: "Route 6: Township - Liberty Market",
      nameUrdu: "روٹ 6: ٹاؤن شپ - لبرٹی مارکیٹ",
      number: "6",
      fare: 25,
      frequency: "10-15 mins",
      color: "#00BCD4",
      stops: [
        { id: "b6-s1", name: "Township", nameUrdu: "ٹاؤن شپ", lat: 31.4423, lng: 74.2867 },
        { id: "b6-s2", name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.5924, lng: 74.2634 },
        { id: "b6-s3", name: "Sabzazar", nameUrdu: "سبزہ زار", lat: 31.4689, lng: 74.3267 },
        { id: "b6-s4", name: "Shalimar", nameUrdu: "شالیمار", lat: 31.4612, lng: 74.3178 },
        { id: "b6-s5", name: "Samanabad", nameUrdu: "سمن آباد", lat: 31.4534, lng: 74.3089 },
        { id: "b6-s6", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.5146, lng: 74.3507 },
        { id: "b6-s7", name: "Liberty Market", nameUrdu: "لبرٹی مارکیٹ", lat: 31.5200, lng: 74.3400 }
      ]
    },
    {
      id: "bus-7",
      name: "Route 7: Bahria Town - Fortress Stadium",
      nameUrdu: "روٹ 7: بحریہ ٹاؤن - فورٹریس اسٹیڈیم",
      number: "7",
      fare: 45,
      frequency: "25-30 mins",
      color: "#795548",
      stops: [
        { id: "b7-s1", name: "Bahria Town", nameUrdu: "بحریہ ٹاؤن", lat: 31.4000, lng: 74.2000 },
        { id: "b7-s2", name: "Gajjumata", nameUrdu: "گجومتہ", lat: 31.4181, lng: 74.2164 },
        { id: "b7-s3", name: "Ittefaq Hospital", nameUrdu: "اتفاق ہسپتال", lat: 31.4334, lng: 74.2343 },
        { id: "b7-s4", name: "Model Town", nameUrdu: "ماڈل ٹاؤن", lat: 31.4835, lng: 74.3253 },
        { id: "b7-s5", name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.5044, lng: 74.3388 },
        { id: "b7-s6", name: "Fortress Stadium", nameUrdu: "فورٹریس اسٹیڈیم", lat: 31.5100, lng: 74.3600 }
      ]
    },
    {
      id: "bus-8",
      name: "Route 8: Shadman - Mozang",
      nameUrdu: "روٹ 8: شادمان - موزانگ",
      number: "8",
      fare: 20,
      frequency: "8-12 mins",
      color: "#607D8B",
      stops: [
        { id: "b8-s1", name: "Shadman", nameUrdu: "شادمان", lat: 31.5300, lng: 74.3200 },
        { id: "b8-s2", name: "Gulberg", nameUrdu: "گلبرگ", lat: 31.5146, lng: 74.3507 },
        { id: "b8-s3", name: "Punjab Secretariat", nameUrdu: "پنجاب سیکرٹریٹ", lat: 31.5256, lng: 74.3312 },
        { id: "b8-s4", name: "Anarkali", nameUrdu: "انارکلی", lat: 31.5324, lng: 74.3245 },
        { id: "b8-s5", name: "GPO", nameUrdu: "جی پی او", lat: 31.5494, lng: 74.3227 },
        { id: "b8-s6", name: "Lakshmi Chowk", nameUrdu: "لکشمی چوک", lat: 31.5573, lng: 74.3194 },
        { id: "b8-s7", name: "Mozang", nameUrdu: "موزانگ", lat: 31.5600, lng: 74.3150 }
      ]
    },
    {
      id: "bus-9",
      name: "Route 9: Multan Road - Thokar Niaz Baig",
      nameUrdu: "روٹ 9: ملتان روڈ - ٹھوکر نیاز بیگ",
      number: "9",
      fare: 30,
      frequency: "12-18 mins",
      color: "#E91E63",
      stops: [
        { id: "b9-s1", name: "Multan Road", nameUrdu: "ملتان روڈ", lat: 31.4000, lng: 74.2000 },
        { id: "b9-s2", name: "Gajjumata", nameUrdu: "گجومتہ", lat: 31.4181, lng: 74.2164 },
        { id: "b9-s3", name: "Ittefaq Hospital", nameUrdu: "اتفاق ہسپتال", lat: 31.4334, lng: 74.2343 },
        { id: "b9-s4", name: "Cantt Station", nameUrdu: "کینٹ اسٹیشن", lat: 31.4558, lng: 74.2564 },
        { id: "b9-s5", name: "Ghazi Chowk", nameUrdu: "غازی چوک", lat: 31.4679, lng: 74.2698 },
        { id: "b9-s6", name: "Johar Town", nameUrdu: "جوہر ٹاؤن", lat: 31.4689, lng: 74.3267 },
        { id: "b9-s7", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 }
      ]
    },
    {
      id: "bus-10",
      name: "Route 10: Ring Road - Faisal Town",
      nameUrdu: "روٹ 10: رنگ روڈ - فیصل ٹاؤن",
      number: "10",
      fare: 35,
      frequency: "15-20 mins",
      color: "#3F51B5",
      stops: [
        { id: "b10-s1", name: "Ring Road", nameUrdu: "رنگ روڈ", lat: 31.4000, lng: 74.2000 },
        { id: "b10-s2", name: "Bahria Town", nameUrdu: "بحریہ ٹاؤن", lat: 31.4000, lng: 74.2000 },
        { id: "b10-s3", name: "DHA Phase 5", nameUrdu: "ڈی ایچ اے فیز 5", lat: 31.4423, lng: 74.2867 },
        { id: "b10-s4", name: "Ali Town", nameUrdu: "علی ٹاؤن", lat: 31.5924, lng: 74.2634 },
        { id: "b10-s5", name: "Sabzazar", nameUrdu: "سبزہ زار", lat: 31.4689, lng: 74.3267 },
        { id: "b10-s6", name: "Faisal Town", nameUrdu: "فیصل ٹاؤن", lat: 31.4800, lng: 74.3000 }
      ]
    }
  ]
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Get all bus stops from all routes
 */
export const getAllBusStops = () => {
  const stops = [];
  transitData.busRoutes.forEach(route => {
    route.stops.forEach(stop => {
      stops.push({
        ...stop,
        routeId: route.id,
        routeName: route.name,
        routeNameUrdu: route.nameUrdu,
        routeNumber: route.number
      });
    });
  });
  return stops;
};

/**
 * Get all stations (metro + bus stops)
 */
export const getAllStations = () => {
  return [
    ...transitData.orangeLine.stations.map(s => ({ ...s, type: 'orangeLine' })),
    ...transitData.metroBus.stations.map(s => ({ ...s, type: 'metroBus' })),
    ...getAllBusStops().map(s => ({ ...s, type: 'bus' }))
  ];
};

/**
 * Get bus route by ID
 */
export const getBusRouteById = (routeId) => {
  return transitData.busRoutes.find(route => route.id === routeId);
};

/**
 * Get bus route by stop ID
 */
export const getBusRouteByStopId = (stopId) => {
  return transitData.busRoutes.find(route => 
    route.stops.some(stop => stop.id === stopId)
  );
};

/**
 * Find nearest station/stop to a location
 */
export const findNearestStop = (location, maxDistance = 5) => {
  const allStops = getAllStations();
  let nearest = null;
  let minDistance = Infinity;

  allStops.forEach(stop => {
    const distance = calculateDistance(
      location,
      { lat: stop.lat, lng: stop.lng }
    );
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      nearest = { ...stop, distance };
    }
  });

  return nearest;
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

export default transitData;

