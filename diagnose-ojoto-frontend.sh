#!/bin/bash

# Diagnostic script for Ojoto Union frontend blank page issue
# Run this on EC2 to diagnose the issue

set -e

echo "🔍 Diagnosing Ojoto Union frontend issue..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

APP_DIR="/home/ec2-user/ojoto-union"
FRONTEND_DIR="$APP_DIR/frontend"
DIST_DIR="$FRONTEND_DIR/dist"

# 1. Check if frontend directory exists
echo -e "${BLUE}1. Checking frontend directory...${NC}"
if [ -d "$FRONTEND_DIR" ]; then
    echo -e "${GREEN}   ✅ Frontend directory exists: $FRONTEND_DIR${NC}"
else
    echo -e "${RED}   ❌ Frontend directory NOT found: $FRONTEND_DIR${NC}"
    exit 1
fi

# 2. Check if dist directory exists
echo -e "\n${BLUE}2. Checking dist directory...${NC}"
if [ -d "$DIST_DIR" ]; then
    echo -e "${GREEN}   ✅ Dist directory exists: $DIST_DIR${NC}"
    FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l)
    echo -e "${YELLOW}   📁 Files in dist: $FILE_COUNT${NC}"
else
    echo -e "${RED}   ❌ Dist directory NOT found: $DIST_DIR${NC}"
    echo -e "${YELLOW}   💡 Frontend needs to be built!${NC}"
    exit 1
fi

# 3. Check if index.html exists
echo -e "\n${BLUE}3. Checking index.html...${NC}"
if [ -f "$DIST_DIR/index.html" ]; then
    echo -e "${GREEN}   ✅ index.html exists${NC}"
    echo -e "${YELLOW}   📄 First 20 lines of index.html:${NC}"
    head -20 "$DIST_DIR/index.html" | sed 's/^/      /'
else
    echo -e "${RED}   ❌ index.html NOT found in $DIST_DIR${NC}"
    echo -e "${YELLOW}   💡 Frontend build is incomplete!${NC}"
fi

# 4. Check file permissions
echo -e "\n${BLUE}4. Checking file permissions...${NC}"
ls -la "$DIST_DIR" | head -10
if [ -r "$DIST_DIR/index.html" ]; then
    echo -e "${GREEN}   ✅ index.html is readable${NC}"
else
    echo -e "${RED}   ❌ index.html is NOT readable${NC}"
    echo -e "${YELLOW}   💡 Fixing permissions...${NC}"
    sudo chmod -R 755 "$DIST_DIR" 2>/dev/null || true
fi

# 5. Check Nginx configuration
echo -e "\n${BLUE}5. Checking Nginx configuration...${NC}"
if [ -f "/etc/nginx/sites-available/multi-app" ]; then
    echo -e "${GREEN}   ✅ Nginx config found: /etc/nginx/sites-available/multi-app${NC}"
    echo -e "${YELLOW}   📄 Ojoto Union location block:${NC}"
    grep -A 5 "location /ojoto-union" /etc/nginx/sites-available/multi-app 2>/dev/null || \
    grep -A 5 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf 2>/dev/null || \
    echo "      (Not found in config)"
elif [ -f "/etc/nginx/conf.d/multi-app.conf" ]; then
    echo -e "${GREEN}   ✅ Nginx config found: /etc/nginx/conf.d/multi-app.conf${NC}"
    echo -e "${YELLOW}   📄 Ojoto Union location block:${NC}"
    grep -A 5 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf 2>/dev/null || \
    echo "      (Not found in config)"
else
    echo -e "${RED}   ❌ Nginx config NOT found!${NC}"
    echo -e "${YELLOW}   💡 Need to run deployment script${NC}"
fi

# 6. Check Nginx error logs
echo -e "\n${BLUE}6. Checking Nginx error logs (last 20 lines)...${NC}"
if [ -f "/var/log/nginx/error.log" ]; then
    echo -e "${YELLOW}   📋 Recent errors:${NC}"
    sudo tail -20 /var/log/nginx/error.log | grep -i "ojoto\|/ojoto-union" || echo "      (No ojoto-union errors found)"
else
    echo -e "${YELLOW}   ⚠️  Error log not found${NC}"
fi

# 7. Test Nginx config
echo -e "\n${BLUE}7. Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}   ✅ Nginx configuration is valid${NC}"
else
    echo -e "${RED}   ❌ Nginx configuration has errors!${NC}"
fi

# 8. Check if Nginx can access the files
echo -e "\n${BLUE}8. Testing file access...${NC}"
if sudo -u nginx test -r "$DIST_DIR/index.html" 2>/dev/null; then
    echo -e "${GREEN}   ✅ Nginx user can read index.html${NC}"
else
    echo -e "${RED}   ❌ Nginx user CANNOT read index.html${NC}"
    echo -e "${YELLOW}   💡 Fixing permissions...${NC}"
    sudo chmod -R 755 "$APP_DIR" 2>/dev/null || true
    sudo chmod -R 755 "$FRONTEND_DIR" 2>/dev/null || true
    sudo chmod -R 755 "$DIST_DIR" 2>/dev/null || true
fi

# 9. Check if frontend was built with correct base path
echo -e "\n${BLUE}9. Checking if frontend was built with base path...${NC}"
if [ -f "$DIST_DIR/index.html" ]; then
    if grep -q "/ojoto-union" "$DIST_DIR/index.html" 2>/dev/null; then
        echo -e "${GREEN}   ✅ index.html contains '/ojoto-union' path${NC}"
    else
        echo -e "${YELLOW}   ⚠️  index.html doesn't contain '/ojoto-union' path${NC}"
        echo -e "${YELLOW}   💡 Frontend might need to be rebuilt with VITE_BASE_PATH=/ojoto-union${NC}"
    fi
fi

# 10. Summary and recommendations
echo -e "\n${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}📋 DIAGNOSIS SUMMARY${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}💡 Recommended Actions:${NC}"
echo ""
echo "1. If dist directory is missing or empty:"
echo "   cd $FRONTEND_DIR"
echo "   export VITE_BASE_PATH=/ojoto-union"
echo "   export VITE_API_URL=/ojoto-union/api"
echo "   npm run build"
echo ""
echo "2. If permissions are wrong:"
echo "   sudo chmod -R 755 $APP_DIR"
echo ""
echo "3. If Nginx config is wrong, restart deployment:"
echo "   cd ~/deployment"
echo "   bash deploy-multi-app.sh"
echo ""
echo "4. Restart Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "5. Check Nginx status:"
echo "   sudo systemctl status nginx"
echo "   sudo tail -f /var/log/nginx/error.log"

