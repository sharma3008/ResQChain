const Ambulance = require('../models/Ambulance');
const logger = require('../utils/logger');

exports.registerAmbulance = async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body);
    await ambulance.save();

    res.status(201).json({
      success: true,
      data: ambulance
    });
  } catch (error) {
    logger.error('Register ambulance error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAmbulance = async (req, res) => {
  try {
    const ambulance = await Ambulance.findById(req.params.id)
      .populate('assignedEmergency');

    if (!ambulance) {
      return res.status(404).json({
        success: false,
        error: 'Ambulance not found'
      });
    }

    res.json({
      success: true,
      data: ambulance
    });
  } catch (error) {
    logger.error('Get ambulance error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateAmbulanceLocation = async (req, res) => {
  try {
    const { coordinates } = req.body;

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        error: 'Ambulance not found'
      });
    }

    ambulance.currentLocation = {
      type: 'Point',
      coordinates,
      lastUpdated: new Date()
    };

    await ambulance.save();

    res.json({
      success: true,
      data: ambulance
    });
  } catch (error) {
    logger.error('Update ambulance location error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateAmbulanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ambulance = await Ambulance.findById(req.params.id);
    if (!ambulance) {
      return res.status(404).json({
        success: false,
        error: 'Ambulance not found'
      });
    }

    ambulance.status = status;
    await ambulance.save();

    res.json({
      success: true,
      data: ambulance
    });
  } catch (error) {
    logger.error('Update ambulance status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.findNearbyAmbulances = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 20000, type } = req.query;

    const query = {
      'currentLocation.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'AVAILABLE'
    };

    if (type) {
      query.type = type;
    }

    const ambulances = await Ambulance.find(query).limit(10);

    res.json({
      success: true,
      data: ambulances
    });
  } catch (error) {
    logger.error('Find nearby ambulances error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
