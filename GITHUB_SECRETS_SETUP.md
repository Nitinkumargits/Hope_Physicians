# GitHub Repository Secrets Setup Guide

## 📍 Repository
**https://github.com/infofitsoftwaresolution/hope_physician**

## 🔐 How to Add Secrets

1. Go to: **https://github.com/infofitsoftwaresolution/hope_physician/settings/secrets/actions**
2. Click **"New repository secret"**
3. Add each secret with the **exact name** (case-sensitive)
4. Click **"Add secret"**

---

## ✅ REQUIRED SECRETS (Must Add)

### 🔌 EC2 Connection Secrets

#### 1. **EC2_HOST** ⭐ REQUIRED
- **Description**: Your EC2 instance public IP or domain
- **Example**: `54.123.45.67` or `ec2-54-123-45-67.compute-1.amazonaws.com`
- **How to get**: AWS EC2 Console → Your Instance → Public IPv4 address
- **Used in**: All deployment workflows

#### 2. **EC2_USER** ⭐ REQUIRED
- **Description**: EC2 instance username
- **Example**: `ubuntu` (for Ubuntu) or `ec2-user` (for Amazon Linux)
- **Default**: `ubuntu`
- **Used in**: All deployment workflows

#### 3. **EC2_SSH_KEY** ⭐ REQUIRED
- **Description**: Private SSH key for EC2 access
- **How to get**:
  ```bash
  # Generate SSH key pair (if you don't have one)
  ssh-keygen -t rsa -b 4096 -C "github-actions" -f ~/.ssh/github-actions-deploy
  
  # Copy the PRIVATE key (not .pub)
  cat ~/.ssh/github-actions-deploy
  ```
- **Important**: Copy the ENTIRE content including:
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [key content]
  -----END OPENSSH PRIVATE KEY-----
  ```
- **Used in**: All deployment workflows

#### 4. **EC2_PORT** (Optional)
- **Description**: SSH port number
- **Default**: `22`
- **Example**: `22`
- **Used in**: All deployment workflows (optional)

---

### 🔐 Application Secrets

#### 5. **JWT_SECRET** ⭐ REQUIRED
- **Description**: Secret key for JWT token signing
- **Example**: `your-super-secret-jwt-key-2024-change-in-production`
- **Generate**: Use a long random string (minimum 32 characters)
- **Security**: Use a strong, unique value
- **Used in**: Backend authentication

#### 6. **EMAIL_USER** ⭐ REQUIRED
- **Description**: Email address for sending notifications
- **Example**: `infofitsoftware@gmail.com`
- **Used in**: Email notifications (appointments, etc.)

#### 7. **EMAIL_PASS** ⭐ REQUIRED
- **Description**: Email password or app-specific password
- **For Gmail**: Use App Password (not regular password)
- **How to get Gmail App Password**:
  1. Go to Google Account → Security
  2. Enable 2-Step Verification
  3. Go to App passwords
  4. Generate app password for "Mail"
  5. Copy the 16-character password
- **Example**: `abcd efgh ijkl mnop` (remove spaces: `abcdefghijklmnop`)
- **Used in**: Email notifications

#### 8. **RAZORPAY_KEY_ID** ⭐ REQUIRED (for payments)
- **Description**: Razorpay API Key ID
- **How to get**: 
  - Login to Razorpay Dashboard
  - Go to Settings → API Keys
  - Copy Key ID
- **Example**: `rzp_test_xxxxxxxxxxxxx` (test) or `rzp_live_xxxxxxxxxxxxx` (production)
- **Used in**: Payment processing

#### 9. **RAZORPAY_KEY_SECRET** ⭐ REQUIRED (for payments)
- **Description**: Razorpay API Secret Key
- **How to get**: 
  - Login to Razorpay Dashboard
  - Go to Settings → API Keys
  - Copy Secret Key
- **Security**: Keep this secret! Never commit to repository
- **Used in**: Payment processing

---

## ⚙️ OPTIONAL SECRETS (Recommended)

#### 10. **DATABASE_URL** (Optional)
- **Description**: Database connection string
- **For SQLite** (current): `file:./prisma/hope_physicians.db`
- **For PostgreSQL**: `postgresql://user:password@host:5432/database`
- **For MySQL**: `mysql://user:password@host:3306/database`
- **Default**: `file:./prisma/hope_physicians.db`
- **Used in**: Database connections

#### 11. **PORT** (Optional)
- **Description**: Backend server port
- **Default**: `5000`
- **Example**: `5000`
- **Used in**: Backend server configuration

#### 12. **NODE_ENV** (Optional)
- **Description**: Node.js environment
- **Values**: `development`, `production`, or `test`
- **Default**: `production`
- **Used in**: Environment configuration

