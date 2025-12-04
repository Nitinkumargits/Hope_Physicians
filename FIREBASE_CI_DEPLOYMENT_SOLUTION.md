# 🔥 Complete Firebase CI/CD Deployment Solution

## ✔ Root Cause Explanation

The error **"Invalid project selection, please verify project exists and you have access"** occurs because:

1. **Firebase CLI requires explicit project authentication** - `firebase use` needs the service account to be authenticated via `GOOGLE_APPLICATION_CREDENTIALS`
2. **Service account may lack Firebase-specific permissions** - Google Cloud IAM roles ≠ Firebase permissions
3. **Project ID mismatch** - Using project name instead of project ID, or incorrect format
4. **Missing Firebase project initialization** - `.firebaserc` or `firebase.json` may be missing or incorrect

---

## ✔ Step-by-Step Fix Instructions

### Step 1: Verify Project ID (Not Name)

**Firebase Project ID vs Name:**
- ❌ **Project Name**: "Hope Physicians" (display name)
- ✅ **Project ID**: `hope-physicians` (unique identifier, lowercase, hyphens)

**How to Find:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ → **Project Settings**
4. Check **"Project ID"** field (NOT "Project name")

**Verify in GitHub Secret:**
- Go to: https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions
- `FIREBASE_PROJECT_ID` should be exactly: `hope-physicians`

---

### Step 2: Set Up Service Account with Correct Permissions

#### Option A: Using Firebase Console (Recommended)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **hope-physicians**
3. Click ⚙️ → **Project Settings** → **Service Accounts** tab
4. Click **"Generate New Private Key"**
5. Download JSON file
6. **Copy entire JSON content** (from `{` to `}`)

#### Option B: Using Google Cloud Console (More Control)

1. Go to [Google Cloud Console - IAM](https://console.cloud.google.com/iam-admin/iam?project=hope-physicians)
2. Find or create service account
3. Add these **required roles**:
   - ✅ **Firebase Admin** (`roles/firebase.admin`) - OR
   - ✅ **Firebase Admin SDK Administrator Service Agent** (`roles/firebase.adminsdk.adminServiceAgent`)
   - ✅ **Cloud Functions Admin** (`roles/cloudfunctions.admin`)
   - ✅ **Firebase Hosting Admin** (`roles/firebasehosting.admin`)
   - ✅ **Service Account User** (`roles/iam.serviceAccountUser`)
4. Generate new key: **IAM & Admin** → **Service Accounts** → **Keys** → **Add Key** → **JSON**

---

### Step 3: Update GitHub Secrets

Go to: https://github.com/Nitinkumargits/Hope_Physicians/settings/secrets/actions

**Required Secrets:**

| Secret Name | Value | Example |
|------------|-------|---------|
| `FIREBASE_PROJECT_ID` | Exact project ID | `hope-physicians` |
| `FIREBASE_SERVICE_ACCOUNT` | Complete JSON | `{"type":"service_account",...}` |

**Verification:**
- `FIREBASE_PROJECT_ID` = exactly `hope-physicians` (no spaces, no quotes)
- `FIREBASE_SERVICE_ACCOUNT` = complete JSON starting with `{` and ending with `}`
- JSON contains `"project_id": "hope-physicians"` (must match!)

---

### Step 4: Use Improved Deployment Method

Instead of `firebase use`, use `firebase deploy --project` which is more reliable for CI:

```bash
firebase deploy --project "$FIREBASE_PROJECT_ID" --non-interactive
```

This bypasses the need for `firebase use` and directly specifies the project.

---

## ✔ Final Working Firebase CI Deploy Script

### GitHub Actions Workflow (Updated)

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [master, main]
  workflow_dispatch:

env:
  NODE_VERSION: "18"
  FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}

