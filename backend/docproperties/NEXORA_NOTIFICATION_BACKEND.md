# NeXora – Notification System: Backend Implementation Guide
> AI Agent Instructions — Spring Boot Backend

---

## 1. First: Read the Project Structure

Before writing any code, scan the entire backend directory:

backend/

Look for and read:

- The main @SpringBootApplication entry class
- All existing entity classes (@Entity)
- All existing enums
- application.properties / application.yml
- pom.xml
- Existing repositories, services, and controllers

Do not delete or modify existing code unless required for integration.

---

## 2. Project Context

NeXora is an intelligent civic issue and emergency response management platform.

Current implementation includes:

- Civic Reports
- SOS Reports
- Report Assignment
- Task Management
- Notifications
- Report Tracking
- Role-Based Workflows

Advanced Disaster Mode, Incident Grouping, Disaster Events, Resource Allocation Systems, and AI-based Disaster Activation are future enhancements and are NOT part of the current implementation.

### System Roles

#### Citizen

- Submit civic reports
- Submit SOS reports
- Track report progress
- View report history

#### Help Desk

- Review incoming reports
- Verify reports
- Handle SOS submissions
- Forward reports to Assigning Officers

#### Assigning Officer

- Create departments
- Assign reports to departments
- Reassign reports
- Track department progress

#### Responder

Government emergency department.

Examples:
- Fire Brigade
- Rescue Services
- Medical Emergency Units

Responsibilities:

- Receive assigned reports
- Accept/reject reports
- Create Workers
- Assign tasks to Workers
- Verify completion
- Close reports

#### NGO

Relief and aid organization.

Responsibilities:

- Receive assigned reports
- Accept/reject reports
- Create Volunteers
- Assign tasks to Volunteers
- Verify completion
- Close reports

#### Worker

Field staff under Responders.

Responsibilities:

- Accept/reject tasks
- Mark work in progress
- Upload evidence
- Complete tasks

#### Volunteer

Field staff under NGOs.

Responsibilities:

- Accept/reject tasks
- Mark work in progress
- Upload evidence
- Complete tasks

#### Admin

- Create users
- Full report oversight
- Heatmap monitoring
- Dashboard analytics

---

## Workflow

Citizen
→ Help Desk
→ Assigning Officer
→ Responder → Worker

OR

Citizen
→ Help Desk
→ Assigning Officer
→ NGO → Volunteer

→ Completion Verification
→ Closed

---

## Current Project State

The User Management module is not yet fully implemented.

Notifications should store:

- recipientId
- recipientRole

as primitive fields.

Do NOT create JPA relationships to User entities.

Future versions may replace these fields with proper User references.

---

## 3. Architectural Rules

NeXora follows a modular architecture.

Do not build role-specific notification systems.

The same notification infrastructure must work for:

- Citizen
- Help Desk
- Assigning Officer
- Responder
- NGO
- Worker
- Volunteer
- Admin

Only data and permissions change.

---

## 4. Design Patterns

### Observer Pattern

Use Spring ApplicationEvent + ApplicationEventPublisher.

Requirements:

- Create custom ApplicationEvent classes
- Publish events from service layer
- Listen using @EventListener

### Command Pattern

Create NotificationCommand.

Required fields:

```java
Long recipientId;
String recipientRole;
NotificationType type;
NotificationChannel channel;
String referenceType;
Long referenceId;
String message;
```

NotificationService executes commands.

---

## 5. Notification Events

| Event | Triggered When | Notify |
|---------|---------|---------|
| ReportSubmittedEvent | Citizen submits report | Help Desk |
| SosSubmittedEvent | Citizen submits SOS | Help Desk |
| ReportVerifiedEvent | Help Desk verifies report | Assigning Officer |
| ReportAssignedEvent | Assigning Officer assigns report | Responder or NGO |
| TaskAssignedEvent | Responder assigns Worker OR NGO assigns Volunteer | Worker or Volunteer |
| TaskAcceptedEvent | Worker/Volunteer accepts task | Responder or NGO |
| TaskDisposedEvent | Worker/Volunteer submits completion evidence | Responder or NGO |
| TaskRejectedEvent | Worker/Volunteer rejects task | Responder or NGO |
| ReportCompletedEvent | Responder/NGO verifies completion | Citizen |
| ReportRejectedByDeptEvent | Department rejects report | Assigning Officer |
| AccountCreatedEvent | Admin creates account | User |
| PasswordResetEvent | Password reset | User |

---

## 6. Notification Entity

Create Notification entity.

```java
Long id;

Long recipientId;

String recipientRole;

String type;

String channel;

String referenceType;

Long referenceId;

String message;

boolean isRead;

LocalDateTime createdAt;

LocalDateTime readAt;
```

