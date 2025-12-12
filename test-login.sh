#!/bin/bash
# Test Login Endpoint - Run on Server
# Usage: chmod +x test-login.sh && ./test-login.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔍 Testing Login Endpoint...${NC}\n"

# Test 1: Backend is running
echo -e "${YELLOW}1. Checking backend...${NC}"
if curl -s --max-time 2 http://localhost:5000/ > /dev/null; then
    echo -e "${GREEN}✅ Backend is running${NC}\n"
else
    echo -e "${RED}❌ Backend is NOT running${NC}\n"
    exit 1
fi

# Test 2: Test admin login
echo -e "${YELLOW}2. Testing admin login...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hopephysicians.com","password":"admin123"}')

if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Admin login successful${NC}"
    echo "Response: $(echo $RESPONSE | jq -r '.user.email // "Token received"')"
else
    echo -e "${RED}❌ Admin login failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 3: Test doctor login
echo -e "${YELLOW}3. Testing doctor login...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@hopephysicians.com","password":"doctor123"}')

if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Doctor login successful${NC}"
else
    echo -e "${RED}❌ Doctor login failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 4: Test patient login
echo -e "${YELLOW}4. Testing patient login...${NC}"
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"patient123"}')

if echo "$RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✅ Patient login successful${NC}"
else
    echo -e "${RED}❌ Patient login failed${NC}"
    echo "Response: $RESPONSE"
fi
echo ""

# Test 5: Check database connection
echo -e "${YELLOW}5. Checking database connection...${NC}"
cd ~/hope-physicians/backend 2>/dev/null || cd backend
if [ -f "scripts/check-users.js" ]; then
    node scripts/check-users.js
else
    echo -e "${YELLOW}⚠️  check-users.js not found, skipping${NC}"
fi

echo -e "\n${YELLOW}════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 Summary:${NC}"
echo -e "${YELLOW}════════════════════════════════════════${NC}"
echo ""
echo "If login fails, run:"
echo "  cd ~/hope-physicians/backend"
echo "  npm run prisma:seed"
echo ""
