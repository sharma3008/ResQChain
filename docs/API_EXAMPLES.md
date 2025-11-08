# ResQChain API Examples

This document provides practical examples for using the ResQChain API.

## Authentication

Most endpoints require authentication using Auth0 JWT tokens. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Emergency Flow Examples

### 1. Report a New Emergency

```bash
curl -X POST http://localhost:3000/api/emergency \
  -H "Content-Type: application/json" \
  -d '{
    "patientInfo": {
      "name": "John Doe",
      "age": 55,
      "gender": "male",
      "bloodType": "O+",
      "allergies": ["penicillin"],
      "medicalHistory": ["hypertension", "diabetes"],
      "currentMedication": ["metformin", "lisinopril"]
    },
    "location": {
      "coordinates": [-74.0060, 40.7128],
      "address": "123 Main St, New York, NY 10001"
    },
    "symptoms": ["chest_pain", "difficulty_breathing", "nausea"],
    "vitals": {
      "heartRate": 110,
      "bloodPressureSystolic": 150,
      "bloodPressureDiastolic": 95,
      "oxygenLevel": 91,
      "temperature": 37.8,
      "respiratoryRate": 22
    }
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "patientInfo": {...},
    "severity": "HIGH",
    "aiPrediction": {
      "severity": "HIGH",
      "confidence": 0.92,
      "severityScore": 0.78,
      "recommendedActions": [
        "Rapid ambulance dispatch",
        "Alert emergency department",
        "Advanced life support may be needed",
        "Prioritize in queue"
      ],
      "estimatedWaitTime": "5-15 minutes",
      "urgencyLevel": 2
    },
    "status": "PENDING",
    "blockchainRecordHash": "0x1234..."
  },
  "blockchainHash": "0x1234567890abcdef..."
}
```

### 2. Get Emergency Details

```bash
curl -X GET http://localhost:3000/api/emergency/64a1b2c3d4e5f6g7h8i9j0k1
```

### 3. Update Emergency Status

```bash
curl -X PATCH http://localhost:3000/api/emergency/64a1b2c3d4e5f6g7h8i9j0k1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_TRANSIT",
    "details": "Ambulance dispatched, ETA 8 minutes"
  }'
```

For complete examples, see the full documentation.
