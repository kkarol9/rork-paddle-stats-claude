#!/bin/bash

echo "Fixing WebSocket constructor issue..."

# Remove node_modules and lock file
rm -rf node_modules
rm -f bun.lockb
rm -f package-lock.json
rm -f yarn.lock

# Clear bun cache
bun pm cache rm

# Reinstall dependencies
bun install

echo "Dependencies reinstalled. Try running the app again."