# 🔧 SSH Connection Timeout - Step-by-Step Troubleshooting

## 🔴 Current Issue
```
Connection timed out during banner exchange
Connection to *** port 22 timed out
```

This means GitHub Actions **cannot reach** your EC2 instance at all.

## ✅ Step-by-Step Fix

### Step 1: Verify EC2 Instance is Running

**AWS Console:**
1. Go to: https://console.aws.amazon.com/ec2/
2. Click "Instances" in left menu
3. Find your instance
4. Check **State** column:
   - ✅ Should say "Running" (green)
   - ❌ If "Stopped" → Click "Start instance"
   - ❌ If "Terminated" → You need a new instance

**Check Public IP:**
- Look at "Public IPv4 address" column
- **Write this down** - you'll need it for Step 3

---

### Step 2: Fix Security Group (MOST COMMON FIX)

**This is usually the problem!**

1. **In EC2 Console:**
   - Click on your instance
   - Click "Security" tab (bottom panel)
   - Click on the Security Group name (blue link)

2. **Edit Inbound Rules:**
   - Click "Edit inbound rules" button
   - Click "Add rule"
   - Configure:
     - **Type:** SSH
     - **Protocol:** TCP
     - **Port range:** 22
     - **Source:** `0.0.0.0/0` (for testing - allows from anywhere)
   - Click "Save rules"

3. **Wait 30 seconds** for changes to propagate

---

### Step 3: Verify GitHub Secrets

**In GitHub:**
1. Go to: https://github.com/infofitsoftwaresolution/hope_physician/settings/secrets/actions
2. Check these secrets:

   **EC2_HOST:**
   - Should be the **Public IPv4 address** from Step 1
   - Format: `52.66.236.157` (just the IP, no `http://` or port)
   - ⚠️ If instance was stopped/started, IP may have changed!

   **EC2_USER:**
   - Amazon Linux: `ec2-user`
   - Ubuntu: `ubuntu`
   - Check your instance AMI type

   **EC2_SSH_KEY:**
   - Should be your **private** SSH key
   - Format:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     [key content]
     -----END OPENSSH PRIVATE KEY-----
     ```
   - Or:
     ```
     -----BEGIN RSA PRIVATE KEY-----
     [key content]
     -----END RSA PRIVATE KEY-----
     ```

---

### Step 4: Test SSH Locally

**On your computer:**
```bash
# Test if you can SSH from your machine
ssh -i your-key.pem ec2-user@YOUR_EC2_IP
```

**Results:**
- ✅ **If this works:** Security group is fine, issue is GitHub Actions IPs
- ❌ **If this fails:** Security group or instance issue

---

### Step 5: Check Network ACLs (If Using VPC)

**Only if your instance is in a VPC:**

1. Go to: VPC → Network ACLs
2. Find the ACL for your subnet
3. Check Inbound Rules:
   - Should allow SSH (port 22) from `0.0.0.0/0`
4. If missing, add it

---

### Step 6: Verify Instance Firewall

**SSH into instance (if you can from local):**
```bash
# Check iptables
sudo iptables -L -n

# If blocking, allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables-save
```

---

## 🚀 Quick Test: Allow SSH from Anywhere

**For immediate testing (less secure but works):**

1. **Security Group:**
   - Add rule: SSH, Port 22, Source: `0.0.0.0/0`
   - Save

2. **Wait 30 seconds**

3. **Retry deployment**

4. **After it works, restrict to specific IPs**

---

## 🔍 Alternative: Use Elastic IP

**If IP keeps changing:**

1. **EC2 Console:**
   - Go to "Elastic IPs" (left menu)
   - Click "Allocate Elastic IP address"
   - Click "Allocate"

2. **Associate with Instance:**
   - Select the Elastic IP
   - Click "Actions" → "Associate Elastic IP address"
   - Select your instance
   - Click "Associate"

3. **Update GitHub Secret:**
   - Update `EC2_HOST` with the Elastic IP
   - This IP won't change when instance restarts

---

## 📋 Verification Checklist

Before retrying deployment:

- [ ] EC2 instance state is **"Running"**
- [ ] Security group allows SSH (port 22) from `0.0.0.0/0`
- [ ] `EC2_HOST` secret matches instance **Public IPv4 address**
- [ ] `EC2_USER` is correct (`ec2-user` or `ubuntu`)
- [ ] `EC2_SSH_KEY` is valid private key
- [ ] Waited 30 seconds after security group changes
- [ ] Can SSH from local machine (if possible)

---

## 🆘 Still Not Working?

**Check these:**

1. **Instance Status Checks:**
   - EC2 Console → Instances → Select instance
   - Check "Status checks" tab
   - Should show "2/2 checks passed"

2. **Instance Type:**
   - Some instance types have restrictions
   - Check if instance is in a restricted subnet

3. **AWS Region:**
   - Make sure you're checking the correct region
   - EC2 instances are region-specific

4. **Contact AWS Support:**
   - If all above fails, there may be an AWS-side issue

---

## 💡 Pro Tip

**Use AWS Systems Manager Session Manager** (alternative to SSH):
- No security group changes needed
- Works through AWS console
- More secure
- Requires SSM agent on instance

---

## ✅ After Fixing

Once SSH works:
1. Test deployment again
2. Monitor GitHub Actions logs
3. Consider restricting security group to specific IPs for production

