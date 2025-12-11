#!/bin/bash

# Hope Physicians Deployment Script for EC2 (Single App)
# This script handles deployment of both backend and frontend
# For multiple apps, use deploy-multi-app.sh instead

# Exit on error for critical steps, but continue for non-critical
set -e

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/$USER/hope-physicians"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_PORT=${PORT:-5000}
NODE_ENV=${NODE_ENV:-production}

echo -e "${YELLOW}📁 Application Directory: $APP_DIR${NC}"

# Check if Node.js is installed, install if not
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Installing Node.js 18...${NC}"
    
    # Install Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - || {
        echo -e "${YELLOW}Trying alternative installation method...${NC}"
        sudo apt-get update
        sudo apt-get install -y curl
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    }
    
    sudo apt-get install -y nodejs || {
        echo -e "${RED}❌ Failed to install Node.js${NC}"
        exit 1
    }
    
    echo -e "${GREEN}✅ Node.js installed successfully${NC}"
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# ============================================
# BACKEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🔧 Deploying Backend...${NC}"

cd $BACKEND_DIR

# Install backend dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
npm ci --production=false

# Generate Prisma Client
echo -e "${YELLOW}🔨 Generating Prisma Client...${NC}"
npm run prisma:generate

# Run database migrations (non-interactive)
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
if [ -f "$BACKEND_DIR/prisma/schema.prisma" ]; then
    npx prisma migrate deploy --skip-generate 2>/dev/null || {
        echo "⚠️  Migration failed or already applied, trying db push..."
        npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo "⚠️  Database setup skipped"
    }
else
    echo "⚠️  Prisma schema not found, skipping migrations"
fi

# Create/Update .env file with latest secrets
echo -e "${YELLOW}📝 Creating/Updating .env file...${NC}"
cat > $BACKEND_DIR/.env << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${BACKEND_PORT:-5000}
JWT_SECRET=${JWT_SECRET:-change-this-secret-in-production}
DATABASE_URL=${DATABASE_URL:-file:./prisma/hope_physicians.db}
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASS=${EMAIL_PASS:-}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-}
EOF
echo -e "${GREEN}✅ .env file created/updated${NC}"

# Stop existing PM2 process if running
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🛑 Stopping existing backend process...${NC}"
    pm2 stop hope-physicians-backend || echo "No existing process to stop"
    pm2 delete hope-physicians-backend || echo "No existing process to delete"
fi

