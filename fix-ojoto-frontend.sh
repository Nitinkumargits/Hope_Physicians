#!/bin/bash

# Fix script for Ojoto Union frontend blank page
# Rebuilds frontend with correct base path and fixes Nginx

set -e

echo "🔧 Fixing Ojoto Union frontend..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/home/ec2-user/ojoto-union"
FRONTEND_DIR="$APP_DIR/frontend"
DIST_DIR="$FRONTEND_DIR/dist"

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Frontend directory not found: $FRONTEND_DIR${NC}"
    exit 1
fi

cd "$FRONTEND_DIR"

# 1. Remove old dist to force rebuild
echo -e "${YELLOW}🧹 Removing old build...${NC}"
rm -rf dist node_modules/.vite 2>/dev/null || true

# 2. Set environment variables for build
export VITE_BASE_PATH="/ojoto-union"
export VITE_API_URL="/ojoto-union/api"
export NODE_OPTIONS="--max-old-space-size=512"

echo -e "${YELLOW}📦 Environment variables set:${NC}"
echo "   VITE_BASE_PATH=$VITE_BASE_PATH"
echo "   VITE_API_URL=$VITE_API_URL"

# 3. Build frontend
echo -e "\n${YELLOW}🏗️  Building frontend with base path /ojoto-union...${NC}"
echo -e "${YELLOW}⏳ This may take 3-5 minutes...${NC}"

if npm run build 2>&1; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# 4. Verify build
if [ ! -f "$DIST_DIR/index.html" ]; then
    echo -e "${RED}❌ index.html not found after build!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build verified: index.html exists${NC}"

# 5. Fix permissions
echo -e "\n${YELLOW}🔐 Fixing permissions...${NC}"
sudo chmod -R 755 "$APP_DIR" 2>/dev/null || true
sudo chmod -R 755 "$FRONTEND_DIR" 2>/dev/null || true
sudo chmod -R 755 "$DIST_DIR" 2>/dev/null || true
echo -e "${GREEN}✅ Permissions fixed${NC}"

# 6. Check and fix Nginx configuration
echo -e "\n${YELLOW}🌐 Checking Nginx configuration...${NC}"

NGINX_CONFIG=""
if [ -f "/etc/nginx/sites-available/multi-app" ]; then
    NGINX_CONFIG="/etc/nginx/sites-available/multi-app"
elif [ -f "/etc/nginx/conf.d/multi-app.conf" ]; then
    NGINX_CONFIG="/etc/nginx/conf.d/multi-app.conf"
fi

if [ -n "$NGINX_CONFIG" ]; then
    echo -e "${GREEN}✅ Found Nginx config: $NGINX_CONFIG${NC}"
    
    # Check if ojoto-union location exists
    if grep -q "location /ojoto-union" "$NGINX_CONFIG"; then
        echo -e "${GREEN}✅ Ojoto Union location block found${NC}"
        
        # Check if alias has trailing slash (required for alias directive)
        if grep -A 2 "location /ojoto-union" "$NGINX_CONFIG" | grep -q "alias.*/$"; then
            echo -e "${GREEN}✅ Alias directive looks correct${NC}"
        else
            echo -e "${YELLOW}⚠️  Alias might need trailing slash, but continuing...${NC}"
        fi
    else
        echo -e "${RED}❌ Ojoto Union location block NOT found in Nginx config!${NC}"
        echo -e "${YELLOW}💡 Need to regenerate Nginx config${NC}"
        echo -e "${YELLOW}   Run: cd ~/deployment && bash deploy-multi-app.sh${NC}"
    fi
else
    echo -e "${RED}❌ Nginx config not found!${NC}"
    echo -e "${YELLOW}💡 Need to run deployment script${NC}"
fi

# 7. Test and restart Nginx
echo -e "\n${YELLOW}🔄 Testing and restarting Nginx...${NC}"
if sudo nginx -t 2>/dev/null; then
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    echo -e "${GREEN}✅ Nginx restarted${NC}"
else
    echo -e "${RED}❌ Nginx config test failed!${NC}"
    sudo nginx -t
    exit 1
fi

# 8. Summary
echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Ojoto Union frontend fix complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}📋 What was done:${NC}"
echo "   ✅ Removed old build"
echo "   ✅ Built frontend with VITE_BASE_PATH=/ojoto-union"
echo "   ✅ Fixed file permissions"
echo "   ✅ Restarted Nginx"
echo ""
echo -e "${YELLOW}💡 Test the website:${NC}"
echo "   http://YOUR_EC2_IP/ojoto-union"
echo ""
echo -e "${YELLOW}💡 If still blank, check:${NC}"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   ls -la $DIST_DIR"

