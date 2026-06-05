# 🚨 CRITICAL INSTRUCTION FOR ANTIGRAVITY AI

## PROJECT OVERVIEW

**NeXora** is a disaster and civic management system. You need to fix **Citizen Portal** and **Responder Portal** to work correctly with backend + frontend + database.

**Current Issues:**
1. Sidebar logic is wrong — Citizen sidebar showing Responder pages
2. Responder portal not working properly
3. Notifications not working
4. Data flow broken

---

## 🎯 YOUR TASK

**Fix Citizen and Responder portals completely. Make everything work with real database data.**

---

## 📁 FILE STRUCTURE

```
frontend/src/
├── layouts/
│   ├── CitizenLayout.jsx      ← Citizen sidebar (ONLY citizen links)
│   └── ResponderLayout.jsx    ← Responder sidebar (ONLY responder links)
├── pages/
│   ├── citizen/
│   │   ├── CitizenDashboard.jsx
│   │   ├── CitizenReportForm.jsx
│   │   ├── CitizenReports.jsx
│   │   ├── CitizenLiveMap.jsx
│   │   ├── CitizenSavedLocations.jsx
│   │   ├── CitizenNotifications.jsx
│   │   ├── CitizenHelpDesk.jsx
│   │   ├── CitizenProfile.jsx
│   │   └── CitizenStats.jsx
│   └── responder/
│       ├── ResponderDashboard.jsx
│       ├── ResponderTasks.jsx
│       ├── ResponderWorkers.jsx
│       ├── ResponderTaskHistory.jsx
│       ├── ResponderLiveMap.jsx
│       ├── ResponderFieldReports.jsx
│       ├── ResponderNotifications.jsx
│       ├── ResponderHelpDesk.jsx
│       ├── ResponderProfile.jsx
│       └── ResponderPerformance.jsx
├── routes/
│   └── PortalRoutes.jsx       ← Route definitions
└── services/
    └── api.js                 ← API calls
```

---

## 🔴 PROBLEM 1: SIDEBAR LOGIC IS WRONG

### Citizen Sidebar (CitizenLayout.jsx) — ONLY these links:

```jsx
const navItems = [
  { to: '/citizen', label: 'DASHBOARD', icon: '▣' },
  { to: '/citizen/report', label: 'REPORT ISSUE', icon: '📝' },
  { to: '/citizen/reports', label: 'MY REPORTS', icon: '📋' },
  { to: '/citizen/map', label: 'LIVE MAP', icon: '🗺️' },
  { to: '/citizen/locations', label: 'SAVED LOCATIONS', icon: '📍' },
  { to: '/citizen/notifications', label: 'NOTIFICATIONS', icon: '🔔' },
  { to: '/citizen/helpdesk', label: 'HELP DESK', icon: '💬' },
  { to: '/citizen/profile', label: 'PROFILE', icon: '👤' },
  { to: '/citizen/stats', label: 'MY STATS', icon: '📊' },
  { to: '/citizen/faq', label: 'FAQ', icon: '❓' },
];
```

**❌ DO NOT include responder links in citizen sidebar!**

### Responder Sidebar (ResponderLayout.jsx) — ONLY these links:

```jsx
const navItems = [
  { to: '/responder', label: 'DASHBOARD', icon: '▣' },
  { to: '/responder/tasks', label: 'TASKS', icon: '📋' },
  { to: '/responder/workers', label: 'WORKERS', icon: '👥' },
  { to: '/responder/history', label: 'TASK HISTORY', icon: '📜' },
  { to: '/responder/map', label: 'LIVE MAP', icon: '🗺️' },
  { to: '/responder/fieldreports', label: 'FIELD REPORTS', icon: '📝' },
  { to: '/responder/notifications', label: 'NOTIFICATIONS', icon: '🔔' },
  { to: '/responder/helpdesk', label: 'HELP DESK', icon: '💬' },
  { to: '/responder/performance', label: 'PERFORMANCE', icon: '📈' },
  { to: '/responder/profile', label: 'PROFILE', icon: '👤' },
  { to: '/responder/faq', label: 'FAQ', icon: '❓' },
];
```

---

## 🔴 PROBLEM 2: ROUTES ARE MIXED UP

### PortalRoutes.jsx — MUST separate citizen and responder routes:

