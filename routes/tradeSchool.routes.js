import tradeSchoolController from '../controllers/tradeSchoolController.js';
import { zodRoute } from '../middleware/validation.js';
import {
  tradeSchoolSchema,
  createSchoolSchema,
  updateSchoolSchema,
  schoolQuerySchema,
  idParamSchema,
  schoolListResponseSchema,
  programListResponseSchema,
  statsResponseSchema
} from '../schemas/tradeSchool.schema.js';

/**
 * Trade School Routes Plugin
 * Encapsulates all routes related to trade schools
 * 
 * @param {FastifyInstance} fastify - Fastify instance
 * @param {Object} options - Plugin options
 */
export default async function tradeSchoolRoutes(fastify, options) {
  // School CRUD routes with Zod validation
  fastify.get('/schools', {
    ...zodRoute({
      query: schoolQuerySchema,
      response: schoolListResponseSchema
    }),
    handler: tradeSchoolController.getAllSchools
  });

  fastify.get('/schools/:id', {
    ...zodRoute({
      params: idParamSchema,
      response: tradeSchoolSchema
    }),
    handler: tradeSchoolController.getSchoolById
  });

  fastify.post('/schools', {
    ...zodRoute({
      body: createSchoolSchema,
      response: tradeSchoolSchema
    }),
    handler: tradeSchoolController.createSchool
  });

  fastify.put('/schools/:id', {
    ...zodRoute({
      params: idParamSchema,
      body: updateSchoolSchema,
      response: tradeSchoolSchema
    }),
    handler: tradeSchoolController.updateSchool
  });

  fastify.delete('/schools/:id', {
    ...zodRoute({
      params: idParamSchema
    }),
    handler: tradeSchoolController.deleteSchool
  });

  // Programs route
  fastify.get('/programs', {
    ...zodRoute({
      response: programListResponseSchema
    }),
    handler: tradeSchoolController.getAllPrograms
  });

  // Statistics route
  fastify.get('/stats', {
    ...zodRoute({
      response: statsResponseSchema
    }),
    handler: tradeSchoolController.getStats
  });
}

