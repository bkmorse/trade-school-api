import { z } from 'zod';

/**
 * Authentication Schemas
 * Validation schemas for authentication endpoints
 */

// Login request schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required").max(255).trim(),
  password: z.string().min(1, "Password is required")
});

// Login response schema
export const loginResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number().int().positive(),
    username: z.string()
  })
});

// Logout response schema
export const logoutResponseSchema = z.object({
  message: z.string(),
  loggedOut: z.boolean()
});

// User schema (without password)
export const userSchema = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

