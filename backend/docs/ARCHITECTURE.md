# 🏗️ NeXora Architecture

## 4+1 VIEW MODEL

This document describes the architecture of **NeXora** using the **4+1 View Model** as required by the course **SWE-211L: System Design & Architecture**.

---

## 1. LOGICAL VIEW (Functional Requirements)

The logical view focuses on the **functional requirements** — the main building blocks and their relationships.

### Class Diagram (Core Entities)
┌──────────────────────────────────────────────────────────┐
│ USERS │
│ ┌─────────┐ ┌──────────┐ ┌───────┐ ┌──────┐ ┌─────┐│
│ │ Citizen │ │ Responder│ │ NGO │ │Admin │ │Volun││
│ └────┬────┘ └────┬─────┘ └───┬───┘ └──┬───┘ └──┬──┘│
│ └─────────────┴────────────┴─────────┴─────────┘ │
│ ▲ │
│ │ extends │
│ ┌─────┴─────┐ │
│ │ User │ │
│ └───────────┘ │
├──────────────────────────────────────────────────────────┤
│ CORE ENTITIES │
│ │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│ │ Report │───▶│ Task │◀───│ Resource │ │
│ └──────────┘ └──────────┘ └──────────────┘ │
│ │ │ │ │
│ ▼ ▼ ▼ │
│ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│ │ Dispatch │ │ Volunteer│ │ Notification │ │
│ └──────────┘ │ Assignment│ └──────────────┘ │
│ └──────────┘ │
└──────────────────────────────────────────────────────────┘

### Database Schema (Core Tables)

