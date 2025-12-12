#!/bin/bash

# Multi-Application Deployment Script for EC2
# Deploys multiple applications on a single EC2 instance based on apps.config.json

set -e

echo "🚀 Starting multi-application deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration file
CONFIG_FILE="./apps.config.json"
if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}❌ apps.config.json not found!${NC}"
    exit 1
fi

# Memory optimization functions
free_memory() {
    echo -e "${YELLOW}🧹 Freeing memory...${NC}"
    sudo sync
    sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches' 2>/dev/null || true
    sleep 1
}

check_memory() {
    local AVAILABLE=$(free -m | awk 'NR==2{printf "%.0f", $7}')
    echo -e "${BLUE}💾 Available memory: ${AVAILABLE}MB${NC}"
    if [ "$AVAILABLE" -lt 200 ]; then
        echo -e "${YELLOW}⚠️  Low memory detected, freeing cache...${NC}"
        free_memory
    fi
}

# Set Node.js memory limits for low-memory systems
export NODE_OPTIONS="--max-old-space-size=512"
export NPM_CONFIG_PREFER_OFFLINE=true
export NPM_CONFIG_AUDIT=false
export NPM_CONFIG_FUND=false

# Clear caches and free up space
echo -e "${YELLOW}🧹 Clearing caches and freeing up disk space...${NC}"

# Clear npm cache
if command -v npm &> /dev/null; then
    echo -e "${YELLOW}   Clearing npm cache...${NC}"
    npm cache clean --force 2>/dev/null || true
fi

# Clear package manager caches
if [ -f /etc/debian_version ]; then
    echo -e "${YELLOW}   Clearing apt cache...${NC}"
    sudo apt-get clean 2>/dev/null || true
    sudo apt-get autoclean 2>/dev/null || true
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    echo -e "${YELLOW}   Clearing yum/dnf cache...${NC}"
    sudo yum clean all 2>/dev/null || sudo dnf clean all 2>/dev/null || true
fi

# Clear system logs (keep last 100 lines)
echo -e "${YELLOW}   Clearing old logs...${NC}"
sudo journalctl --vacuum-time=1d 2>/dev/null || true
sudo find /var/log -name "*.log" -type f -mtime +7 -delete 2>/dev/null || true

# Remove old PM2 logs
if [ -d ~/.pm2/logs ]; then
    echo -e "${YELLOW}   Clearing old PM2 logs...${NC}"
    find ~/.pm2/logs -name "*.log" -type f -mtime +3 -delete 2>/dev/null || true
fi

# Show disk space and memory
echo -e "${GREEN}📊 Current disk space:${NC}"
df -h / | tail -1
echo -e "${GREEN}💾 Current memory:${NC}"
free -h | grep Mem
check_memory

# Install build tools (only if not already installed)
echo -e "${YELLOW}🔧 Checking build tools...${NC}"
if [ -f /etc/debian_version ]; then
    if ! command -v make &> /dev/null || ! command -v g++ &> /dev/null; then
        echo -e "${YELLOW}   Installing build tools...${NC}"
        sudo apt-get update -qq
        sudo apt-get install -y build-essential python3 make g++ git || true
    else
        echo -e "${GREEN}   ✅ Build tools already installed${NC}"
    fi
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    if ! command -v make &> /dev/null || ! command -v g++ &> /dev/null; then
        echo -e "${YELLOW}   Installing build tools...${NC}"
        # Use timeout to prevent hanging
        timeout 300 sudo yum groupinstall -y "Development Tools" 2>/dev/null || timeout 300 sudo dnf groupinstall -y "Development Tools" 2>/dev/null || true
        timeout 60 sudo yum install -y python3 make gcc-c++ git 2>/dev/null || timeout 60 sudo dnf install -y python3 make gcc-c++ git 2>/dev/null || true
    else
        echo -e "${GREEN}   ✅ Build tools already installed${NC}"
    fi
fi

# Install Node.js if needed
SYSTEM_NODE=$(/usr/bin/node --version 2>/dev/null || /usr/local/bin/node --version 2>/dev/null || node --version 2>/dev/null || echo "")
NODE_VERSION=$(echo "$SYSTEM_NODE" | cut -d'v' -f2 | cut -d'.' -f1 || echo "0")

