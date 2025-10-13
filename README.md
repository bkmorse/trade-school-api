# Trade School API

A modern Fastify-based REST API that provides information about trade schools across the United States. Built with PostgreSQL, Prisma ORM, and Docker.

## Features

- ✅ Fast and lightweight using Fastify framework
- ✅ PostgreSQL database with Prisma ORM
- ✅ Docker containerized database
- ✅ CORS enabled for cross-origin requests
- ✅ Full CRUD operations
- ✅ Query filtering by program and location
- ✅ RESTful API design
- ✅ Health check endpoint
- ✅ Database migrations and seeding

## Tech Stack

- **Framework**: Fastify
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Container**: Docker & Docker Compose
- **Runtime**: Node.js (ES Modules)
- **Architecture**: Service Layer Pattern

## Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

## Installation

1. **Clone the repository** (or you're already here!)

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
# Create .env file in the root directory
cat > .env << 'EOF'
DATABASE_URL="postgresql://tradeuser:tradepass@localhost:5432/tradeschool?schema=public"
PORT=3000
HOST=0.0.0.0
EOF
```

4. **Start PostgreSQL database:**
```bash
npm run docker:up
```

This will start a PostgreSQL container in the background.

5. **Run database migrations:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

6. **Seed the database:**
```bash
npm run db:seed
```

Or run migration and seed in one command:
```bash
npm run db:setup
```

## Usage

### Quick Start (Recommended)

Start everything with one command:
```bash
./start-server.sh
```

This script will:
- ✅ Check if Docker is running
- ✅ Install dependencies (if needed)
- ✅ Start PostgreSQL container
- ✅ Wait for database to be ready
- ✅ Run migrations (first time only)
- ✅ Seed database (first time only)
- ✅ Start the Fastify server

Stop the server:
```bash
# Press Ctrl+C to stop Fastify, then run:
./stop-server.sh
```

### Manual Start

**Development Mode (with auto-restart)**
```bash
npm run dev
```

**Production Mode**
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## Docker Commands

```bash
# Start PostgreSQL container
npm run docker:up

# Stop PostgreSQL container
npm run docker:down

# View database with Prisma Studio
npm run prisma:studio
```

## API Endpoints

### 1. Root - Get API Information
```
GET /
```

Returns API metadata and available endpoints.

**Example:**
```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "message": "Trade School API",
  "version": "2.0.0",
  "database": "PostgreSQL with Prisma",
  "endpoints": {
    "schools": "/api/schools",
    "schoolById": "/api/schools/:id",
    "programs": "/api/programs"
  }
}
```

### 2. Get All Trade Schools
```
GET /api/schools
```

**Query Parameters:**
- `program` (optional): Filter schools by exact program match
- `location` (optional): Filter schools by location (case-insensitive, partial match)

**Examples:**
```bash
# Get all schools
curl http://localhost:3000/api/schools

# Filter by program (exact match)
curl "http://localhost:3000/api/schools?program=Welding"

