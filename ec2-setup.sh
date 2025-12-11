#!/bin/bash

# EC2 Initial Setup Script for Hope Physicians
# Run this script once on a fresh EC2 instance

set -e

echo "🚀 Setting up EC2 instance for Hope Physicians..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Node.js 18.x
echo -e "${YELLOW}📦 Installing Node.js 18...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Install PM2 globally
echo -e "${YELLOW}📦 Installing PM2...${NC}"
sudo npm install -g pm2

# Setup PM2 startup
echo -e "${YELLOW}⚙️  Configuring PM2 startup...${NC}"
pm2 startup systemd -u $USER --hp /home/$USER
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp /home/$USER

# Install Nginx
echo -e "${YELLOW}📦 Installing Nginx...${NC}"
sudo apt-get install -y nginx

# Install Git (if not already installed)
if ! command -v git &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Git...${NC}"
    sudo apt-get install -y git
fi

# Create application directory
APP_DIR="/home/$USER/hope-physicians"
echo -e "${YELLOW}📁 Creating application directory: $APP_DIR${NC}"
mkdir -p $APP_DIR
mkdir -p $APP_DIR/logs

# Setup firewall (UFW)
echo -e "${YELLOW}🔥 Configuring firewall...${NC}"
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw --force enable

# Install build tools (for native modules)
echo -e "${YELLOW}📦 Installing build tools...${NC}"
sudo apt-get install -y build-essential python3

echo -e "\n${GREEN}✅ EC2 setup completed!${NC}\n"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Clone your repository: git clone https://github.com/Shubham96681/hope_physician.git $APP_DIR"
echo -e "2. Add GitHub secrets for EC2 deployment"
echo -e "3. Push to master branch to trigger deployment"
echo -e "\n${YELLOW}Firewall ports opened:${NC}"
echo -e "  - 22 (SSH)"
echo -e "  - 80 (HTTP)"
echo -e "  - 443 (HTTPS)"