if ! command -v node &> /dev/null || [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}📦 Installing Node.js 20...${NC}"
    if [ -f /etc/debian_version ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs 2>/dev/null || sudo dnf install -y nodejs 2>/dev/null || true
    fi
fi

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
    pm2 startup systemd -u $USER --hp /home/$USER || true
fi

# Install Nginx if not present
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Nginx...${NC}"
    if [ -f /etc/debian_version ]; then
        sudo apt-get install -y nginx || true
    elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
        sudo yum install -y nginx 2>/dev/null || sudo dnf install -y nginx 2>/dev/null || true
    fi
    if systemctl --version &>/dev/null; then
        sudo systemctl enable nginx 2>/dev/null || true
        sudo systemctl start nginx 2>/dev/null || true
    else
        sudo service nginx start 2>/dev/null || true
    fi
fi

# Function to deploy a single app
deploy_app() {
    local APP_NAME=$1
    echo -e "\n${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}🚀 DEPLOYING APPLICATION: $APP_NAME${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"
    
    # Extract app config using Node.js
    local APP_CONFIG=$(node -e "
        const config = require('./apps.config.json');
        const app = config.apps.find(a => a.name === '$APP_NAME');
        console.log(JSON.stringify(app || {}));
    ")
    
    if [ "$APP_CONFIG" == "{}" ] || [ -z "$APP_CONFIG" ]; then
        echo -e "${RED}❌ App '$APP_NAME' not found in config${NC}"
        return 1
    fi
    
    # Parse config
    local DISPLAY_NAME=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.displayName || '$APP_NAME')")
    local APP_DIR=$(node -e "console.log(JSON.parse('$APP_CONFIG').directory)")
    local REPO_URL=$(node -e "console.log(JSON.parse('$APP_CONFIG').repo || '')")
    
    echo -e "${GREEN}📱 Application: ${DISPLAY_NAME}${NC}"
    echo -e "${GREEN}🔑 Internal Name: ${APP_NAME}${NC}"
    local BACKEND_DIR=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.directory + '/' + c.backend.directory : '')")
    local FRONTEND_DIR=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.frontend ? c.directory + '/' + c.frontend.directory : '')")
    local BACKEND_PORT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.port : '')")
    local BACKEND_SCRIPT=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.backend ? c.backend.script : 'server.js')")
    local FRONTEND_BUILD_CMD=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.frontend ? c.frontend.buildCommand : 'npm run build')")
    local FRONTEND_DIST=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.frontend ? c.frontend.distDirectory : 'dist')")
    local NGINX_FRONTEND_PATH=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.nginx ? c.nginx.frontendPath : '/')")
    local NGINX_API_PATH=$(node -e "const c = JSON.parse('$APP_CONFIG'); console.log(c.nginx ? c.nginx.apiPath : '/api')")
    
    echo -e "${YELLOW}📁 App Directory: $APP_DIR${NC}"
    echo -e "${YELLOW}🔗 Repository: $REPO_URL${NC}"
    echo ""
    
    # Clone or update repository
    if [ -n "$REPO_URL" ] && [ "$REPO_URL" != "null" ]; then
        if [ -d "$APP_DIR/.git" ]; then
            echo -e "${YELLOW}🔄 Updating repository...${NC}"
            cd "$APP_DIR"
            # Try to pull from main branch first, then master
            git checkout main 2>/dev/null || git checkout master 2>/dev/null || true
            git pull origin main 2>/dev/null || git pull origin master 2>/dev/null || git pull || true
            cd - > /dev/null
        else
            echo -e "${YELLOW}📥 Cloning repository...${NC}"
            echo "⏳ Cloning may take a few minutes..."
            mkdir -p "$APP_DIR"
            # Try cloning main branch first, then master, then default
            if git clone -b main "$REPO_URL" "$APP_DIR" 2>/dev/null; then
                echo "✅ Repository cloned (main branch)"
            elif git clone -b master "$REPO_URL" "$APP_DIR" 2>/dev/null; then
                echo "✅ Repository cloned (master branch)"
            elif git clone "$REPO_URL" "$APP_DIR"; then
                echo "✅ Repository cloned (default branch)"
            else
                echo -e "${RED}❌ Failed to clone repository${NC}"
                return 1
            fi
        fi
    fi
    
    # Create logs directory
    mkdir -p "$APP_DIR/logs"
    
    # Deploy backend
    if [ -n "$BACKEND_DIR" ] && [ -d "$BACKEND_DIR" ]; then
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}🔧 [$APP_NAME] Deploying Backend${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        cd "$BACKEND_DIR"
        
        # Clean up node_modules if it exists (fixes ENOTEMPTY errors)
        if [ -d "node_modules" ]; then
            echo -e "${YELLOW}🧹 [$APP_NAME] Cleaning existing node_modules...${NC}"
            rm -rf node_modules package-lock.json 2>/dev/null || true
            echo -e "${GREEN}✅ [$APP_NAME] Cleanup completed${NC}"
        fi
        
        # Free memory before install
        check_memory
        free_memory
        
        # Clear npm cache before install
        echo -e "${YELLOW}🧹 [$APP_NAME] Clearing npm cache...${NC}"
        npm cache clean --force 2>/dev/null || true
        
        # Install dependencies with memory-optimized flags
        echo -e "${YELLOW}📦 [$APP_NAME] Installing backend dependencies (memory-optimized)...${NC}"
        echo -e "${YELLOW}⏳ This may take 3-7 minutes on low-memory systems...${NC}"
        echo -e "${YELLOW}💡 Using memory-efficient installation...${NC}"
        
        # Memory-optimized npm install with reduced concurrency
        export NPM_CONFIG_MAXSOCKETS=1
        export NPM_CONFIG_PROGRESS=false
        
        # Use timeout with memory-efficient flags
        if timeout 1200 npm ci --production=false --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error 2>&1 | sed "s/^/[$APP_NAME-BACKEND] /"; then
            echo -e "${GREEN}✅ [$APP_NAME] Backend dependencies installed successfully${NC}"
        elif timeout 1200 npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error 2>&1 | sed "s/^/[$APP_NAME-BACKEND] /"; then
            echo -e "${GREEN}✅ [$APP_NAME] Backend dependencies installed successfully (using npm install)${NC}"
        else
            echo -e "${RED}❌ [$APP_NAME] Failed to install backend dependencies (timeout or error)${NC}"
            return 1
        fi
        
        # Verify critical modules are installed
        echo -e "${YELLOW}🔍 [$APP_NAME] Verifying critical modules...${NC}"
        MISSING_MODULES=()
        # Check for express (most common backend framework)
        if [ ! -d "node_modules/express" ] && [ ! -f "node_modules/express/package.json" ]; then
            MISSING_MODULES+=("express")
        fi
        
        if [ ${#MISSING_MODULES[@]} -gt 0 ]; then
            echo -e "${RED}❌ [$APP_NAME] Critical modules missing: ${MISSING_MODULES[*]}${NC}"
            echo -e "${YELLOW}🔄 [$APP_NAME] Attempting to reinstall missing modules...${NC}"
            # Try to install express specifically
            for module in "${MISSING_MODULES[@]}"; do
                echo -e "${YELLOW}   Installing $module...${NC}"
                npm install "$module" --legacy-peer-deps --no-audit --no-fund --loglevel=error 2>&1 | sed "s/^/[$APP_NAME-BACKEND] /" || true
            done
            # Verify again
            if [ ! -d "node_modules/express" ] && [ ! -f "node_modules/express/package.json" ]; then
                echo -e "${RED}❌ [$APP_NAME] Failed to install express module. Please check package.json${NC}"
                return 1
            fi
        fi
        echo -e "${GREEN}✅ [$APP_NAME] Critical modules verified${NC}"
        
        # Free memory after install
        free_memory
        check_memory
        
        # Generate Prisma Client if exists
        if [ -f "prisma/schema.prisma" ]; then
            echo -e "${YELLOW}🔨 [$APP_NAME] Generating Prisma Client...${NC}"
            npm run prisma:generate || npx prisma generate || true
            
            # Run migrations
            echo -e "${YELLOW}🗄️  [$APP_NAME] Running database migrations...${NC}"
            npx prisma migrate deploy --skip-generate 2>/dev/null || npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || true
        fi
        
        # Create .env file
        echo -e "${YELLOW}📝 [$APP_NAME] Creating .env file...${NC}"
        cat > .env << EOF
NODE_ENV=${NODE_ENV:-production}
PORT=${BACKEND_PORT}
JWT_SECRET=${JWT_SECRET}
DATABASE_URL=${DATABASE_URL:-file:./data/${APP_NAME}.db}
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
EOF
        
        # Stop existing PM2 process
        pm2 stop "${APP_NAME}-backend" 2>/dev/null || true
        pm2 delete "${APP_NAME}-backend" 2>/dev/null || true
        
        # Start backend with PM2
        if [ -f "$BACKEND_SCRIPT" ]; then
            echo -e "${YELLOW}🚀 [$APP_NAME] Starting backend with PM2 on port $BACKEND_PORT...${NC}"
            pm2 start "$BACKEND_SCRIPT" \
                --name "${APP_NAME}-backend" \
                --cwd "$BACKEND_DIR" \
                --update-env \
                --env production \
                --log "$APP_DIR/logs/backend-out.log" \
                --error "$APP_DIR/logs/backend-error.log" \
                --time
            pm2 save --force
            echo -e "${GREEN}✅ Backend started${NC}"
        else
            echo -e "${YELLOW}⚠️  Backend script not found: $BACKEND_SCRIPT${NC}"
        fi
        
        cd - > /dev/null
    fi
    
    # Deploy frontend
    if [ -n "$FRONTEND_DIR" ] && [ -d "$FRONTEND_DIR" ]; then
        echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${BLUE}🎨 [$APP_NAME] Deploying Frontend${NC}"
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
        cd "$FRONTEND_DIR"
        
        # Check if dist already exists (from CI build)
        if [ ! -d "$FRONTEND_DIST" ] || [ ! "$(ls -A $FRONTEND_DIST 2>/dev/null)" ]; then
            # Clean up node_modules if it exists (fixes ENOTEMPTY errors)
            if [ -d "node_modules" ]; then
                echo -e "${YELLOW}🧹 [$APP_NAME] Cleaning existing frontend node_modules...${NC}"
                rm -rf node_modules package-lock.json 2>/dev/null || true
                echo -e "${GREEN}✅ [$APP_NAME] Frontend cleanup completed${NC}"
            fi
            
            # Free memory before install
            check_memory
            free_memory
            
            # Clear npm cache before install
            echo -e "${YELLOW}🧹 [$APP_NAME] Clearing npm cache...${NC}"
            npm cache clean --force 2>/dev/null || true
            
            # Install dependencies with memory-optimized flags
            echo -e "${YELLOW}📦 [$APP_NAME] Installing frontend dependencies (memory-optimized)...${NC}"
            echo -e "${YELLOW}⏳ This may take 3-7 minutes on low-memory systems...${NC}"
            echo -e "${YELLOW}💡 Using memory-efficient installation...${NC}"
            
            # Memory-optimized npm install with reduced concurrency
            export NPM_CONFIG_MAXSOCKETS=1
            export NPM_CONFIG_PROGRESS=false
            
            # Use timeout with memory-efficient flags
            if timeout 1200 npm ci --legacy-peer-deps --production=false --prefer-offline --no-audit --no-fund --loglevel=error 2>&1 | sed "s/^/[$APP_NAME-FRONTEND] /"; then
                echo -e "${GREEN}✅ [$APP_NAME] Frontend dependencies installed successfully${NC}"
            elif timeout 1200 npm install --legacy-peer-deps --prefer-offline --no-audit --no-fund --loglevel=error 2>&1 | sed "s/^/[$APP_NAME-FRONTEND] /"; then
                echo -e "${GREEN}✅ [$APP_NAME] Frontend dependencies installed successfully (using npm install)${NC}"
            else
                echo -e "${RED}❌ [$APP_NAME] Failed to install frontend dependencies (timeout or error)${NC}"
                return 1
            fi
            
            # Free memory after install
            free_memory
            check_memory
            
            # Free memory before build
            check_memory
            free_memory
            
            # Build frontend with base path if needed (memory-optimized)
            echo -e "${YELLOW}🏗️  [$APP_NAME] Building frontend (memory-optimized)...${NC}"
            echo -e "${YELLOW}⏳ Building may take 3-8 minutes on low-memory systems...${NC}"
            if [ "$NGINX_FRONTEND_PATH" != "/" ]; then
                # Set base path for React Router
                export VITE_BASE_PATH="$NGINX_FRONTEND_PATH"
                export VITE_API_URL="$NGINX_API_PATH"
            fi
            # Use memory-limited Node.js for build
            export NODE_OPTIONS="--max-old-space-size=512"
            if timeout 900 bash -c "$FRONTEND_BUILD_CMD" 2>&1 | sed "s/^/[$APP_NAME-BUILD] /"; then
                echo -e "${GREEN}✅ [$APP_NAME] Frontend built successfully${NC}"
            else
                echo -e "${RED}❌ [$APP_NAME] Frontend build failed${NC}"
                return 1
            fi
            
            # Free memory after build
            free_memory
            check_memory
        else
            echo -e "${GREEN}✅ [$APP_NAME] Frontend build already exists (skipping build)${NC}"
        fi
        
        # Ensure proper permissions
        chmod -R 755 "$FRONTEND_DIR/$FRONTEND_DIST" 2>/dev/null || true
        chmod 755 "$FRONTEND_DIR" 2>/dev/null || true
        chmod 755 "$(dirname "$FRONTEND_DIR")" 2>/dev/null || true
        
        cd - > /dev/null
    fi
    
    echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}✅ [$APP_NAME] Deployment completed successfully!${NC}"
    echo -e "${GREEN}📱 Application: ${DISPLAY_NAME}${NC}"
    echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"
}

# Read apps from config
APPS=$(node -e "const config = require('./apps.config.json'); console.log(config.apps.map(a => a.name).join(' '))")

# Show initial disk space and memory
echo -e "\n${GREEN}📊 Initial disk space:${NC}"
df -h / | tail -1
echo -e "${GREEN}💾 Initial memory:${NC}"
free -h | grep Mem
check_memory

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         MULTI-APPLICATION DEPLOYMENT STARTING                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${YELLOW}📋 Applications to deploy:${NC}"
for APP_NAME in $APPS; do
    DISPLAY_NAME=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app ? app.displayName || app.name : '$APP_NAME')")
    echo -e "   • ${DISPLAY_NAME} (${APP_NAME})"
