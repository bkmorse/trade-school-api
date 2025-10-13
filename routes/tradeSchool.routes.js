import tradeSchoolController from '../controllers/tradeSchoolController.js';
import {
  createSchoolSchema,
  updateSchoolSchema,
  getAllSchoolsSchema,
  getSchoolByIdSchema,
  deleteSchoolSchema,
  getAllProgramsSchema,
  getStatsSchema
} from '../schemas/tradeSchool.schema.js';

/**
 * Trade School Routes Plugin
 * Encapsulates all routes related to trade schools
 * 
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
export default async function tradeSchoolRoutes(fastify, options) {
  // School CRUD routes
  fastify.get('/schools', {
    schema: getAllSchoolsSchema,
    handler: tradeSchoolController.getAllSchools
  });

  fastify.get('/schools/:id', {
    schema: getSchoolByIdSchema,
    handler: tradeSchoolController.getSchoolById
  });

  fastify.post('/schools', {
    schema: createSchoolSchema,
    handler: tradeSchoolController.createSchool
  });

  fastify.put('/schools/:id', {
    schema: updateSchoolSchema,
    handler: tradeSchoolController.updateSchool
  });

  fastify.delete('/schools/:id', {
    schema: deleteSchoolSchema,
    handler: tradeSchoolController.deleteSchool
  });

  // Programs route
  fastify.get('/programs', {
    schema: getAllProgramsSchema,
    handler: tradeSchoolController.getAllPrograms
  });

  // Statistics route
  fastify.get('/stats', {
    schema: getStatsSchema,
    handler: tradeSchoolController.getStats
  });
}

