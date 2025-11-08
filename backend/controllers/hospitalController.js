const Hospital = require('../models/Hospital');
const logger = require('../utils/logger');

exports.registerHospital = async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();

    res.status(201).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    logger.error('Register hospital error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        error: 'Hospital not found'
      });
    }

    res.json({
      success: true,
      data: hospital
    });
  } catch (error) {
    logger.error('Get hospital error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const { type, traumaLevel } = req.query;

    const query = {};
    if (type) query.type = type;
    if (traumaLevel) query.traumaLevel = traumaLevel;

    const hospitals = await Hospital.find(query);

    res.json({
      success: true,
      data: hospitals
    });
  } catch (error) {
    logger.error('Get hospitals error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateEDStatus = async (req, res) => {
  try {
    const { status, waitTime, currentPatients, availableBeds } = req.body;

    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        error: 'Hospital not found'
      });
    }

    hospital.emergencyDepartment = {
      ...hospital.emergencyDepartment,
      status,
      waitTime,
      currentPatients,
      availableBeds
    };

    await hospital.save();

    res.json({
      success: true,
      data: hospital
    });
  } catch (error) {
    logger.error('Update ED status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.findNearbyHospitals = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000, severity } = req.query;

    const query = {
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      'emergencyDepartment.status': { $in: ['OPEN', 'FULL'] }
    };

    // For critical cases, prioritize trauma centers
    if (severity === 'CRITICAL' || severity === 'HIGH') {
      query.traumaLevel = { $in: ['LEVEL_1', 'LEVEL_2'] };
    }

    const hospitals = await Hospital.find(query).limit(10);

    res.json({
      success: true,
      data: hospitals
    });
  } catch (error) {
    logger.error('Find nearby hospitals error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
