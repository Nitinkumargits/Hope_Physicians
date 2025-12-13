#!/bin/bash

# Debug script for Nginx 404 issue with Ojoto Union

echo "🔍 Debugging Nginx 404 issue..."
echo ""

# Check current Nginx config
echo "1. Current Nginx config for /ojoto-union:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
sudo grep -A 10 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf
echo ""

# Check if files exist
echo "2. Checking if dist files exist:"
DIST_DIR="/home/ec2-user/ojoto-union/frontend/dist"
if [ -f "$DIST_DIR/index.html" ]; then
    echo "   ✅ index.html exists"
    ls -lh "$DIST_DIR/index.html"
else
    echo "   ❌ index.html NOT found"
fi
echo ""

# Test direct file access
echo "3. Testing direct file access:"
if sudo -u nginx test -r "$DIST_DIR/index.html" 2>/dev/null; then
    echo "   ✅ Nginx user can read index.html"
else
    echo "   ❌ Nginx user CANNOT read index.html"
    echo "   💡 Fixing permissions..."
    sudo chmod -R 755 /home/ec2-user/ojoto-union
fi
echo ""

# Test with curl -v for detailed output
echo "4. Testing with curl (verbose):"
curl -v http://localhost/ojoto-union/ 2>&1 | head -30
echo ""

# Check Nginx error log
echo "5. Recent Nginx errors:"
sudo tail -10 /var/log/nginx/error.log | grep -i "ojoto\|404\|alias" || echo "   (No relevant errors found)"
echo ""

# Check if alias path is correct
echo "6. Verifying alias path:"
ALIAS_PATH=$(sudo grep -A 2 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf | grep "alias" | awk '{print $2}' | sed 's/;//')
echo "   Alias path in config: $ALIAS_PATH"
if [ -d "$ALIAS_PATH" ] || [ -d "${ALIAS_PATH%/}" ]; then
    echo "   ✅ Alias path exists"
    ls -la "${ALIAS_PATH%/}" 2>/dev/null | head -5
else
    echo "   ❌ Alias path does NOT exist!"
    echo "   Expected: $ALIAS_PATH"
    echo "   Actual dist dir: $DIST_DIR"
fi
echo ""

# Test the fallback location
echo "7. Testing fallback location:"
if grep -q "@ojoto_fallback" /etc/nginx/conf.d/multi-app.conf; then
    echo "   ✅ Fallback location found"
    sudo grep -A 3 "@ojoto_fallback" /etc/nginx/conf.d/multi-app.conf
else
    echo "   ❌ Fallback location NOT found!"
fi

