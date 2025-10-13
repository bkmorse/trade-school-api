# Postman Collection Guide

## 📦 Import the Collection

1. Open Postman
2. Click **Import** in the top left
3. Select **File** or drag and drop
4. Choose `Trade-School-API.postman_collection.json`
5. Click **Import**

## 🚀 Quick Start

The collection is organized into folders:

### 📋 Info
- **Get API Info** - Get API metadata and available endpoints
- **Health Check** - Check database connectivity

### 🏫 Schools
- **Get All Schools** - Retrieve all trade schools
- **Get All Schools - Filter by Program** - Filter schools by program (e.g., "Welding")
- **Get All Schools - Filter by Location** - Filter schools by location (e.g., "Virginia")
- **Get All Schools - Multiple Filters** - Combine program and location filters
- **Get School by ID** - Get a specific school
- **Create School** - Add a new trade school (POST)
- **Update School** - Modify an existing school (PUT)
- **Delete School** - Remove a school (DELETE)

### 📚 Programs
- **Get All Programs** - List all unique programs across all schools

### 📊 Statistics
- **Get Statistics** - Get counts of schools, accredited schools, and programs

## ⚙️ Environment Variable

The collection uses a variable for the base URL:

- **Variable**: `baseUrl`
- **Default Value**: `http://localhost:3000`

### To Change the Base URL:

1. Click on the collection name
2. Go to **Variables** tab
3. Update the `baseUrl` value
4. Click **Save**

## 🧪 Testing the Endpoints

### 1. Health Check (First!)
Start with the **Health Check** endpoint to ensure the API is running:
```
GET http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2024-10-09T15:20:00.000Z"
}
```

### 2. Get All Schools
```
GET http://localhost:3000/api/schools
```

Returns all 8 seeded schools.

### 3. Filter Schools
Try the filter examples:
- **By Program**: `?program=Welding`
- **By Location**: `?location=Virginia`
- **Both**: `?program=Automotive&location=Illinois`

### 4. Create a New School
Use the **Create School** request with this body:
```json
{
  "name": "ABC Technical Institute",
  "location": "New York, NY",
  "programs": ["Plumbing", "HVAC", "Electrical"],
  "website": "https://www.abctech.edu",
  "accredited": true
}
```

### 5. Update a School
Use **Update School** to modify school with ID 1:
```json
{
  "location": "Updated Location, NY",
  "programs": ["Plumbing", "HVAC", "Electrical", "Welding"]
}
```

### 6. Get Statistics
```
GET http://localhost:3000/api/stats
```

Shows total schools, accredited schools, and total programs.

## 📝 Request Examples

### Valid Request
All required fields present:
```json
{
  "name": "Tech School",
  "location": "Boston, MA",
  "programs": ["HVAC"],
  "website": "https://techschool.edu"
}
```

### Invalid Request (Missing Field)
Will return 400 error:
```json
{
  "name": "Tech School",
  "location": "Boston, MA"
}
```

Error response:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body must have required property 'programs'"
}
```

### Invalid Request (Wrong Type)
Programs must be an array:
```json
{
  "name": "Tech School",
  "location": "Boston, MA",
  "programs": "HVAC",
  "website": "https://techschool.edu"
}
```

Error response:
```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "body/programs must be array"
}
```

## 🎯 Tips

1. **Start the Server First**: Make sure your API is running on `http://localhost:3000`
2. **Check Health**: Always verify with `/health` endpoint first
3. **IDs Change**: After creating/deleting schools, IDs may change
4. **Validation**: The API uses JSON Schema validation - check error messages for details
5. **Required Fields**: For POST requests: `name`, `location`, `programs`, `website`
6. **Optional Fields**: For POST requests: `accredited` (defaults to `true`)

## 🔄 Common Workflows

### Testing Full CRUD
1. **GET** `/api/schools` - See all schools
2. **POST** `/api/schools` - Create a new school (note the ID in response)
3. **GET** `/api/schools/:id` - Get the school you just created
4. **PUT** `/api/schools/:id` - Update it
5. **DELETE** `/api/schools/:id` - Delete it
6. **GET** `/api/schools` - Verify it's gone

### Testing Filters
1. **GET** `/api/programs` - See all available programs
2. **GET** `/api/schools?program=Welding` - Filter by program
3. **GET** `/api/schools?location=Virginia` - Filter by location
4. **GET** `/api/schools?program=Automotive&location=Illinois` - Combine filters

## 🐛 Troubleshooting

### Connection Refused
- ✅ Make sure the server is running: `npm run dev`
- ✅ Check the port: Default is 3000

### 404 Not Found
- ✅ Verify the endpoint URL
- ✅ Check if the school ID exists

### 400 Bad Request
- ✅ Check the request body matches the schema
- ✅ All required fields must be present
- ✅ `programs` must be an array
- ✅ `website` must be a valid URL starting with http:// or https://

### 503 Service Unavailable (Health Check)
- ✅ Database is not connected
- ✅ Run `docker ps` to check if PostgreSQL is running
- ✅ Run `npm run docker:up` to start the database

## 📚 Additional Resources

- **API Documentation**: See `README.md` for full API details
- **Schema Validation**: Check `schemas/tradeSchool.schema.js` for validation rules
- **Database**: Use `npm run prisma:studio` to view data visually

Happy Testing! 🎉

