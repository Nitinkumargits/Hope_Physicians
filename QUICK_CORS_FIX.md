# 🚀 Quick CORS Fix - Immediate Solution

## Problem

Frontend on `http://52.66.236.157` cannot connect to backend at `http://localhost:5000` due to CORS and private network restrictions.

## ✅ IMMEDIATE FIX (Do This Now)

### Step 1: Update Backend Environment

Create or edit `backend/.env` file:

```bash
cd backend
nano .env
```

Add these lines:

```env
NODE_ENV=production
PORT=5000
CORS_ORIGINS=http://52.66.236.157,http://52.66.236.157:80,http://52.66.236.157:443
```

### Step 2: Update Frontend Environment

Create or edit `frontend/.env` file:

```bash
cd frontend
nano .env
```

Add this line:

```env
VITE_API_URL=http://52.66.236.157:5000/api
```

### Step 3: Restart Services

**Backend:**

```bash
cd backend
# Stop current server (Ctrl+C if running)
npm start
# or
node server.js
```

**Frontend:**

```bash
cd frontend
# Rebuild with new environment
npm run build
# If using dev server, restart it
npm run dev
```

### Step 4: Verify Backend is Accessible

Test from server:

```bash
curl http://localhost:5000/
```

Test from browser (on `http://52.66.236.157`):

```javascript
// Open browser console and run:
fetch("http://52.66.236.157:5000/api/patient-forms/patient-info", {
  method: "OPTIONS",
  headers: { Origin: "http://52.66.236.157" },
})
  .then((r) =>
    console.log("CORS OK:", r.headers.get("access-control-allow-origin"))
  )
  .catch((e) => console.error("Error:", e));
```

## 🔧 If Backend is Not Accessible from External IP

Update `backend/server.js` line 86:

**Change from:**

```javascript
app.listen(PORT, () => {
```

**Change to:**

```javascript
app.listen(PORT, '0.0.0.0', () => {
```

This makes the server listen on all network interfaces, not just localhost.

## 📋 Complete Environment File Templates

### `backend/.env`

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://username:password@localhost:5432/hope_physicians
JWT_SECRET=your-jwt-secret-here
CORS_ORIGINS=http://52.66.236.157,http://52.66.236.157:80,http://52.66.236.157:443
```

### `frontend/.env`

```env
VITE_API_URL=http://52.66.236.157:5000/api
```

## ✅ Verification Checklist

- [ ] Backend `.env` file created with `CORS_ORIGINS`
- [ ] Frontend `.env` file created with `VITE_API_URL`
- [ ] Backend server restarted
- [ ] Frontend rebuilt (`npm run build`)
- [ ] Backend accessible at `http://52.66.236.157:5000`
- [ ] CORS headers visible in network tab
- [ ] Patient form submission works

## 🐛 Still Not Working?

1. **Check firewall** - Port 5000 must be open
2. **Check backend logs** - Look for CORS warnings
3. **Hard refresh browser** - Ctrl+Shift+R
4. **Check network tab** - Verify request URL is correct
5. **Verify environment variables loaded** - Check console logs

---

**Need more details?** See `CORS_FIX_GUIDE.md` for comprehensive solution.
