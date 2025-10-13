import tradeSchoolService from '../services/tradeSchoolService.js';

/**
 * TradeSchoolController
 * Handles HTTP request/response logic for trade school endpoints
 * Delegates business logic to the service layer
 */
class TradeSchoolController {
  /**
   * Get all trade schools with optional filtering
   */
  async getAllSchools(request, reply) {
    const { program, location } = request.query;
    
    const schools = await tradeSchoolService.getAllSchools({ program, location });
    
    return {
      count: schools.length,
      schools
    };
  }

  /**
   * Get a single trade school by ID
   */
  async getSchoolById(request, reply) {
    const { id } = request.params;
    
    const school = await tradeSchoolService.getSchoolById(id);
    
    if (!school) {
      reply.code(404);
      return { error: 'School not found' };
    }
    
    return school;
  }

  /**
   * Get all unique programs
   */
  async getAllPrograms(request, reply) {
    const programs = await tradeSchoolService.getAllPrograms();
    
    return {
      count: programs.length,
      programs
    };
  }

  /**
   * Create a new trade school
   */
  async createSchool(request, reply) {
    // Validation is handled automatically by schema
    const { name, location, programs, website, accredited } = request.body;
    
    const school = await tradeSchoolService.createSchool({
      name,
      location,
      programs,
      website,
      accredited
    });
    
    reply.code(201);
    return school;
  }

  /**
   * Update an existing trade school
   */
  async updateSchool(request, reply) {
    // Validation is handled automatically by schema
    const { id } = request.params;
    const updateData = request.body;
    
    const school = await tradeSchoolService.updateSchool(id, updateData);
    
    if (!school) {
      reply.code(404);
      return { error: 'School not found' };
    }
    
    return school;
  }

  /**
   * Delete a trade school
   */
  async deleteSchool(request, reply) {
    const { id } = request.params;
    
    const deleted = await tradeSchoolService.deleteSchool(id);
    
    if (!deleted) {
      reply.code(404);
      return { error: 'School not found' };
    }
    
    reply.code(204);
    return;
  }

  /**
   * Get statistics about trade schools
   */
  async getStats(request, reply) {
    const stats = await tradeSchoolService.getStats();
    return stats;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(request, reply) {
    const isHealthy = await tradeSchoolService.healthCheck();
    
    if (!isHealthy) {
      reply.code(503);
      return {
        status: 'unhealthy',
        database: 'disconnected',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  }
}

export default new TradeSchoolController();

