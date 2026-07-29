# 🚨 NeXora — Disaster & Civic Management System

> **Next-Gen Emergency Response, Incident Reporting & Civic Management Platform**

![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Java 17](https://img.shields.io/badge/Java%2017-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

NeXora is a full-stack **Disaster & Civic Management System** built to handle real-time crisis response, incident reporting, civic alerts, emergency resource allocation, and community safety monitoring backed by a robust **PostgreSQL** relational database.

---<img width="1600" height="769" alt="nex0" src="https://github.com/user-attachments/assets/d14d44eb-5c0e-45a7-8824-1163e4671f32" />


## 🌟 Key Features

* **🚨 Real-Time Incident Reporting**: Citizens and emergency responders can quickly log incidents, hazards, and civic infrastructure issues.
* **🌐 Civic Pulse & Alert Dispatch**: Live monitoring dashboard with interactive visual pulses and real-time emergency alert broadcasts.
* **🐘 PostgreSQL Data Persistence**: Reliable ACID-compliant relational data store for crisis logs, incident coordinates, responder dispatches, and audit trails.
* **🛡️ Crisis Management Context (`DisasterContext`)**: Centralized React state management for crisis tracking, emergency resource allocation, and priority levels.
* **✨ Dynamic UI Micro-Interactions**: Built with React 19, Framer Motion, and GSAP for fluid, high-contrast, emergency-ready interfaces.
* **⚙️ Enterprise Spring Boot Backend**: Robust Java 17 Spring Boot microservice handling secure incident APIs, spatial location tracking, and response dispatches.

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
    ├── src/main/java/com/nexora/ # Disaster models, API controllers, PostgreSQL JPA Repositories
    ├── src/main/resources/       # application.properties (PostgreSQL DB config)
    ├── pom.xml                   # Maven dependencies (Java 17, Spring Boot 3.5, PostgreSQL Driver)
    └── README.md
```

---

## 🚀 Getting Started

### 1. Database Configuration (PostgreSQL)

Ensure PostgreSQL is installed and running. Configure connection properties in `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexora_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

---

### 2. Frontend Setup (`frontend`)

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

### 3. Backend Setup (`backend`)

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
* **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Maven
* **Database**: PostgreSQL (Relational Database Management System)
* **Core Domains**: Disaster Management, Civic Infrastructure Response, Real-Time Emergency Alerts

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

IMAGES

<img width="1600" height="769" alt="nex0" src="https://github.com/user-attachments/assets/43c31283-f6d2-47c7-bac3-c6aedc75b7ae" />
<img width="1600" height="766" alt="nex0 1" src="https://github.com/user-attachments/assets/f844c481-2802-4bd0-a4bb-406e5cd0d16c" />
<img width="1600" height="771" alt="NEX1" src="https://github.com/user-attachments/assets/8e5da2f4-55c1-48a2-b747-cae1176f135f" />

<img width="1600" height="769" alt="NEX2" src="https://github.com/user-attachments/assets/8648bde5-3d1b-44a4-a504-b59a34a0cdfb" />
<img width="1600" height="769" alt="nex3" src="https://github.com/user-attachments/assets/266dfe6b-a73f-4bc6-8304-fc01899c5b93" />
<img width="1600" height="773" alt="nex4" src="https://github.com/user-attachments/assets/f4908531-b2f3-47ad-b863-6b46fc83e75d" />
<img width="1600" height="765" alt="nex5" src="https://github.com/user-attachments/assets/fd140b6d-f8a0-46e4-a853-477dd846661e" />
<img width="1600" height="770" alt="nex6" src="https://github.com/user-attachments/assets/0da6e989-e4e1-4177-ae74-55e2c9983eec" />
<img width="1595" height="768" alt="nex7" src="https://github.com/user-attachments/assets/6b7fb49e-1831-49fb-94cb-f9433de32ae0" />

<img width="1600" height="773" alt="nex8" src="https://github.com/user-attachments/assets/1a347dd6-50b9-4d14-984e-cde27ec4113d" />




