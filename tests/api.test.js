const request = require('supertest');
const mongoose = require('mongoose');

// Mock database connection
jest.mock('../backend/config/database', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true)
}));

// Mock Kafka service
jest.mock('../backend/services/kafkaService', () => ({
  connect: jest.fn().mockResolvedValue(true),
  disconnect: jest.fn().mockResolvedValue(true),
  publishEmergencyCreated: jest.fn().mockResolvedValue(true),
  publishEmergencyUpdated: jest.fn().mockResolvedValue(true),
  publishSeverityPredicted: jest.fn().mockResolvedValue(true),
  publishResponderAssigned: jest.fn().mockResolvedValue(true),
  publishAmbulanceDispatched: jest.fn().mockResolvedValue(true)
}));

// Mock blockchain service
jest.mock('../backend/services/blockchainService', () => ({
  storeEmergencyRecord: jest.fn().mockResolvedValue({
    hash: '0xabc123',
    timestamp: Date.now(),
    recordId: '507f1f77bcf86cd799439011'
  }),
  updateEmergencyRecord: jest.fn().mockResolvedValue({
    hash: '0xdef456',
    timestamp: Date.now()
  })
}));

describe('API Integration Tests', () => {
  let app;

  beforeAll(() => {
    process.env.NODE_ENV = 'test';
    app = require('../backend/server');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Health Check', () => {
    test('GET /health should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('healthy');
      expect(response.body.service).toBe('ResQChain');
    });
  });
});