```sql
-- Users & Authentication
users (id, name, email, password_hash, role, phone, organization, active, verified, created_at)

-- Incident Reports
reports (id, citizen_id, type, description, location_lat, location_lon, 
         media_path, priority, severity, status, tracking_code, created_at)

-- Tasks
tasks (id, report_id, assigned_to, task_type, priority, 
       status, instructions, created_at, completed_at)

-- NGO Resources
resources (id, ngo_id, resource_type, item_name, quantity, 
           unit, location, created_at, updated_at)

-- Dispatches
dispatches (id, ngo_id, resource_id, task_id, quantity_dispatched, 
            destination, status, dispatched_at, delivered_at)

-- Volunteers
volunteer_assignments (id, volunteer_id, task_id, ngo_id, status, assigned_at)

-- Family Safety
family_members (id, citizen_id, member_name, contact, safety_status, last_updated)

PACKAGE DIAGRAM:
-----------------
nexora_backend/
│
├── auth/                    ← Member 1
│   ├── controller/          (AuthController, GuestIncidentController)
│   ├── service/             (AuthService, EmailService, OtpService)
│   ├── dto/                 (LoginRequest, RegisterRequest, AuthResponse)
│   ├── entity/              (RefreshToken, OtpToken)
│   └── filter/              (JwtAuthenticationFilter)
│
├── citizen/                 ← Member 2 (TUM)
│   ├── controller/          (ReportController, SosController)
│   ├── service/             (ReportService, FamilySafetyService)
│   └── entity/              (Report, FamilyMember)
│
├── responder/               ← Member 2 (TUM)
│   ├── controller/          (TaskController, NavigationController)
│   ├── service/             (TaskService, RoutingService)
│   └── entity/              (Task, TaskAssignment)
│
├── ngo/                     ← Member 3
│   ├── controller/          (ResourceController, DispatchController)
│   ├── service/             (ResourceService, VolunteerService)
│   └── entity/              (Resource, Dispatch)
│
├── volunteer/               ← Member 3
│   ├── controller/          (VolunteerTaskController)
│   ├── service/             (VolunteerService)
│   └── entity/              (VolunteerAssignment)
│
├── admin/                   ← Member 4
│   ├── controller/          (AdminReportController, HeatmapController)
│   ├── service/             (AdminService, SimulationService)
│   └── entity/              (AuditLog)
│
└── shared/                  ← Common to all
    ├── config/              (SecurityConfig, CorsConfig)
    ├── entity/              (User)
    ├── enums/               (UserRole, ReportStatus, TaskPriority)
    ├── factory/             (UserFactory, UserFactoryRegistry)
    ├── exception/           (GlobalExceptionHandler)
    └── util/                (JwtUtil)
CITIZEN REPORTS INCIDENT
        │
        ▼
   AI ANALYSIS (Gemini)
        │
        ▼
   DISASTER DETECTION ENGINE
   (5+ reports in 10 min → activate)
        │
        ▼
   ADMIN DASHBOARD
   (Monitor, assign, notify)
        │
        ├──▶ RESPONDER (Rescue operations)
        │
        └──▶ NGO (Relief support)
              │
              ▼
         DISPATCH CENTER
         (Select resources, quantity, destination)
              │
              ▼
         VOLUNTEER ASSIGNMENT
         (Accept mission, update status)
              │
              ▼
         DELIVERY COMPLETE
         (Admin tracks: "Aid delivered successfully")

Help Desk Call Flow (Sequence Diagram):
Caller → Sub-Admin → System → Admin → Responder → Citizen
  │         │          │        │         │          │
  │─call───▶│          │        │         │          │
  │         │─create──▶│        │         │          │
  │         │◄─trackID─│        │         │          │
  │◄─ID─────│          │        │         │          │
  │         │          │─route─▶│         │          │
  │         │          │        │─assign─▶│          │
  │         │          │        │         │─respond─▶│
  │         │          │◄──────┴─────────┴──────────│
  │         │          │           STATUS UPDATES    │

4. PHYSICAL VIEW (Deployment):
┌─────────────────────────────────────────────────┐
│                  CLIENT LAYER                     │
│  ┌──────────────────────────────────────────┐   │
│  │  Browser (React + Vite on localhost:5173) │   │
│  └────────────────┬─────────────────────────┘   │
├───────────────────┼──────────────────────────────┤
│                  API LAYER                        │
│  ┌────────────────▼─────────────────────────┐   │
│  │  Spring Boot (localhost:8080)             │   │
│  │  ├── Auth Service                         │   │
│  │  ├── Citizen Service                      │   │
│  │  ├── Responder Service                    │   │
│  │  ├── NGO Service                          │   │
│  │  ├── Volunteer Service                    │   │
│  │  └── Admin Service                        │   │
│  └────────────────┬─────────────────────────┘   │
├───────────────────┼──────────────────────────────┤
│                 DATA LAYER                        │
│  ┌────────────────▼─────────────────────────┐   │
│  │  PostgreSQL 15+ (localhost:5432)          │   │
│  │  Database: nexora_db                      │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘

Admin Dashboard:
┌──────────────────────────────────────────────┐
│  Sidebar          │       MAIN AREA          │
│  ─────────        │  ┌──────────────────┐    │
│  Dashboard        │  │   LIVE MAP       │    │
│  Reports          │  │  (heatmap zones) │    │
│  Tasks            │  └──────────────────┘    │
│  Resources        │                          │
│  Analytics        │  ┌─────────┐ ┌────────┐ │
│                   │  │ Reports │ │   AI   │ │
│                   │  │ Panel   │ │Suggest │ │
│                   │  └─────────┘ └────────┘ │
└──────────────────────────────────────────────┘

AI INTEGRATION (Gemini):
User Report Text
       │
       ▼
Gemini API (text analysis)
       │
       ├── disaster_category (Flood, Fire, Earthquake, etc.)
       ├── severity_score (1-10)
       ├── urgency_level (Low, Medium, High, Critical)
       └── suggested_actions
              │
              ▼
       Disaster Detection Engine
       (threshold-based activation)

SECURITY ARCHITECTURE:
Client Request
     │
     ▼
JwtAuthenticationFilter
     │
     ├── Valid Token → Proceed to Controller
     │
     └── Invalid/Expired → 401 Unauthorized

Token Structure:
- Access Token: 15 min expiry
- Refresh Token: 7 days expiry
- JWT Rotation: Refresh token rotated on every use

