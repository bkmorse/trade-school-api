#!/bin/bash

echo "🛑 Stopping Trade School API..."
echo ""

# Stop PostgreSQL container
echo "🐘 Stopping PostgreSQL container..."
npm run docker:down

echo ""
echo "✅ Server stopped successfully"
echo ""
echo "To start again, run:"
echo "  ./start-server.sh"
echo ""

