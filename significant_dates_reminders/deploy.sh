#!/bin/bash

# Exit on any error
set -e

echo "🔨 Compiling TypeScript..."
npx tsc

echo "📤 Pushing code to Google Apps Script..."
clasp push

echo "📅 Setting calendar IDs..."
# Read calendar IDs from .calendar_ids.json and format for clasp run
CALENDAR_IDS=$(cat .calendar_ids.json | jq -c .)
clasp run setCalendars -p "[$CALENDAR_IDS]"

echo "✅ Deployment complete!"
