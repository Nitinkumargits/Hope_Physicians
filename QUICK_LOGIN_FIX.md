# ⚡ Quick Login Fix - 401 Error

## 🔴 Problem

```
POST http://52.66.236.157/api/auth/login 401 (Unauthorized)
```

## ✅ Solution

### Step 1: Seed Database (SSH into Server)

```bash
cd ~/hope-physicians/backend
npm run prisma:seed
```

### Step 2: Use Correct Credentials

**⚠️ Important:** Use lowercase passwords!

| Role    | Email                     | Password     |
| ------- | ------------------------- | ------------ |
| Admin   | admin@hopephysicians.com  | `admin123`   |
| Doctor  | doctor@hopephysicians.com | `doctor123`  |
| Patient | patient@example.com       | `patient123` |

**Note:** NOT `Admin@123` - use `admin123` (lowercase)

### Step 3: Test

1. Go to: `http://52.66.236.157/portal/login`
2. Select role
3. Enter email and password (lowercase!)
4. Login

**Should work!** ✅

---

**If still fails, check:**

- Backend logs: `pm2 logs hope-physicians-backend`
- Database connection: `node scripts/check-users.js`
- See `LOGIN_401_SOLUTION.md` for details
