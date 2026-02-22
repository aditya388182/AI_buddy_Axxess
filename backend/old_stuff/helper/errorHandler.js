/**
 * Error Handler Middleware
 * Centralized error handling for Express application
 */

const logger = require('./logger');

class ErrorHandler {
  /**
   * Handle async errors in route handlers
   * Wraps async functions to catch errors and pass to next()
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Custom API Error class
   */
  static ApiError = class ApiError extends Error {
    constructor(message, statusCode = 500, details = {}) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      this.isOperational = true;
      Error.captureStackTrace(this, this.constructor);
    }
  };

  /**
   * Error middleware for Express
   */
  static middleware() {
    return (err, req, res, next) => {
      // Log the error
      logger.error('Error caught by middleware', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        statusCode: err.statusCode || 500,
      });

      // Determine status code
      const statusCode = err.statusCode || 500;

      // Prepare error response
      const errorResponse = {
        success: false,
        error: err.message || 'Internal Server Error',
      };

      // Add details in development mode
      if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.details = err.details;
      }

      // Send response
      res.status(statusCode).json(errorResponse);
    };
  }

  /**
   * 404 Not Found handler
   */
  static notFound() {
    return (req, res, next) => {
      const error = new ErrorHandler.ApiError(
        `Route not found: ${req.method} ${req.path}`,
        404
      );
      next(error);
    };
  }

  /**
   * Validation error handler
   */
  static validationError(message, fields = {}) {
    return new ErrorHandler.ApiError(message, 400, { fields });
  }

  /**
   * Authentication error handler
   */
  static authenticationError(message = 'Authentication required') {
    return new ErrorHandler.ApiError(message, 401);
  }

  /**
   * Authorization error handler
   */
  static authorizationError(message = 'Insufficient permissions') {
    return new ErrorHandler.ApiError(message, 403);
  }

  /**
   * Resource not found error handler
   */
  static notFoundError(resource = 'Resource') {
    return new ErrorHandler.ApiError(`${resource} not found`, 404);
  }

  /**
   * Database error handler
   */
  static databaseError(message = 'Database operation failed') {
    return new ErrorHandler.ApiError(message, 500);
  }

  /**
   * External API error handler
   */
  static externalApiError(service, message = 'External API call failed') {
    return new ErrorHandler.ApiError(`${service}: ${message}`, 502);
  }
}

module.exports = ErrorHandler;
