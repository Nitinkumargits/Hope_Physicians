# EC2 Connection Troubleshooting Guide

## 🔴 Issue: Connection Timeout (ERR_CONNECTION_TIMED_OUT)

If you're getting `ERR_CONNECTION_TIMED_OUT` when accessing `http://52.66.236.157`, follow these steps:

---

## ✅ Step 1: Check EC2 Security Group (MOST COMMON ISSUE)

### Your EC2 IP: `52.66.236.157`

**The security group must allow inbound traffic on these ports:**

1. **Go to AWS Console**:
   - EC2 Dashboard → Instances
   - Select your instance
   - Click "Security" tab
   - Click on Security Group name

2. **Add Inbound Rules**:
   - Click "Edit inbound rules"
   - Add these rules:

   | Type | Protocol | Port Range | Source | Description |
   |------|----------|------------|--------|-------------|
   | HTTP | TCP | 80 | 0.0.0.0/0 | Allow HTTP traffic |
   | HTTPS | TCP | 443 | 0.0.0.0/0 | Allow HTTPS traffic |
   | Custom TCP | TCP | 5000 | 0.0.0.0/0 | Backend API (optional) |
   | SSH | TCP | 22 | Your IP | SSH access (already set) |

3. **Save rules**

---

## ✅ Step 2: Verify Deployment Workflow Ran

1. **Check GitHub Actions**:
   - Go to: https://github.com/infofitsoftwaresolution/hope_physician/actions
   - Look for "Deploy to EC2" workflow
   - Check if it completed successfully

2. **If workflow didn't run**:
   - The "Full Stack CI/CD" workflow only tests, it doesn't deploy
   - The "Deploy to EC2" workflow should run after pushing to master
   - Check if it's in the workflow list

---

## ✅ Step 3: SSH into EC2 and Check Services

```bash
# SSH into your EC2 instance
ssh -i your-key.pem ubuntu@52.66.236.157

# Run diagnostics
cd ~/hope-physicians
chmod +x check-deployment.sh
./check-deployment.sh
```

**Or manually check:**

```bash
# Check PM2 status
pm2 status

# Check if backend is running
pm2 logs hope-physicians-backend

# Check if port 5000 is listening
sudo netstat -tuln | grep 5000
# OR
sudo ss -tuln | grep 5000

# Check Nginx status
sudo systemctl status nginx

# Check if Nginx is listening on port 80
sudo netstat -tuln | grep 80
# OR
sudo ss -tuln | grep 80

# Test backend locally
curl http://localhost:5000/api

# Test frontend locally
curl http://localhost
```

---

## ✅ Step 4: Check Firewall (UFW)

```bash
# Check UFW status
sudo ufw status

# If UFW is active, allow ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5000/tcp
sudo ufw reload
```

---

## ✅ Step 5: Restart Services Manually

If services aren't running:

```bash
# Start backend with PM2
cd ~/hope-physicians/backend
pm2 start server.js --name "hope-physicians-backend" --update-env
pm2 save

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
pm2 status
sudo systemctl status nginx
```

---

## ✅ Step 6: Re-run Deployment

If deployment didn't complete:

1. **Trigger deployment manually**:
   - Go to: https://github.com/infofitsoftwaresolution/hope_physician/actions
   - Click "Deploy to EC2" workflow
   - Click "Run workflow" → "Run workflow"

2. **Or push a commit**:
   ```bash
   git commit --allow-empty -m "Trigger deployment"
   git push new-origin master
   ```

---

## 🔍 Quick Diagnostic Commands

Run these on EC2 to diagnose:

```bash
# 1. Check if services are running
pm2 status
sudo systemctl status nginx

# 2. Check ports
sudo netstat -tuln | grep -E "(80|443|5000)"

# 3. Check application files
ls -la ~/hope-physicians/backend/.env
ls -la ~/hope-physicians/frontend/dist

# 4. Check logs
pm2 logs hope-physicians-backend --lines 50
sudo tail -f /var/log/nginx/error.log

# 5. Test locally
curl http://localhost:5000/api
curl http://localhost
```

---

## 🎯 Most Likely Issues

### 1. **Security Group Not Configured** (90% of cases)
   - **Fix**: Add inbound rules for ports 80, 443 in EC2 Security Group

### 2. **Services Not Running**
   - **Fix**: SSH into EC2 and start services manually

### 3. **Deployment Didn't Run**
   - **Fix**: Check GitHub Actions and trigger deployment

### 4. **Firewall Blocking**
   - **Fix**: Configure UFW to allow ports 80, 443

---

## 📋 Checklist

- [ ] EC2 Security Group allows port 80 (HTTP)
- [ ] EC2 Security Group allows port 443 (HTTPS)
- [ ] "Deploy to EC2" workflow completed successfully
- [ ] PM2 process is running (`pm2 status`)
- [ ] Nginx is running (`sudo systemctl status nginx`)
- [ ] Port 5000 is listening (backend)
- [ ] Port 80 is listening (Nginx)
- [ ] Frontend build exists (`~/hope-physicians/frontend/dist`)
- [ ] Backend .env file exists (`~/hope-physicians/backend/.env`)

---

## 🚀 After Fixing

Once everything is configured:

1. **Test locally on EC2**:
   ```bash
   curl http://localhost:5000/api
   curl http://localhost
   ```

2. **Test externally**:
   - Open browser: `http://52.66.236.157`
   - Should see your application

3. **If still not working**:
   - Check GitHub Actions logs
   - Run `check-deployment.sh` on EC2
   - Check EC2 instance status in AWS Console

---

## 📞 Need More Help?

1. Check GitHub Actions logs for deployment errors
2. SSH into EC2 and run diagnostics
3. Verify EC2 Security Group settings
4. Check EC2 instance is running (not stopped)