jobs:
  deploy:
    name: Deploy to Firebase
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Setup Firebase Service Account
        run: |
          # Write service account JSON
          echo '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}' > /tmp/firebase-service-account.json
          chmod 600 /tmp/firebase-service-account.json
          
          # Validate JSON
          if ! python3 -m json.tool /tmp/firebase-service-account.json > /dev/null 2>&1; then
            echo "❌ Error: Invalid JSON in FIREBASE_SERVICE_ACCOUNT"
            exit 1
          fi
          
          # Extract and verify project_id from JSON
          JSON_PROJECT_ID=$(python3 -c "import json; print(json.load(open('/tmp/firebase-service-account.json'))['project_id'])")
          SECRET_PROJECT_ID="${{ secrets.FIREBASE_PROJECT_ID }}"
          
          if [ "$JSON_PROJECT_ID" != "$SECRET_PROJECT_ID" ]; then
            echo "❌ Error: Project ID mismatch!"
            echo "JSON project_id: $JSON_PROJECT_ID"
            echo "Secret project_id: $SECRET_PROJECT_ID"
            exit 1
          fi
          
          echo "✅ Service account JSON is valid"
          echo "✅ Project ID matches: $JSON_PROJECT_ID"

      - name: Authenticate with Firebase
        env:
          GOOGLE_APPLICATION_CREDENTIALS: /tmp/firebase-service-account.json
        run: |
          # Verify project exists and we have access
          echo "🔍 Verifying Firebase project access..."
          firebase projects:list --project "${{ secrets.FIREBASE_PROJECT_ID }}" || {
            echo "❌ Error: Cannot access Firebase project"
            echo "Please verify:"
            echo "1. Project ID is correct: ${{ secrets.FIREBASE_PROJECT_ID }}"
            echo "2. Service account has Firebase Admin permissions"
            exit 1
          }
          
          # Create .firebaserc for project context
          echo "{\"projects\":{\"default\":\"${{ secrets.FIREBASE_PROJECT_ID }}\"}}" > .firebaserc
          
          echo "✅ Firebase authentication successful"

      - name: Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build

      - name: Deploy to Firebase
        env:
          GOOGLE_APPLICATION_CREDENTIALS: /tmp/firebase-service-account.json
        run: |
          # Deploy using explicit project flag (more reliable than firebase use)
          firebase deploy \
            --project "${{ secrets.FIREBASE_PROJECT_ID }}" \
            --non-interactive \
            --only hosting,functions || {
            echo "❌ Deployment failed"
            exit 1
          }

      - name: Cleanup
        if: always()
        run: rm -f /tmp/firebase-service-account.json
```

---

### Standalone Bash Script Version

Save as `deploy-firebase.sh`:

```bash
#!/bin/bash
set -e

# Configuration
FIREBASE_PROJECT_ID="${FIREBASE_PROJECT_ID:-hope-physicians}"
SERVICE_ACCOUNT_JSON="${FIREBASE_SERVICE_ACCOUNT_JSON:-/tmp/firebase-service-account.json}"

echo "🚀 Firebase Deployment Script"
echo "Project ID: $FIREBASE_PROJECT_ID"

# Step 1: Validate service account JSON exists
if [ ! -f "$SERVICE_ACCOUNT_JSON" ]; then
    echo "❌ Error: Service account JSON not found at: $SERVICE_ACCOUNT_JSON"
    echo "Set FIREBASE_SERVICE_ACCOUNT_JSON environment variable"
    exit 1
fi

# Step 2: Validate JSON format
if ! python3 -m json.tool "$SERVICE_ACCOUNT_JSON" > /dev/null 2>&1; then
    echo "❌ Error: Invalid JSON in service account file"
    exit 1
fi

# Step 3: Extract project_id from JSON and verify match
JSON_PROJECT_ID=$(python3 -c "import json; print(json.load(open('$SERVICE_ACCOUNT_JSON'))['project_id'])")
if [ "$JSON_PROJECT_ID" != "$FIREBASE_PROJECT_ID" ]; then
    echo "❌ Error: Project ID mismatch!"
    echo "JSON project_id: $JSON_PROJECT_ID"
    echo "Expected project_id: $FIREBASE_PROJECT_ID"
    exit 1
fi

echo "✅ Service account JSON is valid"
echo "✅ Project ID matches: $JSON_PROJECT_ID"

