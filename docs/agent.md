## ✅ Complete Agent.md File — For Cursor Agent (Your Branch Only)

# 🚨 CURSOR AGENT EXECUTION MODE (STRICT)

You are acting as a backend repair agent for a broken full-stack system.

## MISSION
Fix ALL broken backend + frontend integration issues so that:
- Backend compiles with ZERO errors
- All REST endpoints are working
- Citizen + Responder flows are fully functional
- Database mappings are correct

## EXECUTION RULES (MANDATORY)

1. ALWAYS start by:
   - scanning project structure
   - identifying compile errors
   - listing broken files

2. FIX IN THIS ORDER:
   1. Compilation errors
   2. Entity/DTO mismatches
   3. Repository queries
   4. Service logic
   5. Controller endpoints
   6. API integration (frontend)

3. NEVER:
   - delete working code
   - refactor UI

4. ALWAYS:
   - ensure code compiles after each fix batch
   - keep database schema unchanged
   - prefer minimal patch fixes over redesign

5. STOP CONDITION:
   Only stop when:
   - backend builds successfully
   - no missing imports
   - all endpoints mapped correctly
```
# 🚨 CRITICAL INSTRUCTION FOR CURSOR AGENT

## 📋 PROJECT OVERVIEW

**I am working on NeXora - Disaster and Civic Management System. This is MY BRANCH (Member 1). Other members' code is NOT merged here. I have partial code that needs to be fixed.**

**NeXora** has 4 portals:
1. **Citizen Portal** - Report issues, track status (Member 1 — ME) ⭐
2. **Responder Portal** - Accept tasks, assign to volunteers, confirm completion (Member 1 — ME) ⭐
3. **Admin Portal** - Forward tasks to departments (Member 2 — NOT IN THIS FOLDER)
4. **Volunteer Portal** - Accept tasks, upload evidence (Member 4 — NOT IN THIS FOLDER)

**YOUR TASK:** Fix my Citizen + Responder portal to work correctly with database. No other members' code is present.

---

## ⚠️ CRITICAL RULES — READ CAREFULLY

### ❌ ABSOLUTELY DO NOT:
1. **DELETE any existing code in database folder** 
2. **CHANGE UI/Design** — Keep Claude-style UI as is
3. **DELETE any tables** — Database schema is fixed

### ✅ YOU CAN:
1. **ADD new files** in citizen and responder folder
2. **MODIFY Citizen & Responder code** — Fix wrong logic or wrong table connections
3. **ADD new methods** — In existing services
4. **ADD data to database** — If tables are empty
5. **FIX API endpoints** — Make them work correctly

---

## 🗄️ DATABASE SCHEMA (COMPLETE)

### 📁 Tables You Need to Know

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TABLES OVERVIEW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CONNECTED TABLES (DO NOT CHANGE SCHEMA):                                   │
│  ├── register_citizen     ← Citizen accounts (login by phone_num)          │
│  ├── admin_user           ← Responder accounts (login by username)          │
│  ├── department           ← K-Electric, SUI Gas, Water Board, etc.          │
│  ├── forwarded_complaint  ← ⭐ CENTRAL TASK TRACKING TABLE                  │
│  ├── civic_report         ← Original citizen reports                        │
│  ├── forward_decision     ← Volunteer evidence storage                      │
│  ├── volunteer_worker     ← Volunteers (added by responder)                 │
│  ├── user_type            ← Roles (3=Responder, 5=Admin)                    │
│  ├── responder_type       ← Department codes (K5=K-Electric)                │
│  ├── complaint_nature     ← 7=Electricity, 8=Gas, 9=Road, 10=Water          │
│  └── complaint_type       ← 2=CIVIC                                         │
│                                                                              │
│  INDEPENDENT TABLES (CAN MODIFY):                                           │
│  ├── citizen_notification     ← Citizen alerts                              │
│  ├── citizen_saved_location   ← Saved addresses                             │
│  ├── responder_notification   ← Responder alerts                            │
│  ├── responder_performance    ← Department metrics                          │
│  └── responder_task_history   ← Audit log                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔑 LOGIN FIELDS (CRITICAL)

| User Type | Table | Login Field | Example |
|-----------|-------|-------------|---------|
| Citizen | `register_citizen` | `phone_num` | `0300-1234567` |
| Responder | `admin_user` | `username` | `kelectric_fp` |

---

## 🔄 COMPLETE DATA FLOW

### 1. CITIZEN REGISTRATION & LOGIN

```
Citizen enters phone_num + password
        │
        ▼
