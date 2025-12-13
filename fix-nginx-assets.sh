#!/bin/bash

# Fix Nginx to serve assets correctly

set -e

echo "🔧 Fixing Nginx asset serving..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# The issue: try_files is interfering with asset requests
# Solution: Add specific location for assets, or fix try_files

sudo node << 'NODE_EOF'
const fs = require('fs');
const config = require('/home/ec2-user/deployment/apps.config.json');

let nginxConfig = 'server {\n';
nginxConfig += '    listen 80 default_server;\n';
nginxConfig += '    listen [::]:80 default_server;\n';
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
    
    // CRITICAL: Serve assets FIRST (before the main location)
    // This ensures assets are served correctly without try_files interference
    nginxConfig += '    location ' + frontendPath + '/assets/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/assets/;\n';
    nginxConfig += '        expires 1y;\n';
    nginxConfig += '        add_header Cache-Control "public, immutable";\n';
    nginxConfig += '    }\n\n';
    
    // Main location for HTML and SPA routing
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    // Only use try_files for non-asset requests
    nginxConfig += '        try_files $uri $uri/ /index.html;\n';
    nginxConfig += '    }\n\n';
    
    // API proxy
    nginxConfig += '    location ' + ojotoApp.nginx.apiPath + '/ {\n';
    nginxConfig += '        proxy_pass http://localhost:' + ojotoApp.backend.port + '/;\n';
    nginxConfig += '        proxy_set_header Host $host;\n';
    nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
    nginxConfig += '    }\n\n';
}

// Global static assets (fallback)
nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
nginxConfig += '        expires 1y;\n';
nginxConfig += '        add_header Cache-Control "public, immutable";\n';
nginxConfig += '    }\n';
nginxConfig += '}\n';

const configPath = '/etc/nginx/conf.d/multi-app.conf';
fs.writeFileSync(configPath, nginxConfig);
console.log('Config regenerated with asset-specific location block');
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
    
    # Get asset path from index.html
    ASSET_JS=$(grep -oP 'src="[^"]*"' /home/ec2-user/ojoto-union/frontend/dist/index.html | head -1 | sed 's/src="//;s/"//')
    
    if [ -n "$ASSET_JS" ]; then
        echo "Testing: $ASSET_JS"
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost$ASSET_JS" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo -e "${GREEN}✅ Asset accessible (HTTP $HTTP_CODE)${NC}"
        else
            echo -e "${RED}❌ Asset still returns HTTP $HTTP_CODE${NC}"
        fi
    fi
    
    echo ""
    echo "Testing main page:"
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
    echo "HTTP Code: $HTTP_CODE"
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ Main page accessible${NC}"
    fi
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Asset fix applied!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Test in browser with hard refresh: Ctrl+Shift+R${NC}"

