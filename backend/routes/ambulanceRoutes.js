const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ambulanceController = require('../controllers/ambulanceController');
const { checkJwt } = require('../config/auth');

// Register a new ambulance
router.post('/register',
  [
    body('vehicleId').notEmpty().withMessage('Vehicle ID is required'),
    body('licensePlate').notEmpty().withMessage('License plate is required'),
    body('type').isIn(['BASIC', 'ADVANCED', 'AIR', 'CRITICAL_CARE']).withMessage('Invalid type'),
    body('currentLocation.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required')
  ],
  ambulanceController.registerAmbulance
);

// Get ambulance details
router.get('/:id', ambulanceController.getAmbulance);

// Update ambulance location
router.patch('/:id/location',
  [
    body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required')
  ],
  ambulanceController.updateAmbulanceLocation
);

// Update ambulance status
router.patch('/:id/status',
  [
    body('status').isIn(['AVAILABLE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'AT_HOSPITAL', 'UNAVAILABLE'])
  ],
  ambulanceController.updateAmbulanceStatus
);

// Find nearby ambulances
router.get('/nearby/search', ambulanceController.findNearbyAmbulances);

module.exports = router;
