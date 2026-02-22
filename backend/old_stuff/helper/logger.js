/**
 * Logging Service
 * Centralized logging for the AI Nurse application
 * Provides structured logging with different levels and context
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logLevels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
    };

    this.currentLevel = this.logLevels.INFO;
    this.logToFile = process.env.LOG_TO_FILE === 'true';
    this.logFilePath = path.join(__dirname, '../logs', 'app.log');

    // Create logs directory if it doesn't exist
    if (this.logToFile) {
      const logDir = path.dirname(this.logFilePath);
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
      }
    }
  }

  /**
   * Set log level
   * @param {String} level - ERROR, WARN, INFO, or DEBUG
   */
  setLevel(level) {
    if (this.logLevels[level] !== undefined) {
      this.currentLevel = this.logLevels[level];
    }
  }

  /**
   * Format log message
   * @private
   */
  _formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString();
    const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';

    return {
      timestamp,
      level,
      message,
      context,
      formatted: `[${timestamp}] [${level}] ${message} ${contextStr}`,
    };
  }

  /**
   * Write log to file
   * @private
   */
  _writeToFile(formattedLog) {
    if (this.logToFile) {
      try {
        fs.appendFileSync(this.logFilePath, formattedLog.formatted + '\n');
      } catch (error) {
        console.error('Failed to write to log file:', error);
      }
    }
  }

  /**
   * Log error message
   */
  error(message, context = {}) {
    if (this.currentLevel >= this.logLevels.ERROR) {
      const log = this._formatMessage('ERROR', message, context);
      console.error(log.formatted);
      this._writeToFile(log);
      return log;
    }
  }

  /**
   * Log warning message
   */
  warn(message, context = {}) {
    if (this.currentLevel >= this.logLevels.WARN) {
      const log = this._formatMessage('WARN', message, context);
      console.warn(log.formatted);
      this._writeToFile(log);
      return log;
    }
  }

  /**
   * Log info message
   */
  info(message, context = {}) {
    if (this.currentLevel >= this.logLevels.INFO) {
      const log = this._formatMessage('INFO', message, context);
      console.log(log.formatted);
      this._writeToFile(log);
      return log;
    }
  }

  /**
   * Log debug message
   */
  debug(message, context = {}) {
    if (this.currentLevel >= this.logLevels.DEBUG) {
      const log = this._formatMessage('DEBUG', message, context);
      console.log(log.formatted);
      this._writeToFile(log);
      return log;
    }
  }

  /**
   * Log data ingestion activity
   */
  ingestion(action, details = {}) {
    return this.info(`[Data Ingestion] ${action}`, details);
  }

  /**
   * Log API request
   */
  apiRequest(method, path, details = {}) {
    return this.info(`[API] ${method} ${path}`, details);
  }

  /**
   * Log API response
   */
  apiResponse(method, path, statusCode, details = {}) {
    const logFn = statusCode >= 400 ? this.error.bind(this) : this.info.bind(this);
    return logFn(`[API] ${method} ${path} - ${statusCode}`, details);
  }
}

module.exports = new Logger();