done
echo ""

# Deploy each app
APP_COUNT=0
for APP_NAME in $APPS; do
    APP_COUNT=$((APP_COUNT + 1))
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📦 Deploying Application $APP_COUNT of $(echo $APPS | wc -w)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    deploy_app "$APP_NAME"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to deploy $APP_NAME${NC}"
        exit 1
    fi
done

# Configure Nginx for all apps
echo -e "\n${YELLOW}🌐 Configuring Nginx...${NC}"

# Generate Nginx config
NGINX_CONFIG=$(node -e "
const config = require('./apps.config.json');
let nginxConfig = 'server {\n';
nginxConfig += '    listen 80;\n';
nginxConfig += '    server_name _;\n\n';

config.apps.forEach(app => {
    const frontendPath = app.nginx.frontendPath || '/';
    const apiPath = app.nginx.apiPath || '/api';
    const frontendDir = app.directory + '/' + app.frontend.directory + '/' + app.frontend.distDirectory;
    const backendPort = app.backend.port;
    
    if (frontendPath === '/') {
        // Root app
        nginxConfig += '    root ' + frontendDir + ';\n';
        nginxConfig += '    index index.html;\n\n';
        nginxConfig += '    location / {\n';
        nginxConfig += '        try_files \\\$uri \\\$uri/ /index.html;\n';
        nginxConfig += '    }\n\n';
        nginxConfig += '    location ' + apiPath + ' {\n';
        nginxConfig += '        proxy_pass http://localhost:' + backendPort + ';\n';
        nginxConfig += '        proxy_http_version 1.1;\n';
        nginxConfig += '        proxy_set_header Upgrade \\\$http_upgrade;\n';
        nginxConfig += '        proxy_set_header Connection \"upgrade\";\n';
        nginxConfig += '        proxy_set_header Host \\\$host;\n';
        nginxConfig += '        proxy_set_header X-Real-IP \\\$remote_addr;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-Proto \\\$scheme;\n';
        nginxConfig += '        proxy_cache_bypass \\\$http_upgrade;\n';
        nginxConfig += '    }\n\n';
    } else {
        // Sub-path app
        nginxConfig += '    location ' + frontendPath + ' {\n';
        nginxConfig += '        alias ' + frontendDir + '/;\n';
        nginxConfig += '        try_files \\\$uri \\\$uri/ ' + frontendPath + '/index.html;\n';
        nginxConfig += '    }\n\n';
        nginxConfig += '    location ' + apiPath + ' {\n';
        nginxConfig += '        proxy_pass http://localhost:' + backendPort + ';\n';
        nginxConfig += '        proxy_http_version 1.1;\n';
        nginxConfig += '        proxy_set_header Upgrade \\\$http_upgrade;\n';
        nginxConfig += '        proxy_set_header Connection \"upgrade\";\n';
        nginxConfig += '        proxy_set_header Host \\\$host;\n';
        nginxConfig += '        proxy_set_header X-Real-IP \\\$remote_addr;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-Proto \\\$scheme;\n';
        nginxConfig += '        proxy_cache_bypass \\\$http_upgrade;\n';
        nginxConfig += '    }\n\n';
    }
});

nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
nginxConfig += '        expires 1y;\n';
nginxConfig += '        add_header Cache-Control \"public, immutable\";\n';
nginxConfig += '    }\n';
nginxConfig += '}\n';

console.log(nginxConfig);
")

# Write Nginx config
if [ -d "/etc/nginx/sites-available" ]; then
    echo "$NGINX_CONFIG" | sudo tee /etc/nginx/sites-available/multi-app > /dev/null
    sudo mkdir -p /etc/nginx/sites-enabled
    sudo ln -sf /etc/nginx/sites-available/multi-app /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
elif [ -d "/etc/nginx/conf.d" ]; then
    echo "$NGINX_CONFIG" | sudo tee /etc/nginx/conf.d/multi-app.conf > /dev/null
    sudo rm -f /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/ssl.conf 2>/dev/null || true
fi

# Fix permissions for home directory and app directories
echo -e "${YELLOW}🔐 Fixing permissions...${NC}"
sudo chmod 755 /home/$USER 2>/dev/null || true
for APP_NAME in $APPS; do
    APP_DIR=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app ? app.directory : '')")
    if [ -n "$APP_DIR" ] && [ -d "$APP_DIR" ]; then
        sudo chmod 755 "$APP_DIR" 2>/dev/null || true
        FRONTEND_DIR=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app && app.frontend ? app.directory + '/' + app.frontend.directory : '')")
        if [ -n "$FRONTEND_DIR" ] && [ -d "$FRONTEND_DIR" ]; then
            sudo chmod 755 "$FRONTEND_DIR" 2>/dev/null || true
            DIST_DIR=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app && app.frontend ? app.directory + '/' + app.frontend.directory + '/' + app.frontend.distDirectory : '')")
            if [ -n "$DIST_DIR" ] && [ -d "$DIST_DIR" ]; then
                sudo chmod -R 755 "$DIST_DIR" 2>/dev/null || true
            fi
        fi
    fi
