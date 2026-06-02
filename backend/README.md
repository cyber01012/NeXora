# NeXora Backend

Spring Boot API for NeXora — Intelligent Disaster & Civil Management System.

## Prerequisites

- JDK 17
- PostgreSQL 15+
- Redis 7+ (OTP, refresh tokens, rate limits)
- Maven 3.9+

## Database

Create the database name that matches `application.properties` (default: `nexora`):

```sql
CREATE DATABASE nexora;
```

Update `spring.datasource.url`, `username`, and `password` in `src/main/resources/application.properties` if your setup differs.

## Admin bootstrap (first run)

On **first startup**, if no `ADMIN` user exists, the app creates one from:

```properties
ADMIN_EMAIL=admin@nexora.com
ADMIN_PASSWORD=nexora123
```

| Field | Value after bootstrap |
|--------|------------------------|
| Email | `admin@nexora.com` |
| Username | `admin` (part before `@`) |
| Password | value of `ADMIN_PASSWORD` |
| Email verified | `true` (can log in immediately) |

Bootstrap runs **once**. If an ADMIN user already exists, these properties are ignored.

## Run the API

```bash
cd backend
mvn spring-boot:run
```

API base: `http://localhost:8080`

On startup you should see seed logs for responder types, departments, and:

`Bootstrapped initial ADMIN account for admin@nexora.com`

## Test admin login (curl)

```bash
curl -s -X POST http://localhost:8080/api/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"identifier\":\"admin@nexora.com\",\"password\":\"nexora123\",\"deviceId\":\"cli\"}"
```

Use the returned `accessToken` as `Authorization: Bearer <token>` for `/api/admin/**` endpoints.

See `ADMIN_FLOW.http` for a full step-by-step REST Client flow.

## Frontend (optional)

The React UI lives in **Authentication Architecture Setup** (separate folder). It expects:

```env
VITE_API_BASE_URL=http://localhost:8080
```

```bash
cd "C:\Users\dc\Downloads\Authentication Architecture Setup"
npm install
npm run dev
```

Open `http://localhost:5173` → **Open Sign In** → log in with `admin@nexora.com` / `nexora123` → **Admin Portal** → **Create User**.

## Default seeded data

| Type | Examples |
|------|-----------|
| Departments (GOV) | PDMA Operations, Fire & Rescue Wing |
| Departments (NGO) | Search & Rescue Coordination |
| Responder types | P1 PDMA, F2 Fire Brigade, S3 Search & Rescue, … |

When creating portal users via admin API, send **`category`** = **department name** (not role slug), e.g. `"Search & Rescue Coordination"` for NGO users.

## Docs

- [AUTH_API.md](./AUTH_API.md) — endpoints and payloads
- [DESIGN_PATTERNS.md](./DESIGN_PATTERNS.md) — auth architecture
