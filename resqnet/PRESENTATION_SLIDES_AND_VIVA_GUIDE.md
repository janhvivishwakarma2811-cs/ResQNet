# ResQNet – Major Project Presentation Deck (BTech CSE)
**Real-Time Disaster Response & Emergency Coordination System**  
*Tagline: Connecting Emergencies. Coordinating Responses. Saving Time.*

---

## Slide Design Guidelines & Theme
* **Palette:**
  * Primary: Emergency Dark (`#0f172a` Slate 900)
  * Accent / Alert: Emergency Red (`#dc2626` Red 600)
  * Secondary Accent: Warning Amber (`#f59e0b` Amber 500)
  * Supporting: Tactical Blue (`#2563eb` Blue 600) & Crisp White (`#ffffff`)
* **Typography:** Clean sans-serif (Inter, Segoe UI, or Roboto) for body; bold grotesque/geometric for headers.
* **Layout Rule:** 6x6 rule (no more than 6 bullet points per slide, max 6 words per line where possible, supplemented by diagrams).

---

## Slide 1: Title Slide

### Slide Content
* **Title:** ResQNet – Real-Time Disaster Response & Emergency Coordination System
* **Subtitle:** An Enterprise Full-Stack Geospatial Emergency Dispatch Platform
* **Tagline:** *Connecting Emergencies. Coordinating Responses. Saving Time.*
* **Presenter:** [Your Name] (Roll No: [Your Roll Number])
* **Degree:** Bachelor of Technology in Computer Science & Engineering
* **Supervisor / Guide:** [Guide's Name & Designation]
* **Department:** Department of Computer Science & Engineering
* **Institution:** [Your College / University Name]
* **Academic Session:** 2025–2026

### Speaker Notes (What to say)
> "Good morning respected members of the evaluation committee and my project guide. Today, I am presenting my major project titled **ResQNet** — a real-time disaster response and emergency coordination platform designed to bridge the critical time gap between citizen emergency reporting and first-responder deployment."

---

## Slide 2: Problem Statement & Motivation

### Slide Content
* **The Critical Golden Hour:** Survival rates drop exponentially in disasters when response delays exceed the first 60 minutes.
* **Flaws in Traditional Systems:**
  * **Siloed & Fragmented:** Traditional phone hotlines (e.g., 911/112) experience telecommunication congestion during catastrophic events.
  * **Lack of Geospatial Precision:** Verbal location descriptions lead to routing errors and responder disorientation.
  * **No Transparent Public Tracking:** Citizens have zero visibility into whether help is arriving, leading to panic and redundant calls.
  * **Manual Dispatch Overhead:** Emergency Operations Centers (EOC) lack automated proximity ranking algorithms to dispatch the closest team immediately.
* **The Need:** A unified, open-source, zero-cost full-stack platform providing real-time tracking, proximity dispatch, and live situational awareness.

### Speaker Notes
> "In natural and human-induced disasters, emergency hotlines often become bottlenecks. Responders are delayed because callers cannot accurately describe coordinates, and dispatchers manually sift through unit registries. ResQNet eliminates these friction points by providing immediate GPS-anchored incident logging, real-time WebSocket communication, and algorithmic proximity dispatch."

---

## Slide 3: Proposed Solution – ResQNet

### Slide Content
* **Integrated Emergency Ecosystem:** Connects three core stakeholders into one unified dashboard network:
  1. **Citizens:** Instant geolocation emergency reporting & public tracking code.
  2. **First Responders:** Live unit status management & interactive turn-by-turn routing maps.
  3. **EOC Admins:** Central command center, automated proximity dispatch, and city-wide broadcasts.
* **Key Pillars:**
  * **Zero Cost Architecture:** Built purely with open-source frameworks (Leaflet, OpenStreetMap, Spring Boot, React) without paid proprietary APIs (e.g., Google Maps, Twilio).
  * **Real-Time Push:** Full-duplex WebSocket STOMP protocol for sub-second incident updates.
  * **Geospatial Intelligence:** Haversine mathematical distance calculation to rank the closest available responder squads instantly.

### Speaker Notes
> "ResQNet is an enterprise-grade solution engineered with modern software engineering principles. It solves the emergency coordination crisis by automating the responder dispatch workflow through mathematical proximity calculations, all while keeping operational costs zero by avoiding expensive proprietary mapping APIs."

---

## Slide 4: Project Objectives

### Slide Content
* **Functional Objectives:**
  * Implement Role-Based Access Control (RBAC) across Citizen, Responder, and Administrator personas.
  * Enable multi-category emergency reporting (Flood, Fire, Hazmat, Earthquake, Accident, Collapse).
  * Provide interactive Leaflet maps with live incident markers, shelter capacity meters, and responder GPS routing.
  * Issue cryptographic public tracking codes allowing unauthenticated citizens to track rescue status.
  * Support instant emergency broadcast dissemination to all active web clients.
* **Technical & Architectural Objectives:**
  * Design a decoupled, RESTful Spring Boot 3 + React 19 architecture running on Java 25.
  * Implement stateless JWT authentication with BCrypt hashing for secure enterprise access.
  * Ensure resilient database persistence with transactional consistency (H2 / PostgreSQL).
  * Guarantee zero-warning build compilation and sub-second API latency.

### Speaker Notes
> "The objectives were divided into user-facing capabilities and rigorous technical standards. On the technical side, the goal was to achieve end-to-end stateless security with JWT, sub-second event distribution using WebSockets, and clean decoupled services."

---

## Slide 5: System Architecture

### Slide Content
* **Client Presentation Layer:** React 19 SPA running on Vite 8, styled with local Tailwind CSS v4, dynamic Leaflet map engine, and Recharts analytics.
* **Security & Routing Filter:** Spring Security 6 stateless filter chain verifying HMAC-SHA256 JWT tokens with role-based method security.
* **Application & Business Tier:** Spring Boot 3.5 on Java 25 hosting decoupled REST controllers, proximity ranking services, and entity managers.
* **Real-Time Push Layer:** Spring WebSocket with STOMP message broker broadcasting over `/topic/incidents` and `/topic/broadcasts`.
* **Data Persistence Tier:** Spring Data JPA with Hibernate ORM backed by persistent file storage (`resqnet_dev.mv.db`) in PostgreSQL compatibility mode.

### Speaker Notes
> "Here is our 4-tier system architecture. The Presentation Tier runs React 19 optimized with Vite. Requests pass through our Spring Security filter chain for JWT validation. The Application Layer contains distinct services handling business logic, proximity calculations, and event publishing over our WebSocket broker, which directly pushes live state changes back to connected clients."

---

## Slide 6: Technology Stack & Technical Justification

### Slide Content
| Component | Technology Used | Why Chosen / Engineering Justification |
|---|---|---|
| **Frontend** | React 19 + Vite 8 | Ultra-fast HMR, component reusability, modern concurrent rendering |
| **Styling** | Tailwind CSS v4 | High-performance utility CSS with zero runtime bloat |
| **Mapping** | Leaflet.js + OpenStreetMap | Free, open-source geospatial visualization; zero reliance on paid Google Maps API |
| **Data Viz** | Recharts | Dynamic SVG rendering for incident analytics, severity distributions, and shelter metrics |
| **Backend** | Spring Boot 3.5.15 on Java 25 | Enterprise-grade reliability, dependency injection, high-throughput virtual thread compatibility |
| **Security** | Spring Security + JJWT 0.12.5 | Stateless session management, BCrypt password encryption, granular RBAC |
| **Real-Time** | Spring WebSocket + STOMP | Full-duplex bi-directional push messaging without client-side polling |
| **Database** | Persistent H2 / PostgreSQL | High-speed, zero-config relational storage with PostGIS compatibility |
| **API Docs** | SpringDoc OpenAPI 3 / Swagger | Interactive API testing and auto-generated documentation |

### Speaker Notes
> "Every technology was selected based on performance, scalability, and adherence to our zero-cost constraint. By combining Leaflet with OpenStreetMap, we completely bypassed expensive API billing quotas while retaining fluid zoom, pan, and custom HTML5 marker overlays."

---

## Slide 7: User Roles & Access Control Matrix

### Slide Content
* **1. Citizen (`ROLE_CITIZEN`):**
  * Report emergencies with categories, severity ratings, casualty counts, and GPS pins.
  * Access personal emergency submission history and live tracking statuses.
  * Trigger rapid SOS alerts with automated location capture.
* **2. First Responder (`ROLE_RESPONDER`):**
  * Toggle real-time readiness status (`AVAILABLE`, `DISPATCHED`, `ON_SCENE`, `OFF_DUTY`).
  * View assigned incident tickets with casualty counts and caller contact numbers.
  * Render real-time Leaflet route maps between responder base and incident coordinates.
  * Advance lifecycle milestones (`IN_PROGRESS`, `RESOLVED`) with operational audit remarks.
* **3. Emergency Operations Center (EOC) Admin (`ROLE_ADMIN`):**
  * Access high-level situational metrics and aggregate incident analytics.
  * Filter emergencies by severity, disaster category, and resolution status.
  * Execute algorithmic Smart Dispatch based on responder proximity.
  * Publish emergency public alerts via WebSocket push.
* **4. Public User (Unauthenticated):**
  * Search tracking codes via `/track` to view public timeline milestones.
  * Browse the city shelter directory and capacity indicators via `/shelters`.

### Speaker Notes
> "ResQNet implements strict Role-Based Access Control using Spring Security annotations like `@PreAuthorize`. Each user persona sees a custom dashboard tailored to their operational responsibilities, while public users can look up their emergency tracking code without needing to register."

---

## Slide 8: Technical Innovation 1 – Algorithmic Smart Dispatch

### Slide Content
* **The Haversine Proximity Formula:**
  * Calculates great-circle distance between two GPS coordinates $(lat_1, lon_1)$ and $(lat_2, lon_2)$ over the Earth's spherical curvature:
  $$\Delta lat = lat_2 - lat_1, \quad \Delta lon = lon_2 - lon_1$$
  $$a = \sin^2\left(\frac{\Delta lat}{2}\right) + \cos(lat_1) \cdot \cos(lat_2) \cdot \sin^2\left(\frac{\Delta lon}{2}\right)$$
  $$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right), \quad d = R \cdot c \quad (R = 6371 \text{ km})$$
