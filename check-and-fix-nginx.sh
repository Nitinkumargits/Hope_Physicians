#!/bin/bash

# Check and fix Nginx config - final attempt

set -e

echo "🔍 Checking current Nginx config..."
echo ""

# Show the actual generated config
echo "Current config:"
sudo cat /etc/nginx/conf.d/multi-app.conf
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test what Nginx is actually trying to access
echo "Testing with curl -v:"
curl -v http://localhost/ojoto-union/ 2>&1 | grep -E "(GET|HTTP|404|alias|root)" || true
echo ""

# Check error log
echo "Recent Nginx errors:"
sudo tail -5 /var/log/nginx/error.log
echo ""

# The issue: When using alias, the location must match exactly
# Let's try a different approach - use root with a subdirectory structure
# OR fix the alias to work properly

echo "🔧 Trying alternative fix: Using root with rewrite..."
echo ""

# Backup
sudo cp /etc/nginx/conf.d/multi-app.conf /etc/nginx/conf.d/multi-app.conf.backup.$(date +%Y%m%d_%H%M%S)

# Generate config with a different approach
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
    
    // Method 1: Use alias with exact location match
    // The key is: location must end with / and alias must end with /
    nginxConfig += '    # Redirect /ojoto-union to /ojoto-union/\n';
    nginxConfig += '    location = ' + frontendPath + ' {\n';
    nginxConfig += '        return 301 ' + frontendPath + '/;\n';
    nginxConfig += '    }\n\n';
    
    nginxConfig += '    # Serve Ojoto Union frontend\n';
    nginxConfig += '    location ' + frontendPath + '/ {\n';
    nginxConfig += '        alias ' + ojotoDir + '/;\n';
    nginxConfig += '        index index.html;\n';
    // For alias, try_files needs to reference the alias path, not the location path
    nginxConfig += '        try_files $uri $uri/ =404;\n';
    nginxConfig += '    }\n\n';
    
    // Add a specific location for index.html fallback
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
console.log('Config regenerated with improved alias handling');
NODE_EOF

# Test config
if sudo nginx -t 2>&1; then
    echo "✅ Config is valid"
    sudo systemctl restart nginx
    sleep 1
    
    # Test
    echo ""
    echo "Testing /ojoto-union/:"
    curl -I http://localhost/ojoto-union/ 2>&1 | head -5
    
    echo ""
    echo "Testing /ojoto-union (without slash):"
    curl -I http://localhost/ojoto-union 2>&1 | head -5
else
    echo "❌ Config test failed"
    sudo nginx -t
fi

