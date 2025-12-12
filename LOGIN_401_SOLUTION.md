# 🔐 Login 401 Error - Complete Solution

## ✅ Good News

**API Configuration Fixed!** ✅

- Using `/api` (Nginx proxy) - Working!
- Request reaching backend - Working!
- Error is now **401 Unauthorized** (authentication, not network)

## 🔴 Current Error

```
POST http://52.66.236.157/api/auth/login 401 (Unauthorized)
```

**Meaning:** Backend received request but credentials are invalid or user doesn't exist.

## 🔍 Root Causes

1. **Users Not in Database** - Database not seeded
2. **Wrong Password Format** - Documentation shows different passwords
3. **Password Hash Mismatch** - Password hashing issue
4. **Account Inactive** - User account disabled
5. **Database Connection** - Backend can't query database

## ✅ Correct Login Credentials

**⚠️ Important:** Use these exact passwords (lowercase, no special chars):

| Role    | Email                     | Password     |
| ------- | ------------------------- | ------------ |
| Admin   | admin@hopephysicians.com  | `admin123`   |
| Doctor  | doctor@hopephysicians.com | `doctor123`  |
| Patient | patient@example.com       | `patient123` |
| Staff   | staff@hopephysicians.com  | `staff123`   |

**Note:** QA document shows `Admin@123` but actual password is `admin123` (lowercase).

## 🚀 Quick Fix

### Step 1: Seed Database (SSH into Server)

```bash
cd ~/hope-physicians/backend
npm run prisma:seed
```

**Or manually create users:**

```bash
node scripts/create-test-users.js
```

### Step 2: Verify Users Exist

```bash
node scripts/check-users.js
```

**Should show all users exist.**

### Step 3: Test Login

```bash
# Test admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"admin123"}'
```

**Should return token, not 401.**

### Step 4: Try Login in Browser

1. Go to: `http://52.66.236.157/portal/login`
2. Select role: **Admin**
3. Email: `admin@hopephysicians.com`
4. Password: `admin123` (lowercase!)
5. Click Login

**Should work!** ✅

## 🔧 Diagnostic Scripts Created

I've created helper scripts:

1. **`backend/scripts/check-users.js`**

   - Checks if test users exist
   - Run: `node scripts/check-users.js`

2. **`backend/scripts/create-test-users.js`**

   - Creates test users if missing
   - Run: `node scripts/create-test-users.js`

3. **`test-login.sh`**
   - Comprehensive login test
   - Run: `chmod +x test-login.sh && ./test-login.sh`

## 📋 Complete Troubleshooting

### Issue 1: "Invalid email or password"

**Check if user exists:**

```bash
cd ~/hope-physicians/backend
node scripts/check-users.js
```

**If user doesn't exist, create it:**

```bash
node scripts/create-test-users.js
```

### Issue 2: Database Connection Error

**Check DATABASE_URL:**

```bash
cat ~/hope-physicians/backend/.env | grep DATABASE_URL
```

**Test connection:**

```bash
cd ~/hope-physicians/backend
npx prisma db pull
```

### Issue 3: JWT_SECRET Missing

**Add JWT_SECRET:**

```bash
cd ~/hope-physicians/backend
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
pm2 restart hope-physicians-backend
```

### Issue 4: Account Inactive

**Activate user:**

```bash
cd ~/hope-physicians/backend
node -e "
const { prisma } = require('./src/lib/prisma.js');
prisma.portalUser.update({
  where: { email: 'admin@hopephysicians.com' },
  data: { isActive: true, canAccessSystem: true }
}).then(() => console.log('✅ User activated')).finally(() => prisma.\$disconnect());
"
```

## ✅ Verification Checklist

After fixing:

- [ ] Database seeded (`npm run prisma:seed`)
- [ ] Users exist (check with `check-users.js`)
- [ ] JWT_SECRET set in `.env`
- [ ] Backend restarted (`pm2 restart`)
- [ ] Test login with curl works
- [ ] Login works in browser

## 🎯 Expected Result

**After seeding database:**

- ✅ Login endpoint returns token
- ✅ No more 401 errors
- ✅ Can login in browser
- ✅ All features work

---

**Status:** API config fixed ✅ | Need to seed database
**Next:** Run `npm run prisma:seed` on server
