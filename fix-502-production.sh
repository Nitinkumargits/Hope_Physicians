#!/bin/bash

# ============================================
# PRODUCTION FIX SCRIPT FOR 502 BAD GATEWAY
# ============================================
# This script diagnoses and fixes the 502 Bad Gateway error
# Usage: bash fix-502-production.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🔧 Production Fix Script for 502 Bad Gateway${NC}"
echo -e "${GREEN}============================================${NC}\n"

# Configuration
APP_DIR="${HOME}/hope-physicians"
BACKEND_DIR="${APP_DIR}/backend"
BACKEND_PORT="${PORT:-5000}"
PM2_NAME="hope-physicians-backend"

# ============================================
# STEP 1: CHECK BACKEND STATUS
# ============================================
echo -e "${YELLOW}📊 Step 1: Checking backend status...${NC}"

# Check if PM2 process exists
if pm2 list | grep -q "$PM2_NAME"; then
    PM2_STATUS=$(pm2 jlist | jq -r ".[] | select(.name==\"$PM2_NAME\") | .pm2_env.status" 2>/dev/null || echo "unknown")
    echo -e "  PM2 Status: ${PM2_STATUS}"
    
    if [ "$PM2_STATUS" != "online" ]; then
        echo -e "${RED}  ❌ Backend is not online in PM2${NC}"
        echo -e "${YELLOW}  📋 Recent logs:${NC}"
        pm2 logs "$PM2_NAME" --lines 20 --nostream 2>/dev/null || true
    else
        echo -e "${GREEN}  ✅ Backend is running in PM2${NC}"
    fi
else
    echo -e "${RED}  ❌ Backend process not found in PM2${NC}"
fi

# Check if port is in use
if command -v netstat &> /dev/null; then
    PORT_IN_USE=$(netstat -tuln 2>/dev/null | grep ":$BACKEND_PORT " || true)
elif command -v ss &> /dev/null; then
    PORT_IN_USE=$(ss -tuln 2>/dev/null | grep ":$BACKEND_PORT " || true)
elif command -v lsof &> /dev/null; then
    PORT_IN_USE=$(lsof -i :$BACKEND_PORT 2>/dev/null || true)
fi

if [ -n "$PORT_IN_USE" ]; then
    echo -e "${GREEN}  ✅ Port $BACKEND_PORT is in use${NC}"
else
    echo -e "${RED}  ❌ Port $BACKEND_PORT is not in use${NC}"
fi

# Test backend locally
echo -e "\n${YELLOW}  Testing backend locally...${NC}"
if curl -s -f "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Backend health check passed${NC}"
    curl -s "http://localhost:$BACKEND_PORT/health" | jq '.' 2>/dev/null || curl -s "http://localhost:$BACKEND_PORT/health"
    echo ""
elif curl -s -f "http://localhost:$BACKEND_PORT/" > /dev/null 2>&1; then
    echo -e "${YELLOW}  ⚠️  Backend responds but health check failed${NC}"
    curl -s "http://localhost:$BACKEND_PORT/"
    echo ""
else
    echo -e "${RED}  ❌ Backend is not responding on port $BACKEND_PORT${NC}"
fi

# ============================================
# STEP 2: CHECK DATABASE CONNECTION
# ============================================
echo -e "${YELLOW}📊 Step 2: Checking database connection...${NC}"