AuthController.login() → AuthService
        │
        ▼
Checks register_citizen table
        │
        ├── phone_num exists? ──No──► Error
        │
        ▼ Yes
Check password matches
        │
        ▼
Generate JWT token
        │
        ▼
Return redirect to /citizen
```

### 2. CITIZEN SUBMITS REPORT

```
Citizen fills report form
        │
        ▼
POST /api/citizen/reports
        │
        ▼
Data saved to civic_report table:
  - citizen_id (from logged-in citizen)
  - detail (description)
  - nature_id (7=Electricity, 8=Gas, 9=Road, 10=Water)
  - province, district, town, area, city
  - evidence (file path if uploaded)
        │
        ▼
Send notification to citizen_notification table
        │
        ▼
Admin sees report in their dashboard (via civic_report)
```

### 3. ADMIN FORWARDS TO RESPONDER (Will work when Admin portal is ready)

```
Admin forwards report
        │
        ▼
forwarded_complaint table created:
  - report_id (from civic_report)
  - dept_id (department ID)
  - submit_status = true
  - dept_decision = NULL (pending)
        │
        ▼
Responder sees new task
```

### 4. RESPONDER TASK FLOW (CRITICAL — Fix This)

```
Step 1: Responder views PENDING tasks
        │
        ▼
GET /api/responder/tasks?status=PENDING
        │
        ▼
