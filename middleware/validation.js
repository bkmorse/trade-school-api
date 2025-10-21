/**
 * Zod Validation Middleware for Fastify
 * Provides request validation using Zod schemas
 */

/**
 * Creates a Fastify preHandler hook for Zod validation
 * @param {Object} schemas - Object containing Zod schemas for different parts of the request
 * @param {z.ZodSchema} schemas.body - Schema for request body
 * @param {z.ZodSchema} schemas.query - Schema for query parameters
 * @param {z.ZodSchema} schemas.params - Schema for URL parameters
 * @returns {Function} Fastify preHandler hook
 */
export function createZodValidation(schemas = {}) {
  return async function (request, reply) {
    try {
      // Validate request body
      if (schemas.body && request.body !== undefined) {
        request.body = schemas.body.parse(request.body);
      }

      // Validate query parameters
      if (schemas.query && request.query) {
        request.query = schemas.query.parse(request.query);
      }

      // Validate URL parameters
      if (schemas.params && request.params) {
        request.params = schemas.params.parse(request.params);
      }
    } catch (error) {
      // Handle Zod validation errors
      if (error.name === 'ZodError' && error.errors) {
        reply.code(400);
        
        // Group errors by type for better response
        const validationErrors = error.errors.map(err => ({
          field: err.path && err.path.length > 0 ? err.path.join('.') : 'root',
          message: err.message || 'Invalid value',
          code: err.code || 'invalid_type',
          received: err.input
        }));

        // Check if any required fields are missing
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
      
      // Re-throw other errors
      throw error;
    }
  };
}

/**
 * Creates a Fastify serializer for response validation
 * @param {z.ZodSchema} responseSchema - Schema for response validation
 * @returns {Function} Fastify serializer
 */
export function createZodSerializer(responseSchema) {
  return function (payload) {
    try {
      return responseSchema.parse(payload);
    } catch (error) {
      // Log error but don't fail the request
      console.error('Response validation error:', error);
      return payload;
    }
  };
}

/**
 * Convenience function to create validation for common patterns
 * @param {Object} options - Validation options
 * @returns {Object} Fastify route options
 */
export function zodRoute(options = {}) {
  const { body, query, params, response } = options;
  
  const routeOptions = {
    preHandler: []
  };

  // Add validation preHandler if schemas are provided
  if (body || query || params) {
    routeOptions.preHandler.push(createZodValidation({ body, query, params }));
  }

  // Add response serialization if schema is provided
  if (response) {
    routeOptions.serializer = createZodSerializer(response);
  }

  return routeOptions;
}