if [ -d "$BACKEND_DIR" ]; then
    cd "$BACKEND_DIR"
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        echo -e "${RED}  ❌ .env file not found${NC}"
    else
        echo -e "${GREEN}  ✅ .env file exists${NC}"
        
        # Test database connection
        if command -v node &> /dev/null; then
            echo -e "${YELLOW}  Testing database connection...${NC}"
            DB_TEST=$(node -e "
                require('dotenv').config();
                const { PrismaClient } = require('@prisma/client');
                const prisma = new PrismaClient();
                prisma.\$connect()
                    .then(() => {
                        console.log('OK');
                        prisma.\$disconnect();
                        process.exit(0);
                    })
                    .catch(e => {
                        console.error('ERROR:', e.message);
                        process.exit(1);
                    });
            " 2>&1) || true
            
            if echo "$DB_TEST" | grep -q "OK"; then
                echo -e "${GREEN}  ✅ Database connection successful${NC}"
            else
                echo -e "${RED}  ❌ Database connection failed${NC}"
                echo -e "  Error: $DB_TEST"
            fi
        fi
    fi
else
    echo -e "${RED}  ❌ Backend directory not found: $BACKEND_DIR${NC}"
fi

# ============================================
# STEP 3: CHECK NGINX CONFIGURATION
# ============================================
echo -e "\n${YELLOW}📊 Step 3: Checking Nginx configuration...${NC}"

if command -v nginx &> /dev/null; then
    # Test Nginx config
    if sudo nginx -t 2>/dev/null; then
        echo -e "${GREEN}  ✅ Nginx configuration is valid${NC}"
    else
        echo -e "${RED}  ❌ Nginx configuration has errors${NC}"
        sudo nginx -t
    fi
    
    # Check if Nginx is running
    if systemctl is-active --quiet nginx 2>/dev/null || service nginx status &>/dev/null; then
        echo -e "${GREEN}  ✅ Nginx is running${NC}"
    else
        echo -e "${RED}  ❌ Nginx is not running${NC}"
    fi
    
    # Check Nginx proxy configuration
    NGINX_CONFIG="/etc/nginx/sites-available/hope-physicians"
    if [ ! -f "$NGINX_CONFIG" ]; then
        NGINX_CONFIG="/etc/nginx/conf.d/hope-physicians.conf"
    fi
    
    if [ -f "$NGINX_CONFIG" ]; then
        echo -e "${GREEN}  ✅ Nginx config file found: $NGINX_CONFIG${NC}"
        
        # Check proxy_pass configuration
        if grep -q "proxy_pass http://localhost:$BACKEND_PORT" "$NGINX_CONFIG"; then
            echo -e "${GREEN}  ✅ proxy_pass configured correctly${NC}"
        else
            echo -e "${RED}  ❌ proxy_pass may be misconfigured${NC}"
            echo -e "${YELLOW}  Current proxy_pass setting:${NC}"
            grep "proxy_pass" "$NGINX_CONFIG" || echo "  Not found"
        fi
    else
        echo -e "${RED}  ❌ Nginx config file not found${NC}"
    fi
    
    # Check recent Nginx errors
    if [ -f "/var/log/nginx/error.log" ]; then
        echo -e "\n${YELLOW}  Recent Nginx errors:${NC}"
        sudo tail -n 10 /var/log/nginx/error.log 2>/dev/null | grep -i "502\|bad gateway\|connect" || echo "  No 502 errors found"
    fi
else
    echo -e "${RED}  ❌ Nginx is not installed${NC}"
fi

# ============================================
# STEP 4: FIX ISSUES
# ============================================
echo -e "\n${YELLOW}🔧 Step 4: Attempting to fix issues...${NC}"

# Fix 1: Restart backend if not running
if ! pm2 list | grep -q "$PM2_NAME.*online"; then
    echo -e "${YELLOW}  Restarting backend...${NC}"
    
    if [ -f "$BACKEND_DIR/server.js" ]; then
        # Stop existing process
        pm2 stop "$PM2_NAME" 2>/dev/null || true
        pm2 delete "$PM2_NAME" 2>/dev/null || true
        
        # Start backend
        cd "$BACKEND_DIR"
        
        # Ensure .env exists
        if [ ! -f ".env" ]; then
            echo -e "${YELLOW}  ⚠️  .env file missing, creating from environment variables...${NC}"
            cat > .env << EOF
NODE_ENV=production
PORT=$BACKEND_PORT
DATABASE_URL=\${DATABASE_URL}
JWT_SECRET=\${JWT_SECRET}
EMAIL_USER=\${EMAIL_USER}
EMAIL_PASS=\${EMAIL_PASS}
CORS_ORIGINS=http://52.66.236.157,http://52.66.236.157:80,http://52.66.236.157:443
EOF
        fi
        
        # Install dependencies if needed
        if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/prisma" ]; then
            echo -e "${YELLOW}  Installing dependencies...${NC}"
            npm install --production=false 2>&1 | tail -5
        fi
        
        # Generate Prisma client if needed
        if [ -f "prisma/schema.prisma" ]; then
            echo -e "${YELLOW}  Generating Prisma client...${NC}"
            npx prisma generate 2>&1 | tail -5 || true
        fi
        
        # Start with PM2
        pm2 start "$BACKEND_DIR/server.js" \
            --name "$PM2_NAME" \
            --cwd "$BACKEND_DIR" \
            --update-env \
            --env production \
            --log "$APP_DIR/logs/backend-out.log" \
            --error "$APP_DIR/logs/backend-error.log" \
            --time \
            --max-memory-restart 400M \
            --node-args="--max-old-space-size=384" \
            --autorestart \
            --max-restarts 10 \
            --min-uptime 10000
        
        pm2 save --force
        
        # Wait for backend to start
        echo -e "${YELLOW}  Waiting for backend to start...${NC}"
        sleep 5
        
        # Test backend
        if curl -s -f "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
            echo -e "${GREEN}  ✅ Backend started successfully${NC}"
        else
            echo -e "${RED}  ❌ Backend failed to start${NC}"
            echo -e "${YELLOW}  📋 Backend logs:${NC}"
            pm2 logs "$PM2_NAME" --lines 30 --nostream 2>/dev/null || tail -30 "$APP_DIR/logs/backend-error.log" 2>/dev/null || true
        fi
    else
        echo -e "${RED}  ❌ server.js not found in $BACKEND_DIR${NC}"
    fi
else
    echo -e "${GREEN}  ✅ Backend is already running${NC}"
fi

# Fix 2: Restart Nginx
if command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}  Restarting Nginx...${NC}"
    if sudo nginx -t 2>/dev/null; then
        sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
        sleep 2
        
        if systemctl is-active --quiet nginx 2>/dev/null || service nginx status &>/dev/null; then
            echo -e "${GREEN}  ✅ Nginx restarted successfully${NC}"
        else
            echo -e "${RED}  ❌ Nginx failed to restart${NC}"
        fi
    else
        echo -e "${RED}  ❌ Nginx config test failed, not restarting${NC}"
        sudo nginx -t
    fi
