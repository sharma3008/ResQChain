const { validationResult } = require('express-validator');

// Middleware to validate and sanitize inputs
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Sanitize query parameters to prevent injection
const sanitizeQuery = (req, res, next) => {
  // Convert query parameters to appropriate types and validate ranges
  if (req.query.latitude) {
    req.query.latitude = parseFloat(req.query.latitude);
    if (isNaN(req.query.latitude) || req.query.latitude < -90 || req.query.latitude > 90) {
      return res.status(400).json({
        success: false,
        error: 'Invalid latitude value'
      });
    }
  }

  if (req.query.longitude) {
    req.query.longitude = parseFloat(req.query.longitude);
    if (isNaN(req.query.longitude) || req.query.longitude < -180 || req.query.longitude > 180) {
      return res.status(400).json({
        success: false,
        error: 'Invalid longitude value'
      });
    }
  }

  if (req.query.maxDistance) {
    req.query.maxDistance = parseInt(req.query.maxDistance, 10);
    if (isNaN(req.query.maxDistance) || req.query.maxDistance < 0 || req.query.maxDistance > 100000) {
      return res.status(400).json({
        success: false,
        error: 'Invalid maxDistance value (must be 0-100000 meters)'
      });
    }
  }

  if (req.query.page) {
    req.query.page = parseInt(req.query.page, 10);
    if (isNaN(req.query.page) || req.query.page < 1) {
      req.query.page = 1;
    }
  }

  if (req.query.limit) {
    req.query.limit = parseInt(req.query.limit, 10);
    if (isNaN(req.query.limit) || req.query.limit < 1 || req.query.limit > 100) {
      req.query.limit = 20;
    }
  }

  next();
};

module.exports = {
  validate,
  sanitizeQuery
};
