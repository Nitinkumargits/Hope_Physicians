#!/bin/bash

# Quick fix script for Ojoto Union backend dependencies
# Run this on EC2 to fix missing express module

set -e

echo "🔧 Fixing Ojoto Union backend dependencies..."

APP_DIR="/home/ec2-user/ojoto-union"
BACKEND_DIR="$APP_DIR/backend"

if [ ! -d "$BACKEND_DIR" ]; then
    echo "❌ Backend directory not found: $BACKEND_DIR"
    exit 1
fi

cd "$BACKEND_DIR"

echo "📁 Current directory: $(pwd)"
echo "📦 Checking node_modules..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules directory not found, installing dependencies..."
else
    # Check if express exists
    if [ ! -d "node_modules/express" ]; then
        echo "⚠️  express module not found in node_modules, reinstalling..."
        rm -rf node_modules package-lock.json
    else
        echo "✅ express module found"
        echo "🔍 Verifying other critical modules..."
        MISSING_MODULES=()
        for module in "express" "cors" "dotenv" "bcryptjs" "jsonwebtoken"; do
            if [ ! -d "node_modules/$module" ]; then
                MISSING_MODULES+=("$module")
            fi
        done
        if [ ${#MISSING_MODULES[@]} -eq 0 ]; then
            echo "✅ All critical modules found"
            echo "🔄 Restarting PM2 process..."
            pm2 restart ojoto-union-backend
            pm2 save
            echo "✅ Done! Check logs with: pm2 logs ojoto-union-backend"
            exit 0
        else
            echo "⚠️  Missing modules: ${MISSING_MODULES[*]}, reinstalling..."
            rm -rf node_modules package-lock.json
        fi
    fi
fi

# Clear npm cache
echo "🧹 Clearing npm cache..."
npm cache clean --force 2>/dev/null || true

# Install dependencies with memory optimization
echo "📦 Installing dependencies (this may take a few minutes)..."
export NODE_OPTIONS="--max-old-space-size=512"
export NPM_CONFIG_MAXSOCKETS=1

if npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error; then
    echo "✅ Dependencies installed successfully"
    
    # Verify express is installed
    if [ -d "node_modules/express" ]; then
        echo "✅ express module verified"
    else
        echo "❌ express module still not found after installation"
        exit 1
    fi
    
    # Restart PM2
    echo "🔄 Restarting PM2 process..."
    pm2 stop ojoto-union-backend 2>/dev/null || true
    pm2 delete ojoto-union-backend 2>/dev/null || true
    
    if [ -f "server.js" ]; then
        pm2 start server.js \
            --name "ojoto-union-backend" \
            --cwd "$BACKEND_DIR" \
            --update-env \
            --env production \
            --log "$APP_DIR/logs/backend-out.log" \
            --error "$APP_DIR/logs/backend-error.log" \
            --time
        pm2 save
        echo "✅ PM2 process restarted"
        echo "📊 Check status with: pm2 list"
        echo "📋 Check logs with: pm2 logs ojoto-union-backend"
    else
        echo "❌ server.js not found in $BACKEND_DIR"
        exit 1
    fi
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

