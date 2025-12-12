# Timeout Error Fix - Backend Not Responding

## Problem

**Error:** `timeout of 10000ms exceeded`

**Root Cause:** Backend is either:

1. Not running on port 5000
2. Not accessible from external IP
3. Firewall blocking port 5000
4. Backend crashed or not started properly

## ✅ Immediate Fixes Applied

### 1. Increased Timeout (✅ Done)

- Changed from 10 seconds to 30 seconds
- Updated in `patientFormService.js`

### 2. Better Error Handling (✅ Done)

- Added status validation
- Better error messages

## 🔍 Diagnostic Steps

### Step 1: Check if Backend is Running

**SSH into your server and run:**

```bash
# Check PM2 status
pm2 status

# Check if backend process is running
pm2 list

# Check backend logs
pm2 logs hope-physicians-backend --lines 50

# Or check logs directly
tail -f ~/hope-physicians/logs/backend-out.log
tail -f ~/hope-physicians/logs/backend-error.log
```

### Step 2: Check if Backend is Listening on Port 5000

```bash
# Check if port 5000 is in use
sudo netstat -tuln | grep 5000
# or
sudo ss -tuln | grep 5000
# or
sudo lsof -i :5000

# Test backend locally on server
curl http://localhost:5000/
# Should return: "HOPE PHYSICIAN API is running..."
```

### Step 3: Check Firewall/Security Groups

```bash
# Check firewall rules
sudo ufw status
# or
sudo firewall-cmd --list-all

# Allow port 5000 if blocked
sudo ufw allow 5000/tcp
# or
sudo firewall-cmd --permanent --add-port=5000/tcp
sudo firewall-cmd --reload
```

### Step 4: Test Backend from External IP

```bash
# From your local machine or another server
curl http://52.66.236.157:5000/
# Should return: "HOPE PHYSICIAN API is running..."
```

If this fails, the firewall is blocking external access.

## 🚀 Production Solutions

### Solution 1: Use Nginx Reverse Proxy (Recommended)

**Why:**

- Backend doesn't need to be exposed directly
- Better security
- No firewall changes needed
- Eliminates CORS issues

**Nginx Config (already in deploy.sh):**

```nginx
location /api {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

**Update Frontend API URL:**

```env
# Use relative path or same domain
VITE_API_URL=/api
# or
VITE_API_URL=http://52.66.236.157/api
```

### Solution 2: Expose Backend Directly (Current Setup)

**If you want to keep direct backend access:**

1. **Ensure backend is running:**

   ```bash
   cd ~/hope-physicians/backend
   pm2 restart hope-physicians-backend
   pm2 save
   ```

2. **Check backend is listening on 0.0.0.0:**

   ```bash
   # Check server.js has:
   app.listen(PORT, '0.0.0.0', () => {
   ```

3. **Open firewall:**

   ```bash
   sudo ufw allow 5000/tcp
   ```

4. **Check security groups (if AWS EC2):**
   - Go to EC2 Console → Security Groups
   - Add inbound rule: Port 5000, Source: 0.0.0.0/0 (or your IP)

### Solution 3: Restart Backend Properly

```bash
# SSH into server
cd ~/hope-physicians/backend

# Stop existing process
pm2 stop hope-physicians-backend
pm2 delete hope-physicians-backend

# Check .env file exists
cat .env
# Should have:
# PORT=5000
# NODE_ENV=production
# CORS_ORIGINS=http://52.66.236.157

# Start backend
pm2 start server.js \
    --name "hope-physicians-backend" \
    --cwd "$(pwd)" \
    --update-env \
    --env production

pm2 save

# Check status
pm2 status
pm2 logs hope-physicians-backend --lines 20
```

## 🔧 Quick Fix Script

Create `check-backend.sh` on your server:

```bash
#!/bin/bash
echo "🔍 Checking Backend Status..."

# Check PM2
echo "📊 PM2 Status:"
pm2 status

# Check Port
echo -e "\n🔌 Port 5000 Status:"
sudo netstat -tuln | grep 5000 || echo "❌ Port 5000 not listening"

# Test Backend
echo -e "\n🌐 Testing Backend:"
curl -s http://localhost:5000/ || echo "❌ Backend not responding"

# Check Logs
echo -e "\n📋 Recent Logs:"
pm2 logs hope-physicians-backend --lines 10 --nostream

# Check Firewall
echo -e "\n🔥 Firewall Status:"
sudo ufw status | grep 5000 || echo "⚠️  Port 5000 not in firewall rules"
```

Run: `chmod +x check-backend.sh && ./check-backend.sh`

## 📋 Complete Checklist

- [ ] Backend is running (check `pm2 status`)
- [ ] Backend is listening on port 5000 (check `netstat` or `ss`)
- [ ] Backend is accessible locally (`curl http://localhost:5000/`)
- [ ] Firewall allows port 5000 (check `ufw` or security groups)
- [ ] Backend is accessible externally (`curl http://52.66.236.157:5000/`)
- [ ] CORS is configured correctly (check backend logs)
- [ ] Frontend timeout increased to 30 seconds
- [ ] Nginx is configured (if using reverse proxy)

## 🎯 Recommended Production Setup

**Best Practice:** Use Nginx reverse proxy

1. **Backend runs on localhost:5000** (not exposed externally)
2. **Nginx proxies `/api` to `localhost:5000`**
3. **Frontend uses `/api` or `http://52.66.236.157/api`**
4. **No firewall changes needed**
5. **Better security**

**Update frontend `.env`:**

```env
VITE_API_URL=/api
```

This way:

- Frontend: `http://52.66.236.157` (port 80)
- API: `http://52.66.236.157/api` (proxied to localhost:5000)
- Backend: `localhost:5000` (not exposed)

## 🐛 Still Not Working?

1. **Check backend logs:**

   ```bash
   pm2 logs hope-physicians-backend --lines 100
   ```

2. **Check for errors:**

   ```bash
   grep -i error ~/hope-physicians/logs/backend-error.log
   ```

3. **Restart everything:**

   ```bash
   pm2 restart all
   sudo systemctl restart nginx
   ```

4. **Verify deployment:**
   ```bash
   cd ~/hope-physicians
   ./check-deployment.sh
   ```

---

**Next Steps:**

1. SSH into server
2. Run diagnostic commands above
3. Fix the issue (restart backend, open firewall, etc.)
4. Test again
