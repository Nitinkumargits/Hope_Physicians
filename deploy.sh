#!/bin/bash

# Hope Physicians Deployment Script for EC2
# This script handles deployment of both backend and frontend

set -e  # Exit on error

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18 or higher.${NC}"
    exit 1
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

# Run database migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy || echo "⚠️  Migration skipped or already applied"

# Create .env file if it doesn't exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}📝 Creating .env file...${NC}"
    cat > $BACKEND_DIR/.env << EOF
NODE_ENV=$NODE_ENV
PORT=$BACKEND_PORT
JWT_SECRET=${JWT_SECRET:-change-this-secret-in-production}
DATABASE_URL=file:./prisma/hope_physicians.db
EMAIL_USER=${EMAIL_USER:-}
EMAIL_PASS=${EMAIL_PASS:-}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID:-}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET:-}
EOF
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

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
        pm2 start ecosystem.config.js --update-env
    else
        cd $BACKEND_DIR
        pm2 start server.js --name "hope-physicians-backend" --update-env
    fi
    
    pm2 save
    echo -e "${GREEN}✅ Backend started with PM2${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 not installed. Installing PM2...${NC}"
    npm install -g pm2
    cd $APP_DIR
    
    if [ -f "$APP_DIR/ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js --update-env
    else
        cd $BACKEND_DIR
        pm2 start server.js --name "hope-physicians-backend" --update-env
    fi
    
    pm2 startup
    pm2 save
    echo -e "${GREEN}✅ Backend started with PM2${NC}"
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
    
    # Test and reload nginx
    sudo nginx -t && sudo systemctl reload nginx
    echo -e "${GREEN}✅ Nginx configured and reloaded${NC}"
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
    echo -e "${YELLOW}📋 Backend Logs (last 20 lines):${NC}"
    pm2 logs hope-physicians-backend --lines 20 --nostream
fi

echo -e "\n${GREEN}🎉 Deployment finished!${NC}"
echo -e "${YELLOW}📍 Backend API: http://localhost:$BACKEND_PORT${NC}"
echo -e "${YELLOW}📍 Frontend: http://localhost${NC}"

