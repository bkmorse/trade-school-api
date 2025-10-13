#!/bin/bash

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

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
max_attempts=30
attempt=0

while [ $attempt -lt $max_attempts ]; do
  if docker exec trade-school-db pg_isready -U tradeuser -d tradeschool > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready"
    break
  fi
  attempt=$((attempt + 1))
  sleep 1
  echo -n "."
done

if [ $attempt -eq $max_attempts ]; then
  echo ""
  echo "❌ PostgreSQL failed to start. Please check Docker logs."
  exit 1
fi

echo ""

# Check if Prisma Client is generated
if [ ! -d "node_modules/.prisma" ]; then
  echo "🔧 Generating Prisma Client..."
  npm run prisma:generate
fi

# Check if database is already set up by trying to query it
if ! node -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.tradeSchool.count().then(() => process.exit(0)).catch(() => process.exit(1));
await prisma.\$disconnect();
" > /dev/null 2>&1; then
  echo "🗄️  Setting up database (first time)..."
  npm run db:setup
else
  echo "✅ Database already set up"
fi

echo ""
echo "🎉 Starting Fastify server..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start the server
npm run dev

