/**
 * JSON Schemas for Trade School API
 * These schemas are used for request validation and response serialization
 * Fastify uses these to validate incoming requests and serialize responses
 */

// Reusable schema definitions
const tradeSchoolProperties = {
  id: { type: 'integer' },
  name: { type: 'string', minLength: 1, maxLength: 255 },
  location: { type: 'string', minLength: 1, maxLength: 255 },
  programs: {
    type: 'array',
    items: { type: 'string' },
    minItems: 1
  },
  website: {
    type: 'string',
    format: 'uri',
    pattern: '^https?://'
  },
  accredited: { type: 'boolean' },
  createdAt: { type: 'string', format: 'date-time' },
  updatedAt: { type: 'string', format: 'date-time' }
};

// Full trade school object
const tradeSchool = {
  type: 'object',
  properties: tradeSchoolProperties
};

// Create school schema
export const createSchoolSchema = {
  description: 'Create a new trade school',
  tags: ['schools'],
  body: {
    type: 'object',
    required: ['name', 'location', 'programs', 'website'],
    properties: {
      name: tradeSchoolProperties.name,
      location: tradeSchoolProperties.location,
      programs: tradeSchoolProperties.programs,
      website: tradeSchoolProperties.website,
      accredited: tradeSchoolProperties.accredited
    },
    additionalProperties: false
  },
  response: {
    201: tradeSchool,
    400: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
};

// Update school schema
export const updateSchoolSchema = {
  description: 'Update a trade school',
  tags: ['schools'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    },
    required: ['id']
  },
  body: {
    type: 'object',
    properties: {
      name: tradeSchoolProperties.name,
      location: tradeSchoolProperties.location,
      programs: tradeSchoolProperties.programs,
      website: tradeSchoolProperties.website,
      accredited: tradeSchoolProperties.accredited
    },
    additionalProperties: false,
    minProperties: 1  // At least one field must be provided
  },
  response: {
    200: tradeSchool,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

// Get all schools schema
export const getAllSchoolsSchema = {
  description: 'Get all trade schools with optional filtering',
  tags: ['schools'],
  querystring: {
    type: 'object',
    properties: {
      program: { type: 'string' },
      location: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'integer' },
        schools: {
          type: 'array',
          items: tradeSchool
        }
      }
    }
  }
};

// Get school by ID schema
export const getSchoolByIdSchema = {
  description: 'Get a single trade school by ID',
  tags: ['schools'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    },
    required: ['id']
  },
  response: {
    200: tradeSchool,
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

// Delete school schema
export const deleteSchoolSchema = {
  description: 'Delete a trade school',
  tags: ['schools'],
  params: {
    type: 'object',
    properties: {
      id: { type: 'integer' }
    },
    required: ['id']
  },
  response: {
    204: {
      type: 'null',
      description: 'No content'
    },
    404: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
};

// Get all programs schema
export const getAllProgramsSchema = {
  description: 'Get all unique programs',
  tags: ['programs'],
  response: {
    200: {
      type: 'object',
      properties: {
        count: { type: 'integer' },
        programs: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    }
  }
};

// Get stats schema
export const getStatsSchema = {
  description: 'Get statistics about trade schools',
  tags: ['stats'],
  response: {
    200: {
      type: 'object',
      properties: {
        totalSchools: { type: 'integer' },
        accreditedSchools: { type: 'integer' },
        totalPrograms: { type: 'integer' }
      }
    }
  }
};

// Health check schema
export const healthCheckSchema = {
  description: 'Check API and database health',
  tags: ['health'],
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        database: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    },
    503: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        database: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  }
};

