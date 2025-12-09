# Hope Physicians - Hostinger Deployment Guide

## Recommendation

**Recommended Product: VPS (Virtual Private Server) - Business or Premium Plan**

**Why:** Your application is a full-stack Node.js application (React frontend + Express backend) with a database requirement. A VPS provides full control to:
- Run Node.js runtime for the backend API
- Serve the built React frontend as static files
- Install and configure PostgreSQL/MySQL (migrating from SQLite)
- Set up Nginx as a reverse proxy
- Configure systemd services for process management
- Implement proper security (firewall, fail2ban)
- Scale resources as needed

**Complexity:** Medium-High. Hostinger supports Node.js natively on VPS, but requires manual setup of reverse proxy, database, and process management.

**Alternative:** If budget is constrained, Cloud Hosting with Node.js support could work, but you'll have limited control over server configuration and may need to use Hostinger's managed database service separately.

---

## Runbook

### Step 1: Prepare Hostinger Account and Plan

**[hPanel]**
1. Log in to Hostinger hPanel
2. Navigate to **VPS** section
3. Select **Business VPS** (2 vCPU, 4GB RAM) or **Premium VPS** (4 vCPU, 8GB RAM) - minimum recommended
4. Choose **Ubuntu 22.04 LTS** as OS
5. Complete purchase and wait for server provisioning (5-10 minutes)
6. Note your server IP address and root password (sent via email)

---

### Step 2: Enable SSH and Create SSH Key

**[SSH/CLI] - On Your Local Machine**

```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t ed25519 -C "hope-physicians-deploy" -f ~/.ssh/hostinger_hope

# Copy public key to clipboard (Windows)
type ~/.ssh/hostinger_hope.pub | clip

# Or on Linux/Mac
cat ~/.ssh/hostinger_hope.pub | pbcopy
```

**[hPanel]**
1. Go to **SSH Access** in hPanel
2. Click **Add SSH Key**
3. Paste your public key
4. Save

**[SSH/CLI] - Connect to Server**

```bash
# Connect to server (replace YOUR_SERVER_IP with actual IP)
ssh -i ~/.ssh/hostinger_hope root@YOUR_SERVER_IP

# On first connection, accept the host key fingerprint
```

---

### Step 3: Initial Server Setup

**[SSH/CLI] - On Server**

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential software-properties-common

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installations
node --version  # Should show v20.x.x
npm --version

# Install PM2 for process management
npm install -g pm2

# Install PostgreSQL
apt install -y postgresql postgresql-contrib

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx

# Create application user (non-root)
adduser --disabled-password --gecos "" hopeapp
usermod -aG sudo hopeapp

# Create application directory
mkdir -p /var/www/hope-physicians
chown hopeapp:hopeapp /var/www/hope-physicians
```

---

### Step 4: Set Up Database

**[SSH/CLI] - On Server**

```bash
# Switch to postgres user
sudo -u postgres psql

# Inside PostgreSQL prompt, run:
CREATE DATABASE hope_physicians;
CREATE USER hope_user WITH ENCRYPTED PASSWORD 'YOUR_SECURE_DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE hope_physicians TO hope_user;
ALTER DATABASE hope_physicians OWNER TO hope_user;
\q

# Test connection
sudo -u postgres psql -U hope_user -d hope_physicians -h localhost
# Enter password when prompted
```

**Note:** Replace `YOUR_SECURE_DB_PASSWORD` with a strong password. Save it securely.

---

### Step 5: Deploy Code from Repository

**[SSH/CLI] - On Server**

```bash
# Switch to application user
su - hopeapp

# Navigate to application directory
cd /var/www/hope-physicians

# Clone your repository (replace with your actual repo URL)
git clone https://github.com/YOUR_USERNAME/hope-physicians.git .

# Or if using private repo, set up SSH key for git
# Copy your deploy key to ~/.ssh/id_ed25519
# Then clone:
# git clone git@github.com:YOUR_USERNAME/hope-physicians.git .
```

**Alternative: Manual Upload via hPanel File Manager**
1. [hPanel] Go to **File Manager**
2. Navigate to `/var/www/hope-physicians`
3. Upload your project files as a ZIP
4. Extract using: `unzip hope-physicians.zip -d /var/www/hope-physicians`

---

### Step 6: Configure Backend

**[SSH/CLI] - On Server**

```bash
# As hopeapp user
cd /var/www/hope-physicians/backend

