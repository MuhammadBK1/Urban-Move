/**
 * =====================================================
 * LAHORE TRANSIT DATABASE
 * =====================================================
 * 
 * Comprehensive transit data for Lahore including:
 * - Orange Line Metro stations
 * - Metro Bus (BRT) stations
 * - Regular bus routes and stops
 * - Speedo bus routes
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
  // SPEEDO BUS ROUTES
  // =====================================================
  speedoRoutes: [
    {
      id: "speedo-1",
      name: "Speedo Route 1: Railway Station - Bhatti Chowk",
      nameUrdu: "اسپیڈو روٹ 1: ریلوے اسٹیشن - بھٹی چوک",
      number: "S1",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s1-s1", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
        { id: "s1-s2", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 }
      ]
    },
    {
      id: "speedo-2",
      name: "Speedo Route 2: Samanabad Mor - Bhatti Chowk",
      nameUrdu: "اسپیڈو روٹ 2: سمن آباد مور - بھٹی چوک",
      number: "S2",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s2-s1", name: "Samanabad Mor", nameUrdu: "سمن آباد مور", lat: 31.4534, lng: 74.3089 },
        { id: "s2-s2", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 }
      ]
    },
    {
      id: "speedo-3",
      name: "Speedo Route 3: Railway Station - Shahdara Lari Adda",
      nameUrdu: "اسپیڈو روٹ 3: ریلوے اسٹیشن - شاہدرہ لاری اڈا",
      number: "S3",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s3-s1", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
        { id: "s3-s2", name: "Shahdara Lari Adda", nameUrdu: "شاہدرہ لاری اڈا", lat: 31.6044, lng: 74.2787 }
      ]
    },
    {
      id: "speedo-4",
      name: "Speedo Route 4: R.A. Bazar - Chungi Amar Sidhu",
      nameUrdu: "اسپیڈو روٹ 4: آر اے بازار - چونگی امر سدھو",
      number: "S4",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s4-s1", name: "R.A. Bazar", nameUrdu: "آر اے بازار", lat: 31.5500, lng: 74.3000 },
        { id: "s4-s2", name: "Chungi Amar Sidhu", nameUrdu: "چونگی امر سدھو", lat: 31.4452, lng: 74.2476 }
      ]
    },
    {
      id: "speedo-5",
      name: "Speedo Route 5: Shad Bagh Underpass - Bhatti Chowk",
      nameUrdu: "اسپیڈو روٹ 5: شاد باغ انڈرپاس - بھٹی چوک",
      number: "S5",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s5-s1", name: "Shad Bagh Underpass", nameUrdu: "شاد باغ انڈرپاس", lat: 31.5000, lng: 74.3100 },
        { id: "s5-s2", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 }
      ]
    },
    {
      id: "speedo-6",
      name: "Speedo Route 6: Babu Sabu - Raj Garh Chowk",
      nameUrdu: "اسپیڈو روٹ 6: بابو صابو - راج گڑھ چوک",
      number: "S6",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s6-s1", name: "Babu Sabu", nameUrdu: "بابو صابو", lat: 31.5200, lng: 74.3300 },
        { id: "s6-s2", name: "Raj Garh Chowk", nameUrdu: "راج گڑھ چوک", lat: 31.5400, lng: 74.3200 }
      ]
    },
    {
      id: "speedo-7",
      name: "Speedo Route 7: Bagrian - Chungi Amar Sidhu",
      nameUrdu: "اسپیڈو روٹ 7: بگریاں - چونگی امر سدھو",
      number: "S7",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s7-s1", name: "Bagrian", nameUrdu: "بگریاں", lat: 31.4200, lng: 74.2200 },
        { id: "s7-s2", name: "Chungi Amar Sidhu", nameUrdu: "چونگی امر سدھو", lat: 31.4452, lng: 74.2476 }
      ]
    },
    {
      id: "speedo-8",
      name: "Speedo Route 8: Doctor Hospital - Canal",
      nameUrdu: "اسپیڈو روٹ 8: ڈاکٹر ہسپتال - کینال",
      number: "S8",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s8-s1", name: "Doctor Hospital", nameUrdu: "ڈاکٹر ہسپتال", lat: 31.5300, lng: 74.3400 },
        { id: "s8-s2", name: "Canal", nameUrdu: "کینال", lat: 31.4845, lng: 74.3445 }
      ]
    },
    {
      id: "speedo-9",
      name: "Speedo Route 9: Railway Station - Sham Nagar",
      nameUrdu: "اسپیڈو روٹ 9: ریلوے اسٹیشن - شام نگر",
      number: "S9",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s9-s1", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
        { id: "s9-s2", name: "Sham Nagar", nameUrdu: "شام نگر", lat: 31.5800, lng: 74.2900 }
      ]
    },
    {
      id: "speedo-10",
      name: "Speedo Route 10: Multan Chungi - Qartaba Chowk",
      nameUrdu: "اسپیڈو روٹ 10: ملتان چونگی - قرطبہ چوک",
      number: "S10",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s10-s1", name: "Multan Chungi", nameUrdu: "ملتان چونگی", lat: 31.4500, lng: 74.2000 },
        { id: "s10-s2", name: "Qartaba Chowk", nameUrdu: "قرطبہ چوک", lat: 31.5207, lng: 74.3498 }
      ]
    },
    {
      id: "speedo-11",
      name: "Speedo Route 11: Babu Sabu - Main Market Gulberg",
      nameUrdu: "اسپیڈو روٹ 11: بابو صابو - مین مارکیٹ گلبرگ",
      number: "S11",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s11-s1", name: "Babu Sabu", nameUrdu: "بابو صابو", lat: 31.5200, lng: 74.3300 },
        { id: "s11-s2", name: "Main Market Gulberg", nameUrdu: "مین مارکیٹ گلبرگ", lat: 31.5146, lng: 74.3507 }
      ]
    },
    {
      id: "speedo-12",
      name: "Speedo Route 12: R.A. Bazar - Civil Secretariat",
      nameUrdu: "اسپیڈو روٹ 12: آر اے بازار - سول سیکرٹریٹ",
      number: "S12",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s12-s1", name: "R.A. Bazar", nameUrdu: "آر اے بازار", lat: 31.5500, lng: 74.3000 },
        { id: "s12-s2", name: "Civil Secretariat", nameUrdu: "سول سیکرٹریٹ", lat: 31.5256, lng: 74.3312 }
      ]
    },
    {
      id: "speedo-13",
      name: "Speedo Route 13: Bagrian - Kalma Chowk",
      nameUrdu: "اسپیڈو روٹ 13: بگریاں - کلمہ چوک",
      number: "S13",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s13-s1", name: "Bagrian", nameUrdu: "بگریاں", lat: 31.4200, lng: 74.2200 },
        { id: "s13-s2", name: "Kalma Chowk", nameUrdu: "کلمہ چوک", lat: 31.5044, lng: 74.3388 }
      ]
    },
    {
      id: "speedo-14",
      name: "Speedo Route 14: R.A. Bazar - Chungi Amar Sidhu",
      nameUrdu: "اسپیڈو روٹ 14: آر اے بازار - چونگی امر سدھو",
      number: "S14",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s14-s1", name: "R.A. Bazar", nameUrdu: "آر اے بازار", lat: 31.5500, lng: 74.3000 },
        { id: "s14-s2", name: "Chungi Amar Sidhu", nameUrdu: "چونگی امر سدھو", lat: 31.4452, lng: 74.2476 }
      ]
    },
    {
      id: "speedo-15",
      name: "Speedo Route 15: Qartaba Chowk - Babu Sabu",
      nameUrdu: "اسپیڈو روٹ 15: قرطبہ چوک - بابو صابو",
      number: "S15",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s15-s1", name: "Qartaba Chowk", nameUrdu: "قرطبہ چوک", lat: 31.5207, lng: 74.3498 },
        { id: "s15-s2", name: "Babu Sabu", nameUrdu: "بابو صابو", lat: 31.5200, lng: 74.3300 }
      ]
    },
    {
      id: "speedo-16",
      name: "Speedo Route 16: Railway Station - Bhatti Chowk",
      nameUrdu: "اسپیڈو روٹ 16: ریلوے اسٹیشن - بھٹی چوک",
      number: "S16",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s16-s1", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 },
        { id: "s16-s2", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 }
      ]
    },
    {
      id: "speedo-17",
      name: "Speedo Route 17: Canal - Railway Station",
      nameUrdu: "اسپیڈو روٹ 17: کینال - ریلوے اسٹیشن",
      number: "S17",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s17-s1", name: "Canal", nameUrdu: "کینال", lat: 31.4845, lng: 74.3445 },
        { id: "s17-s2", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 }
      ]
    },
    {
      id: "speedo-18",
      name: "Speedo Route 18: Bhatti Chowk - Shimla Pahari",
      nameUrdu: "اسپیڈو روٹ 18: بھٹی چوک - شملہ پہاڑی",
      number: "S18",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s18-s1", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 },
        { id: "s18-s2", name: "Shimla Pahari", nameUrdu: "شملہ پہاڑی", lat: 31.6000, lng: 74.2800 }
      ]
    },
    {
      id: "speedo-19",
      name: "Speedo Route 19: Main Market - Bhatti Chowk",
      nameUrdu: "اسپیڈو روٹ 19: مین مارکیٹ - بھٹی چوک",
      number: "S19",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s19-s1", name: "Main Market", nameUrdu: "مین مارکیٹ", lat: 31.5494, lng: 74.3227 },
        { id: "s19-s2", name: "Bhatti Chowk", nameUrdu: "بھٹی چوک", lat: 31.5892, lng: 74.2967 }
      ]
    },
    {
      id: "speedo-20",
      name: "Speedo Route 20: Jain Mandar - Chowk Yateem Khana",
      nameUrdu: "اسپیڈو روٹ 20: جین مندر - چوک یتیم خانہ",
      number: "S20",
      fare: 25,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s20-s1", name: "Jain Mandar", nameUrdu: "جین مندر", lat: 31.5600, lng: 74.3200 },
        { id: "s20-s2", name: "Chowk Yateem Khana", nameUrdu: "چوک یتیم خانہ", lat: 31.5700, lng: 74.3100 }
      ]
    },
    {
      id: "speedo-21",
      name: "Speedo Route 21: Depot Chowk - Thokar Niaz Baig",
      nameUrdu: "اسپیڈو روٹ 21: ڈپو چوک - ٹھوکر نیاز بیگ",
      number: "S21",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s21-s1", name: "Depot Chowk", nameUrdu: "ڈپو چوک", lat: 31.5100, lng: 74.3600 },
        { id: "s21-s2", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 }
      ]
    },
    {
      id: "speedo-22",
      name: "Speedo Route 22: Depot Chowk - Thokar Niaz Baig",
      nameUrdu: "اسپیڈو روٹ 22: ڈپو چوک - ٹھوکر نیاز بیگ",
      number: "S22",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s22-s1", name: "Depot Chowk", nameUrdu: "ڈپو چوک", lat: 31.5100, lng: 74.3600 },
        { id: "s22-s2", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 }
      ]
    },
    {
      id: "speedo-23",
      name: "Speedo Route 23: Valencia - Thokar Niaz Baig",
      nameUrdu: "اسپیڈو روٹ 23: ویلنسیا - ٹھوکر نیاز بیگ",
      number: "S23",
      fare: 40,
      frequency: "15-20 mins",
      color: "#9C27B0",
      stops: [
        { id: "s23-s1", name: "Valencia", nameUrdu: "ویلنسیا", lat: 31.4400, lng: 74.2800 },
        { id: "s23-s2", name: "Thokar Niaz Baig", nameUrdu: "ٹھوکر نیاز بیگ", lat: 31.4765, lng: 74.3356 }
      ]
    },
    {
      id: "speedo-24",
      name: "Speedo Route 24: Multan Chungi - Ghazi Chowk",
      nameUrdu: "اسپیڈو روٹ 24: ملتان چونگی - غازی چوک",
      number: "S24",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s24-s1", name: "Multan Chungi", nameUrdu: "ملتان چونگی", lat: 31.4500, lng: 74.2000 },
        { id: "s24-s2", name: "Ghazi Chowk", nameUrdu: "غازی چوک", lat: 31.4679, lng: 74.2698 }
      ]
    },
    {
      id: "speedo-25",
      name: "Speedo Route 25: R.A. Bazar - Railway Station",
      nameUrdu: "اسپیڈو روٹ 25: آر اے بازار - ریلوے اسٹیشن",
      number: "S25",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s25-s1", name: "R.A. Bazar", nameUrdu: "آر اے بازار", lat: 31.5500, lng: 74.3000 },
        { id: "s25-s2", name: "Railway Station", nameUrdu: "ریلوے اسٹیشن", lat: 31.5668, lng: 74.3127 }
      ]
    },
    {
      id: "speedo-26",
      name: "Speedo Route 26: R.A. Bazar - Daroghawala",
      nameUrdu: "اسپیڈو روٹ 26: آر اے بازار - ڈیروغا والا",
      number: "S26",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s26-s1", name: "R.A. Bazar", nameUrdu: "آر اے بازار", lat: 31.5500, lng: 74.3000 },
        { id: "s26-s2", name: "Daroghawala", nameUrdu: "ڈیروغا والا", lat: 31.6000, lng: 74.2500 }
      ]
    },
    {
      id: "speedo-27",
      name: "Speedo Route 27: Bata Pur - Daroghawala",
      nameUrdu: "اسپیڈو روٹ 27: بٹا پور - ڈیروغا والا",
      number: "S27",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s27-s1", name: "Bata Pur", nameUrdu: "بٹا پور", lat: 31.5800, lng: 74.2700 },
        { id: "s27-s2", name: "Daroghawala", nameUrdu: "ڈیروغا والا", lat: 31.6000, lng: 74.2500 }
      ]
    },
    {
      id: "speedo-28",
      name: "Speedo Route 28: Quaid-e-Azam Interchange - Airport",
      nameUrdu: "اسپیڈو روٹ 28: قائد اعظم انٹرچینج - ائیرپورٹ",
      number: "S28",
      fare: 50,
      frequency: "20-25 mins",
      color: "#9C27B0",
      stops: [
        { id: "s28-s1", name: "Quaid-e-Azam Interchange", nameUrdu: "قائد اعظم انٹرچینج", lat: 31.5000, lng: 74.3500 },
        { id: "s28-s2", name: "Airport", nameUrdu: "ائیرپورٹ", lat: 31.5200, lng: 74.4000 }
      ]
    },
    {
      id: "speedo-29",
      name: "Speedo Route 29: Niazi Interchange - Salamat Pura",
      nameUrdu: "اسپیڈو روٹ 29: نیازی انٹرچینج - سلامت پورہ",
      number: "S29",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s29-s1", name: "Niazi Interchange", nameUrdu: "نیازی انٹرچینج", lat: 31.5745, lng: 74.3086 },
        { id: "s29-s2", name: "Salamat Pura", nameUrdu: "سلامت پورہ", lat: 31.5745, lng: 74.2798 }
      ]
    },
    {
      id: "speedo-30",
      name: "Speedo Route 30: Daroghawala - Airport",
      nameUrdu: "اسپیڈو روٹ 30: ڈیروغا والا - ائیرپورٹ",
      number: "S30",
      fare: 50,
      frequency: "20-25 mins",
      color: "#9C27B0",
      stops: [
        { id: "s30-s1", name: "Daroghawala", nameUrdu: "ڈیروغا والا", lat: 31.6000, lng: 74.2500 },
        { id: "s30-s2", name: "Airport", nameUrdu: "ائیرپورٹ", lat: 31.5200, lng: 74.4000 }
      ]
    },
    {
      id: "speedo-31",
      name: "Speedo Route 31: Daroghawala - Lari Adda",
      nameUrdu: "اسپیڈو روٹ 31: ڈیروغا والا - لاری اڈا",
      number: "S31",
      fare: 35,
      frequency: "12-18 mins",
      color: "#9C27B0",
      stops: [
        { id: "s31-s1", name: "Daroghawala", nameUrdu: "ڈیروغا والا", lat: 31.6000, lng: 74.2500 },
        { id: "s31-s2", name: "Lari Adda", nameUrdu: "لاری اڈا", lat: 31.6044, lng: 74.2787 }
      ]
    },
    {
      id: "speedo-32",
      name: "Speedo Route 32: Shimla Pahari - Ek Moriya",
      nameUrdu: "اسپیڈو روٹ 32: شملہ پہاڑی - ایک موریا",
      number: "S32",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s32-s1", name: "Shimla Pahari", nameUrdu: "شملہ پہاڑی", lat: 31.6000, lng: 74.2800 },
        { id: "s32-s2", name: "Ek Moriya", nameUrdu: "ایک موریا", lat: 31.6100, lng: 74.2700 }
      ]
    },
    {
      id: "speedo-33",
      name: "Speedo Route 33: Cooper Store - Mughalpura",
      nameUrdu: "اسپیڈو روٹ 33: کوپر سٹور - مغلپورہ",
      number: "S33",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s33-s1", name: "Cooper Store", nameUrdu: "کوپر سٹور", lat: 31.5500, lng: 74.3100 },
        { id: "s33-s2", name: "Mughalpura", nameUrdu: "مغلپورہ", lat: 31.5600, lng: 74.3000 }
      ]
    },
    {
      id: "speedo-34",
      name: "Speedo Route 34: Singhpura - Mughalpura",
      nameUrdu: "اسپیڈو روٹ 34: سنگھ پورہ - مغلپورہ",
      number: "S34",
      fare: 30,
      frequency: "10-15 mins",
      color: "#9C27B0",
      stops: [
        { id: "s34-s1", name: "Singhpura", nameUrdu: "سنگھ پورہ", lat: 31.5700, lng: 74.2900 },
        { id: "s34-s2", name: "Mughalpura", nameUrdu: "مغلپورہ", lat: 31.5600, lng: 74.3000 }
      ]
    }
  ],

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
 * Get all bus stops from all routes (including Speedo routes)
 */
