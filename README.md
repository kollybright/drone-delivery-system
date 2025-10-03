# 🚁 Drone Delivery System API Documentation

## 🚀 Overview
A REST API for managing drone medication deliveries.  
This system allows you to:
- Register drones  
- Load them with medications  
- Check battery levels  
- Monitor drone states  

---

## 📋 Table of Contents
- [Features](#-features)
- [API Endpoints](#-api-endpoints)
- [Data Models](#-data-models)
- [Request/Response Examples](#-requestresponse-examples)
- [Validation Rules](#️-validation-rules)
- [Error Handling](#-error-handling)
- [Setup & Installation](#️-setup--installation)
- [Running the Application](#-running-the-application)
- [Testing](#-testing)
- [Battery Monitoring](#-battery-monitoring)
- [Project Structure](#-project-structure)
- [Sample Data](#-sample-data)
- [Support](#-support)

---

## ✨ Features
✅ Register & manage drones  
✅ Load medications with validation  
✅ Check battery levels & states  
✅ Prevent overloading & low-battery ops  
✅ Periodic battery monitoring + audit logs  
✅ Available drones listing  
✅ Medication validation rules  

---

## 🌐 API Endpoints
**Base URL:** `http://localhost:3000/api`

### Documentation
- `GET /docs` → Check API Documentation

### Health
- `GET /health` → Check API status

### Drone Management
- `POST /drones` → Register a new drone  
- `GET /drones` → Get all drones  
- `GET /drones/available` → Get drones available for loading  
- `GET /drones/:droneId` → Get specific drone details  
- `POST /drones/:droneId/load` → Load medications onto a drone  
- `GET /drones/:droneId/medications` → Get drone medications  
- `GET /drones/:droneId/battery` → Check battery level  
- `PATCH /drones/:droneId/state` → Update drone state  

---

## 📊 Data Models

### Drone
```ts
{
  id: string;
  serialNumber: string; // max 100 chars
  model: 'Lightweight' | 'Middleweight' | 'Cruiserweight' | 'Heavyweight';
  weightLimit: number; // max 500gr
  batteryCapacity: number; // 0-100%
  state: 'IDLE' | 'LOADING' | 'LOADED' | 'DELIVERING' | 'DELIVERED' | 'RETURNING';
  medications: Medication[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Medication
```ts
{
  id: string;
  name: string; // letters, numbers, '-', '_'
  weight: number; // positive number
  code: string; // uppercase letters, numbers, '_'
  image: string;
  droneId: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 📝 Request/Response Examples

### 1. Register Drone
```bash
POST /api/drones
```
Request:
```json
{
  "serialNumber": "DRONE-001",
  "model": "Lightweight",
  "weightLimit": 300,
  "batteryCapacity": 100,
  "state": "IDLE"
}
```
Response:
```json
{
  "success": true,
  "message": "Drone registered successfully",
  "data": { ... }
}
```

### 2. Load Medication
```bash
POST /api/drones/:droneId/load
```
Request:
```json
{
  "name": "Paracetamol-500mg",
  "weight": 50,
  "code": "PARA_500",
  "image": "paracetamol.jpg"
}
```
Response:
```json
{
  "success": true,
  "message": "Medication loaded successfully",
  "data": { ... }
}
```

### 3. Get Available Drones
```bash
GET /api/drones/available
```
Response:
```json
{
  "success": true,
  "data": [ { ... } ]
}
```

### 4. Check Battery
```bash
GET /api/drones/:droneId/battery
```
Response:
```json
{
  "success": true,
  "data": {
    "droneId": "abc123",
    "batteryLevel": 85,
    "status": "OK"
  }
}
```

---

## ⚠️ Validation Rules

### Drone
- Serial Number ≤ 100 chars  
- Weight Limit ≤ 500g  
- Battery 0–100%  
- Valid states & models only  

### Medication
- **Name:** `/^[a-zA-Z0-9\-_]+$/`  
- **Code:** `/^[A-Z0-9_]+$/`  
- Positive weight only  

### Business Rules
❌ Battery < 25% → cannot load  
❌ Exceeding weight → invalid load  
✅ Only IDLE/LOADING drones accept new meds  
✅ Battery check every 5 mins with audit logs  

---

## 🚨 Error Handling
Format:
```json
{
  "success": false,
  "error": "Error description"
}
```
Common Codes: `200, 201, 400, 404, 500`  
Common Errors:
- "Drone not found"
- "Battery too low"
- "Weight limit exceeded"
- "Invalid medication format"

---

## 🛠️ Setup & Installation
### Prerequisites
- Node.js 16+  
- npm / yarn  

### Steps
```bash
git clone <repo-url>
cd drone-delivery-system
npm install
npm run build
```

---

## 🏃 Running the Application
### Dev
```bash
npm run dev
```

### Prod
```bash
npm start
```

Output:
```
✅ Connected to SQLite
✅ DB seeded
🚀 Running on http://localhost:3000
```

---

## 🧪 Testing
```bash
npm test
npm run test:coverage
npm run test:watch
```

---

## 🔋 Battery Monitoring
- Auto check every 5 mins  
- Logs audit history  
- Alerts on < 25% battery  
- Keeps 30 days of logs  

---

## 📁 Project Structure
```
src/
 ├── config/
 ├── controllers/
 ├── models/
 ├── repositories/
 ├── routes/
 ├── services/
 ├── tasks/
 ├── app.ts
 └── server.ts
data/drones.db
```

---

## 🎯 Sample Data
- 10 drones with configs & battery levels  
- 8 medication types  
- Preloaded medications for testing  

---

## 📞 Support
- hr@blusalt.net  
- abass@blusalt.net  
