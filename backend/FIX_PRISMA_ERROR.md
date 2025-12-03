# Fix Prisma Generation Error

## Problem
```
EPERM: operation not permitted, rename '...query_engine-windows.dll.node.tmp...' -> '...query_engine-windows.dll.node'
```

This error occurs when Prisma tries to generate the client but the file is locked by a running process (usually the backend server).

## Solution

### Option 1: Stop the Server First (Recommended)

1. **Stop the backend server** (Ctrl+C in the terminal where it's running)

2. **Then run Prisma commands:**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

3. **Restart the server:**
   ```bash
   npm run dev
   ```

### Option 2: Kill Node Processes

If you can't find the server terminal:

1. **Kill all Node processes:**
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Then run Prisma commands:**
   ```bash
   cd backend
   npx prisma db push
   npx prisma generate
   ```

3. **Restart the server:**
   ```bash
   npm run dev
   ```

### Option 3: Use Prisma Studio to Verify

After generating, you can verify the schema is correct:

```bash
cd backend
npm run prisma:studio
```

This will open Prisma Studio where you can see all tables including `PatientFormSubmission`.

## Quick Fix Script

Create a batch file `fix-prisma.bat` in the backend folder:

```batch
@echo off
echo Stopping Node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Running Prisma migration...
npx prisma db push
echo Generating Prisma Client...
npx prisma generate
echo Done! You can now start the server with: npm run dev
```

Then run: `fix-prisma.bat`

