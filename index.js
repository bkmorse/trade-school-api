import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import prisma from './lib/prisma.js';
import tradeSchoolController from './controllers/tradeSchoolController.js';
import tradeSchoolRoutes from './routes/tradeSchool.routes.js';
import { healthCheckSchema } from './schemas/tradeSchool.schema.js';

const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: {
      removeAdditional: 'all',  // Remove additional properties not in schema
      coerceTypes: true,        // Convert types when possible (e.g., string "1" to number 1)
      useDefaults: true         // Apply default values from schema
    }
  }
});

// Register CORS
await fastify.register(cors, {
  origin: true
});

// Add Prisma to Fastify instance
fastify.decorate('prisma', prisma);

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
    endpoints: {
      schools: '/api/schools',
      schoolById: '/api/schools/:id',
      programs: '/api/programs',
      stats: '/api/stats'
    }
  };
});

// Health check endpoint
fastify.get('/health', {
  schema: healthCheckSchema,
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
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
