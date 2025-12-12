# 🚀 CI/CD Automated Deployment Guide

## ✅ What's Automated

The CI/CD pipeline now **automatically**:

1. ✅ **Builds Frontend** - On every push to `master`/`main`
2. ✅ **Builds Backend** - Generates Prisma client, runs tests
3. ✅ **Deploys to EC2** - Copies files, runs deployment script
4. ✅ **Configures Nginx** - Sets up reverse proxy automatically
5. ✅ **Restarts Services** - PM2 for backend, Nginx for frontend

## 🔄 Workflow Process

### 1. **Frontend Build** (`full-stack-ci.yml`)

```yaml
- Builds frontend with: npm run build
- No VITE_API_URL needed (uses runtime config)
- Uploads dist/ as artifact
```

**Output:** `frontend/dist/` folder with all built files

### 2. **Backend Build**

```yaml
- Installs dependencies
- Generates Prisma Client
- Uploads backend/ as artifact
```

**Output:** `backend/` folder ready for deployment

### 3. **Deployment**

```yaml
- Copies frontend/dist to ~/hope-physicians/frontend/dist
- Copies backend to ~/hope-physicians/backend
- Runs deploy.sh on server
- Restarts Nginx
```

**Result:** Application live at `http://52.66.236.157`

## 📋 What Happens on Push

When you push code to `master` or `main`:

1. **GitHub Actions triggers** (if files in `backend/`, `frontend/`, or workflow changed)
2. **Frontend builds** → Creates `dist/` folder
3. **Backend builds** → Generates Prisma client
4. **Artifacts uploaded** → Frontend and backend ready
5. **Deploy job runs** → Copies to EC2 server
6. **Deploy script runs** → Sets up PM2, Nginx, permissions
7. **Services restart** → New code is live!

## 🎯 Key Features

### ✅ Automatic Frontend Build

- **No manual build needed** - CI/CD builds it
- **Runtime API config** - No rebuild needed to change API URL
- **Optimized production build** - Minified, optimized assets

### ✅ Automatic Deployment

- **Zero-downtime** - PM2 handles restarts
- **Nginx auto-config** - Reverse proxy set up automatically
- **Permission handling** - Files have correct permissions

### ✅ Verification Steps

The workflow now includes:

```bash
# Verify frontend files copied
ls -la ~/hope-physicians/frontend/dist/

# Restart Nginx
sudo systemctl restart nginx
```

## 🔍 How to Verify Deployment

### 1. Check GitHub Actions

Go to: `https://github.com/YOUR_REPO/actions`

- ✅ All jobs should be green
- ✅ Deploy job should complete successfully

### 2. Check Browser Console

Open: `http://52.66.236.157/portal/login`

**Browser Console should show:**

```
🔧 API Configuration: /api
```

### 3. Check Network Tab

**All requests should be:**

- ✅ `/api/auth/login`
- ✅ `/api/patient-forms/patient-info`
- ❌ NOT `http://localhost:5000/api/...`

### 4. SSH into Server

```bash
# Check frontend files
ls -la ~/hope-physicians/frontend/dist/

# Check Nginx config
sudo nginx -t

# Check PM2
pm2 status

# Check Nginx logs
sudo tail -f /var/log/nginx/hope-physicians-access.log
```

## 🚨 Troubleshooting

### Issue: Frontend not updating

**Check:**

```bash
# On server
ls -la ~/hope-physicians/frontend/dist/
# Should show recent files

# Restart Nginx
sudo systemctl restart nginx
```

### Issue: API calls failing

**Check:**

1. Browser console → Should show `/api`
2. Network tab → All requests should be `/api/...`
3. Nginx config → Should proxy `/api` to `localhost:5000`

### Issue: Build fails in CI

**Check:**

- GitHub Actions logs
- Frontend build errors
- Missing dependencies

## 📝 Manual Deployment (If Needed)

If CI/CD fails, you can deploy manually:

```bash
# 1. Build frontend locally
cd frontend
npm run build

# 2. Copy to server
scp -r dist/* user@52.66.236.157:~/hope-physicians/frontend/dist/

# 3. SSH and restart
ssh user@52.66.236.157
cd ~/hope-physicians
bash deploy.sh
```

## ✅ What Changed

### Updated Files:

1. **`.github/workflows/full-stack-ci.yml`**

   - ✅ Removed `VITE_API_URL` from build (using runtime config)
   - ✅ Added frontend deployment verification
   - ✅ Added Nginx restart after deployment
   - ✅ Added path filters to prevent unnecessary runs

2. **`deploy.sh`**
   - ✅ Better handling of CI-built frontend
   - ✅ Verification of API config in index.html
   - ✅ Improved error messages

## 🎉 Benefits

1. **No Manual Steps** - Push code, everything deploys automatically
2. **Consistent Builds** - Same build process every time
3. **Fast Deployment** - Only deploys when files change
4. **Easy Rollback** - Can revert commits to rollback
5. **Production Ready** - Optimized builds, proper configs

---

**Status:** ✅ Fully Automated
**Next:** Just push code, deployment happens automatically!
