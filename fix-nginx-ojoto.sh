#!/bin/bash

# Fix Nginx configuration for Ojoto Union sub-path
# The issue is with the alias directive and try_files

set -e

echo "🔧 Fixing Nginx configuration for Ojoto Union..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

NGINX_CONFIG=""
if [ -f "/etc/nginx/conf.d/multi-app.conf" ]; then
    NGINX_CONFIG="/etc/nginx/conf.d/multi-app.conf"
elif [ -f "/etc/nginx/sites-available/multi-app" ]; then
    NGINX_CONFIG="/etc/nginx/sites-available/multi-app"
fi

if [ -z "$NGINX_CONFIG" ]; then
    echo -e "${RED}❌ Nginx config not found!${NC}"
    exit 1
fi

echo -e "${YELLOW}📄 Found Nginx config: $NGINX_CONFIG${NC}"

# Backup original config
sudo cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
echo -e "${GREEN}✅ Backup created${NC}"

# Fix the location block for /ojoto-union
# The issue is that alias + try_files needs special handling
echo -e "${YELLOW}🔧 Fixing /ojoto-union location block...${NC}"

# Create a temporary file with the fixed config
TEMP_CONFIG=$(mktemp)

# Read the current config and fix the ojoto-union location block
sudo sed '/location \/ojoto-union {/,/^    }/ {
    /location \/ojoto-union {/ {
        a\
    alias /home/ec2-user/ojoto-union/frontend/dist/;\
    index index.html;
    }
    /try_files/ {
        s|try_files \$uri \$uri/ /ojoto-union/index.html;|try_files \$uri \$uri/ @ojoto_fallback;|
    }
    /^    }$/ {
        i\
    location @ojoto_fallback {\
        rewrite ^/ojoto-union(.*)$ /ojoto-union/index.html last;\
    }
    }
}' "$NGINX_CONFIG" > "$TEMP_CONFIG" 2>/dev/null || {
    # If sed fails, use a different approach
    echo -e "${YELLOW}⚠️  Using alternative fix method...${NC}"
    
    # Read the config and replace the problematic block
    sudo python3 << 'PYTHON_EOF'
import re
import sys

config_path = sys.argv[1]
with open(config_path, 'r') as f:
    content = f.read()

# Fix the ojoto-union location block
pattern = r'location /ojoto-union \{[^}]*try_files \$uri \$uri/ /ojoto-union/index\.html;[^}]*\}'

replacement = '''location /ojoto-union {
        alias /home/ec2-user/ojoto-union/frontend/dist/;
        index index.html;
        try_files $uri $uri/ @ojoto_fallback;
    }
    
    location @ojoto_fallback {
        rewrite ^/ojoto-union(.*)$ /ojoto-union/index.html last;
    }'''

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open(config_path, 'w') as f:
    f.write(new_content)

print("Config updated")
PYTHON_EOF
    "$NGINX_CONFIG"
}

# Actually, let's use a simpler approach - regenerate the config properly
echo -e "${YELLOW}🔄 Regenerating Nginx config with proper alias handling...${NC}"

# Use Node.js to regenerate the config (from deploy-multi-app.sh logic)
sudo node << 'NODE_EOF'
const fs = require('fs');
const config = require('/home/ec2-user/deployment/apps.config.json');

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
        nginxConfig += '        try_files $uri $uri/ /index.html;\n';
        nginxConfig += '    }\n\n';
        nginxConfig += '    location ' + apiPath + ' {\n';
        nginxConfig += '        proxy_pass http://localhost:' + backendPort + ';\n';
        nginxConfig += '        proxy_http_version 1.1;\n';
        nginxConfig += '        proxy_set_header Upgrade $http_upgrade;\n';
        nginxConfig += '        proxy_set_header Connection "upgrade";\n';
        nginxConfig += '        proxy_set_header Host $host;\n';
        nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
        nginxConfig += '        proxy_cache_bypass $http_upgrade;\n';
        nginxConfig += '    }\n\n';
    } else {
        // Sub-path app - FIXED VERSION
        nginxConfig += '    location ' + frontendPath + ' {\n';
        nginxConfig += '        alias ' + frontendDir + '/;\n';
        nginxConfig += '        index index.html;\n';
        nginxConfig += '        try_files $uri $uri/ @ojoto_fallback;\n';
        nginxConfig += '    }\n\n';
        nginxConfig += '    location @ojoto_fallback {\n';
        nginxConfig += '        rewrite ^' + frontendPath + '(.*)$ ' + frontendPath + '/index.html last;\n';
        nginxConfig += '    }\n\n';
        nginxConfig += '    location ' + apiPath + ' {\n';
        nginxConfig += '        proxy_pass http://localhost:' + backendPort + ';\n';
        nginxConfig += '        proxy_http_version 1.1;\n';
        nginxConfig += '        proxy_set_header Upgrade $http_upgrade;\n';
        nginxConfig += '        proxy_set_header Connection "upgrade";\n';
        nginxConfig += '        proxy_set_header Host $host;\n';
        nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
        nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
        nginxConfig += '        proxy_cache_bypass $http_upgrade;\n';
        nginxConfig += '    }\n\n';
    }
});

nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
nginxConfig += '        expires 1y;\n';
nginxConfig += '        add_header Cache-Control "public, immutable";\n';
nginxConfig += '    }\n';
nginxConfig += '}\n';

const configPath = '/etc/nginx/conf.d/multi-app.conf';
fs.writeFileSync(configPath, nginxConfig);
console.log('Nginx config regenerated');
NODE_EOF

# Test Nginx config
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    # Restart Nginx
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    echo -e "${GREEN}✅ Nginx restarted${NC}"
    
    # Test the endpoint
    sleep 1
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
        echo -e "${GREEN}✅ /ojoto-union/ is now accessible (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠️  /ojoto-union/ returned HTTP $HTTP_CODE${NC}"
        echo -e "${YELLOW}   Check: curl -v http://localhost/ojoto-union/${NC}"
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    echo -e "${YELLOW}💡 Restoring backup...${NC}"
    sudo cp "${NGINX_CONFIG}.backup."* "$NGINX_CONFIG" 2>/dev/null || true
    exit 1
fi

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Nginx configuration fixed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}⚠️  Note: Asset paths are still absolute (/assets/...).${NC}"
echo -e "${YELLOW}   This needs to be fixed in vite.config.js or by rebuilding.${NC}"
echo -e "${YELLOW}   But the page should at least load now (with broken assets).${NC}"