done

# Test and restart Nginx
if sudo nginx -t 2>/dev/null; then
    if systemctl --version &>/dev/null; then
        sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    else
        sudo service nginx restart 2>/dev/null || true
    fi
    echo -e "${GREEN}✅ Nginx configured and restarted${NC}"
else
    echo -e "${RED}❌ Nginx config test failed${NC}"
    sudo nginx -t
fi

# Show PM2 status with memory info
echo -e "\n${YELLOW}📊 PM2 Status:${NC}"
pm2 list
echo -e "\n${YELLOW}💾 Memory usage by PM2 processes:${NC}"
pm2 jlist 2>/dev/null | node -e "try { const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); data.forEach(p => console.log(\`  \${p.name}: \${(p.monit.memory / 1024 / 1024).toFixed(2)}MB\`)); } catch(e) {}" || echo "  (Memory info not available)"

# Final cleanup and memory free
echo -e "\n${YELLOW}🧹 Final cleanup...${NC}"
npm cache clean --force 2>/dev/null || true
if [ -f /etc/debian_version ]; then
    sudo apt-get clean 2>/dev/null || true
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    sudo yum clean all 2>/dev/null || sudo dnf clean all 2>/dev/null || true
fi

# Final memory cleanup
free_memory

echo -e "\n${GREEN}📊 Final disk space:${NC}"
df -h / | tail -1
echo -e "${GREEN}💾 Final memory:${NC}"
free -h | grep Mem

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         MULTI-APPLICATION DEPLOYMENT COMPLETED!                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo -e "${GREEN}✅ Successfully deployed applications:${NC}"
for APP_NAME in $APPS; do
    DISPLAY_NAME=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app ? app.displayName || app.name : '$APP_NAME')")
    BACKEND_PORT=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app && app.backend ? app.backend.port : 'N/A')")
    FRONTEND_PATH=$(node -e "const config = require('./apps.config.json'); const app = config.apps.find(a => a.name === '$APP_NAME'); console.log(app && app.nginx ? app.nginx.frontendPath : '/')")
    echo -e "   • ${DISPLAY_NAME} (${APP_NAME})"
    echo -e "     - Backend: Port ${BACKEND_PORT}"
    echo -e "     - Frontend: ${FRONTEND_PATH}"
done
echo -e "\n${GREEN}🎉 All applications are now running!${NC}"
