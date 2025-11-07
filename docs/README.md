# OpenAPI Documentation Structure

This directory contains the modular OpenAPI specification files for the Trade School API.

## Structure

```
docs/
├── base.json                    # Base OpenAPI config (info, servers, tags)
├── build.js                     # Build script to combine modules
├── openapi.json                 # Generated combined spec (auto-generated)
├── paths/                       # Path definitions by controller
│   ├── health.json
│   ├── trade-schools.json
│   ├── programs.json
│   └── stats.json
└── schemas/                     # Schema definitions by domain
    ├── common.json              # Shared schemas (Error, HealthCheck, etc.)
    └── trade-schools.json       # Trade school specific schemas
```

## How It Works

1. **Modular Files**: Each controller has its own path file in `paths/`, and schemas are organized by domain in `schemas/`
2. **Build Script**: Run `npm run docs:build` to combine all modules into a single `openapi.json`
3. **Server**: The server serves the combined `openapi.json` file at `/api/docs.json`

## Adding a New Controller

When you add a new controller (e.g., `StudentsController`):

1. **Create path file**: `docs/paths/students.json`
   ```json
   {
     "/api/students": {
       "get": {
         "tags": ["Students"],
         "summary": "List students",
         ...
       }
     }
   }
   ```

2. **Create schema file** (if needed): `docs/schemas/students.json`
   ```json
   {
     "Student": {
       "type": "object",
       "properties": { ... }
     }
   }
   ```

3. **Add tag to base.json**: Add the tag definition to the `tags` array in `base.json`
   ```json
   {
     "name": "Students",
     "description": "Student-related endpoints"
   }
   ```

4. **Build**: Run `npm run docs:build` to regenerate `openapi.json`

## Benefits

- ✅ **Organized by Controller**: Easy to find and maintain endpoint definitions
- ✅ **Scalable**: Add new controllers without touching existing files
- ✅ **Team-Friendly**: Multiple developers can work on different controllers simultaneously
- ✅ **Clear Structure**: Schemas grouped by domain, paths by controller

## Generated File

The `openapi.json` file is auto-generated and should not be edited directly. Always edit the modular files in `paths/` and `schemas/`, then rebuild.

