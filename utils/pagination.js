/**
 * Pagination Utility
 * Provides reusable pagination logic for all services
 */

/**
 * Calculate pagination metadata
 * @param {number} totalCount - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @returns {Object} Pagination metadata
 */
export function calculatePaginationMetadata(totalCount, page, limit) {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    total: totalCount,
    page,
    limit,
    lastPage: totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1
  };
}

/**
 * Calculate skip value for database queries
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @returns {number} Skip value for database queries
 */
export function calculateSkip(page, limit) {
  return (page - 1) * limit;
}

/**
 * Create paginated response
 * @param {Array} data - Array of records
 * @param {number} totalCount - Total number of records
 * @param {number} page - Current page number
 * @param {number} limit - Records per page
 * @returns {Object} Paginated response with data and metadata
 */
export function createPaginatedResponse(data, totalCount, page, limit) {
  return {
    data,
    meta: calculatePaginationMetadata(totalCount, page, limit)
  };
}

/**
 * Pagination Service Class
 * Provides higher-level pagination methods
 */
export class PaginationService {
  /**
   * Execute paginated query
   * @param {Object} options - Query options
   * @param {Function} options.countQuery - Function to get total count
   * @param {Function} options.dataQuery - Function to get paginated data
   * @param {number} options.page - Page number
   * @param {number} options.limit - Records per page
   * @returns {Promise<Object>} Paginated response
   */
  static async executePaginatedQuery({ countQuery, dataQuery, page, limit }) {
    // Execute count and data queries in parallel for better performance
    const [totalCount, data] = await Promise.all([
      countQuery(),
      dataQuery()
    ]);

    return createPaginatedResponse(data, totalCount, page, limit);
  }

  /**
   * Validate pagination parameters
   * @param {number} page - Page number
   * @param {number} limit - Records per page
   * @param {Object} options - Validation options
   * @param {number} options.maxLimit - Maximum allowed limit
   * @returns {Object} Validated pagination parameters
   */
  static validatePaginationParams(page, limit, options = {}) {
    const { maxLimit = 100 } = options;
    
    // Ensure page is at least 1
    const validPage = Math.max(1, page);
    
    // Ensure limit is within bounds
    const validLimit = Math.min(Math.max(1, limit), maxLimit);
    
    return {
      page: validPage,
      limit: validLimit
    };
  }
}
