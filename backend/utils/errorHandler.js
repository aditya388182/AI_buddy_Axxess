/**
 * Simple Error Handler Utility
 */

class ErrorHandler {
  static handle(error, context = '') {
    return {
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      context: context,
    };
  }

  static notFound() {
    return (req, res) => {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.path}`,
      });
    };
  }

  static middleware() {
    return (err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    };
  }
}

module.exports = ErrorHandler;
