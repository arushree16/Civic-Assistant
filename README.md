# Quick Setup Guide

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/Vedikagupta02/Civic-Assistant.git
cd Civic-Assistant
npm install

# Setup Firebase
# 1. Create Firebase project at https://console.firebase.google.com/
# 2. Enable Auth (Google + Phone) and Firestore
# 3. Copy Firebase config to .env file

# Start development
npm run dev
```

## 📦 Core Dependencies

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui
- React Query (state management)
- Firebase (auth + database)
- Leaflet (maps)

### Backend  
- Express.js + TypeScript
- Firebase Admin SDK
- Zod (validation)

## 🔑 Environment Variables

```env
# Frontend (.env)
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com

# Backend (.env)
NODE_ENV=development
PORT=5000
```

## 📞 Delhi Helplines

- **Waste:** MCD - 155305
- **Water:** DJB - 1916  
- **Air:** DPCC - 011-42200500
- **Transport:** Traffic Police - 1075
- **Electricity:** DISCOMs - 1912

## 🏗️ Project Structure

```
client/
├── src/
│   ├── components/     # UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities (Firebase)
│   ├── contexts/      # React contexts
│   └── config/        # Configuration files
server/
├── routes.ts          # API endpoints
├── storage.ts         # Mock data
└── delhi-helplines.ts # Helpline config
```

## 🔥 Firebase Setup

1. **Authentication:** Enable Google + Phone OTP
2. **Firestore:** Create database with security rules
3. **Indexes:** Create composite index on `issues` collection
4. **Rules:** See REQUIREMENTS.md for complete rules

## 🎯 Features

✅ User Authentication (Google + Phone)  
✅ Issue Classification (AI-powered)  
✅ Real Delhi Helplines  
✅ User Issue Tracking  
✅ Public Area Overview  
✅ Location Detection  
✅ Photo Upload  
✅ Responsive Design  

## 📱 Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Firebase Console:** https://console.firebase.google.com

## 🐛 Common Issues

1. **Firebase Permission Denied:** Check security rules
2. **Issues Not Showing:** Verify Firestore indexes
3. **Category Always "General":** Check useEffect in ReportModal
4. **Location Not Working:** Enable browser geolocation

## 📚 Documentation

- **Full Requirements:** See `REQUIREMENTS.md`
- **Firebase Setup:** See `FIREBASE_SETUP.md`
- **API Documentation:** See `server/routes.ts`

---

*For detailed requirements, architecture, and deployment guide, see the main [REQUIREMENTS.md](./REQUIREMENTS.md) file.*
