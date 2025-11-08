const logger = require('../utils/logger');

class AIPredictionService {
  constructor() {
    // Features for severity prediction
    this.severityLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    
    // Symptom weights (simplified model)
    this.symptomWeights = {
      'chest_pain': 0.9,
      'difficulty_breathing': 0.85,
      'unconscious': 1.0,
      'severe_bleeding': 0.95,
      'head_injury': 0.8,
      'stroke_symptoms': 0.95,
      'allergic_reaction': 0.75,
      'burn': 0.7,
      'fracture': 0.6,
      'abdominal_pain': 0.65,
      'fever': 0.4,
      'nausea': 0.3,
      'minor_cut': 0.2
    };

    // Vital signs thresholds
    this.vitalThresholds = {
      heartRate: { min: 60, max: 100, critical: { min: 40, max: 140 } },
      bloodPressure: { systolic: { min: 90, max: 120, critical: { min: 70, max: 180 } } },
      oxygenLevel: { min: 95, critical: 88 },
      temperature: { min: 36.5, max: 37.5, critical: { min: 35, max: 39.5 } }
    };
  }

  async predictSeverity(patientData) {
    try {
      const {
        symptoms = [],
        vitals = {},
        age = 30,
        medicalHistory = []
      } = patientData;

      let severityScore = 0;

      // Analyze symptoms
      const symptomScore = this.analyzeSymptoms(symptoms);
      severityScore += symptomScore * 0.4;

      // Analyze vitals
      const vitalScore = this.analyzeVitals(vitals);
      severityScore += vitalScore * 0.35;

      // Age factor
      const ageScore = this.analyzeAge(age);
      severityScore += ageScore * 0.15;

      // Medical history factor
      const historyScore = this.analyzeMedicalHistory(medicalHistory);
      severityScore += historyScore * 0.1;

      // Determine severity level
      let severity, confidence;
      if (severityScore >= 0.8) {
        severity = 'CRITICAL';
        confidence = 0.95;
      } else if (severityScore >= 0.6) {
        severity = 'HIGH';
        confidence = 0.88;
      } else if (severityScore >= 0.4) {
        severity = 'MEDIUM';
        confidence = 0.82;
      } else {
        severity = 'LOW';
        confidence = 0.75;
      }

      const prediction = {
        severity,
        confidence,
        severityScore,
        recommendedActions: this.getRecommendedActions(severity),
        estimatedWaitTime: this.estimateWaitTime(severity),
        urgencyLevel: this.getUrgencyLevel(severity)
      };

      logger.info('AI Severity Prediction:', prediction);
      return prediction;
    } catch (error) {
      logger.error('AI Prediction error:', error);
      throw error;
    }
  }

  analyzeSymptoms(symptoms) {
    if (!symptoms || symptoms.length === 0) return 0.3;

    let maxWeight = 0;
    symptoms.forEach(symptom => {
      const weight = this.symptomWeights[symptom.toLowerCase().replace(/ /g, '_')] || 0.3;
      if (weight > maxWeight) maxWeight = weight;
    });

    return maxWeight;
  }

  analyzeVitals(vitals) {
    if (!vitals || Object.keys(vitals).length === 0) return 0.5;

    let score = 0;
    let count = 0;

    // Heart rate
    if (vitals.heartRate) {
      const hr = vitals.heartRate;
      if (hr < this.vitalThresholds.heartRate.critical.min || 
          hr > this.vitalThresholds.heartRate.critical.max) {
        score += 1.0;
      } else if (hr < this.vitalThresholds.heartRate.min || 
                 hr > this.vitalThresholds.heartRate.max) {
        score += 0.6;
      } else {
        score += 0.2;
      }
      count++;
    }

    // Oxygen level
    if (vitals.oxygenLevel) {
      const o2 = vitals.oxygenLevel;
      if (o2 < this.vitalThresholds.oxygenLevel.critical) {
        score += 1.0;
      } else if (o2 < this.vitalThresholds.oxygenLevel.min) {
        score += 0.7;
      } else {
        score += 0.2;
      }
      count++;
    }

    // Blood pressure
    if (vitals.bloodPressureSystolic) {
      const bp = vitals.bloodPressureSystolic;
      if (bp < this.vitalThresholds.bloodPressure.systolic.critical.min || 
          bp > this.vitalThresholds.bloodPressure.systolic.critical.max) {
        score += 1.0;
      } else if (bp < this.vitalThresholds.bloodPressure.systolic.min || 
                 bp > this.vitalThresholds.bloodPressure.systolic.max) {
        score += 0.6;
      } else {
        score += 0.2;
      }
      count++;
    }

    return count > 0 ? score / count : 0.5;
  }

  analyzeAge(age) {
    if (age < 1) return 0.8;
    if (age > 65) return 0.7;
    if (age < 5) return 0.6;
    if (age > 50) return 0.5;
    return 0.3;
  }

  analyzeMedicalHistory(history) {
    if (!history || history.length === 0) return 0.3;
    
    const criticalConditions = ['heart_disease', 'diabetes', 'asthma', 'cancer', 'stroke'];
    const hasCriticalCondition = history.some(condition => 
      criticalConditions.includes(condition.toLowerCase().replace(/ /g, '_'))
    );
    
    return hasCriticalCondition ? 0.7 : 0.4;
  }

  getRecommendedActions(severity) {
    const actions = {
      CRITICAL: [
        'Immediate ambulance dispatch required',
        'Alert nearest trauma center',
        'Prepare for life-saving interventions',
        'Assign highest priority responders'
      ],
      HIGH: [
        'Rapid ambulance dispatch',
        'Alert emergency department',
        'Advanced life support may be needed',
        'Prioritize in queue'
      ],
      MEDIUM: [
        'Standard ambulance dispatch',
        'Notify emergency department',
        'Basic life support equipment',
        'Normal priority processing'
      ],
      LOW: [
        'Non-emergency transport acceptable',
        'Standard processing',
        'First aid sufficient',
        'Lower priority assignment'
      ]
    };

    return actions[severity] || actions.MEDIUM;
  }

  estimateWaitTime(severity) {
    const waitTimes = {
      CRITICAL: '0-5 minutes',
      HIGH: '5-15 minutes',
      MEDIUM: '15-30 minutes',
      LOW: '30-60 minutes'
    };

    return waitTimes[severity] || waitTimes.MEDIUM;
  }

  getUrgencyLevel(severity) {
    const urgency = {
      CRITICAL: 1,
      HIGH: 2,
      MEDIUM: 3,
      LOW: 4
    };

    return urgency[severity] || 3;
  }

  async analyzePatientRisk(patientData) {
    try {
      const prediction = await this.predictSeverity(patientData);
      
      const riskFactors = [];
      
      if (patientData.age && (patientData.age < 1 || patientData.age > 65)) {
        riskFactors.push('Age-related risk');
      }
      
      if (patientData.medicalHistory && patientData.medicalHistory.length > 0) {
        riskFactors.push('Pre-existing conditions');
      }
      
      if (prediction.severityScore >= 0.7) {
        riskFactors.push('High severity indicators');
      }

      return {
        ...prediction,
        riskFactors,
        requiresSpecializedCare: prediction.severity === 'CRITICAL' || prediction.severity === 'HIGH'
      };
    } catch (error) {
      logger.error('Risk analysis error:', error);
      throw error;
    }
  }
}

module.exports = new AIPredictionService();
