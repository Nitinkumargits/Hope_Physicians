#!/bin/bash
# Verify Deployment - Run on Server
# Checks if frontend is properly deployed and API config is working

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Verifying Deployment...${NC}\n"

# Check 1: Frontend dist exists
echo -e "${YELLOW}1. Checking frontend dist directory...${NC}"
if [ -d "$HOME/hope-physicians/frontend/dist" ] && [ "$(ls -A $HOME/hope-physicians/frontend/dist 2>/dev/null)" ]; then
    echo -e "${GREEN}✅ Frontend dist directory exists${NC}"
    echo "   Files: $(ls -1 $HOME/hope-physicians/frontend/dist | wc -l) files"
else
    echo -e "${RED}❌ Frontend dist directory missing or empty${NC}"
    exit 1
fi

# Check 2: index.html exists
echo -e "\n${YELLOW}2. Checking index.html...${NC}"
if [ -f "$HOME/hope-physicians/frontend/dist/index.html" ]; then
    echo -e "${GREEN}✅ index.html exists${NC}"
    
    # Check for API config
    if grep -q "APP_CONFIG" "$HOME/hope-physicians/frontend/dist/index.html"; then
        echo -e "${GREEN}✅ API runtime config found in index.html${NC}"
    else
        echo -e "${RED}❌ API runtime config NOT found in index.html${NC}"
    fi
else
    echo -e "${RED}❌ index.html not found${NC}"
    exit 1
fi

# Check 3: Nginx config
echo -e "\n${YELLOW}3. Checking Nginx configuration...${NC}"
if sudo nginx -t 2>/dev/null; then
    echo -e "${GREEN}✅ Nginx config is valid${NC}"
else
    echo -e "${RED}❌ Nginx config has errors${NC}"
    sudo nginx -t
fi

# Check 4: Nginx is running
echo -e "\n${YELLOW}4. Checking Nginx status...${NC}"
if systemctl is-active --quiet nginx 2>/dev/null || service nginx status &>/dev/null; then
    echo -e "${GREEN}✅ Nginx is running${NC}"
else
    echo -e "${RED}❌ Nginx is not running${NC}"
fi

# Check 5: Backend is running
echo -e "\n${YELLOW}5. Checking backend (PM2)...${NC}"
if command -v pm2 &> /dev/null; then
    if pm2 list | grep -q "hope-physicians-backend.*online"; then
        echo -e "${GREEN}✅ Backend is running${NC}"
    else
        echo -e "${RED}❌ Backend is not running${NC}"
        pm2 status
    fi
else
    echo -e "${YELLOW}⚠️  PM2 not found${NC}"
fi

# Check 6: Port 80 is listening
echo -e "\n${YELLOW}6. Checking if port 80 is listening...${NC}"
if netstat -tuln 2>/dev/null | grep -q ":80 " || ss -tuln 2>/dev/null | grep -q ":80 "; then
    echo -e "${GREEN}✅ Port 80 is listening${NC}"
else
    echo -e "${RED}❌ Port 80 is not listening${NC}"
fi

# Check 7: Test API endpoint
echo -e "\n${YELLOW}7. Testing API endpoint...${NC}"
API_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/ 2>/dev/null || echo "000")
if [ "$API_RESPONSE" = "200" ] || [ "$API_RESPONSE" = "404" ] || [ "$API_RESPONSE" = "401" ]; then
    echo -e "${GREEN}✅ API endpoint is reachable (HTTP $API_RESPONSE)${NC}"
else
    echo -e "${RED}❌ API endpoint not reachable (HTTP $API_RESPONSE)${NC}"
fi

# Summary
echo -e "\n${YELLOW}════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 Deployment Verification Summary${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo ""
echo "Frontend: $HOME/hope-physicians/frontend/dist"
echo "Nginx Root: $(grep -r "root" /etc/nginx/sites-enabled/* /etc/nginx/conf.d/* 2>/dev/null | grep hope-physicians | head -1 | awk '{print $2}' || echo 'Not found')"
echo ""
echo -e "${GREEN}✅ Verification complete!${NC}"
echo ""
echo "To test in browser:"
echo "  1. Open: http://52.66.236.157/portal/login"
echo "  2. Check console: Should see '🔧 API Configuration: /api'"
echo "  3. Check Network tab: All requests should be '/api/...'"
echo ""
