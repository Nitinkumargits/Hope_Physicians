#!/bin/bash

# Hope Physicians Deployment Script for EC2
# Fully automated deployment with no manual intervention

set -e

echo "🚀 Starting Hope Physicians deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
APP_DIR="/home/$USER/hope-physicians"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"
BACKEND_PORT=${PORT:-5000}
NODE_ENV=${NODE_ENV:-production}

echo -e "${YELLOW}📁 Application Directory: $APP_DIR${NC}"

# Install build tools first (needed for native modules)
echo -e "${YELLOW}🔧 Installing build tools...${NC}"
if [ -f /etc/debian_version ]; then
    # Debian/Ubuntu
    sudo apt-get update -qq
    sudo apt-get install -y build-essential python3 make g++ || true
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    # RHEL/CentOS/Amazon Linux
    sudo yum groupinstall -y "Development Tools" 2>/dev/null || sudo dnf groupinstall -y "Development Tools" 2>/dev/null || true
    sudo yum install -y python3 make gcc-c++ 2>/dev/null || sudo dnf install -y python3 make gcc-c++ 2>/dev/null || true
fi

# Install Node.js if not present or if version is less than 20
# Check system Node.js first (not NVM)
SYSTEM_NODE=$(/usr/bin/node --version 2>/dev/null || /usr/local/bin/node --version 2>/dev/null || node --version 2>/dev/null || echo "")
NODE_VERSION=$(echo "$SYSTEM_NODE" | cut -d'v' -f2 | cut -d'.' -f1 || echo "0")

if ! command -v node &> /dev/null || [ "$NODE_VERSION" -lt 20 ]; then
    echo -e "${YELLOW}📦 Installing Node.js 20...${NC}"
    # Detect OS and install accordingly
    if [ -f /etc/debian_version ]; then
        # Debian/Ubuntu
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
        # RHEL/CentOS/Amazon Linux
        curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
        sudo yum install -y nodejs 2>/dev/null || sudo dnf install -y nodejs 2>/dev/null || true
    else
        # Try using nvm as fallback
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" || {
            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
            export NVM_DIR="$HOME/.nvm"
            [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
        }
        nvm install 20
        nvm use 20
        nvm alias default 20
    fi
    echo -e "${GREEN}✅ Node.js installed${NC}"
fi

# Ensure we're using Node.js 20 (unset NVM if it's overriding)
unset NVM_DIR
export PATH="/usr/bin:/usr/local/bin:$PATH"

# Verify Node.js version
NODE_VER=$(node --version 2>/dev/null || echo "unknown")
NPM_VER=$(npm --version 2>/dev/null || echo "unknown")
echo -e "${GREEN}✅ Node.js: $NODE_VER${NC}"
echo -e "${GREEN}✅ npm: $NPM_VER${NC}"

# Install PM2 if not present
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    npm install -g pm2 || sudo npm install -g pm2
    # Setup PM2 startup only if systemd is available
    if systemctl --version &>/dev/null; then
        pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null | grep "sudo" | bash || true
    fi
    echo -e "${GREEN}✅ PM2 installed${NC}"
fi

# ============================================
# BACKEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🔧 Deploying Backend...${NC}"

cd $BACKEND_DIR

# Install dependencies
echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
# Ensure build tools are available
if ! command -v make &> /dev/null; then
    echo -e "${YELLOW}⚠️  'make' not found, installing build tools...${NC}"
    if [ -f /etc/debian_version ]; then
        sudo apt-get install -y build-essential python3 make g++ || true
    elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
        sudo yum install -y make gcc-c++ python3 2>/dev/null || sudo dnf install -y make gcc-c++ python3 2>/dev/null || true
    fi
fi
npm ci --production=false

# Generate Prisma Client
if [ -f "prisma/schema.prisma" ]; then
    echo -e "${YELLOW}🔨 Generating Prisma Client...${NC}"
    npm run prisma:generate
    
    # Run migrations
    echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
    npx prisma migrate deploy --skip-generate 2>/dev/null || npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo "⚠️  Database setup skipped"
