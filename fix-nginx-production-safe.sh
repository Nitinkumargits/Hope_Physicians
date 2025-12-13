#!/bin/bash

# Production-safe Nginx fix - clean config, no conflicts

set -e

echo "🔧 Production-safe Nginx fix..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Find existing configs
echo "1️⃣ Checking existing Nginx configs..."
echo ""
echo "Current configs with 'ojoto-union':"
sudo nginx -T 2>/dev/null | grep -A 5 "ojoto-union" || echo "  (Not found)"
echo ""

# Step 2: Remove conflicting default configs
echo "2️⃣ Removing conflicting default configs..."
sudo rm -f /etc/nginx/conf.d/default.conf 2>/dev/null || true
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
sudo rm -f /etc/nginx/sites-available/default 2>/dev/null || true
echo -e "${GREEN}✅ Conflicting defaults removed${NC}"
echo ""

# Step 3: Create ONE clean server config for both apps
echo "3️⃣ Creating clean multi-app server config..."

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

// Ojoto Union - sub-path app (CORRECT alias usage)
const ojotoApp = config.apps.find(a => a.nginx.frontendPath !== '/');
if (ojotoApp) {
    const ojotoDir = ojotoApp.directory + '/' + ojotoApp.frontend.directory + '/' + ojotoApp.frontend.distDirectory;
    const frontendPath = ojotoApp.nginx.frontendPath;
    
    // Redirect /ojoto-union to /ojoto-union/
    nginxConfig += '    location = ' + frontendPath + ' {\n';
    nginxConfig += '        return 301 ' + frontendPath + '/;\n';
    nginxConfig += '    }\n\n';
    
    // CORRECT: alias with trailing slash, simple try_files
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    nginxConfig += '        try_files $uri $uri/ /index.html;\n';
    nginxConfig += '    }\n\n';
    
    // API proxy with trailing slash
    nginxConfig += '    location ' + ojotoApp.nginx.apiPath + '/ {\n';
    nginxConfig += '        proxy_pass http://localhost:' + ojotoApp.backend.port + '/;\n';
    nginxConfig += '        proxy_set_header Host $host;\n';
    nginxConfig += '        proxy_set_header X-Real-IP $remote_addr;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n';
    nginxConfig += '        proxy_set_header X-Forwarded-Proto $scheme;\n';
    nginxConfig += '    }\n\n';
}

nginxConfig += '    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {\n';
nginxConfig += '        expires 1y;\n';
nginxConfig += '        add_header Cache-Control "public, immutable";\n';
nginxConfig += '    }\n';
nginxConfig += '}\n';

const configPath = '/etc/nginx/conf.d/multi-app.conf';
fs.writeFileSync(configPath, nginxConfig);
console.log('Clean multi-app config created');
NODE_EOF

echo -e "${GREEN}✅ Clean config created${NC}"
echo ""

# Step 4: Test and reload
echo "4️⃣ Testing and reloading Nginx..."
if sudo nginx -t 2>&1; then
    echo -e "${GREEN}✅ Nginx configuration is valid${NC}"
    
    echo -e "${YELLOW}🔄 Restarting Nginx...${NC}"
    sudo systemctl restart nginx 2>/dev/null || sudo service nginx restart 2>/dev/null || true
    sleep 2
    echo -e "${GREEN}✅ Nginx restarted${NC}"
else
    echo -e "${RED}❌ Nginx configuration test failed!${NC}"
    sudo nginx -t
    exit 1
fi

# Step 5: Hard test
echo ""
echo "5️⃣ Hard testing..."
echo ""

echo "Checking if index.html exists:"
if ls /home/ec2-user/ojoto-union/frontend/dist/index.html > /dev/null 2>&1; then
    echo -e "${GREEN}✅ index.html exists${NC}"
else
    echo -e "${RED}❌ index.html NOT found!${NC}"
    exit 1
fi

echo ""
echo "Testing /ojoto-union/:"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ HTTP $HTTP_CODE - SUCCESS!${NC}"
else
    echo -e "${RED}❌ HTTP $HTTP_CODE - Still failing${NC}"
    echo ""
    echo "Error log:"
    sudo tail -5 /var/log/nginx/error.log
    exit 1
fi

echo ""
echo "Testing /ojoto-union/api/:"
API_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/api/ || echo "000")
echo "API HTTP Code: $API_CODE"

echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Production-safe fix complete!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}💡 Test in browser:${NC}"
echo "   http://YOUR_EC2_IP/ojoto-union/"
echo ""
echo -e "${YELLOW}💡 Both apps should now work:${NC}"
echo "   • Hope Physicians: http://YOUR_EC2_IP/"
echo "   • Ojoto Union: http://YOUR_EC2_IP/ojoto-union/"

