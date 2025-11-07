import bcrypt from 'bcrypt';
import prisma from '../lib/prisma.js';

class AuthService {
  /**
   * Authenticate user with username and password
   * @param {FastifyInstance} fastify - Fastify instance (for JWT access)
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @returns {Promise<Object|null>} User object with token or null if invalid
   */
  async login(fastify, username, password) {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return null;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    // Generate JWT token using @fastify/jwt
    let token;
    try {
      token = this.generateToken(fastify, user.id, user.username);
    } catch (error) {
      // Log the error for debugging
      console.error('Error generating token:', error);
      throw error;
    }

    // Return user data (without password) and token
    return {
      token,
      user: {
        id: user.id,
        username: user.username
      }
    };
  }

  /**
   * Generate JWT token using @fastify/jwt
   * @param {FastifyInstance} fastify - Fastify instance with JWT plugin
   * @param {number} userId - User ID
   * @param {string} username - Username
   * @returns {string} JWT token
   */
  generateToken(fastify, userId, username) {
    try {
      const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

      // @fastify/jwt v8 sign method signature
      // Check if jwt plugin is available
      if (!fastify || !fastify.jwt || typeof fastify.jwt.sign !== 'function') {
        throw new Error('JWT plugin not properly registered or sign method not available');
      }

      // In @fastify/jwt v8, sign takes (payload, options) or just (payload)
      return fastify.jwt.sign(
        { userId, username },
        { expiresIn }
      );
    } catch (error) {
      throw new Error(`Failed to generate JWT token: ${error.message}`);
    }
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  async hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Create a new user (for registration/seeding)
   * @param {string} username - Username
   * @param {string} password - Plain text password
   * @returns {Promise<Object>} Created user (without password)
   */
  async createUser(username, password) {
    const hashedPassword = await this.hashPassword(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }
}

export default new AuthService();

