/**
 * Authentication Middleware using @fastify/jwt
 * Verifies JWT token and attaches user to request
 * 
 * Uses the secure request.jwtVerify() method from @fastify/jwt
 * 
 * Usage:
 * ```javascript
 * fastify.get('/protected', {
 *   preHandler: [requireAuth],
 *   handler: controller.method
 * });
 * ```
 */
export async function requireAuth(request, reply) {
  try {
    // Verify JWT token using @fastify/jwt's built-in method
    // This handles token extraction from Authorization header automatically
    // and includes security best practices
    await request.jwtVerify();
    
    // Token is valid, attach user info from decoded token to request
    // The decoded token is available at request.user (set by @fastify/jwt)
    // but we'll maintain our structure for consistency
    const decoded = request.user; // @fastify/jwt sets this automatically
    
    // Attach user info to request for use in controllers (using our structure)
    request.user = {
      id: decoded.userId,
      username: decoded.username
    };

    // Continue to next handler
    return;
  } catch (error) {
    // @fastify/jwt throws errors for invalid/expired tokens
    request.log.error(error);
    reply.code(401);
    return reply.send({
      statusCode: 401,
      error: 'Unauthorized',
      message: error.message === 'No Authorization was found in request.cookies' || 
               error.message === 'Authorization token is invalid' || 
               error.message === 'Authorization token expired'
        ? 'Invalid or expired token. Please login again.'
        : 'Authentication token required. Please login first.'
    });
  }
}

