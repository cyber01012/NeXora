NeXora/
├── frontend/ ← React + Vite frontend application
│ ├── src/
│ │ ├── pages/ ← Dashboard pages per role
│ │ ├── components/ ← Reusable UI components
│ │ ├── services/ ← API call functions (axios)
│ │ └── App.jsx ← Main app component
│ └── package.json
│
├── backend/ ← Spring Boot backend application
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/nexora_backend/
│ │ │ │ ├── auth/ ← Authentication module
│ │ │ │ ├── citizen/ ← Citizen Portal
│ │ │ │ ├── responder/ ← Responder Portal
│ │ │ │ ├── ngo/ ← NGO Portal
│ │ │ │ ├── volunteer/ ← Volunteer Portal
│ │ │ │ ├── admin/ ← Admin Portal
│ │ │ │ ├── config/ ← Shared configuration
│ │ │ │ ├── entity/ ← JPA entities (shared)
│ │ │ │ ├── enums/ ← Constants & enums
│ │ │ │ ├── factory/ ← Factory Pattern
│ │ │ │ ├── strategy/ ← Strategy Pattern
│ │ │ │ └── exception/ ← Error handling
│ │ │ └── resources/
│ │ │ ├── application.properties ← DB config (NOT pushed)
│ │ │ └── application-template.properties ← Template (pushed)
│ │ └── test/ ← Unit tests
│ ├── .gitignore
│ ├── mvnw / mvnw.cmd ← Maven wrapper
│ └── pom.xml ← Maven dependencies
│
└── docs/ ← Documentation (you are here!)
├── README.md
├── ARCHITECTURE.md
├── PROJECT_STRUCTURE.md
├── SETUP_GUIDE.md
└── SIMPLE_SETUP.md

text

---

## 📦 PACKAGE BREAKDOWN

### 1. `auth/` — Authentication Module
auth/
├── controller/
│ ├── AuthController.java ← Login, Register, Refresh Token
│ └── GuestIncidentController.java ← Incident reporting without login
├── service/
│ ├── AuthService.java ← Authentication logic
│ ├── EmailService.java ← Email/OTP sending
│ └── OtpService.java ← OTP generation & verification
├── dto/
│ ├── request/
│ │ ├── LoginRequest.java
│ │ ├── RegisterRequest.java
│ │ └── ForgotPasswordRequest.java
│ └── response/
│ ├── AuthResponse.java
│ └── ApiResponse.java
├── entity/
│ ├── RefreshToken.java ← Stored refresh tokens
│ └── OtpToken.java ← OTP storage
└── filter/
└── JwtAuthenticationFilter.java ← Intercepts all requests

text

### 2. `citizen/` — Citizen Portal (TUM)
citizen/
├── controller/
│ ├── ReportController.java ← CRUD for incident reports
│ ├── SosController.java ← Emergency SOS trigger
│ └── FamilySafetyController.java ← Mark safe, check family
├── service/
│ ├── ReportService.java ← Report creation + AI analysis
│ └── FamilySafetyService.java ← Family safety logic
├── dto/
│ ├── IncidentReportRequest.java
│ └── ReportTrackingResponse.java
└── entity/
├── Report.java ← Incident report table
└── FamilyMember.java ← Family safety table

text

### 3. `responder/` — Responder Portal (TUM)
responder/
├── controller/
│ ├── TaskController.java ← View/accept/reject tasks
│ └── NavigationController.java ← Route to incident location
├── service/
│ ├── TaskService.java ← Task assignment logic
│ └── RoutingService.java ← OSM routing integration
├── dto/
│ ├── TaskAssignmentRequest.java
│ └── TaskStatusUpdateRequest.java
└── entity/
└── Task.java ← Task table

text

### 4. `ngo/` — NGO Portal (Member 3)
ngo/
├── controller/
│ ├── ResourceController.java ← Inventory CRUD
│ └── DispatchController.java ← Dispatch resources
├── service/
│ ├── ResourceService.java ← Inventory management
│ └── DispatchService.java ← Dispatch logic
├── dto/
│ ├── ResourceRequest.java
│ └── DispatchRequest.java
└── entity/
├── Resource.java ← Resource inventory table
└── Dispatch.java ← Dispatch tracking table

text

### 5. `volunteer/` — Volunteer Portal (Member 3)
volunteer/
├── controller/
│ └── VolunteerTaskController.java ← View/join nearby tasks
├── service/
│ └── VolunteerService.java ← Volunteer assignment logic
├── dto/
│ └── VolunteerAssignmentRequest.java
└── entity/
└── VolunteerAssignment.java ← Volunteer-task mapping table

text

### 6. `admin/` — Admin Portal (Member 4)
admin/
├── controller/
│ ├── AdminReportController.java ← Monitor all reports
│ ├── HeatmapController.java ← Heatmap data endpoint
│ └── SimulationController.java ← Disaster simulation trigger
├── service/
│ ├── AdminService.java ← Admin business logic
│ └── SimulationService.java ← Digital twin simulation
├── dto/
│ ├── ReportFilterRequest.java
│ └── SimulationRequest.java
└── entity/
└── AuditLog.java ← Admin action logs

text

### 7. `config/` — Shared Configuration
config/
├── SecurityConfig.java ← Spring Security + JWT filter chain
├── CorsConfig.java ← CORS for React frontend
└── AppConfig.java ← General app configuration

text

### 8. `entity/` — Shared Entities
entity/
└── User.java ← Base user entity (all roles)

text

### 9. `enums/` — Constants
enums/
├── UserRole.java ← CITIZEN, RESPONDER, NGO, ADMIN, VOLUNTEER
├── ReportStatus.java ← PENDING, ASSIGNED, IN_PROGRESS, COMPLETED
├── TaskPriority.java ← LOW, MEDIUM, HIGH, CRITICAL
└── ResourceType.java ← FOOD, MEDICINE, VEHICLE, SHELTER

text

### 10. `factory/` — Factory Pattern
factory/
├── UserFactory.java ← Factory interface
├── CitizenUserFactory.java
├── ResponderUserFactory.java
├── NgoAdminUserFactory.java
├── AdminUserFactory.java
├── VolunteerUserFactory.java
└── UserFactoryRegistry.java ← Factory of factories

text

### 11. `strategy/` — Strategy Pattern
strategy/
├── PasswordValidationStrategy.java ← Strategy interface
├── StandardPasswordStrategy.java
├── StrongPasswordStrategy.java
└── PasswordValidationContext.java ← Context class

text

### 12. `exception/` — Error Handling
exception/
├── GlobalExceptionHandler.java ← Central error handler
├── BusinessException.java ← Custom business exception
└── ResourceNotFoundException.java ← 404 handling

text

---

## 🗃️ DATABASE TABLES SUMMARY

| Table | Module | Purpose |
|-------|--------|---------|
| `users` | Shared | All user accounts (all roles) |
| `refresh_tokens` | Auth | JWT refresh token storage |
| `otp_tokens` | Auth | OTP for password reset |
| `reports` | Citizen | Incident reports |
| `family_members` | Citizen | Family safety tracking |
| `tasks` | Responder | Assigned tasks |
| `resources` | NGO | Resource inventory |
| `dispatches` | NGO | Dispatch tracking |
| `volunteer_assignments` | Volunteer | Volunteer-task mapping |
| `audit_logs` | Admin | Admin action logs |