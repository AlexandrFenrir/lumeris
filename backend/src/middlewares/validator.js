/**
 * Validation middleware for request validation
 * Provides a reusable validation layer with detailed error responses
 */

/**
 * Validates request body against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      // Format validation errors for better readability
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid request data',
        validationErrors: errors,
        timestamp: new Date().toISOString()
      });
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

/**
 * Validates request parameters against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid request parameters',
        validationErrors: errors,
        timestamp: new Date().toISOString()
      });
    }

    req.params = value;
    next();
  };
};

/**
 * Validates request query against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      stripUnknown: true,
      abortEarly: false
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        type: detail.type
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Invalid query parameters',
        validationErrors: errors,
        timestamp: new Date().toISOString()
      });
    }

    req.query = value;
    next();
  };
};

module.exports = {
  validate,
  validateParams,
  validateQuery
};
