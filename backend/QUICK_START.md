# 🚀 Quick Start Guide - Prisma Setup

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Create Database & Run Migrations
```bash
npm run prisma:migrate
```
When prompted, enter migration name: `init`

### 4. Seed Database (Optional)
```bash
npm run prisma:seed
```

### 5. Open Prisma Studio (Optional - Database GUI)
```bash
npm run prisma:studio
```

## ✅ Verification

After setup, you should have:
- ✅ Database file: `prisma/hope_physicians.db`
- ✅ Prisma Client generated
- ✅ All tables created
- ✅ Sample data seeded (if you ran seed)

## 📝 Default Login Credentials (After Seeding)

- **Admin**: admin@hopephysicians.com / admin123
- **Doctor**: doctor@hopephysicians.com / doctor123
- **Patient**: patient@example.com / patient123
- **Staff**: staff@hopephysicians.com / staff123

## 🔧 Common Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# View database in browser
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run prisma:reset
```

## 📚 Next Steps

1. Review `PRISMA_SETUP.md` for detailed documentation
2. Check service files in `src/services/` for usage examples
3. Integrate services into your Express routes

