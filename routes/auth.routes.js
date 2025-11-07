import authController from '../controllers/authController.js';
import { zodRoute } from '../middleware/validation.js';
import { loginSchema, loginResponseSchema, logoutResponseSchema } from '../schemas/auth.schema.js';

/**
 * Auth Routes Plugin
 * Handles authentication endpoints
 * 
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
export default async function authRoutes(fastify, options) {
  // Login endpoint (public, no auth required)
  fastify.post('/auth/login', {
    ...zodRoute({
      body: loginSchema,
      response: loginResponseSchema
    }),
    handler: authController.login
  });

  // Logout endpoint (public, no auth required - optionally validates token if provided)
  fastify.post('/auth/logout', {
    ...zodRoute({
      response: logoutResponseSchema
    }),
    handler: authController.logout
  });
}

