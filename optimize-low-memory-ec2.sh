#!/bin/bash

# EC2 Low-Memory Optimization Script
# Optimizes EC2 instance for running 2 applications with minimal memory
# Run this once after initial deployment

set -e

echo "🚀 Starting EC2 memory optimization for low-memory instance..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo -e "${YELLOW}⚠️  This script requires sudo privileges${NC}"
    echo "Please run with: sudo bash optimize-low-memory-ec2.sh"
    exit 1
fi

# Get total memory
TOTAL_MEM=$(free -m | awk 'NR==2{print $2}')
echo -e "${BLUE}💾 Total system memory: ${TOTAL_MEM}MB${NC}"

# ============================================
# 1. SETUP SWAP (1-2GB if RAM < 4GB)
# ============================================
echo -e "\n${YELLOW}📦 Setting up swap space...${NC}"

if [ "$TOTAL_MEM" -lt 4096 ]; then
    SWAP_SIZE="2G"
    echo -e "${YELLOW}   Low memory detected (<4GB), creating ${SWAP_SIZE} swap...${NC}"
    
    # Check if swap already exists
    if [ -f /swapfile ] || swapon --show | grep -q swapfile; then
        echo -e "${GREEN}   ✅ Swap file already exists${NC}"
        swapon --show
    else
        # Create swap file
        echo -e "${YELLOW}   Creating ${SWAP_SIZE} swap file...${NC}"
        fallocate -l $SWAP_SIZE /swapfile 2>/dev/null || dd if=/dev/zero of=/swapfile bs=1M count=2048
        chmod 600 /swapfile
        mkswap /swapfile
        swapon /swapfile
        
        # Make swap permanent
        if ! grep -q "/swapfile" /etc/fstab; then
            echo "/swapfile none swap sw 0 0" >> /etc/fstab
        fi
        
        # Optimize swappiness (prefer RAM, use swap when needed)
        echo "vm.swappiness=10" >> /etc/sysctl.conf
        sysctl vm.swappiness=10
        
        echo -e "${GREEN}   ✅ Swap file created and activated${NC}"
    fi
else
    echo -e "${GREEN}   ✅ Sufficient memory (>=4GB), skipping swap${NC}"
fi

# ============================================
# 2. OPTIMIZE PM2 MEMORY LIMITS
# ============================================
echo -e "\n${YELLOW}🔧 Optimizing PM2 memory limits...${NC}"

# Update PM2 processes with strict memory limits
if command -v pm2 &> /dev/null; then
    # Set max memory restart to 400MB per app (800MB total for 2 apps)
    pm2 set pm2:autodump false
    pm2 set pm2:autorestart true
    
    # Update each app's memory limit
    pm2 restart hope-physicians-backend --update-env --max-memory-restart 400M 2>/dev/null || true
    pm2 restart ojoto-union-backend --update-env --max-memory-restart 400M 2>/dev/null || true
    
    # Save PM2 configuration
    pm2 save --force
    
    echo -e "${GREEN}   ✅ PM2 memory limits configured (400MB per app)${NC}"
else
    echo -e "${YELLOW}   ⚠️  PM2 not found, skipping${NC}"
fi

# ============================================
# 3. OPTIMIZE NGINX WORKER PROCESSES
# ============================================
echo -e "\n${YELLOW}🌐 Optimizing Nginx configuration...${NC}"

NGINX_CONF="/etc/nginx/nginx.conf"
if [ -f "$NGINX_CONF" ]; then
    # Backup original config
    cp "$NGINX_CONF" "${NGINX_CONF}.backup.$(date +%Y%m%d_%H%M%S)"
    
    # Calculate optimal worker processes (1 per CPU core, max 2 for low-memory)
    CPU_CORES=$(nproc)
    WORKER_PROCESSES=$((CPU_CORES > 2 ? 2 : CPU_CORES))
    
    # Update nginx.conf with optimized settings
    sed -i "s/worker_processes.*/worker_processes $WORKER_PROCESSES;/" "$NGINX_CONF"
    
    # Add memory-efficient settings
    if ! grep -q "worker_connections" "$NGINX_CONF" || ! grep -q "worker_rlimit_nofile" "$NGINX_CONF"; then
        # Find events block and optimize
        if grep -q "events {" "$NGINX_CONF"; then
            sed -i '/events {/,/}/ {
                s/worker_connections.*/worker_connections 512;/
                /worker_connections/a\
    use epoll;\
    multi_accept on;
            }' "$NGINX_CONF"
        fi
    fi
    
    # Add HTTP optimizations
    if ! grep -q "gzip_vary" "$NGINX_CONF"; then
        sed -i '/http {/a\
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;\
    gzip_comp_level 6;\
    client_max_body_size 10M;\
    keepalive_timeout 65;\
    keepalive_requests 100;
