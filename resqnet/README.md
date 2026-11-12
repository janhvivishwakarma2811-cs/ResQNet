# ResQNet – Real-Time Disaster Response & Emergency Coordination System

> **Tagline:** *Connecting Emergencies. Coordinating Responses. Saving Time.*

ResQNet is an enterprise-grade, full-stack disaster management and emergency coordination MVP designed for individual BTech Computer Science & Engineering capstone presentation and demonstrable field simulation.

It connects stranded citizens in distress, tactical field rescue squads, and emergency operations center (EOC) dispatchers in real time using interactive geospatial mapping, live STOMP WebSockets, automated Haversine proximity dispatch algorithms, and OSRM turn-by-turn routing with zero paid external API dependencies.

---

## 🌟 Key Features & Role Breakdown

### 1. Citizen Portal
- **One-Tap Emergency SOS Trigger:** Instantly transmits live GPS coordinates using the browser Geolocation API and dispatches a `CRITICAL` priority alert.
- **Emergency Incident Reporting:** Step-by-step reporting with disaster categories (*Flood, Fire, Earthquake, Medical, Accident, Structural Collapse, Landslide, Hazmat*), severity ratings, affected headcount, reporter contact phone, Leaflet pin-drop map picker, and optional damage photo preview.
- **Real-Time Public Incident Tracker:** Public tracking code (`RSQ-XXXX-XXXX`) lookup with visual step progression (*Reported → Verified → Dispatched → On Scene → Resolved*) and live timestamped operations logs.
- **Evacuation Safe Haven Radar:** Interactive spatial map of nearby relief camps with real-time bed occupancy meters and emergency rations/supplies health.
- **Emergency Broadcast Warnings:** Real-time push advisories (*Advisory, Watch, Warning, Evacuate*) streamed over WebSockets.

### 2. Field Rescue Responder Console
- **Unit Readiness Status Toggle:** Toggle between `AVAILABLE`, `ON_SCENE`, `BUSY`, and `OFF_DUTY` with automatic EOC notification.
- **Tactical Dispatch Queue:** Real-time queue of emergency calls assigned to the specific rescue squad.
- **Interactive Turn-by-Turn GPS Route Navigation:** Road routing powered by public OpenStreetMap and OSRM with automatic fallback to radial Haversine trajectory and real-time ETA calculation.
- **Field Operations Progression:** Step-by-step status transitions (*Accept Dispatch → Arrived on Scene → Evacuated & Resolved*) with field notes logging.
- **Emergency Reinforcement Backup Requests:** One-click requests for additional support (*ALS Ambulance, Foam Fire Tender, Rescue Inflatable Boat, NDRF Heavy Collapse Squad*).

### 3. Emergency Operations Center (EOC) Admin & Dispatcher
- **Live Spatial Operations Command Map:** Real-time visualization of all emergency calls (color-coded by severity: Red for Critical, Orange for High, Yellow for Medium, Green for Low), active rescue squads, and safe shelters.
- **Incident Triage & Algorithm-Driven Smart Dispatch:** Filter distress calls by status, severity, or disaster category. The system calculates Haversine radial distance to all active rescue units and ranks them by closest proximity for 1-click tactical deployment.
- **Public Disaster Warning Broadcasts:** Push multi-tiered emergency alerts (*Warning, Evacuation Order, Public Health Advisory*) across all connected citizen devices via WebSocket topic `/topic/alerts`.
- **Relief Shelter Management:** Register new evacuation camps, monitor bed capacities, and update occupancy counts in real time.
- **Strategic Logistics Inventory:** Monitor stock levels for rescue boats, mobile trauma surgical kits, ration packs, de-watering pumps, and thermal cots.
- **Disaster Response Analytics:** Interactive charts powered by Recharts (*Incidents by Disaster Category, Severity Distribution Donut, Emergency Lifecycle Pipeline*) and CSV export.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React.js, Vite, React Router 7, Axios, Leaflet.js, OpenStreetMap, Recharts, Lucide React, SockJS, StompJS |
| **Backend** | Java 25, Spring Boot 3.5.15, Spring Security 6, JWT (io.jsonwebtoken 0.12.5), Spring Data JPA, Hibernate, WebSocket + STOMP, Bean Validation |
| **Database** | PostgreSQL 16 + PostGIS (via Docker Compose) & H2 (Zero-configuration seamless dev mode) |
| **Migration** | Flyway DB Migrations (`db/migration/V1__init_schema.sql`) |
| **Testing** | JUnit 5, Mockito |
| **API Docs** | Swagger / OpenAPI 3.0 UI |

