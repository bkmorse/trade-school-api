import prisma from '../lib/prisma.js';

class TradeSchoolService {
  /**
   * Get all trade schools with optional filtering
   * @param {Object} filters - Filter options
   * @param {string} filters.program - Filter by program name
   * @param {string} filters.location - Filter by location (case-insensitive)
   * @returns {Promise<Array>} List of trade schools
   */
  async getAllSchools({ program, location } = {}) {
    const where = {};
    
    if (program) {
      where.programs = {
        has: program
      };
    }
    
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }
    
    return await prisma.tradeSchool.findMany({
      where,
      orderBy: {
        name: 'asc'
      }
    });
  }

  /**
   * Get a single trade school by ID
   * @param {number} id - School ID
   * @returns {Promise<Object|null>} Trade school or null if not found
   */
  async getSchoolById(id) {
    return await prisma.tradeSchool.findUnique({
      where: {
        id: parseInt(id)
      }
    });
  }

  /**
   * Get all unique programs across all schools
   * @returns {Promise<Array>} List of unique programs
   */
  async getAllPrograms() {
    const schools = await prisma.tradeSchool.findMany({
      select: {
        programs: true
      }
    });
    
    const allPrograms = schools.flatMap(school => school.programs);
    const uniquePrograms = [...new Set(allPrograms)].sort();
    
    return uniquePrograms;
  }

  /**
   * Create a new trade school
   * @param {Object} data - School data
   * @param {string} data.name - School name
   * @param {string} data.location - School location
   * @param {Array<string>} data.programs - Programs offered
   * @param {string} data.website - School website
   * @param {boolean} data.accredited - Accreditation status
   * @returns {Promise<Object>} Created school
   */
  async createSchool({ name, location, programs, website, accredited = true }) {
    return await prisma.tradeSchool.create({
      data: {
        name,
        location,
        programs,
        website,
        accredited
      }
    });
  }

  /**
   * Update a trade school
   * @param {number} id - School ID
   * @param {Object} data - Data to update
   * @returns {Promise<Object|null>} Updated school or null if not found
   */
  async updateSchool(id, data) {
    try {
      const updateData = {};
      
      if (data.name) updateData.name = data.name;
      if (data.location) updateData.location = data.location;
      if (data.programs) updateData.programs = data.programs;
      if (data.website) updateData.website = data.website;
      if (data.accredited !== undefined) updateData.accredited = data.accredited;
      
      return await prisma.tradeSchool.update({
        where: {
          id: parseInt(id)
        },
        data: updateData
      });
    } catch (error) {
      if (error.code === 'P2025') {
        // Record not found
        return null;
      }
      throw error;
    }
  }

  /**
   * Delete a trade school
   * @param {number} id - School ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteSchool(id) {
    try {
      await prisma.tradeSchool.delete({
        where: {
          id: parseInt(id)
        }
      });
      return true;
    } catch (error) {
      if (error.code === 'P2025') {
        // Record not found
        return false;
      }
      throw error;
    }
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStats() {
    const totalSchools = await prisma.tradeSchool.count();
    const accreditedSchools = await prisma.tradeSchool.count({
      where: { accredited: true }
    });
    
    const schools = await prisma.tradeSchool.findMany({
      select: { programs: true }
    });
    
    const allPrograms = schools.flatMap(school => school.programs);
    const uniquePrograms = [...new Set(allPrograms)];
    
    return {
      totalSchools,
      accreditedSchools,
      totalPrograms: uniquePrograms.length
    };
  }

  /**
   * Check database connectivity
   * @returns {Promise<boolean>} True if connected
   */
  async healthCheck() {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default new TradeSchoolService();

