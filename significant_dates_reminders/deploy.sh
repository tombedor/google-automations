#!/bin/bash

# Exit on any error
set -e

echo "🔨 Compiling TypeScript..."
npx tsc

echo "📤 Pushing code to Google Apps Script..."
clasp push

echo "✅ Deployment complete!"
echo ""
echo "📝 To configure custom calendar names:"
echo "   1. Run: clasp open"
echo "   2. Go to Project Settings (gear icon)"
echo "   3. In Script Properties, add key 'CALENDAR_NAMES' with JSON array value"
echo "   4. Example: [\"My Calendar\", \"Work Calendar\", \"Family Events\"]"