---

## 🔑 Pre-Configured Demonstration Accounts

The application automatically seeds realistic emergency scenarios, active rescue units, safe shelters, and demonstration accounts on initial startup:

| Role | Username / Email | Password | Access Privileges |
|---|---|---|---|
| **EOC Dispatcher / Admin** | `admin@resqnet.org` | `Admin@123` | Full command center, smart dispatch, alert broadcasts, shelter manager, analytics |
| **Rescue Squad (NDRF Alpha)** | `responder@resqnet.org` | `Responder@123` | Unit status toggle, assigned tactical queue, navigation route, field notes |
| **Fire Rescue Squad 14** | `fire@resqnet.org` | `Fire@123` | Hazmat and fire suppression squad console |
| **Citizen / Victim** | `citizen@resqnet.org` (or `citizen`) | `Citizen@123` | Report emergencies, trigger SOS, track incident status, view nearby relief camps |

> **Evaluator Tip:** The Login screen includes **One-Click Demo Evaluator Buttons** (*Citizen, Responder, EOC Admin*) for instantaneous role switching without typing credentials!

---

## 🚀 Running the Project Locally

### Prerequisites
- Java 25 LTS
- Maven 3.8+ (or use wrapper)
- Node.js 18+ and npm

### 1. Start PostgreSQL (Optional / Production)
To launch PostgreSQL 16 with PostGIS in Docker Compose:
```bash
docker compose up -d
```
*(Note: If Docker is not running, the application automatically boots into zero-config embedded persistence mode so you can run and evaluate immediately!)*

### 2. Start Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
- Backend REST API: `http://localhost:8080/api`
- Swagger OpenAPI 3.0 Documentation: `http://localhost:8080/swagger-ui.html`
- WebSocket STOMP Endpoint: `http://localhost:8080/ws`

### 3. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Open your browser at: `http://localhost:5174/` (or `http://localhost:5173/`)

---

## 📡 REST API Architecture

| Method | Endpoint | Description | Role / Auth |
|---|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user and issue JWT | Public |
| `POST` | `/api/auth/register` | Register new Citizen or Responder Squad | Public |
| `GET` | `/api/incidents` | List all emergencies (spatial map feed) | Public |
| `POST` | `/api/incidents` | Submit emergency distress report | Citizen / Authenticated |
| `POST` | `/api/incidents/sos` | Rapid 1-click panic GPS distress trigger | Citizen / Authenticated |
| `GET` | `/api/incidents/track/{code}` | Public tracking by tracking code | Public |
| `GET` | `/api/incidents/{id}/updates` | Real-time incident timeline log | Public |
| `GET` | `/api/incidents/{id}/nearby-responders` | Proximity-ranked responders with Haversine km | Admin / Dispatcher |
| `POST` | `/api/incidents/{id}/dispatch` | Deploy responder team to incident | Admin / Dispatcher |
| `PUT` | `/api/incidents/{id}/status` | Update incident status (*Verified, In Progress, Resolved*) | Responder / Admin |
| `GET` | `/api/shelters` | Directory of evacuation camps & occupancy | Public |
| `PUT` | `/api/shelters/{id}/occupancy` | Update shelter headcount | Admin |
| `GET` | `/api/broadcasts/active` | Active disaster public warnings | Public |
| `POST` | `/api/broadcasts` | Broadcast public emergency warning | Admin |
| `GET` | `/api/analytics/summary` | Real-time KPI counters & category breakdowns | Public |

---

## 🛡️ Cost & API Zero-Expense Compliance

- **Maps:** Uses free OpenStreetMap tile servers with Leaflet.js (No Google Maps API keys or billing required).
- **Geolocation:** Uses standard HTML5 Browser Geolocation API (`navigator.geolocation`).
- **Routing:** Public demo OSRM routing service with automatic fallback to spherical Earth Haversine geometry calculation.
- **Real-Time Communication:** Spring WebSocket + STOMP (in-process lightweight messaging broker, no paid third-party socket services).
