#!/bin/bash
# Static Websites Auto-Deployment Script

echo "▶ Step 1: Pulling latest websites from Git..."
git pull origin main

echo "▶ Step 2: Restarting Nginx (if config changed)..."
docker compose up -d --force-recreate

echo "✓ Success! Custom websites deployed on port 8080."
docker compose ps