```jsx
// Citizen Routes (UNDER CitizenLayout)
<Route path="/citizen" element={<CitizenLayout />}>
  <Route index element={<CitizenDashboard />} />
  <Route path="report" element={<CitizenReportForm />} />
  <Route path="reports" element={<CitizenReports />} />
  <Route path="map" element={<CitizenLiveMap />} />
  <Route path="locations" element={<CitizenSavedLocations />} />
  <Route path="notifications" element={<CitizenNotifications />} />
  <Route path="helpdesk" element={<CitizenHelpDesk />} />
  <Route path="profile" element={<CitizenProfile />} />
  <Route path="stats" element={<CitizenStats />} />
  <Route path="faq" element={<CitizenFAQ />} />
</Route>

// Responder Routes (UNDER ResponderLayout)
<Route path="/responder" element={<ResponderLayout />}>
  <Route index element={<ResponderDashboard />} />
  <Route path="tasks" element={<ResponderTasks />} />
  <Route path="workers" element={<ResponderWorkers />} />
  <Route path="history" element={<ResponderTaskHistory />} />
  <Route path="map" element={<ResponderLiveMap />} />
  <Route path="fieldreports" element={<ResponderFieldReports />} />
  <Route path="notifications" element={<ResponderNotifications />} />
  <Route path="helpdesk" element={<ResponderHelpDesk />} />
  <Route path="performance" element={<ResponderPerformance />} />
  <Route path="profile" element={<ResponderProfile />} />
  <Route path="faq" element={<ResponderFAQ />} />
</Route>
```

---

## 🔴 PROBLEM 3: RESPONDER FLOW — EXPLANATION FOR AI

### What is Responder Portal?

Responder is a **department focal person** (e.g., K-Electric representative). They:
1. Receive tasks forwarded by Admin
2. Accept or reject tasks
3. Assign tasks to volunteers from their department
4. Review evidence submitted by volunteers
5. Confirm task completion

### Responder Database Tables

| Table | Purpose |
|-------|---------|
| `admin_user` | Responder login (username, password, dept_id) |
| `forwarded_complaint` | Tasks assigned to responder |
| `volunteer_worker` | Volunteers under this responder's department |
| `forward_decision` | Evidence submitted by volunteers |
| `responder_performance` | Department performance metrics |

### Responder Task Status Flow

```
PENDING → ACCEPTED → WITH_VOLUNTEER → AWAITING_REVIEW → COMPLETED
   │          │              │               │              │
   │          │              │               │              └── Done
   │          │              │               └── Volunteer completed, waiting for confirmation
   │          │              └── Assigned to volunteer
   │          └── Responder accepted
   └── Awaiting responder action
```

### Responder API Endpoints Needed

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/responder/tasks` | GET | Get tasks (filter by status) |
| `/api/responder/tasks/{id}/accept` | POST | Accept task → deptDecision='D' |
| `/api/responder/tasks/{id}/reject` | POST | Reject task → deptDecision='R' |
| `/api/responder/tasks/{id}/assign-volunteer` | PUT | Assign to volunteer → assignedToWorker=true |
| `/api/responder/tasks/{id}/confirm-complete` | PUT | Confirm completion → workerDecision='D' |
| `/api/responder/task-history` | GET | Get completed/rejected tasks |
| `/api/responder/workers` | GET | Get volunteers under department |
| `/api/responder/workers` | POST | Add volunteer |
| `/api/responder/workers/{username}` | DELETE | Remove volunteer |
| `/api/responder/performance` | GET | Get department performance |
| `/api/responder/field-reports` | GET | Get evidence from forward_decision |

### Responder Task Status Logic in Frontend

```javascript
// In ResponderTasks.jsx — Filter tasks based on status
const getTaskStatus = (task) => {
  if (task.workerDecision === 'D') return 'COMPLETED';
  if (task.deptDecision === 'R') return 'REJECTED';
  if (task.assignedToWorker === true) return 'WITH_VOLUNTEER';
  if (task.deptDecision === 'D') return 'ACCEPTED';
  return 'PENDING';
};

// Tabs for tasks page
const tabs = [
  { key: 'PENDING', label: 'PENDING', filter: (t) => getTaskStatus(t) === 'PENDING' },
  { key: 'ACTIVE', label: 'ACTIVE', filter: (t) => getTaskStatus(t) === 'ACCEPTED' || getTaskStatus(t) === 'WITH_VOLUNTEER' },
  { key: 'HISTORY', label: 'HISTORY', filter: (t) => getTaskStatus(t) === 'COMPLETED' || getTaskStatus(t) === 'REJECTED' },
];
```

### Responder Worker Logic

```javascript
// In ResponderWorkers.jsx — Only show volunteers from responder's department
// API should return volunteers filtered by dept_id = responder.department.id

