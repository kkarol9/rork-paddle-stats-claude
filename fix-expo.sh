#!/bin/bash

echo "Fixing Expo WebSocket issue..."

# Clear Expo cache
echo "Clearing Expo cache..."
rm -rf ~/.expo
rm -rf node_modules/.cache
rm -rf .expo

# Clear bun cache
echo "Clearing bun cache..."
bun pm cache rm

# Reinstall dependencies
echo "Reinstalling dependencies..."
rm -rf node_modules
rm bun.lock
bun install

# Try to start with different approach
echo "Starting Expo without tunnel first..."
bun expo start --web --clear

echo "Fix complete!"