# Install dependencies
npm install

# Create .env file
nano .env
```

**Add to `.env` file:**

```env
# Server
NODE_ENV=production
PORT=5000

# Database (PostgreSQL)
DATABASE_URL="postgresql://hope_user:YOUR_SECURE_DB_PASSWORD@localhost:5432/hope_physicians?schema=public"

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-to-random-string

# CORS (your domain)
CORS_ORIGIN=https://yourdomain.com

# Email (if using nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Razorpay (if using)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# File Upload
UPLOAD_DIR=/var/www/hope-physicians/backend/uploads
MAX_FILE_SIZE=10485760
```

**Update Prisma Schema for PostgreSQL:**

```bash
# Edit schema.prisma
nano prisma/schema.prisma
```

**Change datasource to:**

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Run Prisma migrations:**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npm run prisma:seed
```

---

### Step 7: Build Frontend

**[SSH/CLI] - On Server**

```bash
# As hopeapp user
cd /var/www/hope-physicians/frontend

# Install dependencies
npm install

# Create production .env file
nano .env.production
```

**Add to `.env.production`:**

```env
VITE_API_URL=https://yourdomain.com/api
```

**Build frontend:**

```bash
npm run build

# The build output will be in frontend/dist/
```

---

### Step 8: Configure Nginx Reverse Proxy

**[SSH/CLI] - On Server (as root or with sudo)**

```bash
# Create Nginx configuration
nano /etc/nginx/sites-available/hope-physicians
```

**Add configuration (see Files section below for full config)**

```bash
# Enable site
ln -s /etc/nginx/sites-available/hope-physicians /etc/nginx/sites-enabled/

# Remove default site
rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Restart Nginx
systemctl restart nginx
systemctl enable nginx
```

---

### Step 9: Configure systemd Service for Backend

**[SSH/CLI] - On Server (as root or with sudo)**

```bash
# Create systemd service file
nano /etc/systemd/system/hope-physicians.service
```

**Add service file (see Files section below)**

```bash
# Reload systemd
systemctl daemon-reload

# Enable service
systemctl enable hope-physicians

# Start service
systemctl start hope-physicians

# Check status
systemctl status hope-physicians

# View logs
journalctl -u hope-physicians -f
```

---

### Step 10: Configure DNS

**[Your Domain Registrar]**

Add the following DNS records:

**A Record:**
```
Type: A
Name: @
Value: YOUR_SERVER_IP
TTL: 3600
```

**CNAME Record (for www):**
```
Type: CNAME
Name: www
Value: yourdomain.com
TTL: 3600
```

**Example DNS Records:**
```
@        A        192.168.1.100    3600
www      CNAME    yourdomain.com   3600
```

**Note:** Replace `YOUR_SERVER_IP` with your actual VPS IP address. DNS propagation can take 24-48 hours.

---

### Step 11: Configure SSL with Let's Encrypt

**[SSH/CLI] - On Server (as root or with sudo)**

```bash
# Obtain SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Follow prompts:
# - Enter email for renewal notices
# - Agree to terms
# - Choose whether to redirect HTTP to HTTPS (recommended: Yes)

# Test auto-renewal
certbot renew --dry-run

# Certbot will automatically configure Nginx and renew certificates
```

**Alternative: [hPanel] Auto SSL**
1. Go to **SSL** in hPanel
2. Click **Auto SSL**
3. Select your domain
4. Enable Auto SSL (free SSL certificate)

---

### Step 12: Verify Deployment

**[SSH/CLI] - On Server**

```bash
# Check backend service
systemctl status hope-physicians

# Check Nginx
systemctl status nginx

# Check PostgreSQL
systemctl status postgresql

# Test API endpoint
curl http://localhost:5000/

# Check frontend files
ls -la /var/www/hope-physicians/frontend/dist/
```