// Add volunteer
const addWorker = async (workerData) => {
  // Save to volunteer_worker table with dept_id = responder.department.id
  await responderApi.addWorker(workerData);
};

// Remove volunteer (soft delete — set active = false)
const removeWorker = async (username) => {
  await responderApi.removeWorker(username);
};
```

---

## 🔴 PROBLEM 4: CITIZEN FLOW — EXPLANATION FOR AI

### What is Citizen Portal?

Citizen can:
1. Register using phone number
2. Submit civic reports (electricity, gas, road, water issues)
3. Track report status
4. Save frequent locations
5. Receive notifications
6. Chat with help desk

### Citizen Database Tables

| Table | Purpose |
|-------|---------|
| `register_citizen` | Citizen accounts (login by phone_num) |
| `civic_report` | Submitted reports |
| `citizen_saved_location` | Saved addresses |
| `citizen_notification` | Notifications |

### Citizen API Endpoints Needed

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/citizen/register` | POST | Register new citizen |
| `/api/citizen/reports` | POST | Submit report → saves to civic_report |
| `/api/citizen/my-reports` | GET | Get citizen's reports |
| `/api/citizen/profile` | GET/PUT | Get/Update profile |
| `/api/citizen/saved-locations` | GET/POST/DELETE | Manage saved locations |
| `/api/citizen/notifications` | GET | Get notifications |
| `/api/citizen/notifications/{id}/read` | PUT | Mark notification read |
| `/api/citizen/helpdesk` | GET/POST | Chat messages |

### Citizen Report Form — Builder Pattern

```javascript
// IncidentReportBuilder.js — MUST use method chaining
const report = new IncidentReportBuilder()
  .setType('ELECTRICITY')
  .setDescription('No power for 6 hours')
  .setLocation('Korangi-2, Karachi')
  .setLatitude(24.8607)
  .setLongitude(67.0011)
  .setEvidence('image.jpg')
  .build();
```

---

## 🔴 PROBLEM 5: NOTIFICATIONS

### Citizen Notifications (CitizenNotifications.jsx)

Fetch from `citizen_notification` table:

```javascript
const loadNotifications = async () => {
  const data = await citizenApi.notifications();
  setNotifications(data);
};

const markAsRead = async (id) => {
  await citizenApi.markRead(id);
  // Update local state
};
```

### Responder Notifications (ResponderNotifications.jsx)

Fetch from `responder_notification` table:

```javascript
const loadNotifications = async () => {
  const data = await responderApi.notifications();
  setNotifications(data);
};
```

---

## 📋 WHAT TO FIX — CHECKLIST

### Frontend Fixes:

- [ ] CitizenLayout.jsx — Remove responder links, keep only citizen links
- [ ] ResponderLayout.jsx — Remove citizen links, keep only responder links
- [ ] PortalRoutes.jsx — Separate citizen and responder routes properly
- [ ] ResponderTasks.jsx — Fix task status logic, add accept/reject/assign/confirm buttons
- [ ] ResponderWorkers.jsx — Fix add/remove volunteer with department filtering
- [ ] ResponderFieldReports.jsx — Fetch from forward_decision table
- [ ] ResponderPerformance.jsx — Fetch from responder_performance table
- [ ] CitizenNotifications.jsx — Fetch from citizen_notification table
- [ ] ResponderNotifications.jsx — Fetch from responder_notification table
- [ ] api.js — Ensure all API methods are correct

### Backend Fixes (if needed):

- [ ] TaskController.java — Fix accept/reject/assign/confirm endpoints
- [ ] TaskService.java — Fix department-based filtering
- [ ] WorkerService.java — Fix volunteer management with department filtering
- [ ] ReportService.java — Fix report submission to civic_report
- [ ] ForwardDecisionController.java — Fix evidence fetching

### Database Fixes (if needed):

- [ ] Insert sample data if tables empty
- [ ] Ensure foreign keys are correct

---

## ✅ FINAL REQUIREMENTS

1. **Citizen Sidebar ONLY shows citizen pages**
2. **Responder Sidebar ONLY shows responder pages**
3. **Routes are completely separate**
4. **Responder sees tasks only from their department (responder_type) table**
5. **Responder sees volunteers only from their department**
6. **All data comes from DATABASE (no mock data)**
7. **Notifications work for both portals**
8. **Builder Pattern works with method chaining**
9. **No errors in console**
10. **Frontend + Backend + Database all work together**

---

## 🚀 START FIXING

**Focus on:**
1. Sidebar logic first
2. Routes second
3. Responder task flow third
4. Notifications fourth
5. Everything else

**Make it work. No excuses.** 🔥