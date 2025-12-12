#!/bin/bash

# Quick script to copy optimization scripts to EC2
# Run this from your local machine (not on EC2)

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if EC2_HOST and EC2_USER are set
if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ]; then
    echo -e "${RED}❌ Error: EC2_HOST and EC2_USER environment variables must be set${NC}"
    echo "Usage:"
    echo "  export EC2_HOST=your-ec2-ip"
    echo "  export EC2_USER=ec2-user"
    echo "  bash copy-optimization-scripts.sh"
    exit 1
fi

echo -e "${YELLOW}📦 Copying optimization scripts to EC2...${NC}"

# Create deployment directory on EC2
ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST "mkdir -p ~/deployment" || {
    echo -e "${RED}❌ Failed to create deployment directory${NC}"
    exit 1
}

# Copy scripts
SCRIPTS=(
    "optimize-low-memory-ec2.sh"
    "setup-cron-restart.sh"
    "monitor-memory.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ -f "$script" ]; then
        echo -e "${YELLOW}📤 Copying $script...${NC}"
        scp -o StrictHostKeyChecking=no "$script" $EC2_USER@$EC2_HOST:~/deployment/ || {
            echo -e "${RED}❌ Failed to copy $script${NC}"
            exit 1
        }
        echo -e "${GREEN}✅ $script copied${NC}"
    else
        echo -e "${YELLOW}⚠️  $script not found, skipping...${NC}"
    fi
done

echo -e "\n${GREEN}✅ All optimization scripts copied successfully!${NC}"
echo -e "\n${YELLOW}💡 Next steps on EC2:${NC}"
echo "  1. cd ~/deployment"
echo "  2. sudo bash optimize-low-memory-ec2.sh"
echo "  3. bash setup-cron-restart.sh"
echo "  4. bash monitor-memory.sh --watch"

