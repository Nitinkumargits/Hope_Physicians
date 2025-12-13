#!/bin/bash

# Final fix for Nginx alias issue
# The problem is that root directive is interfering with alias

set -e

echo "🔧 Final fix for Nginx alias issue..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

NGINX_CONFIG="/etc/nginx/conf.d/multi-app.conf"

# Backup
sudo cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}📄 Current full config:${NC}"
sudo cat "$NGINX_CONFIG"
echo ""

# Check if there's a root directive at server level
if grep -q "^    root" "$NGINX_CONFIG"; then
    echo -e "${YELLOW}⚠️  Found root directive at server level - this conflicts with alias${NC}"
    echo -e "${YELLOW}🔧 Removing root directive...${NC}"
    sudo sed -i '/^    root/d' "$NGINX_CONFIG"
fi

# Regenerate the config properly using Node.js
echo -e "${YELLOW}🔄 Regenerating Nginx config with correct alias handling...${NC}"

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
        // Root app - use root directive
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
        // Sub-path app - use alias with proper fallback
        // IMPORTANT: location must match exactly with trailing slash handling
        nginxConfig += '    location = ' + frontendPath + ' {\n';
        nginxConfig += '        return 301 ' + frontendPath + '/;\n';
        nginxConfig += '    }\n\n';
        
        nginxConfig += '    location ' + frontendPath + '/ {\n';
        nginxConfig += '        alias ' + frontendDir + '/;\n';
        nginxConfig += '        index index.html;\n';
        nginxConfig += '        try_files $uri $uri/ ' + frontendPath + '/index.html;\n';
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
console.log('Nginx config regenerated with proper alias handling');
NODE_EOF

# Test and restart
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    sleep 1
    
    # Test the endpoint
    echo -e "${YELLOW}🧪 Testing /ojoto-union/ endpoint...${NC}"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
    if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ]; then
        echo -e "${GREEN}✅ /ojoto-union/ is now accessible (HTTP $HTTP_CODE)${NC}"
    else
        echo -e "${YELLOW}⚠️  /ojoto-union/ returned HTTP $HTTP_CODE${NC}"
        echo -e "${YELLOW}   Testing with trailing slash...${NC}"
        HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union || echo "000")
        echo "   HTTP code without trailing slash: $HTTP_CODE2"
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Nginx configuration fixed!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}💡 Test the website:${NC}"
echo "   http://YOUR_EC2_IP/ojoto-union/"
echo ""
echo -e "${YELLOW}💡 If still 404, check:${NC}"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   curl -v http://localhost/ojoto-union/"

