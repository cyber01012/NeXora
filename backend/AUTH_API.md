# NeXora Authentication API

Base URL: `http://localhost:8080`

All authenticated requests require:

```http
Authorization: Bearer <access_token>
```

---

## Schema Metadata

### GET `/api/auth/schema`

Returns registration field metadata derived from JPA entities (`nullable`, `unique`, sensitive flags).

**Response (excerpt)**

```json
{
  "CITIZEN": {
    "role": "CITIZEN",
    "entity": "RegisterCitizen",
    "fields": [
      { "fieldName": "fullName", "columnName": "fname", "required": true, "unique": false, "sensitive": false, "writeOnly": false },
      { "fieldName": "phoneNumber", "columnName": "phone_num", "required": true, "unique": true, "sensitive": true, "writeOnly": false },
      { "fieldName": "password", "columnName": "password", "required": true, "unique": false, "sensitive": false, "writeOnly": true }
    ]
  }
}
```

---

## Citizen Registration (Landing Page)

### POST `/api/auth/register/citizen`

Public endpoint. Always creates `RegisterCitizen` records only.

- Email is **optional**
- If email omitted: `emailVerified=false`, no OTP, no welcome email, no email password recovery
- If email provided: OTP sent; after verification `emailVerified=true`, welcome email sent, `verifiedCitizenBadge=true` in profile
- Citizens may log in without email verification

**Request**

```json
{
  "fullName": "Ali Khan",
  "phoneNumber": "03001234567",
  "address": "House 12, Street 4",
  "city": "Islamabad",
  "email": "ali@example.com",
  "cnic": "3520212345671",
  "password": "SecurePass123!"
}
```

---

## Role Resolution

Roles are resolved from `UserType.name` (never numeric IDs):

| Storage | Role source |
|---|---|
| `RegisterCitizen` | Always `CITIZEN` |
| `AdminUser` | `userType.name` → `ADMIN`, `NGO`, `RESPONDER`, `HELP_DESK`, `ASSIGNING_OFFICER` |
| `VolunteerWorkerCreator` | `userType.name` → `VOLUNTEER` or `WORKER` (set explicitly at creation) |

NGO category is **required only** when creating NGO users.

---

## Admin Bootstrap

On startup, if no `ADMIN` user exists, the app creates one from environment variables:

```properties
ADMIN_EMAIL=admin@nexora.com
ADMIN_PASSWORD=your-secure-password
```

Password is BCrypt-hashed before storage. Username is derived from the email local-part (`admin` for `admin@nexora.com`). User types are auto-seeded by name. The bootstrapped admin has `emailVerified=true` and can log in immediately.

---

## Profile Response Fields

```json
{
  "emailVerified": true,
  "verifiedCitizenBadge": true
}
```

`verifiedCitizenBadge` is `true` only for citizens with verified email.

---

## Volunteer / Worker Creation

Roles assigned explicitly via `UserType`:

- `POST /api/ngo/volunteers` → `UserType.name = VOLUNTEER`
- `POST /api/responder/workers` → `UserType.name = WORKER`

Email is **mandatory** for all non-citizen roles. On account creation (and via `POST /api/auth/send-email-verification`), a **verification link** is emailed — the same `http://localhost:5173/verify-email?token=...` flow as citizens. Login blocked until `emailVerified=true`.

---

## Login

### POST `/api/auth/login`

Identifier may be username, email, or phone depending on account type.

**Request**

```json
{
  "identifier": "ali@example.com",
  "password": "SecurePass123!",
  "deviceId": "browser-tab-1"
}
```

**Response `200`**

```json
{
  "accessToken": "<jwt>",
  "refreshToken": "<jwt>",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "identifier": "ali@example.com",
    "sourceId": "42",
    "source": "CITIZEN",
    "role": "CITIZEN",
    "displayName": "Ali Khan",
    "email": "ali@example.com",
    "maskedPhone": "****4567",
    "maskedCnic": "*****-*******-1",
    "active": true
  }
}
```

---

## OTP

### POST `/api/auth/verify-otp`

```json
{
  "source": "CITIZEN",
  "sourceId": "42",
  "purpose": "EMAIL_VERIFICATION",
  "otp": "123456"
}
```

