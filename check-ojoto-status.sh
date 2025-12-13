#!/bin/bash

# Comprehensive check script for Ojoto Union frontend

echo "🔍 Checking Ojoto Union frontend status..."
echo ""

DIST_DIR="/home/ec2-user/ojoto-union/frontend/dist"

# 1. Check if dist directory exists and has files
echo "1. Checking dist directory:"
if [ -d "$DIST_DIR" ]; then
    FILE_COUNT=$(find "$DIST_DIR" -type f | wc -l)
    echo "   ✅ Dist directory exists with $FILE_COUNT files"
    echo ""
    echo "   📁 Contents:"
    ls -lh "$DIST_DIR" | head -10
else
    echo "   ❌ Dist directory not found!"
    exit 1
fi

echo ""
echo "2. Checking index.html:"
if [ -f "$DIST_DIR/index.html" ]; then
    echo "   ✅ index.html exists"
    echo ""
    echo "   📄 Asset paths in index.html:"
    grep -E "(src=|href=)" "$DIST_DIR/index.html"
    
    echo ""
    if grep -q "/ojoto-union/assets" "$DIST_DIR/index.html"; then
        echo "   ✅ Asset paths contain '/ojoto-union' - Correct!"
    elif grep -q '"/assets' "$DIST_DIR/index.html"; then
        echo "   ⚠️  Asset paths are absolute '/assets' - May cause issues"
    fi
else
    echo "   ❌ index.html not found!"
fi

echo ""
echo "3. Testing Nginx access:"
if curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/ | grep -q "200\|301\|302"; then
    echo "   ✅ Nginx is serving /ojoto-union (HTTP 200/301/302)"
else
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/ojoto-union/)
    echo "   ⚠️  Nginx returned HTTP $HTTP_CODE"
fi

echo ""
echo "4. Testing asset access:"
# Get first asset from index.html
ASSET_PATH=$(grep -oP 'src="[^"]*"' "$DIST_DIR/index.html" | head -1 | sed 's/src="//;s/"//')
if [ -n "$ASSET_PATH" ]; then
    # Remove leading slash if present
    ASSET_PATH=${ASSET_PATH#/}
    if [ -f "$DIST_DIR/$ASSET_PATH" ]; then
        echo "   ✅ Asset file exists: $ASSET_PATH"
    else
        echo "   ⚠️  Asset file not found: $ASSET_PATH"
    fi
fi

echo ""
echo "5. Checking Nginx configuration:"
if grep -q "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf 2>/dev/null; then
    echo "   ✅ Nginx location block found"
    echo ""
    echo "   📄 Location block:"
    grep -A 3 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf | head -4
else
    echo "   ❌ Nginx location block not found!"
fi

echo ""
echo "6. Testing file permissions:"
if [ -r "$DIST_DIR/index.html" ]; then
    echo "   ✅ index.html is readable"
    if sudo -u nginx test -r "$DIST_DIR/index.html" 2>/dev/null; then
        echo "   ✅ Nginx user can read index.html"
    else
        echo "   ⚠️  Nginx user cannot read index.html"
    fi
else
    echo "   ❌ index.html is not readable"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "💡 Next steps:"
echo "   1. Test in browser: http://YOUR_EC2_IP/ojoto-union"
echo "   2. Check browser console (F12) for any 404 errors"
echo "   3. If blank, try: curl http://localhost/ojoto-union/"
echo "════════════════════════════════════════════════════════════════"

