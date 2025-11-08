const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  contact: {
    phone: { type: String, required: true },
    emergencyPhone: String,
    email: String,
    fax: String
  },
  type: {
    type: String,
    enum: ['GENERAL', 'TRAUMA_CENTER', 'PEDIATRIC', 'CARDIAC', 'SPECIALTY'],
    default: 'GENERAL'
  },
  traumaLevel: {
    type: String,
    enum: ['LEVEL_1', 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'NONE'],
    default: 'NONE'
  },
  departments: [{
    name: String,
    status: {
      type: String,
      enum: ['OPEN', 'FULL', 'CLOSED'],
      default: 'OPEN'
    },
    capacity: Number,
    currentOccupancy: Number
  }],
  emergencyDepartment: {
    status: {
      type: String,
      enum: ['OPEN', 'FULL', 'DIVERSION', 'CLOSED'],
      default: 'OPEN'
    },
    waitTime: Number,
    capacity: Number,
    currentPatients: Number,
    availableBeds: Number
  },
  specialties: [String],
  facilities: [String],
  acceptedInsurance: [String],
  stats: {
    totalAdmissions: { type: Number, default: 0 },
    averageWaitTime: Number,
    rating: { type: Number, default: 0 }
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

hospitalSchema.index({ 'location.coordinates': '2dsphere' });
hospitalSchema.index({ 'emergencyDepartment.status': 1 });
hospitalSchema.index({ traumaLevel: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
