import tradeSchoolController from '../controllers/tradeSchoolController.js';
import { zodRoute } from '../middleware/validation.js';
import { requireAuth } from '../middleware/auth.js';
import {
  tradeSchoolSchema,
  createSchoolSchema,
  updateSchoolSchema,
  schoolQuerySchema,
  uuidParamSchema,
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
  // School CRUD routes with Zod validation and authentication
  const schoolsRouteOptions = zodRoute({
    query: schoolQuerySchema,
    response: schoolListResponseSchema
  });

  fastify.get('/schools', {
    ...schoolsRouteOptions,
    preHandler: [requireAuth, ...(schoolsRouteOptions.preHandler || [])],
    handler: tradeSchoolController.getAllSchools
  });

  const getSchoolByIdOptions = zodRoute({
    params: uuidParamSchema,
    response: tradeSchoolSchema
  });

  fastify.get('/schools/:uuid', {
    ...getSchoolByIdOptions,
    preHandler: [requireAuth, ...(getSchoolByIdOptions.preHandler || [])],
    handler: tradeSchoolController.getSchoolById
  });

  const createSchoolOptions = zodRoute({
    body: createSchoolSchema,
    response: tradeSchoolSchema
  });

  fastify.post('/schools', {
    ...createSchoolOptions,
    preHandler: [requireAuth, ...(createSchoolOptions.preHandler || [])],
    handler: tradeSchoolController.createSchool
  });

  const updateSchoolOptions = zodRoute({
    params: uuidParamSchema,
    body: updateSchoolSchema,
    response: tradeSchoolSchema
  });

  fastify.put('/schools/:uuid', {
    ...updateSchoolOptions,
    preHandler: [requireAuth, ...(updateSchoolOptions.preHandler || [])],
    handler: tradeSchoolController.updateSchool
  });

  const deleteSchoolOptions = zodRoute({
    params: uuidParamSchema
  });
  
  fastify.delete('/schools/:uuid', {
    ...deleteSchoolOptions,
    preHandler: [requireAuth, ...(deleteSchoolOptions.preHandler || [])],
    handler: tradeSchoolController.deleteSchool
  });

  // Programs route (protected)
  const programsOptions = zodRoute({
    response: programListResponseSchema
  });
  fastify.get('/programs', {
    ...programsOptions,
    preHandler: [requireAuth, ...(programsOptions.preHandler || [])],
    handler: tradeSchoolController.getAllPrograms
  });

  // Statistics route (protected)
  const statsOptions = zodRoute({
    response: statsResponseSchema
  });
  fastify.get('/stats', {
    ...statsOptions,
    preHandler: [requireAuth, ...(statsOptions.preHandler || [])],
    handler: tradeSchoolController.getStats
  });
}

