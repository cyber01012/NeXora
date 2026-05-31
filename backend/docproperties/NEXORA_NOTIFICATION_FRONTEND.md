# NeXora – Notification System: Frontend Implementation Guide
> AI Agent Instructions — React + Vite + TailwindCSS + Framer Motion

---

## 1. Read Project Structure First

Scan:

frontend/

Read:

- package.json
- tailwind config
- src structure
- components
- services
- contexts
- index.css



---

## 2. Project Context

NeXora is an intelligent civic issue and emergency response platform.

Current implementation supports:

- Civic Reports
- SOS Reports
- Report Assignment
- Task Management
- Notifications
- Report Tracking

Advanced Disaster Mode is NOT implemented.

---

## 3. Architecture Rules

NeXora follows a reusable module-based architecture.

Do NOT build:

- ResponderNotificationPage
- NGONotificationPage
- WorkerNotificationPage

Create ONE reusable notification module.

Must work for:

- Citizen
- Help Desk
- Assigning Officer
- Responder
- NGO
- Worker
- Volunteer
- Admin

Only permissions and data differ.

---

## 4. Design System Requirements

The project already contains a design system.

Use ONLY existing variables and utilities.

Required variables:

```css
var(--primary-glow)
var(--bg-dark)
var(--bg-light)
var(--color-hud-bg)
```

Required utility classes:

```css
border-hud
hud-glass
text-glow-primary
font-title
font-data
font-mono
```

Do not hardcode primary theme colors.

---

## 5. Disaster Mode Compatibility

The project contains:

```css
body.disaster-mode
```

Do NOT implement Disaster Mode.

Do NOT implement disaster detection.

Simply ensure all notification components use CSS variables so future theme switching works automatically.

---

## 6. Components To Build

### NotificationBell

Features:

- Bell icon
- Unread badge
- Opens dropdown
- Poll count endpoint every 20 seconds
- Immediate fetch on mount

---

### NotificationDropdown

Features:

- SIGNAL FEED header
- Mark All Read button
- Scrollable notification list
- Empty state
- Loading state

Fetch unread notifications on open.

Close on outside click.

---

### NotificationItem

Features:

- Severity indicator
- Message
- Relative timestamp
- Read state

Clicking:

- mark read
- refresh state

---

### NotificationToast

Features:

- Slide in animation
- Auto dismiss after 4 seconds
- Max 3 visible
- Click to mark read

Navigation:

```js
// TODO: implement navigation
```

---

## 7. Severity Mapping

Critical:

- SOS_SUBMITTED
- TASK_DISPOSED
- TASK_REJECTED
- DISASTER_MODE_ACTIVATED
Action Required:

- REPORT_ASSIGNED
- TASK_ASSIGNED
- REPORT_REJECTED_BY_DEPT

Information:

- REPORT_COMPLETED
- ACCOUNT_CREATED
- PASSWORD_RESET
- REPORT_STATUS_UPDATED

Use existing project colors if available.

Otherwise:

Critical → Red

Action Required → Amber

Information → Primary Glow

---

## 8. Notification Service

Create:

services/notificationService.js

Methods:

```javascript
getAll(userId)

getUnread(userId)

getCount(userId)

markRead(id)

markAllRead(userId)
```

Match existing API architecture.

Use axios if project already uses axios.

---

## 9. Notification Context

Provide:

```javascript
{
  unreadCount,
  notifications,
  loading,
  fetchUnread,
  markRead,
  markAllRead,
  addToast
}
```

Polling lives here.

Poll every 20 seconds.

If count increases:

- fetch unread
- trigger toast

Get user from existing auth context.

Fallback:

```javascript
localStorage.getItem("nexora_user")
```

Add TODO comment.

---

## 10. File Structure

src/

components/
notifications/
NotificationBell.jsx
NotificationDropdown.jsx
NotificationItem.jsx
NotificationToast.jsx
ToastContainer.jsx

context/
NotificationContext.jsx

services/
notificationService.js

---

## 11. Integration

Add:

```jsx
<NotificationBell />
```

to navbar.

Wrap app:

```jsx
<NotificationProvider>
```

Add:

```jsx
<ToastContainer />
```

at root layout.

---

## 12. Mock Testing

Create:

notificationService.mock.js

Use:

```javascript
[
 {
  id:1,
  type:"SOS_SUBMITTED",
  message:"New SOS report received - Road accident reported near Shahrah-e-Faisal",
  isRead:false
 },
 {
  id:2,
  type:"REPORT_ASSIGNED",
  message:"Report #204 assigned to Fire Brigade department"
 },
 {
  id: 5,
  type: "DISASTER_MODE_ACTIVATED",
  message: "Disaster Mode Activated - 5 flood-related reports detected within Gulshan-e-Iqbal during the last 30 minutes.",
  isRead: false,
  createdAt: new Date().toISOString()
}
]
```

Add:

```javascript
const USE_MOCK = true;
```

inside context.

---

## 13. Constraints

- Do not install new packages.
- Use existing design system.
- Use existing theme variables.
- Fail silently if backend unavailable.
- No localStorage caching.
- Use React state only.
- Compute relative timestamps manually.
- Keep components reusable.
- Ensure future Disaster Mode compatibility.