fi

# Create/Update .env file
echo -e "${YELLOW}📝 Updating .env file...${NC}"
cat > $BACKEND_DIR/.env << EOF
NODE_ENV=${NODE_ENV}
PORT=${BACKEND_PORT}
JWT_SECRET=${JWT_SECRET}
DATABASE_URL=${DATABASE_URL:-file:./prisma/hope_physicians.db}
EMAIL_USER=${EMAIL_USER}
EMAIL_PASS=${EMAIL_PASS}
RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}
RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}
EOF
echo -e "${GREEN}✅ .env file updated${NC}"

# Stop existing PM2 process
pm2 stop hope-physicians-backend 2>/dev/null || true
pm2 delete hope-physicians-backend 2>/dev/null || true

# Start backend with PM2
echo -e "${YELLOW}🚀 Starting backend with PM2...${NC}"
cd $BACKEND_DIR

# Verify server.js exists
if [ ! -f "server.js" ]; then
    echo -e "${RED}❌ Error: server.js not found in $BACKEND_DIR${NC}"
    echo -e "${YELLOW}📁 Contents of $BACKEND_DIR:${NC}"
    ls -la $BACKEND_DIR | head -20
    exit 1
fi

# Start with PM2 using absolute path
pm2 start "$BACKEND_DIR/server.js" \
    --name "hope-physicians-backend" \
    --cwd "$BACKEND_DIR" \
    --update-env \
    --env production \
    --log "$APP_DIR/logs/backend-out.log" \
    --error "$APP_DIR/logs/backend-error.log" \
    --time

pm2 save --force
echo -e "${GREEN}✅ Backend started${NC}"

# ============================================
# FRONTEND DEPLOYMENT
# ============================================
echo -e "\n${YELLOW}🎨 Deploying Frontend...${NC}"

cd $FRONTEND_DIR

# Install dependencies
echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
npm ci

# Build frontend
echo -e "${YELLOW}🏗️  Building frontend...${NC}"
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"

# ============================================
# NGINX CONFIGURATION
# ============================================
if command -v nginx &> /dev/null; then
    echo -e "\n${YELLOW}🌐 Configuring Nginx...${NC}"
    
    NGINX_CONFIG="server {
    listen 80;
    server_name _;
    
    root $FRONTEND_DIR/dist;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control \"public, immutable\";
    }
}"
    
    # Debian/Ubuntu style
    if [ -d "/etc/nginx/sites-available" ]; then
        echo "$NGINX_CONFIG" | sudo tee /etc/nginx/sites-available/hope-physicians > /dev/null
        sudo mkdir -p /etc/nginx/sites-enabled
        sudo ln -sf /etc/nginx/sites-available/hope-physicians /etc/nginx/sites-enabled/
        sudo rm -f /etc/nginx/sites-enabled/default
    # RHEL/CentOS/Amazon Linux style
    elif [ -d "/etc/nginx/conf.d" ]; then
        echo "$NGINX_CONFIG" | sudo tee /etc/nginx/conf.d/hope-physicians.conf > /dev/null
    fi
    
    if sudo nginx -t 2>/dev/null; then
        if systemctl --version &>/dev/null; then
            sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || true
        else
            sudo service nginx reload 2>/dev/null || true
        fi
        echo -e "${GREEN}✅ Nginx configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Nginx config test failed${NC}"
    fi
fi

# ============================================
# FINAL STATUS
# ============================================
echo -e "\n${GREEN}✅ Deployment completed!${NC}\n"

pm2 status
echo ""
echo -e "${GREEN}🎉 Application is running!${NC}"
echo -e "${YELLOW}📍 Backend: http://localhost:$BACKEND_PORT${NC}"
echo -e "${YELLOW}📍 Frontend: http://localhost${NC}"

