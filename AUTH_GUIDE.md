# Authentication Guide

The Trade School API now requires authentication to access trade school endpoints.

## Quick Start

### 1. Run Database Migration

After adding the User model, run migrations:

```bash
npm run prisma:migrate
```

### 2. Seed Default User

The seed script creates a default admin user:

```bash
npm run db:seed
```

**Default Credentials:**
- Username: `admin`
- Password: `password123`

⚠️ **Important**: Change this password in production!

### 3. Login to Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### 4. Use Token to Access Protected Endpoints

Include the token in the Authorization header:

```bash
curl http://localhost:3000/api/schools \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
```

- `JWT_SECRET`: Secret key for signing JWT tokens (use a strong random string in production)
- `JWT_EXPIRES_IN`: Token expiration time (default: 7d)

## API Endpoints

### Public Endpoints (No Auth Required)

- `POST /api/auth/login` - Login with username/password
- `GET /health` - Health check
- `GET /api/docs` - API documentation

### Protected Endpoints (Auth Required)

All trade school endpoints require authentication:

- `GET /api/schools` - List schools
- `GET /api/schools/:uuid` - Get school by UUID
- `POST /api/schools` - Create school
- `PUT /api/schools/:uuid` - Update school
- `DELETE /api/schools/:uuid` - Delete school
- `GET /api/programs` - List programs
- `GET /api/stats` - Get statistics

## Authentication Flow

1. **Login**: Send username/password to `/api/auth/login`
2. **Receive Token**: Get JWT token in response
3. **Include Token**: Add `Authorization: Bearer <token>` header to all protected requests
4. **Token Expires**: When token expires, login again to get a new token

## Error Responses

### 401 Unauthorized (No Token)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Authentication token required. Please login first."
}
```

### 401 Unauthorized (Invalid Token)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid or expired token. Please login again."
}
```

### 401 Unauthorized (Invalid Credentials)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid username or password"
}
```

## Creating New Users

Currently, users must be created directly in the database. You can:

1. Use Prisma Studio: `npm run prisma:studio`
2. Create a migration/seed script
3. Use the database directly

**Example: Create user programmatically**

```javascript
import authService from './services/authService.js';

const user = await authService.createUser('newuser', 'password123');
```

## Security Notes

- ✅ Passwords are hashed using bcrypt (10 salt rounds)
- ✅ JWT tokens are signed with a secret key
- ✅ Tokens expire after 7 days (configurable)
- ⚠️ Change default admin password in production
- ⚠️ Use a strong JWT_SECRET in production
- ⚠️ Use HTTPS in production

## Testing with Postman

1. Create a request to `POST /api/auth/login`
2. Set body to JSON with username/password
3. Copy the token from the response
4. For protected endpoints, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

