const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emergencyController = require('../controllers/emergencyController');
const { checkJwt } = require('../config/auth');
const { validate } = require('../middleware/validation');
const { emergencyLimiter, apiLimiter } = require('../middleware/rateLimiter');

// Create a new emergency (can be public or authenticated)
router.post('/',
  emergencyLimiter,
  [
    body('patientInfo.name').notEmpty().trim().escape().withMessage('Patient name is required'),
    body('patientInfo.age').isInt({ min: 0, max: 150 }).withMessage('Patient age must be a valid number'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('location.coordinates.*').isFloat().withMessage('Coordinates must be numbers'),
    body('symptoms').isArray().withMessage('Symptoms must be an array')
  ],
  validate,
  emergencyController.createEmergency
);

// Get all emergencies (requires authentication)
router.get('/', apiLimiter, emergencyController.getAllEmergencies);

// Get specific emergency
router.get('/:id', apiLimiter, emergencyController.getEmergency);

// Update emergency status (requires authentication)
router.patch('/:id/status',
  apiLimiter,
  [
    body('status').isIn(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED', 'CANCELLED'])
  ],
  validate,
  emergencyController.updateEmergencyStatus
);

// Assign responder to emergency (requires authentication)
router.post('/:id/assign-responder',
  apiLimiter,
  [
    body('responderId').notEmpty().isMongoId().withMessage('Valid responder ID is required')
  ],
  validate,
  emergencyController.assignResponder
);

// Assign ambulance to emergency (requires authentication)
router.post('/:id/assign-ambulance',
  apiLimiter,
  [
    body('ambulanceId').notEmpty().isMongoId().withMessage('Valid ambulance ID is required')
  ],
  validate,
  emergencyController.assignAmbulance
);

module.exports = router;
