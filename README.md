# 🚨 NeXora — Disaster & Civic Management System

> **Next-Gen Emergency Response, Incident Reporting & Civic Management Platform**

![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java 17](https://img.shields.io/badge/Java%2017-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

NeXora is a full-stack **Disaster & Civic Management System** built to handle real-time crisis response, incident reporting, civic alerts, emergency resource allocation, and community safety monitoring.

---

## 🌟 Key Features

* **🚨 Real-Time Incident Reporting**: Citizens and responders can quickly log emergency incidents, hazards, and civic issues.
* **🌐 Civic Pulse & Alert Dispatch**: Live monitoring dashboard with interactive visual pulses and real-time emergency alert broadcasts.
* **🛡️ Crisis Management Context (`DisasterContext`)**: Centralized state management for crisis tracking, resource allocation, and priority levels.
* **✨ Dynamic UI Micro-Interactions**: Built with React 19, Framer Motion, and GSAP for fluid, high-contrast, emergency-ready interfaces.
* **⚙️ Enterprise Spring Boot Backend**: Robust Java 17 backend microservice handling secure incident data, location tracking, and response dispatch.

---

## 📁 Repository Structure

```
NeXora/
├── frontend/                     # React 19 + Vite Frontend Client
│   ├── src/
│   │   ├── components/           # Civic pulse, pulse orb, incident cards
│   │   ├── context/              # DisasterContext & state providers
│   │   ├── pages/                # LandingPage, Incident Map, Alert Dashboard
│   │   ├── App.jsx               # Main application routing & provider wrapper
│   │   └── index.css             # High-contrast emergency theme styling
│   └── package.json              # Framer Motion, GSAP, Lucide React
│
└── backend/                      # Spring Boot Backend Microservice
    ├── src/main/java/com/nexora/ # Disaster models, API controllers, response services
    ├── pom.xml                   # Maven dependencies (Java 17, Spring Boot 3.5)
    └── README.md
```

---

## 🚀 Getting Started

### 1. Frontend Setup (`frontend`)

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open `http://localhost:5173` to launch the NeXora Civic Dashboard.

---

### 2. Backend Setup (`backend`)

```bash
# Navigate to the backend directory
cd backend

# Build & run Spring Boot application
mvn clean spring-boot:run
```
Backend API service will launch on `http://localhost:8080`.

---

## 🛠️ Built With

* **Frontend**: React 19, Vite, GSAP, Framer Motion, Lucide React, Tailwind / CSS3
* **Backend**: Java 17, Spring Boot 3, Maven
* **Core Domains**: Disaster Management, Civic Infrastructure Response, Real-Time Emergency Alerts

---

