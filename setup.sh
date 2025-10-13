#!/bin/bash

echo "🚀 Setting up Trade School API..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✅ Docker is running"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Start PostgreSQL
echo "🐘 Starting PostgreSQL container..."
npm run docker:up

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate

# Seed database
echo "🌱 Seeding database..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  npm run dev"
echo ""
echo "Other useful commands:"
echo "  npm run prisma:studio  - Open database GUI"
echo "  npm run docker:down    - Stop database"
echo ""

