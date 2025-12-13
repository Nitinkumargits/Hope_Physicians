#!/bin/bash

# Memory Monitoring Script for Low-Memory EC2
# Run this to monitor memory usage of applications

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to get memory percentage
get_mem_percent() {
    free | awk 'NR==2{printf "%.1f", $3*100/$2}'
}

# Function to check if memory is low
check_memory() {
    MEM_PERCENT=$(get_mem_percent)
    MEM_PERCENT_INT=${MEM_PERCENT%.*}
    
    if [ "$MEM_PERCENT_INT" -gt 90 ]; then
        echo -e "${RED}⚠️  CRITICAL: Memory usage is ${MEM_PERCENT}%${NC}"
        return 2
    elif [ "$MEM_PERCENT_INT" -gt 75 ]; then
        echo -e "${YELLOW}⚠️  WARNING: Memory usage is ${MEM_PERCENT}%${NC}"
        return 1
    else
        echo -e "${GREEN}✅ Memory usage is ${MEM_PERCENT}%${NC}"
        return 0
    fi
}

# Main monitoring function
monitor() {
    clear
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}💾 EC2 Memory Monitor - $(date)${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}\n"
    
    # System memory
    echo -e "${YELLOW}📊 System Memory:${NC}"
    free -h
    echo ""
    check_memory
    echo ""
    
    # Swap usage
    echo -e "${YELLOW}💿 Swap Usage:${NC}"
    swapon --show 2>/dev/null || echo "  No swap configured"
    echo ""
    
    # PM2 processes
    if command -v pm2 &> /dev/null; then
        echo -e "${YELLOW}📦 PM2 Processes:${NC}"
        pm2 list
        echo ""
        
        echo -e "${YELLOW}💾 PM2 Memory Usage:${NC}"
        pm2 jlist 2>/dev/null | node -e "
            try {
                const data = JSON.parse(require('fs').readFileSync(0, 'utf-8'));
                let total = 0;
                data.forEach(p => {
                    const mem = p.monit.memory / 1024 / 1024;
                    total += mem;
                    const max = p.pm2_env.max_memory_restart || 'unlimited';
                    console.log(\`  \${p.name.padEnd(25)} \${mem.toFixed(2).padStart(8)}MB (max: \${max})\`);
                });
                console.log(\`  ${'─'.repeat(50)}\`);
                console.log(\`  ${'Total'.padEnd(25)} \${total.toFixed(2).padStart(8)}MB\`);
            } catch(e) {
                console.log('  (Memory info not available)');
            }
        " || echo "  (Memory info not available)"
        echo ""
    fi
    
    # Top memory consumers
    echo -e "${YELLOW}🔝 Top Memory Consumers:${NC}"
    ps aux --sort=-%mem | head -6 | awk 'NR==1 || $6>0 {printf "  %-20s %8s %6s%%\n", $11, $6"K", $4}'
    echo ""
    
    # Disk usage
    echo -e "${YELLOW}💽 Disk Usage:${NC}"
    df -h / | tail -1 | awk '{printf "  Root: %s used of %s (%s)\n", $3, $2, $5}'
    echo ""
    
    # Recommendations
    MEM_PERCENT=$(get_mem_percent)
    MEM_PERCENT_INT=${MEM_PERCENT%.*}
    
    if [ "$MEM_PERCENT_INT" -gt 85 ]; then
        echo -e "${RED}🚨 RECOMMENDATIONS:${NC}"
        echo "  1. Restart PM2 processes: pm2 restart all"
        echo "  2. Clear caches: sudo sh -c 'echo 3 > /proc/sys/vm/drop_caches'"
        echo "  3. Check for memory leaks in application logs"
        echo "  4. Consider increasing swap space"
    fi
}

# Check if running in watch mode
if [ "$1" == "--watch" ] || [ "$1" == "-w" ]; then
    echo "Press Ctrl+C to stop monitoring..."
    while true; do
        monitor
        sleep 5
    done
else
    monitor
    echo ""
    echo -e "${YELLOW}💡 Run with --watch to monitor continuously:${NC}"
    echo "   ./monitor-memory.sh --watch"
fi

