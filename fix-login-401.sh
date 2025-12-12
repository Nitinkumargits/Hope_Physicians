#!/bin/bash
# Fix 401 Login Error - Run on Server
# This script diagnoses and fixes login authentication issues

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}🔧 Fixing 401 Login Error...${NC}\n"

# Navigate to backend directory
cd ~/hope-physicians/backend || {
    echo -e "${RED}❌ Backend directory not found!${NC}"
    exit 1
}

# Step 1: Check if users exist
echo -e "${YELLOW}1. Checking if users exist in database...${NC}"
node scripts/check-users.js || {
    echo -e "${RED}❌ Failed to check users${NC}"
    exit 1
}

# Step 2: Fix login issues (create/update users)
echo -e "\n${YELLOW}2. Fixing login issues (creating/updating users)...${NC}"
node scripts/fix-login.js || {
    echo -e "${RED}❌ Failed to fix login${NC}"
    exit 1
}

# Step 3: Test login endpoint
echo -e "\n${YELLOW}3. Testing login endpoint...${NC}"
node scripts/test-login.js || {
    echo -e "${RED}❌ Failed to test login${NC}"
    exit 1
}

# Step 4: Restart backend
echo -e "\n${YELLOW}4. Restarting backend...${NC}"
pm2 restart hope-physicians-backend || {
    echo -e "${RED}❌ Failed to restart backend${NC}"
    exit 1
}

echo -e "\n${GREEN}✅ Login fix completed!${NC}"
echo -e "\n${YELLOW}📋 Test Credentials:${NC}"
echo "  Admin:   admin@hopephysicians.com / admin123"
echo "  Doctor:  doctor@hopephysicians.com / doctor123"
echo "  Patient: patient@example.com / patient123"
echo "  Staff:   staff@hopephysicians.com / staff123"
echo ""
echo -e "${YELLOW}🧪 Test in browser:${NC}"
echo "  http://52.66.236.157/portal/login"
echo ""
