#!/bin/bash
# Backend Health Check Script
# Run this on your EC2 server to diagnose backend issues

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Checking Backend Status...${NC}\n"

# Check PM2
echo -e "${YELLOW}📊 PM2 Status:${NC}"
pm2 status || echo -e "${RED}❌ PM2 not running or backend not started${NC}"

# Check if backend process exists
echo -e "\n${YELLOW}🔌 Checking Backend Process:${NC}"
if pm2 list | grep -q "hope-physicians-backend"; then
    echo -e "${GREEN}✅ Backend process found in PM2${NC}"
    pm2 info hope-physicians-backend | grep -E "(status|pid|uptime|restarts)"
else
    echo -e "${RED}❌ Backend process not found in PM2${NC}"
fi

# Check Port 5000
echo -e "\n${YELLOW}🔌 Port 5000 Status:${NC}"
if sudo netstat -tuln 2>/dev/null | grep -q ":5000" || sudo ss -tuln 2>/dev/null | grep -q ":5000"; then
    echo -e "${GREEN}✅ Port 5000 is listening${NC}"
    sudo netstat -tuln | grep ":5000" || sudo ss -tuln | grep ":5000"
else
    echo -e "${RED}❌ Port 5000 is NOT listening${NC}"
fi

# Test Backend Locally
echo -e "\n${YELLOW}🌐 Testing Backend (localhost):${NC}"
if curl -s --max-time 5 http://localhost:5000/ > /dev/null; then
    echo -e "${GREEN}✅ Backend responding on localhost:5000${NC}"
    curl -s http://localhost:5000/
else
    echo -e "${RED}❌ Backend NOT responding on localhost:5000${NC}"
fi

# Test Backend Externally
echo -e "\n${YELLOW}🌐 Testing Backend (external IP):${NC}"
EXTERNAL_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "52.66.236.157")
if curl -s --max-time 5 "http://${EXTERNAL_IP}:5000/" > /dev/null; then
    echo -e "${GREEN}✅ Backend responding on ${EXTERNAL_IP}:5000${NC}"
else
    echo -e "${RED}❌ Backend NOT responding on ${EXTERNAL_IP}:5000${NC}"
    echo -e "${YELLOW}⚠️  This might be a firewall issue${NC}"
fi

# Check Firewall
echo -e "\n${YELLOW}🔥 Firewall Status:${NC}"
if command -v ufw &> /dev/null; then
    FIREWALL_STATUS=$(sudo ufw status | grep -i "5000" || echo "Port 5000 not in rules")
    if echo "$FIREWALL_STATUS" | grep -q "5000"; then
        echo -e "${GREEN}✅ Firewall rule found for port 5000${NC}"
        echo "$FIREWALL_STATUS"
    else
        echo -e "${YELLOW}⚠️  Port 5000 not explicitly allowed in firewall${NC}"
        echo "Run: sudo ufw allow 5000/tcp"
    fi
elif command -v firewall-cmd &> /dev/null; then
    FIREWALL_STATUS=$(sudo firewall-cmd --list-ports 2>/dev/null | grep -i "5000" || echo "Port 5000 not in rules")
    if echo "$FIREWALL_STATUS" | grep -q "5000"; then
        echo -e "${GREEN}✅ Firewall rule found for port 5000${NC}"
    else
        echo -e "${YELLOW}⚠️  Port 5000 not explicitly allowed in firewall${NC}"
        echo "Run: sudo firewall-cmd --permanent --add-port=5000/tcp && sudo firewall-cmd --reload"
    fi
else
    echo -e "${YELLOW}⚠️  Firewall command not found${NC}"
fi

# Check Backend Logs
echo -e "\n${YELLOW}📋 Recent Backend Logs (last 20 lines):${NC}"
if pm2 logs hope-physicians-backend --lines 20 --nostream 2>/dev/null | tail -20; then
    echo ""
else
    echo -e "${RED}❌ Could not read PM2 logs${NC}"
    if [ -f ~/hope-physicians/logs/backend-error.log ]; then
        echo -e "${YELLOW}Checking error log file:${NC}"
        tail -20 ~/hope-physicians/logs/backend-error.log
    fi
fi

# Check .env file
echo -e "\n${YELLOW}📝 Backend .env Configuration:${NC}"
if [ -f ~/hope-physicians/backend/.env ]; then
    echo -e "${GREEN}✅ .env file exists${NC}"
    echo "PORT: $(grep '^PORT=' ~/hope-physicians/backend/.env | cut -d'=' -f2 || echo 'not set')"
    echo "NODE_ENV: $(grep '^NODE_ENV=' ~/hope-physicians/backend/.env | cut -d'=' -f2 || echo 'not set')"
    echo "CORS_ORIGINS: $(grep '^CORS_ORIGINS=' ~/hope-physicians/backend/.env | cut -d'=' -f2 || echo 'not set')"
else
    echo -e "${RED}❌ .env file not found${NC}"
fi

# Check Nginx (if using reverse proxy)
echo -e "\n${YELLOW}🌐 Nginx Status:${NC}"
if command -v nginx &> /dev/null; then
    if sudo systemctl is-active --quiet nginx 2>/dev/null || pgrep nginx > /dev/null; then
        echo -e "${GREEN}✅ Nginx is running${NC}"
        if sudo nginx -t 2>/dev/null; then
            echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
        else
            echo -e "${RED}❌ Nginx configuration has errors${NC}"
            sudo nginx -t
        fi
    else
        echo -e "${RED}❌ Nginx is NOT running${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Nginx not installed${NC}"
fi

# Summary
echo -e "\n${YELLOW}════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 Summary:${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"

if pm2 list | grep -q "hope-physicians-backend.*online"; then
    echo -e "${GREEN}✅ Backend process: RUNNING${NC}"
else
    echo -e "${RED}❌ Backend process: NOT RUNNING${NC}"
    echo -e "${YELLOW}💡 Fix: pm2 start ~/hope-physicians/backend/server.js --name hope-physicians-backend${NC}"
fi

if curl -s --max-time 2 http://localhost:5000/ > /dev/null; then
    echo -e "${GREEN}✅ Backend localhost: ACCESSIBLE${NC}"
else
    echo -e "${RED}❌ Backend localhost: NOT ACCESSIBLE${NC}"
    echo -e "${YELLOW}💡 Fix: Check backend logs and restart${NC}"
fi

if curl -s --max-time 2 "http://${EXTERNAL_IP}:5000/" > /dev/null; then
    echo -e "${GREEN}✅ Backend external: ACCESSIBLE${NC}"
else
    echo -e "${RED}❌ Backend external: NOT ACCESSIBLE${NC}"
    echo -e "${YELLOW}💡 Fix: Open firewall port 5000 or use Nginx reverse proxy${NC}"
fi

echo ""
