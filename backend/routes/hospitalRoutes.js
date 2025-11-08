const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospitalController');
const { checkJwt } = require('../config/auth');
const { validate, sanitizeQuery } = require('../middleware/validation');
const { createLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Register a new hospital
router.post('/register',
  createLimiter,
  [
    body('name').notEmpty().trim().escape().withMessage('Hospital name is required'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('location.coordinates.*').isFloat().withMessage('Coordinates must be numbers'),
    body('contact.phone').notEmpty().trim().withMessage('Phone is required')
  ],
  validate,
  hospitalController.registerHospital
);

// Get all hospitals
router.get('/', apiLimiter, hospitalController.getAllHospitals);

// Get specific hospital
router.get('/:id', apiLimiter, hospitalController.getHospital);

// Update emergency department status
router.patch('/:id/ed-status',
  apiLimiter,
  [
    body('status').isIn(['OPEN', 'FULL', 'DIVERSION', 'CLOSED']).withMessage('Invalid status')
  ],
  validate,
  hospitalController.updateEDStatus
);

// Find nearby hospitals
router.get('/nearby/search', apiLimiter, sanitizeQuery, hospitalController.findNearbyHospitals);

module.exports = router;
