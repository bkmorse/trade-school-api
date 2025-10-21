import studentRepository from '../repositories/StudentRepository.js';
import { PaginationService, calculateSkip } from '../utils/pagination.js';

/**
 * StudentService Example
 * Demonstrates how to use the pagination utility across different services
 */
class StudentService {
  /**
   * Get all students with optional filtering and pagination
   * @param {Object} options - Filter and pagination options
   * @param {string} options.enrolledProgram - Filter by program
   * @param {string} options.status - Filter by enrollment status
   * @param {number} options.page - Page number (default: 1)
   * @param {number} options.limit - Records per page (default: 15)
   * @returns {Promise<Object>} Paginated list of students with metadata
   */
  async getAllStudents({ enrolledProgram, status, page = 1, limit = 15 } = {}) {
    const where = {};
    
    if (enrolledProgram) {
      where.enrolledProgram = {
        contains: enrolledProgram,
        mode: 'insensitive'
      };
    }
    
    if (status) {
      where.status = status;
    }

    // Validate pagination parameters
    const { page: validPage, limit: validLimit } = PaginationService.validatePaginationParams(page, limit);
    
    // Define select fields
    const select = {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      enrolledProgram: true,
      status: true,
      enrollmentDate: true
    };
    
    // Use pagination utility - same pattern as trade schools!
    return await PaginationService.executePaginatedQuery({
      countQuery: () => studentRepository.count({ where }),
      dataQuery: () => studentRepository.findMany({
        where,
        select,
        orderBy: { lastName: 'asc', firstName: 'asc' },
        skip: calculateSkip(validPage, validLimit),
        take: validLimit
      }),
      page: validPage,
      limit: validLimit
    });
  }

  /**
   * Get students by school with pagination
   * @param {string} schoolUuid - School UUID
   * @param {Object} options - Pagination options
   * @returns {Promise<Object>} Paginated list of students
   */
  async getStudentsBySchool(schoolUuid, { page = 1, limit = 15 } = {}) {
    // Validate pagination parameters
    const { page: validPage, limit: validLimit } = PaginationService.validatePaginationParams(page, limit);
    
    const select = {
      uuid: true,
      firstName: true,
      lastName: true,
      email: true,
      enrolledProgram: true,
      status: true
    };
    
    return await PaginationService.executePaginatedQuery({
      countQuery: () => studentRepository.countBySchool({ schoolUuid }),
      dataQuery: () => studentRepository.findBySchool({
        schoolUuid,
        select,
        orderBy: { lastName: 'asc' },
        skip: calculateSkip(validPage, validLimit),
        take: validLimit
      }),
      page: validPage,
      limit: validLimit
    });
  }
}

export default new StudentService();
