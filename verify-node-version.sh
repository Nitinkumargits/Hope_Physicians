#!/bin/bash

# Script to verify and fix Node.js version for PM2 processes
# Run this on EC2 to ensure all processes use the correct Node.js version

echo "🔍 Checking Node.js versions..."

# Check system Node.js
echo "📊 System Node.js:"
/usr/bin/node --version 2>/dev/null || echo "  Not found in /usr/bin"
/usr/local/bin/node --version 2>/dev/null || echo "  Not found in /usr/local/bin"

# Check NVM Node.js
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    echo "📊 NVM Node.js:"
    source "$HOME/.nvm/nvm.sh"
    nvm current
    nvm list
fi

# Check which Node.js PM2 is using
echo ""
echo "📊 PM2 Node.js version:"
pm2 describe hope-physicians-backend | grep "node_version" || echo "  Could not determine"

# Check sqlite3 module
echo ""
echo "🔍 Checking sqlite3 module for Ojoto Union:"
cd /home/ec2-user/ojoto-union/backend
if [ -d "node_modules/sqlite3" ]; then
    echo "  ✅ sqlite3 module exists"
    echo "  📁 Location: $(pwd)/node_modules/sqlite3"
    
    # Check if native module exists
    if [ -f "node_modules/sqlite3/build/Release/node_sqlite3.node" ]; then
        echo "  ✅ Native module found"
        file node_modules/sqlite3/build/Release/node_sqlite3.node
    else
        echo "  ⚠️  Native module not found, needs rebuild"
        echo "  🔧 To rebuild: cd /home/ec2-user/ojoto-union/backend && npm rebuild sqlite3"
    fi
else
    echo "  ❌ sqlite3 module not found"
fi

echo ""
echo "💡 If PM2 is using Node.js 18 but system has Node.js 20:"
echo "   1. Rebuild sqlite3: cd /home/ec2-user/ojoto-union/backend && npm rebuild sqlite3"
echo "   2. Or restart PM2 with system Node.js: pm2 restart all"
echo "   3. Or unset NVM: unset NVM_DIR && pm2 restart all"

