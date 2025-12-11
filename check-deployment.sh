#!/bin/bash

# Deployment Health Check Script
# Run this on EC2 to diagnose deployment issues

echo "🔍 Deployment Health Check"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check PM2
echo -e "${YELLOW}1. Checking PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✅ PM2 is installed${NC}"
    pm2 status
    echo ""
    
    # Check backend process
    if pm2 list | grep -q "hope-physicians-backend"; then
        echo -e "${GREEN}✅ Backend process found${NC}"
        pm2 describe hope-physicians-backend
        echo ""
        echo -e "${YELLOW}Backend Logs (last 20 lines):${NC}"
        pm2 logs hope-physicians-backend --lines 20 --nostream
    else
        echo -e "${RED}❌ Backend process NOT found${NC}"
    fi
else
    echo -e "${RED}❌ PM2 is NOT installed${NC}"
fi

echo ""

# Check Backend Port
echo -e "${YELLOW}2. Checking Backend Port (5000)...${NC}"
if netstat -tuln 2>/dev/null | grep -q ":5000 " || ss -tuln 2>/dev/null | grep -q ":5000 "; then
    echo -e "${GREEN}✅ Port 5000 is listening${NC}"
    netstat -tuln 2>/dev/null | grep ":5000 " || ss -tuln 2>/dev/null | grep ":5000 "
else
    echo -e "${RED}❌ Port 5000 is NOT listening${NC}"
fi

echo ""

# Check Nginx
echo -e "${YELLOW}3. Checking Nginx...${NC}"
if command -v nginx &> /dev/null; then
    echo -e "${GREEN}✅ Nginx is installed${NC}"
    if sudo systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
    else
        echo -e "${RED}❌ Nginx is NOT running${NC}"
        echo -e "${YELLOW}Attempting to start...${NC}"
        sudo systemctl start nginx
    fi
    
    # Check Nginx config
    echo -e "${YELLOW}Testing Nginx configuration...${NC}"
    sudo nginx -t
    
    # Check Nginx ports
    echo -e "${YELLOW}Nginx listening ports:${NC}"
    sudo netstat -tuln 2>/dev/null | grep nginx || sudo ss -tuln 2>/dev/null | grep nginx || echo "Cannot check"
else
    echo -e "${RED}❌ Nginx is NOT installed${NC}"
fi

echo ""

# Check Firewall
echo -e "${YELLOW}4. Checking Firewall...${NC}"
if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}UFW Status:${NC}"
    sudo ufw status
else
    echo -e "${YELLOW}UFW not found, checking iptables...${NC}"
    sudo iptables -L -n | grep -E "(80|443|5000)" || echo "No rules found for ports 80, 443, or 5000"
fi

echo ""

# Check Application Files
echo -e "${YELLOW}5. Checking Application Files...${NC}"
APP_DIR="/home/$USER/hope-physicians"
if [ -d "$APP_DIR" ]; then
    echo -e "${GREEN}✅ Application directory exists: $APP_DIR${NC}"
    
    if [ -d "$APP_DIR/backend" ]; then
        echo -e "${GREEN}✅ Backend directory exists${NC}"
        if [ -f "$APP_DIR/backend/.env" ]; then
            echo -e "${GREEN}✅ .env file exists${NC}"
        else
            echo -e "${RED}❌ .env file NOT found${NC}"
        fi
    else
        echo -e "${RED}❌ Backend directory NOT found${NC}"
    fi
    
    if [ -d "$APP_DIR/frontend/dist" ]; then
        echo -e "${GREEN}✅ Frontend build exists${NC}"
        ls -la "$APP_DIR/frontend/dist" | head -3
    else
        echo -e "${RED}❌ Frontend build NOT found${NC}"
    fi
else
    echo -e "${RED}❌ Application directory NOT found: $APP_DIR${NC}"
fi

echo ""

# Check Network Connectivity
echo -e "${YELLOW}6. Checking Network...${NC}"
PUBLIC_IP=$(curl -s ifconfig.me 2>/dev/null || curl -s ipinfo.io/ip 2>/dev/null || echo "Unable to get IP")
echo -e "Public IP: $PUBLIC_IP"

echo ""

# Summary
echo -e "${YELLOW}📊 Summary:${NC}"
echo "Run this command to test backend:"
echo "  curl http://localhost:5000/api"
echo ""
echo "Run this command to test frontend:"
echo "  curl http://localhost"
echo ""
echo "If services are running but not accessible externally, check:"
echo "  1. EC2 Security Group allows inbound traffic on ports 80, 443, and 5000"
echo "  2. Firewall rules allow traffic"
echo "  3. Services are bound to 0.0.0.0, not just localhost"

