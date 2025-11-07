import authService from '../services/authService.js';

/**
 * AuthController
 * Handles HTTP request/response logic for authentication endpoints
 */
class AuthController {
  /**
   * Login endpoint
   */
  async login(request, reply) {
    try {
      const { username, password } = request.body;

      // Pass fastify instance to access JWT plugin
      // In Fastify, request.server is the Fastify instance
      // Alternative: request.server or request.routeOptions.server or just the fastify instance from context
      const fastifyInstance = request.server || request.routeOptions?.server;
      
      // Verify JWT plugin is available
      if (!fastifyInstance) {
        throw new Error('Fastify instance not available on request');
      }
      
      if (!fastifyInstance.jwt) {
        throw new Error('JWT plugin not registered - fastify.jwt is undefined');
      }
      
      if (typeof fastifyInstance.jwt.sign !== 'function') {
        throw new Error('JWT sign method not available');
      }

      const result = await authService.login(fastifyInstance, username, password);

      if (!result) {
        reply.code(401);
        return {
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Invalid username or password'
        };
      }

      reply.code(200);
      return result;
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message || 'An error occurred during login',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      };
    }
  }

  /**
   * Logout endpoint
   */
  async logout(request, reply) {
    try {
      // Check if token was provided (optional)
      const authHeader = request.headers.authorization;
      let tokenValid = false;
      let userInfo = null;

      if (authHeader) {
        try {
          // Try to verify token if provided
          await request.jwtVerify();
          tokenValid = true;
          userInfo = request.user;
        } catch (error) {
          // Token invalid or expired - that's fine for logout
          tokenValid = false;
        }
      }

      reply.code(200);
      return {
        message: tokenValid 
          ? `Logged out successfully. User: ${userInfo?.username || 'unknown'}`
          : 'Logout successful. Token was not provided or already invalid.',
        loggedOut: true
      };
    } catch (error) {
      request.log.error(error);
      reply.code(500);
      return {
        statusCode: 500,
        error: 'Internal Server Error',
        message: error.message || 'An error occurred during logout'
      };
    }
  }
}

export default new AuthController();

