#!/bin/bash

# Check if Ojoto Union assets are loading correctly

echo "🔍 Checking Ojoto Union assets..."

DIST_DIR="/home/ec2-user/ojoto-union/frontend/dist"

# Check index.html asset paths
echo "1. Asset paths in index.html:"
if [ -f "$DIST_DIR/index.html" ]; then
    echo ""
    grep -E "(src=|href=)" "$DIST_DIR/index.html"
    echo ""
    
    # Extract asset paths
    ASSET_JS=$(grep -oP 'src="[^"]*"' "$DIST_DIR/index.html" | head -1 | sed 's/src="//;s/"//')
    ASSET_CSS=$(grep -oP 'href="[^"]*"' "$DIST_DIR/index.html" | head -1 | sed 's/href="//;s/"//')
    
    echo "2. Testing asset accessibility:"
    echo ""
    echo "JavaScript file: $ASSET_JS"
    if [ -n "$ASSET_JS" ]; then
        # Remove leading slash if present
        ASSET_JS_PATH=${ASSET_JS#/}
        if [ -f "$DIST_DIR/$ASSET_JS_PATH" ]; then
            echo "   ✅ File exists on disk"
        else
            echo "   ❌ File NOT found on disk"
        fi
        
        # Test via HTTP
        echo "   Testing via HTTP..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost$ASSET_JS" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "   ✅ Accessible via HTTP (200)"
        else
            echo "   ❌ HTTP $HTTP_CODE - NOT accessible"
        fi
    fi
    
    echo ""
    echo "CSS file: $ASSET_CSS"
    if [ -n "$ASSET_CSS" ]; then
        ASSET_CSS_PATH=${ASSET_CSS#/}
        if [ -f "$DIST_DIR/$ASSET_CSS_PATH" ]; then
            echo "   ✅ File exists on disk"
        else
            echo "   ❌ File NOT found on disk"
        fi
        
        # Test via HTTP
        echo "   Testing via HTTP..."
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost$ASSET_CSS" || echo "000")
        if [ "$HTTP_CODE" = "200" ]; then
            echo "   ✅ Accessible via HTTP (200)"
        else
            echo "   ❌ HTTP $HTTP_CODE - NOT accessible"
        fi
    fi
fi

echo ""
echo "3. Testing main page content:"
curl -s http://localhost/ojoto-union/ | head -20

echo ""
echo "4. Checking Nginx config for asset handling:"
sudo grep -A 3 "location /ojoto-union" /etc/nginx/conf.d/multi-app.conf | head -10

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "💡 If assets return 404, the paths in index.html are wrong"
echo "💡 Check browser console (F12) for 404 errors on assets"
echo "════════════════════════════════════════════════════════════════"

