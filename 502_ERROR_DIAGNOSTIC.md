# 🔍 502 Bad Gateway Error - Diagnostic Guide

## Problem
**Error:** `502 Bad Gateway` when submitting appointments at `http://52.66.236.157/appointment`

**What it means:** Nginx is receiving the request but cannot connect to the backend server at `localhost:5000`.

## 🔍 Diagnostic Steps

### Step 1: Check if Backend is Running

**SSH into your server and run:**

```bash
# Check if backend process is running
pm2 status

# Or check if Node.js process is running
ps aux | grep node

# Check if port 5000 is in use
sudo netstat -tuln | grep 5000
# or
sudo ss -tuln | grep 5000
# or
sudo lsof -i :5000
```

**Expected Output:**
- Should see a process listening on port 5000
- If nothing, backend is NOT running

### Step 2: Test Backend Locally

```bash
# Test if backend responds on localhost
curl http://localhost:5000/

# Should return: "HOPE PHYSICIAN API is running..."

# Test the appointments endpoint
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","department":"Family Medicine"}'
```

**If this fails:**
- Backend is not running or crashed
- Check backend logs (see Step 3)

### Step 3: Check Backend Logs

```bash
# If using PM2
pm2 logs hope-physicians-backend --lines 50

# Or check log files directly
tail -f ~/hope-physicians/logs/backend-error.log
tail -f ~/hope-physicians/logs/backend-out.log

# Or if running directly
cd ~/hope-physicians/backend
npm start
# Watch for errors in console
```

**Look for:**
- Database connection errors
- Port already in use errors
- Missing environment variables
- Prisma/client errors
- Any crash messages

### Step 4: Check Nginx Configuration

```bash
# Check Nginx config
sudo nginx -t

# View current Nginx config
sudo cat /etc/nginx/sites-available/hope-physicians
# or
sudo cat /etc/nginx/sites-enabled/hope-physicians

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

**Verify the proxy_pass configuration:**
```nginx
location /api {
    proxy_pass http://localhost:5000;  # Should be this, NOT http://localhost:5000/api
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

**Common Issues:**
- `proxy_pass http://localhost:5000/api;` ❌ (WRONG - adds /api twice)
- `proxy_pass http://localhost:5000;` ✅ (CORRECT)

### Step 5: Test Nginx Proxy

```bash
# Test from server itself
curl http://localhost/api/appointments -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","department":"Family Medicine"}'

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

## 🚀 Quick Fixes

### Fix 1: Restart Backend

```bash
# If using PM2
cd ~/hope-physicians/backend
pm2 restart hope-physicians-backend
# or
pm2 start server.js --name hope-physicians-backend --update-env

# Save PM2 config
pm2 save

# Check status
pm2 status
pm2 logs hope-physicians-backend --lines 20
```

### Fix 2: Start Backend Manually (if not using PM2)

```bash
cd ~/hope-physicians/backend

# Make sure .env file exists
ls -la .env

# Start backend
npm start
# or
node server.js
```

### Fix 3: Fix Nginx Configuration

```bash
# Edit Nginx config
sudo nano /etc/nginx/sites-available/hope-physicians

# Make sure proxy_pass is:
# proxy_pass http://localhost:5000;  (NOT http://localhost:5000/api)

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
# or
sudo service nginx reload
```

### Fix 4: Check Backend Environment Variables

```bash
cd ~/hope-physicians/backend
cat .env
```

**Required variables:**
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
CORS_ORIGINS=http://52.66.236.157,http://52.66.236.157:80
EMAIL_USER=...
EMAIL_PASS=...
```

### Fix 5: Check Database Connection

```bash
# Test database connection
cd ~/hope-physicians/backend
node -e "require('dotenv').config(); const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => { console.log('✅ Database connected'); process.exit(0); }).catch(e => { console.error('❌ Database error:', e); process.exit(1); });"
```

## 🔧 Common Issues & Solutions

### Issue 1: Backend Crashes on Startup

**Symptoms:**
- Backend starts then immediately stops
- PM2 shows "errored" status

**Solutions:**
- Check database connection
- Verify all environment variables are set
- Check Prisma schema is migrated: `npx prisma migrate deploy`
- Check for missing dependencies: `npm install`

### Issue 2: Port 5000 Already in Use

**Symptoms:**
- Error: `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find process using port 5000
sudo lsof -i :5000

# Kill the process
sudo kill -9 <PID>

# Or use a different port
# Edit backend/.env: PORT=5001
# Update Nginx: proxy_pass http://localhost:5001;
```

### Issue 3: Nginx Can't Connect to Backend

**Symptoms:**
- 502 error persists even though backend is running
- Nginx error log shows: `connect() failed (111: Connection refused)`

**Solutions:**
- Verify backend is listening on `0.0.0.0:5000` (not just `127.0.0.1:5000`)
- Check `backend/server.js` has: `app.listen(PORT, '0.0.0.0', ...)`
- Check firewall isn't blocking localhost connections
- Verify backend is actually running: `curl http://localhost:5000/`

### Issue 4: Database Connection Errors

**Symptoms:**
- Backend logs show Prisma connection errors
- Backend crashes when handling requests

**Solutions:**
```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Prisma migrations
cd ~/hope-physicians/backend
npx prisma migrate status

# Run migrations if needed
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

## 📋 Verification Checklist

After applying fixes, verify:

- [ ] Backend is running: `pm2 status` or `ps aux | grep node`
- [ ] Backend responds: `curl http://localhost:5000/`
- [ ] Backend API works: `curl http://localhost:5000/api/appointments -X POST ...`
- [ ] Nginx config is valid: `sudo nginx -t`
- [ ] Nginx proxy works: `curl http://localhost/api/appointments -X POST ...`
- [ ] No errors in logs: `pm2 logs` and `sudo tail /var/log/nginx/error.log`
- [ ] Frontend can connect: Test in browser at `http://52.66.236.157/appointment`

## 🆘 Still Not Working?

If the issue persists:

1. **Check all logs simultaneously:**
   ```bash
   # Terminal 1: Backend logs
   pm2 logs hope-physicians-backend
   
   # Terminal 2: Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Terminal 3: Nginx access logs
   sudo tail -f /var/log/nginx/access.log
   ```

2. **Test the full request flow:**
   ```bash
   # From server
   curl -v http://localhost/api/appointments \
     -X POST \
     -H "Content-Type: application/json" \
     -H "Origin: http://52.66.236.157" \
     -d '{"name":"Test User","email":"test@example.com","phone":"252-522-3663","department":"Family Medicine","preferredDate":"2024-12-25","preferredTime":"10:00 AM"}'
   ```

3. **Check system resources:**
   ```bash
   # Check memory
   free -h
   
   # Check disk space
   df -h
   
   # Check CPU
   top
   ```

## 📞 Support

If you continue to experience issues, provide:
- Backend logs: `pm2 logs hope-physicians-backend --lines 100`
- Nginx error logs: `sudo tail -100 /var/log/nginx/error.log`
- Backend status: `pm2 status`
- Nginx config: `sudo cat /etc/nginx/sites-available/hope-physicians`
- Test results from the diagnostic steps above

