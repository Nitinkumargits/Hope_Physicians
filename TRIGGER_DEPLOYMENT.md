# How to Trigger Deployment

## ✅ Your Branch: `master`

Your repository uses the `master` branch, which is correctly configured in all workflows.

---

## 🚀 Method 1: Automatic Trigger (Recommended)

**The workflow triggers automatically when you push to `master`:**

```bash
# Make any change and push
git add .
git commit -m "Your commit message"
git push new-origin master
```

The "Deploy to EC2" workflow will automatically run.

---

## 🚀 Method 2: Manual Trigger (GitHub UI)

1. **Go to Actions**:
   - https://github.com/Shubham96681/hope_physician/actions

2. **Click on "Deploy to EC2" workflow** (left sidebar)

3. **Click "Run workflow"** button (top right)

4. **Select branch**: `master`

5. **Click "Run workflow"**

---

## 🚀 Method 3: Empty Commit (Quick Trigger)

If you want to trigger deployment without making changes:

```bash
git commit --allow-empty -m "Trigger deployment"
git push new-origin master
```

---

## ✅ Verify Deployment is Running

1. **Go to Actions Tab**:
   - https://github.com/Shubham96681/hope_physician/actions

2. **Look for "Deploy to EC2"**:
   - Should show as "running" (yellow) or "completed" (green/red)

3. **Click on the workflow run** to see details

4. **Check each step**:
   - ✅ Green checkmark = Success
   - ⏳ Yellow circle = Running
   - ❌ Red X = Failed

---

## 📋 Workflow Steps

The "Deploy to EC2" workflow will:

1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install backend dependencies
4. ✅ Generate Prisma Client
5. ✅ Install frontend dependencies
6. ✅ Build frontend
7. ✅ Deploy to EC2 via SCP
8. ✅ Execute deployment script on EC2
9. ✅ Verify deployment

---

## 🔍 Troubleshooting

### Workflow Not Appearing?
- Make sure you're on the `master` branch
- Check: `git branch` (should show `* master`)

### Workflow Not Triggering?
- Verify you pushed to `master`: `git push new-origin master`
- Check Actions tab for any workflow runs
- Try manual trigger (Method 2)

### Workflow Failing?
- Check the workflow logs for specific errors
- Verify all GitHub secrets are set correctly
- Check EC2 instance is running

---

## 📝 Current Branch Status

Your current branch: **`master`** ✅

This is correctly configured in all workflows. The deployment will trigger automatically on push to `master`.

