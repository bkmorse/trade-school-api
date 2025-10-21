import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import prisma from './lib/prisma.js';
import tradeSchoolController from './controllers/tradeSchoolController.js';
import tradeSchoolRoutes from './routes/tradeSchool.routes.js';
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

// Health check endpoint with Zod validation
fastify.get('/health', {
  ...zodRoute({
    response: healthCheckResponseSchema
  }),
  handler: tradeSchoolController.healthCheck
});

// Register route modules with /api prefix
fastify.register(tradeSchoolRoutes, { prefix: '/api' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT) || 3000;
    const host = process.env.HOST || '0.0.0.0';
    
    await fastify.listen({ port, host });
    console.log(`🚀 Server is running on http://localhost:${port}`);
    console.log(`📚 API Documentation available at http://localhost:${port}/documentation (if @fastify/swagger is installed)`);
    console.log(`✅ Using Zod for validation`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
