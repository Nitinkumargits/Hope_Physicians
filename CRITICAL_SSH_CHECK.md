# 🚨 CRITICAL: SSH Timeout - Deep Network Check

## ⚠️ If Everything Else is Correct, Check These:

### 1. **Does Your Instance Have a Public IP?** (MOST LIKELY ISSUE)

**In AWS Console:**
1. Go to: EC2 → Instances
2. Select your instance
3. Look at the **"Public IPv4 address"** column:
   - ✅ **Has a value** (e.g., `52.66.236.157`) → Good!
   - ❌ **Shows "-" or empty** → **THIS IS THE PROBLEM!**

**If NO Public IP:**
- Your instance is in a **private subnet**
- It cannot be accessed directly from the internet
- **Solutions:**
  1. **Assign Elastic IP** (recommended):
     - EC2 → Elastic IPs → Allocate Elastic IP
     - Associate it with your instance
     - Update `EC2_HOST` secret with the Elastic IP
  2. **Move instance to public subnet** (if using VPC)
  3. **Use NAT Gateway** (more complex, for private subnets)

---

### 2. **Check Subnet Configuration (If Using VPC)**

**In AWS Console:**
1. Go to: VPC → Subnets
2. Find your instance's subnet
3. Check **"Auto-assign public IPv4 address"**:
   - ✅ Should be **"Yes"** for direct SSH access
   - ❌ If "No", instances won't get public IPs

**To Fix:**
- Edit subnet → Enable "Auto-assign public IPv4 address"
- Or use Elastic IP (see above)

---

### 3. **Check Network ACLs (VPC Only)**

**In AWS Console:**
1. Go to: VPC → Network ACLs
2. Find the ACL for your subnet
3. Check **Inbound Rules**:
   - Must have rule allowing SSH (port 22) from `0.0.0.0/0`
   - Rule number should be low (e.g., 100) to take precedence

**If missing, add:**
- Rule #: 100
- Type: SSH
- Protocol: TCP
- Port: 22
- Source: 0.0.0.0/0
- Allow/Deny: Allow

---

### 4. **Check Route Table (VPC Only)**

**In AWS Console:**
1. Go to: VPC → Route Tables
2. Find route table for your subnet
3. Check for route to Internet Gateway:
   - Destination: `0.0.0.0/0`
   - Target: `igw-xxxxx` (Internet Gateway)
   - ✅ If exists → Good
   - ❌ If missing → Add route to Internet Gateway

---

### 5. **Verify Instance is in Public Subnet**

**Quick Check:**
- If instance has **Public IPv4 address** → Public subnet ✅
- If instance has **NO Public IPv4 address** → Private subnet ❌

**Private Subnet Solutions:**
1. **Use Elastic IP** (easiest)
2. **Use AWS Systems Manager Session Manager** (no SSH needed)
3. **Use Bastion Host** (jump server)
4. **Move instance to public subnet**

---

### 6. **Test from AWS CloudShell**

**This tests if the issue is GitHub Actions specific:**

1. Go to: AWS Console → CloudShell (top right)
2. Run:
   ```bash
   ssh -i /path/to/key.pem ec2-user@YOUR_EC2_IP
   ```
3. If this works → Issue is with GitHub Actions network
4. If this fails → Issue is with EC2 configuration

---

### 7. **Check Instance Status Checks**

**In AWS Console:**
1. EC2 → Instances → Select instance
2. Click **"Status checks"** tab
3. Should show:
   - ✅ **2/2 checks passed**
   - ❌ If failing → Instance has issues

---

## 🔧 Quick Fix: Assign Elastic IP

**If your instance doesn't have a public IP:**

1. **Allocate Elastic IP:**
   - EC2 → Elastic IPs → Allocate Elastic IP address
   - Click "Allocate"

2. **Associate with Instance:**
   - Select the Elastic IP
   - Click "Actions" → "Associate Elastic IP address"
   - Select your instance
   - Click "Associate"

3. **Update GitHub Secret:**
   - Go to: GitHub → Settings → Secrets
   - Update `EC2_HOST` with the Elastic IP

4. **Wait 1 minute** for propagation

5. **Test SSH:**
   ```bash
   ssh -i key.pem ec2-user@ELASTIC_IP
   ```

---

## 🆘 Alternative: Use AWS Systems Manager

**If SSH still doesn't work, use SSM Session Manager:**

1. **Install SSM Agent** (usually pre-installed on Amazon Linux/Ubuntu)
2. **Attach IAM Role** with `AmazonSSMManagedInstanceCore` policy
3. **Connect via AWS Console:**
   - EC2 → Instances → Select instance
   - Click "Connect" → "Session Manager" tab
   - Click "Connect"

**No SSH needed!** Works through AWS console.

---

## 📋 Final Checklist

- [ ] Instance has **Public IPv4 address** (not "-")
- [ ] Subnet has "Auto-assign public IPv4" enabled
- [ ] Network ACL allows SSH from 0.0.0.0/0
- [ ] Route table has route to Internet Gateway
- [ ] Security Group allows SSH from 0.0.0.0/0
- [ ] `EC2_HOST` secret matches Public IP or Elastic IP
- [ ] Instance status checks: 2/2 passed
- [ ] Can SSH from local machine (if possible)
- [ ] Can SSH from AWS CloudShell (tests AWS network)

---

## 💡 Most Likely Fix

**90% of the time when "everything is correct" but SSH times out:**
- Instance is in **private subnet** without public IP
- **Solution:** Assign Elastic IP and update `EC2_HOST` secret

