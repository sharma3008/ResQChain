const aiPredictionService = require('../backend/services/aiPredictionService');

describe('AI Prediction Service', () => {
  describe('predictSeverity', () => {
    test('should predict CRITICAL for severe symptoms', async () => {
      const patientData = {
        symptoms: ['chest_pain', 'difficulty_breathing'],
        vitals: {
          heartRate: 150,
          oxygenLevel: 85,
          bloodPressureSystolic: 180
        },
        age: 65,
        medicalHistory: ['heart_disease']
      };

      const result = await aiPredictionService.predictSeverity(patientData);
      
      expect(result.severity).toBe('CRITICAL');
      expect(result.confidence).toBeGreaterThan(0.8);
      expect(result.recommendedActions).toBeDefined();
      expect(result.estimatedWaitTime).toBe('0-5 minutes');
    });

    test('should predict LOW for minor symptoms', async () => {
      const patientData = {
        symptoms: ['minor_cut', 'fever'],
        vitals: {
          heartRate: 75,
          oxygenLevel: 98,
          bloodPressureSystolic: 110
        },
        age: 25,
        medicalHistory: []
      };

      const result = await aiPredictionService.predictSeverity(patientData);
      
      expect(result.severity).toBe('LOW');
      expect(result.severityScore).toBeLessThan(0.4);
    });

    test('should handle missing vitals data', async () => {
      const patientData = {
        symptoms: ['headache'],
        age: 30
      };

      const result = await aiPredictionService.predictSeverity(patientData);
      
      expect(result).toBeDefined();
      expect(result.severity).toBeDefined();
      expect(result.confidence).toBeGreaterThan(0);
    });

    test('should consider age in risk assessment', async () => {
      const elderlyPatient = {
        symptoms: ['fever'],
        vitals: { heartRate: 85 },
        age: 75
      };

      const youngPatient = {
        symptoms: ['fever'],
        vitals: { heartRate: 85 },
        age: 25
      };

      const elderlyResult = await aiPredictionService.predictSeverity(elderlyPatient);
      const youngResult = await aiPredictionService.predictSeverity(youngPatient);
      
      expect(elderlyResult.severityScore).toBeGreaterThan(youngResult.severityScore);
    });
  });

  describe('analyzePatientRisk', () => {
    test('should identify high-risk patients', async () => {
      const patientData = {
        symptoms: ['chest_pain'],
        vitals: { heartRate: 140 },
        age: 70,
        medicalHistory: ['heart_disease', 'diabetes']
      };

      const result = await aiPredictionService.analyzePatientRisk(patientData);
      
      expect(result.riskFactors).toBeDefined();
      expect(result.riskFactors.length).toBeGreaterThan(0);
      expect(result.requiresSpecializedCare).toBe(true);
    });
  });
});