# Filter by location
curl "http://localhost:3000/api/schools?location=virginia"
```

**Response:**
```json
{
  "count": 8,
  "schools": [
    {
      "id": 1,
      "name": "Lincoln Tech",
      "location": "Multiple Locations",
      "programs": ["Automotive Technology", "HVAC", "Electrical Technology", "Welding"],
      "website": "https://www.lincolntech.edu",
      "accredited": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 3. Get School by ID
```
GET /api/schools/:id
```

**Example:**
```bash
curl http://localhost:3000/api/schools/1
```

**Response:**
```json
{
  "id": 1,
  "name": "Lincoln Tech",
  "location": "Multiple Locations",
  "programs": ["Automotive Technology", "HVAC", "Electrical Technology", "Welding"],
  "website": "https://www.lincolntech.edu",
  "accredited": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Get All Programs
```
GET /api/programs
```

Returns a unique list of all programs offered across all trade schools.

**Example:**
```bash
curl http://localhost:3000/api/programs
```

**Response:**
```json
{
  "count": 15,
  "programs": [
    "Automotive",
    "Automotive Technology",
    "CAD",
    "CDL Training",
    "CNC Machining",
    ...
  ]
}
```

### 5. Get Statistics
```
GET /api/stats
```

Returns statistics about trade schools and programs.

**Example:**
```bash
curl http://localhost:3000/api/stats
```

**Response:**
```json
{
  "totalSchools": 8,
  "accreditedSchools": 8,
  "totalPrograms": 15
}
```

### 6. Create a New School
```
POST /api/schools
```

**Request Body:**
```json
{
  "name": "ABC Technical Institute",
  "location": "New York, NY",
  "programs": ["Plumbing", "HVAC", "Electrical"],
  "website": "https://www.abctech.edu",
  "accredited": true
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Technical Institute",
    "location": "New York, NY",
    "programs": ["Plumbing", "HVAC", "Electrical"],
    "website": "https://www.abctech.edu",
    "accredited": true
  }'
```

### 6. Update a School
```
PUT /api/schools/:id
```

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Name",
  "location": "Updated Location",
  "programs": ["Updated Programs"],
  "website": "https://updated.edu",
  "accredited": false
}
```

**Example:**
```bash
curl -X PUT http://localhost:3000/api/schools/1 \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Updated Location"
  }'
```

### 7. Delete a School
```
DELETE /api/schools/:id
```

**Example:**
```bash
curl -X DELETE http://localhost:3000/api/schools/1
```

### 8. Health Check
```
GET /health
```

Check API and database connectivity.

**Example:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Database Schema

### TradeSchool Model

| Field | Type | Description |
|-------|------|-------------|
| id | Int | Auto-incrementing primary key |
| name | String | School name |
| location | String | School location(s) |
| programs | String[] | Array of programs offered |
| website | String | School website URL |
| accredited | Boolean | Accreditation status (default: true) |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio

# Seed database
npm run db:seed

# Run migrations + seed
npm run db:setup
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://tradeuser:tradepass@localhost:5432/tradeschool?schema=public"
PORT=3000
HOST=0.0.0.0
```

## Project Structure

```
trade-school/
├── routes/
│   └── tradeSchool.routes.js     # Route definitions (grouped by feature)
├── controllers/
│   └── tradeSchoolController.js  # HTTP request/response handlers
├── services/
│   └── tradeSchoolService.js     # Business logic & database operations
├── schemas/
│   └── tradeSchool.schema.js     # JSON schemas for validation
├── lib/
│   └── prisma.js                 # Prisma client singleton
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.js                   # Database seed script
├── index.js                      # Fastify server & plugin registration
├── package.json                  # Dependencies and scripts
├── docker-compose.yml            # Docker configuration
├── start-server.sh               # Start script (recommended)
├── stop-server.sh                # Stop script
├── setup.sh                      # First-time setup script
├── Trade-School-API.postman_collection.json  # Postman collection
├── POSTMAN_GUIDE.md              # Postman usage guide
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## Seed Data

The database comes pre-seeded with 8 trade schools:
1. Lincoln Tech
2. Universal Technical Institute
3. Mike Rowe WORKS Foundation
4. Tulsa Welding School
5. Advanced Technology Institute
6. Midwest Technical Institute
7. Porter and Chester Institute
8. New England Tractor Trailer Training School

## Architecture

This project follows **MVC (Model-View-Controller)** and **Clean Architecture** principles with clear separation of concerns:

### Route Layer (`routes/`)
- **Route Modules**: Organized by feature/domain (e.g., tradeSchool.routes.js)
- Registered as Fastify plugins for modularity
- Each route file groups related endpoints together
- Maps URLs to controllers + schemas
- Keeps `index.js` clean and minimal
- Easy to add new features without bloating main file

### Controller Layer (`controllers/`)
- **TradeSchoolController**: Handles HTTP request/response logic
- Extracts data from requests (params, query, body)
- Calls service methods for business logic
- Maps service results to HTTP responses
- Sets appropriate status codes (200, 201, 404, 503)
- No business logic - pure HTTP concerns

### Service Layer (`services/`)
- **TradeSchoolService**: Contains all business logic and database operations
- Pure functions with no HTTP knowledge
- Handles data transformation and validation
- Centralizes database access
- Reusable across different controllers or contexts
- Easy to unit test

### Schema Layer (`schemas/`)
- **JSON Schema Validation**: Declarative request/response validation
- Fastify automatically validates before reaching controllers
- Type coercion and sanitization
- Self-documenting (can generate OpenAPI/Swagger)
- Performance optimized (compiled at startup)

### Application Layer (`index.js`)
- **Minimal bootstrap file**: Just registers plugins and starts server
- No route definitions - all extracted to route modules
- Global middleware and configuration
- Clean entry point

### Database Layer (`lib/` + `prisma/`)
- **Prisma Client Singleton**: Single database connection
- **Prisma Schema**: Database model definitions
- Type-safe database queries
- Migration management

### Benefits
- ✅ **Separation of Concerns**: Each layer has a single, clear responsibility
- ✅ **Scalability**: Add new features by creating new route modules
- ✅ **Testability**: Controllers, services, and schemas can be tested independently
- ✅ **Maintainability**: Easy to find and modify code - routes grouped by feature
- ✅ **Plugin System**: Fastify plugins enable encapsulation and reusability
- ✅ **Reusability**: Services can be used by multiple controllers
- ✅ **Type Safety**: Schemas + Prisma provide end-to-end type safety
- ✅ **Clean Code**: Thin layers with focused responsibilities

### Request Flow
```
HTTP Request
    ↓
Route Plugin (routes/tradeSchool.routes.js) → Matches URL
    ↓
Schema Validation (schemas/) → Validates request
    ↓
Controller Method (controllers/) → Handles HTTP concerns
    ↓
Service Method (services/) → Business logic & database
    ↓
Prisma (lib/prisma.js) → Database query
    ↓
PostgreSQL Database
```

## Validation Examples

The API uses JSON Schema for automatic validation. Here are some examples:

### ✅ Valid Request
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Tech",
    "location": "New York, NY",
    "programs": ["Plumbing", "HVAC"],
    "website": "https://www.abctech.edu"
  }'
```

### ❌ Invalid Request (missing required field)
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Tech",
    "location": "New York, NY"
  }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body must have required property 'programs'"
}
```

### ❌ Invalid Request (wrong data type)
```bash
curl -X POST http://localhost:3000/api/schools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ABC Tech",
    "location": "New York, NY",
    "programs": "Plumbing",
    "website": "https://www.abctech.edu"
  }'
```

**Error Response:**
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/programs must be array"
}
```

## 📮 Postman Collection

A complete Postman collection is included for testing all API endpoints!

### Import to Postman
1. Open Postman
2. Click **Import** → **File**
3. Select `Trade-School-API.postman_collection.json`
4. Start testing!

### What's Included
- ✅ All 13 endpoints pre-configured
- ✅ Sample request bodies for POST/PUT
- ✅ Filter examples for GET requests
- ✅ Environment variable for base URL
- ✅ Organized into logical folders

See **[POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)** for detailed usage instructions.

## Development Tips

1. **View Database**: Use `npm run prisma:studio` to open a GUI for your database
2. **Reset Database**: Delete and recreate with `npx prisma migrate reset`
3. **Check Logs**: Fastify logger is enabled by default
4. **Database Connection**: Ensure Docker container is running before starting the app
5. **Controller Layer**: HTTP request/response logic in `controllers/tradeSchoolController.js`
6. **Service Layer**: All business logic and database operations in `services/tradeSchoolService.js`
7. **Schema Validation**: All validation rules are in `schemas/tradeSchool.schema.js`
8. **Route Definitions**: All routes are defined cleanly in `index.js`
9. **Validation Errors**: Fastify automatically returns detailed validation errors
10. **Test with Postman**: Import the Postman collection for easy API testing

### Adding a New Endpoint

1. **Add Schema** (`schemas/`) - Define request/response validation
2. **Add Service Method** (`services/`) - Implement business logic
3. **Add Controller Method** (`controllers/`) - Handle HTTP concerns
4. **Add Route** (`routes/`) - Add to existing route file or create new one
5. **Register Plugin** (`index.js`) - If new route file, register as plugin

Example: Adding a new feature area (e.g., "students")
```javascript
// 1. Create routes/student.routes.js
export default async function studentRoutes(fastify, options) {
  fastify.get('/students', { schema, handler: controller.getAll });
}

// 2. Register in index.js
fastify.register(studentRoutes, { prefix: '/api' });
```

## Troubleshooting

### Database Connection Error
```bash
# Ensure PostgreSQL container is running
docker ps

# Restart container if needed
npm run docker:down
npm run docker:up
```

### Migration Issues
```bash
# Reset database and run migrations
npx prisma migrate reset
npm run db:setup
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=3001
```

## Future Enhancements

- [ ] Add pagination for large datasets
- [ ] Implement authentication and authorization
- [ ] Add more detailed filtering options
- [ ] Include tuition information and program duration
- [ ] Add student reviews and ratings
- [ ] API versioning
- [ ] Rate limiting
- [ ] Caching layer (Redis)
- [ ] GraphQL endpoint
- [ ] OpenAPI/Swagger documentation

## License

ISC
