# ResQChain - Quick Reference

## 🚀 Quick Start

```bash
# 1. Clone repository
git clone https://github.com/sharma3008/ResQChain.git
cd ResQChain

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env with your Auth0 credentials

# 4. Start services
docker-compose up -d

# 5. Start development server
npm run dev

# 6. Test the API
curl http://localhost:3000/health
```

## 📦 Key Components

### Backend Services
- **Emergency Service** - Create and manage emergencies
- **AI Prediction Service** - Predict patient severity
- **Blockchain Service** - Store immutable records
- **Kafka Service** - Real-time event streaming

### Models
- **Emergency** - Emergency records with patient info
- **Responder** - Verified emergency responders
- **Ambulance** - Ambulance fleet management
- **Hospital** - Hospital capacity and status

## 🔥 Common Commands

```bash
# Development
npm run dev          # Start dev server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run lint         # Run ESLint

# Docker
docker-compose up -d              # Start all services
docker-compose logs -f app        # View logs
docker-compose down               # Stop services

# Database
mongodump --uri="mongodb://localhost:27017/resqchain"
mongorestore --uri="mongodb://localhost:27017/resqchain" ./backup
```

## 🔐 Auth0 Setup

1. Create account at https://auth0.com
2. Create API with identifier: `https://resqchain-api`
3. Create roles: `responder`, `ambulance`, `hospital`, `admin`
4. Add credentials to `.env`:
   ```
   AUTH0_DOMAIN=your-tenant.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-secret
   AUTH0_AUDIENCE=https://resqchain-api
   ```

## 📡 API Endpoints

### Emergency
- `POST /api/emergency` - Create emergency
- `GET /api/emergency/:id` - Get emergency
- `GET /api/emergency` - List emergencies
- `PATCH /api/emergency/:id/status` - Update status
- `POST /api/emergency/:id/assign-responder` - Assign responder
- `POST /api/emergency/:id/assign-ambulance` - Assign ambulance

### Responders
- `POST /api/responders/register` - Register responder
- `GET /api/responders/:id` - Get responder
- `PATCH /api/responders/:id/location` - Update location
- `PATCH /api/responders/:id/availability` - Update availability
- `GET /api/responders/nearby/search` - Find nearby

### Hospitals
- `POST /api/hospitals/register` - Register hospital
- `GET /api/hospitals` - List hospitals
- `GET /api/hospitals/:id` - Get hospital
- `PATCH /api/hospitals/:id/ed-status` - Update ED status
- `GET /api/hospitals/nearby/search` - Find nearby

### Ambulances
- `POST /api/ambulances/register` - Register ambulance
- `GET /api/ambulances/:id` - Get ambulance
- `PATCH /api/ambulances/:id/location` - Update location
- `PATCH /api/ambulances/:id/status` - Update status
- `GET /api/ambulances/nearby/search` - Find nearby

## 🤖 AI Severity Levels

| Level | Score | Wait Time | Description |
|-------|-------|-----------|-------------|
| CRITICAL | ≥ 0.8 | 0-5 min | Life-threatening |
| HIGH | ≥ 0.6 | 5-15 min | Urgent care needed |
| MEDIUM | ≥ 0.4 | 15-30 min | Timely attention |
| LOW | < 0.4 | 30-60 min | Can wait |

## ⚡ Kafka Topics

- `emergency-created` - New emergency reported
- `emergency-updated` - Status changed
- `responder-assigned` - Responder assigned
- `ambulance-dispatched` - Ambulance sent
- `patient-arrived` - Patient at hospital
- `severity-predicted` - AI prediction done

## 🔗 Blockchain Features

- Immutable emergency records
- Tamper-proof audit trail
- Cryptographic verification
- Multi-party transparency

## 📊 Monitoring

```bash
# View logs
tail -f logs/combined.log
tail -f logs/error.log

# Docker logs
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f kafka

# Health check
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### MongoDB not connecting
```bash
# Check MongoDB is running
docker ps | grep mongo
# or
systemctl status mongod
```

### Kafka errors
```bash
# Check Kafka is running
docker ps | grep kafka
# List topics
kafka-topics.sh --list --bootstrap-server localhost:9092
```

### Auth0 errors
- Verify credentials in .env
- Check JWT token format
- Ensure audience matches

## 📚 Documentation

- [README.md](README.md) - Project overview
- [docs/API_EXAMPLES.md](docs/API_EXAMPLES.md) - API usage
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System design
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) - Deployment guide

## 🔧 Environment Variables

Required variables in `.env`:
```
PORT=3000
NODE_ENV=development
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
MONGODB_URI=mongodb://localhost:27017/resqchain
KAFKA_BROKERS=localhost:9092
BLOCKCHAIN_RPC_URL=http://localhost:8545
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npx jest tests/aiPrediction.test.js
```

## 📈 Performance Tips

- Use geospatial indexes for location queries
- Enable MongoDB connection pooling
- Configure Kafka batch processing
- Cache AI predictions for similar cases
- Use CDN for frontend assets

## 🔒 Security Best Practices

- Always use HTTPS in production
- Enable Auth0 MFA
- Rotate secrets regularly
- Never commit .env files
- Use environment-specific configs
- Enable rate limiting
- Monitor for vulnerabilities

## 🌟 Key Features

✅ AI-powered severity prediction  
✅ Real-time event streaming with Kafka  
✅ Blockchain immutable records  
✅ Auth0 secure authentication  
✅ Geospatial responder/ambulance/hospital matching  
✅ MongoDB flexible data storage  
✅ Docker containerization  
✅ RESTful API design  
✅ Comprehensive logging  
✅ Test coverage  

## 🆘 Support

- GitHub Issues: https://github.com/sharma3008/ResQChain/issues
- Email: support@resqchain.com
- Documentation: /docs

---

**Built with ❤️ for saving lives**

When every second matters, ResQChain makes the difference.
