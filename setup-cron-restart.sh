#!/bin/bash

# Setup Cron Job for Scheduled PM2 Restarts
# Prevents memory leaks by restarting apps periodically
# Run this once to setup automatic restarts

set -e

echo "🕐 Setting up scheduled PM2 restarts..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Get current user
CURRENT_USER=${SUDO_USER:-$USER}
if [ "$EUID" -eq 0 ] && [ -z "$SUDO_USER" ]; then
    CURRENT_USER=$(whoami)
fi

CRON_SCRIPT="$HOME/pm2-restart.sh"

# Create restart script
cat > "$CRON_SCRIPT" << 'EOF'
#!/bin/bash
# PM2 Scheduled Restart Script
# Restarts PM2 processes to prevent memory leaks

LOG_FILE="$HOME/pm2-restart.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting PM2 restart..." >> "$LOG_FILE"

# Load PM2 environment
export PATH="/usr/local/bin:/usr/bin:$PATH"
export PM2_HOME="$HOME/.pm2"

# Restart all PM2 processes
if command -v pm2 &> /dev/null; then
    pm2 restart all >> "$LOG_FILE" 2>&1
    pm2 save >> "$LOG_FILE" 2>&1
    echo "[$DATE] PM2 restart completed" >> "$LOG_FILE"
    
    # Log memory usage
    echo "[$DATE] Memory usage:" >> "$LOG_FILE"
    free -h >> "$LOG_FILE" 2>&1
    echo "" >> "$LOG_FILE"
else
    echo "[$DATE] ERROR: PM2 not found" >> "$LOG_FILE"
fi
EOF

chmod +x "$CRON_SCRIPT"
echo -e "${GREEN}✅ Created restart script: $CRON_SCRIPT${NC}"

# Add cron job (restart daily at 3 AM)
CRON_JOB="0 3 * * * $CRON_SCRIPT"

# Check if cron job already exists
if crontab -u "$CURRENT_USER" -l 2>/dev/null | grep -q "$CRON_SCRIPT"; then
    echo -e "${YELLOW}⚠️  Cron job already exists${NC}"
    echo "Current cron jobs:"
    crontab -u "$CURRENT_USER" -l 2>/dev/null | grep -v "^#" || echo "  None"
else
    # Add cron job
    (crontab -u "$CURRENT_USER" -l 2>/dev/null; echo "$CRON_JOB") | crontab -u "$CURRENT_USER" -
    echo -e "${GREEN}✅ Cron job added (daily restart at 3 AM)${NC}"
fi

# Show current cron jobs
echo -e "\n${BLUE}📋 Current cron jobs for $CURRENT_USER:${NC}"
crontab -u "$CURRENT_USER" -l 2>/dev/null | grep -v "^#" || echo "  None"

echo -e "\n${YELLOW}💡 To modify restart schedule, edit crontab:${NC}"
echo "   crontab -e"
echo ""
echo -e "${YELLOW}💡 To view restart logs:${NC}"
echo "   tail -f $LOG_FILE"

