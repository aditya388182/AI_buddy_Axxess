/**
 * Simple Logger Utility
 */

class Logger {
  constructor() {
    this.level = 'INFO';
  }

  setLevel(level) {
    this.level = level;
  }

  info(message, data = {}) {
    console.log(`[INFO] ${message}`, data);
  }

  debug(message, data = {}) {
    if (this.level === 'DEBUG') {
      console.log(`[DEBUG] ${message}`, data);
    }
  }

  warn(message, data = {}) {
    console.warn(`[WARN] ${message}`, data);
  }

  error(message, data = {}) {
    console.error(`[ERROR] ${message}`, data);
  }

  apiRequest(method, path, data = {}) {
    this.info(`${method} ${path}`, data);
  }
}

module.exports = new Logger();
