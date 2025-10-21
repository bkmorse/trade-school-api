#!/bin/bash

echo "🛑 Stopping Trade School API..."
echo ""

# Stop Node.js server processes
echo "🔄 Stopping Node.js server processes..."
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "  - Killing processes on port 3000..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  echo "  ✅ Port 3000 processes stopped"
else
  echo "  ✅ No processes found on port 3000"
fi

# Stop any other Node.js processes related to this project
echo "  - Stopping any remaining Node.js processes..."
pkill -f "node.*index.js" 2>/dev/null || true

# Stop PostgreSQL container
echo "🐘 Stopping PostgreSQL container..."
npm run docker:down

echo ""
echo "✅ All services stopped successfully"
echo ""
echo "To start again, run:"
echo "  ./start-server.sh"
echo ""

