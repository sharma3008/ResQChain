const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ambulanceController = require('../controllers/ambulanceController');
const { checkJwt } = require('../config/auth');
const { validate, sanitizeQuery } = require('../middleware/validation');
const { createLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Register a new ambulance
router.post('/register',
  createLimiter,
  [
    body('vehicleId').notEmpty().trim().escape().withMessage('Vehicle ID is required'),
    body('licensePlate').notEmpty().trim().escape().withMessage('License plate is required'),
    body('type').isIn(['BASIC', 'ADVANCED', 'AIR', 'CRITICAL_CARE']).withMessage('Invalid type'),
    body('currentLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('currentLocation.coordinates.*').isFloat().withMessage('Coordinates must be numbers')
  ],
  validate,
  ambulanceController.registerAmbulance
);

// Get ambulance details
router.get('/:id', apiLimiter, ambulanceController.getAmbulance);

// Update ambulance location
router.patch('/:id/location',
  apiLimiter,
  [
    body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('coordinates.*').isFloat().withMessage('Coordinates must be numbers')
  ],
  validate,
  ambulanceController.updateAmbulanceLocation
);

// Update ambulance status
router.patch('/:id/status',
  apiLimiter,
  [
    body('status').isIn(['AVAILABLE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'AT_HOSPITAL', 'UNAVAILABLE'])
  ],
  validate,
  ambulanceController.updateAmbulanceStatus
);

// Find nearby ambulances
router.get('/nearby/search', apiLimiter, sanitizeQuery, ambulanceController.findNearbyAmbulances);

module.exports = router;
