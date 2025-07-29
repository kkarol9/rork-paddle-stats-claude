#!/bin/bash

echo "Starting Expo app locally (without tunnel)..."
echo "This should avoid the WebSocket error."
echo ""

# Clear any cached data first
echo "Clearing cache..."
rm -rf .expo
rm -rf node_modules/.cache

# Start without tunnel
echo "Starting Expo..."
bun expo start --web --clear

echo ""
echo "App should be available at http://localhost:8081"
echo "If you need tunnel access, try running the tunnel separately after this starts successfully."