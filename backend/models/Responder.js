const mongoose = require('mongoose');

const responderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  profile: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    photo: String
  },
  verification: {
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING'
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }],
    verifiedAt: Date,
    verifiedBy: String
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    expiryDate: Date,
    documentUrl: String
  }],
  specializations: [String],
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    lastUpdated: Date
  },
  availability: {
    status: {
      type: String,
      enum: ['AVAILABLE', 'BUSY', 'OFFLINE'],
      default: 'OFFLINE'
    },
    lastStatusChange: Date
  },
  stats: {
    totalEmergencies: { type: Number, default: 0 },
    completedEmergencies: { type: Number, default: 0 },
    averageResponseTime: Number,
    rating: { type: Number, default: 0 },
    reviews: Number
  },
  activeEmergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  }
}, {
  timestamps: true
});

responderSchema.index({ 'currentLocation.coordinates': '2dsphere' });
responderSchema.index({ 'availability.status': 1 });
responderSchema.index({ 'verification.status': 1 });

module.exports = mongoose.model('Responder', responderSchema);