' "$NGINX_CONF"
    fi
    
    # Test and reload Nginx
    if nginx -t 2>/dev/null; then
        systemctl reload nginx 2>/dev/null || service nginx reload 2>/dev/null || true
        echo -e "${GREEN}   ✅ Nginx optimized (${WORKER_PROCESSES} workers, gzip enabled)${NC}"
    else
        echo -e "${RED}   ❌ Nginx config test failed, restoring backup...${NC}"
        cp "${NGINX_CONF}.backup."* "$NGINX_CONF" 2>/dev/null || true
    fi
else
    echo -e "${YELLOW}   ⚠️  Nginx config not found${NC}"
fi

# ============================================
# 4. DISABLE VERBOSE LOGGING
# ============================================
echo -e "\n${YELLOW}📝 Disabling verbose logging...${NC}"

# Set Node.js log level to error only
export NODE_ENV=production

# Reduce systemd journal size
if command -v journalctl &> /dev/null; then
    # Keep only last 24 hours of logs
    journalctl --vacuum-time=1d 2>/dev/null || true
    # Limit journal size to 100MB
    sed -i 's/#SystemMaxUse=/SystemMaxUse=100M/' /etc/systemd/journald.conf 2>/dev/null || true
    systemctl restart systemd-journald 2>/dev/null || true
    echo -e "${GREEN}   ✅ System logs optimized${NC}"
fi

# Reduce PM2 log retention
if command -v pm2 &> /dev/null; then
    pm2 set pm2:log_date_format "YYYY-MM-DD HH:mm:ss"
    pm2 set pm2:log_type json
    # Keep only last 3 days of PM2 logs
    find ~/.pm2/logs -name "*.log" -type f -mtime +3 -delete 2>/dev/null || true
    echo -e "${GREEN}   ✅ PM2 logs optimized${NC}"
fi

# ============================================
# 5. OPTIMIZE KERNEL PARAMETERS
# ============================================
echo -e "\n${YELLOW}⚙️  Optimizing kernel parameters...${NC}"

# Add memory optimization parameters
cat >> /etc/sysctl.conf << EOF

# Memory optimization for low-memory EC2
vm.overcommit_memory=1
vm.dirty_ratio=15
vm.dirty_background_ratio=5
vm.oom_kill_allocating_task=1
net.core.somaxconn=512
net.ipv4.tcp_max_syn_backlog=512
EOF

sysctl -p > /dev/null 2>&1 || true
echo -e "${GREEN}   ✅ Kernel parameters optimized${NC}"

# ============================================
# 6. CLEANUP AND FREE MEMORY
# ============================================
echo -e "\n${YELLOW}🧹 Cleaning up and freeing memory...${NC}"

# Clear package manager caches
if [ -f /etc/debian_version ]; then
    apt-get clean 2>/dev/null || true
    apt-get autoclean 2>/dev/null || true
elif [ -f /etc/redhat-release ] || [ -f /etc/system-release ]; then
    yum clean all 2>/dev/null || dnf clean all 2>/dev/null || true
fi

# Clear npm cache
if command -v npm &> /dev/null; then
    npm cache clean --force 2>/dev/null || true
fi

# Drop caches
sync
echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true

echo -e "${GREEN}   ✅ Memory freed${NC}"

# ============================================
# 7. SHOW OPTIMIZATION SUMMARY
# ============================================
echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ EC2 Memory Optimization Complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${BLUE}📊 Current Memory Status:${NC}"
free -h

echo -e "\n${BLUE}💾 Swap Status:${NC}"
swapon --show 2>/dev/null || echo "  No swap configured"

echo -e "\n${BLUE}📦 PM2 Status:${NC}"
if command -v pm2 &> /dev/null; then
    pm2 list
    echo ""
    pm2 jlist 2>/dev/null | node -e "try { const data = JSON.parse(require('fs').readFileSync(0, 'utf-8')); console.log('Memory Usage:'); data.forEach(p => console.log(\`  \${p.name}: \${(p.monit.memory / 1024 / 1024).toFixed(2)}MB (max: \${p.pm2_env.max_memory_restart || 'unlimited'})\`)); } catch(e) {}" || echo "  (Memory info not available)"
fi

echo -e "\n${YELLOW}💡 Next Steps:${NC}"
echo "  1. Monitor memory usage: watch -n 5 free -h"
echo "  2. Monitor PM2: pm2 monit"
echo "  3. Check logs: pm2 logs"
echo "  4. Setup cron restart (see setup-cron-restart.sh)"

echo -e "\n${GREEN}🎉 Optimization complete!${NC}"

