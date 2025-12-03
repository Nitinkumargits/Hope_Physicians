const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting development server...\n');

try {
  // Run seed first (will skip if data already exists)
  console.log('📦 Checking and seeding database...\n');
  execSync('npm run prisma:seed', { stdio: 'inherit', cwd: __dirname + '/..' });
  console.log('');

  // Start nodemon
  console.log('🔄 Starting nodemon...\n');
  execSync('nodemon server.js', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.error('❌ Error starting dev server:', error.message);
  process.exit(1);
}