export const getAllBusStops = (): BusStop[] => {
  const stops: BusStop[] = [];
  // Regular bus routes
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
  // Speedo routes
  transitData.speedoRoutes.forEach(route => {
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
export const getAllStations = (): Array<Station & { type: string }> => {
  return [
    ...transitData.orangeLine.stations.map(s => ({ ...s, type: 'orangeLine' })),
    ...transitData.metroBus.stations.map(s => ({ ...s, type: 'metroBus' })),
    ...getAllBusStops().map(s => ({ ...s, type: 'bus' }))
  ];
};

/**
 * Get bus route by ID (checks both regular and Speedo routes)
 */
export const getBusRouteById = (routeId: string): BusRoute | undefined => {
  return transitData.busRoutes.find(route => route.id === routeId) ||
         transitData.speedoRoutes.find(route => route.id === routeId);
};

/**
 * Get bus route by stop ID (checks both regular and Speedo routes)
 */
export const getBusRouteByStopId = (stopId: string): BusRoute | undefined => {
  return transitData.busRoutes.find(route => 
    route.stops.some(stop => stop.id === stopId)
  ) || transitData.speedoRoutes.find(route => 
    route.stops.some(stop => stop.id === stopId)
  );
};

/**
 * Find nearest station/stop to a location
 */
export const findNearestStop = (location: Coordinate, maxDistance: number = 5): (BusStop & { distance: number }) | null => {
  const allStops = getAllStations();
  let nearest: (BusStop & { distance: number }) | null = null;
  let minDistance = Infinity;

  allStops.forEach(stop => {
    const distance = calculateDistance(
      location,
      { lat: stop.lat, lng: stop.lng }
    );
    if (distance < minDistance && distance <= maxDistance) {
      minDistance = distance;
      nearest = { ...stop as BusStop, distance };
    }
  });

  return nearest;
};

// =====================================================
// TYPE DEFINITIONS
// =====================================================

import { Coordinate } from '../types';

interface Station {
  id: string;
  name: string;
  nameUrdu: string;
  lat: number;
  lng: number;
}

interface BusStop extends Station {
  routeId?: string;
  routeName?: string;
  routeNameUrdu?: string;
  routeNumber?: string;
}

interface BusRoute {
  id: string;
  name: string;
  nameUrdu: string;
  number: string;
  fare: number;
  frequency: string;
  color: string;
  stops: Station[];
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
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

