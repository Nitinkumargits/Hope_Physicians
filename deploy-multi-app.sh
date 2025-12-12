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

# Install build tools
echo -e "${YELLOW}🔧 Installing build tools...${NC}"
if [ -f /etc/debian_version ]; then
    sudo apt-get update -qq
    sudo apt-get install -y build-essential python3 make g++ git || true
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    sudo yum groupinstall -y "Development Tools" 2>/dev/null || sudo dnf groupinstall -y "Development Tools" 2>/dev/null || true
    sudo yum install -y python3 make gcc-c++ git 2>/dev/null || sudo dnf install -y python3 make gcc-c++ git 2>/dev/null || true
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
    echo -e "\n${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}📦 Deploying: $APP_NAME${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}\n"
    
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
    local APP_DIR=$(node -e "console.log(JSON.parse('$APP_CONFIG').directory)")
    local REPO_URL=$(node -e "console.log(JSON.parse('$APP_CONFIG').repo || '')")
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
        echo -e "${YELLOW}🔧 Deploying Backend...${NC}"
        cd "$BACKEND_DIR"
        
        # Install dependencies
        echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
        echo "⏳ This may take a few minutes..."
        npm ci --production=false || npm install
        echo "✅ Dependencies installed"
        
        # Generate Prisma Client if exists
        if [ -f "prisma/schema.prisma" ]; then
            echo -e "${YELLOW}🔨 Generating Prisma Client...${NC}"
            npm run prisma:generate || npx prisma generate || true
            
            # Run migrations
            echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
            npx prisma migrate deploy --skip-generate 2>/dev/null || npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || true
        fi
        
        # Create .env file
        echo -e "${YELLOW}📝 Creating .env file...${NC}"
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
            echo -e "${YELLOW}🚀 Starting backend with PM2...${NC}"
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
        echo -e "${YELLOW}🎨 Deploying Frontend...${NC}"
        cd "$FRONTEND_DIR"
        
        # Check if dist already exists (from CI build)
        if [ ! -d "$FRONTEND_DIST" ] || [ ! "$(ls -A $FRONTEND_DIST 2>/dev/null)" ]; then
            # Install dependencies
            echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
            echo "⏳ This may take a few minutes..."
            npm ci --legacy-peer-deps --production=false || npm install --legacy-peer-deps
            echo "✅ Dependencies installed"
            
            # Build frontend with base path if needed
            echo -e "${YELLOW}🏗️  Building frontend...${NC}"
            echo "⏳ Building may take a few minutes..."
            if [ "$NGINX_FRONTEND_PATH" != "/" ]; then
                # Set base path for React Router
                export VITE_BASE_PATH="$NGINX_FRONTEND_PATH"
                export VITE_API_URL="$NGINX_API_PATH"
            fi
            eval "$FRONTEND_BUILD_CMD" || npm run build || npx vite build
            echo -e "${GREEN}✅ Frontend built${NC}"
        else
            echo -e "${GREEN}✅ Frontend build already exists${NC}"
        fi
        
        # Ensure proper permissions
        chmod -R 755 "$FRONTEND_DIR/$FRONTEND_DIST" 2>/dev/null || true
        chmod 755 "$FRONTEND_DIR" 2>/dev/null || true
        chmod 755 "$(dirname "$FRONTEND_DIR")" 2>/dev/null || true
        
        cd - > /dev/null
    fi
    
    echo -e "${GREEN}✅ $APP_NAME deployment completed${NC}"
}

# Read apps from config
APPS=$(node -e "const config = require('./apps.config.json'); console.log(config.apps.map(a => a.name).join(' '))")

# Deploy each app
for APP_NAME in $APPS; do
    deploy_app "$APP_NAME"
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

# Show PM2 status
echo -e "\n${YELLOW}📊 PM2 Status:${NC}"
pm2 list

echo -e "\n${GREEN}🎉 Multi-application deployment completed!${NC}"