**Browser Tests:**
1. Visit `https://yourdomain.com` - Should load React app
2. Visit `https://yourdomain.com/api/` - Should return API response
3. Check browser console for errors
4. Test login/registration functionality

---

## Files

### Dockerfile (Optional - if using Docker)

```dockerfile
# Dockerfile for Hope Physicians Backend
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy application files
COPY backend/ .

# Generate Prisma Client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Start application
CMD ["node", "server.js"]
```

### docker-compose.yml (Optional - if using Docker)

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: hope-physicians-backend
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - PORT=5000
      - DATABASE_URL=postgresql://hope_user:${DB_PASSWORD}@db:5432/hope_physicians
      - JWT_SECRET=${JWT_SECRET}
      - CORS_ORIGIN=https://yourdomain.com
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/prisma:/app/prisma
    depends_on:
      - db
    networks:
      - hope-network

  db:
    image: postgres:15-alpine
    container_name: hope-physicians-db
    restart: unless-stopped
    environment:
      - POSTGRES_DB=hope_physicians
      - POSTGRES_USER=hope_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - hope-network

  frontend:
    image: nginx:alpine
    container_name: hope-physicians-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./frontend/dist:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
    networks:
      - hope-network

volumes:
  postgres_data:

networks:
  hope-network:
    driver: bridge
```

### systemd Service File

```ini
[Unit]
Description=Hope Physicians Backend API
After=network.target postgresql.service

[Service]
Type=simple
User=hopeapp
WorkingDirectory=/var/www/hope-physicians/backend
Environment=NODE_ENV=production
EnvironmentFile=/var/www/hope-physicians/backend/.env
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=hope-physicians

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/hope-physicians/backend/uploads

[Install]
WantedBy=multi-user.target
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/hope-physicians

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=general_limit:10m rate=30r/s;

# Upstream backend
upstream backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;

    # Let's Encrypt challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Root directory (frontend build)
    root /var/www/hope-physicians/frontend/dist;
    index index.html;

    # Logging
    access_log /var/log/nginx/hope-physicians-access.log;
    error_log /var/log/nginx/hope-physicians-error.log;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # API proxy
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
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

    # Frontend static files
    location / {
        limit_req zone=general_limit burst=50 nodelay;
        
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # File upload size limit
    client_max_body_size 10M;

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

---

## CI/CD

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy to Hostinger

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  NODE_VERSION: '20'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: |
            frontend/package-lock.json
            backend/package-lock.json

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Build frontend
        working-directory: ./frontend
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
        run: npm run build

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm ci

      - name: Generate Prisma Client
        working-directory: ./backend
        run: npx prisma generate

      - name: Deploy to server via SSH
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          port: 22
          source: "frontend/dist,backend"
          target: "/var/www/hope-physicians"
          strip_components: 0

      - name: Run database migrations
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          port: 22
          script: |
            cd /var/www/hope-physicians/backend
            npx prisma migrate deploy
            npx prisma generate

      - name: Restart backend service
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.HOSTINGER_HOST }}
          username: ${{ secrets.HOSTINGER_USER }}
          key: ${{ secrets.HOSTINGER_SSH_KEY }}
          port: 22
          script: |
            sudo systemctl restart hope-physicians
            sudo systemctl reload nginx
```

**Required GitHub Secrets:**
- `HOSTINGER_HOST`: Your VPS IP address
- `HOSTINGER_USER`: SSH username (e.g., `hopeapp` or `root`)
- `HOSTINGER_SSH_KEY`: Private SSH key (contents of `~/.ssh/hostinger_hope`)
- `VITE_API_URL`: Production API URL (e.g., `https://yourdomain.com/api`)

**To add secrets:**
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret above

---

## Backups & Rollback

### Daily Backup Script

```bash
#!/bin/bash
# /usr/local/bin/backup-hope-physicians.sh

BACKUP_DIR="/var/backups/hope-physicians"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
sudo -u postgres pg_dump hope_physicians | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Application files backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz \
    /var/www/hope-physicians/backend \
    /var/www/hope-physicians/frontend/dist \
    /var/www/hope-physicians/backend/uploads

# Remove old backups (older than retention period)
find $BACKUP_DIR -type f -mtime +$RETENTION_DAYS -delete

# Upload to remote storage (optional - S3, Google Drive, etc.)
# aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://your-bucket/backups/
# aws s3 cp $BACKUP_DIR/app_$DATE.tar.gz s3://your-bucket/backups/

echo "Backup completed: $DATE"
```

