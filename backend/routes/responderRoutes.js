const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const responderController = require('../controllers/responderController');
const { checkJwt } = require('../config/auth');

// Register a new responder
router.post('/register',
  [
    body('userId').notEmpty().withMessage('User ID is required'),
    body('profile.name').notEmpty().withMessage('Name is required'),
    body('profile.email').isEmail().withMessage('Valid email is required'),
    body('profile.phone').notEmpty().withMessage('Phone is required')
  ],
  responderController.registerResponder
);

// Get responder details
router.get('/:id', responderController.getResponder);

// Update responder location
router.patch('/:id/location',
  [
    body('coordinates').isArray({ min: 2, max: 2 }).withMessage('Valid coordinates required')
  ],
  responderController.updateResponderLocation
);

// Update availability status
router.patch('/:id/availability',
  [
    body('status').isIn(['AVAILABLE', 'BUSY', 'OFFLINE']).withMessage('Invalid status')
  ],
  responderController.updateAvailability
);

// Find nearby responders
router.get('/nearby/search', responderController.findNearbyResponders);

module.exports = router;
