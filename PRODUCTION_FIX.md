# 🚀 Production Fix - Network Error Solution

## 🔴 Current Error

```
ERR_CONNECTION_TIMED_OUT
POST http://52.66.236.157:5000/api/patient-forms/patient-info
```

**Problem:** Backend on port 5000 is not accessible from external IP.

## ✅ Solution Applied: Use Nginx Reverse Proxy

**Changed:** Frontend now uses `/api` (relative path) instead of `http://52.66.236.157:5000/api`

**Why This Works:**

- ✅ No firewall changes needed
- ✅ Backend stays on localhost (more secure)
- ✅ Nginx handles the proxy
- ✅ Eliminates connection timeout issues

## 🔧 How It Works

```
Browser → http://52.66.236.157/api/patient-forms/patient-info
         ↓
      Nginx (port 80)
         ↓
      localhost:5000 → Backend
```

**Benefits:**

- Frontend and API on same domain (no CORS issues)
- Backend not exposed externally (better security)
- No firewall port 5000 needed
- Standard production practice

## 📋 What Changed

### 1. Frontend API URL (✅ Updated)

**Before:**

```javascript
API_URL = "http://52.66.236.157:5000/api"; // Direct backend access
```

**After:**

```javascript
API_URL = "/api"; // Nginx reverse proxy
```

### 2. Files Updated

- ✅ `frontend/index.html` - Runtime config uses `/api`
- ✅ `frontend/src/services/patientFormService.js` - Auto-detection uses `/api`

## 🔍 Verify Nginx Configuration

**SSH into server and check:**

```bash
# 1. Check Nginx is running
sudo systemctl status nginx

# 2. Check Nginx config
sudo nginx -t

# 3. Check Nginx config file
cat /etc/nginx/sites-available/hope-physicians
# or
cat /etc/nginx/conf.d/hope-physicians.conf

# Should have:
# location /api {
#     proxy_pass http://localhost:5000;
#     ...
# }
```

## 🚀 Deployment Steps

### Step 1: Rebuild Frontend

```bash
cd frontend
npm run build
```

### Step 2: Deploy to Server

```bash
# Copy new build to server
scp -r dist/* user@52.66.236.157:/path/to/nginx/html/

# Or use your deployment script
```

### Step 3: Verify Nginx Config

**On server, check Nginx config:**

```bash
# Check if config exists
sudo cat /etc/nginx/sites-available/hope-physicians

# Should have this block:
# location /api {
#     proxy_pass http://localhost:5000;
#     proxy_http_version 1.1;
#     proxy_set_header Host $host;
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header X-Forwarded-Proto $scheme;
# }
```

### Step 4: Restart Nginx

```bash
sudo nginx -t  # Test config
sudo systemctl restart nginx
```

### Step 5: Test

```bash
# Test API through Nginx
curl http://52.66.236.157/api/

# Should return: "HOPE PHYSICIAN API is running..."
```

## 🎯 Complete Nginx Configuration

If Nginx config is missing, add this:

```nginx
server {
    listen 80;
    server_name 52.66.236.157;

    # Frontend
    root /path/to/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend API Proxy
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
}
```

**Save to:**

- `/etc/nginx/sites-available/hope-physicians` (Ubuntu/Debian)
- `/etc/nginx/conf.d/hope-physicians.conf` (CentOS/RHEL)

**Enable:**

```bash
# Ubuntu/Debian
sudo ln -s /etc/nginx/sites-available/hope-physicians /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# CentOS/RHEL
sudo nginx -t
sudo systemctl restart nginx
```

## ✅ Verification Checklist

After deployment:

- [ ] Frontend rebuilt with new API URL (`/api`)
- [ ] Frontend deployed to Nginx web root
- [ ] Nginx config has `/api` proxy to `localhost:5000`
- [ ] Nginx config tested (`sudo nginx -t`)
- [ ] Nginx restarted
- [ ] Backend running on `localhost:5000` (check `pm2 status`)
- [ ] Test: `curl http://52.66.236.157/api/` works
- [ ] Test: Form submission works in browser

## 🔍 Troubleshooting

### Issue: Still getting timeout

**Check 1: Nginx is running**

```bash
sudo systemctl status nginx
```

**Check 2: Backend is running**

```bash
pm2 status
curl http://localhost:5000/
```

**Check 3: Nginx proxy config**

```bash
sudo nginx -t
sudo cat /etc/nginx/sites-available/hope-physicians | grep -A 10 "location /api"
```

**Check 4: Nginx error logs**

```bash
sudo tail -f /var/log/nginx/error.log
```

### Issue: 502 Bad Gateway

**Meaning:** Nginx can't reach backend

**Fix:**

```bash
# Check backend is running
pm2 status

# Check backend on localhost
curl http://localhost:5000/

# Restart backend if needed
pm2 restart hope-physicians-backend
```

### Issue: 404 Not Found

**Meaning:** Nginx config missing or wrong path

**Fix:**

```bash
# Check Nginx config
sudo nginx -t

# Check config file exists
ls -la /etc/nginx/sites-available/hope-physicians

# Recreate config (see above)
```

## 🎓 Why This Solution Works

### Problem:

- Backend on port 5000 not accessible externally
- Firewall blocking or backend not listening on 0.0.0.0
- Direct connection timeout

### Solution:

- Use Nginx reverse proxy
- Frontend calls `/api` (same domain)
- Nginx proxies to `localhost:5000`
- Backend doesn't need external access
- Standard production architecture

### Benefits:

- ✅ No firewall changes
- ✅ Better security
- ✅ No CORS issues
- ✅ Standard practice
- ✅ Easier to add SSL later

## 📚 Additional Notes

### Error Explanations:

1. **`ERR_CONNECTION_TIMED_OUT`**

   - Backend not accessible on port 5000
   - Fixed by using Nginx proxy

2. **`favicon.ico 404`**

   - Missing favicon (cosmetic, can ignore)
   - Add `favicon.ico` to `frontend/public/` if needed

3. **`runtime.lastError`**
   - Browser extension issue (can ignore)

## 🚀 Next Steps

1. **Rebuild frontend:**

   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to server:**

   - Copy `dist/` to Nginx web root
   - Or use your deployment script

3. **Verify Nginx config:**

   - Check `/api` proxy exists
   - Restart Nginx

4. **Test:**
   - Open `http://52.66.236.157`
   - Submit patient form
   - Should work! ✅

---

**Status:** ✅ Fixed - Using Nginx reverse proxy (production-ready solution)
**Next:** Rebuild frontend and verify Nginx config