fi

# ============================================
# STEP 5: VERIFY FIX
# ============================================
echo -e "\n${YELLOW}✅ Step 5: Verifying fix...${NC}"

# Wait a moment for services to stabilize
sleep 3

# Test backend health
echo -e "${YELLOW}  Testing backend health endpoint...${NC}"
if curl -s -f "http://localhost:$BACKEND_PORT/health" > /dev/null 2>&1; then
    HEALTH_RESPONSE=$(curl -s "http://localhost:$BACKEND_PORT/health")
    echo -e "${GREEN}  ✅ Backend health check: OK${NC}"
    echo "$HEALTH_RESPONSE" | jq '.' 2>/dev/null || echo "$HEALTH_RESPONSE"
else
    echo -e "${RED}  ❌ Backend health check failed${NC}"
fi

# Test Nginx proxy
echo -e "\n${YELLOW}  Testing Nginx proxy...${NC}"
if curl -s -f "http://localhost/api/health" > /dev/null 2>&1; then
    PROXY_RESPONSE=$(curl -s "http://localhost/api/health")
    echo -e "${GREEN}  ✅ Nginx proxy: OK${NC}"
    echo "$PROXY_RESPONSE" | jq '.' 2>/dev/null || echo "$PROXY_RESPONSE"
else
    echo -e "${RED}  ❌ Nginx proxy failed${NC}"
    echo -e "${YELLOW}  Testing direct backend...${NC}"
    curl -s "http://localhost:$BACKEND_PORT/health" || echo "Backend not responding"
fi

# Test appointments endpoint
echo -e "\n${YELLOW}  Testing appointments endpoint...${NC}"
if curl -s -f -X POST "http://localhost:$BACKEND_PORT/api/appointments" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@test.com","phone":"1234567890","department":"Family Medicine"}' \
    > /dev/null 2>&1; then
    echo -e "${GREEN}  ✅ Appointments endpoint: OK${NC}"
else
    RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "http://localhost:$BACKEND_PORT/api/appointments" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@test.com","phone":"1234567890","department":"Family Medicine"}' 2>&1 || echo "ERROR")
    HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
    echo -e "${YELLOW}  ⚠️  Appointments endpoint returned: $HTTP_CODE${NC}"
fi

# ============================================
# FINAL STATUS
# ============================================
echo -e "\n${GREEN}📊 Final Status:${NC}"
echo -e "${GREEN}================${NC}\n"

pm2 status "$PM2_NAME" 2>/dev/null || echo -e "${RED}Backend not in PM2${NC}"

echo -e "\n${YELLOW}📋 Useful Commands:${NC}"
echo -e "  Check backend logs: ${GREEN}pm2 logs $PM2_NAME${NC}"
echo -e "  Check Nginx logs: ${GREEN}sudo tail -f /var/log/nginx/error.log${NC}"
echo -e "  Restart backend: ${GREEN}pm2 restart $PM2_NAME${NC}"
echo -e "  Restart Nginx: ${GREEN}sudo systemctl restart nginx${NC}"
echo -e "  Test health: ${GREEN}curl http://localhost:$BACKEND_PORT/health${NC}"
echo -e "  Test proxy: ${GREEN}curl http://localhost/api/health${NC}"

echo -e "\n${GREEN}✅ Fix script completed!${NC}"

