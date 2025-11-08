const Emergency = require('../models/Emergency');
const aiPredictionService = require('../services/aiPredictionService');
const blockchainService = require('../services/blockchainService');
const kafkaService = require('../services/kafkaService');
const logger = require('../utils/logger');

exports.createEmergency = async (req, res) => {
  try {
    const { patientInfo, location, symptoms, vitals } = req.body;

    // AI-based severity prediction
    const aiPrediction = await aiPredictionService.predictSeverity({
      symptoms,
      vitals,
      age: patientInfo.age,
      medicalHistory: patientInfo.medicalHistory,
      currentMedication: patientInfo.currentMedication
    });

    // Create emergency record
    const emergency = new Emergency({
      patientInfo,
      location,
      symptoms,
      vitals,
      severity: aiPrediction.severity,
      severityScore: aiPrediction.severityScore,
      aiPrediction,
      createdBy: {
        userId: req.auth?.sub || 'anonymous',
        userType: req.body.userType || 'public'
      },
      timeline: [{
        event: 'Emergency Created',
        timestamp: new Date(),
        details: { aiPrediction }
      }]
    });

    await emergency.save();

    // Store on blockchain
    const blockchainRecord = await blockchainService.storeEmergencyRecord(emergency);
    emergency.blockchainRecordHash = blockchainRecord.hash;
    await emergency.save();

    // Publish to Kafka
    await kafkaService.publishEmergencyCreated({
      emergencyId: emergency._id,
      severity: emergency.severity,
      location: emergency.location,
      aiPrediction
    });

    await kafkaService.publishSeverityPredicted({
      emergencyId: emergency._id,
      ...aiPrediction
    });

    logger.info('Emergency created:', emergency._id);

    res.status(201).json({
      success: true,
      data: emergency,
      blockchainHash: blockchainRecord.hash
    });
  } catch (error) {
    logger.error('Create emergency error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getEmergency = async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id)
      .populate('assignedResponder')
      .populate('assignedAmbulance')
      .populate('destinationHospital');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    logger.error('Get emergency error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllEmergencies = async (req, res) => {
  try {
    const {
      status,
      severity,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const emergencies = await Emergency.find(query)
      .populate('assignedResponder')
      .populate('assignedAmbulance')
      .populate('destinationHospital')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Emergency.countDocuments(query);

    res.json({
      success: true,
      data: emergencies,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get emergencies error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.updateEmergencyStatus = async (req, res) => {
  try {
    const { status, details } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.status = status;
    emergency.timeline.push({
      event: `Status changed to ${status}`,
      timestamp: new Date(),
      details
    });

    await emergency.save();

    // Update blockchain
    await blockchainService.updateEmergencyRecord(emergency._id, { status });

    // Publish to Kafka
    await kafkaService.publishEmergencyUpdated({
      emergencyId: emergency._id,
      status,
      details
    });

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    logger.error('Update emergency status error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.assignResponder = async (req, res) => {
  try {
    const { responderId } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.assignedResponder = responderId;
    emergency.status = 'ASSIGNED';
    emergency.timeline.push({
      event: 'Responder Assigned',
      timestamp: new Date(),
      details: { responderId }
    });

    await emergency.save();

    // Publish to Kafka
    await kafkaService.publishResponderAssigned({
      emergencyId: emergency._id,
      responderId
    });

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    logger.error('Assign responder error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.assignAmbulance = async (req, res) => {
  try {
    const { ambulanceId } = req.body;

    const emergency = await Emergency.findById(req.params.id);
    if (!emergency) {
      return res.status(404).json({
        success: false,
        error: 'Emergency not found'
      });
    }

    emergency.assignedAmbulance = ambulanceId;
    emergency.timeline.push({
      event: 'Ambulance Assigned',
      timestamp: new Date(),
      details: { ambulanceId }
    });

    await emergency.save();

    // Publish to Kafka
    await kafkaService.publishAmbulanceDispatched({
      emergencyId: emergency._id,
      ambulanceId
    });

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    logger.error('Assign ambulance error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
