import { z } from 'zod';

/**
 * Zod Schemas for Trade School API
 * These schemas provide runtime validation with better error messages
 * and type safety compared to JSON Schema
 */

// Base trade school schema
const tradeSchoolProperties = {
  id: z.number().int().positive("ID must be a positive number").transform(Number),
  uuid: z.string().uuid("Invalid UUID format"),
  name: z.string().min(1).max(255).trim(),
  location: z.string().min(1).max(255).trim(),
  programs: z.array(z.string().min(1)).min(1),
  website: z.string().url().refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    { message: "Website must start with http:// or https://" }
  ),
  accredited: z.boolean().default(true)
};

// Full trade school schema
export const tradeSchoolSchema = z.object(tradeSchoolProperties);

// Create school schema (without id, createdAt, updatedAt)
export const createSchoolSchema = z.object({
  name: z.string().min(1, "Name is required").max(255).trim(),
  location: z.string().min(1, "Location is required").max(255).trim(),
  programs: z.array(z.string().min(1, "Program name cannot be empty")).min(1, "At least one program is required"),
  website: z.string().url("Must be a valid URL").refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    { message: "Website must start with http:// or https://" }
  ),
  accredited: z.boolean().default(true).optional()
});

// Update school schema (all fields optional)
export const updateSchoolSchema = z.object({
  name: z.string().min(1).max(255).trim().optional(),
  location: z.string().min(1).max(255).trim().optional(),
  programs: z.array(z.string().min(1)).min(1).optional(),
  website: z.string().url().refine(
    (url) => url.startsWith('http://') || url.startsWith('https://'),
    { message: "Website must start with http:// or https://" }
  ).optional(),
  accredited: z.boolean().optional()
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

// Query parameters for filtering schools
export const schoolQuerySchema = z.object({
  program: z.string().optional(),
  location: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).optional().default(1),
  limit: z.string().regex(/^\d+$/).transform(Number).optional().default(15)
});

// URL parameters schema
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a number").transform(Number)
});

// URL parameters schema
export const uuidParamSchema = z.object({
  uuid: z.string().uuid("Invalid UUID format")
});

// Response schemas
export const schoolListResponseSchema = z.object({
  data: z.array(tradeSchoolSchema),
  meta: z.object({
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    lastPage: z.number().int().min(0),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean()
  })
});

export const programListResponseSchema = z.object({
  count: z.number().int().min(0),
  programs: z.array(z.string())
});

export const statsResponseSchema = z.object({
  totalSchools: z.number().int().min(0),
  accreditedSchools: z.number().int().min(0),
  totalPrograms: z.number().int().min(0)
});

export const healthCheckResponseSchema = z.object({
  status: z.enum(['healthy', 'unhealthy']),
  database: z.enum(['connected', 'disconnected']),
  timestamp: z.string().datetime()
});

// Error response schema
export const errorResponseSchema = z.object({
  statusCode: z.number().int(),
  error: z.string(),
  message: z.string()
});

// Legacy exports for backward compatibility (if needed)
export const getAllSchoolsSchema = schoolQuerySchema;
export const getSchoolByIdSchema = uuidParamSchema;
export const deleteSchoolSchema = uuidParamSchema;
export const getAllProgramsSchema = z.object({});
export const getStatsSchema = z.object({});
export const healthCheckSchema = z.object({});

