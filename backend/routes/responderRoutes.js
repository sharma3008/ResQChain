const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const responderController = require('../controllers/responderController');
const { checkJwt } = require('../config/auth');
const { validate, sanitizeQuery } = require('../middleware/validation');
const { createLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Register a new responder
router.post('/register',
  createLimiter,
  [
    body('userId').notEmpty().trim().escape().withMessage('User ID is required'),
    body('profile.name').notEmpty().trim().escape().withMessage('Name is required'),
    body('profile.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('profile.phone').notEmpty().trim().withMessage('Phone is required')
  ],
  validate,
  responderController.registerResponder
);

// Get responder details
router.get('/:id', apiLimiter, responderController.getResponder);

// Update responder location
router.patch('/:id/location',
  apiLimiter,
  [
    body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('coordinates.*').isFloat().withMessage('Coordinates must be numbers')
  ],
  validate,
  responderController.updateResponderLocation
);

// Update availability status
router.patch('/:id/availability',
  apiLimiter,
  [
    body('status').isIn(['AVAILABLE', 'BUSY', 'OFFLINE']).withMessage('Invalid status')
  ],
  validate,
  responderController.updateAvailability
);

// Find nearby responders
router.get('/nearby/search', apiLimiter, sanitizeQuery, responderController.findNearbyResponders);

module.exports = router;
