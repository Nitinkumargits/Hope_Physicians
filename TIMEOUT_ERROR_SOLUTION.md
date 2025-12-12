# ⚠️ Timeout Error - Complete Solution

## 🔴 Current Error

```
Error submitting Patient Information form: timeout of 10000ms exceeded
```

**Status:** API URL is correct (`http://52.66.236.157:5000/api`), but backend is not responding.

## ✅ Fixes Applied

### 1. Increased Timeout (✅ Done)

- Changed from 10 seconds → 30 seconds
- File: `frontend/src/services/patientFormService.js`

### 2. Better Error Handling (✅ Done)

- Added status validation
- Better error messages

## 🚨 Root Cause

The backend is **not accessible** on `http://52.66.236.157:5000`. Possible reasons:

1. **Backend not running** - PM2 process stopped/crashed
2. **Port 5000 blocked** - Firewall or security group blocking
3. **Backend listening on wrong interface** - Only listening on localhost, not 0.0.0.0
4. **Backend crashed** - Check logs for errors

## 🔍 Diagnostic Steps (Run on Server)

### Step 1: Check if Backend is Running

```bash
# SSH into your server
ssh user@52.66.236.157

# Check PM2 status
pm2 status

# Should show: hope-physicians-backend | online
# If not, backend is not running!
```

### Step 2: Check if Port 5000 is Listening

```bash
# Check if port 5000 is in use
sudo netstat -tuln | grep 5000
# or
sudo ss -tuln | grep 5000

# Should show: LISTEN on 0.0.0.0:5000 or :::5000
# If nothing, backend is not listening!
```

### Step 3: Test Backend Locally

```bash
# Test from server itself
curl http://localhost:5000/

# Should return: "HOPE PHYSICIAN API is running..."
# If error, backend is not working!
```

### Step 4: Test Backend Externally

```bash
# From your local machine
curl http://52.66.236.157:5000/

# If this fails but localhost works, firewall is blocking!
```

### Step 5: Check Backend Logs

```bash
# Check PM2 logs
pm2 logs hope-physicians-backend --lines 50

# Or check log files
tail -f ~/hope-physicians/logs/backend-error.log
tail -f ~/hope-physicians/logs/backend-out.log

# Look for errors, crashes, or connection issues
```

## 🚀 Quick Fixes

### Fix 1: Restart Backend

```bash
# SSH into server
cd ~/hope-physicians/backend

# Restart backend
pm2 restart hope-physicians-backend

# Or if not running, start it
pm2 start server.js --name hope-physicians-backend --update-env

# Save PM2 config
pm2 save

# Check status
pm2 status
pm2 logs hope-physicians-backend --lines 20
```

### Fix 2: Open Firewall Port 5000

```bash
# Ubuntu/Debian
sudo ufw allow 5000/tcp
sudo ufw reload

# CentOS/RHEL/Amazon Linux
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload

# Check status
sudo ufw status | grep 5000
# or
sudo firewall-cmd --list-ports | grep 5000
```

### Fix 3: Check Security Groups (AWS EC2)

1. Go to **EC2 Console** → **Security Groups**
2. Select your instance's security group
3. **Inbound Rules** → **Edit**
4. Add rule:
   - **Type:** Custom TCP
   - **Port:** 5000
   - **Source:** 0.0.0.0/0 (or your IP for security)
5. **Save**

### Fix 4: Verify Backend Configuration

```bash
# Check .env file
cat ~/hope-physicians/backend/.env

# Should have:
# PORT=5000
# NODE_ENV=production
# CORS_ORIGINS=http://52.66.236.157

# Check server.js is listening on 0.0.0.0
grep "app.listen" ~/hope-physicians/backend/server.js

# Should show: app.listen(PORT, '0.0.0.0', ...)
# If not, backend won't accept external connections!
```

## 🎯 Production Solution: Use Nginx Reverse Proxy

**Best Practice:** Don't expose backend directly. Use Nginx.

### Why?

- ✅ Better security (backend not exposed)
- ✅ No firewall changes needed
- ✅ Eliminates CORS issues
- ✅ Better performance

### How It Works:

```
Frontend → http://52.66.236.157/api → Nginx → localhost:5000 → Backend
```

### Setup (Already in deploy.sh):

1. **Nginx proxies `/api` to `localhost:5000`**
2. **Backend runs on `localhost:5000` (not exposed)**
3. **Frontend uses `/api` or `http://52.66.236.157/api`**

### Update Frontend:

**Option A: Use relative path (Recommended)**

```env
# frontend/.env
VITE_API_URL=/api
```

**Option B: Use full URL**

```env
# frontend/.env
VITE_API_URL=http://52.66.236.157/api
```

### Verify Nginx Config:

```bash
# Check Nginx is running
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Check Nginx config file
cat /etc/nginx/sites-available/hope-physicians
# or
cat /etc/nginx/conf.d/hope-physicians.conf

# Should have:
# location /api {
#     proxy_pass http://localhost:5000;
# }
```

## 📋 Complete Diagnostic Script

I've created `check-backend.sh` - run it on your server:

```bash
# Copy to server
scp check-backend.sh user@52.66.236.157:~/

# SSH into server
ssh user@52.66.236.157

# Run diagnostic
chmod +x check-backend.sh
./check-backend.sh
```

This will check:

- ✅ PM2 status
- ✅ Port 5000 listening
- ✅ Backend responding locally
- ✅ Backend responding externally
- ✅ Firewall rules
- ✅ Backend logs
- ✅ Configuration files

## 🔧 Manual Troubleshooting

### If Backend is Not Running:

```bash
cd ~/hope-physicians/backend

# Check if server.js exists
ls -la server.js

# Check .env exists
ls -la .env

# Start manually to see errors
node server.js

# If it starts, stop it (Ctrl+C) and start with PM2
pm2 start server.js --name hope-physicians-backend
pm2 save
```

### If Port 5000 is Blocked:

```bash
# Check what's using port 5000
sudo lsof -i :5000

# Kill process if needed
sudo kill -9 <PID>

# Or change port in .env
# PORT=5001
# Then update frontend API URL
```

### If Backend Crashes:

```bash
# Check error logs
pm2 logs hope-physicians-backend --err --lines 100

# Common issues:
# - Database connection failed
# - Missing environment variables
# - Port already in use
# - Prisma client not generated
```

## ✅ Verification Checklist

After fixing, verify:

- [ ] `pm2 status` shows backend as `online`
- [ ] `curl http://localhost:5000/` works
- [ ] `curl http://52.66.236.157:5000/` works (or use Nginx)
- [ ] Frontend timeout increased to 30 seconds
- [ ] No errors in backend logs
- [ ] Firewall allows port 5000 (if direct access)
- [ ] Nginx configured (if using reverse proxy)

## 🎓 Understanding the Error

**Timeout Error = Backend Not Responding**

- ✅ API URL is correct (we fixed that)
- ❌ Backend is not accessible
- 🔍 Need to check: Is it running? Is port open? Is firewall blocking?

**Next Steps:**

1. SSH into server
2. Run `check-backend.sh` diagnostic script
3. Fix the issue (restart backend, open firewall, etc.)
4. Test again

---

**Files Created:**

- ✅ `TIMEOUT_FIX.md` - Detailed troubleshooting guide
- ✅ `check-backend.sh` - Diagnostic script
- ✅ `TIMEOUT_ERROR_SOLUTION.md` - This file
- ✅ Updated `patientFormService.js` - Increased timeout

**Next Action:** Run diagnostic on server to identify the exact issue.