* **Automated Dispatch Workflow:**
  1. Incident coordinates are fetched from database.
  2. The system scans all units with status `AVAILABLE`.
  3. The Haversine engine computes straight-line distance in kilometers for every unit in real time.
  4. Units are sorted in ascending order of proximity; EOC Admin sees the top closest teams with exact distance metrics.

```
Example Calculation from Live Test:
Incident: Sector 15 Gate 2 (28.6254° N, 77.2187° E)
Closest Unit: Metro Fire Squad 14 -> Calculated Distance: 10.36 km
Action: Instant Dispatch in < 15ms
```

### Speaker Notes
> "Instead of dispatchers guessing which fire squad or ambulance is closest, ResQNet runs the Haversine trigonometric formula directly in our Java backend. In less than 15 milliseconds, the backend calculates the exact distance for every available unit, ranks them, and presents the EOC commander with an immediate dispatch recommendation."

---

## Slide 9: Technical Innovation 2 – Real-Time WebSocket Infrastructure

### Slide Content
* **Why Not Traditional HTTP Polling?**
  * Polling wastes server bandwidth, floods the network with redundant GET calls, and introduces a 5–10 second delay.
* **ResQNet's STOMP over WebSocket Pipeline:**
  * Establishes a persistent TCP connection during app bootstrap.
  * Uses SockJS fallback for resilient connectivity across diverse browser environments.
