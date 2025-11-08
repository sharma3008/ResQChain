const blockchainService = require('../backend/services/blockchainService');

describe('Blockchain Service', () => {
  beforeAll(async () => {
    await blockchainService.connect();
  });

  describe('storeEmergencyRecord', () => {
    test('should store emergency record and return hash', async () => {
      const emergencyData = {
        _id: '507f1f77bcf86cd799439011',
        patientInfo: {
          name: 'Test Patient',
          age: 45
        },
        location: {
          coordinates: [-74.0060, 40.7128]
        },
        severity: 'HIGH',
        status: 'PENDING'
      };

      const result = await blockchainService.storeEmergencyRecord(emergencyData);
      
      expect(result).toBeDefined();
      expect(result.hash).toBeDefined();
      expect(result.recordId).toBe(emergencyData._id.toString());
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('updateEmergencyRecord', () => {
    test('should update record and return new hash', async () => {
      const emergencyId = '507f1f77bcf86cd799439011';
      const updates = { status: 'COMPLETED' };

      const result = await blockchainService.updateEmergencyRecord(emergencyId, updates);
      
      expect(result).toBeDefined();
      expect(result.hash).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('verifyRecord', () => {
    test('should verify valid record hash', async () => {
      const hash = '0x1234567890abcdef';
      
      const result = await blockchainService.verifyRecord(hash);
      
      expect(result).toBe(true);
    });
  });

  describe('getBlockNumber', () => {
    test('should return current block number', async () => {
      const blockNumber = await blockchainService.getBlockNumber();
      
      expect(blockNumber).toBeDefined();
      expect(typeof blockNumber).toBe('bigint');
    });
  });
});
