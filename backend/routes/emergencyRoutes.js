const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const emergencyController = require('../controllers/emergencyController');
const { checkJwt } = require('../config/auth');

// Create a new emergency (can be public or authenticated)
router.post('/',
  [
    body('patientInfo.name').notEmpty().withMessage('Patient name is required'),
    body('patientInfo.age').isNumeric().withMessage('Patient age must be a number'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('symptoms').isArray().withMessage('Symptoms must be an array')
  ],
  emergencyController.createEmergency
);

// Get all emergencies (requires authentication)
router.get('/', emergencyController.getAllEmergencies);

// Get specific emergency
router.get('/:id', emergencyController.getEmergency);

// Update emergency status (requires authentication)
router.patch('/:id/status',
  [
    body('status').isIn(['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED', 'CANCELLED'])
  ],
  emergencyController.updateEmergencyStatus
);

// Assign responder to emergency (requires authentication)
router.post('/:id/assign-responder',
  [
    body('responderId').notEmpty().withMessage('Responder ID is required')
  ],
  emergencyController.assignResponder
);

// Assign ambulance to emergency (requires authentication)
router.post('/:id/assign-ambulance',
  [
    body('ambulanceId').notEmpty().withMessage('Ambulance ID is required')
  ],
  emergencyController.assignAmbulance
);

module.exports = router;
