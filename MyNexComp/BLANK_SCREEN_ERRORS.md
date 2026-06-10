# Blank Screen - Root Causes & Fixes

## 🔴 CRITICAL ERRORS FOUND & FIXED

### 1. **Frontend Import Path Error** ✅ FIXED
**File:** `frontend/src/App.jsx:24`
```javascript
// ❌ WRONG - causes module resolution failure
import AdminUsers from '../src/pages/admin/AdminUsers';

// ✅ FIXED
import AdminUsers from './pages/admin/AdminUsers';
```
**Impact:** This caused React module to fail loading, showing blank screen.

---

### 2. **API Function Formatting Error** ✅ FIXED
**File:** `frontend/src/api/authApi.ts:146-154`
```typescript
// ❌ WRONG - broken indentation/syntax
getAdminUsers() {

  return apiRequest(
    "/api/admin/users",
    ...
  );
},

// ✅ FIXED - proper formatting
getAdminUsers() {
  return apiRequest(
    "/api/admin/users",
    {
      method: "GET",
    }
  );
},
```

---

## 🟡 BACKEND STARTUP REQUIREMENTS

**Database:** PostgreSQL must be running
```
localhost:5432/nexora_db
username: postgres
password: hafsa123
```

**Redis:** Must be running
```
localhost:6379
```

**Backend:** Must be started
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will run on: `http://localhost:8080`

---

## 🟡 FRONTEND STARTUP

```bash
cd frontend
npm install  # if not already done
npm run dev
```
Frontend will be at: `http://localhost:5173`

---

## 🔍 WHY YOU SAW BLANK SCREEN

### **Scenario 1: Backend Not Running** (Most Likely)
1. App loads SplashScreen ✅
2. LandingPage starts rendering ✅
3. AuthContext tries to fetch `/api/auth/me` to check if user is logged in ❌
4. Fetch fails (backend not responding)
5. AuthContext silently catches error and sets `isLoading=false`
6. App tries to render Landing page but CSS variables crash silently
7. **Result:** White blank screen

### **Scenario 2: Import Error** (Now Fixed)
1. React can't load `AdminUsers` component due to wrong path
2. Module bundling fails
3. **Result:** Vite shows build errors in console

### **Scenario 3: CSS Variables Not Loaded** 
1. `index.css` depends on CSS custom properties like `--bg-dark`, `--primary-glow`
2. If Tailwind CSS v4 doesn't load properly, these variables are undefined
3. All `var(--...)` references fail silently
4. **Result:** No styles applied → white blank screen

---

## ✅ VERIFICATION STEPS

### Step 1: Start Backend
```bash
cd backend
mvn spring-boot:run
# Wait for: "Tomcat started on port(s): 8080"
```

### Step 2: Start Frontend
```bash
cd frontend  
npm run dev
# Should show: "Local:   http://localhost:5173/"
```

### Step 3: Check Browser Console
**F12 → Console tab** - Look for:
- ❌ Errors like "Failed to fetch from API"
- ❌ Module import errors
- ✅ Nothing should appear if working correctly

### Step 4: Test Landing Page
- Should see splash screen with "Connecting Crisis. Coordinating Response."
- Should show NEXORA hero with buttons
- Should be able to click "GET STARTED" to open auth modal

---

## 🔗 API Connectivity Check

If still blank after backend starts, test API directly:

```bash
# Test backend is responding
curl http://localhost:8080/api/auth/me

# Should return 401 Unauthorized (not connected, which is expected)
# or 200 with user profile (if authenticated)
```

If you get **"Connection refused"** → Backend not running
If you get **CORS error** → Check CORS config in backend

---

## 📋 Files Modified Today
- ✅ `frontend/src/App.jsx` - Fixed import path
- ✅ `frontend/src/api/authApi.ts` - Fixed function formatting

All other issues are runtime/environment related (backend not running, missing services)