# Step 4: Set authentication
export GOOGLE_APPLICATION_CREDENTIALS="$SERVICE_ACCOUNT_JSON"
chmod 600 "$SERVICE_ACCOUNT_JSON"

# Step 5: Verify Firebase access
echo "🔍 Verifying Firebase project access..."
if ! firebase projects:list --project "$FIREBASE_PROJECT_ID" > /dev/null 2>&1; then
    echo "❌ Error: Cannot access Firebase project: $FIREBASE_PROJECT_ID"
    echo "Please verify service account has Firebase Admin permissions"
    exit 1
fi

# Step 6: Create .firebaserc
echo "{\"projects\":{\"default\":\"$FIREBASE_PROJECT_ID\"}}" > .firebaserc
echo "✅ Created .firebaserc"

# Step 7: Deploy
echo "🚀 Deploying to Firebase..."
firebase deploy \
    --project "$FIREBASE_PROJECT_ID" \
    --non-interactive \
    --only hosting,functions

echo "✅ Deployment successful!"
echo "Frontend: https://$FIREBASE_PROJECT_ID.web.app"
echo "API: https://us-central1-$FIREBASE_PROJECT_ID.cloudfunctions.net/api"
```

**Usage:**
```bash
export FIREBASE_PROJECT_ID="hope-physicians"
export FIREBASE_SERVICE_ACCOUNT_JSON="/path/to/service-account.json"
chmod +x deploy-firebase.sh
./deploy-firebase.sh
```

---

## ✔ Verification Commands

### 1. Verify Project ID
```bash
# Check Firebase Console or use:
firebase projects:list
```

### 2. Verify Service Account JSON
```bash
# Validate JSON format
python3 -m json.tool service-account.json

# Extract project_id
python3 -c "import json; print(json.load(open('service-account.json'))['project_id'])"
```

### 3. Test Authentication Locally
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"
firebase projects:list --project "hope-physicians"
```

### 4. Verify IAM Permissions
```bash
# Using gcloud (if installed)
gcloud projects get-iam-policy hope-physicians \
    --flatten="bindings[].members" \
    --filter="bindings.members:serviceAccount:*@hope-physicians.iam.gserviceaccount.com"
```

---

## ✔ Checklist

### GitHub Secrets
- [ ] `FIREBASE_PROJECT_ID` = exact project ID (e.g., `hope-physicians`)
- [ ] `FIREBASE_SERVICE_ACCOUNT` = complete valid JSON
- [ ] JSON `project_id` matches `FIREBASE_PROJECT_ID`

### Service Account Permissions
- [ ] Service account exists in Firebase Console
- [ ] Has **Firebase Admin** role OR:
  - Firebase Admin SDK Administrator Service Agent
  - Cloud Functions Admin
  - Firebase Hosting Admin
- [ ] Service account key is not expired/disabled

### Project Configuration
- [ ] `firebase.json` exists in repository root
- [ ] `.firebaserc` will be created automatically (or exists)
- [ ] Project ID matches in all locations

### Testing
- [ ] Can list projects: `firebase projects:list`
- [ ] Can access project: `firebase projects:list --project "hope-physicians"`
- [ ] Service account JSON is valid JSON format

---

## 🔧 Quick Fix Commands

### Fix Project ID Mismatch
```bash
# Extract project_id from service account JSON
python3 -c "import json; print(json.load(open('service-account.json'))['project_id'])"

# Update GitHub Secret FIREBASE_PROJECT_ID to match
```

### Regenerate Service Account
```bash
# 1. Go to Firebase Console → Project Settings → Service Accounts
# 2. Generate New Private Key
# 3. Update GitHub Secret FIREBASE_SERVICE_ACCOUNT
```

### Verify Everything Works
```bash
export GOOGLE_APPLICATION_CREDENTIALS="service-account.json"
firebase projects:list --project "hope-physicians"
firebase deploy --project "hope-physicians" --non-interactive --only hosting
```

---

**Last Updated:** December 2024