**Set up cron job:**

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-hope-physicians.sh >> /var/log/backup.log 2>&1
```

### Manual Database Backup

```bash
# Create backup
sudo -u postgres pg_dump hope_physicians > backup_$(date +%Y%m%d).sql

# Compress
gzip backup_$(date +%Y%m%d).sql
```

### Restore Database

```bash
# Restore from backup
gunzip backup_20241215.sql.gz
sudo -u postgres psql hope_physicians < backup_20241215.sql
```

### Rollback One Release

```bash
# 1. Stop service
sudo systemctl stop hope-physicians

# 2. Restore previous backup
cd /var/www/hope-physicians
tar -xzf /var/backups/hope-physicians/app_YYYYMMDD_HHMMSS.tar.gz

# 3. Restore database
gunzip /var/backups/hope-physicians/db_YYYYMMDD_HHMMSS.sql.gz
sudo -u postgres psql hope_physicians < /var/backups/hope-physicians/db_YYYYMMDD_HHMMSS.sql

# 4. Restart service
sudo systemctl start hope-physicians

# 5. Verify
curl http://localhost:5000/
```

---

## Monitoring & Security

### Monitoring Checklist

**1. Uptime Monitoring:**
```bash
# Install monitoring tools
apt install -y htop iotop netstat-nat

# Check service status
systemctl status hope-physicians
systemctl status nginx
systemctl status postgresql

# Monitor logs
journalctl -u hope-physicians -f --lines=50
tail -f /var/log/nginx/hope-physicians-error.log
```

**2. Health Check Endpoint:**
Add to `backend/server.js`:
```javascript
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

**3. Log Rotation:**
```bash
# Configure logrotate
nano /etc/logrotate.d/hope-physicians
```

Add:
```
/var/log/nginx/hope-physicians-*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null 2>&1 || true
    endscript
}
```

**4. Resource Monitoring:**
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('hope_physicians'));"
```

### Security Checklist

**1. Firewall (UFW):**
```bash
# Install UFW
apt install -y ufw

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (IMPORTANT: Do this first!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status verbose
```

**2. Fail2Ban:**
```bash
# Install fail2ban
apt install -y fail2ban

# Create local config
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
nano /etc/fail2ban/jail.local
```

Add to `[DEFAULT]`:
```ini
bantime = 3600
findtime = 600
maxretry = 5
```

Add custom jail:
```ini
[hope-physicians]
enabled = true
port = 5000
filter = hope-physicians
logpath = /var/log/hope-physicians.log
maxretry = 5
bantime = 3600
```

**3. SSH Hardening:**
```bash
# Edit SSH config
nano /etc/ssh/sshd_config
```

Set:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 22
```

Restart SSH:
```bash
systemctl restart sshd
```

**4. File Permissions:**
```bash
# Set correct permissions
chown -R hopeapp:hopeapp /var/www/hope-physicians
chmod -R 755 /var/www/hope-physicians
chmod -R 644 /var/www/hope-physicians/backend/.env
chmod 700 /var/www/hope-physicians/backend/uploads
```

**5. hPanel Security Settings:**
- [hPanel] Enable **Two-Factor Authentication** for hPanel account
- [hPanel] Set up **IP Whitelist** for hPanel access (optional)
- [hPanel] Enable **Auto SSL** for all domains
- [hPanel] Configure **Backup Schedule** (if available in your plan)

**6. Application Security:**
- Use strong JWT secrets (32+ characters, random)
- Enable CORS only for your domain
- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Set secure cookie flags (if using cookies)
- Implement rate limiting (already in Nginx config)

---

## Post-Deploy Checklist

### 1. Test Endpoints

```bash
# API health check
curl https://yourdomain.com/api/health

# Frontend loads
curl https://yourdomain.com/

# API routes
curl https://yourdomain.com/api/auth/login
```

### 2. Health Check

- [ ] Frontend loads without errors
- [ ] API responds to requests
- [ ] Database connection works
- [ ] File uploads work (if applicable)
- [ ] Authentication works
- [ ] All major features functional

### 3. SSL Validation

```bash
# Check SSL certificate
openssl ssl-date -connect yourdomain.com:443

# Or use online tool
# https://www.ssllabs.com/ssltest/analyze.html?d=yourdomain.com
```

- [ ] SSL certificate is valid
- [ ] HTTPS redirect works
- [ ] No mixed content warnings
- [ ] Certificate auto-renewal configured

### 4. DNS Validation

```bash
# Check DNS records
dig yourdomain.com
nslookup yourdomain.com

# Check propagation
# https://www.whatsmydns.net/
```

- [ ] A record points to correct IP
- [ ] CNAME record for www works
- [ ] DNS propagation complete

### 5. SEO & Analytics

- [ ] Add Google Analytics (if using)
- [ ] Verify Google Search Console
- [ ] Set up sitemap.xml
- [ ] Configure robots.txt
- [ ] Test meta tags
- [ ] Verify Open Graph tags

### 6. Performance

- [ ] Frontend assets are minified
- [ ] Images are optimized
- [ ] Gzip compression enabled
- [ ] Browser caching configured
- [ ] CDN configured (if using)

### 7. Monitoring Setup

- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] Configure error tracking (Sentry, LogRocket, etc.)
- [ ] Set up log aggregation (optional)
- [ ] Configure alerting for critical errors

