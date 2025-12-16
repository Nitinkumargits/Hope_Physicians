# 🚀 Production-Level 502 Bad Gateway Fix Guide

## Overview

This guide provides a **comprehensive, production-ready solution** for fixing the 502 Bad Gateway error when submitting appointments at `http://52.66.236.157/appointment`.

## 🔍 Root Cause Analysis

The 502 error occurs when:
1. **Nginx** receives the request at `/api/appointments`
2. **Nginx** tries to proxy to `http://localhost:5000/api/appointments`
3. **Backend** is either:
   - Not running
   - Crashed after startup
   - Not listening on port 5000
   - Database connection failed
   - Out of memory

## ✅ Solutions Implemented

### 1. **Backend Health Check Endpoint** ✅

**File:** `backend/server.js`

- Added `/health` endpoint that checks:
  - Database connectivity
  - Server uptime
  - Environment status
- Returns `200 OK` if healthy, `503 Service Unavailable` if unhealthy
- Used by monitoring tools and load balancers

**Usage:**
```bash
curl http://localhost:5000/health
# Returns: {"status":"healthy","database":"connected",...}
```

### 2. **Improved Backend Startup** ✅

**File:** `backend/server.js`

**Improvements:**
- ✅ Database connection test before starting server
- ✅ Graceful shutdown handling (SIGTERM, SIGINT)
- ✅ Uncaught exception handling
- ✅ Unhandled promise rejection handling
- ✅ Better error logging
- ✅ Process exits with proper error codes

**Before:**
```javascript
app.listen(PORT, HOST, () => {
  console.log(`Server running...`);
});
```

**After:**
```javascript
async function startServer() {
  // Test database connection first
  await prisma.$connect();
  
  // Start server with error handling
  const server = app.listen(PORT, HOST, () => {
    console.log(`Server running...`);
  });
  
  // Graceful shutdown
  process.on("SIGTERM", gracefulShutdown);
  // ... more error handling
}
```

### 3. **Enhanced Frontend Error Handling** ✅

**Files Updated:**
- `frontend/src/api/appointmentApi.js`
- `frontend/src/pages/Appointment.jsx`
- `frontend/src/components/AppointmentForm.jsx`
- `frontend/src/pages/Doctors.jsx`
- `frontend/src/pages/Departments.jsx`
- `frontend/src/pages/patient/BookAppointment.jsx`

**Improvements:**
- ✅ Specific handling for 502 errors
- ✅ Connection error detection
- ✅ Increased timeout (10s → 30s)
- ✅ Better error messages for users
- ✅ Detailed logging for debugging

### 4. **Production Fix Script** ✅

**File:** `fix-502-production.sh`

**Features:**
- ✅ Comprehensive diagnostics
- ✅ Automatic issue detection
- ✅ Automatic fixes
- ✅ Health check verification
- ✅ Service restart
- ✅ Detailed status reporting

## 🚀 Quick Fix (Run This Now)

### Option 1: Use the Fix Script (Recommended)

```bash
# SSH into your server
ssh user@52.66.236.157

# Make script executable
chmod +x fix-502-production.sh

# Run the fix script
bash fix-502-production.sh
```

The script will:
1. Check backend status
2. Check database connection
3. Check Nginx configuration
4. Fix any issues found
5. Verify everything works

### Option 2: Manual Fix

```bash
# 1. Check backend status
pm2 status
pm2 logs hope-physicians-backend --lines 50

# 2. Restart backend
cd ~/hope-physicians/backend
pm2 restart hope-physicians-backend

# 3. Test backend
curl http://localhost:5000/health

# 4. Restart Nginx
sudo systemctl restart nginx

# 5. Test proxy
curl http://localhost/api/health
```

## 📋 Step-by-Step Production Deployment

### Step 1: Rebuild Frontend

The frontend needs to be rebuilt with the new error handling:

```bash
cd frontend
npm run build
```

**Or** if using CI/CD, push the changes and let GitHub Actions build it.

### Step 2: Deploy Backend Changes

```bash
# SSH into server
ssh user@52.66.236.157

# Navigate to backend
cd ~/hope-physicians/backend

# Pull latest changes (if using git)
git pull origin main

# Install dependencies (if needed)
npm install

# Generate Prisma client
npx prisma generate

# Restart backend
pm2 restart hope-physicians-backend

# Check status
pm2 status
pm2 logs hope-physicians-backend --lines 20
```

### Step 3: Verify Health Check

```bash
# Test backend directly
curl http://localhost:5000/health

# Should return:
# {"status":"healthy","database":"connected",...}

# Test through Nginx proxy
curl http://localhost/api/health

# Should return the same JSON
```

### Step 4: Test Appointments Endpoint

```bash
# Test appointment submission
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "252-522-3663",
    "department": "Family Medicine",
    "preferredDate": "2024-12-25",
    "preferredTime": "10:00 AM"
  }'

# Should return:
# {"message":"Appointment submitted successfully.",...}
```

## 🔧 Common Issues & Solutions

### Issue 1: Backend Crashes on Startup

**Symptoms:**
- PM2 shows "errored" status
- Backend logs show database connection errors

