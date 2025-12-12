# ⚡ Quick Fix - Network Error (Connection Timeout)

## 🔴 Error

```
ERR_CONNECTION_TIMED_OUT
POST http://52.66.236.157:5000/api/patient-forms/patient-info
```

## ✅ Solution: Use Nginx Reverse Proxy

**Changed:** Frontend now uses `/api` instead of `http://52.66.236.157:5000/api`

### Why This Works:

- ✅ No firewall changes needed
- ✅ Backend stays secure on localhost
- ✅ Standard production practice
- ✅ Eliminates timeout issues

## 🚀 Quick Steps

### 1. Rebuild Frontend

```bash
cd frontend
npm run build
```

### 2. Deploy to Server

```bash
# Copy dist/ to Nginx web root
# (Check your deploy.sh for exact path)
```

### 3. Verify Nginx Config

**SSH into server:**

```bash
# Check Nginx has /api proxy
sudo grep -A 5 "location /api" /etc/nginx/sites-available/hope-physicians

# Should show:
# location /api {
#     proxy_pass http://localhost:5000;
# }
```

### 4. Restart Nginx

```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 5. Test

```bash
# Test API
curl http://52.66.236.157/api/
# Should return: "HOPE PHYSICIAN API is running..."
```

## ✅ What Changed

- ✅ `frontend/index.html` - Uses `/api` for production
- ✅ `frontend/src/services/patientFormService.js` - Uses `/api` for production
- ✅ Timeout increased to 30 seconds

## 🎯 Result

After rebuild and deploy:

- Frontend calls: `POST /api/patient-forms/patient-info`
- Nginx proxies to: `http://localhost:5000/api/patient-forms/patient-info`
- Backend processes request
- Response returns through Nginx
- ✅ Form submission works!

---

**Next:** Rebuild frontend and deploy. See `FINAL_SOLUTION_SUMMARY.md` for details.
