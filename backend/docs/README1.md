# 🛡️ NeXora — Intelligent Disaster & Civil Management System

**NeXora** is a multi-role disaster and civil management platform built with **Spring Boot 3.5.x**, **React + Vite**, and **PostgreSQL**.  
It connects **Citizens**, **Responders**, **NGOs**, **Volunteers**, and **Administrators** on a single real‑time dashboard system.

---

## 🧠 WHAT IS NeXora?

Instead of a complex "AI disaster system", think:

> **A web app where users report problems, the system assigns help, and everyone tracks it.**

From broken roads to major floods — NeXora handles daily civic issues and large‑scale disasters with the same clean workflow.

---

## 🎯 KEY FEATURES

### 🔴 Emergency Features
- 🆘 **SOS Emergency Button** (no login required option)
- 📍 **Real‑time Incident Reporting** with GPS & media upload
- 🗺️ **Live Disaster Map** (color‑coded: Red = Critical, Yellow = Risk, Green = Safe)
- 🤖 **AI Priority Detection** (Gemini API integration)
- 📊 **Disaster Detection Engine** — auto‑activates "Disaster Response State"

### 👥 Multi‑Role Dashboards
| Role | Dashboard | Responsibilities |
|------|-----------|------------------|
| 🧑‍🤝‍🧑 **Citizen** | Report, SOS, Track, Family Safety | Report issues, track status, mark family safe |
| 🚑 **Responder** | Tasks, Navigation, Status | Accept/reject tasks, navigate, update progress |
| 🏢 **NGO** | Resources, Dispatch, Volunteers | Manage inventory, dispatch supplies, coordinate volunteers |
| 🧠 **Admin** | Live Map, Heatmap, AI Panel | Monitor everything, assign tasks, trigger simulations |
| 🙋 **Volunteer** | Nearby Tasks, Team | View & join nearby missions |

### 🧩 Design Patterns (Academic Requirement)
| Pattern | Where | Why |
|---------|-------|-----|
| **Factory** | User role creation | 6 roles, 5 factories |
| **Singleton** | Database connection | Single DB instance |
| **Builder** | Incident report | Step‑by‑step complex object |
| **Bridge** | Notification system | Abstraction ↔ Implementation |
| **Adapter** | Map service (Leaflet/OSM) | External library integration |

---

## 🏗️ TECH STACK

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.5.x, Java 17, Maven |
| **Frontend** | React 18 + Vite, Leaflet.js |
| **Database** | PostgreSQL 15+ |
| **Auth** | JWT (Access + Refresh Tokens), Spring Security |
| **AI** | Gemini API (text analysis, priority scoring) |
| **Maps** | OpenStreetMap + Leaflet (via Adapter Pattern) |
| **Notifications** | In‑app, Email (Bridge Pattern) |

---

## 📂 PROJECT STRUCTURE
NeXora/
├── frontend/ ← React + Vite (Member 1)
├── backend/ ← Spring Boot (All Members)
│ ├── src/main/java/nexora_backend/
│ │ ├── auth/ ← Authentication (Member 1)
│ │ ├── citizen/ ← Citizen Portal (Member 2)
│ │ ├── responder/ ← Responder Portal (Member 2)
│ │ ├── ngo/ ← NGO Portal (Member 3)
│ │ ├── volunteer/ ← Volunteer Portal (Member 3)
│ │ ├── admin/ ← Admin Portal (Member 4)
│ │ ├── config/ ← Shared configuration
│ │ ├── entity/ ← JPA entities
│ │ ├── enums/ ← Constants & enums
│ │ ├── factory/ ← Factory Pattern (User creation)
│ │ ├── strategy/ ← Strategy Pattern (Password validation)
│ │ └── exception/ ← Global error handling
│ └── pom.xml
├── docs/ ← Documentation (you are here!)
│ ├── README.md
│ ├── ARCHITECTURE.md
│ ├── PROJECT_STRUCTURE.md
│ ├── SETUP_GUIDE.md
│ └── SIMPLE_SETUP.md
└── .gitignore

---

## 👥 TEAM

| Member | Module | GitHub |
|--------|--------|--------|
| **Member 1** | Authentication + Frontend | cyber01012 |
| **Member 2** | Citizen + Responder Portal | manhub7 |
| **Member 3** | NGO + Volunteer Portal | — |
| **Member 4** | Admin Portal | — |

---

## 📚 DOCUMENTATION

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design & 4+1 View Model
- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) — Folder & package breakdown
- [SETUP_GUIDE.md](docs/SETUP_GUIDE.md) — Full development setup
- [SIMPLE_SETUP.md](docs/SIMPLE_SETUP.md) — Quick start guide

---

## 📝 LICENSE

This project is created for **SWE-211L: System Design & Architecture** at **Sir Syed University of Engineering & Technology (SSUET)**.