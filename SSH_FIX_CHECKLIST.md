# 🔧 SSH Connection Timeout - Quick Fix Checklist

## 🔴 Current Error
```
Connection timed out during banner exchange
Connection to *** port 22 timed out
```

**This means GitHub Actions cannot reach your EC2 instance.**

---

## ✅ IMMEDIATE FIXES (Do These First)

### 1. Check EC2 Instance Status ⚡

**AWS Console:**
1. Go to: https://console.aws.amazon.com/ec2/
2. Click **"Instances"** (left sidebar)
3. Find your instance
4. Check:
   - ✅ **State** = "Running" (green)
   - ✅ **Public IPv4 address** = Write this down!
   - ❌ If "Stopped" → Click **"Start instance"** and wait 2 minutes

---

### 2. Fix Security Group (MOST COMMON FIX) ⚡⚡⚡

**This fixes 90% of SSH timeout issues!**

1. **In EC2 Console:**
   - Click on your instance
   - Click **"Security"** tab (bottom panel)
   - Click the **Security Group name** (blue link)

2. **Edit Inbound Rules:**
   - Click **"Edit inbound rules"**
   - **Check if SSH rule exists:**
     - If NO rule for port 22 → Click **"Add rule"**
     - If rule exists but Source is wrong → Edit it
   
3. **Configure SSH Rule:**
   - **Type:** SSH
   - **Protocol:** TCP
   - **Port range:** 22
   - **Source:** `0.0.0.0/0` (allows from anywhere - for testing)
   - **Description:** "Allow SSH from GitHub Actions"
   - Click **"Save rules"**

4. **Wait 30 seconds** for changes to propagate

---

### 3. Verify GitHub Secrets ⚡⚡

**In GitHub:**
1. Go to: https://github.com/infofitsoftwaresolution/hope_physician/settings/secrets/actions
2. Check these secrets:

   **EC2_HOST:**
   - ✅ Must match the **Public IPv4 address** from Step 1
   - ✅ Format: `52.66.236.157` (just IP, no `http://` or port)
   - ⚠️ **If instance was stopped/started, IP changed!** Update this secret!

   **EC2_USER:**
   - ✅ Amazon Linux: `ec2-user`
   - ✅ Ubuntu: `ubuntu`
   - Check your instance AMI type

   **EC2_SSH_KEY:**
   - ✅ Must be the **PRIVATE key** (not .pub)
   - ✅ Must include:
     ```
     -----BEGIN OPENSSH PRIVATE KEY-----
     [key content]
     -----END OPENSSH PRIVATE KEY-----
     ```
   - ✅ Must be the **SAME key** that works locally

---

### 4. Test Locally (Verify Your Setup)

**On your local machine:**
```bash
# Test SSH connection
ssh -i ~/.ssh/your-key.pem ec2-user@YOUR_EC2_IP

# If this works, but GitHub Actions doesn't → Security Group issue
```

---

## 🔍 Advanced Checks (If Above Doesn't Work)

### Check Network ACLs (If Using VPC)
1. Go to: VPC → Network ACLs
2. Find ACL associated with your subnet
3. Ensure inbound rule allows TCP port 22 from 0.0.0.0/0

### Check Instance Firewall
```bash
# SSH into instance (if you can)
ssh ec2-user@YOUR_IP

# Check iptables
sudo iptables -L -n

# If blocking, allow SSH:
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo service iptables save  # or systemctl restart iptables
```

### Check Elastic IP
- If using Elastic IP, verify it's **attached** to your instance
- Go to: EC2 → Elastic IPs → Check association

---

## 📋 Verification Checklist

After making changes, verify:

- [ ] EC2 instance is "Running"
- [ ] Security Group has SSH rule (port 22) from `0.0.0.0/0`
- [ ] `EC2_HOST` secret matches current Public IP
- [ ] `EC2_USER` matches instance AMI (ubuntu/ec2-user)
- [ ] `EC2_SSH_KEY` is the correct private key
- [ ] Waited 30 seconds after security group change
- [ ] Re-ran GitHub Actions workflow

---

## 🚀 After Fixing

1. **Re-run the workflow:**
   - Go to: https://github.com/infofitsoftwaresolution/hope_physician/actions
   - Click on failed workflow
   - Click **"Re-run all jobs"**

2. **Monitor the logs:**
   - Should see: `✅ SSH connection verified`
   - If still fails, check the diagnostic output

---

## 💡 Most Likely Issue

**90% of the time, it's one of these:**
1. Security Group doesn't allow SSH from `0.0.0.0/0`
2. `EC2_HOST` secret has wrong IP (instance was stopped/started)
3. Security Group change hasn't propagated (wait 30 seconds)

---

## 📞 Still Not Working?

1. **Check GitHub Actions logs** for diagnostic output
2. **Test SSH manually** from your local machine
3. **Verify instance has public IP** (not just private IP)
4. **Check AWS CloudWatch** for instance logs
5. **Try creating a new security group** and attach it to instance

