#!/bin/bash

# Fix root vs alias conflict - root directive is overriding alias

set -e

echo "🔧 Fixing root vs alias conflict..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# The problem: root directive at server level is being used for all requests
# Solution: Don't use root at server level, use it only for Hope Physicians location

sudo node << 'NODE_EOF'
const fs = require('fs');
const config = require('/home/ec2-user/deployment/apps.config.json');

let nginxConfig = 'server {\n';
nginxConfig += '    listen 80 default_server;\n';
nginxConfig += '    listen [::]:80 default_server;\n';
nginxConfig += '    server_name _;\n\n';
// NO root directive at server level - this was causing the conflict!

// Hope Physicians - root app
const hopeApp = config.apps.find(a => a.nginx.frontendPath === '/');
if (hopeApp) {
    const hopeDir = hopeApp.directory + '/' + hopeApp.frontend.directory + '/' + hopeApp.frontend.distDirectory;
    
    // API FIRST
    nginxConfig += '    location ' + hopeApp.nginx.apiPath + ' {\n';
    nginxConfig += '        proxy_pass http://localhost:' + hopeApp.backend.port + ';\n';
    nginxConfig += '        proxy_http_version 1.1;\n';
    nginxConfig += '        proxy_set_header Upgrade $http_upgrade;\n';
    nginxConfig += '        proxy_set_header Connection "upgrade";\n';
    nginxConfig += '        proxy_set_header Host $host;\n';
    nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
    nginxConfig += '        proxy_cache_bypass $http_upgrade;\n';
    nginxConfig += '    }\n\n';
    
    // Root location with root directive
    nginxConfig += '    location / {\n';
    nginxConfig += '        root ' + hopeDir + ';\n';
    nginxConfig += '        index index.html;\n';
    nginxConfig += '        try_files $uri $uri/ /index.html;\n';
    nginxConfig += '    }\n\n';
}

// Ojoto Union - sub-path app
const ojotoApp = config.apps.find(a => a.nginx.frontendPath !== '/');
if (ojotoApp) {
    const ojotoDir = ojotoApp.directory + '/' + ojotoApp.frontend.directory + '/' + ojotoApp.frontend.distDirectory;
    const frontendPath = ojotoApp.nginx.frontendPath;
    
    // API FIRST (most specific)
    nginxConfig += '    location ' + ojotoApp.nginx.apiPath + '/ {\n';
    nginxConfig += '        proxy_pass http://localhost:' + ojotoApp.backend.port + '/;\n';
    nginxConfig += '        proxy_set_header Host $host;\n';
    nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
    nginxConfig += '    }\n\n';
    
    // Assets - VERY SPECIFIC, must come before general location
    nginxConfig += '    location ' + frontendPath + '/assets/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/assets/;\n';
    nginxConfig += '        expires 1y;\n';
    nginxConfig += '        add_header Cache-Control "public, immutable";\n';
    nginxConfig += '    }\n\n';
    
    // Redirect /ojoto-union to /ojoto-union/
    nginxConfig += '    location = ' + frontendPath + ' {\n';
    nginxConfig += '        return 301 ' + frontendPath + '/;\n';
    nginxConfig += '    }\n\n';
    
    // Main location for HTML
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    nginxConfig += '        try_files $uri $uri/ /index.html;\n';
    nginxConfig += '    }\n\n';
}

nginxConfig += '}\n';

const configPath = '/etc/nginx/conf.d/multi-app.conf';
fs.writeFileSync(configPath, nginxConfig);
console.log('Config regenerated - NO root at server level, only in Hope Physicians location');
NODE_EOF

# Test and restart
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    sleep 2
    
    # Test assets
    echo ""
    echo -e "${YELLOW}🧪 Testing assets...${NC}"
    ASSET_JS="/ojoto-union/assets/index-Dk5QCB_P.js"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost$ASSET_JS" || echo "000")
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Asset accessible (HTTP $HTTP_CODE)${NC}"
        echo ""
        echo -e "${GREEN}✅ SUCCESS! Assets are now loading!${NC}"
    else
        echo -e "${RED}❌ Asset still returns HTTP $HTTP_CODE${NC}"
        echo ""
        echo "Error log:"
        sudo tail -3 /var/log/nginx/error.log
        echo ""
        echo "Full config:"
        sudo cat /etc/nginx/conf.d/multi-app.conf
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

