#!/bin/bash

# Quick verification script to check if Ojoto Union frontend was built correctly

echo "🔍 Verifying Ojoto Union frontend build..."

DIST_DIR="/home/ec2-user/ojoto-union/frontend/dist"

if [ -f "$DIST_DIR/index.html" ]; then
    echo "✅ index.html exists"
    echo ""
    echo "📄 Checking asset paths in index.html:"
    echo ""
    grep -E "(src=|href=)" "$DIST_DIR/index.html" | head -5
    
    echo ""
    if grep -q "/ojoto-union/assets" "$DIST_DIR/index.html"; then
        echo "✅ Asset paths contain '/ojoto-union' - Build is correct!"
    elif grep -q '"/assets' "$DIST_DIR/index.html"; then
        echo "⚠️  Asset paths are absolute '/assets' - May need rebuild"
    else
        echo "ℹ️  Checking asset paths..."
    fi
else
    echo "❌ index.html not found"
fi

echo ""
echo "📁 Files in dist directory:"
ls -lh "$DIST_DIR" | head -10