* **Topic Distribution Model:**
  * `/topic/incidents`: Pushes live status transitions (`REPORTED` -> `DISPATCHED` -> `IN_PROGRESS` -> `RESOLVED`).
  * `/topic/broadcasts`: Dispatches urgent city-wide sirens and evacuation advisories instantly.
* **Zero Client Refresh:** Dashboards update instantly via React state hooks upon receipt of frame payloads.

### Speaker Notes
> "In disaster management, seconds matter. By implementing a STOMP message broker on top of WebSockets, our application maintains an open bi-directional communication channel. When an admin broadcasts an alert or a responder updates an incident to 'ON_SCENE', the update is broadcast to all active client browsers without requiring a page refresh."

---

## Slide 10: Database Schema & Entity Design

### Slide Content
* **Relational Entities:**
  * `User`: Credentials, BCrypt hash, full name, phone number, role enum (`ROLE_CITIZEN`, `ROLE_RESPONDER`, `ROLE_ADMIN`).
  * `Incident`: Unique tracking code, disaster category, severity, GPS coordinates, casualty count, status.
  * `ResponderUnit`: Unit type (Fire, Medical, Police, Rescue), current live coordinates, availability status.
  * `IncidentUpdate`: Granular event audit log tracking status transitions, remarks, responder identity, and timestamps.
  * `Shelter`: Geographic coordinates, total capacity, live occupants, amenities checklist, emergency phone.
  * `Broadcast`: Title, emergency advisory body, severity level, issuing administrator, broadcast timestamp.

