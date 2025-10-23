/**
 * Timeout Middleware
 * Protects against long-running requests that could hang indefinitely
 * Automatically terminates requests that exceed the specified timeout
 */

const { TIMEOUTS } = require('../config/constants');

/**
 * Create a timeout middleware with specified timeout duration
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Function} Express middleware function
 */
const timeout = (timeoutMs = TIMEOUTS.DEFAULT_REQUEST) => {
  return (req, res, next) => {
    // Set timeout on the request
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        // Request timed out
        res.status(408).json({
          success: false,
          error: 'Request Timeout',
          message: `Request took longer than ${timeoutMs}ms to complete`,
          timestamp: new Date().toISOString()
        });
      }
    }, timeoutMs);

    // Clear timeout when response finishes
    res.on('finish', () => {
      clearTimeout(timer);
    });

    // Clear timeout on response close (client disconnect)
    res.on('close', () => {
      clearTimeout(timer);
    });

    next();
  };
};

/**
 * Predefined timeout middlewares for common use cases
 */
const timeouts = {
  // Default timeout for most requests (10 seconds)
  default: timeout(TIMEOUTS.DEFAULT_REQUEST),

  // Dashboard queries timeout (5 seconds)
  dashboard: timeout(TIMEOUTS.DASHBOARD_QUERY),

  // Heavy queries timeout (15 seconds)
  heavy: timeout(TIMEOUTS.HEAVY_QUERY),

  // External API calls timeout (8 seconds)
  externalAPI: timeout(TIMEOUTS.EXTERNAL_API)
};

module.exports = {
  timeout,
  timeouts
};
