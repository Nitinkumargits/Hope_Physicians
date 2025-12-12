# ⚡ Immediate Fix for 401 Login Error

## 🔴 Current Status

- ✅ API Configuration: `/api` (Working!)
- ✅ Request reaching backend (No timeout, no CORS)
- ❌ **401 Unauthorized** (Users don't exist or password mismatch)

## 🚀 Solution: Use GitHub Actions

### Step 1: Push Code (If Not Already Done)

```bash
git add .
git commit -m "Add fix-login workflow"
git push origin master
```

### Step 2: Run GitHub Actions Workflow

1. **Go to GitHub:**

   - Open: `https://github.com/YOUR_USERNAME/YOUR_REPO`
   - Click **"Actions"** tab

2. **Find Workflow:**

   - Look for: **"Fix 401 Login Error"**
   - Click on it

3. **Run Workflow:**

   - Click **"Run workflow"** button (top right)
   - Select branch: `master`
   - Click **"Run workflow"** again

4. **Wait for Completion:**
   - Watch the workflow run
   - Should complete in ~1-2 minutes
   - Look for green checkmark ✅

### Step 3: Test Login

1. **Open browser:**

   - Go to: `http://52.66.236.157/portal/login`

2. **Use credentials:**

   - Email: `admin@hopephysicians.com`
   - Password: `admin123` (lowercase!)

3. **Should login successfully!** ✅

## 📋 What the Workflow Does

The workflow automatically:

1. ✅ SSH into server (using GitHub Secrets)
2. ✅ Check if users exist
3. ✅ Create/update users with correct passwords
4. ✅ Test login endpoint
5. ✅ Restart backend
6. ✅ Verify fix worked

## 🔍 If Workflow Fails

### Check GitHub Actions Logs:

1. Click on the failed workflow run
2. Expand each step to see errors
3. Common issues:
   - **SSH connection failed** → Check `EC2_SSH_KEY` secret
   - **Scripts not found** → Scripts need to be on server
   - **Database error** → Check `DATABASE_URL` secret

### Alternative: Manual Fix (If You Get SSH Access)

```bash
# SSH into server
ssh -i /path/to/key.pem user@52.66.236.157

# Run fix
cd ~/hope-physicians/backend
node scripts/fix-login.js
pm2 restart hope-physicians-backend
```

## ✅ Verification

After workflow completes:

1. **Check workflow status:**

   - Should show green checkmark ✅
   - Logs show "Login test successful"

2. **Test in browser:**

   - `http://52.66.236.157/portal/login`
   - Login should work! ✅

3. **Check browser console:**
   - Should see: `🔧 API Configuration: /api`
   - No more 401 errors

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow exists
- [ ] Workflow run completed successfully
- [ ] Tested login in browser
- [ ] Login works! ✅

---

**Status:** Ready to fix via GitHub Actions
**Time:** ~2 minutes after workflow runs
