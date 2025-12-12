# 🔐 Fix 401 Login Error - Complete Guide

## 🔴 Problem

```
POST /api/auth/login 401 (Unauthorized)
```

**Even with correct credentials:**

- Email: `admin@hopephysicians.com`
- Password: `admin123`

## ✅ Root Cause

**Users don't exist in database** or **password hash mismatch**

## 🚀 Solution: GitHub Actions Workflow

### Quick Steps:

1. **Push code** (includes fix workflow)
2. **Go to GitHub Actions**
3. **Run "Fix 401 Login Error" workflow**
4. **Wait for completion**
5. **Test login** - Should work! ✅

### Detailed Steps:

#### 1. Push Code

```bash
git add .
git commit -m "Add fix-login workflow"
git push origin master
```

#### 2. Run Workflow

1. Go to: `https://github.com/YOUR_REPO/actions`
2. Find: **"Fix 401 Login Error"**
3. Click: **"Run workflow"** → **"Run workflow"**

#### 3. Wait

- Workflow runs automatically
- Takes ~1-2 minutes
- Shows progress in real-time

#### 4. Verify

- Green checkmark = Success ✅
- Test login in browser
- Should work! ✅

## 📋 Correct Credentials

| Role    | Email                     | Password     |
| ------- | ------------------------- | ------------ |
| Admin   | admin@hopephysicians.com  | `admin123`   |
| Doctor  | doctor@hopephysicians.com | `doctor123`  |
| Patient | patient@example.com       | `patient123` |
| Staff   | staff@hopephysicians.com  | `staff123`   |

**⚠️ Important:** Use lowercase passwords!

## 🔍 What Gets Fixed

The workflow:

1. ✅ Checks if users exist
2. ✅ Creates users if missing
3. ✅ Updates password hashes if wrong
4. ✅ Activates accounts if inactive
5. ✅ Tests login endpoint
6. ✅ Restarts backend

## 📝 Files Created

1. **`.github/workflows/fix-login-401.yml`**

   - GitHub Actions workflow
   - Runs fix script automatically

2. **`backend/scripts/fix-login.js`**

   - Creates/updates users
   - Fixes password hashes

3. **`backend/scripts/test-login.js`**

   - Tests login endpoint
   - Verifies fix worked

4. **`fix-login-401.sh`**
   - Complete fix script
   - Can run manually if needed

## ✅ After Fix

1. **Test Login:**

   - `http://52.66.236.157/portal/login`
   - Use: `admin@hopephysicians.com` / `admin123`
   - Should login! ✅

2. **Check Console:**

   - Should see: `🔧 API Configuration: /api`
   - No 401 errors

3. **Check Network:**
   - All requests: `/api/...`
   - Login successful

## 🆘 Troubleshooting

### Workflow Fails?

1. **Check logs:**

   - Click failed workflow
   - See error messages

2. **Common issues:**
   - SSH key wrong → Check `EC2_SSH_KEY` secret
   - Scripts missing → Need to copy first
   - Database error → Check `DATABASE_URL` secret

### Still Getting 401?

1. **Check workflow logs:**

   - Did it complete successfully?
   - Any error messages?

2. **Test manually:**

   - If you get SSH access, run:

   ```bash
   cd ~/hope-physicians/backend
   node scripts/fix-login.js
   ```

3. **Verify users:**
   ```bash
   node scripts/check-users.js
   ```

## 🎉 Summary

**Problem:** 401 Unauthorized (users don't exist)
**Solution:** GitHub Actions workflow fixes it automatically
**Time:** ~2 minutes
**Result:** Login works! ✅

---

**Next:** Push code → Run workflow → Test login
