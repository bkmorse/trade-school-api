import 'dotenv/config';
import Fastify from 'fastify';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import prisma from './lib/prisma.js';
import tradeSchoolController from './controllers/tradeSchoolController.js';
import tradeSchoolRoutes from './routes/tradeSchool.routes.js';
import authRoutes from './routes/auth.routes.js';
import { healthCheckResponseSchema } from './schemas/tradeSchool.schema.js';
import { zodRoute } from './middleware/validation.js';

const fastify = Fastify({
  logger: true,
  // Note: With Zod, we don't need AJV configuration since Zod handles validation
  // You can remove the ajv config entirely or keep it for backward compatibility
});

// Register CORS
await fastify.register(cors, {
  origin: true
});

// Register JWT plugin
await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production'
});

// Add Prisma to Fastify instance
fastify.decorate('prisma', prisma);

// Global error handler for Zod validation errors
fastify.setErrorHandler((error, request, reply) => {
  // Handle Zod validation errors
  if (error.name === 'ZodError' && error.errors) {
    reply.code(400);
    
    const validationErrors = error.errors.map(err => ({
      field: err.path && err.path.length > 0 ? err.path.join('.') : 'root',
      message: err.message || 'Invalid value',
      code: err.code || 'invalid_type',
      received: err.input
    }));

    const missingRequiredFields = validationErrors.filter(err => 
      err.code === 'invalid_type' && (err.received === undefined || err.received === null)
    );

    const errorMessage = missingRequiredFields.length > 0 
      ? `Missing required fields: ${missingRequiredFields.map(f => f.field).join(', ')}`
      : 'Invalid request data';

    return {
      statusCode: 400,
      error: 'Validation Error',
      message: errorMessage,
      details: validationErrors
    };
  }

  // Handle serialized Zod errors (when they come as JSON strings)
  if (error.message && error.message.startsWith('[') && error.message.includes('"code":')) {
    try {
      const zodErrors = JSON.parse(error.message);
      if (Array.isArray(zodErrors) && zodErrors.length > 0) {
        reply.code(400);
        
        const validationErrors = zodErrors.map(err => ({
          field: err.path && err.path.length > 0 ? err.path.join('.') : 'root',
          message: err.message || 'Invalid value',
          code: err.code || 'invalid_type'
        }));

        const missingRequiredFields = validationErrors.filter(err => 
          err.code === 'invalid_type'
        );

        const errorMessage = missingRequiredFields.length > 0 
          ? `Missing required fields: ${missingRequiredFields.map(f => f.field).join(', ')}`
          : 'Invalid request data';

        return {
          statusCode: 400,
          error: 'Validation Error',
          message: errorMessage,
          details: validationErrors
        };
      }
    } catch (parseError) {
      // If parsing fails, continue to default error handling
    }
  }

  // Handle other errors
  reply.code(500);
  return {
    statusCode: 500,
    error: 'Internal Server Error',
    message: error.message || 'An unexpected error occurred'
  };
});

// Graceful shutdown
fastify.addHook('onClose', async (instance) => {
  await instance.prisma.$disconnect();
});

// Root endpoint
fastify.get('/', async (request, reply) => {
  return {
    message: 'Trade School API',
    version: '2.0.0',
    database: 'PostgreSQL with Prisma',
    validation: 'Zod',
    endpoints: {
      schools: '/api/schools',
      schoolById: '/api/schools/:id',
      programs: '/api/programs',
      stats: '/api/stats'
    }
  };
});

// API documentation JSON (OpenAPI)
fastify.get('/api/docs.json', async (request, reply) => {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const openapiPath = path.join(__dirname, 'docs', 'openapi.json');
    const json = await fs.promises.readFile(openapiPath, 'utf-8');
    reply.type('application/json').send(json);
  } catch (err) {
    request.log.error(err);
    reply.code(500).send({ statusCode: 500, error: 'Internal Server Error', message: 'Unable to load API docs' });
  }
});

// Human-friendly API docs UI (Redoc)
fastify.get('/api/docs', async (request, reply) => {
  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Trade School API Docs</title>
    <style>
      body { margin: 0; padding: 0; }
      .container { height: 100vh; }
    </style>
  </head>
  <body>
    <redoc spec-url="/api/docs.json" class="container"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
  </html>`;
  reply.type('text/html').send(html);
});

// Health check endpoint with Zod validation
fastify.get('/health', {
  ...zodRoute({
    response: healthCheckResponseSchema
  }),
  handler: tradeSchoolController.healthCheck
});

// Register route modules
fastify.register(authRoutes, { prefix: '/api' });
fastify.register(tradeSchoolRoutes, { prefix: '/api' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API Documentation (Redoc): http://localhost:${port}/api/docs`);
    console.log(`🧾 OpenAPI JSON:              http://localhost:${port}/api/docs.json`);
    console.log(`✅ Using Zod for validation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
