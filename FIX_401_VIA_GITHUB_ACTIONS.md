# 🚀 Fix 401 Login Error via GitHub Actions

## ✅ Solution

Since you can't SSH directly (SSH key required), use **GitHub Actions** to run the fix automatically!

## 🎯 How to Use

### Step 1: Go to GitHub Actions

1. Open your repository on GitHub
2. Click **"Actions"** tab
3. Find workflow: **"Fix 401 Login Error"**
4. Click **"Run workflow"** button
5. Click **"Run workflow"** again

### Step 2: Wait for Completion

The workflow will:

1. ✅ SSH into server (using GitHub Secrets key)
2. ✅ Copy fix scripts to server
3. ✅ Run fix script (creates/updates users)
4. ✅ Test login endpoint
5. ✅ Restart backend
6. ✅ Verify fix worked

### Step 3: Check Results

- **Green checkmark** = Fix successful! ✅
- **Red X** = Check logs for errors

## 📋 What the Workflow Does

```bash
# 1. Check users
node scripts/check-users.js

# 2. Fix login (create/update users)
node scripts/fix-login.js

# 3. Test login
node scripts/test-login.js

# 4. Restart backend
pm2 restart hope-physicians-backend

# 5. Verify
curl -X POST http://localhost:5000/api/auth/login ...
```

## ✅ After Fix

1. **Test in browser:**

   - Go to: `http://52.66.236.157/portal/login`
   - Use: `admin@hopephysicians.com` / `admin123`
   - Should login successfully! ✅

2. **Check GitHub Actions:**
   - Should show green checkmark
   - Logs show "Login test successful"

## 🔍 If Fix Fails

1. **Check GitHub Actions logs:**

   - Click on the failed workflow run
   - Scroll to see error messages

2. **Common issues:**
   - Database connection error → Check DATABASE_URL in secrets
   - Script not found → Scripts need to be copied first
   - PM2 not running → Backend might not be set up

## 📝 Manual Alternative

If GitHub Actions doesn't work, ask someone with SSH access to run:

```bash
ssh -i /path/to/key.pem user@52.66.236.157
cd ~/hope-physicians/backend
node scripts/fix-login.js
pm2 restart hope-physicians-backend
```

## 🎉 Benefits

- ✅ No SSH key needed on your machine
- ✅ Uses GitHub Secrets (secure)
- ✅ Automated fix
- ✅ Verifies results
- ✅ Can run anytime with button click

---

**Status:** Ready to use
**Action:** Go to GitHub Actions → Run "Fix 401 Login Error" workflow
