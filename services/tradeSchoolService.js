import tradeSchoolRepository from '../repositories/TradeSchoolRepository.js';
import { PaginationService, calculateSkip } from '../utils/pagination.js';

class TradeSchoolService {
  /**
   * Get all trade schools with optional filtering and pagination
   * @param {Object} options - Filter and pagination options
   * @param {string} options.program - Filter by program name
   * @param {string} options.location - Filter by location (case-insensitive)
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Records per page (default: 15)
   * @returns {Promise<Object>} Paginated list of trade schools with metadata
   */
  async getAllSchools({ program, location, page = 1, limit = 15 } = {}) {
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

    // Validate pagination parameters
    const { page: validPage, limit: validLimit } = PaginationService.validatePaginationParams(page, limit);
    
    // Define select fields (using UUID as external ID)
    const select = {
      uuid: true,
      name: true,
      location: true,
      programs: true,
      website: true,
      accredited: true
    };
    
    // Use pagination utility for cleaner code
    return await PaginationService.executePaginatedQuery({
      countQuery: () => tradeSchoolRepository.count({ where }),
      dataQuery: () => tradeSchoolRepository.findMany({
        where,
        select,
        orderBy: { name: 'asc' },
        skip: calculateSkip(validPage, validLimit),
        take: validLimit
      }),
      page: validPage,
      limit: validLimit
    });
  }

  /**
   * Get a single trade school by ID
   * @param {number} id - School ID
   * @returns {Promise<Object|null>} Trade school or null if not found
   */
  async getSchoolById(uuid) {
    return await tradeSchoolRepository.findUniqueByUuid({
      uuid
    });
  }

  /**
   * Get all unique programs across all schools
   * @returns {Promise<Array>} List of unique programs
   */
  async getAllPrograms() {
    return await tradeSchoolRepository.getUniquePrograms();
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
    return await tradeSchoolRepository.create({
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
  async updateSchool(uuid, data) {
    try {
      return await tradeSchoolRepository.updateByUuid({
        uuid,
        data
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
  async deleteSchool(uuid) {
    try {
      await tradeSchoolRepository.deleteByUuid({
        uuid
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

