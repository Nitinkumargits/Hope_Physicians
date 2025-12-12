# 🔐 Complete Fix for 401 Login Error

## 🔴 Current Error

```
POST http://52.66.236.157/api/auth/login 401 (Unauthorized)
```

**Status:**

- ✅ API URL is correct (`/api`)
- ✅ Request reaching backend
- ❌ Authentication failing (401)

## 🔍 Root Causes

1. **Users don't exist in database** (most likely)
2. **Password hash mismatch** (password changed but hash not updated)
3. **Account inactive** (user disabled)
4. **Database connection issue** (backend can't query database)

## 🚀 Quick Fix (Run on Server)

### Option 1: Automated Fix Script

```bash
# SSH into server
ssh user@52.66.236.157

# Run fix script
cd ~/hope-physicians
chmod +x fix-login-401.sh
./fix-login-401.sh
```

**This will:**

1. ✅ Check if users exist
2. ✅ Create/update users with correct passwords
3. ✅ Test login endpoint
4. ✅ Restart backend

### Option 2: Manual Fix

```bash
# SSH into server
ssh user@52.66.236.157

# Navigate to backend
cd ~/hope-physicians/backend

# Check users
node scripts/check-users.js

# Fix login (creates/updates users)
node scripts/fix-login.js

# Test login
node scripts/test-login.js

# Restart backend
pm2 restart hope-physicians-backend
```

### Option 3: Seed Database

```bash
# SSH into server
ssh user@52.66.236.157

# Navigate to backend
cd ~/hope-physicians/backend

# Seed database
npm run prisma:seed
```

## 📋 Correct Credentials

**⚠️ Important:** Use these exact passwords (lowercase):

| Role    | Email                     | Password     |
| ------- | ------------------------- | ------------ |
| Admin   | admin@hopephysicians.com  | `admin123`   |
| Doctor  | doctor@hopephysicians.com | `doctor123`  |
| Patient | patient@example.com       | `patient123` |
| Staff   | staff@hopephysicians.com  | `staff123`   |

## 🔍 Diagnostic Steps

### Step 1: Check if Users Exist

```bash
cd ~/hope-physicians/backend
node scripts/check-users.js
```

**Should show:**

```
✅ admin: admin@hopephysicians.com
✅ doctor: doctor@hopephysicians.com
✅ patient: patient@example.com
✅ staff: staff@hopephysicians.com
```

**If users don't exist:**

```bash
node scripts/fix-login.js
```

### Step 2: Test Login Endpoint

```bash
cd ~/hope-physicians/backend
node scripts/test-login.js
```

**Should show:**

```
✅ Login successful!
Token: eyJhbGc...
```

**If login fails:**

- Check password hash
- Check account status
- Check database connection

### Step 3: Verify Database Connection

```bash
cd ~/hope-physicians/backend
node -e "
const { prisma } = require('./src/lib/prisma.js');
prisma.portalUser.findMany({ take: 1 })
  .then(users => console.log('✅ DB connected, users:', users.length))
  .catch(e => console.error('❌ DB error:', e.message))
  .finally(() => prisma.\$disconnect());
"
```

### Step 4: Check Backend Logs

```bash
# Check PM2 logs
pm2 logs hope-physicians-backend --lines 50

# Or check log files
tail -f ~/hope-physicians/logs/backend-error.log
```

**Look for:**

- "Login error:" messages
- Database connection errors
- Prisma errors

## 🛠️ Scripts Created

### 1. `backend/scripts/check-users.js`

- Checks if test users exist in database
- Shows user status (active, can access)

### 2. `backend/scripts/fix-login.js`

- Creates users if missing
- Updates password hashes if wrong
- Activates accounts if inactive

### 3. `backend/scripts/test-login.js`

- Tests login endpoint directly
- Verifies password hashes
- Shows detailed error messages

### 4. `fix-login-401.sh`

- Complete automated fix
- Runs all diagnostic and fix steps

## ✅ Verification

After running the fix:

1. **Test in Browser:**

   - Go to: `http://52.66.236.157/portal/login`
   - Use: `admin@hopephysicians.com` / `admin123`
   - Should login successfully! ✅

2. **Check Backend Logs:**

   ```bash
   pm2 logs hope-physicians-backend --lines 20
   ```

   - Should see successful login messages

3. **Test Login Endpoint:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@hopephysicians.com","password":"admin123"}'
   ```
   - Should return token, not 401

## 🔧 Common Issues & Solutions

### Issue 1: "Users don't exist"

**Solution:**

```bash
cd ~/hope-physicians/backend
node scripts/fix-login.js
```

### Issue 2: "Password hash mismatch"

**Solution:**

```bash
cd ~/hope-physicians/backend
node scripts/fix-login.js
# This updates password hashes
```

### Issue 3: "Account is inactive"

**Solution:**

```bash
cd ~/hope-physicians/backend
node scripts/fix-login.js
# This activates accounts
```

### Issue 4: "Database connection error"

**Solution:**

```bash
# Check DATABASE_URL in .env
cat ~/hope-physicians/backend/.env | grep DATABASE_URL

# Test connection
cd ~/hope-physicians/backend
npx prisma db pull
```

## 📝 Complete Fix Process

1. **SSH into server:**

   ```bash
   ssh user@52.66.236.157
   ```

2. **Run fix script:**

   ```bash
   cd ~/hope-physicians
   chmod +x fix-login-401.sh
   ./fix-login-401.sh
   ```

3. **Verify:**

   - Test login in browser
   - Check backend logs
   - Test login endpoint

4. **Done!** ✅

---

**Status:** Ready to fix
**Action:** Run `./fix-login-401.sh` on server
