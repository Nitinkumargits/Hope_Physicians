#!/bin/bash

# Fix Vite base path issue for Ojoto Union
# Ensures vite.config.js uses the environment variable correctly

set -e

echo "🔧 Fixing Vite base path configuration..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

FRONTEND_DIR="/home/ec2-user/ojoto-union/frontend"
VITE_CONFIG="$FRONTEND_DIR/vite.config.js"

if [ ! -f "$VITE_CONFIG" ]; then
    echo -e "${RED}❌ vite.config.js not found: $VITE_CONFIG${NC}"
    exit 1
fi

echo -e "${YELLOW}📄 Found vite.config.js${NC}"

# Check current config
echo -e "${YELLOW}📋 Current vite.config.js:${NC}"
cat "$VITE_CONFIG"

# Backup
cp "$VITE_CONFIG" "${VITE_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}✅ Backup created${NC}"

# Check if base is already set correctly
if grep -q "base.*process.env.VITE_BASE_PATH\|base.*'/ojoto-union'" "$VITE_CONFIG"; then
    echo -e "${GREEN}✅ Base path is already configured${NC}"
else
    echo -e "${YELLOW}🔧 Adding base path configuration...${NC}"
    
    # Add base path to vite.config.js
    # This is a simple approach - we'll add it to defineConfig
    if grep -q "defineConfig" "$VITE_CONFIG"; then
        # Replace or add base property
        if grep -q "base:" "$VITE_CONFIG"; then
            # Update existing base
            sed -i "s|base:.*|base: process.env.VITE_BASE_PATH || '/ojoto-union/',|" "$VITE_CONFIG"
        else
            # Add base after plugins
            sed -i '/plugins:.*\[/,/\]/ {
                /\]/ a\
  base: process.env.VITE_BASE_PATH || '\''/ojoto-union/'\'',
            }' "$VITE_CONFIG" || {
                # Alternative: add after defineConfig opening
                sed -i '/defineConfig({/a\
  base: process.env.VITE_BASE_PATH || '\''/ojoto-union/'\'',
' "$VITE_CONFIG"
            }
        fi
    else
        echo -e "${RED}❌ Cannot find defineConfig in vite.config.js${NC}"
        echo -e "${YELLOW}💡 Please manually add: base: process.env.VITE_BASE_PATH || '/ojoto-union/'${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ vite.config.js updated${NC}"
echo ""
echo -e "${YELLOW}📋 Updated vite.config.js:${NC}"
cat "$VITE_CONFIG"

echo ""
echo -e "${YELLOW}🏗️  Rebuilding frontend with correct base path...${NC}"
cd "$FRONTEND_DIR"

# Remove old build
rm -rf dist node_modules/.vite 2>/dev/null || true

# Set environment variables
export VITE_BASE_PATH="/ojoto-union"
export VITE_API_URL="/ojoto-union/api"
export NODE_OPTIONS="--max-old-space-size=512"

# Build
if npm run build 2>&1; then
    echo -e "${GREEN}✅ Frontend rebuilt successfully${NC}"
    
    # Verify asset paths
    echo ""
    echo -e "${YELLOW}🔍 Verifying asset paths in index.html:${NC}"
    if grep -q "/ojoto-union/assets" "$FRONTEND_DIR/dist/index.html"; then
        echo -e "${GREEN}✅ Asset paths now contain '/ojoto-union' - Perfect!${NC}"
    else
        echo -e "${YELLOW}⚠️  Asset paths still absolute. Checking vite.config.js...${NC}"
        cat "$VITE_CONFIG"
    fi
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Vite base path fixed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"

