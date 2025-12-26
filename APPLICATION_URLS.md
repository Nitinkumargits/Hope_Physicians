# 🌐 Application URLs and Ports

## 📍 Both Applications Run on the Same EC2 Instance

Both **Hope Physicians** and **Ojoto Union** are deployed on the **same EC2 instance** using different ports and paths.

---

## 🏥 Hope Physicians

### Backend:
- **Internal Port:** `5000` (localhost:5000)
- **Accessible via:** `http://YOUR_EC2_IP/api`
- **Direct Backend URL:** `http://YOUR_EC2_IP:5000` (if security group allows)

### Frontend:
- **URL:** `http://YOUR_EC2_IP/`
- **Path:** `/` (root path)
- **Served by:** Nginx on port 80

### API Endpoints:
- **Base URL:** `http://YOUR_EC2_IP/api`
- **Example:** `http://YOUR_EC2_IP/api/auth/login`
- **Proxied to:** `http://localhost:5000` (backend)

---

## 🏛️ Ojoto Union NA

### Backend:
- **Internal Port:** `5001` (localhost:5001)
- **Accessible via:** `http://YOUR_EC2_IP/ojoto-union/api`
- **Direct Backend URL:** `http://YOUR_EC2_IP:5001` (if security group allows)

### Frontend:
- **URL:** `http://YOUR_EC2_IP/ojoto-union`
- **Path:** `/ojoto-union` (sub-path)
- **Served by:** Nginx on port 80

### API Endpoints:
- **Base URL:** `http://YOUR_EC2_IP/ojoto-union/api`
- **Example:** `http://YOUR_EC2_IP/ojoto-union/api/auth/login`
- **Proxied to:** `http://localhost:5001` (backend)

---

## 🔍 How to Find Your EC2 IP

### Option 1: AWS Console
1. Go to: https://console.aws.amazon.com/ec2/
2. Click **"Instances"**
3. Find your instance
4. Look at **"Public IPv4 address"** column
5. That's your `YOUR_EC2_IP`

### Option 2: GitHub Secrets
1. Go to: https://github.com/infofitsoftwaresolution/hope_physician/settings/secrets/actions
2. Check the `EC2_HOST` secret value
3. That's your `YOUR_EC2_IP`

---

## 📊 Port Summary

| Application | Backend Port | Frontend Path | API Path | Nginx Port |
|------------|-------------|---------------|----------|------------|
| **Hope Physicians** | 5000 | `/` | `/api` | 80 |
| **Ojoto Union** | 5001 | `/ojoto-union` | `/ojoto-union/api` | 80 |

---

## 🌐 Complete URLs (Replace `YOUR_EC2_IP` with your actual IP)

### Hope Physicians:
- **Frontend:** `http://YOUR_EC2_IP/`
- **API:** `http://YOUR_EC2_IP/api`
- **Backend Direct:** `http://YOUR_EC2_IP:5000` (internal only)

### Ojoto Union:
- **Frontend:** `http://YOUR_EC2_IP/ojoto-union`
- **API:** `http://YOUR_EC2_IP/ojoto-union/api`
- **Backend Direct:** `http://YOUR_EC2_IP:5001` (internal only)

---

## 🔒 Security Group Requirements

Your EC2 security group must allow:

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend access |
| HTTPS | TCP | 443 | 0.0.0.0/0 | HTTPS (if configured) |
| SSH | TCP | 22 | Your IP | SSH access |
| Custom TCP | TCP | 5000 | 127.0.0.1 | Hope Physicians backend (internal) |
| Custom TCP | TCP | 5001 | 127.0.0.1 | Ojoto Union backend (internal) |

**Note:** Ports 5000 and 5001 are only accessible from localhost (Nginx proxy). They don't need to be open to the internet.

---

## 🧪 Testing URLs

### Hope Physicians:
```bash
# Frontend
curl http://YOUR_EC2_IP/

# API Health Check
curl http://YOUR_EC2_IP/api/health
```

### Ojoto Union:
```bash
# Frontend
curl http://YOUR_EC2_IP/ojoto-union

# API Health Check
curl http://YOUR_EC2_IP/ojoto-union/api/health
```

---

## 📝 Example with IP `52.66.236.157`

### Hope Physicians:
- Frontend: `http://52.66.236.157/`
- API: `http://52.66.236.157/api`

### Ojoto Union:
- Frontend: `http://52.66.236.157/ojoto-union`
- API: `http://52.66.236.157/ojoto-union/api`

---

## 🔧 How It Works

1. **Nginx** listens on port 80 (HTTP)
2. **Hope Physicians** backend runs on port 5000 (localhost only)
3. **Ojoto Union** backend runs on port 5001 (localhost only)
4. **Nginx** routes:
   - `/` → Hope Physicians frontend
   - `/api` → Hope Physicians backend (port 5000)
   - `/ojoto-union` → Ojoto Union frontend
   - `/ojoto-union/api` → Ojoto Union backend (port 5001)

Both applications share the same EC2 instance and public IP address!