#### 13. **VITE_API_URL** (Optional)
- **Description**: Backend API URL for frontend
- **Example**: `http://your-ec2-ip/api` or `https://api.yourdomain.com/api`
- **Default**: `http://localhost:5000/api`
- **Used in**: Frontend API calls

---

## 🔄 MULTI-APP SECRETS (If using multiple apps)

#### 14. **APP2_REPO_URL** (Optional)
- **Description**: Repository URL for second application
- **Example**: `https://github.com/username/app2.git`
- **Used in**: Multi-app deployment workflow
- **Note**: Only needed if deploying second app

---

## 📋 Complete Secrets Checklist

### Minimum Required (9 secrets):
- [ ] EC2_HOST
- [ ] EC2_USER
- [ ] EC2_SSH_KEY
- [ ] JWT_SECRET
- [ ] EMAIL_USER
- [ ] EMAIL_PASS
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] (Optional) EC2_PORT

### Recommended Optional (4 secrets):
- [ ] DATABASE_URL
- [ ] PORT
- [ ] NODE_ENV
- [ ] VITE_API_URL

### Multi-App (1 secret):
- [ ] APP2_REPO_URL (if deploying second app)

---

## 🚀 Quick Setup Steps

1. **Go to Secrets Page**:
   ```
   https://github.com/infofitsoftwaresolution/hope_physician/settings/secrets/actions
   ```

2. **Add EC2 Connection Secrets**:
   - EC2_HOST
   - EC2_USER
   - EC2_SSH_KEY

3. **Add Application Secrets**:
   - JWT_SECRET
   - EMAIL_USER
   - EMAIL_PASS
   - RAZORPAY_KEY_ID
   - RAZORPAY_KEY_SECRET

4. **Add Optional Secrets** (recommended):
   - DATABASE_URL
   - PORT
   - NODE_ENV
   - VITE_API_URL

5. **Verify Secrets**:
   - Go to Actions tab
   - Run a workflow
   - Check if it uses the secrets correctly

---

## 🔒 Security Best Practices

1. ✅ **Never commit secrets** to repository
2. ✅ **Use strong JWT_SECRET** (32+ characters, random)
3. ✅ **Use App Passwords** for Gmail (not regular password)
4. ✅ **Rotate secrets periodically**
5. ✅ **Use different secrets** for production and staging
6. ✅ **Limit access** to repository secrets
7. ✅ **Monitor secret usage** in Actions logs

---

## 🧪 Testing Secrets

After adding secrets, test by:

1. **Push to master branch**:
   ```bash
   git push new-origin master
   ```

2. **Check GitHub Actions**:
   - Go to: https://github.com/infofitsoftwaresolution/hope_physician/actions
   - Click on the latest workflow run
   - Check if deployment succeeds

3. **Verify on EC2**:
   ```bash
   ssh ubuntu@your-ec2-ip
   pm2 status
   ```

---

## 📝 Example Secret Values

### EC2_HOST
```
54.123.45.67
```

### EC2_USER
```
ubuntu
```

### EC2_SSH_KEY
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (full key content)
-----END OPENSSH PRIVATE KEY-----
```

### JWT_SECRET
```
hope-physicians-jwt-secret-2024-production-key-change-this
```

### EMAIL_USER
```
infofitsoftware@gmail.com
```

### EMAIL_PASS
```
abcdefghijklmnop
```

### RAZORPAY_KEY_ID
```
rzp_test_xxxxxxxxxxxxx
```

### RAZORPAY_KEY_SECRET
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### VITE_API_URL
```
http://54.123.45.67/api
```

---

## ❓ Troubleshooting

### Secret not found error:
- ✅ Check secret name spelling (case-sensitive)
- ✅ Verify secret exists in repository settings
- ✅ Check if workflow has access to secrets

### EC2 connection failed:
- ✅ Verify EC2_HOST is correct
- ✅ Check EC2_SSH_KEY format (must include BEGIN/END lines)
- ✅ Ensure EC2 security group allows SSH (port 22)
- ✅ Test SSH manually: `ssh -i key.pem ubuntu@ec2-ip`

### Deployment fails:
- ✅ Check all required secrets are added
- ✅ Verify secret values are correct
- ✅ Check GitHub Actions logs for specific errors

---

## 📞 Need Help?

If CI/CD is not working:
1. Check GitHub Actions logs
2. Verify all required secrets are added
3. Test EC2 connection manually
4. Check EC2 security group settings

---

**Last Updated**: Based on repository at https://github.com/infofitsoftwaresolution/hope_physician

