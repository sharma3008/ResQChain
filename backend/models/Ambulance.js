const mongoose = require('mongoose');

const ambulanceSchema = new mongoose.Schema({
  vehicleId: {
    type: String,
    required: true,
    unique: true
  },
  licensePlate: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['BASIC', 'ADVANCED', 'AIR', 'CRITICAL_CARE'],
    required: true
  },
  equipment: [{
    name: String,
    quantity: Number,
    status: {
      type: String,
      enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE']
    }
  }],
  crew: [{
    memberId: String,
    name: String,
    role: String,
    certifications: [String]
  }],
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: {
      type: [Number],
      required: true,
      index: '2dsphere'
    },
    lastUpdated: Date
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'DISPATCHED', 'EN_ROUTE', 'ON_SCENE', 'TRANSPORTING', 'AT_HOSPITAL', 'UNAVAILABLE'],
    default: 'AVAILABLE'
  },
  baseStation: {
    name: String,
    location: {
      type: { type: String, default: 'Point' },
      coordinates: [Number]
    }
  },
  assignedEmergency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Emergency'
  },
  stats: {
    totalDispatches: { type: Number, default: 0 },
    averageResponseTime: Number,
    totalDistance: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

ambulanceSchema.index({ 'currentLocation.coordinates': '2dsphere' });
ambulanceSchema.index({ status: 1 });
ambulanceSchema.index({ type: 1 });

module.exports = mongoose.model('Ambulance', ambulanceSchema);
