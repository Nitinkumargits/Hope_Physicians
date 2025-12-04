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

