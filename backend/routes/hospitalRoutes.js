const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const hospitalController = require('../controllers/hospitalController');
const { checkJwt } = require('../config/auth');

// Register a new hospital
router.post('/register',
  [
    body('name').notEmpty().withMessage('Hospital name is required'),
    body('location.coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required'),
    body('contact.phone').notEmpty().withMessage('Phone is required')
  ],
  hospitalController.registerHospital
);

// Get all hospitals
router.get('/', hospitalController.getAllHospitals);

// Get specific hospital
router.get('/:id', hospitalController.getHospital);

// Update emergency department status
router.patch('/:id/ed-status',
  [
    body('status').isIn(['OPEN', 'FULL', 'DIVERSION', 'CLOSED']).withMessage('Invalid status')
  ],
  hospitalController.updateEDStatus
);

// Find nearby hospitals
router.get('/nearby/search', hospitalController.findNearbyHospitals);

module.exports = router;
