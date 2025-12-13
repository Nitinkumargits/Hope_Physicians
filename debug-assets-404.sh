#!/bin/bash

# Debug why assets are returning 404

echo "🔍 Debugging asset 404 issue..."
echo ""

DIST_DIR="/home/ec2-user/ojoto-union/frontend/dist"

# 1. Check if asset files exist
echo "1. Checking if asset files exist:"
if [ -d "$DIST_DIR/assets" ]; then
    echo "   ✅ assets directory exists"
    echo "   Files in assets:"
    ls -lh "$DIST_DIR/assets" | head -5
else
    echo "   ❌ assets directory NOT found!"
    exit 1
fi

# 2. Check specific asset file
ASSET_JS="/ojoto-union/assets/index-Dk5QCB_P.js"
ASSET_JS_PATH=$(echo "$ASSET_JS" | sed 's|^/ojoto-union/||')
echo ""
echo "2. Checking specific asset:"
echo "   Request path: $ASSET_JS"
echo "   File path: $DIST_DIR/$ASSET_JS_PATH"
if [ -f "$DIST_DIR/$ASSET_JS_PATH" ]; then
    echo "   ✅ File exists on disk"
    ls -lh "$DIST_DIR/$ASSET_JS_PATH"
else
    echo "   ❌ File NOT found on disk"
    echo "   Looking for similar files:"
    ls "$DIST_DIR/assets" | grep -i "index.*js" | head -3
fi

# 3. Check Nginx config
echo ""
echo "3. Current Nginx config for assets:"
sudo cat /etc/nginx/conf.d/multi-app.conf | grep -A 5 "location.*assets"

# 4. Test with verbose curl
echo ""
echo "4. Testing with verbose curl:"
curl -v "http://localhost$ASSET_JS" 2>&1 | grep -E "(GET|HTTP|404|200|Location)" | head -10

# 5. Check Nginx error log
echo ""
echo "5. Recent Nginx errors:"
sudo tail -5 /var/log/nginx/error.log | grep -i "assets\|404\|ojoto" || echo "   (No relevant errors)"

# 6. Test if alias is working
echo ""
echo "6. Testing alias path resolution:"
echo "   Location: /ojoto-union/assets/"
echo "   Alias: /home/ec2-user/ojoto-union/frontend/dist/assets/"
echo "   Expected file: /home/ec2-user/ojoto-union/frontend/dist/assets/index-Dk5QCB_P.js"
if [ -f "/home/ec2-user/ojoto-union/frontend/dist/assets/index-Dk5QCB_P.js" ]; then
    echo "   ✅ File exists at expected alias path"
else
    echo "   ❌ File NOT at expected alias path"
    echo "   Actual files in assets:"
    ls "$DIST_DIR/assets" | head -3
fi

