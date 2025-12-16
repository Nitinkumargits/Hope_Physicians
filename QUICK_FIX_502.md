# ⚡ Quick Fix for 502 Bad Gateway

## 🚀 Immediate Solution (Run This)

```bash
# SSH into your server
ssh user@52.66.236.157

# Run the fix script
cd ~/hope-physicians
bash fix-502-production.sh
```

The script will automatically:
- ✅ Check backend status
- ✅ Check database connection  
- ✅ Check Nginx configuration
- ✅ Fix any issues
- ✅ Restart services
- ✅ Verify everything works

## 🔧 Manual Quick Fix

If you prefer to fix manually:

```bash
# 1. Restart backend
pm2 restart hope-physicians-backend

# 2. Wait 5 seconds
sleep 5

# 3. Test backend
curl http://localhost:5000/health

# 4. Restart Nginx
sudo systemctl restart nginx

# 5. Test proxy
curl http://localhost/api/health
```

## 📋 What Was Fixed

### Backend (`backend/server.js`)
- ✅ Added `/health` endpoint for monitoring
- ✅ Database connection test on startup
- ✅ Better error handling and graceful shutdown
- ✅ Improved logging

### Frontend (All appointment forms)
- ✅ Better 502 error handling
- ✅ Increased timeout (10s → 30s)
- ✅ Clearer error messages
- ✅ Connection error detection

### Deployment (`deploy.sh`)
- ✅ Health check after backend start
- ✅ Automatic retry logic
- ✅ Better error reporting

## 🎯 Next Steps

1. **Rebuild Frontend** (if not using CI/CD):
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy Backend Changes**:
   ```bash
   cd ~/hope-physicians/backend
   pm2 restart hope-physicians-backend
   ```

3. **Verify**:
   ```bash
   curl http://localhost:5000/health
   curl http://localhost/api/health
   ```

## 📚 Full Documentation

- **Complete Guide:** `PRODUCTION_502_FIX_GUIDE.md`
- **Diagnostics:** `502_ERROR_DIAGNOSTIC.md`
- **Fix Script:** `fix-502-production.sh`

## ✅ Success Indicators

After running the fix, you should see:

```bash
✅ Backend health check: OK
✅ Nginx proxy: OK
✅ Appointments endpoint: OK
```

Test in browser: `http://52.66.236.157/appointment` should work without 502 errors.

