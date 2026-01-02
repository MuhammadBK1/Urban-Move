# 🚐 Urban-Move Web

**Real-time Public Transit Tracker for Pakistan**

A responsive web application that helps commuters track Metro Bus, Orange Line Metro, and official bus services in Pakistani cities.

---

## 📋 Problem Statement

Pakistan's urban transit faces unique challenges:

| Challenge | Impact |
|-----------|--------|
| **Limited Real-Time Info** | Commuters wait without knowing arrival times |
| **Information Gap** | No visibility into vehicle locations |
| **Multiple Transit Systems** | Metro Bus, Orange Line, and Bus routes need unified tracking |
| **Low Connectivity** | Many users have limited internet |

### The Reality
- 🚌 **Millions** of daily public transit trips
- ⏱️ **15-30 minute** average wait with no visibility
- 📱 **Real-time tracking** for Metro and Bus services

---

## 💡 Solution

Urban-Move provides:

| Feature | Description |
|---------|-------------|
| 📍 **Live Tracking** | Real-time vehicle locations on Google Maps |
| ⏰ **Smart ETA** | Estimated arrival times with confidence levels |
| 👥 **Crowd-Sourcing** | Users report vehicle sightings |
| 🚗 **Driver Mode** | Drivers share their GPS location |
| 🌐 **Bilingual** | Full Urdu + English support |
| 📴 **Demo Mode** | Works without API keys for testing |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS |
| **Maps** | Mapbox GL JS |
| **Backend** | Firebase (Firestore + Realtime Database) |
| **Deployment** | Netlify / Vercel ready |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Maps API key (optional for demo mode)
- Firebase project (optional for demo mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/urban-move.git
cd urban-move

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Demo Mode

The app starts in **Demo Mode** by default, which:
- Works without any API keys
- Shows simulated vehicle movement
- Demonstrates all features offline

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Mapbox Access Token (Required for map functionality)
VITE_MAPBOX_ACCESS_TOKEN=pk.your_mapbox_public_token_here

# Firebase Configuration (Optional - app works in demo mode without it)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
```

### Mapbox Setup (Required)

1. Go to [Mapbox Access Tokens](https://account.mapbox.com/access-tokens/)
2. Sign up or log in to your Mapbox account
3. Copy your **Default public token** or create a new one
4. Create `.env` file in project root
5. Add: `VITE_MAPBOX_ACCESS_TOKEN=pk.your_token_here`
6. Restart the development server

**Note:** Mapbox offers a generous free tier (50,000 map loads/month).

### Firebase Setup (Optional)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Realtime Database**
5. Add web app and copy config to `.env`

### Testing Without API Keys

Without a Mapbox token, the app shows:
- Helpful setup instructions
- Error message with step-by-step guide
- The rest of the UI still functions

---

## 📁 Project Structure

```
Urban-Move/
├── index.html              # HTML entry point
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── .env                    # Environment variables (create this!)
├── src/
│   ├── main.tsx            # React entry point
│   ├── App.tsx             # Root component with routing
│   ├── index.css           # Global styles + Tailwind
│   │
│   ├── components/         # Reusable UI components
│   │   ├── Map/
│   │   │   ├── GoogleMap.tsx    # Basic Google Map
│   │   │   └── MapView.tsx      # Enhanced map with stations & simulation
│   │   └── UI/
│   │       ├── RouteCard.tsx
│   │       ├── ETACard.tsx
│   │       ├── CheckInButton.tsx
│   │       ├── DriverModeToggle.tsx
│   │       └── SettingsPanel.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── HomePage.tsx         # Main commuter dashboard
│   │   └── RouteDetailsPage.tsx # Route detail view
│   │
│   ├── data/               # Static data (stations, routes)
│   │   ├── stations.json        # Metro Bus & Orange Line stations
│   │   ├── feederRoutes.json    # Feeder routes & vehicles
│   │   └── index.ts             # Data exports & utilities
│   │
│   ├── context/            # React Context
│   │   └── AppContext.tsx
│   │
│   ├── services/           # Business logic
│   │   ├── mapService.ts        # Google Maps utilities
│   │   ├── locationService.ts   # Browser geolocation
│   │   ├── etaService.ts        # ETA calculations
│   │   └── demoService.ts       # Demo mode simulation
│   │
│   ├── firebase/           # Firebase configuration
│   │   ├── config.ts
│   │   └── operations.ts
│   │
│   ├── constants/          # Constants & translations
│   │   └── index.ts
│   │
│   └── types/              # TypeScript interfaces
│       └── index.ts
```

---

## 🎯 Features Explained

### ETA Calculation

```
ETA = Distance Along Route / Average Speed

Confidence Levels:
- 🟢 HIGH: Live GPS data < 1 minute old
- 🟡 MEDIUM: Data < 5 minutes old  
- 🔴 LOW: Data > 5 minutes old
```

### Driver Mode

When enabled:
1. GPS location captured continuously
2. Location uploaded every 15 seconds
3. Other users see vehicle move in real-time
4. Battery optimized using browser geolocation API

### Crowd-Sourced Check-ins

1. User taps "Vehicle Just Arrived" button
2. Location + timestamp saved to Firebase
3. 60-second cooldown prevents spam
4. Check-in data improves ETA accuracy

---

## 📱 Responsive Design

The app is fully responsive and works on:

- 📱 Mobile phones (primary target)
- 💻 Tablets
- 🖥️ Desktop browsers

Large touch targets and high-contrast colors ensure usability on low-end devices in bright sunlight.

---

## 🌐 Deployment

### Netlify

```bash
# Build the app
npm run build

# Deploy dist/ folder to Netlify
```

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

---

## 🔒 Firebase Security Rules

### Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /routes/{routeId} {
      allow read: if true;
      allow write: if false;
    }
    match /vehicles/{vehicleId} {
      allow read: if true;
      allow write: if false;
    }
    match /checkins/{checkinId} {
      allow read: if true;
      allow create: if true;
    }
  }
}
```

### Realtime Database

```json
{
  "rules": {
    "liveLocations": {
      "$routeId": {
        "$vehicleId": {
          ".read": true,
          ".write": true
        }
      }
    }
  }
}
```

---

## 📊 Future Revenue Model

| Phase | Model | Description |
|-------|-------|-------------|
| 1 | **Ads** | Non-intrusive banner ads |
| 2 | **Premium** | Ad-free with faster updates |
| 3 | **B2B API** | Data for transport companies |
| 4 | **Analytics** | Anonymized transit insights |

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 📞 Contact

- **Project**: Urban-Move
- **Email**: contact@urbanmove.pk

---

*"اربن موو - آپ کی سواری، آپ کے ہاتھ میں"*

*"Urban Move - Your ride, in your hands"*

---

Built with ❤️ for Pakistan 🇵🇰
