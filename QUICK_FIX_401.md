# ⚡ Quick Fix for 401 Login Error

## 🔴 Problem

```
POST http://52.66.236.157/api/auth/login 401 (Unauthorized)
```

Even with correct credentials: `admin@hopephysicians.com` / `admin123`

## ✅ Solution (Run on Server)

### Step 1: SSH into Server

```bash
ssh user@52.66.236.157
```

### Step 2: Run Fix Script

```bash
cd ~/hope-physicians
chmod +x fix-login-401.sh
./fix-login-401.sh
```

**This will:**

- ✅ Check if users exist
- ✅ Create/update users with correct passwords
- ✅ Test login endpoint
- ✅ Restart backend

### Step 3: Test Login

1. Open browser: `http://52.66.236.157/portal/login`
2. Use credentials:
   - Email: `admin@hopephysicians.com`
   - Password: `admin123` (lowercase!)
3. Should login successfully! ✅

## 🔍 If Fix Script Doesn't Work

### Manual Fix:

```bash
cd ~/hope-physicians/backend

# 1. Check users
node scripts/check-users.js

# 2. Fix login (creates/updates users)
node scripts/fix-login.js

# 3. Test login
node scripts/test-login.js

# 4. Restart backend
pm2 restart hope-physicians-backend
```

## 📋 Correct Credentials

| Role    | Email                     | Password     |
| ------- | ------------------------- | ------------ |
| Admin   | admin@hopephysicians.com  | `admin123`   |
| Doctor  | doctor@hopephysicians.com | `doctor123`  |
| Patient | patient@example.com       | `patient123` |
| Staff   | staff@hopephysicians.com  | `staff123`   |

**⚠️ Important:** Use lowercase passwords!

## ✅ Verification

After fix, test:

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"admin123"}'
```

**Should return:**

```json
{
  "token": "eyJhbGc...",
  "user": { ... }
}
```

**Not:**

```json
{
  "error": "Invalid email or password"
}
```

---

**Status:** Ready to fix
**Time:** ~2 minutes
