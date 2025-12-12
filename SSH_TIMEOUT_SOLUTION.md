# 🔧 SSH Connection Timeout - Complete Solution

## 🔴 Problem

GitHub Actions cannot connect to EC2:

```
Connection timed out during banner exchange
Connection to *** port 22 timed out
```

## ✅ Most Common Fix: Security Group

### Step 1: Update Security Group (AWS Console)

1. **Go to EC2 Dashboard:**

   - AWS Console → EC2 → Instances
   - Find your instance
   - Click on it

2. **Open Security Group:**

   - Click "Security" tab
   - Click on Security Group name

3. **Add Inbound Rule:**
   - Click "Edit inbound rules"
   - Click "Add rule"
   - Type: `SSH`
   - Port: `22`
   - Source: `0.0.0.0/0` (for testing) or GitHub Actions IP ranges
   - Click "Save rules"

### Step 2: Verify Instance Status

**Check:**

- Instance State: **Running** ✅
- Public IP: Matches `EC2_HOST` secret
- Status Checks: **2/2 checks passed** ✅

### Step 3: Verify GitHub Secrets

**In GitHub:**

1. Repository → Settings → Secrets and variables → Actions
2. Verify:
   - `EC2_HOST` = Your EC2 public IP (e.g., `52.66.236.157`)
   - `EC2_USER` = `ubuntu` or `ec2-user`
   - `EC2_SSH_KEY` = Valid private SSH key

## 🔍 GitHub Actions IP Ranges

GitHub Actions uses dynamic IPs. Options:

### Option 1: Allow All IPs (Testing Only)

- Source: `0.0.0.0/0`
- ⚠️ Less secure, but works for testing

### Option 2: Use GitHub Actions IP Ranges

1. Get IPs: `curl https://api.github.com/meta | jq '.actions[]'`
2. Add each range to security group

### Option 3: Use Elastic IP

- Assign static IP to EC2
- Update `EC2_HOST` secret

## 🚀 Workflow Improvements

I've updated the workflow to:

- ✅ Test SSH connection before deployment
- ✅ Retry connection 3 times
- ✅ Longer timeouts (30 seconds)
- ✅ Better error messages
- ✅ ServerAliveInterval to keep connection alive

## 📋 Quick Checklist

- [ ] EC2 instance is **Running**
- [ ] Security group allows SSH (port 22) from `0.0.0.0/0` (or GitHub IPs)
- [ ] Public IP matches `EC2_HOST` secret
- [ ] SSH key in GitHub Secrets is correct
- [ ] Can SSH from local machine (to verify)

## 🧪 Test Connection

**From your local machine:**

```bash
ssh -i /path/to/key.pem ubuntu@52.66.236.157
```

**If this works:**

- Issue is GitHub Actions IPs not allowed
- Fix: Update security group

**If this fails:**

- Issue is with EC2 instance
- Check: Instance status, network settings

## ✅ After Fixing Security Group

1. **Push code again:**

   ```bash
   git add .
   git commit -m "Fix SSH connection settings"
   git push origin master
   ```

2. **Watch GitHub Actions:**
   - Should see "SSH connection successful"
   - Deployment should proceed

## 🔧 Alternative: Manual Deployment

If SSH continues to fail, deploy manually:

```bash
# 1. Build locally
cd frontend
npm run build

# 2. SSH from your machine (if you can)
ssh -i key.pem ubuntu@52.66.236.157

# 3. Pull and deploy
cd ~/hope-physicians
git pull origin master
bash deploy.sh
```

---

**Most Likely Fix:** Update security group to allow SSH from GitHub Actions IPs
