# ResQChain

**AI-Powered Decentralized Emergency Data Exchange Platform**

ResQChain is an innovative emergency response platform that connects verified responders, ambulances, and hospitals through cutting-edge technology. The system uses AI to predict patient severity, Kafka for real-time data streaming, blockchain for immutable records, and Auth0 for secure identity management.

## 🚀 Features

### Core Capabilities
- **🔐 Secure Authentication** - Auth0-powered identity verification for all stakeholders
- **🤖 AI Severity Prediction** - Machine learning algorithms analyze patient data to predict emergency severity
- **⚡ Real-Time Data Streaming** - Kafka-based event streaming for instant updates across the platform
- **🔗 Blockchain Records** - Immutable, transparent emergency record storage
- **📍 Smart Geospatial Dispatching** - Find nearest available responders, ambulances, and hospitals
- **⏱️ Faster Triage** - AI-driven triage reduces decision time from minutes to seconds

### Key Benefits
- **Verified Responders** - Only certified medical professionals can respond to emergencies
- **Transparent Data Sharing** - Blockchain ensures all stakeholders have access to verified information
- **Trusted Coordination** - Real-time updates keep everyone synchronized
- **When Every Second Matters** - Optimized for speed and accuracy in critical situations

## 🏗️ Architecture

### Technology Stack

**Backend**
- Node.js & Express.js
- MongoDB (Database)
- Kafka (Real-time streaming)
- Web3 (Blockchain integration)
- Auth0 (Authentication)

**AI/ML**
- Custom severity prediction model
- Symptom analysis
- Vital signs evaluation
- Risk factor assessment

**Infrastructure**
- Docker & Docker Compose
- Ganache (Local blockchain)
- Zookeeper (Kafka coordination)

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB (or use Docker)

### Quick Start

1. **Clone the repository**
```bash
git clone https://github.com/sharma3008/ResQChain.git
cd ResQChain
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start with Docker Compose** (Recommended)
```bash
docker-compose up -d
```

This will start:
- ResQChain API server (port 3000)
- MongoDB (port 27017)
- Kafka (port 9092)
- Zookeeper (port 2181)
- Ganache blockchain (port 8545)

5. **Or start manually**
```bash
# Start MongoDB, Kafka, and Ganache separately
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Auth0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://your-api-identifier

# MongoDB
MONGODB_URI=mongodb://localhost:27017/resqchain

# Kafka
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=resqchain-client
KAFKA_GROUP_ID=resqchain-group

# Blockchain
BLOCKCHAIN_RPC_URL=http://localhost:8545
BLOCKCHAIN_PRIVATE_KEY=your-private-key
BLOCKCHAIN_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# AI Model
AI_MODEL_PATH=./models/severity_predictor.json
AI_CONFIDENCE_THRESHOLD=0.75
```

## 📚 API Documentation

### Emergency Endpoints

#### Create Emergency
```http
POST /api/emergency
Content-Type: application/json

{
  "patientInfo": {
    "name": "John Doe",
    "age": 45,
    "gender": "male",
    "medicalHistory": ["diabetes"],
    "allergies": ["penicillin"]
  },
  "location": {
    "coordinates": [-74.0060, 40.7128],
    "address": "New York, NY"
  },
  "symptoms": ["chest_pain", "difficulty_breathing"],
  "vitals": {
    "heartRate": 110,
    "bloodPressureSystolic": 140,
    "oxygenLevel": 92,
    "temperature": 37.2
  }
}
```

#### Get Emergency
```http
GET /api/emergency/:id
```

#### Update Emergency Status
```http
PATCH /api/emergency/:id/status
Content-Type: application/json

{
  "status": "IN_TRANSIT",
  "details": "Ambulance en route"
}
```

### Responder Endpoints

#### Register Responder
```http
POST /api/responders/register
Content-Type: application/json

{
  "userId": "auth0|123456",
  "profile": {
    "name": "Dr. Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890"
  },
  "certifications": [
    {
      "name": "EMT-Paramedic",
      "issuedBy": "National Registry",
      "issuedDate": "2020-01-01"
    }
  ]
}
```

#### Find Nearby Responders
```http
GET /api/responders/nearby/search?latitude=40.7128&longitude=-74.0060&maxDistance=5000
```

### Hospital Endpoints

#### Register Hospital
```http
POST /api/hospitals/register
Content-Type: application/json