Query: SELECT * FROM forwarded_complaint 
       WHERE dept_id = (responder's department)
       AND dept_decision IS NULL

Step 2: Responder ACCEPTS task
        │
        ▼
POST /api/responder/tasks/{id}/accept
        │
        ▼
Update forwarded_complaint:
  - dept_username = responder username
  - read_by_dept = true
  - dept_decision = 'D'
  - remarks = 'Task accepted'

Step 3: Responder REJECTS task
        │
        ▼
POST /api/responder/tasks/{id}/reject
        │
        ▼
Update forwarded_complaint:
  - dept_username = responder username
  - read_by_dept = true
  - dept_decision = 'R'
  - remarks = rejection reason

Step 4: Responder assigns to VOLUNTEER
        │
        ▼
PUT /api/responder/tasks/{id}/assign-volunteer
        │
        ▼
Update forwarded_complaint:
  - assigned_to_worker = true
  - assigned_worker_date = NOW()
  - worker_username = volunteer username
  - remarks = 'Assigned to ' + volunteer name

Step 5: Volunteer completes (Volunteer portal)
        │
        ▼
forward_decision table gets evidence

Step 6: Responder confirms completion
        │
        ▼
PUT /api/responder/tasks/{id}/confirm-complete
        │
        ▼
Update forwarded_complaint:
  - worker_decision = 'D'
  - accepted_by_worker = true
  - accepted_date = NOW()
  - remarks = 'Task completed'

Step 7: Task appears in HISTORY
        │
        ▼
GET /api/responder/task-history
        │
        ▼
Query: SELECT * FROM forwarded_complaint
       WHERE dept_id = (responder's department)
       AND (worker_decision = 'D' OR dept_decision = 'R')
```

### 5. VOLUNTEER MANAGEMENT FLOW

```
Step 1: Responder views volunteers
        │
        ▼
GET /api/responder/workers
        │
        ▼
Query: SELECT * FROM volunteer_worker 
       WHERE dept_id = (responder's department)
       AND active = true

Step 2: Responder adds volunteer
        │
        ▼
POST /api/responder/workers
        │
        ▼
Insert into volunteer_worker:
  - username_created (unique)
  - name
  - phone_number
  - dept_id = responder's department
  - active = true
  - created_date = NOW()

Step 3: Responder removes volunteer
        │
        ▼
DELETE /api/responder/workers/{username}
        │
        ▼
Update volunteer_worker SET active = false
```

---

## 🔧 WHAT NEEDS TO BE FIXED

### 1. Fix ForwardedComplaint Entity

**Problem:** Some fields may be missing or incorrectly mapped

**Check these fields exist in `ForwardedComplaint.java`:**

```java
// Required fields for task tracking
private Long forwardedComplainId;
private Long reportId;
private Long deptId;
private String deptUsername;  // ← FK to admin_user.username
private Boolean submitStatus;
private LocalDate submitDate;
private LocalTime submitTime;
private Boolean readByDept;
private LocalDate readByDeptDate;
private LocalTime readByDeptTime;
private String deptDecision;  // 'D' or 'R' or NULL
private Boolean assignedToWorker;
private LocalDate assignedWorkerDate;
private LocalTime assignedWorkerTime;
private String workerUsername;  // ← FK to volunteer_worker.username_created
private Boolean acceptedByWorker;
private LocalDate acceptedDate;
private LocalTime acceptedTime;
private String workerDecision;  // 'D' or NULL
private String remarks;
```

### 2. Fix TaskController.java

**Problem:** Methods may not update correct fields or use wrong queries

**Required endpoints:**

| Endpoint | Method | Action |
|----------|--------|--------|
| `/api/responder/tasks` | GET | Get tasks by department |
| `/api/responder/tasks/{id}/accept` | POST | Update dept_decision='D' |
| `/api/responder/tasks/{id}/reject` | POST | Update dept_decision='R' |
| `/api/responder/tasks/{id}/assign-volunteer` | PUT | Update assigned_to_worker=true, worker_username |
| `/api/responder/tasks/{id}/confirm-complete` | PUT | Update worker_decision='D' |
| `/api/responder/task-history` | GET | Get completed/rejected tasks |
| `/api/responder/workers` | GET | Get volunteers by department |
| `/api/responder/workers` | POST | Add volunteer |
| `/api/responder/workers/{username}` | DELETE | Remove volunteer |

### 3. Fix TaskService.java

**Required logic:**

```java
// Get responder's department from logged-in user
String username = SecurityContextHolder.getContext().getAuthentication().getName();
AdminUser responder = adminUserRepository.findByUsername(username);
Long deptId = responder.getDepartment().getDeptId();

// For PENDING tasks
List<ForwardedComplaint> pendingTasks = forwardedComplaintRepository
    .findByDeptIdAndDeptDecisionIsNull(deptId);

// For ACTIVE tasks (accepted but not completed)
List<ForwardedComplaint> activeTasks = forwardedComplaintRepository
    .findByDeptIdAndDeptDecisionAndWorkerDecision(deptId, "D", null);

// For HISTORY (completed or rejected)
List<ForwardedComplaint> history = forwardedComplaintRepository
    .findByDeptIdAndWorkerDecisionOrDeptDecision(deptId, "D", "R");
```

### 4. Fix WorkerService.java

```java
// Get responder's department
String username = SecurityContextHolder.getContext().getAuthentication().getName();
AdminUser responder = adminUserRepository.findByUsername(username);
Long deptId = responder.getDepartment().getDeptId();

// Get volunteers under this department only
List<VolunteerWorkerCreator> volunteers = volunteerWorkerRepository
    .findByDeptIdAndActiveTrue(deptId);
```

### 5. Fix ReportService.java (Citizen)

```java
// Submit report
CivicReport report = new CivicReport();
report.setCitizenId(citizenId);
report.setDetail(request.getDescription());
report.setNatureId(getNatureIdFromType(request.getType()));
report.setProvince(request.getProvince());
report.setDistrict(request.getDistrict());
report.setTown(request.getTown());
report.setArea(request.getArea());
report.setCity(request.getCity());
report.setEvidence(request.getMediaPath());
civicReportRepository.save(report);
```

---

## 📋 FRONTEND API CONNECTIONS (api.js)

### Citizen API Methods Needed:

```javascript
export const citizenApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register/citizen', data),
  myReports: () => api.get('/citizen/my-reports'),
  createReport: (payload) => api.post('/citizen/reports', payload),
  getProfile: () => api.get('/citizen/profile'),
  updateProfile: (payload) => api.put('/citizen/profile', payload),
  savedLocations: () => api.get('/citizen/saved-locations'),
  addLocation: (payload) => api.post('/citizen/saved-locations', payload),
  deleteLocation: (id) => api.delete(`/citizen/saved-locations/${id}`),
  notifications: () => api.get('/citizen/notifications'),
  markRead: (id) => api.put(`/citizen/notifications/${id}/read`),
  helpDeskMessages: () => api.get('/citizen/helpdesk'),
  sendMessage: (message) => api.post('/citizen/helpdesk', { message }),
};
```

### Responder API Methods Needed:

```javascript
export const responderApi = {
  tasks: (status) => api.get('/responder/tasks', { params: { status } }),
  accept: (id) => api.post(`/responder/tasks/${id}/accept`),
  reject: (id, reason) => api.post(`/responder/tasks/${id}/reject`, { reason }),
  assignToVolunteer: (id, volunteerUsername) => api.put(`/responder/tasks/${id}/assign-volunteer`, { volunteerUsername }),
  confirmComplete: (id, remarks) => api.put(`/responder/tasks/${id}/confirm-complete`, { remarks }),
  taskHistory: () => api.get('/responder/task-history'),
  workers: () => api.get('/responder/workers'),
  addWorker: (payload) => api.post('/responder/workers', payload),
  removeWorker: (username) => api.delete(`/responder/workers/${username}`),
  performance: () => api.get('/responder/performance'),
  notifications: () => api.get('/responder/notifications'),
  helpDeskMessages: () => api.get('/responder/helpdesk'),
  sendMessage: (message) => api.post('/responder/helpdesk', { message }),
  getProfile: () => api.get('/responder/profile'),
  updateProfile: (payload) => api.put('/responder/profile', payload),
};
```

---

## 📁 PROJECT STRUCTURE (For Reference)

```
backend/src/main/java/nexora_backend/
│
├── citizen/                      ← CAN MODIFY
│   ├── controller/
│   │   ├── ReportController.java
│   │   ├── ProfileController.java
│   │   └── SavedLocationController.java
│   ├── service/
│   │   ├── ReportService.java
│   │   ├── ProfileService.java
│   │   └── SavedLocationService.java
│   ├── builder/
│   │   └── IncidentReportBuilder.java  ← Builder Pattern
│   └── entity/                    ← Independent citizen entities
│
├── responder/                    ← CAN MODIFY
│   ├── controller/
│   │   ├── TaskController.java
│   │   ├── WorkerController.java
│   │   └── ForwardDecisionController.java
│   ├── service/
│   │   ├── TaskService.java
│   │   ├── WorkerService.java
│   │   └── PerformanceService.java
│   └── entity/                    ← Responder entities
│
├── database/                     ← DO NOT CHANGE SCHEMA
│   └── entity/
│       ├── AdminUser.java
│       ├── RegisterCitizen.java
│       ├── ForwardedComplaint.java
│       ├── ForwardDecision.java
│       ├── VolunteerWorkerCreator.java
│       ├── CivicReport.java
│       ├── Department.java
│       └── ... (other entities)
│
├── independent/                  ← CAN MODIFY
│   └── entity/
│       ├── CitizenNotification.java
│       ├── CitizenSavedLocation.java
│       ├── ResponderNotification.java
│       ├── ResponderPerformance.java
│       └── ResponderTaskHistory.java
│
└── shared/                       ← CAN MODIFY
    ├── config/
    │   └── SecurityConfig.java
    └── util/
        └── RequestContext.java
```

---

## 🎯 YOUR TASKS (Priority Order)

### Priority 1: Fix Database Connection

1. Check if all required tables exist
2. Insert sample data if tables are empty
3. Ensure foreign key relationships are correct

### Priority 2: Fix Responder Task Flow

1. Fix `TaskController.java` endpoints
2. Fix `TaskService.java` business logic
3. Ensure department-based filtering works
4. Test accept/reject/assign/confirm flows

### Priority 3: Fix Responder Worker Management

1. Fix `WorkerController.java` endpoints
2. Fix `WorkerService.java` to filter by department
3. Test add/remove volunteer

### Priority 4: Fix Citizen Report Flow

1. Fix `ReportController.java` endpoints
2. Fix `ReportService.java` to save to `civic_report`
3. Ensure Builder Pattern works with method chaining

### Priority 5: Add Sample Data

If tables are empty, insert sample data:

```sql
-- Insert sample department
INSERT INTO department (dept_id, dept_name, responder_type_category, dept_address, active) 
VALUES (1, 'K-Electric', 'GOV', 'Korangi, Karachi', true);

-- Insert sample responder
INSERT INTO admin_user (username, name, user_type_id, contact_number, active, password, category, dept_id) 
VALUES ('kelectric_fp', 'Ahmed Raza', 3, '0300-1111111', true, 'password123', 'GOV', 1);

-- Insert sample citizen
INSERT INTO register_citizen (id, fname, phone_num, address, city, password) 
VALUES (1, 'Ali Raza', '0300-1234567', 'Korangi-2, Karachi', 'Karachi', 'password123');

-- Insert sample civic report
INSERT INTO civic_report (civic_id, citizen_id, detail, type_id, nature_id, city) 
VALUES (1001, 1, 'No electricity for 6 hours', 2, 7, 'Karachi');

-- Insert sample forwarded complaint
INSERT INTO forwarded_complaint (forwarded_complain_id, report_id, dept_id, submit_status, submit_date, dept_decision) 
VALUES (101, 1001, 1, true, CURRENT_DATE, NULL);

-- Insert sample volunteer
INSERT INTO volunteer_worker (username_created, name, phone_number, dept_id, active) 
VALUES ('volunteer_ali', 'Ali Raza', '0310-1111111', 1, true);
```

---

## ✅ SUCCESS CRITERIA

- [ ] Citizen can register → saved to `register_citizen`
- [ ] Citizen can login → JWT token generated
- [ ] Citizen can submit report → saved to `civic_report`
- [ ] Citizen can see my reports → data from `civic_report`
- [ ] Citizen can save locations → saved to `citizen_saved_location`
- [ ] Citizen gets notifications → from `citizen_notification`
- [ ] Responder can login → JWT token generated
- [ ] Responder sees PENDING tasks → from `forwarded_complaint` (dept_decision IS NULL)
- [ ] Responder can ACCEPT task → updates `dept_decision='D'`
- [ ] Responder can REJECT task → updates `dept_decision='R'`
- [ ] Responder can assign volunteer → updates `assigned_to_worker=true`, `worker_username`
- [ ] Responder can confirm completion → updates `worker_decision='D'`
- [ ] Responder sees HISTORY → tasks with `worker_decision='D'` or `dept_decision='R'`
- [ ] Responder can manage volunteers → from `volunteer_worker` filtered by department
- [ ] Responder sees performance → from `responder_performance`
- [ ] All data from DATABASE (no mock data)
- [ ] NO ERRORS in frontend or backend

---

## 🚨 REMEMBER

1. **DO NOT DELETE ANYTHING**
2. **DO NOT CHANGE UI**
3. **DO NOT CHANGE AUTHENTICATION** (It's not in this folder anyway)
4. **IGNORE NGO** — Just let it be, don't use it
5. **TEST AFTER EVERY CHANGE**

---

**Fix my Citizen and Responder portal. Make everything work. No errors.** 🔥
```

## 🔥 FIRST COMMAND TO EXECUTE

Before doing anything else:

1. Run full project scan
2. Identify:
   - missing beans
   - broken repositories
   - mismatched DTOs
   - null foreign keys
3. Output a "FIX PLAN" before changing code

summary:


### 🚀 Project Flow Rules
- **Database schema**: Do not change existing schema. Only independent folder schema change is allowed.  
- **UI**: Must remain unchanged.  
- **Code modifications**: Cursor should not modify existing code unless strictly necessary for logic correctness.  
- **New files**: Allowed only inside `citizen/` and `responder/` folders.  

---

### 👤 Citizen Module
- Implement services like `ProfileService`, `ReportService`, `SavedLocationService`.  
- Use repositories (`RegisterCitizenRepository`, `CitizenReportRepository`, etc.) for persistence.  
- Ensure Lombok annotations (`@Getter`, `@Setter`, `@Builder`) generate required methods.  
- Exception handling must use `BusinessException`.  
- Example flow:  
  - `ProfileService.getProfile()` → fetch citizen by ID → return map of profile fields.  
  - `ProfileService.updateProfile()` → update fields only if request values are non-null → save entity.  

---

### 🧑‍🚒 Responder Module
- Implement services like `TaskService`, `PerformanceService`.  
- Use repositories (`AdminUserRepository`, `ForwardedComplaintRepository`) for persistence.  
- Ensure volunteer/worker assignment logic is correct (e.g. `setWorkerDecision`, `setAssignedToWorker`).  
- Builder methods (`TaskResponse.builder()`, `PerformanceResponse.builder()`) must be used consistently.  

---

### 🔗 Integration Flow
- Citizen reports → saved in DB via `ReportService`.  
- Complaints forwarded → handled by `TaskService`.  
- Volunteer assignment → `VolunteerWorkerCreator` entity used.  
- Ensure naming conventions: camelCase in Java, snake_case in DB.  

---

### ⚠️ Constraints for Cursor
- **Do not modify UI files.**  
- **Do not change database schema.**  
- **Do not refactor existing code unnecessarily.**  
- **Only fix logic errors if required.**  
- **New files can be added only in `citizen/` and `responder/` folders.**  

---
