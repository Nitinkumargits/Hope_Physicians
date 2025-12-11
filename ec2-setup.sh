#!/bin/bash

# EC2 Initial Setup Script
# Run this once on a fresh EC2 instance
# Supports both Debian/Ubuntu and RHEL/Amazon Linux

set -e

echo "🚀 Setting up EC2 instance for Hope Physicians..."

# Detect OS
if [ -f /etc/debian_version ]; then
    OS_TYPE="debian"
elif [ -f /etc/redhat-release ]; then
    OS_TYPE="rhel"
else
    OS_TYPE="unknown"
fi

echo "Detected OS: $OS_TYPE"

# Update system
echo "📦 Updating system packages..."
if [ "$OS_TYPE" = "debian" ]; then
    sudo apt-get update
    sudo apt-get upgrade -y
elif [ "$OS_TYPE" = "rhel" ]; then
    sudo yum update -y
fi

# Install Node.js 20
echo "📦 Installing Node.js 20..."
if [ "$OS_TYPE" = "debian" ]; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
elif [ "$OS_TYPE" = "rhel" ]; then
    curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
    sudo yum install -y nodejs 2>/dev/null || sudo dnf install -y nodejs 2>/dev/null || true
fi

# Install PM2
echo "📦 Installing PM2..."
sudo npm install -g pm2
if systemctl --version &>/dev/null; then
    pm2 startup systemd -u $USER --hp /home/$USER 2>/dev/null | grep "sudo" | bash || true
fi

# Install Nginx
echo "📦 Installing Nginx..."
if [ "$OS_TYPE" = "debian" ]; then
    sudo apt-get install -y nginx
elif [ "$OS_TYPE" = "rhel" ]; then
    sudo yum install -y nginx
fi

# Install Git
if ! command -v git &> /dev/null; then
    echo "📦 Installing Git..."
    if [ "$OS_TYPE" = "debian" ]; then
        sudo apt-get install -y git
    elif [ "$OS_TYPE" = "rhel" ]; then
        sudo yum install -y git
    fi
fi

# Install build tools (required for native modules like better-sqlite3)
echo "📦 Installing build tools..."
if [ "$OS_TYPE" = "debian" ]; then
    sudo apt-get install -y build-essential python3 make g++
elif [ "$OS_TYPE" = "rhel" ]; then
    sudo yum groupinstall -y "Development Tools" 2>/dev/null || sudo dnf groupinstall -y "Development Tools" 2>/dev/null || true
    sudo yum install -y python3 make gcc-c++ 2>/dev/null || sudo dnf install -y python3 make gcc-c++ 2>/dev/null || true
fi

# Setup firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw --force enable
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=ssh
    sudo firewall-cmd --permanent --add-service=http
    sudo firewall-cmd --permanent --add-service=https
    sudo firewall-cmd --reload
fi

# Create application directory
mkdir -p ~/hope-physicians/logs

echo ""
echo "✅ EC2 setup completed!"
echo "Ports opened: 22 (SSH), 80 (HTTP), 443 (HTTPS)"

