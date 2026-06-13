# NeXora Project Analysis (Updated)

## What Does This Project Do?
**NeXora** is an **Intelligent Disaster & Civil Management System**. It serves as a comprehensive, multi-portal command center designed for detecting anomalies, deploying resources, and managing crises in real-time. The application provides an interactive, HUD-like (Heads-Up Display) experience with distinct portals tailored for different roles in a crisis or civic management scenario: **Citizens, Responders, Helpdesk, and Administrators.**

## Usage & Technology Stack

The project is a full-stack monorepo with distinct `frontend` and `backend` architectures.

### Backend Setup
- **Stack**: Java 17, Spring Boot 3.5.x, PostgreSQL, Maven, Spring Security (with JWT), Redis, and Java Mail Sender.
- **Prerequisites**: JDK 17, PostgreSQL 15+, Redis, Maven.
- **Running the Backend**: 
  1. Create a local PostgreSQL database named `nexora_db`.
  2. Configure `application.properties` with your PostgreSQL credentials.
  3. Run using `mvn spring-boot:run`.

### Frontend Setup
- **Stack**: React 19, Vite, Tailwind CSS (v4), Framer Motion, GSAP, Radix UI Primitives, Material-UI (MUI), Recharts, Chart.js, React Router, Axios.
- **Prerequisites**: Node.js and npm.
- **Running the Frontend**:
  1. Navigate to the `frontend` directory.
  2. Install dependencies: `npm install`
  3. Start the development server: `npm run dev`

## What is Currently Done?

Following the integration of the complete repository, the project has evolved into a fully fleshed-out application with complex domain logic and specialized interfaces.

### Core Portals & Pages
The frontend now implements a comprehensive routing structure catering to specific user roles:
- **`LandingPage`**: The immersive product showcase with a "Disaster Mode" toggle.
- **Citizen Portal** (`src/pages/citizen/`): Dashboards and tools specifically for the public to report incidents, volunteer, and receive updates.
- **Responder Portal** (`src/pages/responder/`): Tools for emergency personnel to track incidents, map routes, and manage resources.
- **Helpdesk Portal** (`src/pages/helpdesk/`): Interface for dispatchers/operators to manage forwarded complaints and coordinate responses.
- **Admin Portal** (`src/pages/admin/`): Centralized oversight, analytics, and system configuration.
- **`NotificationsPage`**: A dedicated page for real-time system alerts.

### Frontend Components & UI Library
The UI is built using a highly modular and modern stack:
- **UI Components (`src/components/ui/`)**: Reusable base components built on Radix UI and Tailwind (Modals, Accordions, Sliders, Checkboxes).
- **Map & Tracking (`src/components/map/`)**: Geospatial visualization components.
- **Auth Flow (`src/components/auth/`)**: Forms and state handling for sign-ups and logins.
- **Figma Designs (`src/components/figma/`)**: Imported or closely matched specific high-fidelity UI components.

### Backend Domain Architecture
The Spring Boot backend has shifted from a monolith shell to a highly structured domain-driven design. The `nexora_backend` package is split into:
- `auth`: Security configurations and authentication logic.
- `citizen`: Endpoints and logic handling public user flows.
- `helpdesk` & `responder`: APIs for operators and emergency personnel.
- `insight` & `notificationsystem`: Analytical dashboards and real-time alerts.

#### Database Entities (PostgreSQL)
The data model is now fully defined with JPA Entities, including:
- `RegisterCitizen`, `AdminUser`, `VolunteerWorkerCreator` (User Models)
- `CivicReport`, `SOSReport`, `AnonymousReport` (Reporting Models)
- `ForwardedComplaint`, `Notification` (Action Models)
- Enums defining `ComplaintNature`, `ComplaintType`, `ResponderType`, `UserType`.

### Integrations
- **Redis**: Caching and potential session/socket management (`spring-boot-starter-data-redis`).
- **Mail**: Email notifications (`spring-boot-starter-mail`).
- **Gemini API**: AI integration ready via properties configuration (`gemini.api.key.primary`).
