#!/bin/bash

# Fix the root directive issue in main nginx.conf

set -e

echo "🔧 Fixing root directive in main nginx.conf..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check main nginx.conf
echo "Checking /etc/nginx/nginx.conf for default root..."
if grep -q "^[^#]*root.*html" /etc/nginx/nginx.conf; then
    echo -e "${YELLOW}⚠️  Found default root in main nginx.conf${NC}"
    grep "^[^#]*root.*html" /etc/nginx/nginx.conf
    
    # Backup
    sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup.$(date +%Y%m%d_%H%M%S)
    
    # Comment out the default root in http block
    echo -e "${YELLOW}🔧 Commenting out default root...${NC}"
    sudo sed -i 's/^\([[:space:]]*root[[:space:]]*.*html.*\)$/#\1/' /etc/nginx/nginx.conf
    
    echo -e "${GREEN}✅ Default root commented out${NC}"
else
    echo -e "${GREEN}✅ No default root found in main config${NC}"
fi

# Also check for default server block
echo ""
echo "Checking for default server blocks..."
if [ -f /etc/nginx/conf.d/default.conf ]; then
    echo -e "${YELLOW}⚠️  Found default.conf - this might be interfering${NC}"
    sudo mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.disabled 2>/dev/null || true
    echo -e "${GREEN}✅ Disabled default.conf${NC}"
fi

# Now regenerate our config with a simpler approach - use absolute alias path
echo ""
echo -e "${YELLOW}🔄 Regenerating config with absolute alias path...${NC}"

sudo node << 'NODE_EOF'
const fs = require('fs');
const config = require('/home/ec2-user/deployment/apps.config.json');

let nginxConfig = 'server {\n';
nginxConfig += '    listen 80 default_server;\n';
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

// Ojoto Union - use alias with absolute path
const ojotoApp = config.apps.find(a => a.nginx.frontendPath !== '/');
if (ojotoApp) {
    const ojotoDir = ojotoApp.directory + '/' + ojotoApp.frontend.directory + '/' + ojotoApp.frontend.distDirectory;
    const frontendPath = ojotoApp.nginx.frontendPath;
    
    // Redirect /ojoto-union to /ojoto-union/
    nginxConfig += '    location = ' + frontendPath + ' {\n';
    nginxConfig += '        return 301 ' + frontendPath + '/;\n';
    nginxConfig += '    }\n\n';
    
    // Use alias - this time with explicit absolute path
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    // Don't use try_files with absolute path - use named location
    nginxConfig += '        try_files $uri $uri/ @ojoto_index;\n';
    nginxConfig += '    }\n\n';
    
    // Named location that serves index.html from alias path
    nginxConfig += '    location @ojoto_index {\n';
    // Use add_header and return to serve the file
    nginxConfig += '        add_header Content-Type text/html;\n';
    nginxConfig += '        return 200 "<!DOCTYPE html><html><head><meta http-equiv=\"refresh\" content=\"0;url=' + frontendPath + '/index.html\"></head></html>";\n';
    nginxConfig += '    }\n\n';
    
    // Actually, let's use a simpler approach - serve index.html directly
    nginxConfig += '    location ' + frontendPath + '/index.html {\n';
    nginxConfig += '        alias ' + ojotoDir + '/index.html;\n';
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
console.log('Config regenerated');
NODE_EOF

# Actually, let me try the simplest possible approach - just test if we can access the file directly
echo ""
echo -e "${YELLOW}🧪 Testing direct file access first...${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/index.html | grep -q "200\|404"; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/index.html)
    echo "Direct index.html access: HTTP $HTTP_CODE"
fi

# Test and restart
echo ""
echo -e "${YELLOW}🧪 Testing Nginx configuration...${NC}"
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    sleep 2
    
    # Test
    echo ""
    echo -e "${YELLOW}🧪 Testing endpoints...${NC}"
    echo "Testing /ojoto-union/index.html directly:"
    curl -I http://localhost/ojoto-union/index.html 2>&1 | head -3
    
    echo ""
    echo "Testing /ojoto-union/:"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
    echo "HTTP Code: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ SUCCESS!${NC}"
    else
        echo -e "${YELLOW}⚠️  Still getting $HTTP_CODE${NC}"
        echo ""
        echo "Error log:"
        sudo tail -3 /var/log/nginx/error.log
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

