# Multi-Application Deployment Guide

This guide explains how to deploy **two applications** on a single EC2 instance.

## 📋 Overview

The multi-app deployment system allows you to:
- Deploy multiple applications on one EC2 instance
- Run multiple backends on different ports
- Serve multiple frontends through Nginx
- Manage all apps with PM2

## 🏗️ Architecture

```
EC2 Instance
├── Application 1 (Hope Physicians)
│   ├── Backend (Port 5000)
│   └── Frontend (served at /)
├── Application 2
│   ├── Backend (Port 5001)
│   └── Frontend (served at /app2)
└── Nginx (Port 80)
    ├── Routes / → App 1 Frontend
    ├── Routes /api → App 1 Backend (Port 5000)
    ├── Routes /app2 → App 2 Frontend
    └── Routes /app2/api → App 2 Backend (Port 5001)
```

## 📝 Configuration

### Step 1: Update `apps.config.json`

Edit `apps.config.json` to configure your applications:

```json
{
  "apps": [
    {
      "name": "hope-physicians",
      "displayName": "Hope Physicians",
      "repo": "https://github.com/infofitsoftwaresolution/hope_physician.git",
      "directory": "/home/ubuntu/hope-physicians",
      "backend": {
        "directory": "backend",
        "port": 5000,
        "script": "server.js"
      },
      "frontend": {
        "directory": "frontend",
        "buildCommand": "npm run build",
        "distDirectory": "dist"
      },
      "nginx": {
        "serverName": "_",
        "frontendPath": "/",
        "apiPath": "/api"
      }
    },
    {
      "name": "app2",
      "displayName": "Your Second App",
      "repo": "https://github.com/username/your-second-app.git",
      "directory": "/home/ubuntu/app2",
      "backend": {
        "directory": "backend",
        "port": 5001,
        "script": "server.js"
      },
      "frontend": {
        "directory": "frontend",
        "buildCommand": "npm run build",
        "distDirectory": "dist"
      },
      "nginx": {
        "serverName": "_",
        "frontendPath": "/app2",
        "apiPath": "/app2/api"
      }
    }
  ]
}
```

### Step 2: Setup Second Application on EC2

SSH into your EC2 instance and run:

```bash
# Clone the setup script
cd ~
wget https://raw.githubusercontent.com/infofitsoftwaresolution/hope_physician/master/setup-second-app.sh
chmod +x setup-second-app.sh

# Setup second app
./setup-second-app.sh https://github.com/username/your-second-app.git
```

Or manually:

```bash
# Create directory
mkdir -p ~/app2
cd ~/app2

# Clone your second app
git clone https://github.com/username/your-second-app.git .

# Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

## 🚀 Deployment

### Option 1: Automatic Deployment (GitHub Actions)

1. **Update GitHub Secrets** (if needed for second app):
   - `APP2_REPO_URL` - Repository URL for second app
   - `APP2_JWT_SECRET` - JWT secret for second app (if different)
   - Other app-specific secrets

2. **Push to master branch**:
   ```bash
   git push new-origin master
   ```

   The workflow will:
   - Build both applications
   - Deploy to EC2
   - Configure Nginx
   - Start all backends with PM2

### Option 2: Manual Deployment

SSH into EC2 and run:

```bash
cd ~/hope-physicians
chmod +x deploy-multi-app.sh
./deploy-multi-app.sh
```

## 🔧 PM2 Management

### View all applications:
```bash
pm2 status
```

### View logs:
```bash
# All apps
pm2 logs

# Specific app
pm2 logs hope-physicians-backend
pm2 logs app2-backend
```

### Restart applications:
```bash
# Restart all
pm2 restart all

# Restart specific app
pm2 restart hope-physicians-backend
pm2 restart app2-backend
```

### Stop applications:
```bash
pm2 stop all
pm2 stop hope-physicians-backend
```

## 🌐 Nginx Configuration

Nginx automatically routes:
- `http://your-ec2-ip/` → App 1 Frontend
- `http://your-ec2-ip/api` → App 1 Backend (Port 5000)
- `http://your-ec2-ip/app2` → App 2 Frontend
- `http://your-ec2-ip/app2/api` → App 2 Backend (Port 5001)

### View Nginx config:
```bash
sudo cat /etc/nginx/sites-available/multi-app
```

### Reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🔍 Troubleshooting

### Application not starting:
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs <app-name>-backend

# Check if port is in use
sudo lsof -i :5000
sudo lsof -i :5001
```

### Nginx not routing correctly:
```bash
# Test Nginx config
sudo nginx -t

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

### Port conflicts:
- Ensure each app uses a different port
- Update `apps.config.json` with unique ports
- Check firewall: `sudo ufw status`

## 📊 Monitoring

### PM2 Monitoring:
```bash
pm2 monit
```

### System Resources:
```bash
htop
```

### Disk Space:
```bash
df -h
```

## 🔐 Security Considerations

1. **Different JWT Secrets**: Use different JWT secrets for each app
2. **Environment Variables**: Keep app-specific env vars separate
3. **Database**: Use separate databases for each app
4. **Firewall**: Only expose necessary ports (80, 443, 22)

## 📝 Adding More Applications

To add a third (or more) application:

1. Add entry to `apps.config.json`
2. Use a different port (e.g., 5002)
3. Set unique frontend path (e.g., `/app3`)
4. Deploy using `deploy-multi-app.sh`

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `pm2 status` | View all running apps |
| `pm2 logs` | View all logs |
| `pm2 restart all` | Restart all apps |
| `sudo nginx -t` | Test Nginx config |
| `sudo systemctl reload nginx` | Reload Nginx |
| `./deploy-multi-app.sh` | Deploy all apps |

