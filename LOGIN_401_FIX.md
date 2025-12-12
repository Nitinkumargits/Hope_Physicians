# 🔐 Login 401 Unauthorized Error - Fix Guide

## ✅ Good News

**API Configuration is Working!** ✅

- API URL: `/api` (correct - using Nginx proxy)
- Request reaching backend (no timeout, no CORS)
- Error: `401 Unauthorized` (authentication issue, not network)

## 🔴 Problem

```
POST http://52.66.236.157/api/auth/login 401 (Unauthorized)
```

**Meaning:** Backend received the request but rejected the credentials.

## 🔍 Possible Causes

1. **Invalid Credentials** - Email/password don't match
2. **User Not in Database** - Test users not seeded
3. **Password Hash Mismatch** - Password hashing issue
4. **Account Inactive** - User account disabled
5. **Database Connection Issue** - Backend can't query database
6. **JWT Secret Missing** - Backend missing JWT_SECRET

## 🚀 Diagnostic Steps

### Step 1: Check Backend Logs

**SSH into server:**

```bash
# Check PM2 logs
pm2 logs hope-physicians-backend --lines 50

# Or check log files
tail -f ~/hope-physicians/logs/backend-error.log
tail -f ~/hope-physicians/logs/backend-out.log
```

**Look for:**

- "Login error:" messages
- Database connection errors
- Prisma errors
- JWT secret errors

### Step 2: Test Login Endpoint Directly

**From server:**

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"Admin@123"}'

# Should return token or error message
```

### Step 3: Check Database Connection

**SSH into server:**

```bash
# Check if backend can connect to database
cd ~/hope-physicians/backend
node -e "const { prisma } = require('./src/lib/prisma.js'); prisma.portalUser.findMany().then(users => console.log('Users:', users.length)).catch(e => console.error('DB Error:', e.message))"
```

### Step 4: Verify Test Users Exist

**Check if test users are in database:**

```bash
# Connect to database (adjust for your DB type)
# PostgreSQL:
psql -U hope_user -d hope_physicians -c "SELECT email, role FROM \"PortalUser\" LIMIT 10;"

# Or check via Prisma Studio
cd ~/hope-physicians/backend
npx prisma studio
# Open in browser, check PortalUser table
```

### Step 5: Check Environment Variables

**Verify backend .env has required variables:**

```bash
cd ~/hope-physicians/backend
cat .env | grep -E "JWT_SECRET|DATABASE_URL|NODE_ENV"
```

**Should have:**

```env
JWT_SECRET=your-secret-key-here
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## 🔧 Quick Fixes

### Fix 1: Seed Test Users

**If users don't exist, seed the database:**

```bash
cd ~/hope-physicians/backend
npm run prisma:seed
# or
npx prisma db seed
```

### Fix 2: Create Admin User Manually

**If seed doesn't work, create user manually:**

```bash
cd ~/hope-physicians/backend
node -e "
const bcrypt = require('bcryptjs');
const { prisma } = require('./src/lib/prisma.js');
(async () => {
  const hash = await bcrypt.hash('Admin@123', 10);
  await prisma.portalUser.create({
    data: {
      email: 'admin@hopephysicians.com',
      passwordHash: hash,
      role: 'admin',
      isActive: true,
      canAccessSystem: true
    }
  });
  console.log('Admin user created');
})();
"
```

### Fix 3: Check Password Hashing

**Verify password is hashed correctly:**

```bash
# Test password hash
cd ~/hope-physicians/backend
node -e "
const bcrypt = require('bcryptjs');
bcrypt.hash('Admin@123', 10).then(hash => console.log('Hash:', hash));
"
```

### Fix 4: Restart Backend

**After fixing issues:**

```bash
pm2 restart hope-physicians-backend
pm2 logs hope-physicians-backend --lines 20
```

## 📋 Test Credentials (From QA Document)

Use these credentials to test:

| Role      | Email                        | Password      |
| --------- | ---------------------------- | ------------- |
| Admin     | admin@hopephysicians.com     | Admin@123     |
| Doctor    | dr.smith@hopephysicians.com  | Doctor@123    |
| Patient   | patient.john@example.com     | Patient@123   |
| Reception | reception@hopephysicians.com | Reception@123 |

## 🎯 Complete Diagnostic Script

Create `test-login.sh` on server:

```bash
#!/bin/bash
echo "🔍 Testing Login Endpoint..."

# Test 1: Backend is running
echo "1. Checking backend..."
curl -s http://localhost:5000/ && echo "✅ Backend running" || echo "❌ Backend not running"

# Test 2: Login endpoint accessible
echo -e "\n2. Testing login endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"Admin@123"}')

echo "Response: $RESPONSE"

# Test 3: Check database connection
echo -e "\n3. Testing database connection..."
cd ~/hope-physicians/backend
node -e "
const { prisma } = require('./src/lib/prisma.js');
prisma.portalUser.findMany({ take: 1 })
  .then(users => console.log('✅ DB connected, users found:', users.length))
  .catch(e => console.error('❌ DB error:', e.message))
  .finally(() => prisma.\$disconnect());
"

# Test 4: Check JWT_SECRET
echo -e "\n4. Checking JWT_SECRET..."
if grep -q "JWT_SECRET" ~/hope-physicians/backend/.env; then
  echo "✅ JWT_SECRET found in .env"
else
  echo "❌ JWT_SECRET missing in .env"
fi
```

Run: `chmod +x test-login.sh && ./test-login.sh`

## 🔍 Common Issues & Solutions

### Issue 1: "Invalid email or password"

**Possible causes:**

- User doesn't exist in database
- Password hash doesn't match
- Email case mismatch

**Fix:**

```bash
# Check if user exists
cd ~/hope-physicians/backend
node -e "
const { prisma } = require('./src/lib/prisma.js');
prisma.portalUser.findUnique({ where: { email: 'admin@hopephysicians.com' } })
  .then(user => console.log('User found:', user ? 'Yes' : 'No'))
  .catch(e => console.error('Error:', e.message))
  .finally(() => prisma.\$disconnect());
"
```

### Issue 2: "Account is inactive"

**Fix:**

```bash
# Activate user
cd ~/hope-physicians/backend
node -e "
const { prisma } = require('./src/lib/prisma.js');
prisma.portalUser.update({
  where: { email: 'admin@hopephysicians.com' },
  data: { isActive: true, canAccessSystem: true }
}).then(() => console.log('User activated')).finally(() => prisma.\$disconnect());
"
```

### Issue 3: Database Connection Error

**Check:**

```bash
# Verify DATABASE_URL in .env
cat ~/hope-physicians/backend/.env | grep DATABASE_URL

# Test connection
cd ~/hope-physicians/backend
npx prisma db pull
```

### Issue 4: JWT_SECRET Missing

**Fix:**

```bash
# Add JWT_SECRET to .env
cd ~/hope-physicians/backend
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env

# Restart backend
pm2 restart hope-physicians-backend
```

## ✅ Verification Checklist

After fixing:

- [ ] Backend logs show no errors
- [ ] Database connection works
- [ ] Test users exist in database
- [ ] JWT_SECRET is set in .env
- [ ] `curl` test to `/api/auth/login` returns token
- [ ] Login works in browser

## 🎯 Quick Test

**Test login from server:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"Admin@123"}'
```

**Expected response:**

```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@hopephysicians.com",
    "role": "admin",
    ...
  }
}
```

**If you get 401:**

- Check backend logs
- Verify user exists in database
- Check password hash
- Verify JWT_SECRET is set

---

**Status:** API config fixed ✅ | Authentication issue needs diagnosis
**Next:** Check backend logs and database