---

## Assumptions

1. **Domain Name:** Assumed you have a domain name registered. If not, you can use Hostinger's free subdomain or purchase a domain through Hostinger.

2. **Database Migration:** Assumed migration from SQLite to PostgreSQL. If you prefer MySQL, replace PostgreSQL installation with MySQL and update Prisma schema accordingly.

3. **Email Service:** Assumed using Gmail SMTP. You may need to use a dedicated email service (SendGrid, Mailgun) for production.

4. **File Storage:** Assumed local file storage. For production, consider using cloud storage (AWS S3, DigitalOcean Spaces) for uploaded files.

5. **Repository:** Assumed code is in a Git repository (GitHub, GitLab, etc.). If not, use manual upload method.

6. **Environment Variables:** Assumed you have all necessary API keys (Razorpay, email, etc.). Update `.env` file with your actual values.

7. **Node.js Version:** Used Node.js 20.x LTS. Adjust if your application requires a different version.

8. **Server Resources:** Recommended minimum 2 vCPU, 4GB RAM. Adjust based on expected traffic.

9. **Backup Storage:** Assumed local backups. For production, implement off-site backups (S3, Google Drive, etc.).

10. **Monitoring:** Basic monitoring included. For production, consider comprehensive APM tools (New Relic, Datadog, etc.).

---

## Troubleshooting

### Backend not starting:
```bash
# Check logs
journalctl -u hope-physicians -n 50

# Check if port is in use
netstat -tulpn | grep 5000

# Verify .env file
cat /var/www/hope-physicians/backend/.env
```

### Database connection errors:
```bash
# Test PostgreSQL connection
sudo -u postgres psql -U hope_user -d hope_physicians

# Check PostgreSQL status
systemctl status postgresql

# Check database exists
sudo -u postgres psql -l
```

### Nginx 502 Bad Gateway:
```bash
# Check backend is running
systemctl status hope-physicians

# Check Nginx error log
tail -f /var/log/nginx/hope-physicians-error.log

# Test backend directly
curl http://localhost:5000/
```

### SSL certificate issues:
```bash
# Renew certificate manually
certbot renew --force-renewal

# Check certificate expiry
certbot certificates
```

---

## Support & Resources

- **Hostinger Support:** https://www.hostinger.com/contact
- **Hostinger Knowledge Base:** https://support.hostinger.com/
- **Prisma Documentation:** https://www.prisma.io/docs
- **Nginx Documentation:** https://nginx.org/en/docs/
- **Let's Encrypt:** https://letsencrypt.org/docs/

---

**Last Updated:** December 2024
**Version:** 1.0

