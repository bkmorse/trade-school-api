#!/bin/bash
set -e  # Exit on error

# Cleanup function for errors
cleanup_on_error() {
  echo ""
  echo "❌ Startup failed. Run 'npm run docker:down' to clean up if needed."
  exit 1
}

trap cleanup_on_error ERR

echo "🚀 Starting Trade School API..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✅ Docker is running"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Start PostgreSQL container
echo "🐘 Starting PostgreSQL container..."
npm run docker:up

# Wait for PostgreSQL to be healthy using Docker's healthcheck
echo "⏳ Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  health_status=$(docker inspect --format='{{.State.Health.Status}}' trade-school-db 2>/dev/null || echo "starting")

  if [ "$health_status" = "healthy" ]; then
    echo "✅ PostgreSQL is ready"
    break
  fi

  attempt=$((attempt + 1))
  sleep 1

  # Show progress dots
  if [ $((attempt % 5)) -eq 0 ]; then
    echo -n "."
  fi
done

if [ $attempt -eq $max_attempts ]; then
  echo ""
  echo "❌ PostgreSQL failed to start. Checking logs..."
  docker logs trade-school-db --tail 20
  exit 1
fi

echo ""

# Check if Prisma Client is generated
if [ ! -d "node_modules/.prisma" ] || [ ! -d "node_modules/@prisma/client" ]; then
  echo "🔧 Generating Prisma Client..."
  npm run prisma:generate
fi

# Check if database needs setup by checking for migrations table
echo "🔍 Checking database status..."
if ! docker exec trade-school-db psql -U tradeuser -d tradeschool -c "SELECT 1 FROM _prisma_migrations LIMIT 1;" > /dev/null 2>&1; then
  echo "🗄️  Setting up database (first time)..."
  npm run db:setup
else
  echo "✅ Database already set up"
fi

echo ""
echo "🎉 Starting Fastify server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if port 3000 is already in use
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "⚠️  Port 3000 is already in use. Stopping existing processes..."
  lsof -ti:3000 | xargs kill -9 2>/dev/null || true
  sleep 2
fi

# Start the server
echo "🚀 Starting server on http://localhost:3000"
npm run dev

