#!/bin/bash

echo "Starting Expo with WebSocket fix..."

# Try different start methods to avoid WebSocket constructor error
echo "Attempting to start without tunnel first..."
bun expo start --web --localhost

if [ $? -ne 0 ]; then
    echo "Localhost failed, trying without tunnel..."
    bun expo start --web
fi

if [ $? -ne 0 ]; then
    echo "Regular start failed, trying with tunnel..."
    bun expo start --web --tunnel
fi