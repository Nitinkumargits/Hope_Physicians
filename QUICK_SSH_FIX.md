# ⚡ Quick SSH Connection Fix

## 🔴 Error

```
Connection timed out during banner exchange
Connection to *** port 22 timed out
```

## ✅ Most Likely Causes

1. **Security Group** - Port 22 not open to GitHub Actions
2. **EC2 Instance** - Might be stopped or IP changed
3. **Wrong IP** - `EC2_HOST` secret has wrong IP

## 🚀 Quick Fix Steps

### Step 1: Check EC2 Instance

**AWS Console:**

1. Go to EC2 Dashboard
2. Find your instance
3. Check: Status = "Running" ✅
4. Check: Public IP = `52.66.236.157` (or your IP)

### Step 2: Update Security Group

**Allow SSH from GitHub Actions:**

1. **Go to Security Groups:**

   - EC2 → Security Groups
   - Find your instance's security group

2. **Add Inbound Rule:**

   - Type: `SSH`
   - Port: `22`
   - Source: `0.0.0.0/0` (for testing) or GitHub Actions IPs

3. **Save**

### Step 3: Verify GitHub Secrets

**Check:**

- `EC2_HOST` = `52.66.236.157` (or your actual IP)
- `EC2_USER` = `ubuntu` or `ec2-user`
- `EC2_SSH_KEY` = Valid private key

### Step 4: Test Connection

**From your local machine:**

```bash
ssh -i /path/to/key.pem ubuntu@52.66.236.157
```

**If this works:**

- Issue is GitHub Actions IPs not allowed
- Add GitHub Actions IP ranges to security group

**If this fails:**

- Issue is with EC2 instance or network
- Check instance status and network settings

## 📋 GitHub Actions IP Ranges

GitHub Actions uses dynamic IPs. Options:

1. **Allow all IPs (testing only):**

   - Source: `0.0.0.0/0`

2. **Use GitHub Actions IP ranges:**

   - Get from: `https://api.github.com/meta`
   - Add each range to security group

3. **Use Elastic IP:**
   - Assign static IP to EC2
   - Update `EC2_HOST` secret

## ✅ After Fix

Once security group is updated:

1. Push code again
2. GitHub Actions should connect
3. Deployment should work

---

**Most Common Fix:** Update security group to allow SSH from GitHub Actions IPs
