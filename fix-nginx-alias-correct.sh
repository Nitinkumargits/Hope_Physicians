#!/bin/bash

# Correct fix for Nginx alias - the issue is try_files with absolute path

set -e

echo "🔧 Correct fix for Nginx alias issue..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# The problem: try_files with absolute path doesn't work with alias
# Solution: Use a named location or rewrite for fallback

sudo node << 'NODE_EOF'
const fs = require('fs');
const config = require('/home/ec2-user/deployment/apps.config.json');

let nginxConfig = 'server {\n';
nginxConfig += '    listen 80;\n';
nginxConfig += '    server_name _;\n\n';

// Hope Physicians - root app
const hopeApp = config.apps.find(a => a.nginx.frontendPath === '/');
if (hopeApp) {
    const hopeDir = hopeApp.directory + '/' + hopeApp.frontend.directory + '/' + hopeApp.frontend.distDirectory;
    nginxConfig += '    root ' + hopeDir + ';\n';
    nginxConfig += '    index index.html;\n\n';
    nginxConfig += '    location / {\n';
    nginxConfig += '        try_files $uri $uri/ /index.html;\n';
    nginxConfig += '    }\n\n';
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
}

// Ojoto Union - sub-path app
const ojotoApp = config.apps.find(a => a.nginx.frontendPath !== '/');
if (ojotoApp) {
    const ojotoDir = ojotoApp.directory + '/' + ojotoApp.frontend.directory + '/' + ojotoApp.frontend.distDirectory;
    const frontendPath = ojotoApp.nginx.frontendPath;
    
    // Redirect /ojoto-union to /ojoto-union/
    nginxConfig += '    location = ' + frontendPath + ' {\n';
    nginxConfig += '        return 301 ' + frontendPath + '/;\n';
    nginxConfig += '    }\n\n';
    
    // Serve Ojoto Union frontend with alias
    // CRITICAL: try_files with alias must use relative paths or named location
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    // Use named location for fallback - this is the key fix!
    nginxConfig += '        try_files $uri $uri/ @ojoto_fallback;\n';
    nginxConfig += '    }\n\n';
    
    // Named location for fallback - serves index.html from alias path
    nginxConfig += '    location @ojoto_fallback {\n';
    nginxConfig += '        rewrite ^' + frontendPath + '(.*)$ ' + ojotoDir + '/index.html last;\n';
    nginxConfig += '    }\n\n';
    
    // API proxy
    nginxConfig += '    location ' + ojotoApp.nginx.apiPath + ' {\n';
    nginxConfig += '        proxy_pass http://localhost:' + ojotoApp.backend.port + ';\n';
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

nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
nginxConfig += '        expires 1y;\n';
nginxConfig += '        add_header Cache-Control "public, immutable";\n';
nginxConfig += '    }\n';
nginxConfig += '}\n';

const configPath = '/etc/nginx/conf.d/multi-app.conf';
fs.writeFileSync(configPath, nginxConfig);
console.log('Config regenerated with correct alias + named location fallback');
NODE_EOF

# Test and restart
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    sleep 2
    
    # Test
    echo ""
    echo -e "${YELLOW}🧪 Testing endpoints...${NC}"
    echo "Testing /ojoto-union/ (with slash):"
    HTTP_CODE1=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
    echo "   HTTP Code: $HTTP_CODE1"
    
    echo ""
    echo "Testing /ojoto-union (without slash):"
    HTTP_CODE2=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union || echo "000")
    echo "   HTTP Code: $HTTP_CODE2"
    
    if [ "$HTTP_CODE1" = "200" ] || [ "$HTTP_CODE2" = "301" ]; then
        echo ""
        echo -e "${GREEN}✅ Success! Ojoto Union is now accessible${NC}"
        echo ""
        echo "Test in browser: http://YOUR_EC2_IP/ojoto-union/"
    else
        echo ""
        echo -e "${YELLOW}⚠️  Still getting $HTTP_CODE1 / $HTTP_CODE2${NC}"
        echo "Check error log:"
        sudo tail -3 /var/log/nginx/error.log
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Fix applied!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"

