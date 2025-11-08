const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter rate limiter for create operations
const createLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 create requests per minute
  message: 'Too many create requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Very permissive limiter for emergency creation (life-critical)
const emergencyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Allow more emergency reports
  message: 'Too many emergency requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Auth-related limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit auth attempts
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  apiLimiter,
  createLimiter,
  emergencyLimiter,
  authLimiter
};
