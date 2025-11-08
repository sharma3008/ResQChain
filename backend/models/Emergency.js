const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  patientInfo: {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodType: String,
    allergies: [String],
    medicalHistory: [String],
    currentMedication: [String]
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: String
  },
  symptoms: [String],
  vitals: {
    heartRate: Number,
    bloodPressureSystolic: Number,
    bloodPressureDiastolic: Number,
    oxygenLevel: Number,
    temperature: Number,
    respiratoryRate: Number
  },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  severityScore: Number,
  aiPrediction: {
    severity: String,
    confidence: Number,
    severityScore: Number,
    recommendedActions: [String],
    estimatedWaitTime: String,
    urgencyLevel: Number
  },
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_TRANSIT', 'ARRIVED', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  assignedResponder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Responder'
  },
  assignedAmbulance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ambulance'
  },
  destinationHospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  },
  blockchainRecordHash: String,
  createdBy: {
    userId: String,
    userType: String
  },
  timeline: [{
    event: String,
    timestamp: { type: Date, default: Date.now },
    details: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Index for geospatial queries
emergencySchema.index({ 'location.coordinates': '2dsphere' });
emergencySchema.index({ status: 1, createdAt: -1 });
emergencySchema.index({ severity: 1 });

module.exports = mongoose.model('Emergency', emergencySchema);