### POST `/api/auth/resend-otp`

Applies to `EMAIL_VERIFICATION` and `PASSWORD_RESET` only.

**Resend limits (Redis key `otp:resend:{source}:{sourceId}`):**
- Maximum **2 resends** per rolling **1-hour** window (from first resend)
- Initial OTP sends (registration / forgot-password) do **not** count toward the limit
- Third resend within the window returns **429 Too Many Requests**

**Request**

```json
{
  "source": "CITIZEN",
  "sourceId": "42",
  "purpose": "EMAIL_VERIFICATION",
  "email": "ali@example.com"
}
```

**Response `200`**

```json
{
  "message": "OTP resent successfully",
  "remainingResends": 1
}
```

**Response `429` (limit reached)**

```json
{
  "timestamp": "2026-05-30T12:00:00Z",
  "status": 429,
  "message": "OTP resend limit reached. Please try again after 45 minutes.",
  "retryAfterMinutes": 45
}
```

---

## Password Management

### POST `/api/auth/forgot-password`

```json
{ "email": "ali@example.com" }
```

### POST `/api/auth/reset-password`

```json
{
  "source": "CITIZEN",
  "sourceId": "42",
  "otp": "123456",
  "newPassword": "NewSecurePass123!"
}
```

### POST `/api/auth/change-password` (authenticated)

```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass123!"
}
```

---

## Token Lifecycle

### POST `/api/auth/refresh`

Rotates refresh token (old token invalidated).

```json
{ "refreshToken": "<jwt>" }
```

### POST `/api/auth/logout` (authenticated)

```json
{ "refreshToken": "<jwt>" }
```

### POST `/api/auth/logout-all` (authenticated)

Revokes all refresh tokens for the user.

---

## Admin Portal User Creation

Requires `ROLE_ADMIN`.

| Endpoint | Creates |
|---|---|
| `POST /api/admin/users/ngo` | NGO (`AdminUser` + `UserType=ngo`) |
| `POST /api/admin/users/help-desk` | Help Desk |
| `POST /api/admin/users/assigning-officer` | Assigning Officer |
| `POST /api/admin/users/responder` | Responder |

**Request**

```json
{
  "username": "ngo_alpha",
  "name": "Alpha Relief NGO",
  "contactNumber": "03009998877",
  "email": "ngo@alpha.org",
  "password": "AdminSetPass123!",
  "category": "Search & Rescue Coordination"
}
```

`category` must match an existing **department name** (`GET /api/admin/departments`). For responders, also send `responderTypeId` (e.g. `"P1"`).

---

## NGO / Responder Managed Users

### POST `/api/ngo/volunteers` (`ROLE_NGO`)

Creates `VolunteerWorkerCreator` under the NGO's department (Volunteer role inferred from department category `NGO`).

```json
{
  "usernameCreated": "vol_001",
  "name": "Sara Volunteer",
  "password": "VolunteerPass123!",
  "phoneNumber": "03001112233",
  "email": "sara@example.com",
  "profilePic": "https://cdn.example.com/sara.jpg"
}
```

### POST `/api/responder/workers` (`ROLE_RESPONDER`)

Creates `VolunteerWorkerCreator` under the Responder's department (Worker role inferred from department category `GOV`).

---

## Role Permissions

| Role | Access |
|---|---|
| `CITIZEN` | `/api/citizen/**`, authenticated auth endpoints |
| `NGO` | `/api/ngo/**` + manage own volunteers |
| `VOLUNTEER` | `/api/volunteer/**` |
| `RESPONDER` | `/api/responder/**` + manage own workers |
| `WORKER` | `/api/worker/**` |
| `HELP_DESK` | `/api/help-desk/**` |
| `ASSIGNING_OFFICER` | `/api/assigning-officer/**` |
| `ADMIN` | `/api/admin/**` + full access |

---

## Error Format

```json
{
  "timestamp": "2026-05-30T12:00:00Z",
  "status": 400,
  "message": "Validation failed",
  "errors": {
    "phoneNumber": "must not be blank"
  }
}
```