### Speaker Notes
> "Our relational database model emphasizes data integrity and historical auditing. Every incident has an automated tracking code and maintains a one-to-many relationship with `IncidentUpdates`. This creates an immutable chronological audit trail tracking who changed the status, when, and what operational actions were performed on the ground."

---

## Slide 11: End-to-End Incident Lifecycle

### Slide Content
1. **Reporting:** Citizen logs in or taps SOS, pins the location on the Leaflet map, and submits the incident ticket.
2. **Notification:** Backend generates tracking code (`RSQ-XXXXX`) and fires a WebSocket alert to `/topic/incidents`.
3. **Proximity Ranking:** Admin opens the incident and queries `/api/incidents/{id}/nearby-responders`. The system ranks all active squads by kilometers.
4. **Dispatch:** Admin assigns the closest unit. The unit's status flips to `DISPATCHED`.
5. **En-Route Navigation:** Responder views the assigned incident with Leaflet route polyline and navigates to coordinates.
6. **Scene Action:** Responder updates status to `IN_PROGRESS` upon arrival, and marks as `RESOLVED` after crisis containment.
7. **Public Audit Trail:** Any citizen tracking the code sees the full timeline updated in real time.

### Speaker Notes
> "This slide illustrates the lifecycle of an emergency: from the moment a citizen clicks submit, the backend assigns a tracking code, notifies the EOC admin via WebSocket, executes proximity ranking, dispatches the closest responder, and records real-time updates as the squad arrives on scene and resolves the crisis."

---

## Slide 12: Interactive Geospatial Visualization

### Slide Content
* **Component Implementation:**
  * Built using `react-leaflet` connected to OpenStreetMap vector tiles.
  * Dynamic GPS pin-dropping with reverse geocoding fallback.
* **Key Map Features:**
  * **Color-Coded Severity Markers:** Red (Critical), Amber (High), Blue (Medium/Low).
  * **Custom SVG Cluster Overlays:** Real-time pulse animations for active disasters.
  * **Turn-by-Turn Responder Routing:** Visualizes straight-line and OSRM road polyline routes between unit coordinates and disaster sites.
  * **Shelter Capacity Gauges:** Interactive popups displaying real-time occupancy percentages (e.g., *72% Full*).

### Speaker Notes
> "Maps are the focal point of emergency coordination. We built a modular mapping library featuring a LocationPicker component for citizens and a RouteMap component for responders. Markers are dynamically styled with CSS pulse animations so that critical hazards immediately stand out visually."

---

## Slide 13: System Verification & Testing

### Slide Content
* **Automated Integration Test Runner (`verify-resqnet.ps1`):**
  * Comprehensive test script verifying all 3 user roles, security tokens, incident lifecycle transitions, and timeline event consistency.
* **Test Verification Summary:**
  * [PASS] **Health & Analytics API:** 100% operational; returns live aggregated metrics.
  * [PASS] **Citizen Authentication & Reporting:** Token issued, unique tracking code generated.
  * [PASS] **Public Unauthenticated Lookup:** Validates tracking endpoint access without bearer tokens.
  * [PASS] **EOC Admin Proximity Engine:** Accurately computed closest unit at 10.36 km in under 15ms.
  * [PASS] **Responder Lifecycle Flow:** State transitions (`REPORTED` -> `DISPATCHED` -> `IN_PROGRESS` -> `RESOLVED`) executed flawlessly.
  * [PASS] **Audit Trail Integrity:** 4 chronological audit milestones verified with operational notes.
* **Compilation Benchmark:** 0 compile errors across 53 Java source files (Java 25) and 0 Vite bundle warnings.

### Speaker Notes
> "We didn't just write code; we validated the entire system through an automated integration script. The test runner exercises all REST endpoints, tests JWT authentication across multiple roles, runs the proximity calculation, and verifies that timeline audit logs are properly written to the database."

---

## Slide 14: Comparative Analysis

