# 🔐 SSH Access Guide - Fix 401 Login Error

## 🔴 Problem

You're getting:

```
Permission denied (publickey,gssapi-keyex,gssapi-with-mic)
```

**Meaning:** Server requires SSH key authentication, not password.

## ✅ Solution Options

### Option 1: Use SSH Key (Recommended)

If you have the SSH private key:

```bash
# On Windows (PowerShell)
ssh -i path/to/your/private-key.pem user@52.66.236.157

# Or if key is in default location
ssh -i ~/.ssh/id_rsa user@52.66.236.157
```

**The SSH key is stored in GitHub Secrets as `EC2_SSH_KEY`**

### Option 2: Use GitHub Actions to Run Fix

Since you can't SSH directly, use GitHub Actions to run the fix script:

1. **Create a new workflow file** (or use existing)
2. **Add a manual trigger** to run the fix script
3. **Push to trigger it**

### Option 3: Ask Server Admin

If you don't have SSH key access:

- Contact server administrator
- Ask them to run the fix script
- Or get SSH key access

## 🚀 Quick Fix via GitHub Actions

I'll create a workflow that runs the fix script automatically:

1. **Workflow triggers** on button click
2. **SSH into server** using GitHub Secrets key
3. **Runs fix script** automatically
4. **Reports results** in GitHub Actions

## 📋 Manual Instructions for Server Admin

If someone else has SSH access, give them this:

```bash
# SSH into server
ssh -i /path/to/key.pem user@52.66.236.157

# Run fix script
cd ~/hope-physicians
chmod +x fix-login-401.sh
./fix-login-401.sh
```

Or manually:

```bash
cd ~/hope-physicians/backend
node scripts/fix-login.js
pm2 restart hope-physicians-backend
```

## 🔍 Find Your SSH Key

The SSH key is stored in:

- **GitHub Secrets:** `EC2_SSH_KEY`
- **Location:** Repository Settings → Secrets and variables → Actions

**To use it:**

1. Copy the secret value
2. Save to file: `~/.ssh/ec2_key.pem`
3. Set permissions: `chmod 600 ~/.ssh/ec2_key.pem`
4. Use: `ssh -i ~/.ssh/ec2_key.pem user@52.66.236.157`

## ⚠️ Security Note

**Never commit SSH keys to repository!**

- Keys are stored in GitHub Secrets
- Only accessible to repository with proper permissions

---

**Next:** I'll create a GitHub Actions workflow to run the fix automatically.