{
  "name": "City General Hospital",
  "location": {
    "coordinates": [-74.0060, 40.7128],
    "address": {
      "street": "123 Medical Center Dr",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  },
  "contact": {
    "phone": "+1234567890",
    "emergencyPhone": "+1234567899"
  },
  "type": "TRAUMA_CENTER",
  "traumaLevel": "LEVEL_1"
}
```

#### Find Nearby Hospitals
```http
GET /api/hospitals/nearby/search?latitude=40.7128&longitude=-74.0060&severity=CRITICAL
```

### Ambulance Endpoints

#### Register Ambulance
```http
POST /api/ambulances/register
Content-Type: application/json

{
  "vehicleId": "AMB-001",
  "licensePlate": "NYC-911",
  "type": "ADVANCED",
  "currentLocation": {
    "coordinates": [-74.0060, 40.7128]
  },
  "equipment": [
    {
      "name": "Defibrillator",
      "quantity": 1,
      "status": "AVAILABLE"
    }
  ]
}
```

#### Find Nearby Ambulances
```http
GET /api/ambulances/nearby/search?latitude=40.7128&longitude=-74.0060&type=ADVANCED
```

## 🤖 AI Severity Prediction

The AI prediction service analyzes multiple factors:

### Input Features
- **Symptoms** - Weighted by severity (e.g., chest pain = 0.9, fever = 0.4)
- **Vital Signs** - Heart rate, blood pressure, oxygen level, temperature
- **Patient Age** - Higher risk for infants and elderly
- **Medical History** - Pre-existing conditions affect severity

### Severity Levels
- **CRITICAL** (Score ≥ 0.8) - Immediate life-threatening condition
- **HIGH** (Score ≥ 0.6) - Serious condition requiring urgent care
- **MEDIUM** (Score ≥ 0.4) - Moderate condition needing timely attention
- **LOW** (Score < 0.4) - Minor condition, can wait

### Output
```json
{
  "severity": "HIGH",
  "confidence": 0.88,
  "severityScore": 0.72,
  "recommendedActions": [
    "Rapid ambulance dispatch",
    "Alert emergency department",
    "Advanced life support may be needed",
    "Prioritize in queue"
  ],
  "estimatedWaitTime": "5-15 minutes",
  "urgencyLevel": 2
}
```

## 🔗 Blockchain Integration

### Record Storage
Every emergency is recorded on the blockchain with:
- Patient information hash
- Timestamp
- Severity level
- Treatment timeline
- Immutable audit trail

### Benefits
- **Transparency** - All authorized parties can verify records
- **Immutability** - Records cannot be altered or deleted
- **Trust** - Cryptographic verification ensures data integrity
- **Auditability** - Complete history of all changes

## ⚡ Kafka Event Streaming

### Event Topics
- `emergency-created` - New emergency reported
- `emergency-updated` - Emergency status changed
- `responder-assigned` - Responder assigned to emergency
- `ambulance-dispatched` - Ambulance sent to scene
- `patient-arrived` - Patient arrived at hospital
- `severity-predicted` - AI prediction completed

### Real-Time Updates
All stakeholders receive instant notifications through Kafka streams, ensuring coordinated response.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🔍 Linting

```bash
# Run ESLint
npm run lint
```

## 📱 Frontend

The frontend is a simple HTML interface demonstrating the emergency reporting flow:

1. Open `frontend/public/index.html` in a browser
2. Fill in patient information
3. Submit emergency
4. View AI-predicted severity and blockchain hash

## 🐳 Docker Deployment

### Build and Run
```bash
docker-compose up --build
```

### Access Services
- API Server: http://localhost:3000
- MongoDB: localhost:27017
- Kafka: localhost:9092
- Ganache Blockchain: http://localhost:8545

## 🛡️ Security

### Authentication
- Auth0 JWT verification on protected endpoints
- Role-based access control
- Verified responder credentials

### Data Protection
- HTTPS in production
- Encrypted data transmission
- Secure blockchain storage
- GDPR-compliant data handling

## 📊 Monitoring & Logging

- Winston logger for comprehensive logging
- Error tracking and debugging
- Performance monitoring
- Kafka consumer metrics

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support, email support@resqchain.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Auth0 for authentication services
- Kafka community for real-time streaming
- Ethereum/Web3 for blockchain technology
- MongoDB for database solutions

---

**Built with ❤️ for saving lives**

When every second matters, ResQChain makes the difference.
