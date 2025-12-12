# ✅ API Configuration Fix - All Services Updated

## 🔴 Problem

Multiple API services were still using hardcoded `localhost:5000`:

- `authService.js` - `/auth/me` endpoint
- All patient APIs
- All staff APIs
- All admin APIs
- Page components

**Error:**

```
Access to XMLHttpRequest at 'http://localhost:5000/api/auth/me' from origin 'http://52.66.236.157' has been blocked by CORS policy
```

## ✅ Solution Applied

### 1. Created Centralized API Config (✅ Done)

**File:** `frontend/src/config/apiConfig.js`

- Single source of truth for API URL
- Auto-detects production vs development
- Uses Nginx proxy (`/api`) for production
- Uses direct backend (`localhost:5000/api`) for development

### 2. Updated All API Services (✅ Done)

**Updated 30+ files to use centralized config:**

#### Services:

- ✅ `authService.js`
- ✅ `adminService.js`
- ✅ `patientService.js`
- ✅ `doctorService.js`
- ✅ `staffService.js`
- ✅ `notificationService.js`
- ✅ `prescriptionService.js`
- ✅ `patientFormService.js`

#### Patient APIs:

- ✅ `appointmentApi.js`
- ✅ `billingApi.js`
- ✅ `prescriptionApi.js`
- ✅ `reportApi.js`
- ✅ `paymentApi.js`
- ✅ `insuranceApi.js`
- ✅ `reminderApi.js`
- ✅ `admissionApi.js`
- ✅ `feedbackApi.js`
- ✅ `chatApi.js`

#### Staff APIs:

- ✅ `receptionApi.js`
- ✅ `nurseApi.js`
- ✅ `labApi.js`
- ✅ `pharmacyApi.js`
- ✅ `staffApi.js`

#### Admin APIs:

- ✅ `adminApi.js`
- ✅ `staffManagementApi.js`

#### Pages:

- ✅ `Profile.jsx`
- ✅ `Appointments.jsx`
- ✅ `PrescriptionEditor.jsx`

#### Root API:

- ✅ `appointmentApi.js`

## 🎯 How It Works

### Before:

```javascript
// Each file had its own hardcoded URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
```

### After:

```javascript
// All files import from centralized config
import { API_BASE_URL } from "../config/apiConfig";
const API_URL = API_BASE_URL;
```

### Auto-Detection Logic:

1. **Production (`52.66.236.157`):**

   ```javascript
   API_URL = "/api"; // Nginx reverse proxy
   ```

2. **Development (`localhost`):**

   ```javascript
   API_URL = "http://localhost:5000/api"; // Direct backend
   ```

3. **Runtime Override:**
   ```javascript
   // Can be set in index.html
   window.APP_CONFIG.API_URL = "/api";
   ```

## 🚀 Next Steps

### 1. Rebuild Frontend

```bash
cd frontend
npm run build
```

**This will:**

- Include new `apiConfig.js`
- All services will use centralized config
- Production will use `/api` (Nginx proxy)
- Development will use `localhost:5000/api`

### 2. Deploy to Server

```bash
# Copy dist/ to Nginx web root
# Or use your deployment script
```

### 3. Verify

**After deployment, check browser console:**

```javascript
// Should see:
🔗 API Base URL: /api
```

**All API calls should now use `/api`:**

- ✅ `GET /api/auth/me`
- ✅ `POST /api/patient-forms/patient-info`
- ✅ `GET /api/patient/appointments`
- ✅ All other API calls

## ✅ Benefits

1. **Single Source of Truth**

   - One place to change API URL
   - Consistent across all services

2. **Auto-Detection**

   - Works in production and development
   - No manual configuration needed

3. **Production Ready**

   - Uses Nginx proxy (secure)
   - No firewall changes needed

4. **Easy Maintenance**
   - Update one file to change all APIs
   - Runtime configuration support

## 📋 Files Changed Summary

**Created:**

- ✅ `frontend/src/config/apiConfig.js` - Centralized config

**Updated (30+ files):**

- ✅ All service files (`services/*.js`)
- ✅ All API client files (`api/**/*.js`)
- ✅ Page components with API calls
- ✅ `patientFormService.js`

## 🔍 Verification

After rebuild and deploy:

1. **Open browser console:**

   - Should see: `🔗 API Base URL: /api`

2. **Check Network tab:**

   - All requests should be: `/api/...`
   - NOT: `http://localhost:5000/api/...`

3. **Test authentication:**

   - Login should work
   - `/api/auth/me` should succeed

4. **Test patient form:**
   - Form submission should work
   - No CORS errors

---

**Status:** ✅ All API services updated to use centralized config
**Next:** Rebuild frontend and deploy
