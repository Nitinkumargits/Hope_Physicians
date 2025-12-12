# 🔧 SSH Connection Timeout Fix

## 🔴 Problem

GitHub Actions cannot connect to EC2 via SSH:

```
Connection timed out during banner exchange
Connection to *** port 22 timed out
Connection reset by peer
```

**This prevents deployment from working.**

## 🔍 Root Causes

1. **EC2 Instance Down** - Instance might be stopped
2. **Security Group** - Port 22 not open to GitHub Actions IPs
3. **Wrong IP Address** - EC2 instance IP changed
4. **Network Issues** - Firewall or network blocking
5. **SSH Key Issues** - Wrong or expired SSH key

## ✅ Solutions

### Solution 1: Check EC2 Instance Status

**Via AWS Console:**

1. Go to EC2 Dashboard
2. Check instance status - should be "Running"
3. Check public IP - verify it matches `EC2_HOST` secret
4. If stopped, start it

**Via AWS CLI:**

```bash
aws ec2 describe-instances --instance-ids <instance-id>
# Check: State.Name should be "running"
# Check: PublicIpAddress matches EC2_HOST
```

### Solution 2: Update Security Group

**Allow SSH from GitHub Actions IPs:**

1. **Get GitHub Actions IP ranges:**

   - Go to: `https://api.github.com/meta`
   - Look for `actions` IP ranges

2. **Update Security Group:**
   - Go to EC2 → Security Groups
   - Find your instance's security group
   - Add inbound rule:
     - Type: SSH
     - Port: 22
     - Source: GitHub Actions IP ranges (or `0.0.0.0/0` for testing)

**Or allow from anywhere (less secure, for testing):**

- Type: SSH
- Port: 22
- Source: `0.0.0.0/0`

### Solution 3: Verify GitHub Secrets

**Check in GitHub:**

1. Go to: Repository → Settings → Secrets and variables → Actions
2. Verify these secrets exist:
   - `EC2_HOST` - Should be the public IP (e.g., `52.66.236.157`)
   - `EC2_USER` - Should be the SSH user (e.g., `ubuntu` or `ec2-user`)
   - `EC2_SSH_KEY` - Should be the private SSH key

**Test SSH key:**

```bash
# Save key to file
echo "$EC2_SSH_KEY" > test_key.pem
chmod 600 test_key.pem

# Test connection
ssh -i test_key.pem -o ConnectTimeout=10 $EC2_USER@$EC2_HOST "echo 'Connected!'"
```

### Solution 4: Use Alternative Deployment Method

**Option A: Manual Deployment (If SSH Works Locally)**

If you can SSH from your local machine:

1. Build locally
2. Deploy manually via SSH

**Option B: Use GitHub Actions with Different Approach**

Instead of direct SSH, use:

- AWS Systems Manager (SSM)
- AWS CodeDeploy
- S3 + EC2 User Data Script

### Solution 5: Increase Timeout and Retries

**Update workflow with longer timeouts:**

```yaml
- name: Setup SSH
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan -H $EC2_HOST >> ~/.ssh/known_hosts || true

    # Test connection with longer timeout
    ssh -i ~/.ssh/id_rsa \
      -o ConnectTimeout=60 \
      -o ServerAliveInterval=60 \
      -o ServerAliveCountMax=3 \
      $EC2_USER@$EC2_HOST "echo 'SSH connection test successful'"
```

## 🔍 Diagnostic Steps

### Step 1: Check EC2 Instance

```bash
# Via AWS CLI
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=your-instance-name" \
  --query 'Reservations[*].Instances[*].[InstanceId,State.Name,PublicIpAddress]' \
  --output table
```

### Step 2: Test SSH from Local Machine

```bash
# Test if you can SSH from your machine
ssh -i /path/to/key.pem $EC2_USER@$EC2_HOST

# If this works, the issue is with GitHub Actions IPs
# If this fails, the issue is with EC2/network
```

### Step 3: Check Security Group Rules

```bash
# List security group rules
aws ec2 describe-security-groups \
  --group-ids <security-group-id> \
  --query 'SecurityGroups[0].IpPermissions'
```

### Step 4: Check Network ACLs

- Go to VPC → Network ACLs
- Verify inbound/outbound rules allow SSH

## 🚀 Quick Fix Checklist

- [ ] EC2 instance is running
- [ ] Public IP matches `EC2_HOST` secret
- [ ] Security group allows SSH (port 22) from GitHub Actions IPs
- [ ] SSH key in GitHub Secrets is correct
- [ ] Can SSH from local machine (to verify instance is accessible)
- [ ] Network ACLs allow SSH traffic

## 📋 Alternative: Manual Deployment

If SSH continues to fail, deploy manually:

```bash
# 1. Build frontend locally
cd frontend
npm run build

# 2. SSH into server (if you can)
ssh -i key.pem user@52.66.236.157

# 3. Pull latest code
cd ~/hope-physicians
git pull origin master

# 4. Run deployment
bash deploy.sh
```

## 🔧 Workflow Fix

I can update the workflow to:

1. Add better error messages
2. Increase timeouts
3. Add connection testing
4. Provide fallback options

Would you like me to update the workflow file?

---

**Status:** Network/Infrastructure Issue
**Action Required:** Fix EC2 security group or network configuration