**Solution:**
```bash
# Check database connection
cd ~/hope-physicians/backend
node -e "
  require('dotenv').config();
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  prisma.\$connect()
    .then(() => { console.log('OK'); prisma.\$disconnect(); })
    .catch(e => { console.error('ERROR:', e.message); });
"

# If database connection fails:
# 1. Check DATABASE_URL in .env
# 2. Verify database is running
# 3. Check network connectivity
```

### Issue 2: Port 5000 Already in Use

**Symptoms:**
- Error: `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port 5000
sudo lsof -i :5000
# or
sudo netstat -tuln | grep 5000

# Kill the process
sudo kill -9 <PID>

# Or restart PM2
pm2 restart hope-physicians-backend
```

### Issue 3: Nginx Can't Connect to Backend

**Symptoms:**
- 502 error persists
- Nginx error log: `connect() failed (111: Connection refused)`

**Solution:**
```bash
# Verify backend is listening on 0.0.0.0:5000
sudo netstat -tuln | grep 5000
# Should show: 0.0.0.0:5000 (not 127.0.0.1:5000)

# Check backend/server.js has:
# app.listen(PORT, '0.0.0.0', ...)

# Verify Nginx proxy_pass
sudo cat /etc/nginx/sites-available/hope-physicians | grep proxy_pass
# Should show: proxy_pass http://localhost:5000;
```

### Issue 4: Out of Memory

**Symptoms:**
- Backend crashes after running for a while
- PM2 restarts frequently

**Solution:**
```bash
# Check memory usage
free -h
pm2 monit

# Backend is already configured with memory limits:
# --max-memory-restart 400M
# --node-args="--max-old-space-size=384"

# If still having issues, reduce limits:
pm2 restart hope-physicians-backend --update-env \
  --max-memory-restart 300M \
  --node-args="--max-old-space-size=256"
```

## 📊 Monitoring & Maintenance

### Health Check Monitoring

Set up a cron job to monitor backend health:

```bash
# Add to crontab: crontab -e
# Check every 5 minutes
*/5 * * * * curl -f http://localhost:5000/health > /dev/null 2>&1 || pm2 restart hope-physicians-backend
```

### Log Monitoring

```bash
# Watch backend logs
pm2 logs hope-physicians-backend

# Watch Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check for 502 errors
sudo grep "502" /var/log/nginx/error.log | tail -20
```

### Performance Monitoring

```bash
# PM2 monitoring
pm2 monit

# Check process status
pm2 status

# Check memory usage
pm2 list
```

## 🎯 Production Checklist

Before going live, verify:

- [ ] Backend health check works: `curl http://localhost:5000/health`
- [ ] Nginx proxy works: `curl http://localhost/api/health`
- [ ] Appointments endpoint works: `curl -X POST http://localhost:5000/api/appointments ...`
- [ ] Frontend can submit appointments (test in browser)
- [ ] PM2 auto-restart is enabled: `pm2 startup`
- [ ] Nginx is configured correctly
- [ ] Database connection is stable
- [ ] Error logs are being monitored
- [ ] Health check monitoring is set up

## 🆘 Emergency Recovery

If the backend is completely down:

```bash
# 1. Stop everything
pm2 stop all
sudo systemctl stop nginx

# 2. Check logs
pm2 logs hope-physicians-backend --lines 100
tail -100 ~/hope-physicians/logs/backend-error.log

# 3. Fix issues (database, dependencies, etc.)

# 4. Restart backend
cd ~/hope-physicians/backend
pm2 start server.js --name hope-physicians-backend --update-env

# 5. Wait for health check
sleep 10
curl http://localhost:5000/health

# 6. Restart Nginx
sudo systemctl start nginx

# 7. Verify
curl http://localhost/api/health
```

## 📞 Support

If issues persist after following this guide:

1. **Collect Diagnostics:**
   ```bash
   # Run the fix script
   bash fix-502-production.sh > diagnostics.txt 2>&1
   
   # Collect logs
   pm2 logs hope-physicians-backend --lines 100 > backend-logs.txt
   sudo tail -100 /var/log/nginx/error.log > nginx-errors.txt
   ```

2. **Check:**
   - Backend health: `curl http://localhost:5000/health`
   - Database connection
   - Nginx configuration: `sudo nginx -t`
   - System resources: `free -h`, `df -h`

3. **Review:**
   - `502_ERROR_DIAGNOSTIC.md` for detailed troubleshooting
   - Backend logs for specific errors
   - Nginx logs for proxy issues

## ✅ Summary

**What Was Fixed:**
1. ✅ Backend health check endpoint
2. ✅ Improved backend startup with database connection test
3. ✅ Graceful error handling and shutdown
4. ✅ Enhanced frontend error handling
5. ✅ Production fix script
6. ✅ Better logging and diagnostics

**Next Steps:**
1. Rebuild frontend with new error handling
2. Deploy backend changes
3. Run fix script: `bash fix-502-production.sh`
4. Verify health checks work
5. Test appointment submission
6. Set up monitoring

**Result:**
- ✅ Backend is more stable
- ✅ Better error messages for users
- ✅ Easier troubleshooting
- ✅ Production-ready monitoring

