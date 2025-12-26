# Deployment Status Check

## 🔍 How to Check if Deployment is Running

### Step 1: Check GitHub Actions

1. **Go to Actions Tab**:
   - https://github.com/infofitsoftwaresolution/hope_physician/actions

2. **Look for "Deploy to EC2" workflow**:
   - Should appear in the list
   - Click on it to see status

3. **Check Workflow Status**:
   - ✅ Green checkmark = Success
   - ⏳ Yellow circle = Running
   - ❌ Red X = Failed

### Step 2: If Workflow Didn't Run

**Option A: Trigger Manually**
1. Go to: https://github.com/infofitsoftwaresolution/hope_physician/actions/workflows/deploy-ec2.yml
2. Click "Run workflow" button (top right)
3. Select branch: `master`
4. Click "Run workflow"

**Option B: Push a Commit**
```bash
git commit --allow-empty -m "Trigger deployment"
git push new-origin master
```

### Step 3: Check Workflow Logs

1. Click on the workflow run
2. Click on "Test, Build & Deploy" job
3. Expand each step to see logs
4. Look for errors (red text)

### Step 4: Common Issues

#### Issue: Workflow Not Triggering
- **Check**: Is branch name `master` or `main`?
- **Fix**: Push to correct branch

#### Issue: EC2 Connection Failed
- **Check**: EC2_HOST, EC2_USER, EC2_SSH_KEY secrets
- **Fix**: Verify secrets in repository settings

#### Issue: Deployment Script Failed
- **Check**: Check logs in "Execute deployment script" step
- **Fix**: See error messages in logs

#### Issue: Services Not Starting
- **Check**: PM2 and Nginx status in verification step
- **Fix**: SSH into EC2 and check manually

---

## 🚀 Quick Fix: Force Deployment

Run these commands to trigger deployment:

```bash
# Make a small change
echo "# Deployment trigger" >> README.md
git add README.md
git commit -m "Trigger deployment"
git push new-origin master
```

Or trigger manually in GitHub Actions UI.

---

## 📋 Deployment Checklist

Before deployment:
- [ ] All required secrets are added
- [ ] EC2 instance is running
- [ ] EC2 Security Group allows SSH (port 22)
- [ ] Branch is `master` or `main`

During deployment:
- [ ] Workflow is running in Actions tab
- [ ] No errors in workflow logs
- [ ] All steps complete successfully

After deployment:
- [ ] Check verification step output
- [ ] PM2 shows backend running
- [ ] Nginx is running
- [ ] Test application: http://your-ec2-ip

---

## 🔧 Manual Deployment (If CI/CD Fails)

If automated deployment fails, deploy manually:

```bash
# SSH into EC2
ssh ubuntu@your-ec2-ip

# Navigate to app directory
cd ~/hope-physicians

# Pull latest code
git pull origin master

# Run deployment
chmod +x deploy.sh
export JWT_SECRET="your-secret"
export EMAIL_USER="your-email"
export EMAIL_PASS="your-password"
# ... add other env vars
./deploy.sh
```

---

## 📞 Need Help?

1. Check GitHub Actions logs for specific errors
2. Verify all secrets are correctly set
3. Check EC2 instance status in AWS Console
4. SSH into EC2 and run diagnostics: `./check-deployment.sh`

