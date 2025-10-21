import prisma from '../lib/prisma.js';

/**
 * TradeSchoolRepository
 * Repository pattern for database operations
 * Encapsulates all database queries for trade schools
 */
class TradeSchoolRepository {
  /**
   * Find all trade schools with filtering and pagination
   */
  async findMany({ where, select, orderBy, skip, take }) {
    return await prisma.tradeSchool.findMany({
      where,
      select,
      orderBy,
      skip,
      take
    });
  }

  /**
   * Count trade schools with filtering
   */
  async count({ where }) {
    return await prisma.tradeSchool.count({ where });
  }

  /**
   * Find a single trade school by UUID
   */
  async findUniqueByUuid({ uuid, select }) {
    return await prisma.tradeSchool.findUnique({
      where: { uuid },
      select
    });
  }

  /**
   * Find a single trade school by ID (internal use)
   */
  async findUnique({ where, select }) {
    return await prisma.tradeSchool.findUnique({
      where,
      select
    });
  }

  /**
   * Create a new trade school
   */
  async create({ data, select }) {
    return await prisma.tradeSchool.create({
      data,
      select
    });
  }

  /**
   * Update a trade school by UUID
   */
  async updateByUuid({ uuid, data, select }) {
    return await prisma.tradeSchool.update({
      where: { uuid },
      data,
      select
    });
  }

  /**
   * Update a trade school (internal use)
   */
  async update({ where, data, select }) {
    return await prisma.tradeSchool.update({
      where,
      data,
      select
    });
  }

  /**
   * Delete a trade school by UUID
   */
  async deleteByUuid({ uuid }) {
    return await prisma.tradeSchool.delete({ where: { uuid } });
  }

  /**
   * Delete a trade school (internal use)
   */
  async delete({ where }) {
    return await prisma.tradeSchool.delete({ where });
  }

  /**
   * Get all unique programs across schools
   */
  async getUniquePrograms() {
    const schools = await prisma.tradeSchool.findMany({
      select: { programs: true }
    });
    
    const allPrograms = schools.flatMap(school => school.programs);
    return [...new Set(allPrograms)].sort();
  }
}

export default new TradeSchoolRepository();
