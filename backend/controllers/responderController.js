const Responder = require('../models/Responder');
const logger = require('../utils/logger');

exports.registerResponder = async (req, res) => {
  try {
    const { userId, profile, certifications } = req.body;

    const existingResponder = await Responder.findOne({ userId });
    if (existingResponder) {
      return res.status(400).json({
        success: false,
        error: 'Responder already registered'
      });
    }

    const responder = new Responder({
      userId,
      profile,
      certifications,
      verification: {
        status: 'PENDING'
      }
    });

    await responder.save();

    res.status(201).json({
      success: true,
      data: responder
    });
  } catch (error) {
    logger.error('Register responder error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getResponder = async (req, res) => {
  try {
    const responder = await Responder.findById(req.params.id)
      .populate('activeEmergency');

    if (!responder) {
      return res.status(404).json({
        success: false,
        error: 'Responder not found'
      });
    }

    res.json({
      success: true,
      data: responder
    });
  } catch (error) {
    logger.error('Get responder error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateResponderLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;

    const responder = await Responder.findById(req.params.id);
    if (!responder) {
      return res.status(404).json({
        success: false,
        error: 'Responder not found'
      });
    }

    responder.currentLocation = {
      type: 'Point',
      coordinates,
      lastUpdated: new Date()
    };

    await responder.save();

    res.json({
      success: true,
      data: responder
    });
  } catch (error) {
    logger.error('Update responder location error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateAvailability = async (req, res) => {
  try {
    const { status } = req.body;

    const responder = await Responder.findById(req.params.id);
    if (!responder) {
      return res.status(404).json({
        success: false,
        error: 'Responder not found'
      });
    }

    responder.availability = {
      status,
      lastStatusChange: new Date()
    };

    await responder.save();

    res.json({
      success: true,
      data: responder
    });
  } catch (error) {
    logger.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.findNearbyResponders = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    const responders = await Responder.find({
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      'availability.status': 'AVAILABLE',
      'verification.status': 'VERIFIED'
    });

    res.json({
      success: true,
      data: responders
    });
  } catch (error) {
    logger.error('Find nearby responders error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
