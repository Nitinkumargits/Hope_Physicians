# 🚨 IMMEDIATE FIX - Frontend Still Using Localhost

## Problem

Your frontend build is still trying to connect to `http://localhost:5000/api` instead of `http://52.66.236.157:5000/api`.

**Error:** `Access to XMLHttpRequest at 'http://localhost:5000/api/patient-forms/patient-info' from origin 'http://52.66.236.157' has been blocked by CORS policy`

## ✅ Solution (Do This Now)

### Step 1: Create Frontend `.env` File

**On your server, run:**

```bash
cd /path/to/Hope_Physicians/frontend
```

**Create `.env` file:**

```bash
cat > .env << 'EOF'
VITE_API_URL=http://52.66.236.157:5000/api
EOF
```

**Or manually create `frontend/.env` with:**

```env
VITE_API_URL=http://52.66.236.157:5000/api
```

### Step 2: Rebuild Frontend (CRITICAL!)

**Vite requires a rebuild to pick up environment variables:**

```bash
cd frontend
npm run build
```

**This will create a new `dist` folder with the correct API URL.**

### Step 3: Deploy the New Build

**If using a web server (Nginx/Apache):**

```bash
# Copy new build to web server directory
cp -r frontend/dist/* /var/www/html/
# or wherever your web server serves files from
```

**If using a dev server:**

```bash
# Stop current dev server (Ctrl+C)
# Restart it
npm run dev
```

### Step 4: Clear Browser Cache

**Important:** Clear browser cache or do hard refresh:

- **Windows/Linux:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`

Or clear cache completely in browser settings.

## 🔍 Verify It's Fixed

1. **Check the built files:**

   ```bash
   # Search for localhost in the built files
   grep -r "localhost:5000" frontend/dist/
   # Should return nothing (or only in comments)
   ```

2. **Check browser console:**

   - Open `http://52.66.236.157`
   - Open Developer Tools (F12)
   - Go to Network tab
   - Submit patient form
   - Check the request URL - should be `http://52.66.236.157:5000/api/...`
   - Should NOT be `http://localhost:5000/api/...`

3. **Test in browser console:**
   ```javascript
   // Should show the correct URL
   console.log(import.meta.env.VITE_API_URL);
   // Should output: http://52.66.236.157:5000/api
   ```

## ⚠️ Why This Happens

**Vite embeds environment variables at BUILD TIME, not runtime.**

- ❌ Just creating `.env` file is NOT enough
- ❌ Restarting dev server is NOT enough (if using built files)
- ✅ You MUST run `npm run build` after creating/updating `.env`

## 🎯 Alternative: Runtime Configuration (No Rebuild Needed)

If you need to change the API URL without rebuilding, you can use a runtime configuration:

### Option 1: Use `window` object (Quick Fix)

**Update `frontend/src/services/patientFormService.js`:**

```javascript
// Get API URL from window config or environment
const getApiUrl = () => {
  // Check for runtime config (set in index.html)
  if (window.APP_CONFIG && window.APP_CONFIG.API_URL) {
    return window.APP_CONFIG.API_URL;
  }
  // Fall back to environment variable
  return import.meta.env.VITE_API_URL || "http://52.66.236.157:5000/api";
};

const API_BASE_URL = getApiUrl();
```

**Then in `frontend/index.html`, add before closing `</head>`:**

```html
<script>
  window.APP_CONFIG = {
    API_URL: "http://52.66.236.157:5000/api",
  };
</script>
```

This way you can change the API URL by editing `index.html` without rebuilding.

### Option 2: Use Public Config File

Create `frontend/public/config.js`:

```javascript
window.APP_CONFIG = {
  API_URL: "http://52.66.236.157:5000/api",
};
```

Add to `frontend/index.html` before closing `</head>`:

```html
<script src="/config.js"></script>
```

Update service to use it (same as Option 1).

## 📋 Complete Checklist

- [ ] Created `frontend/.env` file with `VITE_API_URL=http://52.66.236.157:5000/api`
- [ ] Ran `npm run build` in frontend directory
- [ ] Deployed new `dist` folder to web server
- [ ] Cleared browser cache
- [ ] Tested form submission
- [ ] Verified Network tab shows correct API URL
- [ ] No more CORS errors

## 🐛 Still Not Working?

1. **Check if .env file exists:**

   ```bash
   ls -la frontend/.env
   cat frontend/.env
   ```

2. **Verify build picked up the variable:**

   ```bash
   grep -r "52.66.236.157" frontend/dist/
   # Should find the URL in built files
   ```

3. **Check if using correct build:**

   - Make sure web server is serving from `frontend/dist/`
   - Not from `frontend/src/` or old build

4. **Check backend is accessible:**

   ```bash
   curl http://52.66.236.157:5000/
   # Should return: "HOPE PHYSICIAN API is running..."
   ```

5. **Check backend CORS:**
   ```bash
   curl -H "Origin: http://52.66.236.157" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS \
        http://52.66.236.157:5000/api/patient-forms/patient-info \
        -v
   ```

---

**Quick Command Summary:**

```bash
# 1. Create .env
echo "VITE_API_URL=http://52.66.236.157:5000/api" > frontend/.env

# 2. Rebuild
cd frontend && npm run build

# 3. Deploy (adjust path to your web server)
sudo cp -r frontend/dist/* /var/www/html/

# 4. Test
curl http://52.66.236.157:5000/
```
