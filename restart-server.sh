#!/bin/bash
set -e  # Exit on error

echo "🔄 Restarting Trade School API..."
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Stop the server
echo "🛑 Stopping server..."
bash "$SCRIPT_DIR/stop-server.sh"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
echo "🚀 Starting server..."
bash "$SCRIPT_DIR/start-server.sh"

