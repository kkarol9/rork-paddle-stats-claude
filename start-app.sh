#!/bin/bash

echo "Starting Expo app with WebSocket fix..."

# First, try to start without tunnel to initialize properly
echo "Step 1: Starting without tunnel..."
timeout 10s bun expo start --web --clear || true

echo "Step 2: Starting with tunnel..."
bun expo start --web --tunnel

echo "If this still fails, try running: bun expo start --web (without tunnel)"