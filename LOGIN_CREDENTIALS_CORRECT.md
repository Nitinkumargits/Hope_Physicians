# 🔐 Correct Login Credentials

## ⚠️ Important: Password Format

**There's a discrepancy in documentation!**

### ✅ Correct Passwords (From Seed File)

These are the **actual passwords** in the database:

| Role        | Email                     | Password     | Notes                       |
| ----------- | ------------------------- | ------------ | --------------------------- |
| **Admin**   | admin@hopephysicians.com  | `admin123`   | Lowercase, no special chars |
| **Doctor**  | doctor@hopephysicians.com | `doctor123`  | Lowercase, no special chars |
| **Patient** | patient@example.com       | `patient123` | Lowercase, no special chars |
| **Staff**   | staff@hopephysicians.com  | `staff123`   | Lowercase, no special chars |

### ❌ Incorrect (From QA Document)

The QA document shows different passwords (these **won't work**):

- `Admin@123` ❌ (should be `admin123`)
- `Doctor@123` ❌ (should be `doctor123`)
- `Patient@123` ❌ (should be `patient123`)

## 🚀 Quick Fix: Seed Database

**If login fails with 401, seed the database:**

```bash
# SSH into server
cd ~/hope-physicians/backend

# Run seed script
npm run prisma:seed

# Or manually
node scripts/create-test-users.js
```

## 🔍 Verify Users Exist

**Check if users are in database:**

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

## 🧪 Test Login

**From server:**

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"admin123"}'
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

## 📋 Complete Test Credentials

### Admin

```
Email: admin@hopephysicians.com
Password: admin123
```

### Doctor

```
Email: doctor@hopephysicians.com
Password: doctor123
```

### Patient

```
Email: patient@example.com
Password: patient123
```

### Staff

```
Email: staff@hopephysicians.com
Password: staff123
```

---

**Note:** Use lowercase passwords without special characters as shown above.
