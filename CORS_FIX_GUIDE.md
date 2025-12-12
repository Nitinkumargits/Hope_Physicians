# CORS Fix Guide - Production Ready Solution

## Problem Summary

The application was experiencing CORS errors when the frontend (running on `http://52.66.236.157`) tried to connect to the backend API at `http://localhost:5000`. This is blocked by browsers due to:

1. **Private Network Access Restriction**: Browsers block requests from public IPs to localhost
2. **CORS Policy**: Cross-origin requests need proper CORS configuration
3. **Missing Environment Configuration**: Frontend was using default localhost URL

## Root Cause

1. Frontend defaulting to `http://localhost:5000/api` when `VITE_API_URL` is not set
2. Backend CORS allowing all origins but browser blocking localhost access from remote IP
3. No environment-based configuration for different deployment scenarios

## Solution Implemented

### 1. Backend CORS Configuration (✅ Fixed)

Updated `backend/server.js` with environment-aware CORS:

- **Development**: Allows all origins for easier testing
- **Production**: Uses `CORS_ORIGINS` environment variable
- **Default**: Includes common localhost ports and your server IP

### 2. Environment Configuration Files

Created `.env.example` files for both frontend and backend with proper configuration templates.

## Setup Instructions

### Step 1: Backend Configuration

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Create `.env` file from example:**

   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file:**

   ```env
   NODE_ENV=production
   PORT=5000

   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/hope_physicians

   # JWT Secret (generate a secure random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this

   # CORS - Add your frontend URL(s)
   CORS_ORIGINS=http://52.66.236.157,https://yourdomain.com
   ```

4. **Restart backend server:**
   ```bash
   npm start
   # or
   node server.js
   ```

### Step 2: Frontend Configuration

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Create `.env` file from example:**

   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file:**

   **For Production (Current Setup):**

   ```env
   VITE_API_URL=http://52.66.236.157:5000/api
   ```

   **For Development:**

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Rebuild frontend:**

   ```bash
   npm run build
   ```

5. **Restart frontend server (if using dev server):**
   ```bash
   npm run dev
   ```

### Step 3: Verify Configuration

1. **Check backend is running:**

   ```bash
   curl http://localhost:5000/
   # Should return: "HOPE PHYSICIAN API is running..."
   ```

2. **Check CORS headers:**

   ```bash
   curl -H "Origin: http://52.66.236.157" \
        -H "Access-Control-Request-Method: POST" \
        -H "Access-Control-Request-Headers: Content-Type" \
        -X OPTIONS \
        http://localhost:5000/api/patient-forms/patient-info \
        -v
   ```

   Should see `Access-Control-Allow-Origin: http://52.66.236.157` in response headers.

## Production Deployment Options

### Option 1: Same Server (Recommended for Current Setup)

If both frontend and backend are on the same server (`52.66.236.157`):

**Backend `.env`:**

```env
CORS_ORIGINS=http://52.66.236.157,http://52.66.236.157:80,http://52.66.236.157:443
```

**Frontend `.env`:**

```env
VITE_API_URL=http://52.66.236.157:5000/api
```

### Option 2: Reverse Proxy with Nginx (Best Practice)

Use Nginx to proxy API requests, eliminating CORS issues:

**Nginx Configuration (`/etc/nginx/sites-available/hope-physicians`):**

```nginx
server {
    listen 80;
    server_name 52.66.236.157;

    # Frontend
    root /var/www/hope-physicians/frontend/dist;
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
    }
}
```

**With Nginx, frontend `.env`:**

```env
VITE_API_URL=/api
# or
VITE_API_URL=http://52.66.236.157/api
```

**Backend `.env`:**

```env
CORS_ORIGINS=http://52.66.236.157
```

### Option 3: HTTPS with Domain (Most Secure)

1. **Get SSL certificate** (Let's Encrypt)
2. **Configure domain** (e.g., `hopephysicians.com`)
3. **Update environment variables:**

**Backend `.env`:**

```env
CORS_ORIGINS=https://hopephysicians.com,https://www.hopephysicians.com
```

**Frontend `.env`:**

```env
VITE_API_URL=https://api.hopephysicians.com/api
# or if using same domain:
VITE_API_URL=https://hopephysicians.com/api
```

## Testing the Fix

### Test 1: Check CORS Headers

```bash
curl -I -H "Origin: http://52.66.236.157" \
     http://localhost:5000/api/patient-forms/patient-info
```

Look for:

- `Access-Control-Allow-Origin: http://52.66.236.157`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

### Test 2: Browser Console Test

Open browser console on `http://52.66.236.157` and run:

```javascript
fetch("http://52.66.236.157:5000/api/patient-forms/patient-info", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ test: "data" }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

Should not show CORS errors.

### Test 3: Submit Patient Form

1. Navigate to patient form page
2. Fill out the form
3. Submit
4. Check browser console - should not see CORS errors
5. Check network tab - request should succeed

## Troubleshooting

### Issue: Still getting CORS errors

**Solution 1: Check environment variables are loaded**

```bash
# Backend
node -e "require('dotenv').config(); console.log(process.env.CORS_ORIGINS)"

# Frontend - check build output
npm run build
# Check dist folder for environment variables
```

**Solution 2: Clear browser cache**

- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

**Solution 3: Verify backend is accessible**

```bash
# From server
curl http://localhost:5000/

# From external (if firewall allows)
curl http://52.66.236.157:5000/
```

**Solution 4: Check firewall/security groups**

- Ensure port 5000 is open
- Check if backend is binding to `0.0.0.0` not just `127.0.0.1`

### Issue: Backend not accessible from external IP

**Update server.js to bind to all interfaces:**

```javascript
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Issue: Environment variables not loading

**Ensure dotenv is installed:**

```bash
cd backend
npm install dotenv
```

**Check .env file location:**

- Should be in `backend/.env` (same directory as server.js)

## Security Best Practices

1. **Never commit `.env` files** - Already in `.gitignore`
2. **Use strong JWT secrets** - Generate with: `openssl rand -base64 32`
3. **Limit CORS origins** - Only include trusted domains
4. **Use HTTPS in production** - Required for secure cookies
5. **Rate limiting** - Implement to prevent abuse
6. **Input validation** - Always validate on backend

## Quick Reference

### Development Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: NODE_ENV=development, CORS_ORIGINS=http://localhost:5173
npm start

# Frontend
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Production Setup

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env: NODE_ENV=production, CORS_ORIGINS=http://52.66.236.157
npm start

# Frontend
cd frontend
cp .env.example .env
# Edit .env: VITE_API_URL=http://52.66.236.157:5000/api
npm run build
# Deploy dist folder
```

## Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Express CORS Middleware](https://expressjs.com/en/resources/middleware/cors.html)

---

**Last Updated:** 2024-12-15  
**Status:** ✅ Fixed and Production Ready