### Slide Content
| Feature | Traditional 911 / 112 Phone Systems | Commercial Incident Apps (e.g., RapidSOS) | ResQNet System |
|---|---|---|---|
| **Cost & Licensing** | High public infrastructure budget | Expensive per-seat enterprise license | **100% Free & Open-Source** |
| **Map Engine** | Proprietary GIS (ArcGIS / Google) | Paid commercial map APIs | **OpenStreetMap + Leaflet (No API keys)** |
| **Citizen Visibility** | None (Call & wait blindly) | Limited SMS notifications | **Live Tracking Code with Full Audit Trail** |
| **Dispatch Method** | Manual operator telephone call | Semi-automated dispatch | **Automated Haversine Proximity Ranking** |
| **Shelter Management**| Disconnected manual registers | Not integrated | **Live Map with Occupancy Metrics** |
| **Deployment Model** | Rigid on-premise hardware | Closed proprietary cloud | **Decoupled Spring Boot + React (Docker-ready)** |

### Speaker Notes
> "When compared with traditional phone hotlines and expensive proprietary incident software, ResQNet provides comparable real-time capabilities with zero software licensing costs, full data ownership, and transparent public tracking for affected citizens."

---

## Slide 15: Future Scope & Enhancements

### Slide Content
* **1. AI-Powered Incident Severity Prediction:**
  * Train Natural Language Processing (NLP) models to scan citizen descriptions and classify disaster severity automatically.
* **2. Computer Vision Damage Assessment:**
  * Classify uploaded incident photos (e.g., flood depth, structural collapse severity) using lightweight CNN models.
* **3. Offline-First Progressive Web App (PWA):**
  * Implement Service Workers and IndexedDB caching so citizens can queue emergency reports even when mobile towers temporarily lose internet connectivity.
* **4. Drone & IoT Sensor Ingestion:**
  * Integrate seismic, water level, and weather sensor streams directly into the WebSocket feed for automated alarm triggers.

### Speaker Notes
> "Looking ahead, ResQNet can be expanded with AI image analysis to automatically assess the severity of photos uploaded by citizens, as well as an offline-first PWA mode to allow offline report caching during total cellular network blackouts."

---

## Slide 16: Conclusion & Viva / Defense FAQs

### Slide Content
* **Project Conclusion:**
  * ResQNet successfully proves that modern open-source technologies can deliver a robust, enterprise-grade emergency response platform.
  * Combines responsive React UI, Java 25 Spring Boot performance, real-time STOMP messaging, and algorithmic proximity dispatch into a deployable solution.

---

### Top Viva / Defense Questions & Technical Answers

#### Q1: Why did you use the Haversine formula instead of standard Euclidean distance?
* **Answer:** Euclidean distance assumes a flat Cartesian plane ($d = \sqrt{\Delta x^2 + \Delta y^2}$), which introduces significant distortion over geographic coordinates due to the Earth's spherical curvature. The Haversine formula computes great-circle distance over a sphere of radius $R = 6371\text{ km}$, yielding accurate real-world distances without requiring a paid routing API.

#### Q2: How does ResQNet maintain stateless security with WebSockets?
* **Answer:** Initial authentication is handled through a Spring Security filter using stateless JSON Web Tokens (JWT) signed with HMAC-SHA256. When establishing a WebSocket STOMP session, the initial HTTP handshake authenticates the user, and Spring's `SimpleBroker` delivers messages to destinations based on topic subscriptions.

#### Q3: Why choose Leaflet over Google Maps API?
* **Answer:** Google Maps requires a paid credit card billing account and introduces vendor lock-in. Leaflet is lightweight (~42 KB), open-source, supports OpenStreetMap tiles, and allows complete CSS customization of map markers and popups at zero cost.

#### Q4: How do you handle database persistence across application restarts?
* **Answer:** ResQNet is configured with an H2 file-backed database (`jdbc:h2:file:./data/resqnet_dev;MODE=PostgreSQL`) with Hibernate `ddl-auto: update`. All tables, incidents, users, and audit records are written to disk and persist reliably across server restarts. In production, this seamlessly points to a PostgreSQL/PostGIS instance by switching the active profile.

#### Q5: How do you prevent unauthorized citizens from dispatching responders?
* **Answer:** All dispatch endpoints (e.g., `/api/incidents/{id}/dispatch`) are protected at the controller level using Spring Method Security with `@PreAuthorize("hasRole('ADMIN')")`. Any request with a Citizen or unauthenticated token is immediately rejected with an HTTP 403 Forbidden.

---
*Created for ResQNet Major Project Defense — BTech CSE.*
