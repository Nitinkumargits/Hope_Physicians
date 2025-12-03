# 🔄 Auto-Seed on Dev Start

## Overview

When you run `npm run dev` in the backend folder, the database will automatically be seeded (if needed) before starting the development server.

## How It Works

1. **Custom Dev Script** (`scripts/dev.js`):
   - Checks and seeds the database first
   - Then starts nodemon with the server

2. **Smart Seeding** (`prisma/seed.ts`):
   - Checks if admin user already exists
   - If data exists, skips seeding (no errors)
   - If database is empty, seeds all sample data

## Usage

Simply run:
```bash
cd backend
npm run dev
```

The output will show:
```
🚀 Starting development server...

📦 Checking and seeding database...

🌱 Starting database seed...
👥 Creating employees...
✅ Employees created
...
🎉 Database seed completed successfully!

🔄 Starting nodemon...
```

Or if data already exists:
```
🚀 Starting development server...

📦 Checking and seeding database...

✅ Database already seeded. Skipping seed process.

🔄 Starting nodemon...
```

## Benefits

✅ **No manual seeding needed** - Database is always ready  
✅ **Idempotent** - Safe to run multiple times  
✅ **Fast** - Skips seeding if data already exists  
✅ **Automatic** - Works seamlessly with dev workflow  

## Manual Commands

If you need to manually seed or reset:

```bash
# Seed database manually
npm run prisma:seed

# Reset database (WARNING: deletes all data)
npm run prisma:reset

# Start server without seeding
npm run dev:server
```

## Default Login Credentials

After seeding, you can use these credentials:

- **Admin**: `admin@hopephysicians.com` / `admin123`
- **Doctor**: `doctor@hopephysicians.com` / `doctor123`
- **Patient**: `patient@example.com` / `patient123`
- **Staff**: `staff@hopephysicians.com` / `staff123`