# Start backend with PM2
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}🚀 Starting backend with PM2...${NC}"
    cd $APP_DIR
    
    # Use ecosystem file if available, otherwise start directly
    if [ -f "$APP_DIR/ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --update-env || {
            echo -e "${YELLOW}⚠️  Ecosystem start failed, trying direct start...${NC}"
            cd $BACKEND_DIR
            pm2 start server.js --name "hope-physicians-backend" --update-env
        }
    else
        cd $BACKEND_DIR
        pm2 start server.js --name "hope-physicians-backend" --update-env
    fi
    
    # Wait a moment for PM2 to start
    sleep 2
    
    # Verify PM2 process is running
    if pm2 list | grep -q "hope-physicians-backend"; then
        pm2 save --force
        echo -e "${GREEN}✅ Backend started with PM2${NC}"
    else
        echo -e "${RED}❌ Backend failed to start with PM2${NC}"
        pm2 logs hope-physicians-backend --lines 50 --nostream || true
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not installed. Installing PM2...${NC}"
    npm install -g pm2 || {
        echo -e "${RED}❌ Failed to install PM2${NC}"
        exit 1
    }
    cd $APP_DIR
    
    if [ -f "$APP_DIR/ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --update-env
    else
        cd $BACKEND_DIR
        pm2 start server.js --name "hope-physicians-backend" --update-env
    fi
    
    # Setup PM2 startup (non-interactive)
    pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null | grep "sudo" | bash || true
    pm2 save --force
    
    # Verify it's running
    sleep 2
    if pm2 list | grep -q "hope-physicians-backend"; then
        echo -e "${GREEN}✅ Backend started with PM2${NC}"
    else
        echo -e "${RED}❌ Backend failed to start${NC}"
        pm2 logs hope-physicians-backend --lines 50 --nostream || true
    fi
fi

# ============================================
# FRONTEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🎨 Deploying Frontend...${NC}"

cd $FRONTEND_DIR

# Install frontend dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm ci

# Build frontend (already built in CI, but rebuild with production env)
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build

# Setup Nginx (if installed)
if command -v nginx &> /dev/null; then
    echo -e "${YELLOW}🌐 Configuring Nginx...${NC}"
    
    # Create nginx config
    sudo tee /etc/nginx/sites-available/hope-physicians > /dev/null << EOF
server {
    listen 80;
    server_name _;
    
    # Frontend
    root $FRONTEND_DIR/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Backend API
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/hope-physicians /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test and reload nginx (non-interactive)
    if sudo nginx -t 2>/dev/null; then
        sudo systemctl reload nginx 2>/dev/null || true
        echo -e "${GREEN}✅ Nginx configured and reloaded${NC}"
    else
        echo -e "${YELLOW}⚠️  Nginx config test failed, but continuing...${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx not installed. Frontend built but not served.${NC}"
    echo -e "${YELLOW}   Install Nginx: sudo apt-get update && sudo apt-get install -y nginx${NC}"
fi

# ============================================
# FINAL STATUS
# ============================================
echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}\n"

# Show PM2 status
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📊 Application Status:${NC}"
    pm2 status
    echo ""
    echo -e "${YELLOW}📋 Backend Logs (last 30 lines):${NC}"
    pm2 logs hope-physicians-backend --lines 30 --nostream || echo "No logs available"
    echo ""
    
    # Check if backend is actually listening
    echo -e "${YELLOW}🔍 Checking if backend is listening on port $BACKEND_PORT...${NC}"
    if netstat -tuln 2>/dev/null | grep -q ":$BACKEND_PORT " || ss -tuln 2>/dev/null | grep -q ":$BACKEND_PORT "; then
        echo -e "${GREEN}✅ Backend is listening on port $BACKEND_PORT${NC}"
    else
        echo -e "${RED}❌ Backend is NOT listening on port $BACKEND_PORT${NC}"
        echo -e "${YELLOW}Checking PM2 process status...${NC}"
        pm2 describe hope-physicians-backend || echo "PM2 process not found"
    fi
fi

# Check Nginx status
if command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}🌐 Nginx Status:${NC}"
    if sudo systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
        echo -e "${YELLOW}Nginx listening on ports:${NC}"
        sudo netstat -tuln 2>/dev/null | grep nginx || sudo ss -tuln 2>/dev/null | grep nginx || echo "Cannot check ports"
    else
        echo -e "${RED}❌ Nginx is NOT running${NC}"
        echo -e "${YELLOW}Attempting to start Nginx...${NC}"
        sudo systemctl start nginx 2>/dev/null || echo "Failed to start Nginx"
    fi
fi

# Final diagnostics
echo -e "\n${YELLOW}🔍 Final Diagnostics:${NC}"
echo -e "Backend Port: $BACKEND_PORT"
echo -e "Frontend Directory: $FRONTEND_DIR/dist"
if [ -d "$FRONTEND_DIR/dist" ]; then
    echo -e "${GREEN}✅ Frontend build exists${NC}"
    ls -la "$FRONTEND_DIR/dist" | head -5
else
    echo -e "${RED}❌ Frontend build directory not found${NC}"
fi

echo -e "\n${GREEN}🎉 Deployment finished!${NC}"
echo -e "${YELLOW}📍 Backend API: http://localhost:$BACKEND_PORT${NC}"
echo -e "${YELLOW}📍 Frontend: http://localhost${NC}"
echo -e "${YELLOW}📍 External Access: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_EC2_IP')${NC}"