---

## NotificationType Enum

Required values:

```java
REPORT_SUBMITTED,
SOS_SUBMITTED,
REPORT_VERIFIED,
REPORT_ASSIGNED,
TASK_ASSIGNED,
TASK_ACCEPTED,
TASK_DISPOSED,
TASK_REJECTED,
REPORT_COMPLETED,
REPORT_REJECTED_BY_DEPT,
ACCOUNT_CREATED,
PASSWORD_RESET,
DISASTER_MODE_ACTIVATED,
REPORT_STATUS_UPDATED
```

---

## NotificationChannel Enum

```java
IN_APP,
EMAIL
```

---

## 7. Repository

```java
List<Notification> findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(Long recipientId);

List<Notification> findByRecipientIdOrderByCreatedAtDesc(Long recipientId);

long countByRecipientIdAndIsReadFalse(Long recipientId);
```

---

## 8. Services

### NotificationService

Methods:

```java
void send(NotificationCommand command);

void markAsRead(Long notificationId);

void markAllAsRead(Long recipientId);

List<Notification> getUnread(Long recipientId);

List<Notification> getAll(Long recipientId);

long getUnreadCount(Long recipientId);
```

Persist notification before email delivery.

---

### EmailService

Use Resend.

Required methods:

```java
void sendAccountCreatedEmail(...)

void sendPasswordResetEmail(...)

void sendReportClosedEmail(...)

void sendSosEscalationEmail(...)
```

Plain text only.

If email fails:

- Log error
- Do not throw
- Notification must remain saved

---

## 9. NotificationEventListener

Create dedicated listener class.

Responsibilities:

1. Receive event
2. Build NotificationCommand
3. Send through NotificationService

Channel rules:

AccountCreatedEvent → EMAIL

PasswordResetEvent → EMAIL

Everything else → IN_APP

---

## 10. Controller

Base Path:

/api/notifications

Endpoints:

GET /api/notifications/{userId}

GET /api/notifications/{userId}/unread

GET /api/notifications/{userId}/count

PUT /api/notifications/{id}/read

PUT /api/notifications/{userId}/read-all

Add:

// TODO: secure with JWT

on every endpoint.

---

## 11. Test Controller

Base Path:

/api/test/notifications

REMOVE BEFORE PRODUCTION

Endpoints:

POST /trigger-report-assigned

POST /trigger-task-disposed

POST /trigger-account-created

POST /trigger-sos-submitted

Each endpoint:

1. Accept mock JSON
2. Publish ApplicationEvent
3. Return created notification

---

## 12. Package Structure

notifications/

entity/
Notification.java

enums/
NotificationType.java
NotificationChannel.java

dto/
NotificationCommand.java

events/
ReportSubmittedEvent.java
SosSubmittedEvent.java
ReportVerifiedEvent.java
ReportAssignedEvent.java
TaskAssignedEvent.java
TaskAcceptedEvent.java
TaskDisposedEvent.java
TaskRejectedEvent.java
ReportCompletedEvent.java
ReportRejectedByDeptEvent.java
AccountCreatedEvent.java
PasswordResetEvent.java
DisasterModeActivatedEvent.java

repository/
NotificationRepository.java

service/
NotificationService.java
EmailService.java

listener/
NotificationEventListener.java

controller/
NotificationController.java
NotificationTestController.java

---

## 13. Constraints

- Do not create User relationships.
- Store recipientId and recipientRole directly.
- Do not implement WebSockets.
- Frontend will poll.
- Persist notifications before email delivery.
- Do not hardcode role names.
- Use existing project enums whenever available.

## Notification Message Requirements

Notification messages must contain meaningful business context.

Messages should include available information such as:

- Report ID
- Area / Location
- Department
- Assigned User
- Status
- Category
- Rejection Reason

Examples:

New civic report submitted:
Broken road reported near Gulshan-e-Iqbal Block 5.

New SOS report received:
Road accident reported near Shahrah-e-Faisal.

Report #204 assigned to Fire Brigade Department for Gulshan-e-Iqbal Block 5.

Task assigned:
Inspect fallen electrical pole near Korangi Crossing.

Worker FIRE-04 submitted completion evidence for Report #204. Verification required.

Report #204 rejected by Fire Brigade Department. Reason: Invalid location information.

Your report #204 has been successfully resolved and marked completed.

Disaster Mode Activated:
5 flood-related reports detected within Gulshan-e-Iqbal during the last 30 minutes.

Messages must be generated dynamically from available report/task data and must never be hardcoded.

The Notification Module must not implement Disaster Mode logic.

It may only react to a published DisasterModeActivatedEvent.

Disaster detection, threshold calculation, report grouping, and incident management belong to future Disaster Mode modules.